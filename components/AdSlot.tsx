/** Placeholder for a future AdSense unit. Renders nothing visible and loads no scripts until configured. */
export default function AdSlot({ slot }: { slot: string }) {
  return <div className="ad-slot" data-ad-slot={slot} aria-hidden="true" />;
}
