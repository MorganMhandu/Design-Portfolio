"use client";

import { useState, useEffect } from "react";
import { useAdmin } from "@/context/AdminContext";
import { Smartphone, Mail, MapPin, Send, Save } from "lucide-react";

export function ContactController() {
  const { settings, updateSettings } = useAdmin();
  const [draft, setDraft] = useState(settings.contact);
  const [dirty, setDirty] = useState(false);
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    if (!dirty) setDraft(settings.contact);
  }, [settings.contact, dirty]);

  const handleChange = (field: string, value: string) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
    setDirty(true);
    setSynced(false);
  };

  const handleSave = () => {
    updateSettings({ contact: draft });
    setDirty(false);
    setSynced(true);
    setTimeout(() => setSynced(false), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <h2 className="font-mono text-lg font-bold text-white tracking-widest uppercase">Contact Controller</h2>
        <p className="font-mono text-[10px] text-[#94A3B8]/50 tracking-widest uppercase">Manage public-facing engagement data</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 border border-[#00F2FF]/20 rounded-2xl bg-[#00F2FF]/5 space-y-6">
          <div className="flex flex-col gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <Smartphone className="w-3.5 h-3.5 text-[#00F2FF]" />
                <label className="font-mono text-[10px] text-[#00F2FF] tracking-widest uppercase">Primary Phone</label>
              </div>
              <input 
                type="text" 
                value={draft.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 font-mono text-xs text-white focus:outline-none focus:border-[#00F2FF]/50 transition-colors"
                placeholder="+263 773 754 068"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <Send className="w-3.5 h-3.5 text-[#00F2FF]" />
                <label className="font-mono text-[10px] text-[#00F2FF] tracking-widest uppercase">WhatsApp Direct Link</label>
              </div>
              <input 
                type="text" 
                value={draft.whatsapp}
                onChange={(e) => handleChange("whatsapp", e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 font-mono text-xs text-white focus:outline-none focus:border-[#00F2FF]/50 transition-colors"
                placeholder="https://wa.me/263773754068"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <Mail className="w-3.5 h-3.5 text-[#00F2FF]" />
                <label className="font-mono text-[10px] text-[#00F2FF] tracking-widest uppercase">Direct Email</label>
              </div>
              <input 
                type="email" 
                value={draft.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 font-mono text-xs text-white focus:outline-none focus:border-[#00F2FF]/50 transition-colors"
                placeholder="morganmichaelmhandu@gmail.com"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-3.5 h-3.5 text-[#00F2FF]" />
                <label className="font-mono text-[10px] text-[#00F2FF] tracking-widest uppercase">Location</label>
              </div>
              <input 
                type="text" 
                value={draft.location}
                onChange={(e) => handleChange("location", e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 font-mono text-xs text-white focus:outline-none focus:border-[#00F2FF]/50 transition-colors"
                placeholder="Harare, Zimbabwe"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-8 border border-white/10 rounded-2xl bg-black/40 flex flex-col gap-4">
            <h3 className="font-mono text-xs font-bold text-white tracking-widest uppercase mb-2">System Preview</h3>
            <div className="p-6 border border-[#00F2FF]/20 rounded-xl bg-black/60 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded bg-[#00F2FF]/10 border border-[#00F2FF]/20 flex items-center justify-center text-[#00F2FF]">
                  <Smartphone className="w-4 h-4" />
                </div>
                <span className="font-mono text-xs text-white/80">{draft.phone}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded bg-[#00F2FF]/10 border border-[#00F2FF]/20 flex items-center justify-center text-[#00F2FF]">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="font-mono text-[10px] tracking-[0.3em] text-[#00F2FF]/60 uppercase">Direct Inquiry</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded bg-[#00F2FF]/10 border border-[#00F2FF]/20 flex items-center justify-center text-[#00F2FF]">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="font-mono text-xs font-bold text-[#00F2FF]">{draft.location}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={!dirty}
              className="flex items-center gap-2 px-5 py-2 bg-[#00F2FF] text-black font-mono text-xs font-bold tracking-widest uppercase rounded-lg hover:bg-[#00F2FF]/80 shadow-[0_0_15px_rgba(0,242,255,0.3)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Save className="w-3.5 h-3.5" /> COMMIT DATA
            </button>
            {dirty && !synced && <span className="font-mono text-[8px] tracking-widest uppercase text-yellow-400">Unsaved Changes</span>}
            {synced && (
              <div className="px-3 py-1.5 border border-[#00F2FF]/50 bg-[#00F2FF]/10 rounded flex items-center gap-2 animate-pulse">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00F2FF]" />
                <span className="font-mono text-[8px] text-[#00F2FF] font-bold tracking-widest uppercase">DATA SYNCED</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
