"use client";

import { useState } from "react";
import { useAdmin, Pillar } from "@/context/AdminContext";
import { Plus, Trash2, Save, X } from "lucide-react";

const ICON_OPTIONS = ["Hexagon", "Cpu", "Wrench", "Crosshair", "Code", "Settings", "Layers", "Zap"];

function PillarCard({ pillar, onChange, onDelete }: { pillar: Pillar; onChange: (u: Pillar) => void; onDelete: () => void; }) {
  const setBullet = (i: number, val: string) => {
    const bullets = [...pillar.bullets];
    bullets[i] = val;
    onChange({ ...pillar, bullets });
  };
  const addBullet = () => onChange({ ...pillar, bullets: [...pillar.bullets, "New competency point"] });
  const removeBullet = (i: number) => onChange({ ...pillar, bullets: pillar.bullets.filter((_, idx) => idx !== i) });

  return (
    <div className="border border-[#00F2FF]/20 rounded-xl bg-black/30 p-5 flex flex-col gap-4 hover:border-[#00F2FF]/40 transition-colors">
      <div className="flex items-start gap-3">
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <label className="font-mono text-[8px] tracking-[0.25em] text-[#00F2FF]/50 uppercase">Pillar Title</label>
          <input type="text" value={pillar.title} onChange={(e) => onChange({ ...pillar, title: e.target.value })} className="bg-black/50 border border-[#00F2FF]/30 rounded-lg px-3 py-2 font-mono text-xs text-[#00F2FF] font-bold focus:outline-none focus:border-[#00F2FF]/70 transition-all" />
          <div className="flex items-center gap-2 mt-1">
            <label className="font-mono text-[8px] tracking-[0.2em] text-[#00F2FF]/50 uppercase shrink-0">Icon:</label>
            <select value={pillar.iconName} onChange={(e) => onChange({ ...pillar, iconName: e.target.value })} className="bg-black/50 border border-[#00F2FF]/20 rounded px-2 py-1 font-mono text-[9px] text-white focus:outline-none focus:border-[#00F2FF]/60 transition-all flex-1">
              {ICON_OPTIONS.map((icon) => <option key={icon} value={icon}>{icon}</option>)}
            </select>
          </div>
        </div>
        <button onClick={onDelete} className="p-1.5 text-red-400/40 hover:text-red-400 hover:bg-red-400/10 rounded transition-all shrink-0 mt-1"><Trash2 className="w-3.5 h-3.5" /></button>
      </div>
      <div className="border-l-2 border-[#00F2FF]/20 pl-4 flex flex-col gap-2">
        <label className="font-mono text-[8px] tracking-[0.2em] text-[#00F2FF]/50 uppercase">Competency Points</label>
        {pillar.bullets.map((bullet, i) => (
          <div key={i} className="flex items-center gap-2">
            <input type="text" value={bullet} onChange={(e) => setBullet(i, e.target.value)} className="flex-1 bg-black/30 border border-white/10 rounded px-2.5 py-1.5 font-mono text-[10px] text-white/80 focus:outline-none focus:border-[#00F2FF]/50 transition-all" />
            <button onClick={() => removeBullet(i)} className="p-1 text-red-400/40 hover:text-red-400 rounded transition-colors shrink-0"><X className="w-3 h-3" /></button>
          </div>
        ))}
        <button onClick={addBullet} className="flex items-center gap-1.5 text-[#00F2FF]/50 hover:text-[#00F2FF] font-mono text-[9px] tracking-widest uppercase transition-colors mt-1">
          <Plus className="w-3 h-3" /> Add Point
        </button>
      </div>
    </div>
  );
}

export function CapabilityMatrix() {
  const { pillars, addPillar, editPillar, deletePillar } = useAdmin();
  const [draft, setDraft] = useState<Pillar[]>(pillars);
  const [dirty, setDirty] = useState(false);
  const [synced, setSynced] = useState(false);

  const update = (updated: Pillar) => { setDraft((prev) => prev.map((p) => (p.id === updated.id ? updated : p))); setDirty(true); setSynced(false); };
  const remove = (id: string) => { setDraft((prev) => prev.filter((p) => p.id !== id)); setDirty(true); setSynced(false); };
  const handleAddPillar = () => { setDraft((prev) => [...prev, { id: `draft-${Date.now()}`, title: "New Capability", iconName: "Hexagon", bullets: ["New competency point"] }]); setDirty(true); setSynced(false); };

  const handleSaveAll = () => {
    const existingIds = pillars.map((p) => p.id);
    const draftIds = draft.map((p) => p.id);
    existingIds.forEach((id) => { if (!draftIds.includes(id)) deletePillar(id); });
    draft.forEach((p) => {
      if (existingIds.includes(p.id)) editPillar(p.id, p);
      else addPillar({ title: p.title, iconName: p.iconName, bullets: p.bullets });
    });
    setDirty(false);
    setSynced(true);
    setTimeout(() => setSynced(false), 3000);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-mono text-base font-bold text-white tracking-[0.15em] uppercase">Capability Matrix</h2>
          <p className="font-mono text-[10px] text-[#94A3B8]/60 tracking-widest mt-0.5">{draft.length} technical pillars — push live to update public site</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {dirty && <button onClick={() => { setDraft(pillars); setDirty(false); }} className="px-4 py-2 font-mono text-xs tracking-widest uppercase text-[#94A3B8] border border-white/10 rounded-lg hover:border-white/30 transition-colors">Discard</button>}
          <button onClick={handleAddPillar} className="flex items-center gap-2 px-4 py-2 bg-black/40 border border-[#00F2FF]/30 text-[#00F2FF] font-mono text-xs tracking-widest uppercase rounded-lg hover:bg-[#00F2FF]/10 transition-all"><Plus className="w-3.5 h-3.5" /> Add Pillar</button>
          <button onClick={handleSaveAll} disabled={!dirty} className="flex items-center gap-2 px-5 py-2 bg-[#00F2FF] text-black font-mono text-xs font-bold tracking-widest uppercase rounded-lg hover:bg-[#00F2FF]/80 shadow-[0_0_15px_rgba(0,242,255,0.3)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"><Save className="w-3.5 h-3.5" /> COMMIT DATA</button>
          {synced && (
            <div className="px-3 py-1.5 border border-[#00F2FF]/50 bg-[#00F2FF]/10 rounded flex items-center gap-2 animate-pulse">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00F2FF]" />
              <span className="font-mono text-[8px] text-[#00F2FF] font-bold tracking-widest uppercase">DATA SYNCED</span>
            </div>
          )}
        </div>
      </div>
      {dirty && (
        <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-4 py-2.5">
          <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
          <span className="font-mono text-[9px] tracking-widest uppercase text-yellow-400">Unsaved changes — click &quot;Push Live&quot; to update the public site</span>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {draft.map((pillar) => <PillarCard key={pillar.id} pillar={pillar} onChange={update} onDelete={() => remove(pillar.id)} />)}
        {draft.length === 0 && <div className="col-span-full text-center py-16 font-mono text-[#94A3B8]/40 text-xs tracking-widest uppercase border border-dashed border-[#00F2FF]/10 rounded-xl">No pillars. Click &ldquo;Add Pillar&rdquo; to begin.</div>}
      </div>
    </div>
  );
}
