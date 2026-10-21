import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import FactLine, { Cites } from '@/components/FactLine';
import JsonLd, { faqJsonLd } from '@/components/JsonLd';
import AdSlot from '@/components/AdSlot';
import AffiliateSlot from '@/components/AffiliateSlot';
import { apps, appSources, getApp, getBank, type App } from '@/lib/data';

type Params = { slug: string };

export const dynamicParams = false;
export function generateStaticParams(): Params[] {
  return apps.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const app = getApp((await params).slug);
  if (!app) return {};
  const title = `What bank is ${app.name} through? Is ${app.name} FDIC insured?`;
  const description = app.summary.text;
  const url = `/apps/${app.slug}/`;
  return { title, description, alternates: { canonical: url }, openGraph: { title, description, url, type: 'article' } };
}

function bankNames(app: App) {
  return app.partnerBanks.map((p) => `${getBank(p.cert).name} (FDIC cert ${p.cert})`).join('; ');
}

function faqs(app: App) {
  const items = [
    {
      question: `What bank is ${app.name} through?`,
      answer: app.isBank
        ? `${app.name} is itself a bank: ${bankNames(app)}. ${app.summary.text}`
        : `${app.summary.text} FDIC BankFind records: ${bankNames(app)}.`,
    },
    { question: `Is ${app.name} FDIC insured?`, answer: app.insurance.text + (app.coverage.verified ? ` ${app.coverage.text}` : '') },
  ];
  const fails = app.ifFintechFails.filter((f) => f.verified).map((f) => f.text).join(' ');
  if (fails) items.push({ question: app.isBank ? `What if ${app.name} fails?` : `What happens to my money if ${app.name} fails?`, answer: fails });
  return items;
}

export default async function AppPage({ params }: { params: Promise<Params> }) {
  const app = getApp((await params).slug);
  if (!app) notFound();
  const usedSourceIds = Array.from(new Set([
    app.summary, app.insurance, app.coverage, ...(app.sweep ? [app.sweep] : []), ...app.ifFintechFails,
  ].flatMap((f) => f.sources).concat(app.partnerBanks.flatMap((p) => p.sources))));

  return (
    <article>
      <JsonLd data={faqJsonLd(faqs(app))} />
      <p className="muted"><Link href="/">Home</Link> / Apps / {app.name}</p>
      <h1>What bank is {app.name} through?</h1>
      <div className="answer">
        <FactLine fact={app.summary} sources={appSources} />
      </div>

      <h2>Bank{app.partnerBanks.length > 1 ? 's' : ''} (FDIC BankFind)</h2>
      <div className="scroll">
        <table>
          <thead><tr><th>Bank</th><th>FDIC cert</th><th>Status</th><th>Location</th><th>Role</th></tr></thead>
          <tbody>
            {app.partnerBanks.map((p) => {
              const b = getBank(p.cert);
              return (
                <tr key={p.cert}>
                  <td>{b.name}</td>
                  <td><a href={b.bankfindUrl} rel="nofollow noopener">{b.cert}</a></td>
                  <td>{b.verified ? (b.active ? <span className="badge badge-ok">Active</span> : <span className="badge">Inactive</span>) : <span className="badge badge-unverified">Unverified</span>}</td>
                  <td>{b.city}, {b.state}</td>
                  <td>{p.role} <Cites ids={p.sources.filter((s) => s !== 'bankfind-api')} sources={appSources} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="muted">Status from the FDIC BankFind API, checked {app.lastVerified}.</p>

      <h2>Is {app.name} FDIC insured?</h2>
      <ul className="facts">
        <li><strong>{app.insurance.type === 'direct' ? 'Direct deposit insurance' : 'Pass-through insurance'}:</strong> <FactLine fact={app.insurance} sources={appSources} /></li>
        <li><strong>Coverage limit:</strong> <FactLine fact={app.coverage} sources={appSources} /></li>
        {app.sweep ? <li><strong>Multi-bank / sweep:</strong> <FactLine fact={app.sweep} sources={appSources} /></li> : null}
      </ul>

      <h2>{app.isBank ? `What if ${app.name} fails?` : `What happens if ${app.name} fails?`}</h2>
      <ul className="facts">
        {app.ifFintechFails.map((f, i) => <li key={i}><FactLine fact={f} sources={appSources} /></li>)}
      </ul>

      <AffiliateSlot context={`app-${app.slug}`} />

      {app.unverified.length > 0 && (
        <>
          <h2>Not verified</h2>
          <ul className="facts">
            {app.unverified.map((f, i) => <li key={i}><FactLine fact={f} sources={appSources} /></li>)}
          </ul>
        </>
      )}

      <h2>Sources</h2>
      <ul>
        {usedSourceIds.map((id) => {
          const s = appSources[id];
          return s ? (
            <li key={id}>
              <a href={s.url} rel="nofollow noopener">{s.title}</a> — {s.publisher}, fetched {s.fetched}{s.method ? ` (${s.method})` : ''}
            </li>
          ) : null;
        })}
        {app.partnerBanks.map((p) => {
          const b = getBank(p.cert);
          return <li key={`bf-${p.cert}`}><a href={b.bankfindUrl} rel="nofollow noopener">FDIC BankFind: {b.name}</a> — queried {b.lastVerified}</li>;
        })}
      </ul>
      <p className="muted">Last verified: {app.lastVerified}.</p>
      <AdSlot slot={`app-${app.slug}-bottom`} />
    </article>
  );
}
