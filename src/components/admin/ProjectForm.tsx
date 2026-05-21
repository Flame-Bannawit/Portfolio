"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getTechStacksByCategory } from "@/lib/supabase/queries";
import type { ProjectCategory, DeviceKind, TechStack } from "@/types";
import { CATEGORY_LABELS, DEVICE_LABELS } from "@/types";

interface TechEntry {
  tech_name: string;
  used_for: string;
  used_for_en: string;
}

interface FormData {
  name: string;
  category: ProjectCategory | "";
  description_th: string;
  description_en: string;
  period_start: string;
  period_end: string;
  devices: DeviceKind[];
  repo_url: string;
  live_url: string;
  status: "live" | "demo" | "local";
  techs: TechEntry[];
}

interface Props {
  onSuccess?: () => void;
  initialData?: Partial<FormData & { id: string; slug: string; cover_url: string }>;
}

const CATEGORIES: ProjectCategory[] = ["web_app", "software_eng", "data_analyst", "hardware", "automation"];
const DEVICES: DeviceKind[] = ["desktop", "tablet", "mobile", "hardware", "workflow"];

function slugify(text: string) {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").trim();
}

export default function ProjectForm({ onSuccess, initialData }: Props) {
  const isEdit = !!initialData?.id;
  const [form, setForm] = useState<FormData>({
    name:           initialData?.name           ?? "",
    category:       initialData?.category       ?? "",
    description_th: initialData?.description_th ?? "",
    description_en: initialData?.description_en ?? "",
    period_start:   initialData?.period_start   ?? "",
    period_end:     initialData?.period_end     ?? "",
    devices:        initialData?.devices        ?? ["desktop"],
    repo_url:       initialData?.repo_url       ?? "",
    live_url:       initialData?.live_url       ?? "",
    status:         initialData?.status         ?? "local",
    techs:          initialData?.techs          ?? [],
  });

  const [coverFile, setCoverFile]       = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>(initialData?.cover_url ?? "");
  const [availableTechs, setAvailableTechs] = useState<TechStack[]>([]);
  const [techSearch, setTechSearch]     = useState("");
  const [errors, setErrors]             = useState<Partial<Record<keyof FormData | "cover" | "urls", string>>>({});
  const [loading, setLoading]           = useState(false);
  const [toast, setToast]               = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!form.category) return;
    getTechStacksByCategory(form.category as ProjectCategory).then(setAvailableTechs);
  }, [form.category]);

  const set = (key: keyof FormData, value: any) =>
    setForm(f => ({ ...f, [key]: value }));

  const toggleDevice = (d: DeviceKind) =>
    set("devices", form.devices.includes(d)
      ? form.devices.filter(x => x !== d)
      : [...form.devices, d]);

  const toggleTech = (name: string) => {
    const exists = form.techs.find(t => t.tech_name === name);
    if (exists) {
      set("techs", form.techs.filter(t => t.tech_name !== name));
    } else {
      set("techs", [...form.techs, { tech_name: name, used_for: "", used_for_en: "" }]);
    }
  };

  const handleFile = (file: File) => {
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const validate = () => {
    const e: typeof errors = {};
    if (!form.name.trim())               e.name = "กรุณากรอกชื่อ project";
    if (!form.category)                  e.category = "กรุณาเลือกประเภท";
    if (form.description_th.length < 20) e.description_th = "รายละเอียดต้องมีอย่างน้อย 20 ตัวอักษร";
    if (!form.period_start)              e.period_start = "กรุณาเลือกวันที่เริ่ม";
    if (!form.period_end)                e.period_end = "กรุณาเลือกวันที่เสร็จ";
    if (form.period_start && form.period_end && form.period_end < form.period_start)
      e.period_end = "วันที่เสร็จต้องมากกว่าวันที่เริ่ม";
    if (!form.repo_url && !form.live_url) e.urls = "กรุณากรอกอย่างน้อย GitHub หรือ Live URL";
    if (!isEdit && !coverFile)           e.cover = "กรุณาอัปโหลดรูปปก";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const supabase = createClient();
      let cover_url = initialData?.cover_url ?? "";

      if (coverFile) {
        const ext  = coverFile.name.split(".").pop();
        const path = `${slugify(form.name)}-${Date.now()}.${ext}`;
        const { error: uploadErr } = await supabase.storage
          .from("project-covers")
          .upload(path, coverFile, { upsert: true });
        if (uploadErr) throw uploadErr;
        const { data: urlData } = supabase.storage
          .from("project-covers")
          .getPublicUrl(path);
        cover_url = urlData.publicUrl;
      }

      const slug = slugify(form.name);
      const projectPayload = {
        slug, cover_url,
        name:           form.name,
        category:       form.category as ProjectCategory,
        description_th: form.description_th,
        description_en: form.description_en || null,
        period_start:   form.period_start,
        period_end:     form.period_end,
        devices:        form.devices,
        repo_url:       form.repo_url || null,
        live_url:       form.live_url || null,
        status:         form.status,
      };

      let projectId = initialData?.id;

      if (isEdit && projectId) {
        const { error } = await supabase.from("projects").update(projectPayload).eq("id", projectId);
        if (error) throw error;
        await supabase.from("project_tech").delete().eq("project_id", projectId);
      } else {
        const { data, error } = await supabase.from("projects").insert(projectPayload).select().single();
        if (error) throw error;
        projectId = data.id;
      }

      if (form.techs.length > 0 && projectId) {
        const techRows = form.techs.map((t, i) => ({
          project_id:    projectId!,
          tech_name:     t.tech_name,
          used_for:      t.used_for     || null,
          used_for_en:   t.used_for_en  || null,
          display_order: i,
        }));
        const { error } = await supabase.from("project_tech").insert(techRows);
        if (error) throw error;
      }

      setToast(isEdit ? "แก้ไข project เรียบร้อย ✓" : "เพิ่ม project เรียบร้อย ✓");
      setTimeout(() => setToast(""), 3000);
      onSuccess?.();

    } catch (err: any) {
      setToast(`เกิดข้อผิดพลาด: ${err.message}`);
      setTimeout(() => setToast(""), 4000);
    } finally {
      setLoading(false);
    }
  };

  const filteredTechs = availableTechs.filter(t =>
    t.name.toLowerCase().includes(techSearch.toLowerCase())
  );

  return (
    <div>
      <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", margin: "0 0 28px" }}>
        {isEdit ? "แก้ไข Project" : "เพิ่ม Project"}
      </h2>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 0 }}>

        {/* Cover image */}
        <Field label="รูปปก *" error={errors.cover}>
          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
            style={{
              border: `2px dashed ${coverPreview ? "var(--primary)" : "var(--line)"}`,
              borderRadius: "var(--radius-md)",
              padding: coverPreview ? 0 : "36px 20px",
              textAlign: "center", cursor: "pointer",
              background: "var(--bg)",
              transition: "all .25s var(--ease-out)",
              overflow: "hidden", position: "relative",
            }}>
            {coverPreview ? (
              <>
                <img src={coverPreview} alt="cover" style={{
                  width: "100%", height: 200, objectFit: "cover", display: "block",
                }} />
                <button type="button"
                  onClick={e => { e.stopPropagation(); setCoverFile(null); setCoverPreview(""); }}
                  style={{
                    position: "absolute", top: 8, right: 8,
                    background: "var(--surface)", border: "1px solid var(--line)",
                    borderRadius: "50%", width: 28, height: 28,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer",
                  }}>
                  <X size={14} />
                </button>
              </>
            ) : (
              <>
                <div style={{
                  width: 48, height: 48, margin: "0 auto 12px",
                  background: "var(--surface-2)", borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--primary)",
                }}>
                  <Upload size={22} />
                </div>
                <p style={{ color: "var(--muted)", fontSize: 14, margin: 0 }}>คลิกหรือลากไฟล์มาวางที่นี่</p>
                <p style={{ color: "var(--muted-2)", fontSize: 12, margin: "4px 0 0" }}>PNG, JPG, WEBP (แนะนำ 16:9)</p>
              </>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        </Field>

        {/* Name */}
        <Field label="ชื่อ Project *" error={errors.name}>
          <input className="form-input" value={form.name}
            onChange={e => set("name", e.target.value)} placeholder="เช่น Pulse Inventory" />
        </Field>

        {/* Category */}
        <Field label="ประเภท *" error={errors.category}>
          <select className="form-input" value={form.category}
            onChange={e => set("category", e.target.value as ProjectCategory)}>
            <option value="">— เลือกประเภท —</option>
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{CATEGORY_LABELS[c].th}</option>
            ))}
          </select>
        </Field>

        {/* Devices */}
        <Field label="รองรับอุปกรณ์">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {DEVICES.map(d => (
              <button key={d} type="button" onClick={() => toggleDevice(d)} style={{
                padding: "6px 14px", borderRadius: "var(--radius-xs)",
                border: `1px solid ${form.devices.includes(d) ? "var(--primary)" : "var(--line)"}`,
                background: form.devices.includes(d)
                  ? "color-mix(in oklab, var(--primary) 12%, var(--surface))"
                  : "var(--surface)",
                color: form.devices.includes(d) ? "var(--primary)" : "var(--muted)",
                fontFamily: "var(--font-mono)", fontSize: 11.5, cursor: "pointer",
                transition: "all .2s var(--ease-out)",
              }}>
                {DEVICE_LABELS[d]}
              </button>
            ))}
          </div>
        </Field>

        {/* Period */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
          <Field label="วันที่เริ่ม *" error={errors.period_start}>
            <input type="date" className="form-input" value={form.period_start}
              onChange={e => set("period_start", e.target.value)} />
          </Field>
          <Field label="วันที่เสร็จ *" error={errors.period_end}>
            <input type="date" className="form-input" value={form.period_end}
              onChange={e => set("period_end", e.target.value)} />
          </Field>
        </div>

        {/* Description TH */}
        <Field label={`รายละเอียด (ภาษาไทย) * — ${form.description_th.length} ตัวอักษร`} error={errors.description_th}>
          <textarea className="form-input" rows={4} value={form.description_th}
            onChange={e => set("description_th", e.target.value)}
            placeholder="อธิบาย project นี้คืออะไร ทำอะไร แก้ปัญหาอะไร..." />
        </Field>

        {/* Description EN */}
        <Field label="รายละเอียด (English) — optional">
          <textarea className="form-input" rows={3} value={form.description_en}
            onChange={e => set("description_en", e.target.value)}
            placeholder="English description (optional — will fallback to Thai)" />
        </Field>

        {/* Tech Stack */}
        <Field label="Tech Stack">
          {form.category ? (
            <>
              <input className="form-input" placeholder="ค้นหา tech..."
                value={techSearch} onChange={e => setTechSearch(e.target.value)}
                style={{ marginBottom: 10 }} />
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                {filteredTechs.map(t => {
                  const selected = form.techs.some(x => x.tech_name === t.name);
                  return (
                    <button key={t.id} type="button" onClick={() => toggleTech(t.name)} style={{
                      padding: "6px 12px", borderRadius: "var(--radius-xs)",
                      border: `1px solid ${selected ? "var(--primary)" : "var(--line)"}`,
                      background: selected
                        ? "color-mix(in oklab, var(--primary) 12%, var(--surface))"
                        : "var(--surface)",
                      color: selected ? "var(--primary)" : "var(--ink-2)",
                      fontFamily: "var(--font-mono)", fontSize: 11.5, cursor: "pointer",
                      transition: "all .2s var(--ease-out)",
                    }}>
                      {selected && <span style={{ marginRight: 4 }}>✓</span>}
                      {t.name}
                    </button>
                  );
                })}
              </div>

              {/* Per-tech notes — TH + EN */}
              {form.techs.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <p style={{
                    fontFamily: "var(--font-mono)", fontSize: 11,
                    letterSpacing: "0.12em", textTransform: "uppercase",
                    color: "var(--muted)", margin: 0,
                  }}>
                    ใช้ทำอะไรใน project นี้?
                  </p>
                  {form.techs.map(t => (
                    <div key={t.tech_name} style={{
                      padding: "14px 16px",
                      background: "var(--surface-2)",
                      border: "1px solid var(--line-soft)",
                      borderRadius: "var(--radius-sm)",
                    }}>
                      <span style={{
                        fontFamily: "var(--font-mono)", fontSize: 12,
                        color: "var(--primary)", fontWeight: 700,
                        display: "block", marginBottom: 10,
                      }}>
                        {t.tech_name}
                      </span>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        <div>
                          <label style={{
                            fontFamily: "var(--font-mono)", fontSize: 10,
                            letterSpacing: "0.1em", textTransform: "uppercase",
                            color: "var(--muted)", display: "block", marginBottom: 4,
                          }}>ภาษาไทย</label>
                          <input className="form-input"
                            placeholder={`บทบาทของ ${t.tech_name}...`}
                            value={t.used_for}
                            onChange={e => set("techs", form.techs.map(x =>
                              x.tech_name === t.tech_name
                                ? { ...x, used_for: e.target.value }
                                : x
                            ))} />
                        </div>
                        <div>
                          <label style={{
                            fontFamily: "var(--font-mono)", fontSize: 10,
                            letterSpacing: "0.1em", textTransform: "uppercase",
                            color: "var(--muted)", display: "block", marginBottom: 4,
                          }}>English</label>
                          <input className="form-input"
                            placeholder={`Role of ${t.tech_name}...`}
                            value={t.used_for_en}
                            onChange={e => set("techs", form.techs.map(x =>
                              x.tech_name === t.tech_name
                                ? { ...x, used_for_en: e.target.value }
                                : x
                            ))} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <p style={{ color: "var(--muted)", fontSize: 13 }}>
              เลือกประเภท project ก่อนเพื่อแสดง tech stack
            </p>
          )}
        </Field>

        {/* Status */}
        <Field label="สถานะ Project *">
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {([
              { value: "live",  label: "🟢 Live",  desc: "Deploy แล้ว มีคนใช้จริง" },
              { value: "demo",  label: "🔵 Demo",  desc: "Deploy แล้ว แต่เป็น demo" },
              { value: "local", label: "⚫ Local", desc: "ยังไม่ Deploy มีแค่ Git" },
            ] as const).map(({ value, label, desc }) => (
              <label key={value} style={{
                display: "flex", alignItems: "flex-start", gap: 10,
                padding: "12px 16px", cursor: "pointer",
                border: `1px solid ${form.status === value ? "var(--primary)" : "var(--line)"}`,
                borderRadius: "var(--radius-sm)",
                background: form.status === value
                  ? "color-mix(in oklab, var(--primary) 10%, var(--surface))"
                  : "var(--surface)",
                transition: "all .2s var(--ease-out)",
                flex: 1, minWidth: 140,
              }}>
                <input type="radio" name="status" value={value}
                  checked={form.status === value}
                  onChange={() => set("status", value)}
                  style={{ marginTop: 2, accentColor: "var(--primary)" }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{label}</div>
                  <div style={{ color: "var(--muted)", fontSize: 12, marginTop: 2 }}>{desc}</div>
                </div>
              </label>
            ))}
          </div>
        </Field>

        {/* URLs */}
        <Field label="GitHub URL" error={errors.urls}>
          <input className="form-input" value={form.repo_url}
            onChange={e => set("repo_url", e.target.value)}
            placeholder="https://github.com/..." />
        </Field>
        <Field label="Live URL">
          <input className="form-input" value={form.live_url}
            onChange={e => set("live_url", e.target.value)}
            placeholder="https://..." />
        </Field>

        <button type="submit" disabled={loading} className="btn btn-primary"
          style={{ width: "fit-content", marginTop: 8 }}>
          {loading ? "กำลังบันทึก..." : isEdit ? "บันทึกการแก้ไข" : "เพิ่ม Project"}
        </button>
      </form>

      {toast && (
        <div style={{
          position: "fixed", bottom: 28, right: 28,
          background: "var(--ink)", color: "var(--bg)",
          padding: "14px 20px", borderRadius: "var(--radius-sm)",
          fontSize: 14, fontWeight: 600, boxShadow: "var(--shadow-lift)", zIndex: 200,
        }}>
          {toast}
        </div>
      )}
    </div>
  );
}

function Field({ label, error, children }: {
  label: string; error?: string; children: React.ReactNode;
}) {
  return (
    <div style={{ display: "grid", gap: 6, marginBottom: 16 }}>
      <label style={{
        fontFamily: "var(--font-mono)", fontSize: 11,
        letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)",
      }}>
        {label}
      </label>
      {children}
      {error && (
        <span style={{ color: "var(--accent)", fontFamily: "var(--font-mono)", fontSize: 11 }}>
          {error}
        </span>
      )}
    </div>
  );
}