"use client";

import { X, Download } from "lucide-react";
import type { Lang } from "@/types";

interface Props {
  open: boolean;
  onClose: () => void;
  lang: Lang;
}

const options = [
  {
    label: "ภาษาไทย",
    sublabel: "Resume_Bannawit_TH.pdf",
    href: "/resume-th.pdf",
    download: "Resume_Bannawit_TH.pdf",
  },
  {
    label: "English",
    sublabel: "Resume_Bannawit_EN.pdf",
    href: "/resume-en.pdf",
    download: "Resume_Bannawit_EN.pdf",
  },
];

export default function ResumeModal({ open, onClose, lang }: Props) {
  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24,
      }}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "var(--surface)", border: "1px solid var(--line)",
          borderRadius: "var(--radius-md)", padding: 32,
          width: "100%", maxWidth: 400, position: "relative",
        }}>

        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 16, right: 16,
            background: "none", border: "none", cursor: "pointer",
            color: "var(--muted)", display: "flex", padding: 4,
          }}>
          <X size={18} />
        </button>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <p style={{
            fontFamily: "var(--font-mono)", fontSize: 11,
            color: "var(--primary)", letterSpacing: "0.16em",
            textTransform: "uppercase", margin: "0 0 8px",
          }}>
            Resume / CV
          </p>
          <h3 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", margin: 0 }}>
            {lang === "th" ? "เลือกภาษาที่ต้องการ" : "Select Language"}
          </h3>
        </div>

        {/* Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {options.map(opt => (
            <ResumeOption key={opt.download} {...opt} onClose={onClose} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ResumeOption({ label, sublabel, href, download, onClose }: {
  label: string;
  sublabel: string;
  href: string;
  download: string;
  onClose: () => void;
}) {
  return (
    <a
      href={href}
      download={download}
      onClick={onClose}
      style={{
        display: "flex", alignItems: "center", gap: 16,
        padding: "16px 20px",
        background: "var(--surface-2)", border: "1px solid var(--line)",
        borderRadius: "var(--radius-sm)", textDecoration: "none",
        transition: "all .2s var(--ease-out)",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--primary)";
        (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--line)";
        (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
      }}>
      <div style={{
        width: 42, height: 42, borderRadius: "var(--radius-xs)",
        background: "color-mix(in oklab, var(--primary) 15%, var(--surface))",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "var(--primary)", flexShrink: 0,
      }}>
        <Download size={18} />
      </div>
      <div>
        <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: "var(--ink)" }}>
          {label}
        </p>
        <p style={{
          margin: 0, fontSize: 12, color: "var(--muted)",
          fontFamily: "var(--font-mono)",
        }}>
          {sublabel}
        </p>
      </div>
    </a>
  );
}