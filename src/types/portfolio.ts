export type AvailabilityConfig = {
  enabled?: boolean;
  status?: string;
  scope?: string;
  timezone?: string;
  timezoneLabel?: string;
  sla?: string;
};

export type Profile = {
  name: string;
  handle: string;
  headline: string | null;
  avatarUrl: string | null;
  location: string | null;
  emailPublic: string | null;
  githubUrl: string | null;
  websiteUrl: string | null;
  buyMeACoffeeUrl?: string | null;
  telegramUrl?: string | null;
  linkedinUrl?: string | null;
  joinedLabel: string | null;
  bio: string | null;
  availability?: AvailabilityConfig;
  contactModalTitle?: string | null;
  contactModalSubtitle?: string | null;
  telegramConfigured?: boolean;
};

export type Stat = {
  id: string;
  label: string;
  value: string;
  sortOrder: number;
};

export type ProjectMetric = {
  label: string;
  value: string;
  description: string;
};

export type BlueprintNode = {
  id: string;
  label: string;
  role: string;
  badge: "CLIENT" | "ENGINE" | "STORAGE" | "AGENT" | "NETWORK";
  details?: string;
};

export type BlueprintConnection = {
  from: string;
  to: string;
  label?: string;
  bidirectional?: boolean;
};

export type SystemBlueprint = {
  protocol: string;
  headline: string;
  description: string;
  nodes: BlueprintNode[];
  connections: BlueprintConnection[];
};

export type CaseStudy = {
  headline: string;
  problem: string;
  constraints: string;
  decisions: string[];
  outcome: string;
  metrics: ProjectMetric[];
  architectureHighlights?: string[];
  blueprint?: SystemBlueprint;
};

export type Project = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  body: string | null;
  period: string | null;
  url: string | null;
  repoUrl: string | null;
  language: string | null;
  techStack: string[];
  categories?: string[];
  featured: boolean;
  sortOrder: number;
  badge?: string;
  isOpenSource?: boolean;
  buyMeACoffee?: boolean;
  caseStudy?: CaseStudy;
};

export type ExperienceRole = {
  id: string;
  companyId: string;
  title: string;
  employmentType: string | null;
  startDate: string;
  endDate: string | null;
  location: string | null;
  description?: string | null;
  skills: string[];
  sortOrder: number;
};

export type ExperienceCompany = {
  id: string;
  name: string;
  logoUrl: string | null;
  location: string | null;
  sortOrder: number;
  roles: ExperienceRole[];
};

export type Education = {
  id: string;
  school: string;
  degree: string | null;
  field: string | null;
  startDate: string | null;
  endDate: string | null;
  description?: string | null;
  url: string | null;
};

export type Honor = {
  id: string;
  title: string;
  issuer: string | null;
  date: string | null;
  description: string | null;
  url: string | null;
};

export type License = {
  id: string;
  name: string;
  issuer: string | null;
  issueDate: string | null;
  expiryDate: string | null;
  credentialId: string | null;
  url: string | null;
};

export type Portfolio = {
  profile: Profile | null;
  stats: Stat[];
  projects: Project[];
  experience: ExperienceCompany[];
  education: Education[];
  honors: Honor[];
  licenses: License[];
};

export type ContributionDay = {
  date: string;
  count: number;
  level: number;
};

export type ContributionYear = {
  year: number;
  total: number;
  days: ContributionDay[];
  source: string;
  username: string | null;
};
