"use client";

import { Star } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function AdminShortcut() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed bottom-6 right-6 z-[100]"
    >
      <Link 
        href="/admin"
        className="group relative flex items-center justify-center w-10 h-10 rounded-full bg-black/40 border border-[#00F2FF]/20 backdrop-blur-md hover:border-[#00F2FF]/60 hover:shadow-[0_0_20px_rgba(0,242,255,0.3)] transition-all duration-500"
      >
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-[#00F2FF]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <Star className="w-4 h-4 text-[#00F2FF]/40 group-hover:text-[#00F2FF] group-hover:rotate-[72deg] transition-all duration-700" />
        
        {/* Tooltip */}
        <span className="absolute right-full mr-4 px-3 py-1 rounded bg-black/80 border border-[#00F2FF]/30 text-[#00F2FF] font-mono text-[8px] tracking-[0.2em] uppercase opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 translate-x-2 group-hover:translate-x-0 whitespace-nowrap">
          [ Secure Access ]
        </span>
      </Link>
    </motion.div>
  );
}
