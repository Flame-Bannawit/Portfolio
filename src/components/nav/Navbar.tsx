"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun, Shield, Menu, X } from "lucide-react";
import { useState } from "react";
import { useApp } from "@/components/shared/Providers";
import { t } from "@/lib/i18n/strings";

const navLinks = [
  { key: "nav_home",     href: "/" },
  { key: "nav_projects", href: "/projects" },
  { key: "nav_certs",    href: "/certificates" },
  { key: "nav_about",    href: "/about" },
] as const;

export default function Navbar() {
  const { theme, setTheme, lang, setLang, isAdmin } = useApp();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 50,
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      background: "color-mix(in oklab, var(--bg) 78%, transparent)",
      borderBottom: "1px solid var(--line-soft)",
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 24,
        padding: "16px 28px", maxWidth: 1320, margin: "0 auto",
      }}>

        {/* Brand */}
        <Link href="/" style={{
          display: "flex", alignItems: "center", gap: 10,
          fontWeight: 700, fontSize: 17, letterSpacing: "-0.02em",
          color: "var(--ink)", textDecoration: "none",
        }}>
          <span style={{
            width: 28, height: 28,
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            background: "var(--primary)", color: "#fff",
            borderRadius: "var(--radius-xs)",
            fontWeight: 700, fontSize: 14,
            fontFamily: "var(--font-mono)",
          }}>B</span>
          <span>Bannawit</span>
          <span style={{ color: "var(--muted)", fontSize: 13, fontFamily: "var(--font-mono)" }}>
            /portfolio
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hide-mobile" style={{ display: "flex", gap: 4, marginLeft: 12 }}>
          {navLinks.map(({ key, href }) => (
            <Link key={href} href={href} style={{
              padding: "8px 14px",
              borderRadius: "var(--radius-sm)",
              fontSize: 14, fontWeight: 500,
              color: isActive(href) ? "var(--ink)" : "var(--muted)",
              background: "transparent",
              textDecoration: "none",
              position: "relative",
              transition: "all .2s var(--ease-out)",
            }}>
              {t(lang, key)}
              {isActive(href) && (
                <span style={{
                  position: "absolute", left: 14, right: 14, bottom: 2,
                  height: 2, background: "var(--primary)",
                  borderRadius: 2, display: "block",
                }} />
              )}
            </Link>
          ))}
        </div>

        {/* Right group */}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>

          {/* Lang toggle */}
        <div style={{
            display: "inline-flex", alignItems: "center",
            background: "var(--surface)", border: "1px solid var(--line)",
            borderRadius: 999, padding: 3,
        }}>
            {(["th", "en"] as const).map((l) => (
                <button key={l} onClick={() => setLang(l)} style={{
                    border: "none", padding: "5px 12px",
                    fontSize: 12, fontFamily: "var(--font-mono)", fontWeight: 600,
                    borderRadius: 999, letterSpacing: "0.04em", textTransform: "uppercase",
                    cursor: "pointer",
                    background: lang === l
                        ? "var(--primary)"
                        : "transparent",
                    color: lang === l
                        ? "#0a0a0c"
                        : "var(--muted)",
                    transition: "all .2s var(--ease-out)",
                }}>
                    {l.toUpperCase()}
                </button>
            ))}
        </div>

          {/* Theme toggle */}
          <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="icon-btn" aria-label="Toggle theme">
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Admin button */}
          {isAdmin ? (
            <Link href="/admin" style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "8px 14px",
              background: "var(--primary)", color: "#0a0a0c",
              borderRadius: "var(--radius-sm)",
              fontSize: 13, fontWeight: 700,
              textDecoration: "none",
            }}>
              <Shield size={14} />
              Admin
            </Link>
          ) : (
            <Link href="/admin/login" className="hide-mobile" style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "8px 14px",
              border: "1px solid var(--line)",
              background: "transparent", color: "var(--muted)",
              borderRadius: "var(--radius-sm)",
              fontSize: 13, fontWeight: 500,
              textDecoration: "none",
            }}>
              <Shield size={13} />
              {t(lang, "nav_admin")}
            </Link>
          )}

          {/* Hamburger (mobile) */}
          <button
            className="icon-btn"
            style={{ display: "none" }}
            id="hamburger-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          borderTop: "1px solid var(--line-soft)",
          background: "var(--surface)",
          padding: "12px 16px 16px",
        }}>
          {navLinks.map(({ key, href }) => (
            <Link key={href} href={href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: "block", padding: "12px 14px",
                borderRadius: "var(--radius-sm)",
                fontSize: 15, fontWeight: 500,
                color: isActive(href) ? "var(--primary)" : "var(--ink)",
                textDecoration: "none",
              }}>
              {t(lang, key)}
            </Link>
          ))}
          <Link href="/admin/login"
            onClick={() => setMenuOpen(false)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "12px 14px", marginTop: 8,
              borderTop: "1px solid var(--line-soft)",
              color: "var(--muted)", fontSize: 14,
              textDecoration: "none",
            }}>
            <Shield size={13} />
            {t(lang, "nav_admin")}
          </Link>
        </div>
      )}

      {/* Mobile hamburger show via CSS */}
      <style>{`
        @media (max-width: 768px) {
          #hamburger-btn { display: inline-flex !important; }
          .hide-mobile { display: none !important; }
        }
      `}</style>
    </nav>
  );
}