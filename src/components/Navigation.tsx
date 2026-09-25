"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/utils/cn";
import { Terminal, Menu, X } from "lucide-react";

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Engineering Work", href: "#projects" },
    { label: "Capabilities", href: "#capabilities" },
    { label: "Digital Systems", href: "#digital-systems" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out px-6 lg:px-12",
        scrolled
          ? "bg-[#030712]/85 backdrop-blur-md border-b border-[#1F2937] py-3.5 shadow-2xl"
          : "bg-transparent py-6"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Token */}
        <div className="flex items-center gap-3">
          <Link 
            href="/admin" 
            title="Admin Console"
            className="w-8 h-8 rounded-lg bg-[#00F2FF]/10 border border-[#00F2FF]/30 flex items-center justify-center text-[#00F2FF] font-mono text-xs font-bold hover:bg-[#00F2FF] hover:text-black transition-all cursor-pointer shadow-[0_0_15px_rgba(0,242,255,0.15)]"
          >
            MM
          </Link>
          <a href="#" className="font-heading font-bold text-sm text-white tracking-wider hover:text-[#00F2FF] transition-colors">
            MORGAN MHANDU
          </a>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-wider">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[#94A3B8] hover:text-[#00F2FF] transition-colors py-1 relative group"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#00F2FF] group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </nav>

        {/* Action Button */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="#contact"
            className="px-4 py-2 rounded-lg bg-[#00F2FF]/10 border border-[#00F2FF]/30 text-[#00F2FF] font-mono text-xs uppercase tracking-wider hover:bg-[#00F2FF] hover:text-black transition-all"
          >
            Contact
          </a>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#94A3B8] hover:text-white"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 pb-6 border-b border-[#1F2937] bg-[#0B0F17]/95 backdrop-blur-xl p-6 rounded-2xl flex flex-col gap-4 font-mono text-sm">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#94A3B8] hover:text-[#00F2FF] py-2"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full text-center py-3 rounded-lg bg-[#00F2FF] text-black font-bold uppercase tracking-wider text-xs mt-2"
          >
            Contact
          </a>
        </div>
      )}
    </header>
  );
}
