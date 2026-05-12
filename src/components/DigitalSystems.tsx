"use client";

import { useState } from "react";
import { Section, SectionHeading } from "./Section";
import { Code, LayoutTemplate, X, ChevronRight, Laptop, Cpu, Globe } from "lucide-react";
import { useAdmin, DigitalSystem } from "@/context/AdminContext";
import { AnimatePresence, motion } from "framer-motion";

function SystemModal({ system, onClose }: { system: DigitalSystem; onClose: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 bg-[#000814]/95 backdrop-blur-xl"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="relative w-full max-w-2xl bg-[#020617] border border-[#00F2FF]/20 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,242,255,0.15)] p-8 md:p-12"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-white/50 hover:text-[#00F2FF] bg-white/5 p-2 rounded-full transition-all z-[210] border border-white/10"><X className="w-5 h-5" /></button>

        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-[#00F2FF]/10 rounded-2xl border border-[#00F2FF]/20 text-[#00F2FF]">
              <Code className="w-8 h-8" />
            </div>
            <div>
              <span className="font-mono text-[10px] tracking-[0.3em] text-[#00F2FF]/60 uppercase mb-1 block">SYSTEM_DEPLOYMENT</span>
              <h2 className="text-3xl font-bold tracking-tight text-white leading-tight">{system.title}</h2>
            </div>
          </div>

          <div className="space-y-6">
             <div className="flex flex-col gap-3">
               <span className="font-mono text-[10px] tracking-widest text-[#00F2FF]/40 uppercase">Architecture & Design</span>
               <p className="text-base text-white/70 leading-relaxed font-light">{system.description}</p>
             </div>

             <div className="flex flex-col gap-3">
               <span className="font-mono text-[10px] tracking-widest text-[#00F2FF]/40 uppercase">Technology Stack</span>
               <div className="flex flex-wrap gap-2">
                 {system.techStack.map(tech => (
                   <span key={tech} className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest bg-white/5 border border-white/10 text-white/70 rounded-lg">{tech}</span>
                 ))}
               </div>
             </div>
          </div>

          <div className="pt-8 border-t border-white/5">
             <a 
               href={system.link} 
               target="_blank" 
               rel="noopener noreferrer"
               className="flex items-center justify-center gap-3 w-full py-4 bg-[#00F2FF] text-black rounded-2xl text-xs font-mono tracking-[0.2em] uppercase font-bold hover:bg-[#00F2FF]/80 transition-all shadow-[0_0_30px_rgba(0,242,255,0.2)]"
             >
               <LayoutTemplate className="w-5 h-5" /> Launch Full Application
             </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function SystemCard({ system, idx, onOpen }: { system: DigitalSystem; idx: number; onOpen: () => void }) {
  // Cycle through some icons for variety
  const icons = [<Laptop key="l" />, <Cpu key="c" />, <Globe key="g" />, <Code key="cd" />];
  const Icon = icons[idx % icons.length];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.1 }}
      className="group relative aspect-square bg-[#020617] border border-[#00F2FF]/10 rounded-2xl overflow-hidden cursor-pointer hover:border-[#00F2FF]/40 transition-all p-6 flex flex-col items-center justify-center text-center"
      onClick={onOpen}
    >
      <div className="p-4 bg-[#00F2FF]/5 rounded-2xl text-[#00F2FF]/40 group-hover:text-[#00F2FF] group-hover:bg-[#00F2FF]/10 group-hover:scale-110 transition-all duration-500 mb-4 border border-transparent group-hover:border-[#00F2FF]/20">
         {Icon}
      </div>
      
      <h3 className="text-sm font-bold text-white/80 group-hover:text-white transition-colors tracking-wide max-w-[120px]">{system.title}</h3>
      
      <div className="absolute inset-0 bg-gradient-to-t from-[#00F2FF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="absolute bottom-4 left-0 right-0 overflow-hidden h-0 group-hover:h-6 transition-all duration-300">
         <span className="text-[10px] font-mono tracking-[0.2em] text-[#00F2FF] uppercase">System Overview</span>
      </div>
    </motion.div>
  );
}

export function DigitalSystems() {
  const { systems } = useAdmin();
  const [selectedSystem, setSelectedSystem] = useState<DigitalSystem | null>(null);

  return (
    <Section id="digital-systems">
      <SectionHeading>Digital Systems</SectionHeading>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 relative">
        {systems.map((sys, idx) => (
          <SystemCard 
            key={sys.id} 
            system={sys} 
            idx={idx} 
            onOpen={() => setSelectedSystem(sys)} 
          />
        ))}

        {systems.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-[#00F2FF]/10 rounded-max flex flex-col items-center justify-center">
             <p className="font-mono text-xs text-[#00F2FF]/30 uppercase tracking-[0.2em]">Awaiting Digital Engineering Deployment</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedSystem && (
          <SystemModal 
            system={selectedSystem} 
            onClose={() => setSelectedSystem(null)} 
          />
        )}
      </AnimatePresence>
    </Section>
  );
}
