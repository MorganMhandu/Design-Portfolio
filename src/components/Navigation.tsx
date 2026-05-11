"use client";

import { useState, useEffect } from "react";
import { cn } from "@/utils/cn";

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Projects", href: "#projects" },
    { label: "Technical Capabilities", href: "#capabilities" },
    { label: "Digital Systems", href: "#digital-systems" },
    { label: "Engineering Dossier", href: "#dossier" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out border-b border-transparent px-6 lg:px-8",
        scrolled ? "bg-background/80 backdrop-blur-md border-muted py-4" : "bg-transparent py-6"
      )}
    >
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        {/* Logo / Identity */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-full bg-heading flex items-center justify-center text-background font-bold text-sm overflow-hidden group-hover:scale-105 transition-transform">
            MM
          </div>
        </a>

        <nav className="hidden md:flex items-center gap-12">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-bold hover:scale-105 transition-all duration-300 tracking-widest uppercase bg-clip-text text-transparent bg-[linear-gradient(to_bottom_right,#FFFFFF_0%,#00F2FF_50%,#78909C_100%)] hover:bg-[linear-gradient(to_bottom_right,#00F2FF,#00F2FF)] opacity-90 hover:opacity-100 drop-shadow-sm"
            >
              {link.label}
            </a>
          ))}
        </nav>
        
        {/* Mobile menu toggle could be added here, keeping it extremely minimal for now */}
        <div className="md:hidden">
          <a href="#contact" className="text-sm font-medium text-heading">
            Connect
          </a>
        </div>
      </div>
    </header>
  );
}
