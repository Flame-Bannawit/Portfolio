"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard, FolderPlus, Award, Edit3,
  LogOut, ArrowLeft, BarChart2
} from "lucide-react";
import { getPageViewStats, getAllProjects, getAllCertificates } from "@/lib/supabase/queries";
import type { Project, Certificate } from "@/types";
import { CATEGORY_LABELS } from "@/types";
import ProjectForm from "@/components/admin/ProjectForm";
import CertForm from "@/components/admin/CertForm";
import SortableProjectList from "@/components/admin/SortableProjectList";

type AdminPage = "dashboard" | "add-project" | "add-cert" | "edit";

export default function AdminDashboard() {
  const router = useRouter();
  const [activePage, setActivePage] = useState<AdminPage>("dashboard");
  const [stats, setStats] = useState({ total: 0, today: 0, byPath: [] as { path: string; count: number }[] });
  const [projects, setProjects] = useState<Project[]>([]);
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const [s, p, c] = await Promise.all([
      getPageViewStats(),
      getAllProjects(),
      getAllCertificates(),
    ]);
    setStats(s);
    setProjects(p);
    setCerts(c);
    setLoading(false);
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const navItems = [
    { id: "dashboard",   label: "Dashboard",        icon: LayoutDashboard },
    { id: "add-project", label: "เพิ่ม Project",    icon: FolderPlus },
    { id: "add-cert",    label: "เพิ่ม Certificate", icon: Award },
    { id: "edit",        label: "แก้ไขข้อมูล",      icon: Edit3 },
  ] as const;

  return (
    <div style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "240px 1fr", background: "var(--bg)" }}>
      <aside style={{
        background: "var(--surface)", borderRight: "1px solid var(--line)",
        padding: "24px 20px", display: "flex", flexDirection: "column", gap: 4,
        position: "sticky", top: 0, height: "100vh", overflowY: "auto",
      }}>
        <div style={{
          fontWeight: 700, letterSpacing: "-0.02em",
          padding: "4px 12px 24px",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <span style={{
            width: 28, height: 28,
            background: "var(--primary)", color: "#fff",
            borderRadius: "var(--radius-xs)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 700,
          }}>B</span>
          Admin Panel
        </div>

        {navItems.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActivePage(id)} style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "10px 12px", borderRadius: "var(--radius-sm)",
            fontSize: 14, fontWeight: 500, width: "100%",
            border: "none", textAlign: "left", cursor: "pointer",
            background: activePage === id ? "var(--primary)" : "transparent",
            color: activePage === id ? "#0a0a0c" : "var(--muted)",
            transition: "all .2s var(--ease-out)",
          }}>
            <Icon size={16} />
            {label}
          </button>
        ))}

        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 4 }}>
          <a href="/" style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "10px 12px", borderRadius: "var(--radius-sm)",
            fontSize: 14, color: "var(--muted)", textDecoration: "none",
          }}>
            <ArrowLeft size={16} /> กลับหน้าหลัก
          </a>
          <button onClick={handleSignOut} style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "10px 12px", borderRadius: "var(--radius-sm)",
            fontSize: 14, color: "var(--accent)",
            background: "transparent", border: "none", cursor: "pointer", width: "100%",
          }}>
            <LogOut size={16} /> ออกจากระบบ
          </button>
        </div>
      </aside>

      <main style={{ padding: "36px 40px", minWidth: 0, overflowY: "auto" }}>
        {activePage === "dashboard" && (
          <DashboardView stats={stats} projects={projects} certs={certs} loading={loading} />
        )}
        {activePage === "add-project" && (
          <ProjectForm onSuccess={() => { loadData(); setActivePage("edit"); }} />
        )}
        {activePage === "add-cert" && (
          <CertForm onSuccess={() => { loadData(); setActivePage("edit"); }} />
        )}
        {activePage === "edit" && (
          <EditView projects={projects} certs={certs} onRefresh={loadData} />
        )}
      </main>
    </div>
  );
}

