"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Lock, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

// Access credentials
const VALID_ACCESS_CODES = [
  "Morgan@17/08/25",
  "morgan@17/08/25",
];

const SESSION_DURATION_MS = 30 * 60 * 1000; // 30 minutes

export default function AdminLoginPage() {
  const router = useRouter();
  const [agent, setAgent] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [status, setStatus] = useState<"idle" | "authenticating" | "success" | "denied">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Check if already authenticated
  useEffect(() => {
    const expiry = sessionStorage.getItem("admin_session_expiry");
    if (expiry && parseInt(expiry, 10) > Date.now()) {
      router.replace("/admin/dashboard");
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "authenticating" || status === "success") return;

    setStatus("authenticating");
    setErrorMessage("");

    setTimeout(() => {
      const codeClean = accessCode.trim();
      const isValid = VALID_ACCESS_CODES.includes(codeClean);

      if (isValid) {
        setStatus("success");
        const expiry = Date.now() + SESSION_DURATION_MS;
        sessionStorage.setItem("admin_session_expiry", expiry.toString());
        sessionStorage.setItem("admin_operator", agent.trim() || "Morgan");
        setTimeout(() => {
          router.push("/admin/dashboard");
        }, 800);
      } else {
        setStatus("denied");
        setErrorMessage("Invalid access code. Please verify credentials.");
        setTimeout(() => {
          setStatus("idle");
        }, 3000);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col justify-center items-center px-4 relative overflow-hidden font-sans">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-[#00F2FF]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-[#00F2FF]/5 blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-[#00F2FF]/10 border border-[#00F2FF]/30 flex items-center justify-center text-[#00F2FF] font-mono text-sm font-bold shadow-[0_0_20px_rgba(0,242,255,0.15)] mb-3">
            MM
          </div>
          <h1 className="font-heading font-bold text-xl tracking-wide text-white">
            Morgan Mhandu
          </h1>
          <p className="font-mono text-xs text-white/50 tracking-widest uppercase mt-1">
            Admin Console
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#0B0F17]/95 border border-[#1F2937] rounded-2xl p-7 sm:p-8 backdrop-blur-xl shadow-2xl">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-white tracking-tight">Portal Authentication</h2>
            <p className="text-xs text-white/50 mt-1">
              Enter your credentials to access system settings and portfolio management.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Agent Input */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="agent" className="font-mono text-xs uppercase tracking-wider text-white/70">
                Agent / Operator
              </label>
              <input
                type="text"
                id="agent"
                value={agent}
                onChange={(e) => setAgent(e.target.value)}
                disabled={status === "authenticating" || status === "success"}
                placeholder="e.g. Morgan"
                className="w-full bg-black/50 border border-[#1F2937] focus:border-[#00F2FF]/70 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none transition-all font-sans"
                autoComplete="username"
              />
            </div>

            {/* Access Code Input */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="accessCode" className="font-mono text-xs uppercase tracking-wider text-white/70">
                Access Code
              </label>
              <div className="relative">
                <input
                  type={showCode ? "text" : "password"}
                  id="accessCode"
                  required
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  disabled={status === "authenticating" || status === "success"}
                  placeholder="Enter your access code"
                  className="w-full bg-black/50 border border-[#1F2937] focus:border-[#00F2FF]/70 rounded-xl px-4 py-3 pr-12 text-sm text-white placeholder:text-white/20 focus:outline-none transition-all font-mono"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowCode(!showCode)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                  title={showCode ? "Hide access code" : "Show access code"}
                >
                  {showCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error Message Alert */}
            {status === "denied" && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center gap-2.5 text-xs animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Success Message Alert */}
            {status === "success" && (
              <div className="p-3 rounded-xl bg-[#00F2FF]/10 border border-[#00F2FF]/30 text-[#00F2FF] flex items-center gap-2.5 text-xs animate-in fade-in duration-200">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Verification successful. Loading dashboard...</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === "authenticating" || status === "success" || !accessCode.trim()}
              className="mt-2 w-full py-3.5 px-4 bg-[#00F2FF] hover:bg-[#00F2FF]/90 text-black font-bold font-mono text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(0,242,255,0.2)] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {status === "authenticating" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : status === "success" ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Authenticated</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Back link */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-white/40 hover:text-[#00F2FF] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Portfolio</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
