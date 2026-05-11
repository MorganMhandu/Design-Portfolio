"use client";

import { Section, SectionHeading } from "./Section";
import { Code, LayoutTemplate, X, ExternalLink, Globe } from "lucide-react";
import { useAdmin, DigitalSystem } from "@/context/AdminContext";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function SystemModal({ system, onClose }: { system: DigitalSystem; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-xl"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-2xl bg-[#020617] border border-[#00F2FF]/20 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,242,255,0.15)] p-8 md:p-12"
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-white/50 hover:text-white bg-white/5 p-2 rounded-full transition-colors z-[220]"><X className="w-6 h-6" /></button>

        <div className="mb-8">
          <div className="w-12 h-12 bg-[#00F2FF]/10 rounded-xl flex items-center justify-center text-[#00F2FF] mb-6 border border-[#00F2FF]/20">
            <Code className="w-6 h-6" />
          </div>
          <span className="font-mono text-xs tracking-[0.3em] text-[#00F2FF]/60 uppercase mb-4 block">System_Deployment</span>
          <h2 className="text-3xl font-bold text-white mb-6 bg-gradient-to-r from-white to-[#94A3B8] bg-clip-text text-transparent">{system.title}</h2>
        </div>

        <div className="space-y-8 mb-12">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[10px] tracking-widest text-[#00F2FF]/50 uppercase">Architecture & Description</span>
            <p className="text-sm text-white/70 leading-relaxed font-light">{system.description}</p>
          </div>
          
          <div className="flex flex-col gap-4">
            <span className="font-mono text-[10px] tracking-widest text-[#00F2FF]/50 uppercase">Technology Stack</span>
            <div className="flex flex-wrap gap-2">
              {system.techStack.map(tech => (
                <span key={tech} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-mono text-white/60 tracking-wider">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5">
          <a 
            href={system.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-[#00F2FF] text-black font-bold rounded-2xl hover:bg-[#00F2FF]/80 transition-all shadow-[0_0_20px_rgba(0,242,255,0.3)]"
          >
            <Globe className="w-5 h-5" />
            Launch Production Environment
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </motion.div>
    </div>
  );
}

function SystemCard({ system, idx }: { system: DigitalSystem; idx: number }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: idx * 0.1 }}
        onClick={() => setIsModalOpen(true)}
        className="group relative bg-[#020617] border border-[#00F2FF]/10 rounded-2xl p-6 cursor-pointer hover:border-[#00F2FF]/40 transition-all duration-500 flex flex-col items-center text-center shadow-xl overflow-hidden"
      >
        {/* Background Scanline */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(0,242,255,1)_1px,transparent_1px)] bg-[size:100%_4px]" />
        
        <div className="w-12 h-12 bg-[#00F2FF]/5 rounded-xl flex items-center justify-center text-[#00F2FF]/60 mb-6 border border-[#00F2FF]/10 group-hover:scale-110 group-hover:bg-[#00F2FF]/10 group-hover:text-[#00F2FF] transition-all">
          <Code className="w-6 h-6" />
        </div>

        <span className="font-mono text-[9px] tracking-[0.3em] text-[#00F2FF]/40 uppercase mb-3">NODE_{idx + 1}</span>
        
        <h3 className="text-sm font-bold text-white group-hover:text-[#00F2FF] transition-colors mb-4 line-clamp-1">
          {system.title}
        </h3>

        <div className="flex flex-wrap justify-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
           {system.techStack.slice(0, 2).map(tech => (
             <span key={tech} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[8px] font-mono text-white/50">{tech}</span>
           ))}
           {system.techStack.length > 2 && <span className="text-[8px] font-mono text-white/30">+{system.techStack.length - 2}</span>}
        </div>

        {/* Action Reveal */}
        <div className="mt-6 text-[10px] font-mono text-[#00F2FF] uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2">
          View Detail <ExternalLink className="w-3 h-3" />
        </div>
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <SystemModal 
            system={system} 
            onClose={() => setIsModalOpen(false)} 
          />
        )}
      </AnimatePresence>
    </>
  );
}

export function DigitalSystems() {
  const { systems } = useAdmin();

  return (
    <Section id="digital-systems">
      <SectionHeading>Digital Systems</SectionHeading>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 relative">
        {systems.map((sys, idx) => (
          <SystemCard key={sys.id} system={sys} idx={idx} />
        ))}

        {systems.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-[#00F2FF]/10 rounded-2xl flex flex-col items-center justify-center">
             <p className="font-mono text-xs text-[#00F2FF]/30 uppercase tracking-[0.2em]">Awaiting Digital Engineering Deployment</p>
          </div>
        )}
      </div>
    </Section>
  );
}
