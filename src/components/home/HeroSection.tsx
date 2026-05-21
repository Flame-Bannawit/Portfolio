"use client";

import { Mail, Phone, GitBranch, MapPin, ArrowUpRight, Download } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Lang, Project, Certificate } from "@/types";
import { CATEGORY_LABELS } from "@/types";
import { t } from "@/lib/i18n/strings";
import Link from "next/link";
import ResumeModal from "@/components/shared/ResumeModal";
import ContactModal from "@/components/shared/ContactModal";

interface Props {
  lang: Lang;
  projects?: Project[];
  certs?: Certificate[];
  onProjectClick?: (p: Project) => void;
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setShown(true); io.disconnect(); }
    }, { threshold: 0.08 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal${shown ? " in" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function HScroll({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState({ left: 0, max: 0 });
  const update = () => {
    const el = ref.current; if (!el) return;
    setState({ left: el.scrollLeft, max: el.scrollWidth - el.clientWidth });
  };
  useEffect(() => {
    update();
    const el = ref.current; if (!el) return;
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update); ro.observe(el);
    return () => { el.removeEventListener("scroll", update); ro.disconnect(); };
  }, []);
  const scroll = (dir: number) => {
    const el = ref.current; if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };
  const pct = state.max > 0 ? Math.min(100, (state.left / state.max) * 100) : 0;
  return (
    <div style={{ position: "relative" }}>
      <div ref={ref} className="hscroll-track">{children}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 18 }}>
        <div style={{
          flex: 1, height: 4, background: "var(--line-soft)",
          borderRadius: 999, position: "relative", overflow: "hidden", maxWidth: 200,
        }}>
          <span style={{
            position: "absolute", top: 0, bottom: 0, left: 0,
            width: `${Math.max(15, pct)}%`,
            background: "var(--primary)", borderRadius: 999,
            transition: "width .3s var(--ease-out)",
          }} />
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button onClick={() => scroll(-1)} disabled={state.left <= 2}
            style={{
              width: 42, height: 42, borderRadius: "50%",
              border: "1px solid var(--line)", background: "var(--surface)",
              color: "var(--ink)", cursor: "pointer", fontSize: 18,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all .2s var(--ease-out)", opacity: state.left <= 2 ? 0.35 : 1,
            }}>‹</button>
          <button onClick={() => scroll(1)} disabled={state.left >= state.max - 2}
            style={{
              width: 42, height: 42, borderRadius: "50%",
              border: "1px solid var(--line)", background: "var(--surface)",
              color: "var(--ink)", cursor: "pointer", fontSize: 18,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all .2s var(--ease-out)",
              opacity: state.left >= state.max - 2 ? 0.35 : 1,
            }}>›</button>
        </div>
      </div>
    </div>
  );
}

const contactRows = [
  { icon: Mail,      labelKey: "contact_email"    as const, value: "tiwsuphawit@gmail.com" },
  { icon: Phone,     labelKey: "contact_phone"    as const, value: "+66 99-034-1134" },
  { icon: GitBranch, labelKey: "contact_github"   as const, value: "github.com/Flame-Bannawit" },
  { icon: MapPin,    labelKey: "contact_location" as const, value: null },
];

const OTHER_WORKS = [
  { kind: "Hardware",     title: "Arduino smart lock prototype",       icon: "⚙️" },
  { kind: "Automation",   title: "Notion + Slack daily standup bot",   icon: "⚡" },
  { kind: "Data Analyst", title: "E-commerce funnel analysis (Python)", icon: "📈" },
  { kind: "Hardware",     title: "ESP32 air-quality dashboard",         icon: "⚙️" },
  { kind: "Automation",   title: "Make.com invoice pipeline",           icon: "⚡" },
  { kind: "Data Analyst", title: "Customer churn model (sklearn)",      icon: "📈" },
  { kind: "Hardware",     title: "Arduino smart lock prototype",       icon: "⚙️" },
  { kind: "Automation",   title: "Notion + Slack daily standup bot",   icon: "⚡" },
  { kind: "Data Analyst", title: "E-commerce funnel analysis (Python)", icon: "📈" },
  { kind: "Hardware",     title: "ESP32 air-quality dashboard",         icon: "⚙️" },
  { kind: "Automation",   title: "Make.com invoice pipeline",           icon: "⚡" },
  { kind: "Data Analyst", title: "Customer churn model (sklearn)",      icon: "📈" },
];

