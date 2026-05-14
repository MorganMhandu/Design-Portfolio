import { useState, useEffect } from "react";
import { Section, SectionHeading } from "./Section";
import { Mail, Linkedin, Github, MapPin, X } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.394 0 12.03c0 2.12.553 4.189 1.605 6.046L0 24l6.111-1.603a11.845 11.845 0 005.936 1.587h.005c6.632 0 12.032-5.4 12.035-12.041a11.85 11.85 0 00-3.527-8.523z"/>
  </svg>
);

export function Contact() {
  const { settings } = useAdmin();
  const [showEmailFallback, setShowEmailFallback] = useState(false);

  useEffect(() => {
    if (showEmailFallback) {
      const timer = setTimeout(() => setShowEmailFallback(false), 10000);
      return () => clearTimeout(timer);
    }
  }, [showEmailFallback]);

  const handleEmailClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // 1. Primary Action: Try to open default mail client
    window.location.href = `mailto:${settings.contact.email}?subject=Engineering Inquiry`;
    // 2. Fallback UI: Show the Gmail deep link in case the primary action fails
    setShowEmailFallback(true);
  };

  const gmailDeepLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${settings.contact.email}&su=Engineering Inquiry`;

  return (
    <Section id="contact" className="pb-32">
      <div className="flex flex-col">
        <div className="flex flex-col mb-4">
          <SectionHeading>Engage</SectionHeading>
        </div>

        <div className="flex flex-col md:flex-row gap-16 md:gap-24">
          {/* Left Column */}
          <div className="md:w-1/2 flex flex-col border-l border-[#00F2FF]/20 pl-8 ml-0.5 overflow-visible">
            <p className="text-xl md:text-2xl text-foreground/90 font-light leading-relaxed mb-10">
              Open for collaborations, challenging projects, and engineering opportunities. Let&apos;s design the next generation of intelligent systems.
            </p>
            <ul className="flex flex-col gap-5 mb-8">
              <li className="flex items-center gap-4 text-foreground/80 hover:text-white transition-colors group">
                <a href={settings.contact.whatsapp} target="_blank" rel="noreferrer" className="flex items-center gap-4 w-full">
                  <div className="flex items-center justify-center w-8 h-8 rounded border border-[#00F2FF]/40 bg-[#00F2FF]/10 text-[#00F2FF] group-hover:bg-[#00F2FF]/20 transition-all shadow-[0_0_15px_rgba(0,242,255,0.2)] group-hover:shadow-[0_0_25px_rgba(0,242,255,0.4)] shrink-0 relative">
                    <WhatsAppIcon className="w-5 h-5 relative z-10" />
                    <div className="absolute inset-0 rounded-inherit animate-ping bg-[#00F2FF]/20 scale-125 opacity-0 group-hover:opacity-100" />
                    <div className="absolute inset-0 rounded-inherit animate-pulse bg-[#00F2FF]/10" />
                  </div>
                  <span className="font-mono text-sm font-bold tracking-wider text-white drop-shadow-[0_0_8px_rgba(0,242,255,0.3)]">{settings.contact.phone}</span>
                </a>
              </li>
              <li className="flex flex-col gap-2 transition-colors group">
                <a href={`mailto:${settings.contact.email}?subject=Engineering Inquiry`} onClick={() => setShowEmailFallback(true)} className="flex items-center gap-4 w-full text-left" title="Launch Secure Mail Interface">
                  <div className="flex items-center justify-center w-8 h-8 rounded border border-[#00F2FF]/20 bg-[#00F2FF]/5 text-[#00F2FF] hover:bg-[#00F2FF]/20 transition-all shadow-[0_0_10px_rgba(0,242,255,0.1)] group-hover:shadow-[0_0_20px_rgba(0,242,255,0.3)] shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="font-mono text-[10px] tracking-[0.4em] text-[#00F2FF]/60 uppercase group-hover:text-[#00F2FF] transition-colors">
                    Direct Inquiry
                  </span>
                </a>
                
                {/* Fallback Email UI (Hybrid Email) */}
                {showEmailFallback && (
                  <div className="ml-12 mt-1 px-4 py-3 bg-[#00F2FF]/5 border border-[#00F2FF]/20 rounded-lg animate-in slide-in-from-top-2 fade-in duration-300 relative">
                    <button onClick={() => setShowEmailFallback(false)} className="absolute top-2 right-2 text-[#00F2FF]/40 hover:text-[#00F2FF]">
                      <X className="w-3 h-3" />
                    </button>
                    <p className="text-[10px] font-mono text-white/60 mb-2 tracking-wide pr-4">
                      Opening your email app... Didn&apos;t work?
                    </p>
                    <a 
                      href={gmailDeepLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#00F2FF]/10 border border-[#00F2FF]/30 hover:bg-[#00F2FF]/20 text-[#00F2FF] font-mono text-[10px] font-bold uppercase tracking-widest rounded transition-all"
                    >
                      <Mail className="w-3 h-3" />
                      Open in Gmail
                    </a>
                  </div>
                )}
              </li>
              <li className="flex items-center gap-4 text-foreground/80 hover:text-white transition-colors group">
                <div className="flex items-center justify-center w-8 h-8 rounded border border-[#00F2FF]/20 bg-[#00F2FF]/5 text-[#00F2FF] group-hover:bg-[#00F2FF]/20 transition-all shadow-[0_0_10px_rgba(0,242,255,0.1)] group-hover:shadow-[0_0_15px_rgba(0,242,255,0.3)] shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="font-mono text-sm font-bold tracking-wider text-[#00F2FF] drop-shadow-[0_0_8px_rgba(0,242,255,0.3)]">{settings.contact.location}</span>
              </li>
            </ul>
            <div className="flex items-center gap-4 mt-auto pt-6 border-t border-[#00F2FF]/10">
              <span className="text-[10px] font-mono tracking-widest text-[#00F2FF]/50 uppercase mr-4">Network Links:</span>
              <a href={`mailto:${settings.contact.email}?subject=Engineering Inquiry`} onClick={() => setShowEmailFallback(true)} className="w-12 h-12 rounded border border-[#00F2FF]/20 bg-[#00F2FF]/5 flex items-center justify-center hover:bg-[#00F2FF]/20 hover:border-[#00F2FF]/80 transition-all text-[#00F2FF] hover:shadow-[0_0_15px_rgba(0,242,255,0.4)]"><Mail className="w-5 h-5" /></a>
              <a href="https://linkedin.com/in/morgan-mhandu" target="_blank" rel="noreferrer" className="w-12 h-12 rounded border border-[#00F2FF]/20 bg-[#00F2FF]/5 flex items-center justify-center hover:bg-[#00F2FF]/20 hover:border-[#00F2FF]/80 transition-all text-[#00F2FF] hover:shadow-[0_0_15px_rgba(0,242,255,0.4)]"><Linkedin className="w-5 h-5" /></a>
              <a href="https://github.com/morgan-mhandu" target="_blank" rel="noreferrer" className="w-12 h-12 rounded border border-[#00F2FF]/20 bg-[#00F2FF]/5 flex items-center justify-center hover:bg-[#00F2FF]/20 hover:border-[#00F2FF]/80 transition-all text-[#00F2FF] hover:shadow-[0_0_15px_rgba(0,242,255,0.4)]"><Github className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Right Column: Video or Placeholder */}
          <div className="md:w-1/2 flex flex-col justify-center overflow-visible">
            {settings.contactVideo ? (
              <div className="w-full aspect-video rounded-2xl border border-[#00F2FF]/20 bg-[#000814]/50 overflow-hidden shadow-[0_0_30px_rgba(0,242,255,0.1)] group">
                <video 
                  src={settings.contactVideo} 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                />
              </div>
            ) : (
              <div className="w-full aspect-video rounded-2xl border border-[#00F2FF]/20 bg-[#000814]/50 flex flex-col items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,242,255,0.05)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="w-16 h-16 rounded-full border border-[#00F2FF]/30 bg-[#00F2FF]/5 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(0,242,255,0.1)] group-hover:scale-110 transition-transform duration-500">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6 text-[#00F2FF]/70 ml-1">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="font-mono text-xs text-[#00F2FF]/40 tracking-widest uppercase relative z-10">
                  Video Reel Placeholder
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}
