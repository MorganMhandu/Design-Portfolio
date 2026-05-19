"use client";

import { useState } from "react";
import { useAdmin, Report } from "@/context/AdminContext";
import { Plus, Edit2, Trash2, X, ChevronDown, ChevronUp, FileText, Save, Loader2, FileUp } from "lucide-react";

const emptyReport = (): Omit<Report, "id"> => ({
  title: "",
  description: "",
  fileName: "",
  cloudUrl: "",
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

function ReportForm({
  initial,
  onSave,
  onCancel,
  title,
}: {
  initial: Omit<Report, "id">;
  onSave: (r: Omit<Report, "id">) => Promise<void>;
  onCancel: () => void;
  title: string;
}) {
  const [form, setForm] = useState(initial);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const set = (key: keyof typeof form, val: any) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setIsUploading(true);
    const file = e.target.files[0];
    setUploadStatus(`Uploading ${file.name}...`);

    try {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const filename = `portfolio/reports/${uniqueSuffix}-${file.name.replace(/\s+/g, "_")}`;

      const presignRes = await fetch("/api/admin/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename })
      });
      const presignData = await presignRes.json();

      if (!presignRes.ok || presignData.error) {
        throw new Error(presignData.error || "Failed to get upload URL");
      }

      const uploadRes = await fetch(presignData.signedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file
      });

      if (!uploadRes.ok) throw new Error("Failed to upload report");

      set("cloudUrl", presignData.publicUrl);
      set("fileName", file.name);
      setUploadStatus(null);
      setIsUploading(false);
    } catch (err: any) {
      alert(`Upload failed: ${err.message}`);
      setIsUploading(false);
      setUploadStatus(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await onSave(form);
    setIsSaving(false);
  };

  return (
    <div className="bg-[#020617]/80 border border-[#00F2FF]/30 rounded-xl p-6 shadow-[0_0_30px_rgba(0,242,255,0.07)]">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#00F2FF]/15">
        <h3 className="font-mono text-sm font-bold text-white tracking-[0.15em] uppercase">{title}</h3>
        <button onClick={onCancel} className="text-[#94A3B8]/60 hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <InputField label="Report Title" value={form.title} onChange={(v) => set("title", v)} placeholder="e.g., Structural Integrity Analysis Q4" required />
        
        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-[9px] tracking-[0.25em] text-[#00F2FF]/70 uppercase">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Brief overview of the report contents..."
            className="bg-black/40 border border-[#00F2FF]/20 rounded-lg px-3 py-2.5 font-mono text-xs text-white focus:outline-none focus:border-[#00F2FF]/70 h-24 transition-all placeholder:text-white/20 resize-none"
          />
        </div>

        <div className="flex flex-col gap-2 pt-2 border-t border-[#00F2FF]/10">
          <label className="font-mono text-[9px] tracking-[0.2em] text-[#00F2FF]/70 uppercase flex items-center justify-between">
            <span>Engineering Report (PDF)</span>
            {form.cloudUrl && <span className="text-emerald-400 text-[7px]">READY</span>}
          </label>
          <div className="relative">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="w-full text-[9px] text-white/40 font-mono file:mr-3 file:py-2 file:px-3 file:rounded file:border-0 file:text-[9px] file:bg-[#00F2FF]/15 file:text-[#00F2FF] hover:file:bg-[#00F2FF]/25 cursor-pointer bg-black/20 border border-[#00F2FF]/10 rounded-lg p-1"
              disabled={isUploading}
            />
            {isUploading && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-[#00F2FF] animate-spin" />
            )}
          </div>
          {form.fileName && <p className="text-[7px] font-mono text-[#00F2FF]/40 truncate">{form.fileName}</p>}
        </div>

        <div className="flex gap-3 justify-end mt-4">
          <button type="button" onClick={onCancel} className="px-5 py-2 font-mono text-xs tracking-widest uppercase text-[#94A3B8] border border-white/10 rounded-lg hover:border-white/30 transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={isSaving || isUploading || !form.cloudUrl} className="px-6 py-2 font-mono text-xs tracking-widest uppercase bg-[#00F2FF] text-black font-bold rounded-lg hover:bg-[#00F2FF]/80 shadow-[0_0_15px_rgba(0,242,255,0.3)] transition-all flex items-center gap-2 disabled:opacity-50">
            {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />} 
            {isSaving ? "SYNCING..." : "COMMIT REPORT"}
          </button>
        </div>
      </form>
    </div>
  );
}

export function ReportManager() {
  const { reports, addReport, editReport, deleteReport } = useAdmin();
  const [mode, setMode] = useState<"list" | "add" | "edit">("list");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [synced, setSynced] = useState(false);

  const handleSaveNew = async (r: Omit<Report, "id">) => {
    addReport(r);
    setMode("list");
    setSynced(true);
    setTimeout(() => setSynced(false), 3000);
  };

  const handleSaveEdit = async (r: Omit<Report, "id">) => {
    if (editingId) editReport(editingId, r);
    setMode("list");
    setEditingId(null);
    setSynced(true);
    setTimeout(() => setSynced(false), 3000);
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Delete report "${title}"?`)) {
      deleteReport(id);
    }
  };

  const editingReport = reports.find((r) => r.id === editingId);

  return (
    <div className="flex flex-col gap-6">
      {synced && (
        <div className="bg-[#00F2FF]/10 border border-[#00F2FF]/40 rounded-lg p-3 flex items-center justify-center shadow-[0_0_20px_rgba(0,242,255,0.15)] animate-in slide-in-from-top-2 fade-in duration-300">
          <p className="font-mono text-[10px] text-[#00F2FF] font-bold tracking-widest uppercase text-center flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00F2FF] animate-pulse" />
            DOSSIER UPDATED - Report is now live
          </p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-mono text-base font-bold text-white tracking-[0.15em] uppercase">Report Manager</h2>
          <p className="font-mono text-[10px] text-[#94A3B8]/60 tracking-widest mt-0.5">
            {reports.length} report(s) in Engineering Dossier
          </p>
        </div>
        {mode === "list" && (
          <button
            onClick={() => setMode("add")}
            className="flex items-center gap-2 px-4 py-2 bg-[#00F2FF]/10 border border-[#00F2FF]/40 text-[#00F2FF] font-mono text-xs tracking-widest uppercase rounded-lg hover:bg-[#00F2FF]/20 transition-all"
          >
            <Plus className="w-4 h-4" /> New Report
          </button>
        )}
      </div>

      {mode === "add" && (
        <ReportForm title="[ ADD ] New Report" initial={emptyReport()} onSave={handleSaveNew} onCancel={() => setMode("list")} />
      )}

      {mode === "edit" && editingReport && (
        <ReportForm
          title={`[ EDIT ] ${editingReport.title}`}
          initial={editingReport}
          onSave={handleSaveEdit}
          onCancel={() => { setMode("list"); setEditingId(null); }}
        />
      )}

      {mode === "list" && (
        <div className="flex flex-col gap-3">
          {reports.length === 0 && (
            <div className="text-center py-16 font-mono text-[#94A3B8]/40 text-xs tracking-widest uppercase border border-dashed border-[#00F2FF]/10 rounded-xl">
              No reports found. Click &ldquo;New Report&rdquo; to begin.
            </div>
          )}
          {reports.map((report) => (
            <div key={report.id} className="border border-[#00F2FF]/20 rounded-xl bg-black/30 overflow-hidden hover:border-[#00F2FF]/40 transition-colors">
              <div className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <FileText className="w-4 h-4 text-[#00F2FF]" />
                  <div className="min-w-0">
                    <p className="font-mono text-sm text-white font-bold truncate">{report.title}</p>
                    <p className="font-mono text-[9px] text-[#94A3B8]/60 tracking-widest uppercase truncate">{report.fileName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4 shrink-0">
                  <button
                    onClick={() => { setEditingId(report.id); setMode("edit"); }}
                    className="p-1.5 text-[#00F2FF]/50 hover:text-[#00F2FF] hover:bg-[#00F2FF]/10 rounded transition-all"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(report.id, report.title)}
                    className="p-1.5 text-red-400/50 hover:text-red-400 hover:bg-red-400/10 rounded transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
