'use client';
import { useState } from 'react';
import Link from 'next/link';
import type { AppSummary } from '@/lib/data';

export default function CompareTool({ apps }: { apps: AppSummary[] }) {
  const [picked, setPicked] = useState<string[]>([apps[0]?.slug ?? '', apps[1]?.slug ?? '', '']);
  const chosen = picked.map((s) => apps.find((a) => a.slug === s)).filter((a): a is AppSummary => !!a);
  const set = (i: number, v: string) => setPicked((p) => p.map((x, j) => (j === i ? v : x)));

  return (
    <section aria-label="Compare apps">
      <div className="compare-pickers">
        {[0, 1, 2].map((i) => (
          <select key={i} aria-label={`App ${i + 1}`} value={picked[i]} onChange={(e) => set(i, e.target.value)}>
            <option value="">{i === 2 ? '(optional third app)' : 'Choose an app'}</option>
            {apps.map((a) => <option key={a.slug} value={a.slug}>{a.name}</option>)}
          </select>
        ))}
      </div>
      {chosen.length >= 2 ? (
        <div className="scroll">
          <table>
            <thead>
              <tr><th scope="col"></th>{chosen.map((a) => <th key={a.slug} scope="col"><Link href={`/apps/${a.slug}/`}>{a.name}</Link></th>)}</tr>
            </thead>
            <tbody>
              <tr><th scope="row">Is it a bank?</th>{chosen.map((a) => <td key={a.slug}>{a.isBank ? 'Yes' : 'No'}</td>)}</tr>
              <tr><th scope="row">Bank(s)</th>{chosen.map((a) => (
                <td key={a.slug}>{a.banks.map((b) => <div key={b.cert}>{b.name} <span className="muted">(cert {b.cert}; {b.role})</span></div>)}</td>
              ))}</tr>
              <tr><th scope="row">Insurance type</th>{chosen.map((a) => <td key={a.slug}>{a.insuranceType === 'direct' ? 'Direct' : 'Pass-through'}</td>)}</tr>
              <tr><th scope="row">Coverage</th>{chosen.map((a) => (
                <td key={a.slug}>{a.coverageVerified ? a.coverage : <><span className="badge badge-unverified">Unverified</span> {a.coverage}</>}</td>
              ))}</tr>
              <tr><th scope="row">Multi-bank / sweep</th>{chosen.map((a) => <td key={a.slug}>{a.sweep ?? <span className="muted">None stated in source</span>}</td>)}</tr>
            </tbody>
          </table>
        </div>
      ) : (
        <p className="muted">Pick at least two apps.</p>
      )}
    </section>
  );
}
