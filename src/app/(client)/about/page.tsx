"use client";

import { useApp } from "@/components/shared/Providers";
import { t } from "@/lib/i18n/strings";
import { Mail, GitBranch, ExternalLink } from "lucide-react";

const education = [
  {
    when: "2565 — 2569",
    title: { th: "วิศวกรรมศาสตรบัณฑิต (วศ.บ.)", en: "B.Eng Computer Engineering" },
    sub:   { th: "มหาวิทยาลัยรังสิต — คณะวิศวกรรมศาสตร์ สาขาวิศวกรรมคอมพิวเตอร์", en: "Rangsit University — Faculty of Engineering, Computer Engineering" },
  },
];

const experience = [
  {
    when: { th: "2567", en: "2024" },
    title: { th: "นักศึกษาฝึกงาน — กองทัพ", en: "Intern — Military (Royal Thai Army)" },
    sub:   { th: "ฝึกงานด้านระบบสารสนเทศและเทคโนโลยีสารสนเทศ ประยุกต์ใช้ความรู้ด้านคอมพิวเตอร์ในองค์กร", en: "Internship in information systems and IT. Applied computer engineering knowledge in an organizational setting." },
  },
  {
    when: { th: "2566 — ปัจจุบัน", en: "2023 — Present" },
    title: { th: "Freelance Full-Stack Developer", en: "Freelance Full-Stack Developer" },
    sub:   { th: "รับพัฒนาเว็บแอปพลิเคชันและระบบ Full-Stack สำหรับลูกค้าทั่วไป ครอบคลุมตั้งแต่ออกแบบ พัฒนา จนถึง Deploy", en: "Built full-stack web applications end-to-end for various clients, from system design to cloud deployment." },
  },
  {
    when: { th: "2566 — 2567", en: "2023 — 2024" },
    title: { th: "IoT & Hardware Developer", en: "IoT & Hardware Developer" },
    sub:   { th: "พัฒนาระบบ IoT ด้วย ESP32 และ Arduino สำหรับโครงงานมหาวิทยาลัย เช่น ระบบวัดคุณภาพอากาศ และ Smart Lock", en: "Developed IoT systems using ESP32 and Arduino, including air-quality monitoring and smart lock projects." },
  },
];

const skills = [
  {
    group: { th: "Frontend", en: "Frontend" },
    items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "JavaScript", "Vue.js"],
  },
  {
    group: { th: "Backend", en: "Backend" },
    items: ["Node.js", "Express.js", "Go (Golang)", "Python", "REST API", "WebSocket"],
  },
  {
    group: { th: "Database", en: "Database" },
    items: ["MySQL", "MongoDB", "Supabase", "Firebase", "PostgreSQL"],
  },
  {
    group: { th: "Cloud & DevOps", en: "Cloud & DevOps" },
    items: ["Docker", "Vercel", "Azure", "AWS", "Google Cloud", "Git"],
  },
  {
    group: { th: "API & Integration", en: "API & Integration" },
    items: ["Stripe", "Google Maps API", "Gemini AI", "LINE OA API", "SEO"],
  },
  {
    group: { th: "Tools", en: "Tools" },
    items: ["Figma", "Postman", "Jira", "Cypress", "Selenium", "n8n"],
  },
];

const languages = [
  { name: { th: "ภาษาไทย",    en: "Thai" },    level: { th: "เจ้าของภาษา",  en: "Native" } },
  { name: { th: "ภาษาอังกฤษ", en: "English" }, level: { th: "ระดับกลาง",    en: "Intermediate" } },
];

const socials = [
  {
    label: "GitHub",
    href: "https://github.com/Flame-Bannawit",
    icon: <GitBranch size={16} />,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/bannawit-chaichomphu-61094b3b4",
    icon: <ExternalLink size={16} />,
  },
  {
    label: "Email",
    href: "mailto:tiwsuphawit@gmail.com",
    icon: <Mail size={16} />,
  },
];

export default function AboutPage() {
  const { lang } = useApp();

  const bio = lang === "th" ? {
    p1: "นักพัฒนา Full-Stack ที่หลงใหลในการสร้างระบบที่ใช้งานได้จริง ตั้งแต่ออกแบบ พัฒนา จนถึง Deploy บน Cloud ด้วยตัวเองทั้งหมด มีประสบการณ์สร้างกว่า 5 โปรเจกต์จริง ครอบคลุมทั้ง Marketplace, Realtime System และ AI Integration โดยไม่ต้องรอให้ใครสอน",
    p2: "เชื่อว่าโค้ดที่ดีต้องแก้ปัญหาจริงได้ ไม่ใช่แค่รันผ่าน พร้อมเรียนรู้สิ่งใหม่ตลอดเวลา และพร้อมนำทักษะมาสร้างคุณค่าให้ทีมได้ทันที",
  } : {
    p1: "A self-driven Full-Stack Developer who builds things end-to-end — from system design to cloud deployment, independently. Delivered 5+ real-world projects spanning marketplaces, real-time systems, and AI-powered web apps. I don't wait to be taught; I figure it out and ship it.",
    p2: "I believe good code solves real problems. Always learning, always building — and ready to contribute from day one.",
  };

  return (
    <section style={{ padding: "56px 0 100px" }}>
      <div className="container">
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 2fr", gap: 64,
        }} className="about-grid">

          {/* Left — Photo */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{
              aspectRatio: "4/5",
              borderRadius: "var(--radius-md)",
              background: "var(--surface-2)",
              border: "1px solid var(--line)",
              position: "relative", overflow: "hidden",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {/* แทนที่ src ด้วย path รูปจริงครับ */}
              <img
                src="/profile.jpg"
                alt="Bannawit Chaichomphu"
                style={{ width: "100%", height: "100%", objectFit: "cover", position: "relative", zIndex: 2 }}
              />
            </div>

            {/* Social links */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {socials.map(s => (
                <a key={s.label} href={s.href}
                  target={s.label !== "Email" ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 14px",
                    background: "var(--surface)", border: "1px solid var(--line)",
                    borderRadius: "var(--radius-sm)", textDecoration: "none",
                    fontSize: 14, fontWeight: 500, color: "var(--ink)",
                    transition: "all .2s var(--ease-out)",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--primary)";
                    (e.currentTarget as HTMLElement).style.color = "var(--primary)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--line)";
                    (e.currentTarget as HTMLElement).style.color = "var(--ink)";
                  }}>
                  <span style={{ color: "var(--primary)" }}>{s.icon}</span>
                  {s.label}
                </a>
              ))}
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
                Computer Engineer & Full-Stack Developer
              </p>
              <h1 style={{
                fontSize: 48, fontWeight: 700, letterSpacing: "-0.03em",
                lineHeight: 1, margin: "0 0 20px",
              }}>
                Bannawit<br />Chaichomphu
              </h1>
              <p style={{ color: "var(--muted)", lineHeight: 1.7, fontSize: 15.5, margin: "0 0 12px" }}>
                {bio.p1}
              </p>
              <p style={{ color: "var(--muted)", lineHeight: 1.7, fontSize: 15.5, margin: 0 }}>
                {bio.p2}
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
                      {e.when[lang]}
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
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
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