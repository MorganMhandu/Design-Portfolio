"use client";

import { useState } from "react";
import { useAdmin, Report } from "@/context/AdminContext";
import { Plus, Edit2, Trash2, X, FileText, Upload, Save } from "lucide-react";

const emptyReport = (): Omit<Report, "id"> => ({ title: "", description: "", fileName: "" });

function ReportForm({ initial, onSave, onCancel, title }: { initial: Omit<Report, "id">; onSave: (r: Omit<Report, "id">) => void; onCancel: () => void; title: string; }) {
  const [form, setForm] = useState(initial);
  const set = (key: keyof typeof form, val: string) => setForm((prev) => ({ ...prev, [key]: val }));

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) set("fileName", e.target.files[0].name);
  };

  return (
    <div className="bg-[#020617]/80 border border-[#00F2FF]/30 rounded-xl p-6 shadow-[0_0_30px_rgba(0,242,255,0.07)]">
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-[#00F2FF]/15">
        <h3 className="font-mono text-sm font-bold text-white tracking-[0.15em] uppercase">{title}</h3>
        <button onClick={onCancel} className="text-[#94A3B8]/60 hover:text-white transition-colors"><X className="w-4 h-4" /></button>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-[9px] tracking-[0.25em] text-[#00F2FF]/70 uppercase">Report Title <span className="text-red-400">*</span></label>
          <input required type="text" value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g., Feasibility Study: Gold Processing" className="bg-black/40 border border-[#00F2FF]/20 rounded-lg px-3 py-2.5 font-mono text-xs text-white focus:outline-none focus:border-[#00F2FF]/70 transition-all placeholder:text-white/20" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-[9px] tracking-[0.25em] text-[#00F2FF]/70 uppercase">Abstract / Description <span className="text-red-400">*</span></label>
          <textarea required value={form.description} onChange={(e) => set("description", e.target.value)} rows={4} placeholder="Technical abstract for this engineering report..." className="bg-black/40 border border-[#00F2FF]/20 rounded-lg px-3 py-2.5 font-mono text-xs text-white focus:outline-none focus:border-[#00F2FF]/70 transition-all resize-none placeholder:text-white/20" />
        </div>
        <div className="flex flex-col gap-2 border border-[#00F2FF]/15 rounded-lg p-4 bg-black/20">
          <label className="font-mono text-[9px] tracking-[0.25em] text-[#00F2FF]/70 uppercase flex items-center gap-2">
            <Upload className="w-3 h-3" /> Attach PDF Document
          </label>
          <input type="file" accept=".pdf" onChange={handleFile} className="text-[9px] text-white/40 font-mono file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-[9px] file:bg-[#00F2FF]/15 file:text-[#00F2FF] hover:file:bg-[#00F2FF]/25 file:font-mono cursor-pointer" />
          {form.fileName && <p className="font-mono text-[9px] text-[#00F2FF] truncate">Staged: {form.fileName}</p>}
          {!form.fileName && (
            <div className="flex flex-col gap-1.5 mt-1">
              <label className="font-mono text-[8px] tracking-widest text-[#94A3B8]/40 uppercase">Or enter filename manually</label>
              <input type="text" value={form.fileName} onChange={(e) => set("fileName", e.target.value)} placeholder="e.g., Report_Name_v1.pdf" className="bg-black/30 border border-white/10 rounded px-2.5 py-1.5 font-mono text-[10px] text-white/80 focus:outline-none focus:border-[#00F2FF]/40 transition-all" />
            </div>
          )}
        </div>
        <div className="flex gap-3 justify-end mt-1">
          <button type="button" onClick={onCancel} className="px-5 py-2 font-mono text-xs tracking-widest uppercase text-[#94A3B8] border border-white/10 rounded-lg hover:border-white/30 transition-colors">Cancel</button>
          <button type="submit" className="px-6 py-2 font-mono text-xs tracking-widest uppercase bg-[#00F2FF] text-black font-bold rounded-lg hover:bg-[#00F2FF]/80 shadow-[0_0_15px_rgba(0,242,255,0.3)] transition-all flex items-center gap-2"><Save className="w-3.5 h-3.5" /> COMMIT DATA</button>
        </div>
      </form>
    </div>
  );
}

export function DossierVault() {
  const { reports, addReport, editReport, deleteReport } = useAdmin();
  const [mode, setMode] = useState<"list" | "add" | "edit">("list");
  const [editingId, setEditingId] = useState<string | null>(null);

  const [publishSuccess, setPublishSuccess] = useState(false);

  const handleSaveNew = (r: Omit<Report, "id">) => { 
    addReport(r); 
    setMode("list"); 
    setPublishSuccess(true);
    setTimeout(() => setPublishSuccess(false), 4000);
  };
  const handleSaveEdit = (r: Omit<Report, "id">) => { if (editingId) editReport(editingId, r); setMode("list"); setEditingId(null); };
  const handleDelete = (id: string, title: string) => { if (window.confirm(`Remove "${title}" from the dossier?`)) deleteReport(id); };

  const editingReport = reports.find((r) => r.id === editingId);

  return (
    <div className="flex flex-col gap-6">
      {publishSuccess && (
        <div className="bg-[#00F2FF]/10 border border-[#00F2FF]/40 rounded-lg p-3 flex items-center justify-center shadow-[0_0_20px_rgba(0,242,255,0.15)] animate-in slide-in-from-top-2 fade-in duration-300">
          <p className="font-mono text-[10px] text-[#00F2FF] font-bold tracking-widest uppercase text-center flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00F2FF] animate-pulse" />
            DATA SYNCED - Report is now live on the public Dossier
          </p>
        </div>
      )}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-mono text-base font-bold text-white tracking-[0.15em] uppercase">Dossier Vault</h2>
          <p className="font-mono text-[10px] text-[#94A3B8]/60 tracking-widest mt-0.5">{reports.length} engineering {reports.length === 1 ? "report" : "reports"} on file</p>
        </div>
        {mode === "list" && (
          <button onClick={() => setMode("add")} className="flex items-center gap-2 px-4 py-2 bg-[#00F2FF]/10 border border-[#00F2FF]/40 text-[#00F2FF] font-mono text-xs tracking-widest uppercase rounded-lg hover:bg-[#00F2FF]/20 hover:border-[#00F2FF] transition-all">
            <Plus className="w-4 h-4" /> Upload Report
          </button>
        )}
      </div>

      {mode === "add" && <ReportForm title="[ UPLOAD ] New Engineering Report" initial={emptyReport()} onSave={handleSaveNew} onCancel={() => setMode("list")} />}
      {mode === "edit" && editingReport && <ReportForm title={`[ EDIT ] ${editingReport.title}`} initial={editingReport} onSave={handleSaveEdit} onCancel={() => { setMode("list"); setEditingId(null); }} />}

      {mode === "list" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {reports.length === 0 && (
            <div className="col-span-full text-center py-16 font-mono text-[#94A3B8]/40 text-xs tracking-widest uppercase border border-dashed border-[#00F2FF]/10 rounded-xl">No reports in vault. Click &ldquo;Upload Report&rdquo; to begin.</div>
          )}
          {reports.map((report) => (
            <div key={report.id} className="group border border-[#00F2FF]/20 rounded-xl bg-black/30 p-5 flex flex-col gap-3 hover:border-[#00F2FF]/40 transition-colors relative">
              <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => { setEditingId(report.id); setMode("edit"); }} className="p-1.5 text-[#00F2FF]/60 hover:text-[#00F2FF] hover:bg-[#00F2FF]/10 rounded transition-all"><Edit2 className="w-3 h-3" /></button>
                <button onClick={() => handleDelete(report.id, report.title)} className="p-1.5 text-red-400/60 hover:text-red-400 hover:bg-red-400/10 rounded transition-all"><Trash2 className="w-3 h-3" /></button>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#00F2FF]/10 border border-[#00F2FF]/30 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-[#00F2FF]/70" />
                </div>
                <div className="min-w-0 pr-12">
                  <p className="font-mono text-xs font-bold text-white uppercase tracking-wide truncate">{report.title}</p>
                </div>
              </div>
              <p className="font-mono text-[10px] text-[#94A3B8]/70 leading-relaxed border-l border-[#00F2FF]/20 pl-3 line-clamp-3">{report.description}</p>
              <div className="mt-auto pt-3 border-t border-[#00F2FF]/10">
                <p className="font-mono text-[9px] text-[#00F2FF]/50 truncate">{report.fileName || "No file attached"}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
