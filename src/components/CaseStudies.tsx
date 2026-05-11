"use client";

import { useState, useEffect } from "react";
import { Section, SectionHeading } from "./Section";
import { FileText, FileBarChart, ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useAdmin, CaseProject } from "@/context/AdminContext";

import { AnimatePresence, motion } from "framer-motion";

function ProjectModal({ project, idx, onClose }: { project: CaseProject; idx: number; onClose: () => void }) {
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
        className="relative w-full max-w-5xl max-h-[90vh] bg-[#020617] border border-[#00F2FF]/20 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,242,255,0.15)] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-white/50 hover:text-[#00F2FF] bg-white/5 p-2 rounded-full transition-all z-[210] border border-white/10"><X className="w-6 h-6" /></button>

        {/* Left: Visual Area */}
        <div className="w-full md:w-3/5 h-[300px] md:h-auto bg-black relative group/carousel border-b md:border-b-0 md:border-r border-[#00F2FF]/10">
          {project.images && project.images.length > 0 ? (
            <>
              <Image 
                src={project.images[currentImageIndex]} 
                alt={project.title} 
                width={1200} 
                height={900} 
                className="w-full h-full object-contain p-4 md:p-8"
              />
              {project.images.length > 1 && (
                <>
                  <button onClick={handlePrev} className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/60 p-3 rounded-full text-[#00F2FF] border border-[#00F2FF]/30 hover:bg-[#00F2FF] hover:text-black transition-all"><ChevronLeft className="w-6 h-6" /></button>
                  <button onClick={handleNext} className="absolute right-6 top-1/2 -translate-y-1/2 bg-black/60 p-3 rounded-full text-[#00F2FF] border border-[#00F2FF]/30 hover:bg-[#00F2FF] hover:text-black transition-all"><ChevronRight className="w-6 h-6" /></button>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center opacity-20">
               <span className="font-mono text-xs tracking-widest uppercase text-[#00F2FF]">No Simulation Data</span>
            </div>
          )}
        </div>

        {/* Right: Info Area */}
        <div className="w-full md:w-2/5 p-8 md:p-10 flex flex-col overflow-y-auto">
          <div className="mb-8">
            <span className="font-mono text-[10px] tracking-[0.3em] text-[#00F2FF]/60 uppercase mb-2 block">PROJECT_ID_{idx + 1}</span>
            <h2 className="text-3xl font-bold tracking-tight text-white mb-4 leading-tight">{project.title}</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-[#00F2FF] to-transparent rounded-full" />
          </div>

          <div className="space-y-8 flex-grow">
            <div className="flex flex-col gap-2">
              <span className="font-mono text-[10px] tracking-widest text-[#00F2FF]/40 uppercase">System Focus & Impact</span>
              <p className="text-sm text-white/70 leading-relaxed font-light">{project.focus}</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[10px] tracking-widest text-[#00F2FF]/40 uppercase">Mechanical Infrastructure</span>
                <p className="text-xs text-white/50 leading-relaxed">{project.components}</p>
              </div>
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[10px] tracking-widest text-[#00F2FF]/40 uppercase">Automation Strategy</span>
                <p className="text-xs text-white/50 leading-relaxed">{project.automation}</p>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/5 flex flex-col gap-3">
             <button className="w-full group/btn relative overflow-hidden px-6 py-4 bg-[#00F2FF]/5 border border-[#00F2FF]/20 rounded-2xl transition-all hover:border-[#00F2FF]/50 hover:bg-[#00F2FF]/10">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-black/40 rounded-xl border border-[#00F2FF]/10 text-[#00F2FF]">
                       <FileBarChart className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                       <p className="font-mono text-xs text-white uppercase tracking-wider">Technical Package</p>
                       <p className="font-mono text-[9px] text-[#00F2FF]/60 uppercase">ZIP: CAD + SIMULATION</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#00F2FF]/30 group-hover/btn:translate-x-1 transition-transform" />
               </div>
             </button>
             <button className="w-full flex items-center justify-center gap-3 py-4 bg-[#00F2FF] text-black rounded-2xl text-xs font-mono tracking-[0.2em] uppercase font-bold hover:bg-[#00F2FF]/80 transition-all shadow-[0_0_30px_rgba(0,242,255,0.3)]">
                <FileText className="w-5 h-5" /> View Engineering Report
             </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ProjectCard({ project, idx, onOpen }: { project: CaseProject; idx: number; onOpen: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.1 }}
      className="group relative aspect-square bg-[#020617] border border-[#00F2FF]/10 rounded-2xl overflow-hidden cursor-pointer hover:border-[#00F2FF]/40 transition-all"
      onClick={onOpen}
    >
      {project.images && project.images.length > 0 ? (
        <Image 
          src={project.images[0]} 
          alt={project.title} 
          width={400} 
          height={400} 
          className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center opacity-10">
           <span className="font-mono text-[10px] uppercase text-[#00F2FF]">No Render</span>
        </div>
      )}
      
      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#000814] via-[#000814]/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
      
      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        <span className="font-mono text-[8px] tracking-[0.3em] text-[#00F2FF]/60 uppercase mb-2">PROJ_{idx + 1}</span>
        <h3 className="text-sm font-bold text-white group-hover:text-[#00F2FF] transition-colors line-clamp-2">{project.title}</h3>
        
        <div className="mt-4 overflow-hidden h-0 group-hover:h-8 transition-all duration-300">
           <div className="flex items-center gap-2 text-[9px] font-mono tracking-widest text-[#00F2FF] uppercase">
             View Project <ChevronRight className="w-3 h-3" />
           </div>
        </div>
      </div>
    </motion.div>
  );
}

export function CaseStudies() {
  const { projects } = useAdmin();
  const [selectedProject, setSelectedProject] = useState<{ project: CaseProject, idx: number } | null>(null);

  const validProjects = projects.filter(p => p.title || p.focus || p.components || p.automation);

  return (
    <Section id="projects">
      <SectionHeading>Technical Case Studies</SectionHeading>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 relative">
          {validProjects.map((project, idx) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              idx={idx} 
              onOpen={() => setSelectedProject({ project, idx })} 
            />
          ))}
          {validProjects.length === 0 && (
            <div className="col-span-full text-center py-24 font-mono text-[#94A3B8]/30 text-xs tracking-widest uppercase border border-dashed border-[#00F2FF]/10 rounded-2xl">
              No case studies published. Add projects via the Admin Dashboard.
            </div>
          )}
      </div>

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal 
            project={selectedProject.project} 
            idx={selectedProject.idx} 
            onClose={() => setSelectedProject(null)} 
          />
        )}
      </AnimatePresence>
    </Section>
  );
}
