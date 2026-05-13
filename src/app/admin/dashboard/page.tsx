"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { FolderKanban, LayoutGrid, FileArchive, MessageSquare, LogOut, ChevronRight, Cpu, Users, UserCircle, Smartphone } from "lucide-react";
import { ProjectManager } from "./tabs/ProjectManager";
import { CapabilityMatrix } from "./tabs/CapabilityMatrix";
import { SystemGrid } from "./tabs/SystemGrid";
import { InquiryLog } from "./tabs/InquiryLog";
import { IdentityManager } from "./tabs/IdentityManager";
import { ContactController } from "./tabs/ContactController";
import { useAdmin } from "@/context/AdminContext";

const SESSION_DURATION_MS = 30 * 60 * 1000;

type TabId = "projects" | "capabilities" | "systems" | "inquiries" | "identity" | "contact";

const TABS: { id: TabId; label: string; sublabel: string; icon: React.ElementType }[] = [
  { id: "projects", label: "Project Manager", sublabel: "Technical Case Studies", icon: FolderKanban },
  { id: "capabilities", label: "Capability Matrix", sublabel: "Skill Pillars", icon: LayoutGrid },
  { id: "systems", label: "Digital Asset Manager", sublabel: "Web & Digital Infrastructure", icon: Cpu },
  { id: "inquiries", label: "Inquiry Log", sublabel: "Engage Terminal Messages", icon: MessageSquare },
  { id: "identity", label: "Identity Assets", sublabel: "Profile & Media", icon: UserCircle },
  { id: "contact", label: "Contact Controller", sublabel: "Public Data Management", icon: Smartphone },
];

