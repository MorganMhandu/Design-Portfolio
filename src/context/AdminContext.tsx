"use client";

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import { get, set as idbSet } from "idb-keyval";

// ─── Types ───────────────────────────────────────────────────────────────────

export type CaseProject = {
  id: string;
  title: string;
  focus: string;
  components: string;
  automation: string;
  images: string[];
  cadSize?: string;
  dwgSize?: string;
  renderSize?: string;
  zipUrl?: string;
  pdfUrl?: string; // Legacy single report
  reports?: { id: string; title: string; url: string }[];
};

export type Pillar = {
  id: string;
  title: string;
  iconName: string;
  bullets: string[];
};

export type Report = {
  id: string;
  title: string;
  description: string;
  fileName: string;
  uploadDate?: string;
  cloudUrl?: string;
  fileType?: string;
  category?: string;
};

export type Message = {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string;
  read: boolean;
};

export type DigitalSystem = {
  id: string;
  title: string;
  techStack: string[];
  description: string;
  link: string;
  version: string;
};

export type AdminSettings = {
  profilePicture: string;
  showProfilePicture: boolean;
  heroVideo?: string;
  contact: {
    phone: string;
    whatsapp: string;
    email: string;
    location: string;
  };
};

// ─── Default State ────────────────────────────────────────────────────────────

const DEFAULT_PILLARS: Pillar[] = [
  { id: "pillar-1", title: "Mechanical Design & Simulation", iconName: "Hexagon", bullets: ["Precision Assembly Modeling", "Structural Integrity & FEA", "Advanced GD&T", "High-Fidelity Visualization (Blender/Lumion)"] },
  { id: "pillar-2", title: "Automation & Control Systems", iconName: "Cpu", bullets: ["Mechatronic Integration", "PLC Logic & Smart Monitoring", "Fluid Power & Slurry Transport", "Equipment health tracking"] },
  { id: "pillar-3", title: "Plant Engineering & Maintenance", iconName: "Wrench", bullets: ["Reliability Centered Maintenance (RCM)", "Root Cause Analysis (RCA)", "Asset Lifecycle Management", "Process Optimization"] },
  { id: "pillar-4", title: "Manufacturing & Production", iconName: "Crosshair", bullets: ["Design for Manufacturing (DFM/CNC)", "SHEQ & ISO Compliance", "Specialized Tooling & Jigs", "Material Science"] },
  { id: "pillar-5", title: "Digital & Web Engineering", iconName: "Code", bullets: ["Engineering Dashboards (Next.js/Tailwind)", "Full-Stack Technical Tooling", "Interactive 3D UI", "Agile Documentation"] },
];

const DEFAULT_SYSTEMS: DigitalSystem[] = [
  { id: "sys-1", title: "Interactive Engineering Visualizer", techStack: ["Next.js", "Framer Motion"], description: "A platform for real-time 3D technical visualization. Engineered to bridge the gap between heavy CAD documentation and accessible web-based portfolio demonstrations.", link: "#", version: "V1.0" },
];

const DEFAULT_SETTINGS: AdminSettings = {
  profilePicture: "",
  showProfilePicture: true,
  heroVideo: "/assets/simulation-hero.mp4",
  contact: {
    phone: "+263 773 745 068",
    whatsapp: "https://wa.me/263773745068",
    email: "morganmichaelmhandu@gmail.com",
    location: "Harare, Zimbabwe",
  },
};

const STORAGE_KEY = "portfolio_admin_data";

async function loadFromStorage() {
  if (typeof window === "undefined") return null;
  try {
    return await get(STORAGE_KEY);
  } catch {
    return null;
  }
}

async function saveToStorage(data: any) {
  if (typeof window === "undefined") return;
  try {
    await idbSet(STORAGE_KEY, data);
  } catch (e) {
    console.error("IndexedDB save failed:", e);
  }
}

// ─── Context Shape ────────────────────────────────────────────────────────────

type AdminContextType = {
  syncStatus: "idle" | "syncing" | "success" | "error";

  projects: CaseProject[];
  addProject: (p: Omit<CaseProject, "id">) => void;
  editProject: (id: string, p: Partial<CaseProject>) => void;
  deleteProject: (id: string) => void;

  pillars: Pillar[];
  addPillar: (p: Omit<Pillar, "id">) => void;
  editPillar: (id: string, p: Partial<Pillar>) => void;
  deletePillar: (id: string) => void;

  reports: Report[];
  addReport: (r: Omit<Report, "id">) => void;
  editReport: (id: string, r: Partial<Report>) => void;
  deleteReport: (id: string) => void;

  messages: Message[];
  addMessage: (m: Omit<Message, "id" | "timestamp" | "read">) => void;
  markRead: (id: string) => void;
  deleteMessage: (id: string) => void;

  systems: DigitalSystem[];
  addSystem: (s: Omit<DigitalSystem, "id">) => void;
  editSystem: (id: string, s: Partial<DigitalSystem>) => void;
  deleteSystem: (id: string) => void;

  settings: AdminSettings;
  updateSettings: (s: Partial<AdminSettings>) => void;
  forceCloudPush: () => Promise<{ success: boolean; error?: string }>;
};

