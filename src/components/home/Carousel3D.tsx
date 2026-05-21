"use client";

import { useEffect, useRef, useState } from "react";
import type { Project, Lang } from "@/types";
import { CATEGORY_LABELS } from "@/types";

interface Props {
  items: Project[];
  lang: Lang;
  onItemClick?: (p: Project) => void;
}

export default function Carousel3D({ items, lang, onItemClick }: Props) {
  const [idx, setIdx] = useState(0);
  const [dragX, setDragX] = useState(0);
  const dragStart = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setIdx((i) => (i + 1) % items.length);
    }, 5000);
  };

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [items.length]);

  const onPrev = () => { setIdx((i) => (i - 1 + items.length) % items.length); resetTimer(); };
  const onNext = () => { setIdx((i) => (i + 1) % items.length); resetTimer(); };

  const onPointerDown = (e: React.PointerEvent) => { dragStart.current = e.clientX; };
  const onPointerMove = (e: React.PointerEvent) => {
    if (dragStart.current == null) return;
    setDragX(e.clientX - dragStart.current);
  };
  const onPointerUp = () => {
    if (Math.abs(dragX) > 80) { dragX < 0 ? onNext() : onPrev(); }
    setDragX(0); dragStart.current = null;
  };

  if (!items.length) return null;

  return (
    <div style={{ position: "relative", height: 580, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* Stage */}
      <div
        style={{ position: "relative", width: "100%", height: "100%", perspective: 1400, cursor: "grab" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {items.map((item, i) => {
          let pos = i - idx;
          if (pos > items.length / 2) pos -= items.length;
          if (pos < -items.length / 2) pos += items.length;

          const angle  = pos * 28;
          const tx     = pos * 96 + dragX * 0.3;
          const tz     = -Math.abs(pos) * 140;
          const opacity = Math.abs(pos) > 2 ? 0 : 1;
          const brightness = Math.abs(pos) === 0 ? 1 : 1 - Math.abs(pos) * 0.18;
          const isActive = pos === 0;

          const desc = lang === "th"
            ? item.description_th
            : (item.description_en || item.description_th);

          return (
            <div
              key={item.id}
              onClick={() => isActive && onItemClick?.(item)}
              style={{
                position: "absolute",
                top: "50%", left: "50%",
                width: 380, height: 480,
                marginLeft: -190, marginTop: -240,
                borderRadius: "var(--radius-lg)",
                background: "var(--surface)",
                border: `1px solid ${isActive ? "var(--primary)" : "var(--line)"}`,
                boxShadow: "var(--shadow-lift)",
                overflow: "hidden",
                transform: `translateX(${tx}px) translateZ(${tz}px) rotateY(${-angle}deg)`,
                opacity,
                filter: `brightness(${brightness})`,
                zIndex: items.length - Math.abs(pos),
                transition: "transform .9s var(--ease-out), opacity .9s var(--ease-out), filter .9s var(--ease-out), border-color .3s",
                cursor: isActive ? "pointer" : "grab",
                userSelect: "none",
              }}
            >
              {/* Cover image */}
              <div style={{
                height: 280,
                background: "var(--surface-2)",
                position: "relative", overflow: "hidden",
              }}>
                {item.cover_url ? (
                  <img src={item.cover_url} alt={item.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div className="ph-stripe" />
                )}
                {/* Index badge */}
                <div style={{
                  position: "absolute", top: 16, left: 16, zIndex: 2,
                  fontFamily: "var(--font-mono)", fontSize: 10,
                  letterSpacing: "0.12em", textTransform: "uppercase",
                  color: "var(--muted)", padding: "4px 8px",
                  background: "var(--surface)", border: "1px solid var(--line)",
                  borderRadius: 4,
                }}>
                  {String(i + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                </div>
                {/* Category badge */}
                <div style={{
                  position: "absolute", top: 16, right: 16, zIndex: 2,
                  fontFamily: "var(--font-mono)", fontSize: 10,
                  letterSpacing: "0.12em", textTransform: "uppercase",
                  color: "var(--primary)", padding: "4px 8px",
                  background: "var(--surface)", border: "1px solid var(--line)",
                  borderRadius: 4,
                }}>
                  {CATEGORY_LABELS[item.category][lang]}
                </div>
              </div>

              {/* Meta */}
              <div style={{ padding: 24 }}>
                <p style={{
                  fontFamily: "var(--font-mono)", fontSize: 10.5,
                  letterSpacing: "0.16em", textTransform: "uppercase",
                  color: "var(--primary)", margin: 0,
                }}>
                  {item.period_start} — {item.period_end}
                </p>
                <h3 style={{
                  fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em",
                  margin: "8px 0 12px",
                }}>
                  {item.name}
                </h3>
                <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.45, margin: 0 }}>
                  {desc}
                </p>
                <div style={{ display: "flex", gap: 6, marginTop: 14, flexWrap: "wrap" }}>
                  {item.project_tech?.slice(0, 3).map((t) => (
                    <span key={t.id} className="chip">{t.tech_name}</span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div style={{
        position: "absolute", bottom: -8, left: "50%",
        transform: "translateX(-50%)",
        display: "flex", alignItems: "center", gap: 12, zIndex: 10,
      }}>
        <button onClick={onPrev} className="icon-btn" style={{ width: 34, height: 34 }}
          aria-label="Previous">
          ‹
        </button>
        {items.map((_, i) => (
          <button key={i} onClick={() => { setIdx(i); resetTimer(); }}
            style={{
              width: idx === i ? 28 : 8,
              height: 8, borderRadius: idx === i ? 4 : "50%",
              background: idx === i ? "var(--primary)" : "var(--line)",
              border: "none", padding: 0,
              transition: "all .3s var(--ease-out)", cursor: "pointer",
            }}
            aria-label={`Go to ${i + 1}`}
          />
        ))}
        <button onClick={onNext} className="icon-btn" style={{ width: 34, height: 34 }}
          aria-label="Next">
          ›
        </button>
      </div>
    </div>
  );
}