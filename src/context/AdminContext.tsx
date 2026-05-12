"use client";

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";

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
  pdfUrl?: string;
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

function loadFromStorage() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveToStorage(data: any) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn("localStorage save failed:", e);
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

  // ── 1. Load from localStorage first (instant, no flicker) ──
  useEffect(() => {
    const local = loadFromStorage();
    if (local) {
      if (local.projects) setProjects(local.projects);
      if (local.pillars) setPillars(local.pillars);
      if (local.reports) setReports(local.reports);
      if (local.messages) setMessages(local.messages);
      if (local.systems) setSystems(local.systems);
      if (local.settings) setSettings(local.settings);
    }
    setInitialized(true);
  }, []);

  // ── 2. After local load, try to sync from Supabase cloud (if configured) ──
  useEffect(() => {
    if (!initialized) return;
    fetch("/api/admin/data")
      .then((res) => res.json())
      .then((data) => {
        // Only accept cloud data if it actually has content
        if (data && !data.error) {
          if (data.projects?.length) setProjects(data.projects);
          if (data.pillars?.length) setPillars(data.pillars);
          if (data.reports?.length) setReports(data.reports);
          if (data.messages?.length) setMessages(data.messages);
          if (data.systems?.length) setSystems(data.systems);
          if (data.settings) setSettings(data.settings);
          // Update localStorage with cloud data
          saveToStorage(data);
        }
      })
      .catch(() => {
        // Cloud unavailable — localStorage is the source of truth
        console.warn("Cloud sync unavailable. Using local data.");
      });
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
      };

      // Always save to localStorage first
      saveToStorage(fullState);

      // Then try cloud sync
      setSyncStatus("syncing");
      try {
        const res = await fetch("/api/admin/data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fullState),
        });
        if (res.ok) {
          setSyncStatus("success");
          setTimeout(() => setSyncStatus("idle"), 3000);
        } else {
          setSyncStatus("idle"); // Not an error — local save succeeded
        }
      } catch {
        setSyncStatus("idle"); // Cloud sync failed but local save succeeded
      }
    },
    [projects, pillars, reports, messages, systems, settings]
  );

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
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}