const AdminContext = createContext<AdminContextType | null>(null);

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}

function uid() {
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AdminProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<CaseProject[]>([]);
  const [pillars, setPillars] = useState<Pillar[]>(DEFAULT_PILLARS);
  const [reports, setReports] = useState<Report[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [systems, setSystems] = useState<DigitalSystem[]>(DEFAULT_SYSTEMS);
  const [settings, setSettings] = useState<AdminSettings>(DEFAULT_SETTINGS);
  const [syncStatus, setSyncStatus] = useState<AdminContextType["syncStatus"]>("idle");
  const [initialized, setInitialized] = useState(false);

  // ── 1. Load from storage first (instant, survives refresh) ──
  useEffect(() => {
    async function init() {
      const local = await loadFromStorage();
      if (local) {
        if (Array.isArray(local.projects)) setProjects(local.projects);
        if (Array.isArray(local.pillars) && local.pillars.length > 0) setPillars(local.pillars);
        if (Array.isArray(local.reports)) setReports(local.reports);
        if (Array.isArray(local.messages)) setMessages(local.messages);
        if (Array.isArray(local.systems) && local.systems.length > 0) setSystems(local.systems);
        if (local.settings) setSettings(local.settings);
      }
      setInitialized(true);
    }
    init();
  }, []);

  // ── 2. Smart sync: pull from cloud only if newer, otherwise push local to cloud ──
  useEffect(() => {
    if (!initialized) return;
    
    async function performSmartSync() {
      const timestamp = Date.now();
      setSyncStatus("syncing");
      
      try {
        const res = await fetch(`/api/admin/data?t=${timestamp}`);
        if (!res.ok) throw new Error("Cloud fetch failed");
        
        const cloudData = await res.json();
        if (!cloudData || cloudData.error) {
          setSyncStatus("idle");
          return;
        }

        // Check timestamps: compare cloud vs local
        const localData = await loadFromStorage();
        const localTs = localData?.lastUpdated ? new Date(localData.lastUpdated).getTime() : 0;
        const cloudTs = cloudData.lastUpdated ? new Date(cloudData.lastUpdated).getTime() : 0;
        
        if (localTs > cloudTs && localData) {
          // Local is NEWER — push local data to cloud to make it authoritative
          console.log("Local data is newer — pushing to cloud to sync other browsers.");
          await fetch("/api/admin/data", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(localData),
          });
          setSyncStatus("success");
          setTimeout(() => setSyncStatus("idle"), 2000);
        } else {
          // Cloud is newer or equal — update local state from cloud
          if (Array.isArray(cloudData.projects)) setProjects(cloudData.projects);
          if (Array.isArray(cloudData.pillars)) setPillars(cloudData.pillars);
          if (Array.isArray(cloudData.reports)) setReports(cloudData.reports);
          if (Array.isArray(cloudData.messages)) setMessages(cloudData.messages);
          if (Array.isArray(cloudData.systems)) setSystems(cloudData.systems);
          if (cloudData.settings) setSettings(cloudData.settings);
          await saveToStorage(cloudData);
          setSyncStatus("success");
          setTimeout(() => setSyncStatus("idle"), 2000);
        }
      } catch (err) {
        console.warn("Smart sync failed, staying with local data.");
        setSyncStatus("idle");
      }
    }
    
    performSmartSync();
  }, [initialized]);

  // ── Sync Helper: saves to localStorage immediately, then tries cloud ──
  const syncData = useCallback(
    async (overrides: Partial<{
      projects: CaseProject[];
      pillars: Pillar[];
      reports: Report[];
      messages: Message[];
      systems: DigitalSystem[];
      settings: AdminSettings;
    }> = {}) => {
      const fullState = {
        projects: overrides.projects ?? projects,
        pillars: overrides.pillars ?? pillars,
        reports: overrides.reports ?? reports,
        messages: overrides.messages ?? messages,
        systems: overrides.systems ?? systems,
        settings: overrides.settings ?? settings,
        lastUpdated: new Date().toISOString(), // Timestamp to prevent stale cloud overwrite
      };

      // Always save to storage first (with timestamp)
      await saveToStorage(fullState);

      // Then try cloud sync
      setSyncStatus("syncing");
      try {
        const res = await fetch("/api/admin/data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fullState),
        });
        
        if (!res.ok) {
          if (res.status === 413) {
            throw new Error("Payload Too Large. The files are too big (likely due to base64 fallback). Fix Supabase upload keys.");
          }
          const text = await res.text();
          throw new Error(`Sync failed (${res.status}): ${text.slice(0, 100)}`);
        }
        
        setSyncStatus("success");
        setTimeout(() => setSyncStatus("idle"), 3000);
      } catch (err: any) {
        console.error("Cloud sync error:", err);
        alert(`CLOUD SYNC ERROR: ${err.message}`);
        setSyncStatus("error");
      }
    },
    [projects, pillars, reports, messages, systems, settings]
  );

  // Force push local data to cloud (Rescue Mission helper)
  const forceCloudPush = useCallback(async () => {
    setSyncStatus("syncing");
    try {
      const fullState = {
        projects,
        pillars,
        reports,
        messages,
        systems,
        settings,
        lastUpdated: new Date().toISOString(),
      };

      const res = await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fullState),
      });

      if (!res.ok) {
        if (res.status === 413) {
          throw new Error("Payload Too Large (413). Files are too big for Vercel. Fix Supabase credentials to upload directly to bucket.");
        }
        const text = await res.text();
        throw new Error(`Cloud push failed (${res.status}): ${text.slice(0, 100)}`);
      }

      const data = await res.json().catch(() => ({}));
      if (data.error) {
        throw new Error(data.error);
      }

      setSyncStatus("success");
      setTimeout(() => setSyncStatus("idle"), 3000);
      return { success: true };
    } catch (err: any) {
      console.error("Force push failed:", err);
      setSyncStatus("error");
      return { success: false, error: err.message };
    }
  }, [projects, pillars, reports, messages, systems, settings]);

  // ── Projects ──
  const addProject = useCallback((p: Omit<CaseProject, "id">) => {
    const newList = [...projects, { ...p, id: uid() }];
    setProjects(newList);
    syncData({ projects: newList });
  }, [projects, syncData]);

  const editProject = useCallback((id: string, p: Partial<CaseProject>) => {
    const newList = projects.map((x) => (x.id === id ? { ...x, ...p } : x));
    setProjects(newList);
    syncData({ projects: newList });
  }, [projects, syncData]);

  const deleteProject = useCallback((id: string) => {
    const newList = projects.filter((x) => x.id !== id);
    setProjects(newList);
    syncData({ projects: newList });
  }, [projects, syncData]);

  // ── Pillars ──
  const addPillar = useCallback((p: Omit<Pillar, "id">) => {
    const newList = [...pillars, { ...p, id: uid() }];
    setPillars(newList);
    syncData({ pillars: newList });
  }, [pillars, syncData]);

  const editPillar = useCallback((id: string, p: Partial<Pillar>) => {
    const newList = pillars.map((x) => (x.id === id ? { ...x, ...p } : x));
    setPillars(newList);
    syncData({ pillars: newList });
  }, [pillars, syncData]);

  const deletePillar = useCallback((id: string) => {
    const newList = pillars.filter((x) => x.id !== id);
    setPillars(newList);
    syncData({ pillars: newList });
  }, [pillars, syncData]);

  // ── Reports ──
  const addReport = useCallback((r: Omit<Report, "id">) => {
    const newList = [...reports, { ...r, id: uid() }];
    setReports(newList);
    syncData({ reports: newList });
  }, [reports, syncData]);

  const editReport = useCallback((id: string, r: Partial<Report>) => {
    const newList = reports.map((x) => (x.id === id ? { ...x, ...r } : x));
    setReports(newList);
    syncData({ reports: newList });
  }, [reports, syncData]);

  const deleteReport = useCallback((id: string) => {
    const newList = reports.filter((x) => x.id !== id);
    setReports(newList);
    syncData({ reports: newList });
  }, [reports, syncData]);

  // ── Messages ──
  const addMessage = useCallback((m: Omit<Message, "id" | "timestamp" | "read">) => {
    const newList = [
      { ...m, id: uid(), timestamp: new Date().toISOString(), read: false },
      ...messages,
    ];
    setMessages(newList);
    syncData({ messages: newList });
  }, [messages, syncData]);

  const markRead = useCallback((id: string) => {
    const newList = messages.map((x) => (x.id === id ? { ...x, read: true } : x));
    setMessages(newList);
    syncData({ messages: newList });
  }, [messages, syncData]);

  const deleteMessage = useCallback((id: string) => {
    const newList = messages.filter((x) => x.id !== id);
    setMessages(newList);
    syncData({ messages: newList });
  }, [messages, syncData]);

  // ── Digital Systems ──
  const addSystem = useCallback((s: Omit<DigitalSystem, "id">) => {
    const newList = [...systems, { ...s, id: uid() }];
    setSystems(newList);
    syncData({ systems: newList });
  }, [systems, syncData]);

  const editSystem = useCallback((id: string, s: Partial<DigitalSystem>) => {
    const newList = systems.map((x) => (x.id === id ? { ...x, ...s } : x));
    setSystems(newList);
    syncData({ systems: newList });
  }, [systems, syncData]);

  const deleteSystem = useCallback((id: string) => {
    const newList = systems.filter((x) => x.id !== id);
    setSystems(newList);
    syncData({ systems: newList });
  }, [systems, syncData]);

  // ── Settings ──
  const updateSettings = useCallback((s: Partial<AdminSettings>) => {
    const newSettings = { ...settings, ...s };
    setSettings(newSettings);
    syncData({ settings: newSettings });
  }, [settings, syncData]);

  return (
    <AdminContext.Provider
      value={{
        syncStatus,
        projects, addProject, editProject, deleteProject,
        pillars, addPillar, editPillar, deletePillar,
        reports, addReport, editReport, deleteReport,
        messages, addMessage, markRead, deleteMessage,
        systems, addSystem, editSystem, deleteSystem,
        settings, updateSettings,
        forceCloudPush,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}