export default function HeroSection({ lang, projects = [], certs = [] }: Props) {
  const [resumeOpen, setResumeOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <>
      {/* ── HERO ── */}
      <section style={{ padding: "56px 0 80px" }}>
        <div className="container">
          <div style={{
            display: "grid", gridTemplateColumns: "1.05fr 1fr",
            gap: 64, alignItems: "center", minHeight: 560,
          }} className="hero-grid">

            {/* Left */}
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <Reveal>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 10,
                  padding: "6px 12px", background: "var(--surface)",
                  border: "1px solid var(--line)", borderRadius: 999,
                  width: "fit-content", fontFamily: "var(--font-mono)",
                  fontSize: 11.5, color: "var(--ink-2)", letterSpacing: "0.04em",
                }}>
                  <span className="pulse" style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: "var(--good)", display: "block",
                  }} />
                  {t(lang, "hero_status")}
                </div>
              </Reveal>

              <Reveal delay={60}>
                <div>
                  <p style={{
                    fontFamily: "var(--font-mono)", fontSize: 13,
                    color: "var(--muted)", letterSpacing: "0.1em",
                    textTransform: "uppercase", margin: "0 0 12px",
                  }}>
                    {t(lang, "hero_intro")}
                  </p>
                  <h1 style={{
                    fontSize: "clamp(48px, 7vw, 96px)",
                    lineHeight: 0.94, letterSpacing: "-0.04em",
                    fontWeight: 700, margin: 0,
                  }}>
                    Bannawit<br />
                    <span style={{ color: "var(--primary)", fontStyle: "italic", fontWeight: 500 }}>
                      Chaichomphu.
                    </span>
                  </h1>
                </div>
              </Reveal>

              <Reveal delay={120}>
                <p style={{
                  fontSize: 17, lineHeight: 1.55,
                  color: "var(--muted)", maxWidth: 480, margin: 0,
                }}>
                  {t(lang, "hero_sub")}
                </p>
              </Reveal>

              <Reveal delay={180}>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {contactRows.map(({ icon: Icon, labelKey, value }) => (
                    <div key={labelKey} style={{
                      display: "flex", alignItems: "center", gap: 14,
                      padding: "12px 14px",
                      border: "1px solid var(--line-soft)",
                      borderRadius: "var(--radius-sm)",
                      background: "color-mix(in oklab, var(--surface) 50%, transparent)",
                      transition: "all .25s var(--ease-out)",
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--primary)";
                      (e.currentTarget as HTMLElement).style.transform = "translateX(4px)";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--line-soft)";
                      (e.currentTarget as HTMLElement).style.transform = "translateX(0)";
                    }}>
                      <Icon size={16} style={{ color: "var(--primary)", flexShrink: 0 }} />
                      <span style={{
                        fontFamily: "var(--font-mono)", fontSize: 11,
                        color: "var(--muted)", letterSpacing: "0.1em",
                        textTransform: "uppercase", width: 70, flexShrink: 0,
                      }}>
                        {t(lang, labelKey)}
                      </span>
                      <span style={{ fontSize: 14, color: "var(--ink)" }}>
                        {labelKey === "contact_location" ? t(lang, "location_val") : value}
                      </span>
                    </div>
                  ))}
                </div>
              </Reveal>

              {/* CTA Buttons */}
              <Reveal delay={240}>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <Link href="/projects" className="btn btn-primary">
                    {t(lang, "cta_view_detail")}
                    <ArrowUpRight size={16} />
                  </Link>
                  <button onClick={() => setResumeOpen(true)} className="btn btn-ghost">
                    <Download size={16} />
                    {t(lang, "cta_resume")}
                  </button>
                </div>
              </Reveal>
            </div>

            {/* Right — Project Carousel */}
            <Reveal delay={100}>
              <div style={{ perspective: 1400 }}>
                {projects.length > 0 ? (
                  <ProjectCarousel items={projects} lang={lang} />
                ) : (
                  <div style={{
                    height: 580, display: "flex", alignItems: "center",
                    justifyContent: "center", background: "var(--surface)",
                    border: "1px solid var(--line)", borderRadius: "var(--radius-lg)",
                    position: "relative", overflow: "hidden",
                  }}>
                    <div className="ph-stripe" />
                    <p style={{
                      position: "relative", zIndex: 2,
                      fontFamily: "var(--font-mono)", fontSize: 12,
                      color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase",
                    }}>NO PROJECTS YET</p>
                  </div>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 01 · WORK ── */}
      <section style={{ padding: "80px 0" }}>
        <div className="container">
          <Reveal>
            <div style={{
              display: "flex", alignItems: "flex-end",
              justifyContent: "space-between", gap: 16, marginBottom: 36,
            }}>
              <div>
                <p style={{
                  fontFamily: "var(--font-mono)", fontSize: 11,
                  color: "var(--primary)", letterSpacing: "0.16em",
                  textTransform: "uppercase", margin: "0 0 8px",
                }}>01 · WORK</p>
                <h2 style={{
                  fontSize: "clamp(34px, 4vw, 52px)", fontWeight: 700,
                  letterSpacing: "-0.03em", margin: "0 0 8px",
                }}>
                  {t(lang, "section_featured")}
                </h2>
                <p style={{ color: "var(--muted)", margin: 0, fontSize: 15 }}>
                  {t(lang, "section_featured_sub")}
                </p>
              </div>
              <Link href="/projects" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "10px 20px", border: "1px solid var(--line)",
                borderRadius: "var(--radius-sm)", fontSize: 14, fontWeight: 600,
                color: "var(--ink)", textDecoration: "none", whiteSpace: "nowrap",
                transition: "all .2s var(--ease-out)",
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--primary)")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--line)")}>
                {t(lang, "cta_view_all")} <ArrowUpRight size={14} />
              </Link>
            </div>
          </Reveal>
          {projects.length > 0 ? (
            <HScroll>
              {projects.map(p => <ProjectHCard key={p.id} project={p} lang={lang} />)}
            </HScroll>
          ) : (
            <p style={{ color: "var(--muted)", fontSize: 14 }}>{t(lang, "no_projects")}</p>
          )}
        </div>
      </section>

      {/* ── 02 · CERTIFICATES ── */}
      <section style={{ padding: "80px 0" }}>
        <div className="container">
          <Reveal>
            <div style={{
              display: "flex", alignItems: "flex-end",
              justifyContent: "space-between", gap: 16, marginBottom: 36,
            }}>
              <div>
                <p style={{
                  fontFamily: "var(--font-mono)", fontSize: 11,
                  color: "var(--primary)", letterSpacing: "0.16em",
                  textTransform: "uppercase", margin: "0 0 8px",
                }}>02 · CERTIFICATES</p>
                <h2 style={{
                  fontSize: "clamp(34px, 4vw, 52px)", fontWeight: 700,
                  letterSpacing: "-0.03em", margin: "0 0 8px",
                }}>
                  {t(lang, "section_certs")}
                </h2>
                <p style={{ color: "var(--muted)", margin: 0, fontSize: 15 }}>
                  {t(lang, "section_certs_sub")}
                </p>
              </div>
              <Link href="/certificates" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "10px 20px", border: "1px solid var(--line)",
                borderRadius: "var(--radius-sm)", fontSize: 14, fontWeight: 600,
                color: "var(--ink)", textDecoration: "none", whiteSpace: "nowrap",
                transition: "all .2s var(--ease-out)",
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--primary)")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--line)")}>
                {t(lang, "cta_view_all")} <ArrowUpRight size={14} />
              </Link>
            </div>
          </Reveal>
          {certs.length > 0 ? (
            <HScroll>
              {certs.map(c => <CertHCard key={c.id} cert={c} lang={lang} />)}
            </HScroll>
          ) : (
            <p style={{ color: "var(--muted)", fontSize: 14 }}>{t(lang, "no_certs")}</p>
          )}
        </div>
      </section>

      {/* ── 03 · BEYOND THE WEB ── */}
      <section style={{ padding: "80px 0" }}>
        <div className="container">
          <Reveal>
            <p style={{
              fontFamily: "var(--font-mono)", fontSize: 11,
              color: "var(--primary)", letterSpacing: "0.16em",
              textTransform: "uppercase", margin: "0 0 8px",
            }}>03 · BEYOND THE WEB</p>
            <h2 style={{
              fontSize: "clamp(34px, 4vw, 52px)", fontWeight: 700,
              letterSpacing: "-0.03em", margin: "0 0 8px",
            }}>
              {t(lang, "section_other")}
            </h2>
            <p style={{ color: "var(--muted)", margin: "0 0 36px", fontSize: 15 }}>
              {t(lang, "section_other_sub")}
            </p>
          </Reveal>
          <div className="marquee">
            <div className="marquee-track">
              {OTHER_WORKS.map((w, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 14,
                  padding: "14px 20px",
                  border: "1px solid var(--line)", borderRadius: "var(--radius-sm)",
                  background: "var(--surface)", minWidth: 280,
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: "var(--radius-xs)",
                    background: "var(--surface-2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 18, flexShrink: 0,
                  }}>{w.icon}</div>
                  <div>
                    <p style={{
                      fontFamily: "var(--font-mono)", fontSize: 10,
                      letterSpacing: "0.12em", textTransform: "uppercase",
                      color: "var(--primary)", margin: "0 0 2px",
                    }}>{w.kind}</p>
                    <p style={{ fontWeight: 600, fontSize: 14, margin: 0 }}>{w.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ── */}
      <section style={{ padding: "40px 0 80px" }}>
        <div className="container">
          <div style={{
            background: "var(--surface)", border: "1px solid var(--line)",
            borderRadius: "var(--radius-lg)", padding: "64px 48px",
            textAlign: "center",
          }}>
            <p style={{
              fontFamily: "var(--font-mono)", fontSize: 11,
              color: "var(--primary)", letterSpacing: "0.2em",
              textTransform: "uppercase", margin: "0 0 16px",
            }}>LET'S BUILD</p>
            <h2 style={{
              fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 700,
              letterSpacing: "-0.03em", margin: "0 0 16px",
            }}>
              {t(lang, "footer_cta_title")}
            </h2>
            <p style={{ color: "var(--muted)", fontSize: 16, margin: "0 0 36px" }}>
              เปิดรับโอกาสงานเต็มเวลา ฝึกงาน หรือฟรีแลนซ์ ติดต่อมาได้เลยครับ
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={() => setContactOpen(true)} className="btn btn-primary">
                <Mail size={16} /> ติดต่อผม
              </button>
              <a href="https://github.com/Flame-Bannawit" target="_blank" rel="noopener noreferrer"
                className="btn btn-ghost">
                <GitBranch size={16} /> GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER BAR ── */}
      <footer style={{
        borderTop: "1px solid var(--line-soft)",
        padding: "20px 28px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        maxWidth: 1320, margin: "0 auto",
      }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--muted)" }}>
          © 2025 · BANNAWIT CHAICHOMPHU
        </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--muted)" }}>
          DESIGNED & BUILT WITH CARE
        </span>
      </footer>

      {/* ── MODALS ── */}
      <ResumeModal open={resumeOpen} onClose={() => setResumeOpen(false)} lang={lang} />
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} lang={lang} />

      <style>{`
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>
    </>
  );
}

// ── Project Carousel (3D) ─────────────────────────────
function ProjectCarousel({ items, lang }: { items: Project[]; lang: Lang }) {
  const [idx, setIdx] = useState(0);
  const [dragX, setDragX] = useState(0);
  const dragStart = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setIdx(i => (i + 1) % items.length), 5000);
  };

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [items.length]);

  const onPrev = () => { setIdx(i => (i - 1 + items.length) % items.length); resetTimer(); };
  const onNext = () => { setIdx(i => (i + 1) % items.length); resetTimer(); };

  return (
    <div style={{ position: "relative", height: 580 }}>
      <div style={{ position: "relative", width: "100%", height: "100%", perspective: 1400 }}
        onPointerDown={e => { dragStart.current = e.clientX; }}
        onPointerMove={e => { if (dragStart.current == null) return; setDragX(e.clientX - dragStart.current); }}
        onPointerUp={() => { if (Math.abs(dragX) > 80) dragX < 0 ? onNext() : onPrev(); setDragX(0); dragStart.current = null; }}
        onPointerLeave={() => { setDragX(0); dragStart.current = null; }}>
        {items.map((item, i) => {
          let pos = i - idx;
          if (pos > items.length / 2) pos -= items.length;
          if (pos < -items.length / 2) pos += items.length;
          const isActive = pos === 0;
          const desc = lang === "th" ? item.description_th : (item.description_en || item.description_th);
          return (
            <Link key={item.id} href={`/projects/${item.slug}`} style={{
              position: "absolute", top: "50%", left: "50%",
              width: 380, height: 480, marginLeft: -190, marginTop: -240,
              borderRadius: "var(--radius-lg)",
              background: "var(--surface)",
              border: `1px solid ${isActive ? "var(--primary)" : "var(--line)"}`,
              boxShadow: "var(--shadow-lift)", overflow: "hidden",
              transform: `translateX(${pos * 96 + dragX * 0.3}px) translateZ(${-Math.abs(pos) * 140}px) rotateY(${-pos * 28}deg)`,
              opacity: Math.abs(pos) > 2 ? 0 : 1,
              filter: `brightness(${pos === 0 ? 1 : 1 - Math.abs(pos) * 0.18})`,
              zIndex: items.length - Math.abs(pos),
              transition: "transform .9s var(--ease-out), opacity .9s var(--ease-out), filter .9s var(--ease-out)",
              cursor: isActive ? "pointer" : "grab",
              textDecoration: "none", display: "block",
            }}>
              <div style={{ height: 280, background: "var(--surface-2)", position: "relative", overflow: "hidden" }}>
                {item.cover_url
                  ? <img src={item.cover_url} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <div className="ph-stripe" />}
                <div style={{
                  position: "absolute", top: 16, left: 16, zIndex: 2,
                  fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em",
                  textTransform: "uppercase", color: "var(--muted)",
                  padding: "4px 8px", background: "var(--surface)",
                  border: "1px solid var(--line)", borderRadius: 4,
                }}>
                  {String(i + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                </div>
              </div>
              <div style={{ padding: 24 }}>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--primary)", margin: 0 }}>
                  {CATEGORY_LABELS[item.category][lang]}
                </p>
                <h3 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", margin: "8px 0 12px" }}>
                  {item.name}
                </h3>
                <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.45, margin: 0 }}>
                  {desc}
                </p>
                <div style={{ display: "flex", gap: 6, marginTop: 14, flexWrap: "wrap" }}>
                  {item.project_tech?.slice(0, 3).map(tech => (
                    <span key={tech.id} className="chip">{tech.tech_name}</span>
                  ))}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div style={{
        position: "absolute", bottom: -8, left: "50%", transform: "translateX(-50%)",
        display: "flex", alignItems: "center", gap: 12, zIndex: 10,
      }}>
        <button onClick={onPrev} style={{
          width: 34, height: 34, borderRadius: "50%",
          border: "1px solid var(--line)", background: "var(--surface)",
          fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        }}>‹</button>
        {items.map((_, i) => (
          <button key={i} onClick={() => { setIdx(i); resetTimer(); }} style={{
            width: idx === i ? 28 : 8, height: 8,
            borderRadius: idx === i ? 4 : "50%",
            background: idx === i ? "var(--primary)" : "var(--line)",
            border: "none", padding: 0, cursor: "pointer",
            transition: "all .3s var(--ease-out)",
          }} />
        ))}
        <button onClick={onNext} style={{
          width: 34, height: 34, borderRadius: "50%",
          border: "1px solid var(--line)", background: "var(--surface)",
          fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        }}>›</button>
      </div>
    </div>
  );
}

function ProjectHCard({ project, lang }: { project: Project; lang: Lang }) {
  const desc = lang === "th" ? project.description_th : (project.description_en || project.description_th);
  return (
    <Link href={`/projects/${project.slug}`} style={{
      width: 320, flexShrink: 0, textDecoration: "none",
      background: "var(--surface)", border: "1px solid var(--line)",
      borderRadius: "var(--radius-md)", overflow: "hidden", display: "block",
      transition: "all .35s var(--ease-out)",
    }}
    onMouseEnter={e => {
      (e.currentTarget as HTMLElement).style.borderColor = "var(--primary)";
      (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
    }}
    onMouseLeave={e => {
      (e.currentTarget as HTMLElement).style.borderColor = "var(--line)";
      (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
    }}>
      <div style={{ aspectRatio: "16/9", background: "var(--surface-2)", position: "relative", overflow: "hidden" }}>
        {project.cover_url
          ? <img src={project.cover_url} alt={project.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <div className="ph-stripe" />}
      </div>
      <div style={{ padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--primary)", letterSpacing: "0.14em", textTransform: "uppercase" }}>
            {CATEGORY_LABELS[project.category][lang]}
          </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--muted)" }}>
            {project.period_start} — {project.period_end}
          </span>
        </div>
        <h3 style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em", margin: "0 0 8px" }}>{project.name}</h3>
        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5, margin: 0 }}>{desc}</p>
      </div>
    </Link>
  );
}

function CertHCard({ cert, lang }: { cert: Certificate; lang: Lang }) {
  return (
    <div style={{
      width: 260, flexShrink: 0,
      background: "var(--surface)", border: "1px solid var(--line)",
      borderRadius: "var(--radius-md)", overflow: "hidden",
      transition: "border-color .3s var(--ease-out)",
    }}
    onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--primary)")}
    onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--line)")}>
      <div style={{ aspectRatio: "4/3", background: "var(--surface-2)", position: "relative", overflow: "hidden" }}>
        <img src={cert.image_url} alt={cert.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ padding: 16 }}>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--primary)", letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 6px" }}>
          {cert.issuer}
        </p>
        <h3 style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.01em", margin: "0 0 4px" }}>{cert.name}</h3>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--muted)", margin: 0 }}>{cert.issued_date}</p>
      </div>
    </div>
  );
}