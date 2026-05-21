"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/components/shared/Providers";
import { getPublishedCertificates } from "@/lib/supabase/queries";
import type { Certificate } from "@/types";
import { t } from "@/lib/i18n/strings";
import { ExternalLink } from "lucide-react";

export default function CertificatesPage() {
  const { lang } = useApp();
  const [certs, setCerts]     = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublishedCertificates().then(c => { setCerts(c); setLoading(false); });
  }, []);

  return (
    <section style={{ padding: "56px 0 100px" }}>
      <div className="container">

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <p className="eyebrow" style={{ marginBottom: 12 }}>Achievements</p>
          <h1 style={{
            fontSize: "clamp(34px, 4vw, 52px)", fontWeight: 700,
            letterSpacing: "-0.03em", margin: "0 0 12px",
          }}>
            {t(lang, "certs_title")}
          </h1>
          <p style={{ color: "var(--muted)", fontSize: 16, margin: 0, maxWidth: 520 }}>
            {t(lang, "certs_sub")}
          </p>
        </div>

        {/* List */}
        {loading ? (
          <div style={{ textAlign: "center", padding: 80, color: "var(--muted)" }}>
            {t(lang, "loading")}
          </div>
        ) : certs.length === 0 ? (
          <div style={{ textAlign: "center", padding: 80, color: "var(--muted)" }}>
            {t(lang, "no_certs")}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {certs.map(cert => (
              <CertCard key={cert.id} cert={cert} lang={lang} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function CertCard({ cert, lang }: { cert: Certificate; lang: "th" | "en" }) {
  const desc = lang === "th"
    ? cert.description_th
    : (cert.description_en || cert.description_th);

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "320px 1fr",
      gap: 28, padding: 24,
      background: "var(--surface)",
      border: "1px solid var(--line)",
      borderRadius: "var(--radius-md)",
      transition: "border-color .3s var(--ease-out)",
    }}
    className="cert-card"
    onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--primary)")}
    onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--line)")}>

      {/* Image */}
      <div style={{
        aspectRatio: "4/3",
        background: "var(--surface-2)",
        borderRadius: "var(--radius-sm)",
        border: "1px solid var(--line-soft)",
        position: "relative", overflow: "hidden",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <img src={cert.image_url} alt={cert.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>

      {/* Body */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "4px 0" }}>
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: 11,
          color: "var(--primary)", letterSpacing: "0.14em",
          textTransform: "uppercase",
        }}>
          {cert.issuer}
        </span>

        <h2 style={{
          fontSize: 22, fontWeight: 700,
          letterSpacing: "-0.02em", margin: "4px 0 8px",
        }}>
          {cert.name}
        </h2>

        <span style={{
          fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--muted)",
        }}>
          {cert.issued_date}
        </span>

        <p style={{
          color: "var(--muted)", lineHeight: 1.6,
          margin: "6px 0 0", fontSize: 14.5,
        }}>
          {desc}
        </p>

        {cert.verify_url && (
          <a href={cert.verify_url} target="_blank" rel="noopener noreferrer"
            className="btn btn-ghost"
            style={{ width: "fit-content", marginTop: 12 }}>
            <ExternalLink size={14} />
            {t(lang, "cta_view_cert")}
          </a>
        )}
      </div>

      <style>{`
        @media (max-width: 800px) {
          .cert-card { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}