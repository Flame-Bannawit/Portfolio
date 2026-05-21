"use client";

import { useApp } from "@/components/shared/Providers";
import { t } from "@/lib/i18n/strings";

const education = [
  {
    when: "2021 — 2025",
    title: { th: "วิศวกรรมศาสตรบัณฑิต", en: "B.Eng Computer Engineering" },
    sub:   { th: "มหาวิทยาลัยรังสิต — คณะวิศวกรรมศาสตร์ สาขาวิศวกรรมคอมพิวเตอร์", en: "Rangsit University — Faculty of Engineering, Computer Engineering" },
  },
];

const experience = [
  {
    when: "2024",
    title: { th: "Freelance Web Developer", en: "Freelance Web Developer" },
    sub:   { th: "รับทำเว็บไซต์และระบบ Web Application สำหรับลูกค้าทั่วไป", en: "Built web applications and websites for various clients." },
  },
  {
    when: "2024",
    title: { th: "IoT & Hardware Project", en: "IoT & Hardware Project" },
    sub:   { th: "พัฒนาระบบ IoT ด้วย ESP32 และ Arduino สำหรับโครงงานมหาวิทยาลัย", en: "Developed IoT systems using ESP32 and Arduino for university projects." },
  },
];

const skills = [
  {
    group: { th: "Frontend", en: "Frontend" },
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
  },
  {
    group: { th: "Backend", en: "Backend" },
    items: ["Node.js", "Express", "PostgreSQL", "Supabase", "Prisma"],
  },
  {
    group: { th: "Data & ML", en: "Data & ML" },
    items: ["Python", "Pandas", "SQL", "Power BI", "Jupyter"],
  },
  {
    group: { th: "Tools & Others", en: "Tools & Others" },
    items: ["Docker", "Git", "n8n", "Arduino", "ESP32", "Figma"],
  },
];

const languages = [
  { name: { th: "ภาษาไทย",   en: "Thai" },    level: { th: "เจ้าของภาษา", en: "Native" } },
  { name: { th: "ภาษาอังกฤษ", en: "English" }, level: { th: "ระดับกลาง",   en: "Intermediate" } },
];

export default function AboutPage() {
  const { lang } = useApp();

  return (
    <section style={{ padding: "56px 0 100px" }}>
      <div className="container">

        <div style={{
          display: "grid", gridTemplateColumns: "1fr 2fr", gap: 64,
        }} className="about-grid">

          {/* Left — Photo */}
          <div>
            <div style={{
              aspectRatio: "4/5",
              borderRadius: "var(--radius-md)",
              background: "var(--surface-2)",
              border: "1px solid var(--line)",
              position: "relative", overflow: "hidden",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <div className="ph-stripe" />
              <p style={{
                position: "relative", zIndex: 2,
                fontFamily: "var(--font-mono)", fontSize: 11,
                color: "var(--muted)", padding: "6px 10px",
                background: "var(--surface)", borderRadius: 4,
                border: "1px solid var(--line)",
              }}>
                Photo
              </p>
            </div>
          </div>

          {/* Right — Bio */}
          <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>

            {/* Name & role */}
            <div>
              <p style={{
                fontFamily: "var(--font-mono)", fontSize: 13,
                color: "var(--primary)", letterSpacing: "0.14em",
                textTransform: "uppercase", margin: "0 0 8px",
              }}>
                Computer Engineer & Web Developer
              </p>
              <h1 style={{
                fontSize: 48, fontWeight: 700, letterSpacing: "-0.03em",
                lineHeight: 1, margin: "0 0 16px",
              }}>
                Bannawit<br />Chaichomphu
              </h1>
              <p style={{ color: "var(--muted)", lineHeight: 1.7, fontSize: 15.5, margin: 0, maxWidth: 560 }}>
                {t(lang, "hero_sub")}
              </p>
            </div>

            {/* Education */}
            <div>
              <h3 style={{
                fontFamily: "var(--font-mono)", fontSize: 11,
                letterSpacing: "0.18em", textTransform: "uppercase",
                color: "var(--muted)", margin: "0 0 16px",
              }}>
                {t(lang, "education")}
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {education.map((e, i) => (
                  <div key={i} style={{
                    display: "grid", gridTemplateColumns: "140px 1fr", gap: 24,
                    padding: "16px 0", borderTop: "1px solid var(--line-soft)",
                  }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--muted)", paddingTop: 2 }}>
                      {e.when}
                    </span>
                    <div>
                      <h4 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 600 }}>{e.title[lang]}</h4>
                      <p style={{ margin: 0, color: "var(--muted)", fontSize: 14, lineHeight: 1.55 }}>{e.sub[lang]}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div>
              <h3 style={{
                fontFamily: "var(--font-mono)", fontSize: 11,
                letterSpacing: "0.18em", textTransform: "uppercase",
                color: "var(--muted)", margin: "0 0 16px",
              }}>
                {t(lang, "experience")}
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {experience.map((e, i) => (
                  <div key={i} style={{
                    display: "grid", gridTemplateColumns: "140px 1fr", gap: 24,
                    padding: "16px 0", borderTop: "1px solid var(--line-soft)",
                  }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--muted)", paddingTop: 2 }}>
                      {e.when}
                    </span>
                    <div>
                      <h4 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 600 }}>{e.title[lang]}</h4>
                      <p style={{ margin: 0, color: "var(--muted)", fontSize: 14, lineHeight: 1.55 }}>{e.sub[lang]}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div>
              <h3 style={{
                fontFamily: "var(--font-mono)", fontSize: 11,
                letterSpacing: "0.18em", textTransform: "uppercase",
                color: "var(--muted)", margin: "0 0 20px",
              }}>
                {t(lang, "skills")}
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                {skills.map((s, i) => (
                  <div key={i}>
                    <p style={{
                      fontFamily: "var(--font-mono)", fontSize: 11,
                      color: "var(--primary)", letterSpacing: "0.12em",
                      textTransform: "uppercase", margin: "0 0 10px",
                    }}>
                      {s.group[lang]}
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {s.items.map(item => (
                        <span key={item} className="chip">{item}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div>
              <h3 style={{
                fontFamily: "var(--font-mono)", fontSize: 11,
                letterSpacing: "0.18em", textTransform: "uppercase",
                color: "var(--muted)", margin: "0 0 16px",
              }}>
                {t(lang, "languages")}
              </h3>
              <div style={{ display: "flex", gap: 12 }}>
                {languages.map((l, i) => (
                  <div key={i} style={{
                    padding: "12px 20px",
                    background: "var(--surface)", border: "1px solid var(--line)",
                    borderRadius: "var(--radius-sm)",
                  }}>
                    <p style={{ margin: "0 0 4px", fontWeight: 600, fontSize: 15 }}>{l.name[lang]}</p>
                    <p style={{ margin: 0, color: "var(--muted)", fontSize: 13, fontFamily: "var(--font-mono)" }}>
                      {l.level[lang]}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 800px) {
          .about-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>
    </section>
  );
}