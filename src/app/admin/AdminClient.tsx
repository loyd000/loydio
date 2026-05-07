"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Credential, CredentialPhoto, Project } from "@/lib/supabase";
import {
  deleteCredential,
  deleteCredentialPhoto,
  deleteProject,
  fetchAdminData,
  logout,
  removeStoredImage,
  saveCredential,
  saveCredentialOrder,
  saveProject,
  saveProjectOrder,
  uploadCredentialPhoto,
  uploadImage,
} from "./actions";

const MONO = "'IBM Plex Mono', monospace";

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

type CredentialFormState = {
  id?: string;
  title: string;
  org: string;
  year: string;
  link: string;
  description: string;
  type: "certification" | "seminar" | "achievement";
};

type AdminData = {
  projects: Project[];
  credentials: Credential[];
  photos: CredentialPhoto[];
};

function emptyForm(type: "dev" | "design"): FormState {
  return { title: "", description: "", category: [], tagsInput: "", year: String(new Date().getFullYear()), link: "", image_url: "", images: [], type };
}

function projectToForm(p: Project): FormState {
  return { id: p.id, title: p.title, description: p.description, category: p.category ? p.category.split(",").map(c => c.trim()) : [], tagsInput: p.tags.join(", "), year: p.year, link: p.link ?? "", image_url: p.image_url ?? "", images: p.images ?? [], type: p.type };
}

function emptyCredentialForm(): CredentialFormState {
  return { title: "", org: "", year: String(new Date().getFullYear()), link: "", description: "", type: "achievement" };
}

function credentialToForm(c: Credential): CredentialFormState {
  return { id: c.id, title: c.title, org: c.org, year: c.year, link: c.link ?? "", description: c.description ?? "", type: c.type };
}

const inputStyle: React.CSSProperties = {
  fontFamily: MONO, fontSize: 12, border: "none", borderBottom: "1px solid #ccc",
  padding: "7px 0", width: "100%", background: "none", outline: "none",
};

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function uploadFormData(file: File) {
  const formData = new FormData();
  formData.set("file", file);
  return formData;
}

