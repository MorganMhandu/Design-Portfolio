"use client";

import { useState, useEffect } from "react";
import { Section, SectionHeading } from "./Section";
import { FileText, FileBarChart, ChevronLeft, ChevronRight, X, Maximize2, Download } from "lucide-react";
import Image from "next/image";
import { useAdmin, CaseProject } from "@/context/AdminContext";
import { motion, AnimatePresence } from "framer-motion";

function ProjectModal({ project, onClose }: { project: CaseProject; onClose: () => void }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? project.images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % project.images.length);
  };

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
        className="relative w-full max-w-6xl max-h-[90vh] bg-[#020617] border border-[#00F2FF]/20 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,242,255,0.15)] flex flex-col md:flex-row"
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-white/50 hover:text-white bg-white/5 p-2 rounded-full transition-colors z-[220]"><X className="w-6 h-6" /></button>

        {/* Left: Visual Area */}
        <div className="w-full md:w-3/5 h-[300px] md:h-auto bg-black relative group/carousel border-b md:border-b-0 md:border-r border-[#00F2FF]/10">
          {project.images && project.images.length > 0 ? (
            <>
              <Image 
                src={project.images[currentImageIndex]} 
                alt={project.title} 
                fill
                className="object-contain"
                priority
              />
              {project.images.length > 1 && (
                <>
                  <button onClick={handlePrev} className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/60 p-3 rounded-full text-[#00F2FF] border border-[#00F2FF]/20 hover:bg-[#00F2FF] hover:text-black transition-all z-10"><ChevronLeft className="w-6 h-6" /></button>
                  <button onClick={handleNext} className="absolute right-6 top-1/2 -translate-y-1/2 bg-black/60 p-3 rounded-full text-[#00F2FF] border border-[#00F2FF]/20 hover:bg-[#00F2FF] hover:text-black transition-all z-10"><ChevronRight className="w-6 h-6" /></button>
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
                    {project.images.map((_, i) => (
                      <button key={i} onClick={() => setCurrentImageIndex(i)} className={`w-2.5 h-2.5 rounded-full transition-all ${i === currentImageIndex ? "bg-[#00F2FF] w-8" : "bg-white/20 hover:bg-white/40"}`} />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#00F2FF]/20 font-mono text-sm tracking-widest uppercase">No Visual Data</div>
          )}
        </div>

        {/* Right: Content Area */}
        <div className="w-full md:w-2/5 p-8 md:p-12 overflow-y-auto flex flex-col">
          <div className="mb-8">
            <span className="font-mono text-xs tracking-[0.3em] text-[#00F2FF]/60 uppercase mb-4 block">Case_Study_Details</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight bg-gradient-to-r from-white to-[#94A3B8] bg-clip-text text-transparent">{project.title}</h2>
          </div>

          <div className="space-y-8 mb-12">
            <div className="flex flex-col gap-2">
              <span className="font-mono text-[10px] tracking-widest text-[#00F2FF]/50 uppercase">System Focus</span>
              <p className="text-sm text-white/70 leading-relaxed font-light">{project.focus}</p>
            </div>
            
            <div className="grid grid-cols-1 gap-6 pt-6 border-t border-white/5">
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[10px] tracking-widest text-[#00F2FF]/50 uppercase">Mechanical Components</span>
                <p className="text-sm text-white/60 leading-relaxed">{project.components}</p>
              </div>
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[10px] tracking-widest text-[#00F2FF]/50 uppercase">Automation Stack</span>
                <p className="text-sm text-white/60 leading-relaxed">{project.automation}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-auto space-y-4 pt-8 border-t border-white/5">
            <button className="w-full flex items-center justify-between px-6 py-4 bg-[#00F2FF]/10 border border-[#00F2FF]/30 rounded-2xl hover:bg-[#00F2FF] hover:text-black transition-all group/zip">
              <div className="flex items-center gap-4">
                <Download className="w-5 h-5" />
                <div className="text-left">
                  <p className="font-mono text-xs font-bold uppercase tracking-widest">Project Assets</p>
                  <p className="text-[10px] opacity-70 uppercase tracking-tighter">CAD + Renders (ZIP)</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 opacity-30 group-hover/zip:translate-x-1 transition-all" />
            </button>

            <button className="w-full flex items-center justify-between px-6 py-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/30 transition-all group/pdf">
              <div className="flex items-center gap-4 text-white">
                <FileText className="w-5 h-5" />
                <div className="text-left">
                  <p className="font-mono text-xs font-bold uppercase tracking-widest">Technical Reports</p>
                  <p className="text-[10px] opacity-50 uppercase tracking-tighter">Engineering Documentation (PDF)</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 opacity-20 group-hover/pdf:translate-x-1 transition-all" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function ProjectCard({ project, idx }: { project: CaseProject; idx: number }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: idx * 0.1 }}
        onClick={() => setIsModalOpen(true)}
        className="group relative aspect-square bg-[#020617] border border-[#00F2FF]/10 rounded-2xl overflow-hidden cursor-pointer hover:border-[#00F2FF]/40 transition-all duration-500 shadow-xl"
      >
        {/* Background Render */}
        <div className="absolute inset-0 z-0">
          {project.images && project.images[0] ? (
            <Image 
              src={project.images[0]} 
              alt={project.title} 
              fill
              className="object-cover opacity-50 group-hover:opacity-80 group-hover:scale-110 transition-all duration-700"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-black/40">
              <span className="font-mono text-[10px] text-[#00F2FF]/20 uppercase tracking-widest">No Visual</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 z-10 p-5 flex flex-col justify-end">
          <span className="font-mono text-[9px] tracking-[0.3em] text-[#00F2FF]/60 uppercase mb-2">PROJ_{idx + 1}</span>
          <h3 className="text-sm font-bold text-white mb-4 line-clamp-2 leading-snug group-hover:text-[#00F2FF] transition-colors">
            {project.title}
          </h3>
          
          <div className="flex items-center gap-2 text-[10px] font-mono text-[#00F2FF] uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            View Project <Maximize2 className="w-3 h-3" />
          </div>
        </div>

        {/* Hover Border Glow */}
        <div className="absolute inset-0 border border-[#00F2FF]/0 group-hover:border-[#00F2FF]/40 transition-colors pointer-events-none rounded-2xl" />
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <ProjectModal 
            project={project} 
            onClose={() => setIsModalOpen(false)} 
          />
        )}
      </AnimatePresence>
    </>
  );
}

export function CaseStudies() {
  const { projects } = useAdmin();
  const validProjects = projects.filter(p => p.title || p.focus || p.components || p.automation);

  return (
    <Section id="projects">
      <SectionHeading>Technical Case Studies</SectionHeading>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 relative">
          {validProjects.map((project, idx) => (
            <ProjectCard key={project.id} project={project} idx={idx} />
          ))}
          {validProjects.length === 0 && (
            <div className="col-span-full text-center py-24 font-mono text-[#94A3B8]/30 text-xs tracking-widest uppercase border border-dashed border-[#00F2FF]/10 rounded-2xl">
              No case studies published.
            </div>
          )}
        </div>
    </Section>
  );
}
