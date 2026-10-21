#!/usr/bin/env node
// Weekly data monitor. Node 20+, no dependencies.
// 1. Re-queries FDIC BankFind for every bank CERT in data/apps.json and compares ACTIVE + NAME.
// 2. Fetches every disclosure URL, extracts deposit-insurance-related sentences, stores the text and its sha256
//    under monitor/snapshots/, and compares the hash with the previous run.
// Writes monitor/report.json. Never exits non-zero for fetch failures; they are recorded in the report.
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/apps.json'), 'utf8'));
const SNAP_DIR = path.join(ROOT, 'monitor/snapshots');
const INDEX_FILE = path.join(SNAP_DIR, 'index.json');
const REPORT_FILE = path.join(ROOT, 'monitor/report.json');
const UA = 'Mozilla/5.0 (compatible; FintechFDICCheckMonitor/1.0; +https://github.com/)';
const TIMEOUT_MS = 30_000;

fs.mkdirSync(SNAP_DIR, { recursive: true });
const prevIndex = fs.existsSync(INDEX_FILE) ? JSON.parse(fs.readFileSync(INDEX_FILE, 'utf8')) : {};

async function get(url, accept) {
  const res = await fetch(url, {
    headers: { 'user-agent': UA, accept, 'accept-language': 'en-US,en;q=0.9' },
    redirect: 'follow',
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  return { status: res.status, ok: res.ok, finalUrl: res.url, body: await res.text() };
}

const decode = (s) =>
  s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&(#39|#x27|rsquo|lsquo);/g, "'")
    .replace(/&(quot|ldquo|rdquo);/g, '"').replace(/&reg;/g, '®').replace(/&trade;/g, '™');

/** HTML -> plain text -> only sentences relevant to deposit insurance, de-duplicated and sorted for stable hashing. */
export function normalize(html) {
  const text = decode(
    html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ').replace(/<[^>]+>/g, ' '),
  ).replace(/\s+/g, ' ').trim();
  const relevant = /FDIC|Member FDIC|pass-through|Program Bank|sweep|insur|Bank, N\.A\.|National Association|\bBank\b/i;
  const sentences = text.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter((s) => s.length > 20 && s.length < 2000 && relevant.test(s));
  return [...new Set(sentences)].sort().join('\n');
}

const sha256 = (s) => createHash('sha256').update(s).digest('hex');
const slugFor = (url) => url.replace(/^https?:\/\//, '').replace(/[^a-z0-9]+/gi, '_').replace(/^_|_$/g, '').slice(0, 120);

async function checkBanks() {
  const out = [];
  for (const bank of Object.values(DATA.banks)) {
    const url = `https://api.fdic.gov/banks/institutions?filters=${encodeURIComponent(`CERT:${bank.cert}`)}&fields=NAME,CERT,ACTIVE,CITY,STNAME`;
    const entry = { cert: bank.cert, expectedName: bank.name, expectedActive: bank.active, url };
    try {
      const r = await get(url, 'application/json');
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const rec = JSON.parse(r.body).data?.[0]?.data;
      if (!rec) {
        Object.assign(entry, { status: 'not_found', mismatch: true });
      } else {
        const active = rec.ACTIVE === 1;
        const nameMatch = rec.NAME === bank.name;
        Object.assign(entry, {
          status: 'ok', actualName: rec.NAME, actualActive: active, city: rec.CITY, state: rec.STNAME,
          nameMatch, activeMatch: active === bank.active, mismatch: !nameMatch || active !== bank.active,
        });
      }
    } catch (e) {
      Object.assign(entry, { status: 'fetch_error', error: String(e.message || e), mismatch: false });
    }
    out.push(entry);
  }
  return out;
}

async function checkDisclosures() {
  const urls = [...new Set(DATA.apps.flatMap((a) => a.disclosureUrls.map((u) => JSON.stringify([a.slug, u]))))].map((s) => JSON.parse(s));
  const out = [];
  const newIndex = { ...prevIndex };
  for (const [slug, url] of urls) {
    const key = `${slug}__${slugFor(url)}`;
    const prev = prevIndex[key];
    const entry = { app: slug, url, key, previousHash: prev?.sha256 ?? null };
    try {
      const r = await get(url, 'text/html,application/xhtml+xml,*/*');
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const text = normalize(r.body);
      if (!text) throw new Error('no relevant text extracted (page may require JavaScript)');
      const hash = sha256(text);
      fs.writeFileSync(path.join(SNAP_DIR, `${key}.txt`), text + '\n');
      newIndex[key] = { app: slug, url, finalUrl: r.finalUrl, sha256: hash, checked: new Date().toISOString(), chars: text.length };
      Object.assign(entry, { status: 'ok', sha256: hash, changed: !!prev && prev.sha256 !== hash, firstSnapshot: !prev });
    } catch (e) {
      Object.assign(entry, { status: 'fetch_error', error: String(e.message || e), changed: false });
    }
    out.push(entry);
  }
  fs.writeFileSync(INDEX_FILE, JSON.stringify(newIndex, null, 2) + '\n');
  return out;
}

const banks = await checkBanks();
const disclosures = await checkDisclosures();
const bankMismatches = banks.filter((b) => b.mismatch);
const disclosureChanges = disclosures.filter((d) => d.changed);
const report = {
  generatedAt: new Date().toISOString(),
  dataVersion: DATA.dataVersion,
  schemaVersion: DATA.schemaVersion,
  summary: {
    banksChecked: banks.length,
    bankMismatches: bankMismatches.length,
    bankFetchErrors: banks.filter((b) => b.status === 'fetch_error').length,
    disclosuresChecked: disclosures.length,
    disclosureChanges: disclosureChanges.length,
    disclosureFetchErrors: disclosures.filter((d) => d.status === 'fetch_error').length,
  },
  alert: bankMismatches.length > 0 || disclosureChanges.length > 0,
  bankMismatches, disclosureChanges, banks, disclosures,
};
fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2) + '\n');

if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `alert=${report.alert}\n`);
console.log(JSON.stringify(report.summary));
for (const b of bankMismatches) console.log(`BANK MISMATCH cert ${b.cert}: expected "${b.expectedName}" active=${b.expectedActive}, got "${b.actualName ?? '-'}" active=${b.actualActive ?? '-'} (${b.status})`);
for (const d of disclosureChanges) console.log(`DISCLOSURE CHANGED ${d.app}: ${d.url}`);
process.exit(0);
