"use client";
import { useState, useEffect, useRef } from "react";
import { supabase, type Project } from "@/lib/supabase";
import { logout } from "./actions";

const MONO = "'IBM Plex Mono', monospace";
const BUCKET = "project-images";

const DEV_CATEGORIES = ["Web Dev", "Full-Stack", "Mobile", "IoT", "Tools", "Other"];
const DESIGN_CATEGORIES = ["UI/UX", "Branding", "Graphic Design", "Web Design", "Other"];

type FormState = {
  id?: string;
  title: string;
  description: string;
  category: string[];
  tagsInput: string;
  year: string;
  link: string;
  image_url: string;
  images: string[];
  type: "dev" | "design";
};

function emptyForm(type: "dev" | "design"): FormState {
  return { title: "", description: "", category: [], tagsInput: "", year: String(new Date().getFullYear()), link: "", image_url: "", images: [], type };
}

function projectToForm(p: Project): FormState {
  return { id: p.id, title: p.title, description: p.description, category: p.category ? p.category.split(",").map(c => c.trim()) : [], tagsInput: p.tags.join(", "), year: p.year, link: p.link ?? "", image_url: p.image_url ?? "", images: p.images ?? [], type: p.type };
}

async function uploadFile(file: File): Promise<string> {
  const ext = file.name.split(".").pop();
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file);
  if (error) throw error;
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

const inputStyle: React.CSSProperties = {
  fontFamily: MONO, fontSize: 12, border: "none", borderBottom: "1px solid #ccc",
  padding: "7px 0", width: "100%", background: "none", outline: "none",
};

