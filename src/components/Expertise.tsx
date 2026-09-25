"use client";

import { useState, useEffect } from "react";
import { Section, SectionHeading } from "./Section";
import { Cpu, Wrench, Code, Hexagon, Crosshair, Settings, Layers, Zap } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";

const getIcon = (name: string) => {
  const icons: Record<string, React.ElementType> = { Hexagon, Cpu, Wrench, Crosshair, Code, Settings, Layers, Zap };
  const IconCmp = icons[name] || Hexagon;
  return <IconCmp className="w-6 h-6 transition-colors" />;
};

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

  return (
    <Section id="capabilities">
      <div className="flex flex-col mb-8">
        <SectionHeading>Technical Capabilities</SectionHeading>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pillars.map((cap, idx) => (
          <div 
            key={cap.id} 
            className="flex flex-col justify-between relative group rounded-2xl border border-[#1F2937] bg-[#0B0F17]/90 backdrop-blur-md p-6 lg:p-8 min-h-[170px] hover:border-[#00F2FF]/60 hover:shadow-cad-glow transition-all duration-300 cursor-default overflow-hidden"
          >
            {/* Top Row: Icon */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#00F2FF]/10 border border-[#00F2FF]/30 text-[#00F2FF] group-hover:scale-110 group-hover:bg-[#00F2FF] group-hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(0,242,255,0.15)]">
                {getIcon(cap.iconName)}
              </div>
            </div>

            {/* Prominent Heading */}
            <div>
              <h3 
                className="font-heading text-lg sm:text-xl font-bold tracking-tight text-white group-hover:text-[#00F2FF] transition-colors duration-300 uppercase outline-none"
                contentEditable={isAdmin}
                suppressContentEditableWarning
                onBlur={(e) => handleTitleBlur(cap.id, e.currentTarget.textContent || "")}
              >
                {cap.title}
              </h3>
            </div>

            {/* Glowing Bottom Laser Line on Hover */}
            <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-[#00F2FF] to-transparent group-hover:w-full transition-all duration-500 ease-out" />
          </div>
        ))}
      </div>
    </Section>
  );
}