function DashboardView({ stats, projects, certs, loading }: {
  stats: { total: number; today: number; byPath: { path: string; count: number }[] };
  projects: Project[];
  certs: Certificate[];
  loading: boolean;
}) {
  const statCards = [
    { label: "Total Views",  value: stats.total,     delta: "+today" },
    { label: "Today",        value: stats.today,     delta: "pageviews" },
    { label: "Projects",     value: projects.length, delta: "published" },
    { label: "Certificates", value: certs.length,    delta: "total" },
  ];

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 30, fontWeight: 700, letterSpacing: "-0.02em", margin: 0 }}>Dashboard</h2>
        <p style={{ color: "var(--muted)", marginTop: 4, fontSize: 14 }}>ภาพรวมของเว็บไซต์</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
        {statCards.map(({ label, value, delta }) => (
          <div key={label} style={{
            padding: 20, background: "var(--surface)",
            border: "1px solid var(--line)", borderRadius: "var(--radius-md)",
          }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted)" }}>{label}</div>
            <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.02em", marginTop: 6 }}>
              {loading ? "—" : value}
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--good)", marginTop: 2 }}>{delta}</div>
          </div>
        ))}
      </div>
      <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-md)", padding: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <BarChart2 size={18} style={{ color: "var(--primary)" }} />
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Top Pages</h3>
        </div>
        {stats.byPath.length === 0 ? (
          <p style={{ color: "var(--muted)", fontSize: 14 }}>ยังไม่มีข้อมูล</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {stats.byPath.map(({ path, count }) => (
              <div key={path} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 14px", background: "var(--surface-2)", borderRadius: "var(--radius-sm)",
              }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, flex: 1 }}>{path}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--primary)", fontWeight: 700 }}>{count}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function EditView({ projects, certs, onRefresh }: {
  projects: Project[];
  certs: Certificate[];
  onRefresh: () => void;
}) {
  const [tab, setTab]                       = useState<"projects" | "certs" | "order">("projects");
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingCert, setEditingCert]       = useState<Certificate | null>(null);

  const handleDeleteProject = async (id: string) => {
    if (!confirm("ลบ project นี้?")) return;
    const { deleteProject } = await import("@/lib/supabase/queries");
    await deleteProject(id);
    onRefresh();
  };

  const handleDeleteCert = async (id: string) => {
    if (!confirm("ลบ certificate นี้?")) return;
    const { deleteCertificate } = await import("@/lib/supabase/queries");
    await deleteCertificate(id);
    onRefresh();
  };

  if (editingProject) {
    return (
      <div>
        <button onClick={() => setEditingProject(null)} style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          color: "var(--muted)", fontFamily: "var(--font-mono)",
          fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase",
          background: "none", border: "none", cursor: "pointer", marginBottom: 24,
        }}>
          ← กลับ
        </button>
        <ProjectForm
          initialData={{
            id:             editingProject.id,
            slug:           editingProject.slug,
            name:           editingProject.name,
            category:       editingProject.category,
            description_th: editingProject.description_th,
            description_en: editingProject.description_en ?? "",
            period_start:   editingProject.period_start,
            period_end:     editingProject.period_end,
            devices:        editingProject.devices,
            repo_url:       editingProject.repo_url ?? "",
            live_url:       editingProject.live_url ?? "",
            cover_url:      editingProject.cover_url ?? "",
            techs: editingProject.project_tech?.map(t => ({
              tech_name:   t.tech_name,
              used_for:    t.used_for    ?? "",
              used_for_en: (t as any).used_for_en ?? "",
            })) ?? [],
          }}
          onSuccess={() => { setEditingProject(null); onRefresh(); }}
        />
      </div>
    );
  }

  if (editingCert) {
    return (
      <div>
        <button onClick={() => setEditingCert(null)} style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          color: "var(--muted)", fontFamily: "var(--font-mono)",
          fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase",
          background: "none", border: "none", cursor: "pointer", marginBottom: 24,
        }}>
          ← กลับ
        </button>
        <CertForm
          initialData={{
            id:             editingCert.id,
            name:           editingCert.name,
            issuer:         editingCert.issuer,
            issued_date:    editingCert.issued_date,
            description_th: editingCert.description_th,
            description_en: editingCert.description_en ?? "",
            verify_url:     editingCert.verify_url ?? "",
            image_url:      editingCert.image_url,
          }}
          onSuccess={() => { setEditingCert(null); onRefresh(); }}
        />
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", margin: "0 0 24px" }}>แก้ไขข้อมูล</h2>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, marginBottom: 24 }}>
        {(["projects", "certs", "order"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "8px 20px", border: "1px solid var(--line)",
            background: tab === t ? "var(--primary)" : "var(--surface)",
            color: tab === t ? "#0a0a0c" : "var(--muted)",
            fontWeight: 600, fontSize: 13, cursor: "pointer",
            borderRadius: t === "projects"
              ? "var(--radius-sm) 0 0 var(--radius-sm)"
              : t === "order"
              ? "0 var(--radius-sm) var(--radius-sm) 0"
              : "0",
          }}>
            {t === "projects" ? `Projects (${projects.length})`
              : t === "certs" ? `Certificates (${certs.length})`
              : "🔀 จัดลำดับ"}
          </button>
        ))}
      </div>

      {/* Projects table */}
      {tab === "projects" && (
        <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
            <thead>
              <tr>
                <th style={thStyle}>ชื่อ</th>
                <th style={thStyle}>Category</th>
                <th style={thStyle}>ช่วงเวลา</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id} style={{ borderTop: "1px solid var(--line-soft)" }}>
                  <td style={tdStyle}>{p.name}</td>
                  <td style={tdStyle}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--primary)", letterSpacing: "0.08em" }}>
                      {CATEGORY_LABELS[p.category].en}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--muted)" }}>
                    {p.period_start} — {p.period_end}
                  </td>
                  <td style={tdStyle}>
                    <span className={`tag-pill ${p.is_published ? "live" : "draft"}`}>
                      {p.is_published ? "Live" : "Draft"}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => setEditingProject(p)} style={{
                        padding: "5px 12px", borderRadius: "var(--radius-xs)",
                        background: "color-mix(in oklab, var(--primary) 12%, var(--surface))",
                        color: "var(--primary)",
                        border: "1px solid color-mix(in oklab, var(--primary) 30%, transparent)",
                        fontSize: 12, cursor: "pointer", fontWeight: 600,
                      }}>แก้ไข</button>
                      <button onClick={() => handleDeleteProject(p.id)} style={{
                        padding: "5px 12px", borderRadius: "var(--radius-xs)",
                        background: "color-mix(in oklab, var(--accent) 12%, var(--surface))",
                        color: "var(--accent)",
                        border: "1px solid color-mix(in oklab, var(--accent) 30%, transparent)",
                        fontSize: 12, cursor: "pointer", fontWeight: 600,
                      }}>ลบ</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {projects.length === 0 && (
            <div style={{ padding: 32, textAlign: "center", color: "var(--muted)", fontSize: 14 }}>ยังไม่มีข้อมูล</div>
          )}
        </div>
      )}

      {/* Certs table */}
      {tab === "certs" && (
        <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
            <thead>
              <tr>
                <th style={thStyle}>ชื่อ</th>
                <th style={thStyle}>ออกโดย</th>
                <th style={thStyle}>วันที่</th>
                <th style={thStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {certs.map((c) => (
                <tr key={c.id} style={{ borderTop: "1px solid var(--line-soft)" }}>
                  <td style={tdStyle}>{c.name}</td>
                  <td style={{ ...tdStyle, color: "var(--muted)", fontSize: 13 }}>{c.issuer}</td>
                  <td style={{ ...tdStyle, fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--muted)" }}>{c.issued_date}</td>
                  <td style={tdStyle}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => setEditingCert(c)} style={{
                        padding: "5px 12px", borderRadius: "var(--radius-xs)",
                        background: "color-mix(in oklab, var(--primary) 12%, var(--surface))",
                        color: "var(--primary)",
                        border: "1px solid color-mix(in oklab, var(--primary) 30%, transparent)",
                        fontSize: 12, cursor: "pointer", fontWeight: 600,
                      }}>แก้ไข</button>
                      <button onClick={() => handleDeleteCert(c.id)} style={{
                        padding: "5px 12px", borderRadius: "var(--radius-xs)",
                        background: "color-mix(in oklab, var(--accent) 12%, var(--surface))",
                        color: "var(--accent)",
                        border: "1px solid color-mix(in oklab, var(--accent) 30%, transparent)",
                        fontSize: 12, cursor: "pointer", fontWeight: 600,
                      }}>ลบ</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {certs.length === 0 && (
            <div style={{ padding: 32, textAlign: "center", color: "var(--muted)", fontSize: 14 }}>ยังไม่มีข้อมูล</div>
          )}
        </div>
      )}

      {/* Order tab */}
      {tab === "order" && (
        <div style={{
          background: "var(--surface)", border: "1px solid var(--line)",
          borderRadius: "var(--radius-md)", padding: 24,
        }}>
          <SortableProjectList projects={projects} onSaved={onRefresh} />
        </div>
      )}
    </div>
  );
}

const thStyle: React.CSSProperties = {
  textAlign: "left", fontFamily: "var(--font-mono)", fontSize: 10.5,
  letterSpacing: "0.12em", textTransform: "uppercase",
  color: "var(--muted)", padding: "10px 16px",
  borderBottom: "1px solid var(--line)", background: "var(--surface-2)",
};

const tdStyle: React.CSSProperties = {
  padding: "14px 16px", verticalAlign: "middle",
};