"use client";

import { Section, SectionHeading } from "./Section";
import { Code, LayoutTemplate, PlayCircle } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";

export function DigitalSystems() {
  const { systems } = useAdmin();
  
  const sortedSystems = [...systems].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <Section id="digital-systems" className="pt-12 md:pt-20">
      <SectionHeading>Digital Systems</SectionHeading>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        
        {sortedSystems.map((sys, idx) => (
          <div key={sys.id} className="flex flex-col justify-between border border-[#1F2937] bg-[#0B0F17]/90 p-7 rounded-2xl hover:border-[#00F2FF]/60 hover:shadow-cad-glow transition-all duration-300 group relative overflow-hidden min-h-[200px]">
            
            <div>
              {/* Top Row: Icon + Version Tag */}
              <div className="flex items-center justify-between mb-5">
                <div className="w-10 h-10 rounded-xl bg-[#00F2FF]/10 border border-[#00F2FF]/30 flex items-center justify-center text-[#00F2FF] group-hover:scale-110 group-hover:bg-[#00F2FF] group-hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(0,242,255,0.15)]">
                  <Code className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <span className="font-mono text-[10px] text-[#00F2FF]/60 uppercase tracking-widest">
                  SYS // 0{idx + 1}
                </span>
              </div>
              
              {/* Title */}
              <h3 className="font-heading text-xl font-bold mb-4 tracking-tight text-white group-hover:text-[#00F2FF] transition-colors">
                {sys.title}
              </h3>
              
              {/* Tech Stack Pills */}
              <div className="flex flex-wrap gap-2 mb-6">
                {sys.techStack.map(tech => (
                  <span key={tech} className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider rounded-md bg-[#030712] border border-[#1F2937] text-[#94A3B8] group-hover:border-[#00F2FF]/30 group-hover:text-[#00F2FF] transition-colors">{tech}</span>
                ))}
              </div>
            </div>

            {/* Launch Action */}
            <div className="pt-4 border-t border-[#1F2937] flex items-center justify-between gap-4">
               {sys.link && sys.link !== "#" ? (
                 <a 
                   href={sys.link.startsWith('http') ? sys.link : `https://${sys.link}`} 
                   target="_blank"
                   rel="noreferrer"
                   className="flex items-center gap-2 text-xs font-mono tracking-wider text-white hover:text-[#00F2FF] uppercase transition-colors font-semibold"
                 >
                   <LayoutTemplate className="w-3.5 h-3.5 text-[#00F2FF]" />
                   Launch System
                 </a>
               ) : (
                 <span className="flex items-center gap-2 text-xs font-mono tracking-wider text-[#94A3B8]/60 uppercase cursor-default">
                   <LayoutTemplate className="w-3.5 h-3.5 text-[#00F2FF]/40" />
                   Internal System
                 </span>
               )}
               {sys.videoUrl && (
                 <a 
                   href={sys.videoUrl} 
                   target="_blank"
                   rel="noreferrer"
                   className="flex items-center gap-2 text-xs font-mono tracking-wider text-[#FF5400] hover:text-white uppercase transition-colors"
                 >
                   <PlayCircle className="w-3.5 h-3.5" />
                   Demo
                 </a>
               )}
            </div>

            {/* Bottom Glow Line */}
            <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-[#00F2FF] to-transparent group-hover:w-full transition-all duration-500 ease-out" />
          </div>
        ))}

        {systems.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-[#00F2FF]/10 rounded-max flex flex-col items-center justify-center">
             <p className="font-mono text-xs text-[#00F2FF]/30 uppercase tracking-[0.2em]">Awaiting Digital Engineering Deployment</p>
          </div>
        )}

      </div>
    </Section>
  );
}
