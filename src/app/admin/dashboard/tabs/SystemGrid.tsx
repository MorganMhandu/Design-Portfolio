"use client";

import { useState } from "react";
import { useAdmin, DigitalSystem } from "@/context/AdminContext";
import { Plus, Edit2, Trash2, X, LayoutTemplate, Link as LinkIcon, Save, Layers } from "lucide-react";

const emptySystem = (): Omit<DigitalSystem, "id"> => ({
  title: "",
  techStack: [],
  description: "",
  link: "#",
  version: "V1.0",
});

function SystemForm({ initial, onSave, onCancel, title }: { initial: Omit<DigitalSystem, "id">; onSave: (s: Omit<DigitalSystem, "id">) => void; onCancel: () => void; title: string; }) {
  const [form, setForm] = useState(initial);
  const [techInput, setTechInput] = useState("");

  const set = (key: keyof typeof form, val: any) => setForm((prev) => ({ ...prev, [key]: val }));

  const addTech = () => {
    if (techInput.trim() && !form.techStack.includes(techInput.trim())) {
      set("techStack", [...form.techStack, techInput.trim()]);
      setTechInput("");
    }
  };

  const removeTech = (tech: string) => set("techStack", form.techStack.filter(t => t !== tech));

  return (
    <div className="bg-[#020617]/80 border border-[#00F2FF]/30 rounded-xl p-6 shadow-[0_0_30px_rgba(0,242,255,0.07)]">
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-[#00F2FF]/15">
        <h3 className="font-mono text-sm font-bold text-white tracking-[0.15em] uppercase">{title}</h3>
        <button onClick={onCancel} className="text-[#94A3B8]/60 hover:text-white transition-colors"><X className="w-4 h-4" /></button>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[9px] tracking-[0.25em] text-[#00F2FF]/70 uppercase">System Name</label>
            <input required type="text" value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g., Engineering Visualizer" className="bg-black/40 border border-[#00F2FF]/20 rounded-lg px-3 py-2.5 font-mono text-xs text-white focus:outline-none focus:border-[#00F2FF]/70 transition-all placeholder:text-white/20" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[9px] tracking-[0.25em] text-[#00F2FF]/70 uppercase">Version / Type</label>
            <input required type="text" value={form.version} onChange={(e) => set("version", e.target.value)} placeholder="e.g., V1.0 / WEB_SYS" className="bg-black/40 border border-[#00F2FF]/20 rounded-lg px-3 py-2.5 font-mono text-xs text-white focus:outline-none focus:border-[#00F2FF]/70 transition-all placeholder:text-white/20" />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-[9px] tracking-[0.25em] text-[#00F2FF]/70 uppercase">System Description</label>
          <textarea required value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} placeholder="Technical summary of the digital system..." className="bg-black/40 border border-[#00F2FF]/20 rounded-lg px-3 py-2.5 font-mono text-xs text-white focus:outline-none focus:border-[#00F2FF]/70 transition-all resize-none placeholder:text-white/20" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-[9px] tracking-[0.25em] text-[#00F2FF]/70 uppercase">Launch Link / URL</label>
          <input type="text" value={form.link} onChange={(e) => set("link", e.target.value)} placeholder="https://..." className="bg-black/40 border border-[#00F2FF]/20 rounded-lg px-3 py-2.5 font-mono text-xs text-white focus:outline-none focus:border-[#00F2FF]/70 transition-all placeholder:text-white/20" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-mono text-[9px] tracking-[0.25em] text-[#00F2FF]/70 uppercase">Tech Stack</label>
          <div className="flex gap-2">
            <input type="text" value={techInput} onChange={(e) => setTechInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTech())} placeholder="Add tech (e.g., React)" className="flex-1 bg-black/40 border border-[#00F2FF]/20 rounded-lg px-3 py-2 font-mono text-xs text-white focus:outline-none focus:border-[#00F2FF]/70 transition-all placeholder:text-white/20" />
            <button type="button" onClick={addTech} className="px-3 py-2 bg-[#00F2FF]/10 text-[#00F2FF] border border-[#00F2FF]/30 rounded-lg hover:bg-[#00F2FF]/20 transition-all"><Plus className="w-4 h-4" /></button>
          </div>
          <div className="flex flex-wrap gap-2 mt-1">
            {form.techStack.map(tech => (
              <span key={tech} className="px-2 py-1 bg-[#00F2FF]/5 border border-[#00F2FF]/20 rounded font-mono text-[10px] text-[#00F2FF] flex items-center gap-2">
                {tech}
                <button type="button" onClick={() => removeTech(tech)} className="hover:text-red-400 transition-colors"><X className="w-3 h-3" /></button>
              </span>
            ))}
          </div>
        </div>
        <div className="flex gap-3 justify-end mt-2">
          <button type="button" onClick={onCancel} className="px-5 py-2 font-mono text-xs tracking-widest uppercase text-[#94A3B8] border border-white/10 rounded-lg hover:border-white/30 transition-colors">Cancel</button>
          <button type="submit" className="px-6 py-2 font-mono text-xs tracking-widest uppercase bg-[#00F2FF] text-black font-bold rounded-lg hover:bg-[#00F2FF]/80 shadow-[0_0_15px_rgba(0,242,255,0.3)] transition-all flex items-center gap-2"><Save className="w-3 h-3" /> Save System</button>
        </div>
      </form>
    </div>
  );
}

export function SystemGrid() {
  const { systems, addSystem, editSystem, deleteSystem } = useAdmin();
  const [mode, setMode] = useState<"list" | "add" | "edit">("list");
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSaveNew = (s: Omit<DigitalSystem, "id">) => { addSystem(s); setMode("list"); };
  const handleSaveEdit = (s: Omit<DigitalSystem, "id">) => { if (editingId) editSystem(editingId, s); setMode("list"); setEditingId(null); };
  const handleDelete = (id: string, title: string) => { if (window.confirm(`Remove "${title}" from digital systems?`)) deleteSystem(id); };

  const editingSystem = systems.find(s => s.id === editingId);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-mono text-base font-bold text-white tracking-[0.15em] uppercase">System Grid</h2>
          <p className="font-mono text-[10px] text-[#94A3B8]/60 tracking-widest mt-0.5">{systems.length} digital systems integrated</p>
        </div>
        {mode === "list" && (
          <button onClick={() => setMode("add")} className="flex items-center gap-2 px-4 py-2 bg-[#00F2FF]/10 border border-[#00F2FF]/40 text-[#00F2FF] font-mono text-xs tracking-widest uppercase rounded-lg hover:bg-[#00F2FF]/20 hover:border-[#00F2FF] transition-all">
            <Plus className="w-4 h-4" /> New System
          </button>
        )}
      </div>

      {mode === "add" && <SystemForm title="[ DEPLOY ] New Digital System" initial={emptySystem()} onSave={handleSaveNew} onCancel={() => setMode("list")} />}
      {mode === "edit" && editingSystem && <SystemForm title={`[ PATCH ] ${editingSystem.title}`} initial={editingSystem} onSave={handleSaveEdit} onCancel={() => { setMode("list"); setEditingId(null); }} />}

      {mode === "list" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {systems.length === 0 && (
            <div className="col-span-full text-center py-16 font-mono text-[#94A3B8]/40 text-xs tracking-widest uppercase border border-dashed border-[#00F2FF]/10 rounded-xl">No systems in grid. Click &ldquo;New System&rdquo; to begin.</div>
          )}
          {systems.map((sys) => (
            <div key={sys.id} className="group border border-[#00F2FF]/20 rounded-xl bg-black/30 p-6 flex flex-col gap-4 hover:border-[#00F2FF]/40 transition-colors relative">
              <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => { setEditingId(sys.id); setMode("edit"); }} className="p-1.5 text-[#00F2FF]/60 hover:text-[#00F2FF] hover:bg-[#00F2FF]/10 rounded transition-all"><Edit2 className="w-3.5 h-3.5" /></button>
                <button onClick={() => handleDelete(sys.id, sys.title)} className="p-1.5 text-red-400/60 hover:text-red-400 hover:bg-red-400/10 rounded transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#00F2FF]/10 border border-[#00F2FF]/30 flex items-center justify-center shrink-0">
                  <LayoutTemplate className="w-6 h-6 text-[#00F2FF]/70" />
                </div>
                <div className="min-w-0 pr-12">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-mono text-sm font-bold text-white uppercase tracking-wide truncate">{sys.title}</p>
                  </div>
                  <p className="font-mono text-[10px] text-[#94A3B8]/70 leading-relaxed line-clamp-2">{sys.description}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {sys.techStack.map(tech => (
                  <span key={tech} className="px-2 py-0.5 bg-black/50 border border-white/10 rounded font-mono text-[9px] text-white/50">{tech}</span>
                ))}
              </div>
              <div className="mt-auto pt-4 border-t border-[#00F2FF]/10 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] font-mono text-[#00F2FF]/60">
                   <LinkIcon className="w-3 h-3" />
                   <span className="truncate max-w-[200px]">{sys.link}</span>
                </div>
                <button className="text-[9px] font-mono text-[#94A3B8] hover:text-[#00F2FF] transition-colors uppercase tracking-widest">Test Link</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
