"use client";

import { useState } from "react";
import { Section, SectionHeading } from "./Section";
import { Mail, Linkedin, Github, MapPin, PhoneCall, Send } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.394 0 12.03c0 2.12.553 4.189 1.605 6.046L0 24l6.111-1.603a11.845 11.845 0 005.936 1.587h.005c6.632 0 12.032-5.4 12.035-12.041a11.85 11.85 0 00-3.527-8.523z"/>
  </svg>
);

export function Contact() {
  const { addMessage, settings } = useAdmin();
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Push to admin inquiry log
    addMessage({
      name: formState.name,
      email: formState.email,
      message: formState.message,
    });

    // Simulate slight delay for UX
    await new Promise((r) => setTimeout(r, 600));
    setSubmitted(true);
    setSubmitting(false);
    setFormState({ name: "", email: "", message: "" });
  };

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
              <li className="flex items-center gap-4 text-foreground/80 transition-colors group">
                <a href={`mailto:${settings.contact.email}`} className="flex items-center gap-4 w-full" title="Launch Secure Mail Interface">
                  <div className="flex items-center justify-center w-8 h-8 rounded border border-[#00F2FF]/20 bg-[#00F2FF]/5 text-[#00F2FF] hover:bg-[#00F2FF]/20 transition-all shadow-[0_0_10px_rgba(0,242,255,0.1)] group-hover:shadow-[0_0_20px_rgba(0,242,255,0.3)] shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="font-mono text-[10px] tracking-[0.4em] text-[#00F2FF]/60 uppercase group-hover:text-[#00F2FF] transition-colors">
                    Direct Inquiry
                  </span>
                </a>
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
              <a href={`mailto:${settings.contact.email}`} className="w-12 h-12 rounded border border-[#00F2FF]/20 bg-[#00F2FF]/5 flex items-center justify-center hover:bg-[#00F2FF]/20 hover:border-[#00F2FF]/80 transition-all text-[#00F2FF] hover:shadow-[0_0_15px_rgba(0,242,255,0.4)]"><Mail className="w-5 h-5" /></a>
              <a href="https://linkedin.com/in/morgan-mhandu" target="_blank" rel="noreferrer" className="w-12 h-12 rounded border border-[#00F2FF]/20 bg-[#00F2FF]/5 flex items-center justify-center hover:bg-[#00F2FF]/20 hover:border-[#00F2FF]/80 transition-all text-[#00F2FF] hover:shadow-[0_0_15px_rgba(0,242,255,0.4)]"><Linkedin className="w-5 h-5" /></a>
              <a href="https://github.com/morgan-mhandu" target="_blank" rel="noreferrer" className="w-12 h-12 rounded border border-[#00F2FF]/20 bg-[#00F2FF]/5 flex items-center justify-center hover:bg-[#00F2FF]/20 hover:border-[#00F2FF]/80 transition-all text-[#00F2FF] hover:shadow-[0_0_15px_rgba(0,242,255,0.4)]"><Github className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Right Column: Terminal Form */}
          <div className="md:w-1/2 overflow-visible">
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full gap-6 py-16 border border-[#00F2FF]/20 rounded-2xl bg-[#00F2FF]/5 overflow-visible">
                <div className="w-16 h-16 rounded-2xl border border-[#00F2FF]/40 bg-[#00F2FF]/10 flex items-center justify-center shadow-[0_0_20px_rgba(0,242,255,0.2)]">
                  <Send className="w-7 h-7 text-[#00F2FF]" />
                </div>
                <div className="text-center">
                  <p className="font-mono text-sm font-bold text-[#00F2FF] tracking-widest uppercase drop-shadow-[0_0_8px_rgba(0,242,255,0.5)]">TRANSMISSION RECEIVED</p>
                  <p className="font-mono text-[10px] text-[#94A3B8]/60 tracking-widest mt-2">Your message has been logged. I&apos;ll respond via secure channel.</p>
                </div>
                <button onClick={() => setSubmitted(false)} className="font-mono text-[10px] tracking-widest text-[#00F2FF]/50 hover:text-[#00F2FF] uppercase transition-colors">
                  Send another transmission
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input type="text" name="_gotcha" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-[10px] font-mono text-[#00F2FF]/60 uppercase tracking-widest">Name</label>
                  <input type="text" id="name" name="name" required value={formState.name} onChange={(e) => setFormState({ ...formState, name: e.target.value })} className="bg-[#020617]/50 border border-[#00F2FF]/20 py-4 px-5 focus:outline-none focus:border-[#00F2FF]/80 transition-colors text-white placeholder:text-white/20 shadow-[inset_0_0_20px_rgba(0,242,255,0.02)] rounded-xl font-mono text-xs hover:border-[#00F2FF]/40" placeholder="Full Name" />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-[10px] font-mono text-[#00F2FF]/60 uppercase tracking-widest">Email</label>
                  <input type="email" id="email" name="email" required value={formState.email} onChange={(e) => setFormState({ ...formState, email: e.target.value })} className="bg-[#020617]/50 border border-[#00F2FF]/20 py-4 px-5 focus:outline-none focus:border-[#00F2FF]/80 transition-colors text-white placeholder:text-white/20 shadow-[inset_0_0_20px_rgba(0,242,255,0.02)] rounded-xl font-mono text-xs hover:border-[#00F2FF]/40" placeholder="Email Address" />
                </div>
                <div className="flex flex-col gap-1.5 relative">
                  <label htmlFor="message" className="text-[10px] font-mono text-[#00F2FF]/60 uppercase tracking-widest">Message</label>
                  <textarea id="message" name="message" required rows={4} value={formState.message} onChange={(e) => setFormState({ ...formState, message: e.target.value })} className="bg-[#020617]/50 border border-[#00F2FF]/20 py-3 px-5 focus:outline-none focus:border-[#00F2FF]/80 transition-colors text-white resize-none placeholder:text-white/20 shadow-[inset_0_0_20px_rgba(0,242,255,0.02)] rounded-xl font-mono text-xs hover:border-[#00F2FF]/40" placeholder="Your Message or Project Brief" />
                </div>
                <button type="submit" disabled={submitting} className="self-start mt-4 px-12 py-4 bg-[linear-gradient(180deg,#FFFFFF_10%,#BFC9D2_40%,#DCE3EA_70%,#94A3B8_100%)] text-black font-bold tracking-[0.2em] uppercase rounded-xl hover:scale-[1.02] transition-all duration-300 flex items-center justify-center shadow-[0_0_20px_rgba(0,242,255,0.2)] hover:shadow-[0_0_40px_rgba(0,242,255,0.6)] disabled:opacity-60 disabled:cursor-not-allowed gap-3">
                  {submitting ? "Sending..." : "Send"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}
