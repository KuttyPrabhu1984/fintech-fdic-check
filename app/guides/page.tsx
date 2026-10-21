import type { Metadata } from 'next';
import Link from 'next/link';
import { guides } from '@/lib/data';

export const metadata: Metadata = { title: 'FDIC insurance guides', description: 'Short, sourced guides to FDIC and NCUA insurance.', alternates: { canonical: '/guides/' } };

export default function GuidesIndex() {
  return (
    <>
      <h1>Guides</h1>
      <ul>
        {guides.map((g) => (
          <li key={g.slug}><Link href={`/guides/${g.slug}/`}>{g.title}</Link> — <span className="muted">{g.description}</span></li>
        ))}
      </ul>
    </>
  );
}
