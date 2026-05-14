"use client";

import { useState, useEffect } from "react";
import { useAdmin } from "@/context/AdminContext";
import { Upload, Trash2, Eye, EyeOff, User, Save, Film } from "lucide-react";
import Image from "next/image";

export function IdentityManager() {
  const { settings, updateSettings } = useAdmin();
  const [uploading, setUploading] = useState(false);

  const [draft, setDraft] = useState({ 
    profilePicture: settings.profilePicture, 
    showProfilePicture: settings.showProfilePicture,
    heroVideo: settings.heroVideo,
    contactVideo: settings.contactVideo || ""
  });
  const [dirty, setDirty] = useState(false);
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    if (!dirty) setDraft({ 
      profilePicture: settings.profilePicture, 
      showProfilePicture: settings.showProfilePicture,
      heroVideo: settings.heroVideo,
      contactVideo: settings.contactVideo || ""
    });
  }, [settings.profilePicture, settings.showProfilePicture, settings.heroVideo, settings.contactVideo, dirty]);

  const handleChange = (field: string, value: any) => {
    setDraft(prev => ({ ...prev, [field]: value }));
    setDirty(true);
    setSynced(false);
  };

  const handleSave = () => {
    updateSettings(draft);
    setDirty(false);
    setSynced(true);
    setTimeout(() => setSynced(false), 3000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "profilePicture" | "heroVideo" | "contactVideo") => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("files", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.urls && data.urls.length > 0) {
        handleChange(field, data.urls[0]);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <h2 className="font-mono text-lg font-bold text-white tracking-widest uppercase">Identity Assets</h2>
        <p className="font-mono text-[10px] text-[#94A3B8]/50 tracking-widest uppercase">Manage profile media and visibility toggles</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Picture Management */}
        <div className="p-8 border border-[#00F2FF]/20 rounded-2xl bg-[#00F2FF]/5 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-sm font-bold text-[#00F2FF] tracking-widest uppercase">Professional Headshot</h3>
            <button
              onClick={() => handleChange("showProfilePicture", !draft.showProfilePicture)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono text-[9px] tracking-widest uppercase transition-all ${
                draft.showProfilePicture 
                  ? "bg-[#00F2FF]/20 border-[#00F2FF]/50 text-[#00F2FF]" 
                  : "bg-black/40 border-white/10 text-white/40"
              }`}
            >
              {draft.showProfilePicture ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              {draft.showProfilePicture ? "Visible" : "Hidden"}
            </button>
          </div>

          <div className="relative aspect-square w-full max-w-[240px] mx-auto rounded-2xl border-2 border-dashed border-[#00F2FF]/20 overflow-hidden group">
            {draft.profilePicture ? (
              <>
                <Image 
                  src={draft.profilePicture} 
                  alt="Profile" 
                  fill 
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <label className="cursor-pointer p-3 rounded-full bg-[#00F2FF] text-black hover:scale-110 transition-transform">
                    <Upload className="w-5 h-5" />
                    <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, "profilePicture")} accept="image/*" />
                  </label>
                  <button 
                    onClick={() => handleChange("profilePicture", "")}
                    className="p-3 rounded-full bg-red-500 text-white hover:scale-110 transition-transform"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <label className="absolute inset-0 flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-[#00F2FF]/5 transition-colors">
                <div className="w-16 h-16 rounded-full bg-[#00F2FF]/10 flex items-center justify-center text-[#00F2FF]/40 border border-[#00F2FF]/20">
                  <User className="w-8 h-8" />
                </div>
                <div className="text-center">
                  <p className="font-mono text-[10px] text-[#00F2FF] tracking-widest uppercase mb-1">{uploading ? "Uploading..." : "Click to Upload"}</p>
                  <p className="font-mono text-[8px] text-[#94A3B8]/40 tracking-widest uppercase">Target: Hero_Section</p>
                </div>
                <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, "profilePicture")} accept="image/*" />
              </label>
            )}
          </div>

          <div className="p-4 border border-white/5 rounded-xl bg-black/20">
            <p className="font-mono text-[9px] text-[#94A3B8]/60 leading-relaxed">
              Recommended: 1000x1000px min, high-contrast engineering aesthetic. Images are automatically stored in /assets/ with absolute path resolution.
            </p>
          </div>
        </div>

        {/* Hero Video Management */}
        <div className="p-8 border border-[#00F2FF]/20 rounded-2xl bg-[#00F2FF]/5 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-sm font-bold text-[#00F2FF] tracking-widest uppercase">Hero Simulation Video</h3>
          </div>

          <div className="relative aspect-video w-full rounded-2xl border-2 border-dashed border-[#00F2FF]/20 overflow-hidden group">
            {draft.heroVideo ? (
              <>
                <video 
                  src={draft.heroVideo} 
                  autoPlay 
                  loop 
                  muted 
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <label className="cursor-pointer p-3 rounded-full bg-[#00F2FF] text-black hover:scale-110 transition-transform">
                    <Upload className="w-5 h-5" />
                    <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, "heroVideo")} accept="video/*" />
                  </label>
                  <button 
                    onClick={() => handleChange("heroVideo", "")}
                    className="p-3 rounded-full bg-red-500 text-white hover:scale-110 transition-transform"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <label className="absolute inset-0 flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-[#00F2FF]/5 transition-colors">
                <div className="w-16 h-16 rounded-full bg-[#00F2FF]/10 flex items-center justify-center text-[#00F2FF]/40 border border-[#00F2FF]/20">
                  <Film className="w-8 h-8" />
                </div>
                <div className="text-center">
                  <p className="font-mono text-[10px] text-[#00F2FF] tracking-widest uppercase mb-1">{uploading ? "Uploading..." : "Click to Upload Video"}</p>
                  <p className="font-mono text-[8px] text-[#94A3B8]/40 tracking-widest uppercase">Target: Hero_Graphic</p>
                </div>
                <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, "heroVideo")} accept="video/*" />
              </label>
            )}
          </div>

          <div className="p-4 border border-white/5 rounded-xl bg-black/20">
            <p className="font-mono text-[9px] text-[#94A3B8]/60 leading-relaxed">
              Recommended: MP4 format, loop-friendly simulation or CAD render. Keep file size under 50MB for optimal performance.
            </p>
          </div>
        </div>

        {/* Contact Video Management */}
        <div className="p-8 border border-[#00F2FF]/20 rounded-2xl bg-[#00F2FF]/5 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-sm font-bold text-[#00F2FF] tracking-widest uppercase">Contact Video Reel</h3>
          </div>

          <div className="relative aspect-video w-full rounded-2xl border-2 border-dashed border-[#00F2FF]/20 overflow-hidden group">
            {draft.contactVideo ? (
              <>
                <video 
                  src={draft.contactVideo} 
                  autoPlay 
                  loop 
                  muted 
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <label className="cursor-pointer p-3 rounded-full bg-[#00F2FF] text-black hover:scale-110 transition-transform">
                    <Upload className="w-5 h-5" />
                    <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, "contactVideo")} accept="video/*" />
                  </label>
                  <button 
                    onClick={() => handleChange("contactVideo", "")}
                    className="p-3 rounded-full bg-red-500 text-white hover:scale-110 transition-transform"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <label className="absolute inset-0 flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-[#00F2FF]/5 transition-colors">
                <div className="w-16 h-16 rounded-full bg-[#00F2FF]/10 flex items-center justify-center text-[#00F2FF]/40 border border-[#00F2FF]/20">
                  <Film className="w-8 h-8" />
                </div>
                <div className="text-center">
                  <p className="font-mono text-[10px] text-[#00F2FF] tracking-widest uppercase mb-1">{uploading ? "Uploading..." : "Click to Upload Video"}</p>
                  <p className="font-mono text-[8px] text-[#94A3B8]/40 tracking-widest uppercase">Target: Contact_Section</p>
                </div>
                <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, "contactVideo")} accept="video/*" />
              </label>
            )}
          </div>

          <div className="p-4 border border-white/5 rounded-xl bg-black/20">
            <p className="font-mono text-[9px] text-[#94A3B8]/60 leading-relaxed">
              Recommended: MP4 format. Keep file size under 50MB. This replaces the empty placeholder in the Engage section.
            </p>
          </div>
        </div>

        {/* Visibility Rules */}
        <div className="flex flex-col gap-6">
          <div className="p-6 border border-white/10 rounded-2xl bg-black/40">
            <h3 className="font-mono text-xs font-bold text-white tracking-widest uppercase mb-4">Display Logic</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-white/5 rounded-xl bg-white/5">
                <div>
                  <p className="font-mono text-[10px] text-white tracking-widest uppercase">Hero Picture</p>
                  <p className="font-mono text-[8px] text-[#94A3B8]/50 tracking-widest uppercase">Corner ID Slot</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={draft.showProfilePicture}
                  onChange={() => handleChange("showProfilePicture", !draft.showProfilePicture)}
                  className="w-10 h-5 rounded-full appearance-none bg-[#94A3B8]/20 checked:bg-[#00F2FF] transition-all cursor-pointer relative after:absolute after:top-1 after:left-1 after:w-3 after:h-3 after:bg-white after:rounded-full after:transition-all checked:after:left-6"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 mt-4">
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
  );
}
