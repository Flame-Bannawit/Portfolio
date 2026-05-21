export type Lang = "th" | "en";
export type Theme = "dark" | "light";

export type ProjectCategory =
  | "web_app"
  | "software_eng"
  | "data_analyst"
  | "hardware"
  | "automation";

export type DeviceKind = "desktop" | "tablet" | "mobile" | "hardware" | "workflow";

export interface ProjectTech {
  id: string;
  project_id: string;
  tech_name: string;
  used_for: string | null;
  used_for_en: string | null;
  display_order: number;
}

export interface Project {
  id: string;
  slug: string;
  name: string;
  category: ProjectCategory;
  description_th: string;
  description_en: string | null;
  period_start: string;
  period_end: string;
  cover_url: string | null;
  devices: DeviceKind[];
  repo_url: string | null;
  live_url: string | null;
  status: "live" | "demo" | "local";
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  project_tech?: ProjectTech[];
}

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  issued_date: string;
  description_th: string;
  description_en: string | null;
  image_url: string;
  verify_url: string | null;
  is_published: boolean;
  created_at: string;
}

export interface TechStack {
  id: string;
  name: string;
  categories: ProjectCategory[];
}

export interface PageView {
  id: number;
  path: string;
  referrer: string | null;
  user_agent: string | null;
  ip_hash: string | null;
  viewed_at: string;
}

export const CATEGORY_LABELS: Record<ProjectCategory, { th: string; en: string }> = {
  web_app:      { th: "Web App",      en: "Web App" },
  software_eng: { th: "Software Eng", en: "Software Eng" },
  data_analyst: { th: "Data Analyst", en: "Data Analyst" },
  hardware:     { th: "Hardware",     en: "Hardware" },
  automation:   { th: "Automation",   en: "Automation" },
};

export const DEVICE_LABELS: Record<DeviceKind, string> = {
  desktop:  "Desktop",
  tablet:   "Tablet",
  mobile:   "Mobile",
  hardware: "Hardware",
  workflow: "Workflow",
};