function SessionTimer({ expiryTs }: { expiryTs: number }) {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    const tick = () => {
      const left = Math.max(0, expiryTs - Date.now());
      setRemaining(left);
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [expiryTs]);

  const mins = Math.floor(remaining / 60000);
  const secs = Math.floor((remaining % 60000) / 1000);
  const isLow = remaining < 5 * 60 * 1000;

  return (
    <span className={`font-mono text-[9px] tracking-widest ${isLow ? "text-red-400 animate-pulse" : "text-[#94A3B8]/50"}`}>
      SESSION {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
    </span>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { messages, syncStatus, forceCloudPush } = useAdmin();
  const [activeTab, setActiveTab] = useState<TabId>("projects");
  const [operator, setOperator] = useState("MORGAN");
  const [expiryTs, setExpiryTs] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const logout = useCallback(() => {
    sessionStorage.removeItem("admin_session_expiry");
    sessionStorage.removeItem("admin_operator");
    router.replace("/admin");
  }, [router]);

  useEffect(() => {
    const expiry = sessionStorage.getItem("admin_session_expiry");
    const op = sessionStorage.getItem("admin_operator");
    if (!expiry || parseInt(expiry) <= Date.now()) {
      router.replace("/admin");
      return;
    }
    setExpiryTs(parseInt(expiry));
    if (op) setOperator(op);

    // Auto-logout on expiry
    const remaining = parseInt(expiry) - Date.now();
    const timeout = setTimeout(() => logout(), remaining);
    return () => clearTimeout(timeout);
  }, [router, logout]);

  const unreadCount = messages.filter((m) => !m.read).length;

  const renderTab = () => {
    switch (activeTab) {
      case "projects": return <ProjectManager />;
      case "capabilities": return <CapabilityMatrix />;
      case "systems": return <SystemGrid />;
      case "inquiries": return <InquiryLog />;
      case "identity": return <IdentityManager />;
      case "contact": return <ContactController />;
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col">
      {/* Ambient grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,rgba(0,242,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,242,255,0.025)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      {syncStatus === "success" && (
        <div className="fixed top-0 left-0 right-0 bg-[#00F2FF] text-black font-mono text-[10px] font-bold tracking-[0.25em] uppercase text-center py-2 animate-in slide-in-from-top-full duration-300 z-50 shadow-[0_0_20px_rgba(0,242,255,0.5)]">
          SYSTEM SYNC COMPLETE - CLOUD DATA UPDATED
        </div>
      )}

      {/* Top Command Bar */}
      <header className="relative z-20 border-b border-[#00F2FF]/15 bg-[#020617]/90 backdrop-blur-md px-6 py-3 flex items-center justify-between gap-6">
        {/* Left: Identity */}
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-lg bg-[#00F2FF]/10 border border-[#00F2FF]/30 flex items-center justify-center">
            <span className="font-mono text-[10px] font-bold text-[#00F2FF]">MM</span>
          </div>
          <div>
            <p className="font-mono text-[9px] tracking-[0.3em] text-[#94A3B8]/50 uppercase">Operations Overview</p>
            <p className="font-mono text-xs font-bold text-white tracking-widest uppercase">
              OPERATOR: {operator}
            </p>
          </div>
        </div>

        {/* Center: Status */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${
              syncStatus === 'error' ? 'bg-red-400 shadow-[0_0_6px_rgba(248,113,113,0.9)]' : 
              process.env.NEXT_PUBLIC_SUPABASE_URL ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.9)]' : 
              'bg-yellow-400 shadow-[0_0_6px_rgba(250,204,21,0.9)]'
            } animate-pulse`} />
            <span className={`font-mono text-[9px] tracking-[0.25em] uppercase ${
              syncStatus === 'error' ? 'text-red-400' : 
              process.env.NEXT_PUBLIC_SUPABASE_URL ? 'text-emerald-400' : 
              'text-yellow-400'
            }`}>
              {syncStatus === 'syncing' ? 'SYNCING_DATA...' : 
               syncStatus === 'success' ? 'SYNC SUCCESSFUL' : 
               process.env.NEXT_PUBLIC_SUPABASE_URL ? 'CLOUD_DATABASE: ONLINE' : 'LOCAL_STORAGE: ACTIVE (NON-PERSISTENT)'}
            </span>
          </div>
          
          {!process.env.NEXT_PUBLIC_SUPABASE_URL && (
            <button
              onClick={async () => {
                const res = await forceCloudPush();
                if (res.success) {
                  alert("RESCUE SUCCESSFUL: Your local data has been pushed to the cloud.");
                } else {
                  alert(`RESCUE FAILED: ${res.error || "Could not reach cloud. Check your environment variables."}`);
                }
              }}
              className="px-3 py-1 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 font-mono text-[9px] tracking-widest uppercase rounded hover:bg-yellow-400/20 transition-all flex items-center gap-2"
              title="Push local browser data to cloud"
            >
              <FileArchive className="w-3 h-3" /> Rescue Data to Cloud
            </button>
          )}

          <div className="w-[1px] h-4 bg-[#00F2FF]/15" />
          {expiryTs > 0 && <SessionTimer expiryTs={expiryTs} />}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="font-mono text-[9px] tracking-widest uppercase text-[#94A3B8]/50 hover:text-[#00F2FF] transition-colors hidden sm:block"
          >
            View Public Site ↗
          </a>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-3 py-1.5 border border-red-500/30 text-red-400/70 hover:text-red-400 hover:border-red-500/60 hover:bg-red-500/10 font-mono text-[9px] tracking-widest uppercase rounded-lg transition-all"
          >
            <LogOut className="w-3 h-3" /> Logout
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="relative z-10 flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={`${sidebarCollapsed ? "w-16" : "w-64"} shrink-0 border-r border-[#00F2FF]/10 bg-[#020617]/70 backdrop-blur-sm flex flex-col transition-all duration-300`}>
          {/* Collapse toggle */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="flex items-center justify-end p-3 text-[#00F2FF]/25 hover:text-[#00F2FF]/60 transition-colors"
          >
            <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-300 ${sidebarCollapsed ? "" : "rotate-180"}`} />
          </button>

          {/* Nav */}
          <nav className="flex flex-col gap-1 px-2 flex-1">
            {TABS.map(({ id, label, sublabel, icon: Icon }) => {
              const isActive = activeTab === id;
              const badge = id === "inquiries" && unreadCount > 0 ? unreadCount : null;
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`relative flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-200 group ${
                    isActive
                      ? "bg-[#00F2FF]/10 border border-[#00F2FF]/30 shadow-[0_0_15px_rgba(0,242,255,0.08)]"
                      : "border border-transparent hover:bg-white/5 hover:border-white/5"
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? "text-[#00F2FF]" : "text-[#94A3B8]/50 group-hover:text-[#94A3B8]"}`} />
                  {!sidebarCollapsed && (
                    <div className="min-w-0 flex-1">
                      <p className={`font-mono text-[10px] font-bold tracking-widest uppercase transition-colors ${isActive ? "text-[#00F2FF]" : "text-[#94A3B8]/70 group-hover:text-white"}`}>
                        {label}
                      </p>
                      <p className="font-mono text-[8px] tracking-widest text-[#94A3B8]/35 uppercase truncate">
                        {sublabel}
                      </p>
                    </div>
                  )}
                  {badge && (
                    <span className="w-4 h-4 rounded-full bg-[#00F2FF] text-black font-mono font-bold text-[7px] flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(0,242,255,0.8)]">
                      {badge > 9 ? "9+" : badge}
                    </span>
                  )}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-[#00F2FF] rounded-r shadow-[0_0_8px_rgba(0,242,255,0.8)]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Sidebar footer */}
          {!sidebarCollapsed && (
            <div className="p-4 border-t border-[#00F2FF]/10">
              <p className="font-mono text-[7px] tracking-widest text-[#94A3B8]/25 uppercase leading-relaxed">
                Admin Command Center<br />
                Morgan Michael Mhandu<br />
                v1.0.0 // {new Date().getFullYear()}
              </p>
            </div>
          )}
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-6 py-8">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-8">
              <span className="font-mono text-[8px] tracking-widest text-[#94A3B8]/30 uppercase">Command Center</span>
              <ChevronRight className="w-3 h-3 text-[#00F2FF]/20" />
              <span className="font-mono text-[8px] tracking-widest text-[#00F2FF]/60 uppercase">
                {TABS.find((t) => t.id === activeTab)?.label}
              </span>
            </div>

            {/* Horizontal accent line */}
            <div className="h-[1px] w-full bg-gradient-to-r from-[#00F2FF]/30 via-[#00F2FF]/10 to-transparent mb-8" />

            {/* Tab content */}
            {renderTab()}
          </div>
        </main>
      </div>

      {/* System Status — Fixed bottom right */}
      <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-[#020617]/90 border border-[#00F2FF]/20 backdrop-blur-md px-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(0,242,255,0.05)]">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.9)]" />
        <span className="font-mono text-[8px] tracking-[0.25em] text-emerald-400/80 uppercase">
          CORE_SYSTEMS: ONLINE
        </span>
      </div>
    </div>
  );
}
