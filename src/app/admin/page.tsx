"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Shield, Eye, EyeOff, Zap } from "lucide-react";

const CREDENTIALS = {
  operatorId: "MORGAN",
  accessCode: "MECH_SYNAPSE_7734",
};

const SESSION_DURATION_MS = 30 * 60 * 1000; // 30 minutes

const bootSequence = [
  "INITIALIZING SECURE TERMINAL v4.7.2...",
  "BIOMETRIC AUTH MODULE: LOADED",
  "ENCRYPTION LAYER: AES-256 ACTIVE",
  "SESSION HANDLER: STANDBY",
  "CORE_SYSTEMS: ONLINE",
  "AWAITING OPERATOR CREDENTIALS...",
];

export default function AdminLoginPage() {
  const router = useRouter();
  const [operatorId, setOperatorId] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [status, setStatus] = useState<"idle" | "scanning" | "success" | "denied">("idle");
  const [scanProgress, setScanProgress] = useState(0);
  const [glitch, setGlitch] = useState(false);
  const [bootLines, setBootLines] = useState<string[]>([]);
  const scanInterval = useRef<NodeJS.Timeout | null>(null);

  // Check if already authenticated
  useEffect(() => {
    const expiry = sessionStorage.getItem("admin_session_expiry");
    if (expiry && parseInt(expiry) > Date.now()) {
      router.replace("/admin/dashboard");
    }
  }, [router]);

  // Boot animation
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < bootSequence.length) {
        setBootLines((prev) => [...prev, bootSequence[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 280);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "scanning") return;

    setStatus("scanning");
    setScanProgress(0);

    let progress = 0;
    scanInterval.current = setInterval(() => {
      progress += Math.random() * 18 + 5;
      if (progress >= 100) {
        progress = 100;
        setScanProgress(100);
        clearInterval(scanInterval.current!);

        const isValid =
          operatorId.toUpperCase() === CREDENTIALS.operatorId &&
          accessCode === CREDENTIALS.accessCode;

        if (isValid) {
          setStatus("success");
          const expiry = Date.now() + SESSION_DURATION_MS;
          sessionStorage.setItem("admin_session_expiry", expiry.toString());
          sessionStorage.setItem("admin_operator", operatorId.toUpperCase());
          setTimeout(() => router.push("/admin/dashboard"), 1200);
        } else {
          setStatus("denied");
          setGlitch(true);
          setTimeout(() => {
            setGlitch(false);
            setStatus("idle");
            setScanProgress(0);
          }, 2200);
        }
      } else {
        setScanProgress(progress);
      }
    }, 80);
  };

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Animated grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,242,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,242,255,0.04)_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Corner decorators */}
      <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-[#00F2FF]/30" />
      <div className="absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-[#00F2FF]/30" />
      <div className="absolute bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-[#00F2FF]/30" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-[#00F2FF]/30" />

      {/* Radial glow behind terminal */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(0,242,255,0.06)_0%,transparent_70%)] pointer-events-none" />

      {/* Terminal Container */}
      <div
        className={`relative z-10 w-full max-w-lg transition-all duration-300 ${
          glitch ? "animate-pulse" : ""
        }`}
      >
        {/* Terminal Header */}
        <div className="bg-[#020617] border border-[#00F2FF]/40 border-b-0 rounded-t-xl px-5 py-3 flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
          </div>
          <span className="font-mono text-[10px] tracking-[0.3em] text-[#00F2FF]/50 uppercase mx-auto">
            SECURE_TERMINAL // AUTH_NODE_01
          </span>
        </div>

        {/* Boot Log */}
        <div className="bg-black/60 border-x border-[#00F2FF]/40 px-5 py-3 font-mono text-[9px] tracking-widest space-y-0.5 min-h-[130px]">
          {bootLines.map((line, i) => (
            <p
              key={i}
              className={`${
                line && (line.includes("ONLINE") || line.includes("ACTIVE"))
                  ? "text-[#00F2FF]"
                  : "text-[#94A3B8]/70"
              } leading-relaxed`}
            >
              <span className="text-[#00F2FF]/40 mr-2">&gt;</span>
              {line}
            </p>
          ))}
          {bootLines.length < bootSequence.length && (
            <p className="text-[#00F2FF] animate-pulse">
              <span className="text-[#00F2FF]/40 mr-2">&gt;</span>
              <span className="inline-block w-2 h-3 bg-[#00F2FF] animate-pulse" />
            </p>
          )}
        </div>

        {/* Main Auth Panel */}
        <div className="bg-[#020617]/95 border border-[#00F2FF]/40 border-t border-t-[#00F2FF]/20 rounded-b-xl p-8 backdrop-blur-xl shadow-[0_0_60px_rgba(0,242,255,0.08)]">
          {/* Icon + Title */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl border border-[#00F2FF]/40 bg-[#00F2FF]/10 flex items-center justify-center shadow-[0_0_20px_rgba(0,242,255,0.2)]">
              <Shield className="w-6 h-6 text-[#00F2FF]" />
            </div>
            <div>
              <h1 className="font-mono text-white text-base font-bold tracking-[0.15em] uppercase">
                Identity Verification
              </h1>
              <p className="font-mono text-[10px] text-[#94A3B8]/60 tracking-widest uppercase mt-0.5">
                Morgan Michael Mhandu // Admin Access
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Operator ID */}
            <div className="flex flex-col gap-2">
              <label className="font-mono text-[9px] tracking-[0.3em] text-[#00F2FF]/70 uppercase">
                Operator ID
              </label>
              <input
                type="text"
                id="operator-id"
                value={operatorId}
                onChange={(e) => setOperatorId(e.target.value)}
                disabled={status === "scanning" || status === "success"}
                className="bg-black/40 border border-[#00F2FF]/25 rounded-lg px-4 py-3 font-mono text-sm text-white tracking-widest focus:outline-none focus:border-[#00F2FF]/80 focus:shadow-[0_0_15px_rgba(0,242,255,0.15)] transition-all placeholder:text-white/15 uppercase"
                placeholder="[ ENTER OPERATOR ID ]"
                autoComplete="off"
              />
            </div>

            {/* Access Code */}
            <div className="flex flex-col gap-2">
              <label className="font-mono text-[9px] tracking-[0.3em] text-[#00F2FF]/70 uppercase">
                Access Code
              </label>
              <div className="relative">
                <input
                  type={showCode ? "text" : "password"}
                  id="access-code"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  disabled={status === "scanning" || status === "success"}
                  className="w-full bg-black/40 border border-[#00F2FF]/25 rounded-lg px-4 py-3 pr-12 font-mono text-sm text-white tracking-widest focus:outline-none focus:border-[#00F2FF]/80 focus:shadow-[0_0_15px_rgba(0,242,255,0.15)] transition-all placeholder:text-white/15"
                  placeholder="[ ENTER ACCESS CODE ]"
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={() => setShowCode(!showCode)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#00F2FF]/40 hover:text-[#00F2FF] transition-colors"
                >
                  {showCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Scan Progress Bar */}
            {status === "scanning" && (
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[9px] tracking-widest text-[#00F2FF]/70 uppercase animate-pulse">
                    Biometric Scan In Progress...
                  </span>
                  <span className="font-mono text-[9px] text-[#00F2FF]">
                    {Math.round(scanProgress)}%
                  </span>
                </div>
                <div className="h-1 w-full bg-[#00F2FF]/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#00F2FF]/80 to-[#00F2FF] rounded-full transition-all duration-100 shadow-[0_0_10px_rgba(0,242,255,0.8)]"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Status Messages */}
            {status === "denied" && (
              <div className="bg-red-500/10 border border-red-500/40 rounded-lg px-4 py-3 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                <span className="font-mono text-xs text-red-400 tracking-widest uppercase">
                  ACCESS DENIED — Invalid Credentials
                </span>
              </div>
            )}

            {status === "success" && (
              <div className="bg-[#00F2FF]/10 border border-[#00F2FF]/40 rounded-lg px-4 py-3 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#00F2FF] animate-pulse shadow-[0_0_8px_rgba(0,242,255,0.8)]" />
                <span className="font-mono text-xs text-[#00F2FF] tracking-widest uppercase">
                  Identity Confirmed — Initializing Command Center...
                </span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              id="auth-submit"
              disabled={status === "scanning" || status === "success" || !operatorId || !accessCode}
              className="mt-2 w-full py-4 bg-[linear-gradient(135deg,#00F2FF15,#00F2FF08)] border border-[#00F2FF]/50 text-[#00F2FF] font-mono font-bold text-sm tracking-[0.25em] uppercase rounded-xl hover:bg-[#00F2FF]/20 hover:border-[#00F2FF] hover:shadow-[0_0_25px_rgba(0,242,255,0.3)] transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Zap className="w-4 h-4" />
              {status === "scanning" ? "SCANNING..." : status === "success" ? "ACCESS GRANTED" : "AUTHENTICATE"}
            </button>
          </form>

          {/* Bottom hint */}
          <p className="mt-6 text-center font-mono text-[8px] tracking-widest text-[#94A3B8]/30 uppercase">
            Unauthorized access attempts are logged and reported.
          </p>
        </div>
      </div>

      {/* System Status Corner */}
      <div className="fixed bottom-5 right-5 flex items-center gap-2 font-mono text-[8px] tracking-widest text-[#00F2FF]/50 uppercase">
        <div className="w-1.5 h-1.5 rounded-full bg-[#00F2FF] animate-pulse shadow-[0_0_6px_rgba(0,242,255,0.8)]" />
        CORE_SYSTEMS: ONLINE
      </div>
    </div>
  );
}
