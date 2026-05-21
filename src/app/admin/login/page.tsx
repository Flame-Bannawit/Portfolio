"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Shield, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email, password,
    });

    if (authError) {
      setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      setLoading(false);
      return;
    }

    // Check is_admin
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user!.id)
      .single();

    if (!profile?.is_admin) {
      setError("คุณไม่มีสิทธิ์เข้าถึงหน้านี้");
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "var(--bg)", padding: 24,
    }}>
      <div style={{
        width: "100%", maxWidth: 400,
        background: "var(--surface)",
        border: "1px solid var(--line)",
        borderRadius: "var(--radius-md)",
        padding: 40,
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 48, height: 48,
            background: "var(--primary)",
            borderRadius: "var(--radius-sm)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px",
          }}>
            <Shield size={24} color="#fff" />
          </div>
          <h1 style={{
            fontSize: 24, fontWeight: 700,
            letterSpacing: "-0.02em", margin: "0 0 8px",
          }}>
            Admin Login
          </h1>
          <p style={{ color: "var(--muted)", fontSize: 14, margin: 0 }}>
            เข้าสู่ระบบผู้ดูแลเว็บไซต์
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Email */}
          <div style={{ display: "grid", gap: 6 }}>
            <label style={{
              fontFamily: "var(--font-mono)", fontSize: 11,
              letterSpacing: "0.12em", textTransform: "uppercase",
              color: "var(--muted)",
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
              className="form-input"
            />
          </div>

          {/* Password */}
          <div style={{ display: "grid", gap: 6 }}>
            <label style={{
              fontFamily: "var(--font-mono)", fontSize: 11,
              letterSpacing: "0.12em", textTransform: "uppercase",
              color: "var(--muted)",
            }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="form-input"
                style={{ paddingRight: 44 }}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                style={{
                  position: "absolute", right: 12, top: "50%",
                  transform: "translateY(-50%)",
                  background: "none", border: "none",
                  color: "var(--muted)", cursor: "pointer",
                  display: "flex", alignItems: "center",
                }}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              padding: "10px 14px",
              background: "color-mix(in oklab, var(--accent) 12%, var(--surface))",
              border: "1px solid color-mix(in oklab, var(--accent) 30%, transparent)",
              borderRadius: "var(--radius-sm)",
              color: "var(--accent)", fontSize: 13,
            }}>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: "100%", justifyContent: "center", marginTop: 8 }}
          >
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>

        {/* Back */}
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <a href="/" style={{
            color: "var(--muted)", fontSize: 13,
            fontFamily: "var(--font-mono)",
          }}>
            ← กลับหน้าหลัก
          </a>
        </div>
      </div>
    </div>
  );
}