"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useApp } from "@/components/shared/Providers";
import { getProjectBySlug } from "@/lib/supabase/queries";
import type { Project } from "@/types";
import { CATEGORY_LABELS } from "@/types";
import { t } from "@/lib/i18n/strings";
import { ArrowLeft, GitBranch, Globe } from "lucide-react";

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router   = useRouter();
  const { lang } = useApp();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjectBySlug(slug).then(p => { setProject(p); setLoading(false); });
  }, [slug]);

  if (loading) return (
    <div style={{ padding: 80, textAlign: "center", color: "var(--muted)" }}>
      {t(lang, "loading")}
    </div>
  );

  if (!project) return (
    <div style={{ padding: 80, textAlign: "center" }}>
      <p style={{ color: "var(--muted)" }}>ไม่พบ project นี้</p>
      <button onClick={() => router.push("/projects")} className="btn btn-ghost" style={{ marginTop: 16 }}>
        <ArrowLeft size={16} /> กลับ
      </button>
    </div>
  );

  const desc = lang === "th"
    ? project.description_th
    : (project.description_en || project.description_th);

  return (
    <section style={{ padding: "40px 0 100px" }}>
      <div className="container">

        {/* Back */}
        <button onClick={() => router.push("/projects")}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            color: "var(--muted)", fontFamily: "var(--font-mono)",
            fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase",
            background: "none", border: "none", cursor: "pointer",
            marginBottom: 24, transition: "color .2s",
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--primary)")}
          onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}>
          <ArrowLeft size={14} /> {t(lang, "back")}
        </button>

        {/* Hero banner */}
        <div style={{
          aspectRatio: "21/9", background: "var(--surface-2)",
          border: "1px solid var(--line)", borderRadius: "var(--radius-md)",
          position: "relative", overflow: "hidden", marginBottom: 32,
        }}>
          {project.cover_url ? (
            <img src={project.cover_url} alt={project.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div className="ph-stripe" />
          )}
        </div>

        {/* Title row */}
        <div style={{
          display: "flex", alignItems: "flex-start",
          justifyContent: "space-between", gap: 24,
          marginBottom: 40, flexWrap: "wrap",
        }}>
          <div>
            <p style={{
              fontFamily: "var(--font-mono)", fontSize: 11,
              color: "var(--primary)", letterSpacing: "0.16em",
              textTransform: "uppercase", margin: "0 0 10px",
            }}>
              {CATEGORY_LABELS[project.category][lang]}
            </p>
            <h1 style={{
              fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700,
              letterSpacing: "-0.03em", margin: 0,
            }}>
              {project.name}
            </h1>
          </div>
          <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
            {project.repo_url && (
              <a href={project.repo_url} target="_blank" rel="noopener noreferrer"
                className="btn btn-ghost">
                <GitBranch size={16} /> GitHub
              </a>
            )}
            {project.live_url && (
              <a href={project.live_url} target="_blank" rel="noopener noreferrer"
                className="btn btn-primary">
                <Globe size={16} /> {t(lang, "cta_visit_site")}
              </a>
            )}
          </div>
        </div>

        {/* Body grid */}
        <div style={{
          display: "grid", gridTemplateColumns: "2fr 1fr", gap: 48,
        }} className="detail-body-grid">

          {/* Left */}
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 16px" }}>
              {t(lang, "description")}
            </h2>
            <p style={{ color: "var(--muted)", lineHeight: 1.7, fontSize: 15.5, margin: "0 0 32px" }}>
              {desc}
            </p>

            {/* Tech Stack */}
            {project.project_tech && project.project_tech.length > 0 && (
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 16px" }}>
                  {t(lang, "tech_stack")}
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {project.project_tech.map(tech => {
                    const note = lang === "th"
                      ? tech.used_for
                      : ((tech as any).used_for_en || tech.used_for);
                    return (
                      <div key={tech.id} style={{
                        display: "flex", alignItems: "flex-start", gap: 16,
                        padding: "16px 18px",
                        background: "var(--surface)", border: "1px solid var(--line)",
                        borderRadius: "var(--radius-sm)",
                      }}>
                        <span style={{
                          fontFamily: "var(--font-mono)", fontSize: 12,
                          color: "var(--primary)", fontWeight: 700,
                          minWidth: 120, flexShrink: 0,
                        }}>
                          {tech.tech_name}
                        </span>
                        {note && (
                          <span style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.5 }}>
                            {note}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right — Aside */}
          <div style={{
            position: "sticky", top: 100, alignSelf: "start",
            display: "flex", flexDirection: "column", gap: 20,
          }}>

            <div style={{
              padding: 22, background: "var(--surface)",
              border: "1px solid var(--line)", borderRadius: "var(--radius-md)",
            }}>
              <h5 style={{
                fontFamily: "var(--font-mono)", fontSize: 11,
                letterSpacing: "0.16em", textTransform: "uppercase",
                color: "var(--muted)", margin: "0 0 12px",
              }}>
                {t(lang, "period")}
              </h5>
              <p style={{ margin: 0, fontFamily: "var(--font-mono)", fontSize: 13 }}>
                {project.period_start}
              </p>
              <p style={{ margin: "4px 0 0", color: "var(--muted)", fontSize: 12 }}>
                → {project.period_end}
              </p>
            </div>

            <div style={{
              padding: 22, background: "var(--surface)",
              border: "1px solid var(--line)", borderRadius: "var(--radius-md)",
            }}>
              <h5 style={{
                fontFamily: "var(--font-mono)", fontSize: 11,
                letterSpacing: "0.16em", textTransform: "uppercase",
                color: "var(--muted)", margin: "0 0 12px",
              }}>
                Category
              </h5>
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: 12,
                color: "var(--primary)", letterSpacing: "0.08em",
              }}>
                {CATEGORY_LABELS[project.category][lang]}
              </span>
            </div>

            <div style={{
              padding: 22, background: "var(--surface)",
              border: "1px solid var(--line)", borderRadius: "var(--radius-md)",
            }}>
              <h5 style={{
                fontFamily: "var(--font-mono)", fontSize: 11,
                letterSpacing: "0.16em", textTransform: "uppercase",
                color: "var(--muted)", margin: "0 0 12px",
              }}>
                Platform
              </h5>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {project.devices.map(d => (
                  <span key={d} className="chip">{d}</span>
                ))}
              </div>
            </div>

            <div style={{
              padding: 22, background: "var(--surface)",
              border: "1px solid var(--line)", borderRadius: "var(--radius-md)",
            }}>
              <h5 style={{
                fontFamily: "var(--font-mono)", fontSize: 11,
                letterSpacing: "0.16em", textTransform: "uppercase",
                color: "var(--muted)", margin: "0 0 12px",
              }}>
                {t(lang, "links")}
              </h5>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {project.repo_url && (
                  <a href={project.repo_url} target="_blank" rel="noopener noreferrer"
                    style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--ink)", fontSize: 14 }}>
                    <GitBranch size={14} style={{ color: "var(--primary)" }} />
                    GitHub Repository
                  </a>
                )}
                {project.live_url && (
                  <a href={project.live_url} target="_blank" rel="noopener noreferrer"
                    style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--ink)", fontSize: 14 }}>
                    <Globe size={14} style={{ color: "var(--primary)" }} />
                    Live Website
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .detail-body-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}