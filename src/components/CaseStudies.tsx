"use client";

import { useState, useEffect } from "react";
import { Section, SectionHeading } from "./Section";
import { FileText, FileBarChart, ChevronLeft, ChevronRight, X, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useAdmin, CaseProject } from "@/context/AdminContext";

import { motion, AnimatePresence } from "framer-motion";

function ProjectModal({ project, onClose }: { project: CaseProject; onClose: () => void }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showReportList, setShowReportList] = useState(false);

  const handleDownload = async (url: string, filename: string, type: 'zip' | 'pdf') => {
    if (type === 'zip') setDownloadingZip(true);
    else setDownloadingPdf(true);

    try {
      // Simulate a small delay to allow the UI to update
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (url.startsWith('data:')) {
        const res = await fetch(url);
        const blob = await res.blob();
        const objectUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = objectUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => window.URL.revokeObjectURL(objectUrl), 1000);
      } else {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Download failed', error);
      alert('Download failed. The file may be invalid or too large.');
    } finally {
      if (type === 'zip') setDownloadingZip(false);
      else setDownloadingPdf(false);
    }
  };

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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl bg-[#020617] border border-[#00F2FF]/30 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,242,255,0.15)] flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-[#00F2FF] bg-black/50 p-2 rounded-full transition-all z-[210] border border-white/10"><X className="w-5 h-5" /></button>

        <div className="flex flex-col md:flex-row h-full overflow-y-auto">
          {/* Visual Layer */}
          <div className="w-full md:w-1/2 relative min-h-[300px] bg-[#000814] border-b md:border-b-0 md:border-r border-[#00F2FF]/10 flex items-center justify-center group/carousel">
            {project.images && project.images.length > 0 ? (
              <>
                <Image 
                  src={project.images[currentImageIndex]} 
                  alt={`${project.title} - Render ${currentImageIndex + 1}`} 
                  width={800} 
                  height={600} 
                  className="w-full h-full object-contain p-4 transition-all duration-700"
                  priority
                />
                {project.images.length > 1 && (
                  <>
                    <button onClick={handlePrev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 p-2 rounded-full text-[#00F2FF] border border-[#00F2FF]/20 opacity-0 group-hover/carousel:opacity-100 transition-all hover:bg-[#00F2FF] hover:text-black z-10"><ChevronLeft className="w-5 h-5" /></button>
                    <button onClick={handleNext} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 p-2 rounded-full text-[#00F2FF] border border-[#00F2FF]/20 opacity-0 group-hover/carousel:opacity-100 transition-all hover:bg-[#00F2FF] hover:text-black z-10"><ChevronRight className="w-5 h-5" /></button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                      {project.images.map((_, i) => (
                        <button key={i} onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(i); }} className={`w-2 h-2 rounded-full transition-all ${i === currentImageIndex ? "bg-[#00F2FF] w-4" : "bg-white/20 hover:bg-white/40"}`} />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="text-center">
                <span className="font-mono text-xs text-[#00F2FF]/30 tracking-widest uppercase">No Visual Data</span>
              </div>
            )}
          </div>

          {/* Content Layer */}
          <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col">
            <h2 className="text-2xl font-bold tracking-tight text-white mb-6">
              {project.title}
            </h2>

            <div className="space-y-5 mb-8 flex-grow">
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[10px] tracking-widest text-[#00F2FF]/50 uppercase">System Focus</span>
                <p className="text-sm text-white/80 leading-relaxed font-light">{project.focus}</p>
              </div>
              
              <div className="flex flex-col gap-1 pt-3 border-t border-white/5">
                <span className="font-mono text-[10px] tracking-widest text-[#00F2FF]/40 uppercase">Mechanics</span>
                <p className="text-sm text-white/60 leading-relaxed">{project.components}</p>
              </div>
              
              <div className="flex flex-col gap-1 pt-3 border-t border-white/5">
                <span className="font-mono text-[10px] tracking-widest text-[#00F2FF]/40 uppercase">Automation</span>
                <p className="text-sm text-white/60 leading-relaxed">{project.automation}</p>
              </div>
            </div>

            {/* Action Bay */}
            <div className="mt-auto flex flex-col gap-3">
              {project.zipUrl && (project.zipUrl.startsWith("http") || project.zipUrl.startsWith("data:")) ? (
                <button 
                  onClick={() => handleDownload(project.zipUrl!, `${project.title.replace(/\s+/g, '_')}_Technical_Assets.zip`, 'zip')}
                  disabled={downloadingZip}
                  className="w-full flex items-center justify-between px-5 py-4 bg-[#00F2FF]/10 border border-[#00F2FF]/30 rounded-xl hover:bg-[#00F2FF]/20 transition-all group/btn disabled:opacity-70 disabled:cursor-wait"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-black/40 rounded-lg text-[#00F2FF] border border-[#00F2FF]/20">
                      {downloadingZip ? (
                        <div className="w-5 h-5 border-2 border-[#00F2FF]/30 border-t-[#00F2FF] rounded-full animate-spin" />
                      ) : (
                        <FileBarChart className="w-5 h-5" />
                      )}
                    </div>
                    <div className="text-left">
                      <p className="font-mono text-sm text-white tracking-widest uppercase">{downloadingZip ? "Preparing..." : "Technical Assets"}</p>
                      <p className="font-mono text-[10px] text-[#00F2FF]/70 uppercase">{downloadingZip ? "Converting to file..." : "Download ZIP Package"}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/40 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              ) : null}

              {/* Engineering Reports Entry Point */}
              {(project.pdfUrl || (project.reports && project.reports.length > 0)) ? (
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => setShowReportList(!showReportList)}
                    className={`w-full flex items-center justify-between px-5 py-4 border transition-all group/pdf ${
                      showReportList 
                        ? "bg-[#00F2FF] text-black border-[#00F2FF] rounded-t-xl" 
                        : "bg-white/5 text-white border-white/10 rounded-xl hover:bg-[#00F2FF]/10"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2.5 rounded-lg ${showReportList ? "bg-black/10" : "bg-black/20"}`}>
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <p className="font-mono text-sm tracking-widest uppercase">Engineering Reports</p>
                        <p className={`font-mono text-[10px] uppercase ${showReportList ? "text-black/60" : "opacity-70"}`}>
                          {(project.reports?.length || 0) + (project.pdfUrl ? 1 : 0)} Available Dossiers
                        </p>
                      </div>
                    </div>
                    <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${showReportList ? "rotate-180" : ""}`} />
                  </button>

                  {/* Expanded Report List */}
                  {showReportList && (
                    <div className="flex flex-col gap-2 p-2 bg-black/40 border-x border-b border-[#00F2FF]/30 rounded-b-xl animate-in slide-in-from-top-2 duration-200">
                      {/* Legacy PDF */}
                      {project.pdfUrl && (
                        <button 
                          onClick={() => setPreviewUrl(project.pdfUrl!)}
                          className="w-full flex items-center justify-between px-4 py-3 bg-white/5 border border-white/5 rounded-lg hover:bg-white/10 transition-all group/rep"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="w-4 h-4 text-[#00F2FF]" />
                            <span className="font-mono text-[11px] tracking-widest uppercase text-white/80">Main Technical Dossier</span>
                          </div>
                          <ChevronRight className="w-4 h-4 opacity-30 group-hover/rep:translate-x-1 transition-transform" />
                        </button>
                      )}

                      {/* Project Reports */}
                      {(project.reports || []).map((report) => (
                        <button 
                          key={report.id}
                          onClick={() => setPreviewUrl(report.url)}
                          className="w-full flex items-center justify-between px-4 py-3 bg-white/5 border border-white/5 rounded-lg hover:bg-white/10 transition-all group/rep"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="w-4 h-4 text-[#00F2FF]" />
                            <span className="font-mono text-[11px] tracking-widest uppercase text-white/80">{report.title}</span>
                          </div>
                          <ChevronRight className="w-4 h-4 opacity-30 group-hover/rep:translate-x-1 transition-transform" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* PDF Preview Overlay */}
        <AnimatePresence>
          {previewUrl && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-[250] bg-black/95 flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-[#00F2FF]/20">
                <span className="font-mono text-xs text-[#00F2FF] tracking-widest uppercase">Report Preview</span>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => handleDownload(previewUrl, "Engineering_Report.pdf", "pdf")}
                    className="flex items-center gap-2 px-4 py-1.5 bg-[#00F2FF] text-black font-mono text-[10px] font-bold uppercase rounded-lg hover:bg-[#00F2FF]/80 transition-all"
                  >
                    Download PDF
                  </button>
                  <button onClick={() => setPreviewUrl(null)} className="text-white/50 hover:text-white"><X className="w-5 h-5" /></button>
                </div>
              </div>
              <div className="flex-1 w-full bg-white overflow-hidden">
                <iframe 
                  src={previewUrl} 
                  className="w-full h-full border-none"
                  title="PDF Preview"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

function ProjectCard({ project, idx, onOpen }: { project: CaseProject; idx: number; onOpen: () => void }) {
  return (
    <div 
      className="relative flex flex-col border border-[#00F2FF]/10 bg-[#020617]/80 backdrop-blur-md rounded-2xl hover:border-[#00F2FF]/50 hover:shadow-[0_0_20px_rgba(0,242,255,0.15)] transition-all duration-300 group overflow-hidden cursor-pointer h-full"
      onClick={onOpen}
    >
      <div className="relative w-full aspect-square bg-[#000814] overflow-hidden border-b border-[#00F2FF]/10">
        {project.images && project.images.length > 0 ? (
          <Image 
            src={project.images[0]} 
            alt={project.title} 
            fill
            className="object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#020617]/50">
             <span className="font-mono text-[10px] text-[#00F2FF]/30 tracking-widest uppercase">No Image</span>
          </div>
        )}
        <div className="absolute top-3 left-3 z-10">
           <span className="px-2 py-1 bg-black/80 border border-[#00F2FF]/30 rounded-md font-mono text-[8px] tracking-widest text-[#00F2FF] uppercase backdrop-blur-md">
             PROJ_{idx + 1}
           </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow justify-between bg-gradient-to-t from-black/60 to-transparent">
        <h3 className="text-sm font-bold tracking-tight text-white group-hover:text-[#00F2FF] transition-colors duration-300 line-clamp-2 mb-4">
          {project.title}
        </h3>
        
        <button className="flex items-center justify-between w-full text-left font-mono text-[10px] tracking-widest text-[#00F2FF]/70 group-hover:text-[#00F2FF] uppercase transition-colors">
          <span>View Project</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}

export function CaseStudies() {
  const { projects } = useAdmin();
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedProject, setSelectedProject] = useState<CaseProject | null>(null);

  useEffect(() => {
    setRefreshKey(prev => prev + 1);
  }, [projects]);

  const validProjects = projects.filter(p => p.title || p.focus || p.components || p.automation);

  return (
    <Section id="projects">
      <SectionHeading>Technical Case Studies</SectionHeading>
      
      {/* 4-Column Grid for Desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {validProjects.map((project, idx) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              idx={idx} 
              onOpen={() => setSelectedProject(project)}
            />
          ))}
          {validProjects.length === 0 && (
            <div className="col-span-full text-center py-24 font-mono text-[#94A3B8]/30 text-xs tracking-widest uppercase border border-dashed border-[#00F2FF]/10 rounded-2xl">
              No case studies published. Add projects via the Admin Dashboard.
            </div>
          )}
      </div>

      {/* Modal Overlay */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal 
            project={selectedProject} 
            onClose={() => setSelectedProject(null)} 
          />
        )}
      </AnimatePresence>
    </Section>
  );
}

