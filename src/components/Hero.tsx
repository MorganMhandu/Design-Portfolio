"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect } from "react";
import { useAdmin } from "@/context/AdminContext";
import { PlayCircle } from "lucide-react";

function WireframeAssembly() {
  const { scrollY } = useScroll();
  
  // Parallax transforms applied locally within the bounds of its container
  const x1 = useTransform(scrollY, [0, 800], [0, -30]);
  const y1 = useTransform(scrollY, [0, 800], [0, -20]);
  
  const x2 = useTransform(scrollY, [0, 800], [0, 25]);
  const y2 = useTransform(scrollY, [0, 800], [0, 30]);
  
  const y3 = useTransform(scrollY, [0, 800], [0, -40]);

  return (
    <div className="relative w-[180%] h-[180%] lg:w-[130%] lg:h-[130%] flex items-center justify-center opacity-70 pointer-events-none origin-center">
      
      {/* Dynamic 360 Rotation Layer */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 flex items-center justify-center mix-blend-screen"
      >
        <svg width="100%" height="100%" viewBox="0 0 800 800" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#00F2FF]" style={{ filter: "drop-shadow(0 0 10px rgba(0,242,255,0.8))" }}>
          
          {/* Outer Structural Rings */}
          <circle cx="400" cy="400" r="350" strokeDasharray="12 12" stroke="white" opacity="0.4" />
          <circle cx="400" cy="400" r="330" opacity="0.6" />
          <circle cx="400" cy="400" r="280" strokeDasharray="2 12" strokeWidth="2.5" />

          {/* Main Planetary Gear Set */}
          <g transform="translate(400, 400)">
            {/* Teeth generation for outer gear */}
            {Array.from({length: 48}).map((_, i) => (
              <polygon key={i} points="-8,-230 8,-230 12,-250 -12,-250" transform={`rotate(${i * (360/48)})`} fill="none" />
            ))}
            <circle cx="0" cy="0" r="230" />
            <circle cx="0" cy="0" r="210" opacity="0.5" />
            
            {/* Center Sun Gear */}
            <circle cx="0" cy="0" r="60" stroke="white" />
            {Array.from({length: 16}).map((_, i) => (
              <line key={i} x1="0" y1="-60" x2="0" y2="-75" stroke="white" strokeWidth="2" transform={`rotate(${i * (360/16)})`} />
            ))}
            <circle cx="0" cy="0" r="40" strokeDasharray="4 4" stroke="white" />

            {/* Inner Structural Cross Supports */}
            {Array.from({length: 6}).map((_, i) => (
               <g key={i} transform={`rotate(${i * 60})`}>
                 <line x1="0" y1="75" x2="0" y2="210" strokeWidth="2" opacity="0.9" />
                 <circle cx="0" cy="142.5" r="30" strokeDasharray="2 4" />
               </g>
            ))}
          </g>

          {/* Secondary Interlocking Shaft (Top Right) */}
          <g transform="translate(680, 180)">
            <circle cx="0" cy="0" r="80" stroke="white" />
            <circle cx="0" cy="0" r="60" strokeDasharray="4 4" />
            {Array.from({length: 16}).map((_, i) => (
              <polygon key={i} points="-6,-80 6,-80 10,-95 -10,-95" transform={`rotate(${i * (360/16)})`} stroke="white" />
            ))}
            {/* Shaft connecting back to center */}
            <line x1="-280" y1="220" x2="0" y2="0" opacity="0.5" strokeWidth="2.5" strokeDasharray="10 5" />
          </g>

          {/* Peripheral Sensor / Actuator Array (Bottom Left) */}
          <g transform="translate(180, 620)">
            <rect x="-50" y="-50" width="100" height="100" strokeWidth="2" />
            <rect x="-40" y="-40" width="80" height="80" strokeDasharray="2 4" />
            <circle cx="0" cy="0" r="15" fill="currentColor" fillOpacity="0.3" />
            <circle cx="0" cy="0" r="25" />
            {/* Wires/Traces to core */}
            <path d="M 50 0 L 120 0 L 220 -220" strokeWidth="1.5" stroke="white" opacity="0.7" />
          </g>

          {/* Global Alignment Crosshairs */}
          <line x1="0" y1="400" x2="800" y2="400" strokeWidth="1" strokeDasharray="10 10" stroke="white" opacity="0.6" />
          <line x1="400" y1="0" x2="400" y2="800" strokeWidth="1" strokeDasharray="10 10" stroke="white" opacity="0.6" />

        </svg>
      </motion.div>

      {/* Static Annotations Layer Removed for cleaner UI */}
    </div>
  );
}

export function Hero() {
  const { settings } = useAdmin();
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setRefreshKey(prev => prev + 1);
  }, [settings.profilePicture]);

  return (
    <section className="relative min-h-screen w-full overflow-hidden flex items-center justify-center pt-28 pb-16 px-[8%] lg:px-[10%] bg-[#020617]">
      
      {/* --- ATMOSPHERIC LIGHTING (DARK MODE PLUS) --- */}
      <div className="absolute top-0 right-0 w-[70vw] h-[70vw] bg-[radial-gradient(circle_at_center,_rgba(41,121,255,0.15)_0%,_transparent_60%)] -z-10 translate-x-1/4 -translate-y-1/4" />
      <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] bg-[radial-gradient(circle_at_center,_rgba(41,121,255,0.10)_0%,_transparent_60%)] -z-10 -translate-x-1/4 translate-y-1/4" />

      {/* Container: Splits layout into 60/40 */}
      <div className="flex flex-col lg:flex-row items-center justify-between w-full max-w-[1400px] z-10 gap-12 lg:gap-8">
        
        {/* Left Column (58% width) */}
        <div className="w-full lg:w-[58%] flex flex-col items-start justify-center">
          
          {/* Integrated Biometric ID + Status + Name Row */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex items-center gap-5 mb-5"
          >
            {settings.showProfilePicture && (
              <div className="relative group shrink-0">
                {/* Border with Metallic Titanium Gradient & Cyan Glow */}
                <div className="relative w-20 h-20 p-[2px] rounded-2xl overflow-hidden bg-gradient-to-br from-[#BFC9D2] via-[#94A3B8] to-[#DCE3EA] shadow-[0_0_20px_rgba(0,242,255,0.25)] group-hover:shadow-[0_0_30px_rgba(0,242,255,0.5)] transition-all duration-500">
                  <div className="relative w-full h-full rounded-[14px] overflow-hidden bg-[#020617]">
                    {/* Headshot Image */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={settings.profilePicture || "/images/headshot.jpg"} 
                      alt="Morgan Mhandu Profile" 
                      className="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 transition-all duration-700"
                      key={refreshKey}
                    />
                    <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(0,242,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,242,255,0.05)_1px,transparent_1px)] bg-[size:4px_4px]" />
                  </div>
                </div>
                
                {/* Corner reticle marks */}
                <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-[#00F2FF]" />
                <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-[#00F2FF]" />
              </div>
            )}

            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#00F2FF] animate-pulse" />
                <span className="font-mono text-[10px] text-[#00F2FF] tracking-[0.25em] uppercase font-semibold">
                  STATUS: ONLINE // HARARE, ZW
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-heading font-bold text-white tracking-tight">
                Morgan Michael Mhandu
              </h2>
              <span className="font-mono text-xs text-[#94A3B8] tracking-widest uppercase">
                PORTFOLIO // SPECIFICATION INDEX
              </span>
            </div>
          </motion.div>

          {/* Line 2 & 3: Main Title with Engineered Precision Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-heading font-bold leading-[1.08] tracking-tight mb-5 text-[2.4rem] sm:text-[3.2rem] lg:text-[3.8rem] text-white"
          >
            Mechanical Systems &amp; <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F2FF] via-white to-[#94A3B8] drop-shadow-[0_0_20px_rgba(0,242,255,0.35)]">
              Automation Engineer
            </span>
          </motion.h1>

          {/* Line 4: Discipline Badges */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-wrap gap-2.5 mb-6"
          >
            <span className="font-mono text-[#00F2FF] font-semibold tracking-wider uppercase bg-[#00F2FF]/10 border border-[#00F2FF]/40 px-3 py-1 text-[10px] sm:text-xs rounded-md shadow-[0_0_10px_rgba(0,242,255,0.15)]">
              HEAVY INDUSTRIAL CAD
            </span>
            <span className="font-mono text-white/90 font-semibold tracking-wider uppercase bg-white/5 border border-white/20 px-3 py-1 text-[10px] sm:text-xs rounded-md">
              FEA SIMULATION
            </span>
            <span className="font-mono text-[#FF5400] font-semibold tracking-wider uppercase bg-[#FF5400]/10 border border-[#FF5400]/40 px-3 py-1 text-[10px] sm:text-xs rounded-md">
              FULL-STACK AUTOMATION
            </span>
          </motion.div>

          {/* Line 5: Description */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-base sm:text-lg text-[#94A3B8] leading-relaxed max-w-[540px] mb-8 font-light"
          >
            Designing intelligent physical systems and full-stack digital architectures by synthesizing <span className="text-[#00F2FF] font-medium">industrial engineering</span>, <span className="text-[#00F2FF] font-medium">high-tolerance CAD</span>, and <span className="text-[#00F2FF] font-medium">modern web software</span>.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap gap-4 mt-2 font-mono text-xs"
          >
            <a href="#projects" className="px-8 py-3.5 bg-gradient-to-r from-white to-[#00F2FF] text-black font-bold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-cad-glow uppercase tracking-wider">
              Explore Case Studies
            </a>
            <a href="#capabilities" className="px-6 py-3.5 border border-[#1F2937] bg-[#0B0F17]/80 text-[#94A3B8] hover:text-white rounded-xl hover:border-[#00F2FF]/50 hover:bg-[#00F2FF]/5 transition-all uppercase tracking-wider">
              Technical Matrix
            </a>
          </motion.div>

        </div>

        {/* Right Column (42% width) - Interactive Video Screen */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="w-full lg:w-[42%] flex justify-center items-center relative aspect-[16/10] bg-black/60 border border-[#00F2FF]/30 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,242,255,0.12)] backdrop-blur-md group"
        >
          {settings.heroVideo ? (
            <div className="relative w-full h-full">
              <video 
                src={settings.heroVideo}
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
              />
              {/* Technical HUD Overlay on Video */}
              <div className="absolute inset-0 pointer-events-none border-[1px] border-[#00F2FF]/20 m-4 rounded-xl" />
              <div className="absolute bottom-6 right-6 opacity-30">
                <PlayCircle className="w-6 h-6 text-[#00F2FF]" />
              </div>
              {/* Scanline Effect */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%]" />
            </div>
          ) : (
            <WireframeAssembly />
          )}
        </motion.div>

      </div>
    </section>
  );
}
