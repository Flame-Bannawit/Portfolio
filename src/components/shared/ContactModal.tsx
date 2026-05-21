"use client";

import { X, Copy, Check, ExternalLink } from "lucide-react";
import { useState } from "react";
import type { Lang } from "@/types";

interface Props {
  open: boolean;
  onClose: () => void;
  lang: Lang;
}

interface ContactItem {
  id: string;
  label: string;
  value: string;
  href?: string;
  copyValue?: string;
  icon: React.ReactNode;
  color: string;
}

const contacts: ContactItem[] = [
  {
    id: "gmail",
    label: "Gmail",
    value: "tiwsuphawit@gmail.com",
    href: "mailto:tiwsuphawit@gmail.com",
    copyValue: "tiwsuphawit@gmail.com",
    color: "#EA4335",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
      </svg>
    ),
  },
  {
    id: "phone",
    label: "Phone",
    value: "099-034-1134",
    href: "tel:0990341134",
    copyValue: "0990341134",
    color: "#22c55e",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.69a16 16 0 0 0 6.29 6.29l.98-.98a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
    ),
  },
  {
    id: "line",
    label: "Line",
    value: "supawichtiw / 099-034-1134",
    href: "https://line.me/ti/p/~supawichtiw",
    copyValue: "supawichtiw",
    color: "#06C755",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.070 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
      </svg>
    ),
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    value: "bannawit-chaichomphu",
    href: "https://www.linkedin.com/in/bannawit-chaichomphu-61094b3b4",
    color: "#0A66C2",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    id: "github",
    label: "GitHub",
    value: "Flame-Bannawit",
    href: "https://github.com/Flame-Bannawit",
    color: "var(--ink)",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
      </svg>
    ),
  },
];

function ContactRow({ item }: { item: ContactItem }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const text = item.copyValue || item.value;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const content = (
    <div style={{
      display: "flex", alignItems: "center", gap: 14,
      padding: "14px 16px", flex: 1,
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: "var(--radius-xs)",
        background: "var(--surface)", border: "1px solid var(--line)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: item.color, flexShrink: 0,
      }}>
        {item.icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          margin: 0, fontSize: 11, fontFamily: "var(--font-mono)",
          color: "var(--muted)", letterSpacing: "0.1em",
          textTransform: "uppercase", marginBottom: 2,
        }}>
          {item.label}
        </p>
        <p style={{
          margin: 0, fontSize: 14, fontWeight: 600,
          color: "var(--ink)", overflow: "hidden",
          textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {item.value}
        </p>
      </div>
    </div>
  );

  return (
    <div style={{
      display: "flex", alignItems: "center",
      background: "var(--surface-2)", border: "1px solid var(--line)",
      borderRadius: "var(--radius-sm)", overflow: "hidden",
      transition: "border-color .2s var(--ease-out)",
    }}
    onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--primary)")}
    onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--line)")}>

      {/* Main clickable area */}
      {item.href ? (
        <a href={item.href}
          target={item.id !== "gmail" && item.id !== "phone" ? "_blank" : undefined}
          rel="noopener noreferrer"
          style={{ flex: 1, textDecoration: "none", display: "flex" }}>
          {content}
        </a>
      ) : (
        <div style={{ flex: 1 }}>{content}</div>
      )}

      {/* Divider */}
      <div style={{ width: 1, height: 40, background: "var(--line)", flexShrink: 0 }} />

      {/* Copy button */}
      {item.copyValue && (
        <button
          onClick={handleCopy}
          title="Copy"
          style={{
            width: 48, height: "100%", minHeight: 68,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "none", border: "none", cursor: "pointer",
            color: copied ? "var(--good)" : "var(--muted)",
            transition: "color .2s var(--ease-out)",
            flexShrink: 0,
          }}>
          {copied ? <Check size={15} /> : <Copy size={15} />}
        </button>
      )}

      {/* External link icon */}
      {item.href && !item.copyValue && (
        <a href={item.href}
          target="_blank" rel="noopener noreferrer"
          style={{
            width: 48, minHeight: 68,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--muted)", textDecoration: "none",
            transition: "color .2s var(--ease-out)",
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--primary)")}
          onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}>
          <ExternalLink size={14} />
        </a>
      )}
    </div>
  );
}

export default function ContactModal({ open, onClose, lang }: Props) {
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
          width: "100%", maxWidth: 440, position: "relative",
        }}>

        {/* Close */}
        <button onClick={onClose} style={{
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
          }}>Contact</p>
          <h3 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", margin: 0 }}>
            {lang === "th" ? "ติดต่อผม" : "Get in touch"}
          </h3>
        </div>

        {/* Contact list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {contacts.map(item => (
            <ContactRow key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}