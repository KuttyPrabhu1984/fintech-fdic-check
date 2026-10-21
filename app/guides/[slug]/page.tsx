import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Cites } from '@/components/FactLine';
import JsonLd, { faqJsonLd } from '@/components/JsonLd';
import AdSlot from '@/components/AdSlot';
import { getGuide, guides, guideSources } from '@/lib/data';

type Params = { slug: string };

export const dynamicParams = false;
export function generateStaticParams(): Params[] {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const g = getGuide((await params).slug);
  if (!g) return {};
  const url = `/guides/${g.slug}/`;
  return { title: g.title, description: g.description, alternates: { canonical: url }, openGraph: { title: g.title, description: g.description, url, type: 'article' } };
}

export default async function GuidePage({ params }: { params: Promise<Params> }) {
  const g = getGuide((await params).slug);
  if (!g) notFound();
  const used = Array.from(new Set(g.sections.flatMap((s) => s.paragraphs.flatMap((p) => p.sources)).concat(g.faqs.flatMap((f) => f.sources))));
  return (
    <article>
      <JsonLd data={faqJsonLd(g.faqs)} />
      <p className="muted"><Link href="/">Home</Link> / <Link href="/guides/">Guides</Link></p>
      <h1>{g.title}</h1>
      {g.sections.map((s) => (
        <section key={s.heading}>
          <h2>{s.heading}</h2>
          {s.paragraphs.map((p, i) => <p key={i}>{p.text} <Cites ids={p.sources} sources={guideSources} /></p>)}
        </section>
      ))}
      <h2>FAQ</h2>
      {g.faqs.map((f) => (
        <div key={f.question}>
          <h3>{f.question}</h3>
          <p>{f.answer} <Cites ids={f.sources} sources={guideSources} /></p>
        </div>
      ))}
      <AdSlot slot={`guide-${g.slug}`} />
      <h2>Sources</h2>
      <ul>
        {used.map((id) => {
          const s = guideSources[id];
          return s ? <li key={id}><a href={s.url} rel="nofollow noopener">{s.title}</a> — {s.publisher}, fetched {s.fetched}</li> : null;
        })}
      </ul>
      <p className="muted">Last verified: {g.lastVerified}.</p>
    </article>
  );
}
