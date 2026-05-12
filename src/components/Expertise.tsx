"use client";

import { useState, useEffect } from "react";
import { Section, SectionHeading } from "./Section";
import { Cpu, Wrench, Code, Hexagon, Crosshair, Settings, Layers, Zap } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";

const getIcon = (name: string) => {
  const icons: Record<string, React.ElementType> = { Hexagon, Cpu, Wrench, Crosshair, Code, Settings, Layers, Zap };
  const IconCmp = icons[name] || Hexagon;
  return <IconCmp className="w-8 h-8 md:w-10 md:h-10 text-[#00F2FF]/80 drop-shadow-[0_0_10px_rgba(0,242,255,0.5)]" />;
};

const highlightText = (text: string) =>
  text.split(/(\bGD&T\b|\bFEA\b|\bPLC\b|\bNext\.js\b|\bISO\b)/).map((part, index) =>
    ["GD&T", "FEA", "PLC", "Next.js", "ISO"].includes(part) ? (
      <strong key={index} className="text-[#00F2FF] font-bold drop-shadow-[0_0_8px_rgba(0,242,255,0.8)] border-b border-[#00F2FF]/50 pb-[1px]">{part}</strong>
    ) : part
  );

export function Expertise() {
  const { pillars, editPillar } = useAdmin();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const expiry = sessionStorage.getItem("admin_session_expiry");
    if (expiry && parseInt(expiry) > Date.now()) {
      setIsAdmin(true);
    }
  }, []);

  const handleTitleBlur = (id: string, newTitle: string) => {
    editPillar(id, { title: newTitle });
  };

  const handleBulletBlur = (pillarId: string, bulletIdx: number, newBullet: string) => {
    const pillar = pillars.find(p => p.id === pillarId);
    if (!pillar) return;
    const bullets = [...pillar.bullets];
    bullets[bulletIdx] = newBullet;
    editPillar(pillarId, { bullets });
  };

  return (
    <Section id="capabilities">
      <div className="flex flex-col mb-4">
        <SectionHeading>Technical Capabilities</SectionHeading>
      </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-stretch">
          {pillars.map((cap, idx) => (
            <div key={cap.id} className="flex flex-col relative group overflow-visible rounded-2xl border border-[#00F2FF]/40 bg-[#020617]/80 backdrop-blur-md p-5 lg:p-5 pb-10 transition-all duration-500 hover:scale-[1.02] hover:border-[#00F2FF]/80 hover:shadow-[0_0_30px_rgba(0,242,255,0.15),inset_0_0_20px_rgba(0,242,255,0.05)] cursor-default h-auto">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#00F2FF05_1px,transparent_1px),linear-gradient(to_bottom,#00F2FF05_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-500 z-0" />
              <div className="relative z-10 flex flex-col h-full font-mono justify-start">
                <div className="flex flex-col xl:flex-row items-start gap-4 mb-8 min-h-[4.5rem]">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-black/40 border border-[#00F2FF]/30 group-hover:border-[#00F2FF]/80 group-hover:bg-[#00F2FF]/10 transition-all duration-300 shadow-[inset_0_0_15px_rgba(0,242,255,0.1)] shrink-0">
                    {getIcon(cap.iconName)}
                  </div>
                  <h3 
                    className="text-sm xl:text-base font-bold tracking-tight flex-1 drop-shadow-sm text-heading break-words uppercase pt-1 outline-none focus:text-[#00F2FF] transition-colors"
                    contentEditable={isAdmin}
                    suppressContentEditableWarning
                    onBlur={(e) => handleTitleBlur(cap.id, e.currentTarget.textContent || "")}
                  >
                    {cap.title}
                  </h3>
                </div>
                <ul className="space-y-3 border-l border-[#00F2FF]/30 pl-4 relative group-hover:border-[#00F2FF]/80 transition-colors duration-500">
                  {cap.bullets.map((bullet, bIdx) => (
                    <li key={bIdx} className="text-foreground/80 text-[10px] xl:text-[11px] font-light leading-snug relative flex items-start">
                      <span className="absolute -left-[20px] top-2.5 w-[8px] h-[1px] bg-[#00F2FF]/50 group-hover:bg-[#00F2FF] transition-colors duration-300" />
                      <span 
                        className="group-hover:text-foreground transition-colors duration-300 outline-none focus:text-[#00F2FF]"
                        contentEditable={isAdmin}
                        suppressContentEditableWarning
                        onBlur={(e) => handleBulletBlur(cap.id, bIdx, e.currentTarget.textContent || "")}
                      >
                        {isAdmin ? bullet : highlightText(bullet)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-[linear-gradient(90deg,transparent,#00F2FF,transparent)] group-hover:w-full transition-all duration-700 ease-in-out opacity-0 group-hover:opacity-100 z-10" />
            </div>
          ))}
        </div>
    </Section>
  );
}
