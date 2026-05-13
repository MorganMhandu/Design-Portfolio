"use client";

import { useState } from "react";
import { Section, SectionHeading } from "./Section";
import { FileText, FileDown } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";

export function CV() {
  const { reports } = useAdmin();
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = async (url: string, filename: string) => {
    setDownloading(url);
    try {
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
        setTimeout(() => window.URL.revokeObjectURL(objectUrl), 5000);
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
    } finally {
      setDownloading(null);
    }
  };

  const validReports = reports.filter(r => r.title && r.fileName);

  return (
    <Section id="dossier">
      <div className="flex flex-col mb-4">
        <SectionHeading>Engineering Dossier</SectionHeading>
      </div>
        <div className="flex flex-col gap-3">
          {validReports.map((report, idx) => (
            <div key={report.id} className="flex flex-col md:flex-row items-center relative group overflow-hidden rounded-xl border border-[#00F2FF]/20 bg-[#020617]/80 backdrop-blur-md p-4 lg:p-5 transition-all duration-500 hover:border-[#00F2FF]/60 hover:shadow-[0_0_20px_rgba(0,242,255,0.1)]">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#00F2FF05_1px,transparent_1px),linear-gradient(to_bottom,#00F2FF05_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none opacity-30 group-hover:opacity-60 transition-opacity duration-500 z-0" />
              <div className="relative z-10 flex flex-col md:flex-row items-center w-full gap-6">
                <div className="flex items-center gap-4 shrink-0 w-full md:w-[25%]">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-black/40 border border-[#00F2FF]/30 group-hover:border-[#00F2FF]/80 group-hover:bg-[#00F2FF]/10 transition-all duration-300 shadow-[inset_0_0_10px_rgba(0,242,255,0.1)] shrink-0">
                    <FileText className="w-4 h-4 text-[#00F2FF]/80" />
                  </div>
                  <h3 className="text-sm font-bold tracking-tight text-heading uppercase truncate">{report.title}</h3>
                </div>
                <p className="font-mono text-[10px] leading-snug text-foreground/70 border-l border-[#00F2FF]/20 pl-4 py-0.5 flex-1 group-hover:border-[#00F2FF]/50 transition-colors duration-500 line-clamp-1">
                  {report.description}
                </p>
                <div className="shrink-0 w-full md:w-[20%]">
                  <button 
                    onClick={() => handleDownload(report.cloudUrl!, report.fileName || "Engineering_Report.pdf")}
                    disabled={downloading === report.cloudUrl}
                    className="flex items-center justify-between w-full p-2.5 rounded bg-[#00F2FF]/5 hover:bg-[#00F2FF]/15 border border-[#00F2FF]/20 hover:border-[#00F2FF]/50 transition-all group/dl cursor-pointer disabled:opacity-50"
                  >
                    <span className="font-mono text-[9px] text-[#00F2FF]/80 uppercase tracking-widest truncate max-w-[80%]">
                      {downloading === report.cloudUrl ? "Processing..." : (report.fileName || "Download")}
                    </span>
                    <FileDown className={`w-3.5 h-3.5 text-[#00F2FF] group-hover/dl:scale-110 transition-transform ${downloading === report.cloudUrl ? "animate-bounce" : ""}`} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {validReports.length === 0 && (
            <div className="col-span-full text-center py-24 font-mono text-[#94A3B8]/30 text-xs tracking-widest uppercase border border-dashed border-[#00F2FF]/10 rounded-2xl">
              No active reports at this time.
            </div>
          )}
        </div>
    </Section>
  );
}
