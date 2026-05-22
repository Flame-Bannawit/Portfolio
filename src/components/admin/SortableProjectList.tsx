"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Save } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Project } from "@/types";
import { CATEGORY_LABELS } from "@/types";

interface Props {
  projects: Project[];
  onSaved: () => void;
}

function SortableItem({ project }: { project: Project }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        display: "flex", alignItems: "center", gap: 12,
        padding: "14px 16px",
        background: isDragging ? "color-mix(in oklab, var(--primary) 8%, var(--surface))" : "var(--surface)",
        border: `1px solid ${isDragging ? "var(--primary)" : "var(--line)"}`,
        borderRadius: "var(--radius-sm)",
        boxShadow: isDragging ? "var(--shadow-lift)" : "none",
        cursor: isDragging ? "grabbing" : "default",
        zIndex: isDragging ? 10 : 1,
        position: "relative",
    }}>

      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        style={{
          background: "none", border: "none",
          color: "var(--muted)", cursor: "grab",
          display: "flex", alignItems: "center",
          padding: 4, borderRadius: 4,
          flexShrink: 0,
        }}
        onMouseEnter={e => (e.currentTarget.style.color = "var(--primary)")}
        onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}>
        <GripVertical size={18} />
      </button>

      {/* Cover thumbnail */}
      <div style={{
        width: 56, height: 36,
        borderRadius: 4, overflow: "hidden",
        background: "var(--surface-2)",
        border: "1px solid var(--line-soft)",
        flexShrink: 0, position: "relative",
      }}>
        {project.cover_url ? (
          <img src={project.cover_url} alt={project.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 4px, color-mix(in oklab, var(--ink) 6%, transparent) 4px, color-mix(in oklab, var(--ink) 6%, transparent) 5px)",
          }} />
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: "var(--ink)" }}>
          {project.name}
        </p>
        <p style={{
          margin: 0, fontSize: 11,
          fontFamily: "var(--font-mono)", color: "var(--primary)",
          letterSpacing: "0.08em", textTransform: "uppercase",
        }}>
          {CATEGORY_LABELS[project.category].en}
        </p>
      </div>

      {/* Status */}
      <span className={`tag-pill ${project.is_published ? "live" : "draft"}`}
        style={{ flexShrink: 0 }}>
        {project.is_published ? "Live" : "Draft"}
      </span>
    </div>
  );
}

export default function SortableProjectList({ projects: initialProjects, onSaved }: Props) {
  const [projects, setProjects] = useState<Project[]>(
    [...initialProjects].sort((a, b) => a.display_order - b.display_order)
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [changed, setChanged] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setProjects(prev => {
      const oldIdx = prev.findIndex(p => p.id === active.id);
      const newIdx = prev.findIndex(p => p.id === over.id);
      return arrayMove(prev, oldIdx, newIdx);
    });
    setChanged(true);
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();

    try {
      await Promise.all(
        projects.map((p, i) =>
          supabase
            .from("projects")
            .update({ display_order: i })
            .eq("id", p.id)
        )
      );
      setSaved(true);
      setChanged(false);
      setTimeout(() => setSaved(false), 3000);
      onSaved();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center",
        justifyContent: "space-between", marginBottom: 20,
      }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
            จัดลำดับการแสดงผล
          </h3>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--muted)" }}>
            ลากแถวเพื่อเรียงลำดับ กดบันทึกเมื่อเสร็จ
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving || !changed}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "10px 20px",
            background: changed ? "var(--primary)" : "var(--surface)",
            color: changed ? "#0a0a0c" : "var(--muted)",
            border: `1px solid ${changed ? "var(--primary)" : "var(--line)"}`,
            borderRadius: "var(--radius-sm)",
            fontWeight: 600, fontSize: 14, cursor: changed ? "pointer" : "not-allowed",
            transition: "all .2s var(--ease-out)",
            opacity: saving ? 0.7 : 1,
          }}>
          <Save size={15} />
          {saving ? "กำลังบันทึก..." : saved ? "บันทึกแล้ว ✓" : "บันทึกลำดับ"}
        </button>
      </div>

      {/* List */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}>
        <SortableContext
          items={projects.map(p => p.id)}
          strategy={verticalListSortingStrategy}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {projects.map(project => (
              <SortableItem key={project.id} project={project} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Empty */}
      {projects.length === 0 && (
        <div style={{ padding: 32, textAlign: "center", color: "var(--muted)", fontSize: 14 }}>
          ยังไม่มี project
        </div>
      )}
    </div>
  );
}