import Link from 'next/link';
import AppSearch from '@/components/AppSearch';
import CompareTool from '@/components/CompareTool';
import AdSlot from '@/components/AdSlot';
import { appSummaries, guides } from '@/lib/data';

export default function Home() {
  const list = appSummaries();
  return (
    <>
      <h1>What bank is your app through? Is it FDIC insured?</h1>
      <p>
        Fintech apps are usually not banks. Your money sits at a partner bank, and FDIC coverage depends on that bank and on
        the app’s records. Search an app to see its partner bank, FDIC certificate number and coverage terms, each linked to
        its source.
      </p>
      <AppSearch apps={list} />
      <AdSlot slot="home-top" />

      <h2 id="apps">All apps ({list.length})</h2>
      <ul className="grid">
        {list.map((a) => (
          <li key={a.slug} className="card">
            <Link className="title" href={`/apps/${a.slug}/`}>{a.name}</Link>{' '}
            {a.isBank ? <span className="badge badge-bank">Bank</span> : null}
            <div className="muted">{a.banks.map((b) => b.name).join('; ')}</div>
          </li>
        ))}
      </ul>

      <h2 id="compare">Compare 2–3 apps</h2>
      <CompareTool apps={list} />

      <h2>Guides</h2>
      <ul>
        {guides.map((g) => (
          <li key={g.slug}><Link href={`/guides/${g.slug}/`}>{g.title}</Link></li>
        ))}
      </ul>
    </>
  );
}
