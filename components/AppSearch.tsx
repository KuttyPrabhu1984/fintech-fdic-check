'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { AppSummary } from '@/lib/data';

export default function AppSearch({ apps }: { apps: AppSummary[] }) {
  const [q, setQ] = useState('');
  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    return apps.filter(
      (a) => a.name.toLowerCase().includes(s) || a.slug.includes(s) || a.banks.some((b) => b.name.toLowerCase().includes(s)),
    );
  }, [q, apps]);

  return (
    <section aria-label="Check your app">
      <label htmlFor="app-search"><strong>Check your app</strong></label>
      <input
        id="app-search" type="search" placeholder="e.g. Chime, Cash App, Sutton Bank" value={q}
        onChange={(e) => setQ(e.target.value)} autoComplete="off"
      />
      {q.trim() && (
        <div aria-live="polite" style={{ marginTop: 10 }}>
          {results.length === 0 ? (
            <p className="muted">No match in our database. Check the app’s legal disclosures for “Member FDIC”, then look the bank up in FDIC BankFind.</p>
          ) : (
            results.map((a) => (
              <div key={a.slug} className="answer" style={{ marginBottom: 8 }}>
                <Link href={`/apps/${a.slug}/`}><strong>{a.name}</strong></Link>
                {a.isBank ? ' is itself an FDIC-insured bank: ' : ' — partner bank(s): '}
                {a.banks.map((b, i) => (
                  <span key={b.cert}>{i > 0 ? '; ' : ''}{b.name} (FDIC cert {b.cert}{b.active ? ', active' : ', NOT active'})</span>
                ))}
                <div className="muted">Insurance: {a.insuranceType === 'direct' ? 'direct FDIC deposit insurance' : 'FDIC pass-through (conditions apply)'}</div>
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
}
