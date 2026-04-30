"use client";

import { useAdmin, Candidate } from "@/context/AdminContext";
import { User, Mail, Briefcase, FileText, Trash2, CheckCircle, XCircle, Clock, Search } from "lucide-react";
import { useState } from "react";

const STATUS_COLORS = {
  Pending: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  Reviewed: "text-blue-400 bg-blue-400/10 border-blue-400/30",
  Interviewing: "text-[#00F2FF] bg-[#00F2FF]/10 border-[#00F2FF]/30",
  Rejected: "text-red-400 bg-red-400/10 border-red-400/30",
  Accepted: "text-green-400 bg-green-400/10 border-green-400/30",
};

export function TalentVault() {
  const { candidates, updateCandidateStatus, deleteCandidate } = useAdmin();
  const [search, setSearch] = useState("");

  const filtered = candidates.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-mono text-base font-bold text-white tracking-[0.15em] uppercase">Talent Vault</h2>
          <p className="font-mono text-[10px] text-[#94A3B8]/60 tracking-widest mt-0.5">{candidates.length} candidates in database</p>
        </div>
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]/40 group-focus-within:text-[#00F2FF] transition-colors" />
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search candidates / roles..." 
            className="bg-black/40 border border-[#00F2FF]/20 rounded-lg pl-10 pr-4 py-2 font-mono text-xs text-white focus:outline-none focus:border-[#00F2FF]/70 transition-all w-full md:w-64"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {filtered.length === 0 && (
          <div className="text-center py-20 font-mono text-[#94A3B8]/40 text-xs tracking-widest uppercase border border-dashed border-[#00F2FF]/10 rounded-xl bg-black/20">
            {search ? "No candidates match your search" : "No candidates found in the vault"}
          </div>
        )}
        
        {filtered.map((c) => (
          <div key={c.id} className="border border-[#00F2FF]/15 rounded-xl bg-black/30 overflow-hidden hover:border-[#00F2FF]/30 transition-all group">
            <div className="flex flex-col lg:flex-row lg:items-center p-5 gap-6">
              {/* Profile Info */}
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-12 h-12 rounded-full bg-[#00F2FF]/10 border border-[#00F2FF]/20 flex items-center justify-center text-[#00F2FF] shrink-0">
                  <User className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-mono text-sm font-bold text-white uppercase truncate">{c.name}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1 text-[10px] font-mono text-[#94A3B8]/60 uppercase">
                      <Briefcase className="w-3 h-3" /> {c.role}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-mono text-[#94A3B8]/60">
                      <Mail className="w-3 h-3" /> {c.email}
                    </div>
                  </div>
                </div>
              </div>

              {/* Status & Date */}
              <div className="flex items-center gap-4 shrink-0">
                <div className="flex flex-col items-end gap-1">
                   <div className={`px-2.5 py-0.5 rounded-full border text-[9px] font-mono font-bold uppercase ${STATUS_COLORS[c.status as keyof typeof STATUS_COLORS]}`}>
                     {c.status}
                   </div>
                   <div className="flex items-center gap-1 text-[8px] font-mono text-[#94A3B8]/40 uppercase">
                     <Clock className="w-2.5 h-2.5" /> {new Date(c.timestamp).toLocaleDateString()}
                   </div>
                </div>

                <div className="h-10 w-[1px] bg-white/5 hidden lg:block" />

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <a 
                    href={c.cvUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 text-[#00F2FF]/60 hover:text-[#00F2FF] hover:bg-[#00F2FF]/10 rounded transition-all"
                    title="View CV"
                  >
                    <FileText className="w-4 h-4" />
                  </a>
                  
                  <div className="flex items-center border border-white/10 rounded-lg overflow-hidden bg-black/20">
                    <button 
                      onClick={() => updateCandidateStatus(c.id, "Interviewing")}
                      className="p-2 text-green-400/40 hover:text-green-400 hover:bg-green-400/10 transition-all border-r border-white/10"
                      title="Mark as Interviewing"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => updateCandidateStatus(c.id, "Rejected")}
                      className="p-2 text-red-400/40 hover:text-red-400 hover:bg-red-400/10 transition-all border-r border-white/10"
                      title="Mark as Rejected"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => { if(window.confirm(`Delete candidate ${c.name}?`)) deleteCandidate(c.id); }}
                      className="p-2 text-[#94A3B8]/40 hover:text-white hover:bg-white/10 transition-all"
                      title="Delete entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick Status Bar */}
            <div className="bg-black/20 px-5 py-2 border-t border-white/5 flex gap-4">
              <span className="font-mono text-[8px] text-[#94A3B8]/30 uppercase tracking-[0.2em]">Application Process Lifecycle:</span>
              <div className="flex-1 h-[2px] bg-white/5 self-center rounded-full overflow-hidden flex">
                <div className={`h-full ${c.status === "Pending" ? "w-1/4" : c.status === "Reviewed" ? "w-2/4" : c.status === "Interviewing" ? "w-3/4" : "w-full"} bg-[#00F2FF]/50 shadow-[0_0_8px_rgba(0,242,255,0.5)] transition-all duration-1000`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
