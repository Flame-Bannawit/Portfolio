"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/components/shared/Providers";
import { getPublishedProjects } from "@/lib/supabase/queries";
import type { Project, ProjectCategory } from "@/types";
import { CATEGORY_LABELS } from "@/types";
import { t } from "@/lib/i18n/strings";
import Link from "next/link";
import { GitBranch, Globe, ArrowRight } from "lucide-react";

const CATEGORIES: { value: ProjectCategory | "all"; label: { th: string; en: string } }[] = [
  { value: "all",          label: { th: "ทั้งหมด",      en: "All" } },
  { value: "web_app",      label: { th: "Web App",      en: "Web App" } },
  { value: "software_eng", label: { th: "Software Eng", en: "Software Eng" } },
  { value: "data_analyst", label: { th: "Data Analyst", en: "Data Analyst" } },
  { value: "hardware",     label: { th: "Hardware",     en: "Hardware" } },
  { value: "automation",   label: { th: "Automation",   en: "Automation" } },
];

export default function ProjectsPage() {
  const { lang } = useApp();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter]     = useState<ProjectCategory | "all">("all");
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    getPublishedProjects().then(p => { setProjects(p); setLoading(false); });
  }, []);

  const filtered = filter === "all"
    ? projects
    : projects.filter(p => p.category === filter);

  return (
    <section style={{ padding: "56px 0 100px" }}>
      <div className="container">

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <p className="eyebrow" style={{ marginBottom: 12 }}>Portfolio</p>
          <h1 style={{ fontSize: "clamp(34px, 4vw, 52px)", fontWeight: 700, letterSpacing: "-0.03em", margin: "0 0 12px" }}>
            {t(lang, "proj_title")}
          </h1>
          <p style={{ color: "var(--muted)", fontSize: 16, margin: 0, maxWidth: 520 }}>
            {t(lang, "proj_sub")}
          </p>
        </div>

        {/* Filter */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 36 }}>
          {CATEGORIES.map(({ value, label }) => (
            <button key={value} onClick={() => setFilter(value)} style={{
              padding: "8px 18px",
              borderRadius: "var(--radius-sm)",
              border: `1px solid ${filter === value ? "var(--primary)" : "var(--line)"}`,
              background: filter === value
                ? "color-mix(in oklab, var(--primary) 12%, var(--surface))"
                : "var(--surface)",
              color: filter === value ? "var(--primary)" : "var(--muted)",
              fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600,
              letterSpacing: "0.06em", textTransform: "uppercase",
              cursor: "pointer", transition: "all .2s var(--ease-out)",
            }}>
              {label[lang]}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ textAlign: "center", padding: 80, color: "var(--muted)" }}>
            {t(lang, "loading")}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: 80, color: "var(--muted)" }}>
            {t(lang, "no_projects")}
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 24,
          }} className="proj-grid">
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} lang={lang} />
            ))}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .proj-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

function ProjectCard({ project, lang }: { project: Project; lang: "th" | "en" }) {
  const desc = lang === "th"
    ? project.description_th
    : (project.description_en || project.description_th);

  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--line)",
      borderRadius: "var(--radius-md)", overflow: "hidden",
      display: "flex", flexDirection: "column",
      transition: "all .35s var(--ease-out)",
    }}
    onMouseEnter={e => {
      (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
      (e.currentTarget as HTMLElement).style.borderColor = "var(--primary)";
      (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-lift)";
    }}
    onMouseLeave={e => {
      (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
      (e.currentTarget as HTMLElement).style.borderColor = "var(--line)";
      (e.currentTarget as HTMLElement).style.boxShadow = "none";
    }}>

      {/* Cover */}
      <div style={{
        aspectRatio: "16/9", background: "var(--surface-2)",
        position: "relative", overflow: "hidden",
        borderBottom: "1px solid var(--line-soft)",
      }}>
        {project.cover_url ? (
          <img src={project.cover_url} alt={project.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div className="ph-stripe" />
        )}
        {/* Device chips */}
        <div style={{ position: "absolute", top: 12, left: 12, display: "flex", gap: 6, zIndex: 2 }}>
          {project.devices.map(d => (
            <span key={d} style={{
              fontFamily: "var(--font-mono)", fontSize: 10,
              padding: "3px 7px", borderRadius: 4,
              background: "color-mix(in oklab, var(--surface) 90%, transparent)",
              border: "1px solid var(--line-soft)", color: "var(--muted)",
              letterSpacing: "0.06em", textTransform: "uppercase",
            }}>{d}</span>
          ))}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: 22, display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 10.5,
            color: "var(--primary)", letterSpacing: "0.16em", textTransform: "uppercase",
          }}>
            {CATEGORY_LABELS[project.category][lang]}
          </span>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 11,
            color: "var(--muted)", marginLeft: "auto",
          }}>
            {project.period_start} — {project.period_end}
          </span>
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", margin: 0 }}>
          {project.name}
        </h2>

        <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.55, margin: 0 }}>
          {desc}
        </p>

        {/* Tech chips */}
        {project.project_tech && project.project_tech.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {project.project_tech.map(tech => (
              <span key={tech.id} className="chip">{tech.tech_name}</span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          paddingTop: 14, borderTop: "1px dashed var(--line)",
          marginTop: "auto",
        }}>
          <span className={`tag-pill ${project.status === "live" ? "live" : project.status === "demo" ? "demo" : "draft"}`}>
            {project.status === "live" ? "🟢 Live" : project.status === "demo" ? "🔵 Demo" : "⚫ Local"}
          </span>

          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            {project.repo_url && (
              <a href={project.repo_url} target="_blank" rel="noopener noreferrer"
                className="icon-btn" title="GitHub">
                <GitBranch size={15} />
              </a>
            )}
            {project.live_url && (
              <a href={project.live_url} target="_blank" rel="noopener noreferrer"
                className="icon-btn" title="Live site">
                <Globe size={15} />
              </a>
            )}
            <Link href={`/projects/${project.slug}`} className="icon-btn" title="Details">
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}