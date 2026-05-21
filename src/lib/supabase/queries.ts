import { createClient } from "@/lib/supabase/client";
import type { Project, Certificate, TechStack, ProjectCategory } from "@/types";

// ── Projects ──────────────────────────────────────
export async function getPublishedProjects(): Promise<Project[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("projects")
    .select(`*, project_tech(*)`)
    .eq("is_published", true)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) { console.error(error); return []; }
  return (data as Project[]) ?? [];
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("projects")
    .select(`*, project_tech(*)`)
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error) { console.error(error); return null; }
  return data as Project;
}

// ── Certificates ──────────────────────────────────
export async function getPublishedCertificates(): Promise<Certificate[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("certificates")
    .select("*")
    .eq("is_published", true)
    .order("issued_date", { ascending: false });

  if (error) { console.error(error); return []; }
  return (data as Certificate[]) ?? [];
}

// ── Tech Stacks ───────────────────────────────────
export async function getTechStacks(): Promise<TechStack[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("tech_stacks")
    .select("*")
    .order("name");

  if (error) { console.error(error); return []; }
  return (data as TechStack[]) ?? [];
}

export async function getTechStacksByCategory(
  category: ProjectCategory
): Promise<TechStack[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("tech_stacks")
    .select("*")
    .contains("categories", [category])
    .order("name");

  if (error) { console.error(error); return []; }
  return (data as TechStack[]) ?? [];
}

// ── Page Views ────────────────────────────────────
export async function recordPageView(path: string): Promise<void> {
  const supabase = createClient();
  await supabase.from("page_views").insert({ path });
}

export async function getPageViewStats(): Promise<{
  total: number;
  today: number;
  byPath: { path: string; count: number }[];
}> {
  const supabase = createClient();

  const { count: total } = await supabase
    .from("page_views")
    .select("*", { count: "exact", head: true });

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const { count: today } = await supabase
    .from("page_views")
    .select("*", { count: "exact", head: true })
    .gte("viewed_at", todayStart.toISOString());

  const { data: pathData } = await supabase
    .from("page_views")
    .select("path")
    .order("viewed_at", { ascending: false })
    .limit(1000);

  const pathCounts: Record<string, number> = {};
  pathData?.forEach(({ path }) => {
    pathCounts[path] = (pathCounts[path] ?? 0) + 1;
  });

  const byPath = Object.entries(pathCounts)
    .map(([path, count]) => ({ path, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return { total: total ?? 0, today: today ?? 0, byPath };
}

// ── Admin queries ─────────────────────────────────
export async function getAllProjects(): Promise<Project[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("projects")
    .select(`*, project_tech(*)`)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) { console.error(error); return []; }
  return (data as Project[]) ?? [];
}

export async function getAllCertificates(): Promise<Certificate[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("certificates")
    .select("*")
    .order("issued_date", { ascending: false });

  if (error) { console.error(error); return []; }
  return (data as Certificate[]) ?? [];
}

export async function deleteProject(id: string): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  return !error;
}

export async function deleteCertificate(id: string): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase.from("certificates").delete().eq("id", id);
  return !error;
}