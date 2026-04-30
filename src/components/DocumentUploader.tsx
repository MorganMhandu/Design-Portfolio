import { useState, useRef } from "react";
import { FileUp } from "lucide-react";

type DocumentUploaderProps = {
  folder: string;
  onUploadComplete: (metadata: { fileName: string; cloudUrl: string; fileType: string }) => void;
};

export function DocumentUploader({ folder, onUploadComplete }: DocumentUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const validTypes = [
      "application/pdf", 
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ];
    if (!validTypes.includes(file.type)) {
      alert("Invalid file type. Please upload .pdf, .docx, or .xlsx.");
      return;
    }

    setIsUploading(true);
    setProgress(10);

    const formData = new FormData();
    formData.append("files", file);
    formData.append("folder", folder);

    // Simulate progress while uploading to server
    const interval = setInterval(() => {
      setProgress((p) => (p < 90 ? p + 5 : p));
    }, 200);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      clearInterval(interval);
      setProgress(100);

      const data = await res.json();
      if (data.urls && data.urls.length > 0) {
        onUploadComplete({
          fileName: file.name,
          cloudUrl: data.urls[0],
          fileType: file.type.includes("pdf") ? "PDF" : file.type.includes("word") ? "DOCX" : "XLSX"
        });
      } else {
        throw new Error(data.error || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      clearInterval(interval);
      alert("Failed to upload document.");
    } finally {
      setIsUploading(false);
      setProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full relative">
      <input 
        type="file" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileChange}
        accept=".pdf,.docx,.xlsx"
      />
      
      {!isUploading ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-32 border-2 border-dashed border-[#00F2FF]/20 rounded-xl bg-black/40 flex flex-col items-center justify-center cursor-pointer hover:border-[#00F2FF]/50 transition-colors group"
        >
          <FileUp className="w-6 h-6 text-[#00F2FF]/50 group-hover:text-[#00F2FF] group-hover:-translate-y-1 transition-all duration-300" />
          <p className="mt-3 font-mono text-[10px] text-[#00F2FF]/60 uppercase tracking-widest group-hover:text-[#00F2FF]/90">
            Secure File Drop
          </p>
          <p className="mt-1 font-mono text-[8px] text-[#94A3B8]/60 uppercase tracking-widest">
            .pdf / .docx / .xlsx
          </p>
        </div>
      ) : (
        <div className="w-full h-32 border border-[#00F2FF]/30 rounded-xl bg-[#00F2FF]/5 flex flex-col items-center justify-center relative overflow-hidden">
          <svg className="w-12 h-12 transform -rotate-90">
            <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2" fill="none" className="text-[#00F2FF]/20" />
            <circle 
              cx="24" cy="24" r="20" 
              stroke="currentColor" 
              strokeWidth="2" 
              fill="none" 
              className="text-[#00F2FF] transition-all duration-300 ease-out"
              strokeDasharray={125.6}
              strokeDashoffset={125.6 - (progress / 100) * 125.6}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-[10px] font-bold text-[#00F2FF]">{progress}%</span>
          </div>
          <p className="mt-4 font-mono text-[9px] text-[#00F2FF] tracking-widest uppercase animate-pulse">
            {progress < 80 ? "Uploading..." : "Optimizing..."}
          </p>
        </div>
      )}
    </div>
  );
}
