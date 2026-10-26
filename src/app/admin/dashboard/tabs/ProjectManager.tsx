"use client";

import { useState, useRef } from "react";
import { useAdmin, CaseProject, SyncResult } from "@/context/AdminContext";
import { Plus, Edit2, Trash2, X, ChevronDown, ChevronUp, Camera, Save, Loader2, FileText, Download, Upload, AlertTriangle, CheckCircle2 } from "lucide-react";

const emptyProject = (): Omit<CaseProject, "id"> => ({
  title: "",
  focus: "",
  components: "",
  automation: "",
  images: [],
  cadSize: "",
  dwgSize: "",
  renderSize: "",
  zipUrl: "",
  pdfUrl: "",
  reports: [],
  order: 0,
  videoUrl: "",
});

function InputField({
  label, value, onChange, placeholder, required,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-mono text-[9px] tracking-[0.25em] text-[#00F2FF]/70 uppercase">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="bg-black/40 border border-[#00F2FF]/20 rounded-lg px-3 py-2.5 font-mono text-xs text-white focus:outline-none focus:border-[#00F2FF]/70 focus:shadow-[0_0_10px_rgba(0,242,255,0.1)] transition-all placeholder:text-white/20"
      />
    </div>
  );
}

function ProjectForm({
  initial,
  onSave,
  onCancel,
  title,
}: {
  initial: Omit<CaseProject, "id">;
  onSave: (p: Omit<CaseProject, "id">) => Promise<void>;
  onCancel: () => void;
  title: string;
}) {
  const [form, setForm] = useState(initial);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const set = (key: keyof typeof form, val: any) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const readFileAsOptimizedDataUrl = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (file.type.startsWith("image/")) {
        const img = new Image();
        const reader = new FileReader();
        reader.onload = (e) => {
          img.src = e.target?.result as string;
        };
        img.onload = () => {
          const MAX_DIM = 1600;
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > MAX_DIM) {
              height = Math.round((height * MAX_DIM) / width);
              width = MAX_DIM;
            }
          } else {
            if (height > MAX_DIM) {
              width = Math.round((width * MAX_DIM) / height);
              height = MAX_DIM;
            }
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL("image/jpeg", 0.85));
          } else {
            resolve(img.src);
          }
        };
        img.onerror = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      } else {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      }
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "images" | "zipUrl" | "pdfUrl" | "videoUrl") => {
    if (!e.target.files || e.target.files.length === 0) return;

    setIsUploading(true);
    setUploadStatus(`Processing ${field}...`);

    const files = Array.from(e.target.files);
    const uploadedUrls: string[] = [];

    for (const file of files) {
      let finalUrl = "";

      // 1. Try cloud upload via presign if configured
      try {
        const folder = field === "images" ? "portfolio/projects/renders" : field === "zipUrl" ? "portfolio/projects/zip" : field === "videoUrl" ? "portfolio/projects/videos" : "portfolio/projects/pdf";
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const filename = `${folder}/${uniqueSuffix}-${file.name.replace(/\s+/g, "_")}`;

        const presignRes = await fetch("/api/admin/presign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filename })
        });

        if (presignRes.ok) {
          const presignData = await presignRes.json();
          if (presignData.signedUrl && !presignData.error) {
            const uploadRes = await fetch(presignData.signedUrl, {
              method: "PUT",
              headers: { "Content-Type": file.type },
              body: file
            });
            if (uploadRes.ok) {
              finalUrl = presignData.publicUrl;
            }
          }
        }
      } catch (cloudErr) {
        console.warn("Cloud upload unavailable, falling back to local asset encoder:", cloudErr);
      }

      // 2. Resilient fallback: convert to optimized Data URL if cloud is unreachable
      if (!finalUrl) {
        try {
          finalUrl = await readFileAsOptimizedDataUrl(file);
        } catch (readErr: any) {
          console.error("Local file read error:", readErr);
        }
      }

      if (finalUrl) {
        uploadedUrls.push(finalUrl);
      }
    }

    if (uploadedUrls.length > 0) {
      if (field === "images") {
        set("images", [...form.images, ...uploadedUrls]);
      } else {
        set(field, uploadedUrls[0]);
      }
    }
    setUploadStatus(null);
    setIsUploading(false);
  };

  const removeImage = (idx: number) =>
    set("images", form.images.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await onSave(form);
    setIsSaving(false);
  };

  return (
    <div className="bg-[#020617]/80 border border-[#00F2FF]/30 rounded-xl p-6 shadow-[0_0_30px_rgba(0,242,255,0.07)]">
      {/* Form Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#00F2FF]/15">
        <h3 className="font-mono text-sm font-bold text-white tracking-[0.15em] uppercase">{title}</h3>
        <button onClick={onCancel} className="text-[#94A3B8]/60 hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Project Title" value={form.title} onChange={(v) => set("title", v)} placeholder="e.g., Smart Crushing Station" required />
          <InputField label="System Focus" value={form.focus} onChange={(v) => set("focus", v)} placeholder="e.g., Throughput Maximization" required />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Display Order (0 = First)" value={form.order?.toString() || "0"} onChange={(v) => set("order", parseInt(v) || 0)} placeholder="e.g., 1" />
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[9px] tracking-[0.25em] text-[#00F2FF]/70 uppercase flex items-center justify-between">
              <span>Video URL or Upload</span>
              {isUploading && uploadStatus?.includes("videoUrl") && <Loader2 className="w-3 h-3 text-[#00F2FF] animate-spin" />}
            </label>
            <div className="flex items-center gap-2">
              <input type="text" value={form.videoUrl || ""} onChange={(e) => set("videoUrl", e.target.value)} placeholder="https://..." className="flex-1 bg-black/40 border border-[#00F2FF]/20 rounded-lg px-3 py-2.5 font-mono text-xs text-white focus:outline-none focus:border-[#00F2FF]/70 transition-all placeholder:text-white/20" />
              <label className="cursor-pointer bg-[#00F2FF]/10 text-[#00F2FF] border border-[#00F2FF]/30 px-3 py-2.5 rounded-lg hover:bg-[#00F2FF]/20 transition-all">
                <Camera className="w-4 h-4" />
                <input type="file" accept="video/mp4,video/webm" onChange={(e) => handleFileUpload(e, "videoUrl")} className="hidden" disabled={isUploading} />
              </label>
            </div>
          </div>
        </div>
        <InputField label="Key Specifications" value={form.components} onChange={(v) => set("components", v)} placeholder="e.g., Heavy-Duty Framework, Wear Plates" />
        <InputField label="Technical Highlights" value={form.automation} onChange={(v) => set("automation", v)} placeholder="e.g., Automated Material Flow, Sensor Monitoring" />

        {/* Image Upload */}
        <div className="flex flex-col gap-2">
          <label className="font-mono text-[9px] tracking-[0.25em] text-[#00F2FF]/70 uppercase">
            Project 3D Renders / Visuals
          </label>
          <label className="flex items-center gap-3 border border-dashed border-[#00F2FF]/25 rounded-lg p-4 cursor-pointer hover:border-[#00F2FF]/50 hover:bg-[#00F2FF]/5 transition-all">
            {isUploading && uploadStatus?.includes("images") ? <Loader2 className="w-4 h-4 text-[#00F2FF] animate-spin" /> : <Camera className="w-4 h-4 text-[#00F2FF]/60" />}
            <span className="font-mono text-[10px] text-[#94A3B8]/60 tracking-widest">
              {isUploading && uploadStatus?.includes("images") ? "UPLOADING_RENDERS..." : "Click to upload 3D renders (JPG, PNG, WebP) - MULTIPLE SELECTION SUPPORTED"}
            </span>
            <input type="file" multiple accept="image/*" onChange={(e) => handleFileUpload(e, "images")} className="hidden" disabled={isUploading} />
          </label>
          {form.images.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-1">
              {form.images.map((img, i) => (
                <div key={i} className="relative group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="" className="w-16 h-16 object-cover rounded border border-[#00F2FF]/30" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[8px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              ))}
              <p className="text-[9px] font-mono text-[#00F2FF]/50 self-center">{form.images.length} render(s) attached</p>
            </div>
          )}
        </div>

        {/* Technical Asset Uploads */}
        <div className="flex flex-col gap-4 pt-2 border-t border-[#00F2FF]/10">
          <div className="flex flex-col gap-2">
            <label className="font-mono text-[9px] tracking-[0.2em] text-[#00F2FF]/70 uppercase flex items-center justify-between">
              <span>Engineering Report (PDF)</span>
              {form.pdfUrl && <span className="text-emerald-400 text-[7px]">READY</span>}
            </label>
            <div className="relative">
              {form.pdfUrl ? (
                <div className="flex items-center gap-3 bg-[#00F2FF]/10 border border-[#00F2FF]/30 rounded-lg p-3">
                  <FileText className="w-5 h-5 text-[#00F2FF]" />
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-[10px] text-[#00F2FF] truncate">Engineering_Report.pdf</p>
                    <p className="font-mono text-[7px] text-[#00F2FF]/50 truncate uppercase tracking-widest">Main Report Linked</p>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => set("pdfUrl", "")}
                    className="p-1.5 text-red-400/50 hover:text-red-400 hover:bg-red-400/10 rounded transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileUpload(e, "pdfUrl")}
                  className="w-full text-[9px] text-white/40 font-mono file:mr-3 file:py-2 file:px-3 file:rounded file:border-0 file:text-[9px] file:bg-[#00F2FF]/15 file:text-[#00F2FF] hover:file:bg-[#00F2FF]/25 file:font-mono cursor-pointer bg-black/20 border border-[#00F2FF]/10 rounded-lg p-1"
                  disabled={isUploading}
                />
              )}
              {isUploading && uploadStatus?.includes("pdfUrl") && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-[#00F2FF] animate-spin" />
              )}
            </div>
          </div>
        </div>

        {/* Multi-Reports Section */}
        <div className="flex flex-col gap-3 pt-4 border-t border-[#00F2FF]/10">
          <label className="font-mono text-[9px] tracking-[0.2em] text-[#00F2FF]/70 uppercase">Project Specific Reports</label>
          <div className="flex flex-col gap-2">
            {(form.reports || []).map((report, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-black/20 p-2 rounded-lg border border-[#00F2FF]/10">
                <FileText className="w-3.5 h-3.5 text-[#00F2FF]/60" />
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-[10px] text-white truncate">{report.title}</p>
                </div>
                <button 
                  type="button" 
                  onClick={() => set("reports", (form.reports || []).filter((_, i) => i !== idx))}
                  className="text-red-400/50 hover:text-red-400 transition-colors p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            
            <div className="flex flex-col gap-2 p-3 bg-[#00F2FF]/5 border border-[#00F2FF]/20 rounded-lg mt-1">
              <p className="font-mono text-[8px] text-[#00F2FF] uppercase tracking-widest mb-1">Add New Report</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input 
                  type="text" 
                  id="new-report-title"
                  placeholder="Report Title (e.g., QA Analysis)"
                  className="bg-black/40 border border-[#00F2FF]/20 rounded px-2 py-1.5 font-mono text-[10px] text-white outline-none"
                />
                <input 
                  type="file" 
                  id="new-report-file"
                  accept=".pdf"
                  className="text-[9px] text-white/40 font-mono file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[9px] file:bg-[#00F2FF]/15 file:text-[#00F2FF] hover:file:bg-[#00F2FF]/25 cursor-pointer"
                />
              </div>
              <button 
                type="button"
                onClick={async () => {
                  const titleInput = document.getElementById('new-report-title') as HTMLInputElement;
                  const fileInput = document.getElementById('new-report-file') as HTMLInputElement;
                  if (!titleInput.value || !fileInput.files?.[0]) return;
                  
                  setIsUploading(true);
                  const file = fileInput.files[0];
                  let url = "";
                  
                  try {
                    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
                    const filename = `portfolio/projects/reports/${uniqueSuffix}-${file.name.replace(/\s+/g, "_")}`;

                    const presignRes = await fetch("/api/admin/presign", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ filename })
                    });
                    const presignData = await presignRes.json();

                    if (presignRes.ok && presignData.signedUrl) {
                      const uploadRes = await fetch(presignData.signedUrl, {
                        method: "PUT",
                        headers: { "Content-Type": file.type },
                        body: file
                      });
                      if (uploadRes.ok) {
                        url = presignData.publicUrl;
                      }
                    }
                  } catch (err) {
                    console.error("Report upload failed", err);
                    alert("Report upload failed");
                    setIsUploading(false);
                    return;
                  }

                  if (!url) {
                     alert("Failed to get upload URL");
                     setIsUploading(false);
                     return;
                  }

                  const newReport = { id: `rep-${Date.now()}`, title: titleInput.value, url };
                  set("reports", [...(form.reports || []), newReport]);
                  titleInput.value = "";
                  fileInput.value = "";
                  setIsUploading(false);
                }}
                className="self-end px-3 py-1 bg-[#00F2FF]/20 border border-[#00F2FF]/40 text-[#00F2FF] font-mono text-[9px] uppercase tracking-widest rounded hover:bg-[#00F2FF]/30 transition-all"
              >
                Add Report
              </button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end mt-2">
          <button type="button" onClick={onCancel} className="px-5 py-2 font-mono text-xs tracking-widest uppercase text-[#94A3B8] border border-white/10 rounded-lg hover:border-white/30 transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={isSaving || isUploading} className="px-6 py-2 font-mono text-xs tracking-widest uppercase bg-[#00F2FF] text-black font-bold rounded-lg hover:bg-[#00F2FF]/80 shadow-[0_0_15px_rgba(0,242,255,0.3)] transition-all flex items-center gap-2 disabled:opacity-50">
            {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />} 
            {isSaving ? "SYNCING..." : "COMMIT DATA"}
          </button>
        </div>
      </form>
    </div>
  );
}

export function ProjectManager() {
  const { projects, addProject, editProject, deleteProject, clearAllProjects } = useAdmin();
  const [mode, setMode] = useState<"list" | "add" | "edit">("list");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "local" | "error"; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveNew = async (p: Omit<CaseProject, "id">) => {
    const res = await addProject(p);
    setMode("list");
    if (res?.isLocalOnly) {
      setFeedback({
        type: "local",
        message: "Saved in this browser only. Cloud database (Supabase) is not configured in Vercel, so it will not appear on other browsers until exported & committed to GitHub, or Supabase is connected.",
      });
    } else if (res?.success) {
      setFeedback({
        type: "success",
        message: "Project successfully synced to cloud and live across all devices.",
      });
    } else {
      setFeedback({
        type: "error",
        message: `Saved locally, but cloud sync failed: ${res?.error || "Server unreachable"}`,
      });
    }
  };

  const handleSaveEdit = async (p: Omit<CaseProject, "id">) => {
    let res: SyncResult | undefined;
    if (editingId) {
      res = await editProject(editingId, p);
    }
    setMode("list");
    setEditingId(null);
    if (res?.isLocalOnly) {
      setFeedback({
        type: "local",
        message: "Changes saved in this browser. To show across all devices, export your data or configure Supabase in Vercel.",
      });
    } else if (res?.success) {
      setFeedback({
        type: "success",
        message: "Updates successfully synced across all devices.",
      });
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Remove "${title}" from portfolio? This cannot be undone.`)) {
      await deleteProject(id);
    }
  };

  const handleExportData = () => {
    const payload = JSON.stringify({
      projects,
      lastUpdated: new Date().toISOString(),
    }, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `portfolio-projects-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed.projects)) {
          for (const proj of parsed.projects) {
            const { id, ...rest } = proj;
            await addProject(rest);
          }
          alert(`Successfully imported ${parsed.projects.length} project(s).`);
        } else {
          alert("Invalid portfolio file format.");
        }
      } catch (err: any) {
        alert("Failed to parse JSON file: " + err.message);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const editingProject = projects.find((p) => p.id === editingId);

  return (
    <div className="flex flex-col gap-6">
      {/* Notice regarding cloud sync vs browser local storage */}
      {!process.env.NEXT_PUBLIC_SUPABASE_URL && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-300">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <div className="text-xs font-mono leading-relaxed">
              <span className="font-bold text-amber-200 uppercase tracking-wider block sm:inline mr-2">Local Storage Mode:</span>
              Cloud database (Supabase) is not configured in Vercel. Projects uploaded here are stored in this browser only. Use <strong>Export JSON</strong> to save or push your projects to the public site.
            </div>
          </div>
          <button
            onClick={handleExportData}
            className="shrink-0 flex items-center gap-2 px-3 py-1.5 bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/40 rounded-lg text-amber-200 text-xs font-mono uppercase tracking-wider transition-all"
            title="Download your project data and renders as JSON"
          >
            <Download className="w-3.5 h-3.5" /> Export JSON
          </button>
        </div>
      )}

      {/* Sync feedback banner */}
      {feedback && (
        <div className={`border rounded-lg p-3.5 flex items-center justify-between gap-3 shadow-lg animate-in slide-in-from-top-2 fade-in duration-300 ${
          feedback.type === "success" 
            ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300"
            : feedback.type === "local"
            ? "bg-amber-500/10 border-amber-500/40 text-amber-200"
            : "bg-red-500/10 border-red-500/40 text-red-300"
        }`}>
          <div className="flex items-center gap-2.5 text-xs font-mono">
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : feedback.type === "local" ? (
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            ) : (
              <X className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="opacity-60 hover:opacity-100 transition-opacity">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-mono text-base font-bold text-white tracking-[0.15em] uppercase">Project Manager</h2>
          <p className="font-mono text-[10px] text-[#94A3B8]/60 tracking-widest mt-0.5">
            {projects.length} case {projects.length === 1 ? "study" : "studies"} in portfolio
          </p>
        </div>
        {mode === "list" && (
          <div className="flex flex-wrap items-center gap-2.5">
            <input 
              type="file" 
              accept="application/json" 
              ref={fileInputRef} 
              onChange={handleImportFile} 
              className="hidden" 
            />
            
            <button
              onClick={handleExportData}
              className="flex items-center gap-1.5 px-3 py-2 bg-white/5 border border-white/10 text-white/80 font-mono text-xs tracking-wider uppercase rounded-lg hover:bg-white/10 hover:text-white transition-all"
              title="Export all projects and renders to JSON"
            >
              <Download className="w-3.5 h-3.5" /> Export
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-2 bg-white/5 border border-white/10 text-white/80 font-mono text-xs tracking-wider uppercase rounded-lg hover:bg-white/10 hover:text-white transition-all"
              title="Import projects from JSON file"
            >
              <Upload className="w-3.5 h-3.5" /> Import
            </button>

            {projects.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm("Remove ALL projects from portfolio? This will completely clean the slate.")) {
                    clearAllProjects();
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-2 bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-xs tracking-widest uppercase rounded-lg hover:bg-red-500/20 hover:border-red-500 transition-all"
                title="Purge all projects"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear All
              </button>
            )}

            <button
              onClick={() => setMode("add")}
              className="flex items-center gap-2 px-4 py-2 bg-[#00F2FF]/10 border border-[#00F2FF]/40 text-[#00F2FF] font-mono text-xs tracking-widest uppercase rounded-lg hover:bg-[#00F2FF]/20 hover:border-[#00F2FF] transition-all"
            >
              <Plus className="w-4 h-4" /> New Case Study
            </button>
          </div>
        )}
      </div>

      {/* Add Form */}
      {mode === "add" && (
        <ProjectForm title="[ ADD ] New Case Study" initial={emptyProject()} onSave={handleSaveNew} onCancel={() => setMode("list")} />
      )}

      {/* Edit Form */}
      {mode === "edit" && editingProject && (
        <ProjectForm
          title={`[ EDIT ] ${editingProject.title}`}
          initial={editingProject}
          onSave={handleSaveEdit}
          onCancel={() => { setMode("list"); setEditingId(null); }}
        />
      )}

      {/* Project List */}
      {mode === "list" && (
        <div className="flex flex-col gap-3">
          {projects.length === 0 && (
            <div className="text-center py-16 font-mono text-[#94A3B8]/40 text-xs tracking-widest uppercase border border-dashed border-[#00F2FF]/10 rounded-xl">
              No case studies. Click &ldquo;New Case Study&rdquo; to begin.
            </div>
          )}
          {projects.map((proj) => (
            <div key={proj.id} className="border border-[#00F2FF]/20 rounded-xl bg-black/30 overflow-hidden hover:border-[#00F2FF]/40 transition-colors">
              <div className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-2 h-2 rounded-full bg-[#00F2FF] shadow-[0_0_6px_rgba(0,242,255,0.8)] shrink-0" />
                  <div className="min-w-0">
                    <p className="font-mono text-sm text-white font-bold truncate">{proj.title}</p>
                    <p className="font-mono text-[9px] text-[#94A3B8]/60 tracking-widest uppercase truncate">{proj.focus}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4 shrink-0">
                  <span className="font-mono text-[8px] text-[#00F2FF]/40 tracking-widest hidden sm:block">
                    {proj.images.length} render(s)
                  </span>
                  <button
                    onClick={() => setExpanded(expanded === proj.id ? null : proj.id)}
                    className="p-1.5 text-[#94A3B8]/50 hover:text-white transition-colors"
                  >
                    {expanded === proj.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => { setEditingId(proj.id); setMode("edit"); }}
                    className="p-1.5 text-[#00F2FF]/50 hover:text-[#00F2FF] hover:bg-[#00F2FF]/10 rounded transition-all"
                    title="Edit project"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(proj.id, proj.title)}
                    className="p-1.5 text-red-400/50 hover:text-red-400 hover:bg-red-400/10 rounded transition-all"
                    title="Delete project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              {expanded === proj.id && (
                <div className="border-t border-[#00F2FF]/10 px-5 py-4 bg-black/20 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: "Specifications", value: proj.components },
                    { label: "Technical Highlights", value: proj.automation },
                  ].map(({ label, value }) => (
                    value ? (
                      <div key={label}>
                        <p className="font-mono text-[8px] tracking-widest text-[#00F2FF]/50 uppercase mb-1">{label}</p>
                        <p className="font-mono text-[10px] text-[#94A3B8] leading-relaxed">{value}</p>
                      </div>
                    ) : null
                  ))}
                  <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 pt-3 border-t border-[#00F2FF]/5">
                    <div>
                      <p className="font-mono text-[8px] tracking-widest text-[#00F2FF]/50 uppercase mb-1">Engineering Report</p>
                      {proj.pdfUrl ? (
                        <div className="flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5 text-[#00F2FF]" />
                          <span className="font-mono text-[9px] text-[#00F2FF] uppercase">Main Report Active</span>
                        </div>
                      ) : (
                        <p className="font-mono text-[9px] text-white/20 uppercase tracking-widest">No Report Attached</p>
                      )}
                    </div>
                    {proj.reports && proj.reports.length > 0 && (
                      <div className="col-span-full mt-2 pt-3 border-t border-[#00F2FF]/5">
                        <p className="font-mono text-[8px] tracking-widest text-[#00F2FF]/50 uppercase mb-2">Additional Technical Dossiers</p>
                        <div className="flex flex-wrap gap-3">
                          {proj.reports.map((r, i) => (
                            <div key={i} className="flex items-center gap-2 bg-[#00F2FF]/5 px-2 py-1 rounded border border-[#00F2FF]/20">
                              <FileText className="w-3 h-3 text-[#00F2FF]" />
                              <span className="font-mono text-[9px] text-white/70 uppercase">{r.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
