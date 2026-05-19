"use client";

import { useState } from "react";
import { useAdmin, CaseProject } from "@/context/AdminContext";
import { Plus, Edit2, Trash2, X, ChevronDown, ChevronUp, Camera, Save, Loader2, FileText, FileArchive } from "lucide-react";

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "images" | "zipUrl" | "pdfUrl") => {
    if (!e.target.files || e.target.files.length === 0) return;

    setIsUploading(true);
    setUploadStatus(`Uploading ${field}...`);

    const files = Array.from(e.target.files);

    try {
      // First, try the cloud upload API
      const formData = new FormData();
      files.forEach(file => formData.append("files", file));
      formData.append("folder", field === "images" ? "portfolio/projects/renders" : field === "zipUrl" ? "portfolio/projects/zip" : "portfolio/projects/pdf");

      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (res.ok && data.urls) {
        // Cloud upload success
        if (field === "images") {
          set("images", [...form.images, ...data.urls]);
        } else {
          set(field, data.urls[0]);
        }
        setUploadStatus(null);
        setIsUploading(false);
        return;
      } else {
        alert(`Cloud upload failed: ${data.error || 'Unknown error'}. Falling back to local encoding (This may break sync if file is >4MB).`);
      }
    } catch (err: any) {
      alert(`Cloud upload exception: ${err.message}. Falling back to local encoding.`);
      // Cloud unavailable — fall through to local base64 fallback
    }

    // Fallback: convert to base64 data URLs (works without Supabase)
    if (field === "images") {
      const base64Urls: string[] = [];
      for (const file of files) {
        const b64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) => resolve(ev.target?.result as string);
          reader.readAsDataURL(file);
        });
        base64Urls.push(b64);
      }
      set("images", [...form.images, ...base64Urls]);
    } else {
      // Convert PDF/ZIP to base64 so it can be downloaded locally
      const file = files[0];
      const b64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (ev) => resolve(ev.target?.result as string);
        reader.readAsDataURL(file);
      });
      set(field, b64);
    }

    setIsUploading(false);
    setUploadStatus(null);
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
          <InputField label="Video URL (YouTube/Vimeo/MP4)" value={form.videoUrl || ""} onChange={(v) => set("videoUrl", v)} placeholder="https://..." />
        </div>
        <InputField label="Mechanical Components" value={form.components} onChange={(v) => set("components", v)} placeholder="e.g., Jaw Crusher Frame, Impact Rotors" required />
        <InputField label="Automation Stack" value={form.automation} onChange={(v) => set("automation", v)} placeholder="e.g., PLC Load Monitoring, Proximity Sensors" required />

        {/* File Sizes */}
        <div className="grid grid-cols-3 gap-4">
          <InputField label="CAD File Size" value={form.cadSize || ""} onChange={(v) => set("cadSize", v)} placeholder="e.g., 142 MB" />
          <InputField label="DWG File Size" value={form.dwgSize || ""} onChange={(v) => set("dwgSize", v)} placeholder="e.g., 18 MB" />
          <InputField label="Render Size" value={form.renderSize || ""} onChange={(v) => set("renderSize", v)} placeholder="e.g., 1.2 GB" />
        </div>

        {/* Image Upload */}
        <div className="flex flex-col gap-2">
          <label className="font-mono text-[9px] tracking-[0.25em] text-[#00F2FF]/70 uppercase">
            Project Renders / Images
          </label>
          <label className="flex items-center gap-3 border border-dashed border-[#00F2FF]/25 rounded-lg p-4 cursor-pointer hover:border-[#00F2FF]/50 hover:bg-[#00F2FF]/5 transition-all">
            {isUploading && uploadStatus?.includes("images") ? <Loader2 className="w-4 h-4 text-[#00F2FF] animate-spin" /> : <Camera className="w-4 h-4 text-[#00F2FF]/60" />}
            <span className="font-mono text-[10px] text-[#94A3B8]/60 tracking-widest">
              {isUploading && uploadStatus?.includes("images") ? "UPLOADING_ASSETS..." : "Click to upload renders (JPG, PNG, WebP) - MULTIPLE SELECTION SUPPORTED"}
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
              <p className="text-[9px] font-mono text-[#00F2FF]/50 self-center">{form.images.length} file(s) persisted</p>
            </div>
          )}
        </div>

        {/* Technical Asset Uploads */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-[#00F2FF]/10">
          <div className="flex flex-col gap-2">
            <label className="font-mono text-[9px] tracking-[0.2em] text-[#00F2FF]/70 uppercase flex items-center justify-between">
              <span>Technical ZIP Package</span>
              {form.zipUrl && <span className="text-emerald-400 text-[7px]">READY</span>}
            </label>
            <div className="relative">
              {form.zipUrl ? (
                <div className="flex items-center gap-3 bg-[#00F2FF]/10 border border-[#00F2FF]/30 rounded-lg p-3">
                  <FileArchive className="w-5 h-5 text-[#00F2FF]" />
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-[10px] text-[#00F2FF] truncate">Technical_Assets.zip</p>
                    <p className="font-mono text-[7px] text-[#00F2FF]/50 truncate uppercase tracking-widest">Linked Asset Active</p>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => set("zipUrl", "")}
                    className="p-1.5 text-red-400/50 hover:text-red-400 hover:bg-red-400/10 rounded transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <input
                  type="file"
                  accept=".zip,.rar,.7z"
                  onChange={(e) => handleFileUpload(e, "zipUrl")}
                  className="w-full text-[9px] text-white/40 font-mono file:mr-3 file:py-2 file:px-3 file:rounded file:border-0 file:text-[9px] file:bg-[#00F2FF]/15 file:text-[#00F2FF] hover:file:bg-[#00F2FF]/25 file:font-mono cursor-pointer bg-black/20 border border-[#00F2FF]/10 rounded-lg p-1"
                  disabled={isUploading}
                />
              )}
              {isUploading && uploadStatus?.includes("zipUrl") && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-[#00F2FF] animate-spin" />
              )}
            </div>
          </div>
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
                    const formData = new FormData();
                    formData.append("files", file);
                    formData.append("folder", "portfolio/projects/reports");
                    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
                    const data = await res.json();
                    if (res.ok && data.urls) url = data.urls[0];
                  } catch {}

                  if (!url) {
                    url = await new Promise<string>((resolve) => {
                      const reader = new FileReader();
                      reader.onload = (ev) => resolve(ev.target?.result as string);
                      reader.readAsDataURL(file);
                    });
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
  const { projects, addProject, editProject, deleteProject } = useAdmin();
  const [mode, setMode] = useState<"list" | "add" | "edit">("list");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [synced, setSynced] = useState(false);

  const handleSaveNew = async (p: Omit<CaseProject, "id">) => {
    addProject(p);
    setMode("list");
    setSynced(true);
    setTimeout(() => setSynced(false), 3000);
  };

  const handleSaveEdit = async (p: Omit<CaseProject, "id">) => {
    if (editingId) editProject(editingId, p);
    setMode("list");
    setEditingId(null);
    setSynced(true);
    setTimeout(() => setSynced(false), 3000);
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Remove "${title}" from portfolio? This cannot be undone.`)) {
      deleteProject(id);
    }
  };

  const editingProject = projects.find((p) => p.id === editingId);

  return (
    <div className="flex flex-col gap-6">
      {synced && (
        <div className="bg-[#00F2FF]/10 border border-[#00F2FF]/40 rounded-lg p-3 flex items-center justify-center shadow-[0_0_20px_rgba(0,242,255,0.15)] animate-in slide-in-from-top-2 fade-in duration-300">
          <p className="font-mono text-[10px] text-[#00F2FF] font-bold tracking-widest uppercase text-center flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00F2FF] animate-pulse" />
            DATA SYNCED - Project is now live on the public site
          </p>
        </div>
      )}
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-mono text-base font-bold text-white tracking-[0.15em] uppercase">Project Manager</h2>
          <p className="font-mono text-[10px] text-[#94A3B8]/60 tracking-widest mt-0.5">
            {projects.length} case {projects.length === 1 ? "study" : "studies"} in portfolio
          </p>
        </div>
        {mode === "list" && (
          <button
            onClick={() => setMode("add")}
            className="flex items-center gap-2 px-4 py-2 bg-[#00F2FF]/10 border border-[#00F2FF]/40 text-[#00F2FF] font-mono text-xs tracking-widest uppercase rounded-lg hover:bg-[#00F2FF]/20 hover:border-[#00F2FF] transition-all"
          >
            <Plus className="w-4 h-4" /> New Case Study
          </button>
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
                <div className="border-t border-[#00F2FF]/10 px-5 py-4 bg-black/20 grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { label: "Components", value: proj.components },
                    { label: "Automation", value: proj.automation },
                    { label: "CAD/DWG/Render", value: `${proj.cadSize || "—"} / ${proj.dwgSize || "—"} / ${proj.renderSize || "—"}` },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="font-mono text-[8px] tracking-widest text-[#00F2FF]/50 uppercase mb-1">{label}</p>
                      <p className="font-mono text-[10px] text-[#94A3B8] leading-relaxed">{value}</p>
                    </div>
                  ))}
                  <div className="col-span-full grid grid-cols-2 gap-4 mt-2 pt-3 border-t border-[#00F2FF]/5">
                    <div>
                      <p className="font-mono text-[8px] tracking-widest text-[#00F2FF]/50 uppercase mb-1">ZIP Package</p>
                      {proj.zipUrl ? (
                        <div className="flex items-center gap-2">
                          <FileArchive className="w-3.5 h-3.5 text-[#00F2FF]" />
                          <span className="font-mono text-[9px] text-[#00F2FF] uppercase">Linked Asset Active</span>
                        </div>
                      ) : (
                        <p className="font-mono text-[9px] text-white/20 uppercase tracking-widest">Not Uploaded</p>
                      )}
                    </div>
                    <div>
                      <p className="font-mono text-[8px] tracking-widest text-[#00F2FF]/50 uppercase mb-1">Main Engineering Report</p>
                      {proj.pdfUrl ? (
                        <div className="flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5 text-[#00F2FF]" />
                          <span className="font-mono text-[9px] text-[#00F2FF] uppercase">Main Report Active</span>
                        </div>
                      ) : (
                        <p className="font-mono text-[9px] text-white/20 uppercase tracking-widest">Not Uploaded</p>
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
