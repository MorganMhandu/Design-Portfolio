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
    <div className="relative flex flex-col border border-[#00F2FF]/10 bg-[#020617]/80 backdrop-blur-md rounded-2xl hover:border-[#00F2FF]/40 transition-all duration-500 group overflow-hidden shadow-2xl">
      
      {/* 1. VISUAL LAYER (Carousel) */}
      <div className="relative w-full h-[300px] bg-[#000814] overflow-hidden group/carousel">
        {project.images && project.images.length > 0 ? (
          <>
            <div className="relative w-full h-full flex items-center justify-center cursor-pointer" onClick={() => setIsLightboxOpen(true)}>
              <Image 
                src={project.images[currentImageIndex]} 
                alt={`${project.title} - Render ${currentImageIndex + 1}`} 
                width={800} 
                height={600} 
                className="w-full h-full object-contain opacity-100 transition-all duration-700 group-hover:scale-105"
                priority={idx < 2}
                key={`${project.id}-${currentImageIndex}`}
              />
            </div>
            
            {project.images.length > 1 && (
              <>
                <button onClick={handlePrev} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 p-2 rounded-full text-[#00F2FF] border border-[#00F2FF]/20 opacity-0 group-hover/carousel:opacity-100 transition-all hover:bg-[#00F2FF] hover:text-black z-10"><ChevronLeft className="w-5 h-5" /></button>
                <button onClick={handleNext} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 p-2 rounded-full text-[#00F2FF] border border-[#00F2FF]/20 opacity-0 group-hover/carousel:opacity-100 transition-all hover:bg-[#00F2FF] hover:text-black z-10"><ChevronRight className="w-5 h-5" /></button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {project.images.map((_, i) => (
                    <button key={i} onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(i); }} className={`w-2 h-2 rounded-full transition-all ${i === currentImageIndex ? "bg-[#00F2FF] w-4" : "bg-white/20 hover:bg-white/40"}`} />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#020617]/50">
             <span className="font-mono text-xs text-[#00F2FF]/30 tracking-widest uppercase">No Visual Data</span>
          </div>
        )}
      </div>

      {/* 2. CONTENT LAYER */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-[#00F2FF] transition-colors duration-300">
            {project.title}
          </h3>
          <span className="font-mono text-[10px] tracking-[0.2em] text-[#00F2FF]/40 uppercase mt-1">PROJ_{idx + 1}</span>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[10px] tracking-widest text-[#00F2FF]/50 uppercase">System Focus</span>
            <p className="text-sm text-white/70 leading-relaxed font-light line-clamp-2">{project.focus}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/5">
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[10px] tracking-widest text-[#00F2FF]/40 uppercase">Mechanics</span>
              <p className="text-xs text-white/50 leading-tight truncate">{project.components}</p>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[10px] tracking-widest text-[#00F2FF]/40 uppercase">Automation</span>
              <p className="text-xs text-white/50 leading-tight truncate">{project.automation}</p>
            </div>
          </div>
        </div>

        {/* 3. REFINED ACTION BAY */}
        <div className="mt-auto flex flex-col gap-3">
          <button className="w-full flex items-center justify-between px-5 py-4 bg-[#00F2FF]/5 border border-[#00F2FF]/10 rounded-xl hover:bg-[#00F2FF]/10 hover:border-[#00F2FF]/30 transition-all group/btn">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-black/30 rounded-lg text-[#00F2FF] border border-[#00F2FF]/10">
                <FileBarChart className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="font-mono text-xs text-white tracking-widest uppercase">Technical Assets</p>
                <p className="font-mono text-[9px] text-[#00F2FF]/50 uppercase">Download ZIP Package</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-white/20 group-hover/btn:translate-x-1 transition-transform" />
          </button>

          <button className="w-full flex items-center justify-between px-5 py-4 bg-white/5 border border-white/10 rounded-xl hover:bg-[#00F2FF] hover:text-black hover:border-[#00F2FF] transition-all group/pdf">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-black/20 rounded-lg group-hover/pdf:bg-black/10">
                <FileText className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="font-mono text-xs tracking-widest uppercase">Engineering Reports</p>
                <p className="font-mono text-[9px] opacity-60 uppercase">View Technical PDF</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 opacity-20 group-hover/pdf:translate-x-1 transition-transform" />
          </button>
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
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 relative">
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
