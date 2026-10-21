import type { Fact, Source } from '@/lib/data';

export function Cites({ ids, sources }: { ids: string[]; sources: Record<string, Source> }) {
  if (!ids.length) return null;
  return (
    <span className="cites">
      {ids.map((id) => {
        const s = sources[id];
        return s ? (
          <a key={id} href={s.url} rel="nofollow noopener" target="_blank" title={s.title}>
            [{s.publisher}]
          </a>
        ) : null;
      })}
    </span>
  );
}

export default function FactLine({ fact, sources }: { fact: Fact; sources: Record<string, Source> }) {
  if (!fact.verified) {
    return (
      <span>
        <span className="badge badge-unverified">Unverified</span> {fact.text}
        {fact.reason ? <span className="muted"> — {fact.reason}</span> : null}
      </span>
    );
  }
  return (
    <span>
      {fact.text} <Cites ids={fact.sources} sources={sources} />
    </span>
  );
}