export default function AdminClient({ initialData, initialError = "" }: { initialData: AdminData; initialError?: string }) {
  const [projects, setProjects] = useState<Project[]>(initialData.projects);
  const [credentials, setCredentials] = useState<Credential[]>(initialData.credentials);
  const [photos, setPhotos] = useState<CredentialPhoto[]>(initialData.photos);
  const [tab, setTab] = useState<"dev" | "design" | "credentials" | "photos">("dev");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormState | null>(null);
  const [credForm, setCredForm] = useState<CredentialFormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<"cover" | "screenshot" | "credImg" | null>(null);
  const [error, setError] = useState(initialError);
  const coverRef = useRef<HTMLInputElement>(null);
  const screenshotRef = useRef<HTMLInputElement>(null);
  const credImgRef = useRef<HTMLInputElement>(null);

  // Drag and drop state for credentials
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [hasOrderChanged, setHasOrderChanged] = useState(false);

  // Drag and drop state for projects
  const [draggedProjectIdx, setDraggedProjectIdx] = useState<number | null>(null);
  const [hasProjectOrderChanged, setHasProjectOrderChanged] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchAdminData();
      setProjects(data.projects);
      setCredentials(data.credentials);
      setPhotos(data.photos);
      setHasOrderChanged(false);
      setHasProjectOrderChanged(false);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  const filtered = projects.filter((p) => p.type === tab);
  const set = (k: keyof FormState, v: string) => setForm((f) => f ? { ...f, [k]: v } : f);
  const setCred = (k: keyof CredentialFormState, v: string) => setCredForm((f) => f ? { ...f, [k]: v } : f);

  const handleCoverUpload = async (file: File) => {
    setUploading("cover");
    setError("");
    try { set("image_url", await uploadImage(uploadFormData(file))); }
    catch (e) { setError(errorMessage(e)); }
    setUploading(null);
  };

  const handlePhotoUpload = async (file: File) => {
    setUploading("credImg");
    setError("");
    try { 
      await uploadCredentialPhoto(uploadFormData(file));
      await fetchData();
    }
    catch (e) { setError(errorMessage(e)); }
    setUploading(null);
  };

  const handleScreenshotUpload = async (file: File) => {
    setUploading("screenshot");
    setError("");
    try {
      const url = await uploadImage(uploadFormData(file));
      setForm((f) => f ? { ...f, images: [...f.images, url] } : f);
    } catch (e) { setError(errorMessage(e)); }
    setUploading(null);
  };

  const removeScreenshot = async (url: string) => {
    setError("");
    try {
      await removeStoredImage(url);
      setForm((f) => f ? { ...f, images: f.images.filter((u) => u !== url) } : f);
    } catch (e) {
      setError(errorMessage(e));
    }
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
    try {
      await saveProject({ id: form.id, ...payload });
      setForm(null);
      await fetchData();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  const handleSaveCredential = async () => {
    if (!credForm) return;
    setSaving(true);
    setError("");
    const payload = {
      title: credForm.title.trim(),
      org: credForm.org.trim(),
      year: credForm.year.trim(),
      link: credForm.link.trim() || null,
      description: credForm.description,
      type: credForm.type,
    };
    if (!payload.title || !payload.org || !payload.year) {
      setError("Title, organization, and year are required.");
      setSaving(false);
      return;
    }
    try {
      await saveCredential({ id: credForm.id, ...payload });
      setCredForm(null);
      await fetchData();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    setError("");
    try {
      await deleteProject(id);
      await fetchData();
    } catch (e) {
      setError(errorMessage(e));
    }
  };

  const handleDeleteCredential = async (id: string) => {
    if (!confirm("Delete this credential?")) return;
    setError("");
    try {
      await deleteCredential(id);
      await fetchData();
    } catch (e) {
      setError(errorMessage(e));
    }
  };

  const handleDeletePhoto = async (id: string) => {
    if (!confirm("Delete this photo?")) return;
    setError("");
    try {
      await deleteCredentialPhoto(id);
      await fetchData();
    } catch (e) {
      setError(errorMessage(e));
    }
  };

  const handleSaveProjectOrder = async () => {
    setSaving(true);
    const updates = filtered.map((p, idx) => ({ id: p.id, sort_order: idx }));
    try {
      await saveProjectOrder(updates);
      setHasProjectOrderChanged(false);
      await fetchData();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  const handleSaveOrder = async () => {
    setSaving(true);
    // Prepare batch update payload mapping each id to its new sort_order
    const updates = credentials.map((c, idx) => ({
      id: c.id,
      sort_order: idx
    }));
    
    try {
      await saveCredentialOrder(updates);
      setHasOrderChanged(false);
      await fetchData();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setSaving(false);
    }
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
          <Link href="/" style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.1em", opacity: 0.4, textDecoration: "none" }}>← Site</Link>
          <form action={logout}>
            <button type="submit" style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.15em", border: "1px solid #000", padding: "6px 14px", background: "none", cursor: "pointer" }}>LOGOUT</button>
          </form>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "3rem 2rem" }}>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid #000", marginBottom: "2rem", overflowX: "auto" }}>
          {(["dev", "design", "credentials", "photos"] as const).map((t) => (
            <button key={t} onClick={() => { setTab(t); setForm(null); setCredForm(null); }} style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", padding: "10px 24px", border: "none", borderBottom: tab === t ? "2px solid #000" : "2px solid transparent", background: "none", cursor: "pointer", fontWeight: tab === t ? 700 : 400, marginBottom: -1, whiteSpace: "nowrap" }}>
              {t === "dev" ? "Dev Projects" : t === "design" ? "Design Projects" : t === "credentials" ? "Credentials" : "Photo Gallery"}
            </button>
          ))}
        </div>

        {error && (
          <div style={{ border: "1px solid #f2b8b5", color: "#8a1f17", background: "#fff8f7", padding: "0.85rem 1rem", fontSize: 11, letterSpacing: "0.05em", marginBottom: "1.5rem" }}>
            {error}
          </div>
        )}

        {tab === "credentials" ? (
          <>
            {/* Credential Sub-Tabs */}
            {/* Action Bar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              {hasOrderChanged ? (
                <button onClick={handleSaveOrder} disabled={saving} style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.15em", border: "1px solid #000", padding: "8px 20px", background: "#f0f0f0", color: "#000", cursor: "pointer", fontWeight: 700 }}>
                  {saving ? "SAVING..." : "SAVE NEW ORDER"}
                </button>
              ) : (
                <div style={{ fontSize: 11, opacity: 0.5, fontFamily: MONO, letterSpacing: "0.1em" }}>Drag items to reorder</div>
              )}
              <button onClick={() => setCredForm(emptyCredentialForm())} style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.15em", border: "1px solid #000", padding: "8px 20px", background: "#000", color: "#fff", cursor: "pointer" }}>
                + ADD CREDENTIAL
              </button>
            </div>

            {/* Form */}
            {credForm && (
              <div style={{ border: "1px solid #000", padding: "2rem", marginBottom: "2rem" }}>
                <div style={{ fontSize: 11, letterSpacing: "0.2em", fontWeight: 700, marginBottom: "1.5rem" }}>
                  {credForm.id ? "EDIT CREDENTIAL" : "NEW CREDENTIAL"}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem 2rem" }}>
                  {([
                    ["title", "Title / Name *"],
                    ["org", "Organization / Issuer *"],
                    ["year", "Year *"],
                    ["link", "Link (optional)"],
                  ] as [keyof CredentialFormState, string][]).map(([k, label]) => (
                    <div key={k}>
                      <label style={{ display: "block", fontSize: 10, letterSpacing: "0.2em", opacity: 0.45, marginBottom: 6 }}>{label}</label>
                      <input type="text" value={credForm[k] as string} onChange={(e) => setCred(k, e.target.value)}
                        placeholder={k === "link" ? "https://..." : ""}
                        style={inputStyle} />
                    </div>
                  ))}
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={{ display: "block", fontSize: 10, letterSpacing: "0.2em", opacity: 0.45, marginBottom: 6 }}>Description (optional)</label>
                    <textarea value={credForm.description} onChange={(e) => setCred("description", e.target.value)} rows={3} style={{ ...inputStyle, resize: "vertical", borderBottom: "1px solid #ccc" }} />
                  </div>
                </div>

                {error && <div style={{ fontSize: 11, color: "red", marginTop: "1rem" }}>{error}</div>}

                <div style={{ display: "flex", gap: 12, marginTop: "2rem" }}>
                  <button onClick={handleSaveCredential} disabled={saving} style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.15em", border: "1px solid #000", padding: "9px 22px", background: "#000", color: "#fff", cursor: "pointer" }}>
                    {saving ? "SAVING..." : "SAVE"}
                  </button>
                  <button onClick={() => { setCredForm(null); setError(""); }} style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.15em", border: "1px solid #000", padding: "9px 22px", background: "none", cursor: "pointer" }}>
                    CANCEL
                  </button>
                </div>
              </div>
            )}

            {/* List */}
            {loading ? (
              <div style={{ fontSize: 11, opacity: 0.35, letterSpacing: "0.2em" }}>LOADING...</div>
            ) : credentials.length === 0 ? (
              <div style={{ fontSize: 11, opacity: 0.35, letterSpacing: "0.2em" }}>NO CREDENTIALS YET</div>
            ) : (
              <div style={{ border: "1px solid #000" }}>
                {credentials.map((c, i) => (
                  <div 
                    key={c.id} 
                    draggable
                    onDragStart={(e) => {
                      setDraggedIdx(i);
                      e.dataTransfer.effectAllowed = "move";
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (draggedIdx === null || draggedIdx === i) return;
                      const newCreds = [...credentials];
                      const [draggedItem] = newCreds.splice(draggedIdx, 1);
                      newCreds.splice(i, 0, draggedItem);
                      setCredentials(newCreds);
                      setDraggedIdx(null);
                      setHasOrderChanged(true);
                    }}
                    style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", alignItems: "center", gap: "1rem", padding: "1rem 1.5rem", borderBottom: i < credentials.length - 1 ? "1px solid #ebebeb" : "none", background: draggedIdx === i ? "#f9f9f9" : "transparent", cursor: "grab" }}
                  >
                    <div style={{ opacity: 0.5, cursor: "grab", WebkitTextStroke: "0.5px currentColor", paddingRight: "0.5rem" }}>⣿</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{c.title}</div>
                        <div style={{ fontSize: 10, opacity: 0.4, display: "flex", gap: 16, flexWrap: "wrap" }}>
                          <span>{c.org}</span>
                          <span>{c.year}</span>
                          {c.link && <span>↗ link</span>}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                      <button onClick={() => setCredForm(credentialToForm(c))} style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.1em", border: "1px solid #000", padding: "5px 14px", background: "none", cursor: "pointer" }}>EDIT</button>
                      <button onClick={() => handleDeleteCredential(c.id)} style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.1em", border: "1px solid #ddd", padding: "5px 14px", background: "none", cursor: "pointer", opacity: 0.5 }}>DEL</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : tab === "photos" ? (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <div style={{ fontSize: 11, opacity: 0.5, fontFamily: MONO, letterSpacing: "0.1em" }}>Gallery Photos</div>
              <div>
                <input type="file" accept="image/*" ref={credImgRef} style={{ display: "none" }} onChange={(e) => { if (e.target.files?.[0]) handlePhotoUpload(e.target.files[0]); }} />
                <button onClick={() => credImgRef.current?.click()} disabled={uploading === "credImg"} style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.15em", border: "1px solid #000", padding: "8px 20px", background: "#000", color: "#fff", cursor: "pointer" }}>
                  {uploading === "credImg" ? "UPLOADING..." : "+ UPLOAD PHOTO"}
                </button>
              </div>
            </div>

            {loading ? (
              <div style={{ fontSize: 11, opacity: 0.35, letterSpacing: "0.2em" }}>LOADING...</div>
            ) : photos.length === 0 ? (
              <div style={{ fontSize: 11, opacity: 0.35, letterSpacing: "0.2em" }}>NO PHOTOS YET</div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "1rem" }}>
                {photos.map((p) => (
                  <div key={p.id} style={{ position: "relative", border: "1px solid #ccc", aspectRatio: "1/1" }}>
                    <Image src={p.image_url} alt="" fill sizes="150px" style={{ objectFit: "cover" }} />
                    <button onClick={() => handleDeletePhoto(p.id)} style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.5)", color: "#fff", border: "none", borderRadius: "50%", width: 24, height: 24, cursor: "pointer", fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {/* Action bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          {hasProjectOrderChanged ? (
            <button onClick={handleSaveProjectOrder} disabled={saving} style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.15em", border: "1px solid #000", padding: "8px 20px", background: "#f0f0f0", color: "#000", cursor: "pointer", fontWeight: 700 }}>
              {saving ? "SAVING..." : "SAVE NEW ORDER"}
            </button>
          ) : (
            <div style={{ fontSize: 11, opacity: 0.5, fontFamily: MONO, letterSpacing: "0.1em" }}>Drag items to reorder</div>
          )}
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
                    <span style={{ position: "relative", width: 160, height: 96, border: "1px solid #ddd", display: "block" }}>
                      <Image src={form.image_url} alt="cover" fill sizes="160px" style={{ objectFit: "cover" }} />
                    </span>
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
                      <span style={{ position: "relative", width: 120, height: 80, border: "1px solid #ddd", display: "block" }}>
                        <Image src={url} alt={`screenshot ${idx + 1}`} fill sizes="120px" style={{ objectFit: "cover" }} />
                      </span>
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
              <div
                key={p.id}
                draggable
                onDragStart={(e) => {
                  setDraggedProjectIdx(i);
                  e.dataTransfer.effectAllowed = "move";
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (draggedProjectIdx === null || draggedProjectIdx === i) return;
                  const reordered = [...filtered];
                  const [moved] = reordered.splice(draggedProjectIdx, 1);
                  reordered.splice(i, 0, moved);
                  setProjects((prev) => [...prev.filter((p) => p.type !== tab), ...reordered]);
                  setDraggedProjectIdx(null);
                  setHasProjectOrderChanged(true);
                }}
                style={{ display: "grid", gridTemplateColumns: "auto auto 1fr auto", alignItems: "center", gap: "1rem", padding: "1rem 1.5rem", borderBottom: i < filtered.length - 1 ? "1px solid #ebebeb" : "none", background: draggedProjectIdx === i ? "#f9f9f9" : "transparent", cursor: "grab" }}
              >
                <div style={{ opacity: 0.5, cursor: "grab", WebkitTextStroke: "0.5px currentColor", paddingRight: "0.25rem" }}>⣿</div>
                <div style={{ width: 56, height: 40, background: "#f5f5f5", border: "1px solid #eee", flexShrink: 0, overflow: "hidden", position: "relative" }}>
                  {p.image_url
                    ? <Image src={p.image_url} alt="" fill sizes="56px" style={{ objectFit: "cover" }} />
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
          </>
        )}
      </div>
    </div>
  );
}
