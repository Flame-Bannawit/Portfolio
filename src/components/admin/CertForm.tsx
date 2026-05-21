"use client";

import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface FormData {
  name: string;
  issuer: string;
  issued_date: string;
  description_th: string;
  description_en: string;
  verify_url: string;
}

interface Props {
  onSuccess?: () => void;
  initialData?: Partial<FormData & { id: string; image_url: string }>;
}

export default function CertForm({ onSuccess, initialData }: Props) {
  const isEdit = !!initialData?.id;
  const [form, setForm] = useState<FormData>({
    name:           initialData?.name           ?? "",
    issuer:         initialData?.issuer         ?? "",
    issued_date:    initialData?.issued_date     ?? "",
    description_th: initialData?.description_th ?? "",
    description_en: initialData?.description_en ?? "",
    verify_url:     initialData?.verify_url     ?? "",
  });

  const [imageFile, setImageFile]       = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(initialData?.image_url ?? "");
  const [errors, setErrors]             = useState<Partial<Record<keyof FormData | "image", string>>>({});
  const [loading, setLoading]           = useState(false);
  const [toast, setToast]               = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (key: keyof FormData, value: string) =>
    setForm(f => ({ ...f, [key]: value }));

  const handleFile = (file: File) => {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const validate = () => {
    const e: typeof errors = {};
    if (!form.name.trim())           e.name = "กรุณากรอกชื่อใบรับรอง";
    if (!form.issuer.trim())         e.issuer = "กรุณากรอกชื่อผู้ออกใบรับรอง";
    if (!form.issued_date)           e.issued_date = "กรุณาเลือกวันที่";
    if (!form.description_th.trim()) e.description_th = "กรุณากรอกรายละเอียด";
    if (!isEdit && !imageFile)       e.image = "กรุณาอัปโหลดรูปใบรับรอง";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const supabase = createClient();
      let image_url = initialData?.image_url ?? "";

      if (imageFile) {
        const ext  = imageFile.name.split(".").pop();
        const path = `cert-${Date.now()}.${ext}`;
        const { error: uploadErr } = await supabase.storage
          .from("certificates")
          .upload(path, imageFile, { upsert: true });
        if (uploadErr) throw uploadErr;
        const { data: urlData } = supabase.storage
          .from("certificates")
          .getPublicUrl(path);
        image_url = urlData.publicUrl;
      }

      const payload = {
        name:           form.name,
        issuer:         form.issuer,
        issued_date:    form.issued_date,
        description_th: form.description_th,
        description_en: form.description_en || null,
        verify_url:     form.verify_url || null,
        image_url,
      };

      if (isEdit && initialData?.id) {
        const { error } = await supabase.from("certificates").update(payload).eq("id", initialData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("certificates").insert(payload);
        if (error) throw error;
      }

      setToast(isEdit ? "แก้ไขใบรับรองเรียบร้อย ✓" : "เพิ่มใบรับรองเรียบร้อย ✓");
      setTimeout(() => setToast(""), 3000);
      onSuccess?.();

    } catch (err: any) {
      setToast(`เกิดข้อผิดพลาด: ${err.message}`);
      setTimeout(() => setToast(""), 4000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", margin: "0 0 28px" }}>
        {isEdit ? "แก้ไข Certificate" : "เพิ่ม Certificate"}
      </h2>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 0 }}>

        {/* Image upload */}
        <Field label="รูปใบรับรอง *" error={errors.image}>
          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
            style={{
              border: `2px dashed ${imagePreview ? "var(--primary)" : "var(--line)"}`,
              borderRadius: "var(--radius-md)",
              padding: imagePreview ? 0 : "36px 20px",
              textAlign: "center", cursor: "pointer",
              background: "var(--bg)", overflow: "hidden", position: "relative",
            }}>
            {imagePreview ? (
              <>
                <img src={imagePreview} alt="cert" style={{
                  width: "100%", maxHeight: 280, objectFit: "contain", display: "block",
                  background: "var(--surface-2)",
                }} />
                <button type="button"
                  onClick={e => { e.stopPropagation(); setImageFile(null); setImagePreview(""); }}
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
                <p style={{ color: "var(--muted)", fontSize: 14, margin: 0 }}>คลิกหรือลากไฟล์รูปใบรับรอง</p>
                <p style={{ color: "var(--muted-2)", fontSize: 12, margin: "4px 0 0" }}>PNG, JPG, PDF preview</p>
              </>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        </Field>

        {/* Name */}
        <Field label="ชื่อใบรับรอง *" error={errors.name}>
          <input className="form-input" value={form.name}
            onChange={e => set("name", e.target.value)}
            placeholder="เช่น AWS Cloud Practitioner" />
        </Field>

        {/* Issuer */}
        <Field label="ออกโดย *" error={errors.issuer}>
          <input className="form-input" value={form.issuer}
            onChange={e => set("issuer", e.target.value)}
            placeholder="เช่น Amazon Web Services, Coursera × Google" />
        </Field>

        {/* Date */}
        <Field label="วันที่ได้รับ *" error={errors.issued_date}>
          <input type="date" className="form-input" value={form.issued_date}
            onChange={e => set("issued_date", e.target.value)} />
        </Field>

        {/* Description TH */}
        <Field label="รายละเอียด (ภาษาไทย) *" error={errors.description_th}>
          <textarea className="form-input" rows={3} value={form.description_th}
            onChange={e => set("description_th", e.target.value)}
            placeholder="อธิบายว่าได้เรียนอะไร ครอบคลุมหัวข้ออะไรบ้าง..." />
        </Field>

        {/* Description EN */}
        <Field label="รายละเอียด (English) — optional">
          <textarea className="form-input" rows={2} value={form.description_en}
            onChange={e => set("description_en", e.target.value)}
            placeholder="English description (optional)" />
        </Field>

        {/* Verify URL */}
        <Field label="ลิงก์ยืนยัน — optional">
          <input className="form-input" value={form.verify_url}
            onChange={e => set("verify_url", e.target.value)}
            placeholder="https://..." />
        </Field>

        <button type="submit" disabled={loading} className="btn btn-primary"
          style={{ width: "fit-content", marginTop: 8 }}>
          {loading ? "กำลังบันทึก..." : isEdit ? "บันทึกการแก้ไข" : "เพิ่ม Certificate"}
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