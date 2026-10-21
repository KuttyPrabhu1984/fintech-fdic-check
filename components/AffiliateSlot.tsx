/** Placeholder for a future affiliate disclosure/link block. Intentionally empty. */
export default function AffiliateSlot({ context }: { context: string }) {
  return <div className="affiliate-slot" data-affiliate-context={context} aria-hidden="true" />;
}