export default function AdminClient() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tab, setTab] = useState<"dev" | "design">("dev");
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<"cover" | "screenshot" | null>(null);
  const [error, setError] = useState("");
  const coverRef = useRef<HTMLInputElement>(null);
  const screenshotRef = useRef<HTMLInputElement>(null);

  const fetchProjects = async () => {
    setLoading(true);
    const { data } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
    setProjects(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchProjects(); }, []);

  const filtered = projects.filter((p) => p.type === tab);
  const set = (k: keyof FormState, v: string) => setForm((f) => f ? { ...f, [k]: v } : f);

  const handleCoverUpload = async (file: File) => {
    setUploading("cover");
    try { set("image_url", await uploadFile(file)); }
    catch (e) { setError(String(e)); }
    setUploading(null);
  };

  const handleScreenshotUpload = async (file: File) => {
    setUploading("screenshot");
    try {
      const url = await uploadFile(file);
      setForm((f) => f ? { ...f, images: [...f.images, url] } : f);
    } catch (e) { setError(String(e)); }
    setUploading(null);
  };

  const removeScreenshot = async (url: string) => {
    const path = url.split(`/${BUCKET}/`)[1];
    if (path) await supabase.storage.from(BUCKET).remove([path]);
    setForm((f) => f ? { ...f, images: f.images.filter((u) => u !== url) } : f);
  };

  const handleSave = async () => {
    if (!form) return;
    setSaving(true);
    setError("");
    const tags = form.tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category.join(", "),
      tags,
      year: form.year.trim(),
      link: form.link.trim() || null,
      image_url: form.image_url || null,
      images: form.images,
      type: form.type,
    };
    if (!payload.title || form.category.length === 0 || !payload.year) {
      setError("Title, category, and year are required.");
      setSaving(false);
      return;
    }
    const { error: err } = form.id
      ? await supabase.from("projects").update(payload).eq("id", form.id)
      : await supabase.from("projects").insert(payload);
    if (err) { setError(err.message); setSaving(false); return; }
    setForm(null);
    await fetchProjects();
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    await supabase.from("projects").delete().eq("id", id);
    await fetchProjects();
  };

  return (
    <div style={{ fontFamily: MONO, minHeight: "100vh", background: "#fff", color: "#000" }}>

      {/* Header */}
      <div style={{ borderBottom: "1px solid #000", padding: "1rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <span style={{ fontWeight: 700, fontSize: 12, letterSpacing: "0.2em" }}>ADMIN</span>
          <span style={{ fontSize: 12, opacity: 0.35, marginLeft: 12, letterSpacing: "0.1em" }}>LOYD.DEV</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <a href="/" style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.1em", opacity: 0.4, textDecoration: "none" }}>← Site</a>
          <form action={logout}>
            <button type="submit" style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.15em", border: "1px solid #000", padding: "6px 14px", background: "none", cursor: "pointer" }}>LOGOUT</button>
          </form>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "3rem 2rem" }}>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid #000", marginBottom: "2rem" }}>
          {(["dev", "design"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", padding: "10px 24px", border: "none", borderBottom: tab === t ? "2px solid #000" : "2px solid transparent", background: "none", cursor: "pointer", fontWeight: tab === t ? 700 : 400, marginBottom: -1 }}>
              {t === "dev" ? "Dev Projects" : "Design Projects"}
            </button>
          ))}
        </div>

        {/* Add button */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1.5rem" }}>
          <button onClick={() => setForm(emptyForm(tab))} style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.15em", border: "1px solid #000", padding: "8px 20px", background: "#000", color: "#fff", cursor: "pointer" }}>
            + ADD PROJECT
          </button>
        </div>

        {/* Form */}
        {form && (
          <div style={{ border: "1px solid #000", padding: "2rem", marginBottom: "2rem" }}>
            <div style={{ fontSize: 11, letterSpacing: "0.2em", fontWeight: 700, marginBottom: "1.5rem" }}>
              {form.id ? "EDIT PROJECT" : "NEW PROJECT"}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem 2rem" }}>
              {([
                ["title", "Title *"],
                ["year", "Year *"],
                ["link", "Link (optional — leave blank if none)"],
                ["tagsInput", "Tags (comma-separated)"],
              ] as [keyof FormState, string][]).map(([k, label]) => (
                <div key={k} style={k === "tagsInput" || k === "link" ? { gridColumn: "1 / -1" } : {}}>
                  <label style={{ display: "block", fontSize: 10, letterSpacing: "0.2em", opacity: 0.45, marginBottom: 6 }}>{label}</label>
                  <input type="text" value={form[k] as string} onChange={(e) => set(k, e.target.value)}
                    placeholder={k === "link" ? "https://... or leave blank" : k === "tagsInput" ? "e.g. React, Node.js, TypeScript" : ""}
                    style={inputStyle} />
                </div>
              ))}

              {/* Categories */}
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", fontSize: 10, letterSpacing: "0.2em", opacity: 0.45, marginBottom: 10 }}>Category *</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                  {(form.type === "dev" ? DEV_CATEGORIES : DESIGN_CATEGORIES).map(cat => (
                    <label key={cat} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, cursor: "pointer" }}>
                      <input 
                        type="checkbox" 
                        checked={form.category.includes(cat)} 
                        onChange={(e) => {
                          const newCat = e.target.checked 
                            ? [...form.category, cat] 
                            : form.category.filter(c => c !== cat);
                          setForm(f => f ? { ...f, category: newCat } : f);
                        }} 
                      />
                      {cat}
                    </label>
                  ))}
                </div>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", fontSize: 10, letterSpacing: "0.2em", opacity: 0.45, marginBottom: 6 }}>Description</label>
                <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} style={{ ...inputStyle, resize: "vertical", borderBottom: "1px solid #ccc" }} />
              </div>

              {/* Cover image */}
              <div style={{ gridColumn: "1 / -1", paddingTop: "0.5rem", borderTop: "1px solid #f0f0f0" }}>
                <label style={{ display: "block", fontSize: 10, letterSpacing: "0.2em", opacity: 0.45, marginBottom: 10 }}>Cover Image (shown on card)</label>
                {form.image_url ? (
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={form.image_url} alt="cover" style={{ width: 160, height: 96, objectFit: "cover", border: "1px solid #ddd" }} />
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <button onClick={() => coverRef.current?.click()} style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.1em", border: "1px solid #000", padding: "6px 14px", background: "none", cursor: "pointer" }}>REPLACE</button>
                      <button onClick={() => set("image_url", "")} style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.1em", border: "1px solid #ddd", padding: "6px 14px", background: "none", cursor: "pointer", opacity: 0.5 }}>REMOVE</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => coverRef.current?.click()} disabled={uploading === "cover"} style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.1em", border: "1px dashed #bbb", padding: "14px 24px", background: "none", cursor: "pointer", opacity: uploading === "cover" ? 0.5 : 1 }}>
                    {uploading === "cover" ? "UPLOADING..." : "+ UPLOAD COVER"}
                  </button>
                )}
                <input ref={coverRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleCoverUpload(f); e.target.value = ""; }} />
              </div>

              {/* Screenshots */}
              <div style={{ gridColumn: "1 / -1", paddingTop: "0.5rem", borderTop: "1px solid #f0f0f0" }}>
                <label style={{ display: "block", fontSize: 10, letterSpacing: "0.2em", opacity: 0.45, marginBottom: 10 }}>
                  Screenshots / Gallery <span style={{ opacity: 0.5 }}>(shown in project modal carousel)</span>
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
                  {form.images.map((url, idx) => (
                    <div key={url} style={{ position: "relative" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt={`screenshot ${idx + 1}`} style={{ width: 120, height: 80, objectFit: "cover", border: "1px solid #ddd", display: "block" }} />
                      <button
                        onClick={() => removeScreenshot(url)}
                        style={{ position: "absolute", top: 4, right: 4, width: 20, height: 20, border: "none", background: "rgba(0,0,0,0.6)", color: "#fff", fontSize: 12, lineHeight: "20px", textAlign: "center", cursor: "pointer", padding: 0 }}
                      >×</button>
                    </div>
                  ))}
                  <button onClick={() => screenshotRef.current?.click()} disabled={uploading === "screenshot"} style={{ width: 120, height: 80, fontFamily: MONO, fontSize: 10, letterSpacing: "0.1em", border: "1px dashed #bbb", background: "none", cursor: "pointer", opacity: uploading === "screenshot" ? 0.5 : 1 }}>
                    {uploading === "screenshot" ? "..." : "+ ADD"}
                  </button>
                </div>
                <input ref={screenshotRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleScreenshotUpload(f); e.target.value = ""; }} />
              </div>
            </div>

            {error && <div style={{ fontSize: 11, color: "red", marginTop: "1rem" }}>{error}</div>}

            <div style={{ display: "flex", gap: 12, marginTop: "1.5rem" }}>
              <button onClick={handleSave} disabled={saving || uploading !== null} style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.15em", border: "1px solid #000", padding: "9px 22px", background: "#000", color: "#fff", cursor: "pointer" }}>
                {saving ? "SAVING..." : "SAVE"}
              </button>
              <button onClick={() => { setForm(null); setError(""); }} style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.15em", border: "1px solid #000", padding: "9px 22px", background: "none", cursor: "pointer" }}>
                CANCEL
              </button>
            </div>
          </div>
        )}

        {/* Project list */}
        {loading ? (
          <div style={{ fontSize: 11, opacity: 0.35, letterSpacing: "0.2em" }}>LOADING...</div>
        ) : filtered.length === 0 ? (
          <div style={{ fontSize: 11, opacity: 0.35, letterSpacing: "0.2em" }}>NO PROJECTS YET — ADD ONE ABOVE</div>
        ) : (
          <div style={{ border: "1px solid #000" }}>
            {filtered.map((p, i) => (
              <div key={p.id} style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", alignItems: "center", gap: "1rem", padding: "1rem 1.5rem", borderBottom: i < filtered.length - 1 ? "1px solid #ebebeb" : "none" }}>
                <div style={{ width: 56, height: 40, background: "#f5f5f5", border: "1px solid #eee", flexShrink: 0, overflow: "hidden" }}>
                  {p.image_url
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={p.image_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, opacity: 0.15 }}>▨</div>
                  }
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{p.title}</div>
                  <div style={{ fontSize: 10, opacity: 0.4, display: "flex", gap: 16, flexWrap: "wrap" }}>
                    <span>{p.category}</span>
                    <span>{p.year}</span>
                    {p.images.length > 0 && <span>{p.images.length} screenshot{p.images.length !== 1 ? "s" : ""}</span>}
                    {p.link ? <span>↗ link</span> : <span style={{ opacity: 0.5 }}>no link</span>}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <button onClick={() => setForm(projectToForm(p))} style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.1em", border: "1px solid #000", padding: "5px 14px", background: "none", cursor: "pointer" }}>EDIT</button>
                  <button onClick={() => handleDelete(p.id)} style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.1em", border: "1px solid #ddd", padding: "5px 14px", background: "none", cursor: "pointer", opacity: 0.5 }}>DEL</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
