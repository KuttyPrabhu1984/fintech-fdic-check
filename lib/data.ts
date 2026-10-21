import appsJson from '@/data/apps.json';
import guidesJson from '@/data/guides.json';

export type Source = { title: string; url: string; publisher: string; fetched: string; method?: string };
export type Fact = { text: string; verified: boolean; sources: string[]; reason?: string };
export type Bank = {
  cert: number; name: string; active: boolean; city: string; state: string;
  bankfindUrl: string; apiQuery: string; verified: boolean; lastVerified: string;
};
export type PartnerBank = { cert: number; role: string; verified: boolean; sources: string[] };
export type App = {
  slug: string; name: string; isBank: boolean; summary: Fact; partnerBanks: PartnerBank[];
  insurance: Fact & { type: 'direct' | 'pass-through' }; coverage: Fact; sweep: Fact | null;
  ifFintechFails: Fact[]; unverified: Fact[]; disclosureUrls: string[]; lastVerified: string;
};
export type Guide = {
  slug: string; title: string; description: string; lastVerified: string;
  sections: { heading: string; paragraphs: { text: string; sources: string[] }[] }[];
  faqs: { question: string; answer: string; sources: string[] }[];
};

type AppsFile = { schemaVersion: number; dataVersion: string; generated: string; sources: Record<string, Source>; banks: Record<string, Bank>; apps: App[] };
type GuidesFile = { schemaVersion: number; dataVersion: string; sources: Record<string, Source>; guides: Guide[] };

const appsData = appsJson as unknown as AppsFile;
const guidesData = guidesJson as unknown as GuidesFile;

export const DATA_VERSION = appsData.dataVersion;
export const SCHEMA_VERSION = appsData.schemaVersion;
export const apps = appsData.apps;
export const guides = guidesData.guides;
export const appSources = appsData.sources;
export const guideSources = guidesData.sources;

export const getApp = (slug: string) => apps.find((a) => a.slug === slug);
export const getGuide = (slug: string) => guides.find((g) => g.slug === slug);
export const getBank = (cert: number) => appsData.banks[String(cert)];

/** Compact, serializable shape for client-side search and compare. */
export type AppSummary = {
  slug: string; name: string; isBank: boolean; summary: string; insuranceType: string;
  coverage: string; coverageVerified: boolean; sweep: string | null;
  banks: { name: string; cert: number; role: string; active: boolean }[];
};
export function appSummaries(): AppSummary[] {
  return apps.map((a) => ({
    slug: a.slug, name: a.name, isBank: a.isBank, summary: a.summary.text,
    insuranceType: a.insurance.type,
    coverage: a.coverage.text, coverageVerified: a.coverage.verified,
    sweep: a.sweep?.verified ? a.sweep.text : null,
    banks: a.partnerBanks.map((p) => {
      const b = getBank(p.cert);
      return { name: b.name, cert: b.cert, role: p.role, active: b.active };
    }),
  }));
}
