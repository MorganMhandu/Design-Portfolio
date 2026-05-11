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
    <div className="relative flex flex-col border border-[#00F2FF]/20 bg-[#020617]/40 backdrop-blur-md rounded-2xl hover:border-[#00F2FF]/50 transition-all duration-500 group overflow-hidden">
      
      {/* 1. VISUAL LAYER (Carousel) */}
      <div className="relative w-full h-[280px] bg-[#000814] overflow-hidden border-b border-[#00F2FF]/10 group/carousel">
        {project.images && project.images.length > 0 ? (
          <>
            <div className="relative w-full h-full flex items-center justify-center cursor-pointer" onClick={() => setIsLightboxOpen(true)}>
              <Image 
                src={project.images[currentImageIndex]} 
                alt={`${project.title} - Render ${currentImageIndex + 1}`} 
                width={800} 
                height={600} 
                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
                priority={idx < 2}
                key={`${project.id}-${currentImageIndex}`}
              />
              {/* Technical Scanline Overlay */}
              <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(0,242,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,242,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />
            </div>
            
            {project.images.length > 1 && (
              <>
                <button onClick={handlePrev} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 p-2 rounded-full text-[#00F2FF] border border-[#00F2FF]/30 opacity-0 group-hover/carousel:opacity-100 transition-all hover:bg-[#00F2FF] hover:text-black z-10"><ChevronLeft className="w-5 h-5" /></button>
                <button onClick={handleNext} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 p-2 rounded-full text-[#00F2FF] border border-[#00F2FF]/30 opacity-0 group-hover/carousel:opacity-100 transition-all hover:bg-[#00F2FF] hover:text-black z-10"><ChevronRight className="w-5 h-5" /></button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                  {project.images.map((_, i) => (
                    <button key={i} onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(i); }} className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentImageIndex ? "bg-[#00F2FF] w-4" : "bg-white/20 hover:bg-white/40"}`} />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#020617]">
            <div className="w-12 h-12 rounded-full border border-dashed border-[#00F2FF]/20 flex items-center justify-center opacity-30">
               <span className="font-mono text-[8px] text-[#00F2FF]">EMPTY</span>
            </div>
          </div>
        )}
        
        {/* Project Type Badge */}
        <div className="absolute top-4 left-4 z-10">
           <span className="px-3 py-1 bg-black/80 border border-[#00F2FF]/30 rounded-lg font-mono text-[9px] tracking-widest text-[#00F2FF] uppercase backdrop-blur-md">
             Case_Study_{idx + 1}
           </span>
        </div>
      </div>

      {/* 2. CONTENT LAYER */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold mb-4 tracking-wide bg-gradient-to-r from-white to-[#94A3B8] bg-clip-text text-transparent group-hover:to-[#00F2FF] transition-all duration-500">
          {project.title}
        </h3>

        <div className="space-y-4 mb-6">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[9px] tracking-widest text-[#00F2FF]/50 uppercase">Primary Focus</span>
            <p className="text-xs text-white/70 leading-relaxed font-light">{project.focus}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5">
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[9px] tracking-widest text-[#00F2FF]/50 uppercase">Mechanics</span>
              <p className="text-[10px] text-white/50 leading-tight truncate">{project.components}</p>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[9px] tracking-widest text-[#00F2FF]/50 uppercase">Automation</span>
              <p className="text-[10px] text-white/50 leading-tight truncate">{project.automation}</p>
            </div>
          </div>
        </div>

        {/* 3. TECHNICAL SOURCE BAY (Consolidated) */}
        <div className="mt-auto pt-6 border-t border-white/5 space-y-4">
          <button className="w-full group/zip relative overflow-hidden px-4 py-3 bg-gradient-to-r from-[#00F2FF]/10 to-transparent border border-[#00F2FF]/20 rounded-xl transition-all duration-300 hover:border-[#00F2FF]/50 hover:from-[#00F2FF]/20">
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-black/40 rounded-lg border border-[#00F2FF]/20 text-[#00F2FF] group-hover/zip:scale-110 transition-transform">
                   <FileText className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="font-mono text-[10px] text-white tracking-widest uppercase">Technical Package</p>
                  <p className="font-mono text-[8px] text-[#00F2FF]/60 uppercase">ZIP: CAD + Renders + Specs</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#00F2FF]/40 group-hover/zip:translate-x-1 transition-transform" />
            </div>
          </button>

          <div className="grid grid-cols-2 gap-3">
            <a href="#" className="flex items-center justify-center gap-2 py-2.5 bg-white/5 border border-white/10 rounded-lg text-[9px] font-mono tracking-widest uppercase text-white/60 hover:text-[#00F2FF] hover:border-[#00F2FF]/40 transition-all">
              <FileBarChart className="w-3.5 h-3.5" /> Specs
            </a>
            <a href="#" className="flex items-center justify-center gap-2 py-2.5 bg-[#00F2FF] text-black rounded-lg text-[9px] font-mono tracking-widest uppercase font-bold hover:bg-[#00F2FF]/80 transition-all shadow-[0_0_15px_rgba(0,242,255,0.2)]">
               Design Report
            </a>
          </div>
        </div>
      </div>

      {/* Lightbox remains same but updated IDs/Keys */}
      {isLightboxOpen && project.images && project.images.length > 0 && (
        <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4 backdrop-blur-xl">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
          {validProjects.map((project, idx) => (
            <ProjectCard key={project.id} project={project} idx={idx} />
          ))}
          {validProjects.length === 0 && (
            <div className="col-span-full text-center py-24 font-mono text-[#94A3B8]/30 text-xs tracking-widest uppercase border border-dashed border-[#00F2FF]/10 rounded-2xl">
              No case studies published. Add projects via the Admin Dashboard.
            </div>
          )}
        </div>
    </Section>
  );
}
