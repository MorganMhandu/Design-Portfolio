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

export type Candidate = {
  id: string;
  name: string;
  email: string;
  role: string;
  cvUrl: string;
  timestamp: string;
  status: "Pending" | "Reviewed" | "Rejected" | "Interviewing";
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

// ─── Context Shape ────────────────────────────────────────────────────────────

type AdminContextType = {
  syncStatus: "idle" | "syncing" | "success" | "error";
  
  // Projects
  projects: CaseProject[];
  addProject: (p: Omit<CaseProject, "id">) => void;
  editProject: (id: string, p: Partial<CaseProject>) => void;
  deleteProject: (id: string) => void;

  // Pillars
  pillars: Pillar[];
  addPillar: (p: Omit<Pillar, "id">) => void;
  editPillar: (id: string, p: Partial<Pillar>) => void;
  deletePillar: (id: string) => void;

  // Reports
  reports: Report[];
  addReport: (r: Omit<Report, "id">) => void;
  editReport: (id: string, r: Partial<Report>) => void;
  deleteReport: (id: string) => void;

  // Messages
  messages: Message[];
  addMessage: (m: Omit<Message, "id" | "timestamp" | "read">) => void;
  markRead: (id: string) => void;
  deleteMessage: (id: string) => void;

  // Digital Systems
  systems: DigitalSystem[];
  addSystem: (s: Omit<DigitalSystem, "id">) => void;
  editSystem: (id: string, s: Partial<DigitalSystem>) => void;
  deleteSystem: (id: string) => void;

  // Candidates
  candidates: Candidate[];
  addCandidate: (c: Omit<Candidate, "id" | "timestamp" | "status">) => void;
  updateCandidateStatus: (id: string, status: Candidate["status"]) => void;
  deleteCandidate: (id: string) => void;

  // Settings
  settings: AdminSettings;
  updateSettings: (s: Partial<AdminSettings>) => void;
};

// ─── Context Creation ─────────────────────────────────────────────────────────

const AdminContext = createContext<AdminContextType | null>(null);

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

function uid() {
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<CaseProject[]>([]);
  const [pillars, setPillars] = useState<Pillar[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [systems, setSystems] = useState<DigitalSystem[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [settings, setSettings] = useState<AdminSettings>({
    profilePicture: "",
    showProfilePicture: true,
    heroVideo: "/assets/simulation-hero.mp4",
    contact: {
      phone: "+263 773 754 068",
      whatsapp: "https://wa.me/263773754068",
      email: "morganmichaelmhandu@gmail.com",
      location: "Harare, Zimbabwe",
    },
  });
  const [syncStatus, setSyncStatus] = useState<AdminContextType["syncStatus"]>("idle");

  // Load Initial Data
  useEffect(() => {
    fetch("/api/admin/data")
      .then(res => res.json())
      .then(data => {
        if (data.projects) setProjects(data.projects);
        if (data.pillars) setPillars(data.pillars);
        if (data.reports) setReports(data.reports);
        if (data.messages) setMessages(data.messages);
        if (data.systems) setSystems(data.systems);
        if (data.candidates) setCandidates(data.candidates);
        if (data.settings) setSettings(data.settings);
      })
      .catch(err => console.error("Failed to load data:", err));
  }, []);

  // Sync Data Helper
  const syncData = useCallback(async (overrides: any = {}) => {
    setSyncStatus("syncing");
    
    // We need to get the latest state or use overrides
    // Since useState is async, overrides are crucial for immediate updates
    const fullState = {
      projects: overrides.projects !== undefined ? overrides.projects : projects,
      pillars: overrides.pillars !== undefined ? overrides.pillars : pillars,
      reports: overrides.reports !== undefined ? overrides.reports : reports,
      messages: overrides.messages !== undefined ? overrides.messages : messages,
      systems: overrides.systems !== undefined ? overrides.systems : systems,
      candidates: overrides.candidates !== undefined ? overrides.candidates : candidates,
      settings: overrides.settings !== undefined ? overrides.settings : settings,
    };

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
        setSyncStatus("error");
      }
    } catch (err) {
      setSyncStatus("error");
    }
  }, [projects, pillars, reports, messages, systems, candidates, settings]);

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

  // ── Candidates ──
  const addCandidate = useCallback((c: Omit<Candidate, "id" | "timestamp" | "status">) => {
    const newList: Candidate[] = [
      { ...c, id: uid(), timestamp: new Date().toISOString(), status: "Pending" },
      ...candidates,
    ];
    setCandidates(newList);
    syncData({ candidates: newList });
  }, [candidates, syncData]);

  const updateCandidateStatus = useCallback((id: string, status: Candidate["status"]) => {
    const newList = candidates.map((x) => (x.id === id ? { ...x, status } : x));
    setCandidates(newList);
    syncData({ candidates: newList });
  }, [candidates, syncData]);

  const deleteCandidate = useCallback((id: string) => {
    const newList = candidates.filter((x) => x.id !== id);
    setCandidates(newList);
    syncData({ candidates: newList });
  }, [candidates, syncData]);

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
        candidates, addCandidate, updateCandidateStatus, deleteCandidate,
        settings, updateSettings,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}
