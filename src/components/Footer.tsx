import { Github, Linkedin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative py-[60px] flex flex-col items-center justify-center gap-4 px-6">
      {/* Thin Titanium Gradient Line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#94A3B8] to-transparent opacity-50" />

      {/* Social Icons */}
      <div className="flex items-center gap-8 text-[#94A3B8]">
        <a href="#" className="hover:text-[#00F2FF] hover:drop-shadow-[0_0_8px_rgba(0,242,255,0.8)] transition-all duration-300">
          <Linkedin className="w-5 h-5" />
        </a>
        <a href="#" className="hover:text-[#00F2FF] hover:drop-shadow-[0_0_8px_rgba(0,242,255,0.8)] transition-all duration-300">
          <Mail className="w-5 h-5" />
        </a>
        <a href="#" className="hover:text-[#00F2FF] hover:drop-shadow-[0_0_8px_rgba(0,242,255,0.8)] transition-all duration-300">
          <Github className="w-5 h-5" />
        </a>
      </div>

      {/* Copyright Line */}
      <p className="text-[#94A3B8] text-sm tracking-wide text-center">
        &copy; 2026 Morgan Michael Mhandu. All rights reserved.
      </p>

      {/* Quote */}
      <div className="font-mono text-xs flex flex-col items-center gap-2 text-center max-w-2xl">
        <p className="text-[#94A3B8] leading-[1.4]">
          &quot;The present is theirs; the future, for which I really worked, is mine.&quot;
        </p>
        <p className="text-white">
          &mdash; <span className="text-[#00F2FF] drop-shadow-[0_0_8px_rgba(0,242,255,0.8)] font-semibold">Nikola Tesla</span>
        </p>
      </div>

      {/* Hidden Admin Entry Point */}
      <a
        href="/admin"
        className="mt-4 font-mono text-[8px] tracking-[0.3em] text-[#94A3B8]/20 hover:text-[#00F2FF]/50 transition-colors duration-500 uppercase select-none"
        tabIndex={-1}
        aria-hidden="true"
      >
        Admin Login
      </a>
    </footer>
  );
}
