"use client";

import { useState, useEffect } from "react";
import { Section, SectionHeading } from "./Section";
import { FileText, FileBarChart, ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useAdmin, CaseProject } from "@/context/AdminContext";

function ProjectCard({ project, idx }: { project: CaseProject; idx: number }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    if (!project.images || project.images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % project.images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [project.images]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? project.images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % project.images.length);
  };

  return (
    <div className="relative flex flex-col md:flex-row gap-8 border border-[#00F2FF]/20 bg-background/50 p-6 md:p-8 rounded-2xl hover:border-[#00F2FF]/50 transition-all duration-300 group shadow-[rgba(0,242,255,0.05)_0px_0px_20px]">

      {/* Visual Area */}
      <div className="w-full md:w-5/12 h-auto bg-[#020617] border border-[#00F2FF]/40 rounded-xl flex flex-col items-center justify-center relative overflow-hidden shrink-0 group-hover:border-[#00F2FF]/80 transition-all duration-300 shadow-[0_0_15px_rgba(0,242,255,0.1)] group-hover:shadow-[0_0_25px_rgba(0,242,255,0.3)] group/carousel">
        {project.images && project.images.length > 0 ? (
          <>
            <div className="relative w-full h-full min-h-[300px] flex items-center justify-center cursor-pointer" onClick={() => setIsLightboxOpen(true)} title="Click to expand full view">
              <Image 
                src={project.images[currentImageIndex]} 
                alt={`${project.title} - Render ${currentImageIndex + 1}`} 
                width={1200} 
                height={800} 
                className="w-full h-auto object-contain opacity-90 group-hover:opacity-100 transition-opacity duration-300 mix-blend-lighten max-h-[500px]"
                priority={idx === 0}
                loading={idx === 0 ? undefined : "lazy"}
                key={`${project.id}-${currentImageIndex}-${project.images[currentImageIndex]}`}
              />
            </div>
            {project.images.length > 1 && (
              <>
                <button onClick={handlePrev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 p-1 rounded-full text-[#00F2FF] border border-[#00F2FF]/50 opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-[#00F2FF]/20 z-10 pointer-events-auto"><ChevronLeft className="w-6 h-6" /></button>
                <button onClick={handleNext} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 p-1 rounded-full text-[#00F2FF] border border-[#00F2FF]/50 opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-[#00F2FF]/20 z-10 pointer-events-auto"><ChevronRight className="w-6 h-6" /></button>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10 pointer-events-auto">
                  {project.images.map((_, i) => (
                    <button key={i} onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(i); }} className={`w-2 h-2 rounded-full transition-all ${i === currentImageIndex ? "bg-[#00F2FF] shadow-[0_0_8px_rgba(0,242,255,0.8)]" : "bg-white/30 hover:bg-white/60"}`} />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="absolute inset-0 bg-[#020617] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#00F2FF1a_1px,transparent_1px),linear-gradient(to_bottom,#00F2FF1a_1px,transparent_1px)] bg-[size:32px_32px]" />
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,#00F2FF05_25%,transparent_25%,transparent_50%,#00F2FF05_50%,#00F2FF05_75%,transparent_75%,transparent)] bg-[size:64px_64px]" />
            <div className="relative z-10 flex flex-col items-center gap-4">
               <span className="font-mono text-[10px] tracking-widest text-[#00F2FF]/40 uppercase">No Render Available</span>
            </div>
          </div>
        )}
        <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,242,255,0.15)] pointer-events-none" />
      </div>

      {/* Content Area */}
      <div className="w-full md:w-7/12 flex flex-col py-2">
        <div className="flex-grow">
          <h3 className="text-2xl md:text-3xl font-bold mb-6 tracking-wide drop-shadow-sm" style={{ backgroundImage: "linear-gradient(180deg, #FFFFFF 10%, #BFC9D2 40%, #DCE3EA 70%, #94A3B8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {project.title}
          </h3>
          <ul className="space-y-3">
            <li className="flex flex-col border-b border-muted/30 pb-1.5">
              <span className="text-[10px] font-mono tracking-widest text-[#00F2FF]/60 uppercase mb-1">System Focus</span>
              <span className="text-sm font-light text-foreground/90">{project.focus}</span>
            </li>
            <li className="flex flex-col border-b border-muted/50 pb-2">
              <span className="text-[10px] font-mono tracking-widest text-[#00F2FF]/60 uppercase mb-1">Mechanical Components</span>
              <span className="text-sm font-light text-foreground/90">{project.components}</span>
            </li>
            <li className="flex flex-col border-b border-muted/50 pb-2">
              <span className="text-[10px] font-mono tracking-widest text-[#00F2FF]/60 uppercase mb-1">Automation Stack</span>
              <span className="text-sm font-light text-foreground/90">{project.automation}</span>
            </li>
          </ul>
          <div className="mt-6 relative p-4 flex flex-col gap-3 border border-[#94A3B8]/20 rounded-xl bg-gradient-to-b from-[#00F2FF]/5 to-transparent shadow-[inset_0_0_15px_rgba(0,242,255,0.05)] w-full mb-6">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#94A3B8] to-transparent opacity-50" />
            <h4 className="text-[10px] font-mono tracking-widest text-[#00F2FF]/50 uppercase">Technical Source Bay</h4>
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 justify-between items-start lg:items-center">
              <a href="#" className="group/link flex flex-col gap-1 text-[10px] font-mono tracking-widest text-[#00F2FF]/80 hover:text-[#00F2FF] hover:drop-shadow-[0_0_8px_rgba(0,242,255,0.8)] transition-all flex-1">
                <div className="flex items-center gap-2"><span className="font-sans font-bold text-[#E33539] bg-white/5 px-1 rounded border border-[#E33539]/30 text-[8px] tracking-tighter">SW</span><span>SolidWorks Files</span></div>
                {project.cadSize && <span className="h-0 opacity-0 overflow-hidden group-hover/link:h-auto group-hover/link:opacity-100 group-hover/link:mt-1 text-white/70 transition-all duration-300">Size: {project.cadSize}</span>}
              </a>
              <a href="#" className="group/link flex flex-col gap-1 text-[10px] font-mono tracking-widest text-[#00F2FF]/80 hover:text-[#00F2FF] hover:drop-shadow-[0_0_8px_rgba(0,242,255,0.8)] transition-all flex-1">
                <div className="flex items-center gap-2"><span className="font-sans font-bold text-[#E33539] bg-white/5 px-1.5 rounded border border-[#E33539]/30 text-[8px] tracking-tighter">A</span><span>AutoCAD Files</span></div>
                {project.dwgSize && <span className="h-0 opacity-0 overflow-hidden group-hover/link:h-auto group-hover/link:opacity-100 group-hover/link:mt-1 text-white/70 transition-all duration-300">Size: {project.dwgSize}</span>}
              </a>
              <a href="#" className="group/link flex flex-col gap-1 text-[10px] font-mono tracking-widest text-[#00F2FF]/80 hover:text-[#00F2FF] hover:drop-shadow-[0_0_8px_rgba(0,242,255,0.8)] transition-all flex-1">
                <div className="flex items-center gap-2"><span>Hi-Res Renders</span></div>
                {project.renderSize && <span className="h-0 opacity-0 overflow-hidden group-hover/link:h-auto group-hover/link:opacity-100 group-hover/link:mt-1 text-white/70 transition-all duration-300">Size: {project.renderSize}</span>}
              </a>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mt-auto">
          <a href="#" className="flex-1 flex items-center justify-center gap-2 py-3 border border-[#00F2FF]/40 text-[#00F2FF] hover:bg-[#00F2FF]/10 hover:border-[#00F2FF] transition-all text-[11px] font-mono tracking-widest uppercase"><FileText className="w-4 h-4" />View Technical Specifications (PDF)</a>
          <a href="#" className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#00F2FF]/10 text-white border border-[#00F2FF]/20 hover:bg-[#00F2FF] hover:text-black hover:border-[#00F2FF] transition-all text-[11px] font-mono tracking-widest uppercase font-bold shadow-[0_0_15px_rgba(0,242,255,0.1)] hover:shadow-[0_0_25px_rgba(0,242,255,0.5)]"><FileBarChart className="w-4 h-4" />Engineering Design Report (PDF)</a>
        </div>
      </div>

      {/* Lightbox */}
      {isLightboxOpen && project.images && project.images.length > 0 && (
        <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4">
          <button onClick={() => setIsLightboxOpen(false)} className="absolute top-6 right-6 text-white/50 hover:text-white bg-white/10 p-2 rounded-full transition-colors z-[210]"><X className="w-8 h-8" /></button>
          <div className="relative w-full h-full flex items-center justify-center">
            <Image src={project.images[currentImageIndex]} alt={`${project.title} - Lightbox`} width={3000} height={2000} className="max-w-full max-h-full object-contain" quality={100} />
            {project.images.length > 1 && (
              <>
                <button onClick={handlePrev} className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/50 p-4 rounded-full text-[#00F2FF] border border-[#00F2FF]/50 hover:bg-[#00F2FF]/20 transition-colors z-[210]"><ChevronLeft className="w-8 h-8" /></button>
                <button onClick={handleNext} className="absolute right-6 top-1/2 -translate-y-1/2 bg-black/50 p-4 rounded-full text-[#00F2FF] border border-[#00F2FF]/50 hover:bg-[#00F2FF]/20 transition-colors z-[210]"><ChevronRight className="w-8 h-8" /></button>
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-[210]">
                  {project.images.map((_, i) => <button key={i} onClick={() => setCurrentImageIndex(i)} className={`w-3 h-3 rounded-full transition-all ${i === currentImageIndex ? "bg-[#00F2FF] shadow-[0_0_12px_rgba(0,242,255,1)]" : "bg-white/30 hover:bg-white/60"}`} />)}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function CaseStudies() {
  const { projects } = useAdmin();
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setRefreshKey(prev => prev + 1);
  }, [projects]);

  const validProjects = projects.filter(p => p.title || p.focus || p.components || p.automation);

  return (
    <Section id="projects">
      <SectionHeading>Technical Case Studies</SectionHeading>
      <div className="flex flex-col gap-16 relative">
          {validProjects.map((project, idx) => (
            <ProjectCard key={project.id} project={project} idx={idx} />
          ))}
          {validProjects.length === 0 && (
            <div className="text-center py-24 font-mono text-[#94A3B8]/30 text-xs tracking-widest uppercase border border-dashed border-[#00F2FF]/10 rounded-2xl">
              No case studies published. Add projects via the Admin Dashboard.
            </div>
          )}
        </div>
    </Section>
  );
}
