import type { Metadata } from 'next';
import Link from 'next/link';
import Disclaimer from '@/components/Disclaimer';
import { DATA_VERSION } from '@/lib/data';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} — What bank is your app through?`, template: `%s | ${SITE_NAME}` },
  description: 'Which bank holds your money in Chime, Cash App, Venmo, PayPal and other US fintech apps, and whether it is FDIC insured. Sourced from app disclosures and FDIC BankFind.',
  openGraph: { type: 'website', siteName: SITE_NAME, url: SITE_URL },
  twitter: { card: 'summary' },
  alternates: { canonical: '/' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="site">
          <div className="wrap">
            <Link href="/" className="brand">{SITE_NAME}</Link>
            <nav>
              <Link href="/#apps">Apps</Link>
              <Link href="/#compare">Compare</Link>
              <Link href="/guides/">Guides</Link>
            </nav>
          </div>
        </header>
        <main className="wrap">
          <Disclaimer />
          {children}
        </main>
        <footer className="site">
          <div className="wrap">
            <p>
              Bank data: <a href="https://banks.data.fdic.gov/bankfind-suite/bankfind" rel="nofollow noopener">FDIC BankFind Suite</a>.
              Data version {DATA_VERSION}. Items marked <span className="badge badge-unverified">Unverified</span> could not be confirmed from a fetched source.
            </p>
            <p>Not financial advice. Not affiliated with the FDIC, NCUA, or any listed company.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
