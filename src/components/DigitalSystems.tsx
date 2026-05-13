"use client";

import { Section, SectionHeading } from "./Section";
import { Code, LayoutTemplate } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";

export function DigitalSystems() {
  const { systems } = useAdmin();

  return (
    <Section id="digital-systems">
      <SectionHeading>Digital Systems</SectionHeading>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {systems.map((sys) => (
          <div key={sys.id} className="flex flex-col border border-[#00F2FF]/20 bg-background/50 p-8 rounded-max hover:border-[#00F2FF]/50 transition-all duration-300 group shadow-[rgba(0,242,255,0.05)_0px_0px_20px] relative overflow-hidden">
            
            <Code className="w-10 h-10 text-[#00F2FF] mb-6 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
            
            <h3 className="text-xl md:text-2xl font-bold mb-3 tracking-wide drop-shadow-sm" style={{
              backgroundImage: "linear-gradient(180deg, #FFFFFF 10%, #BFC9D2 40%, #DCE3EA 70%, #94A3B8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
              {sys.title}
            </h3>
            
            <div className="flex flex-wrap gap-3 mb-6">
               {sys.techStack.map(tech => (
                 <span key={tech} className="px-3 py-1 text-[10px] font-mono uppercase tracking-widest border border-[#00F2FF]/30 text-[#00F2FF]/90">{tech}</span>
               ))}
            </div>

            <p className="text-foreground/80 font-light text-sm leading-relaxed mb-6">
              {sys.description}
            </p>

            <div className="mt-auto pt-6 border-t border-muted/50">
               <a 
                 href={sys.link.startsWith('http') ? sys.link : `https://${sys.link}`} 
                 target="_blank"
                 rel="noreferrer"
                 className="flex items-center gap-2 text-xs font-mono tracking-widest text-white hover:text-[#00F2FF] uppercase transition-colors"
               >
                 <LayoutTemplate className="w-4 h-4" />
                 Launch Application
               </a>
            </div>
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
