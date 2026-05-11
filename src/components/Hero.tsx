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
    <section className="relative h-[100vh] w-full overflow-hidden flex items-center justify-center py-[6vh] px-[10%] bg-[#020617]">
      
      {/* --- ATMOSPHERIC LIGHTING (DARK MODE PLUS) --- */}
      <div className="absolute top-0 right-0 w-[70vw] h-[70vw] bg-[radial-gradient(circle_at_center,_rgba(41,121,255,0.15)_0%,_transparent_60%)] -z-10 translate-x-1/4 -translate-y-1/4" />
      <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] bg-[radial-gradient(circle_at_center,_rgba(41,121,255,0.10)_0%,_transparent_60%)] -z-10 -translate-x-1/4 translate-y-1/4" />

      {/* Container: Splits layout into 60/40 */}
      <div className="flex flex-col lg:flex-row items-center justify-between w-full max-w-[1400px] z-10 gap-8 lg:gap-4">
        
        {/* Left Column (60% width) */}
        <div className="w-full lg:w-[60%] flex flex-col items-start justify-center pt-8 lg:pt-0">
          
          {/* Biometric ID / Headshot Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-end gap-6 mb-4"
          >
            {settings.showProfilePicture && (
              <div className="relative group">
                {/* Border with Metallic Titanium Gradient & Cyan Glow */}
                <div className="relative w-28 h-28 p-[2px] rounded-2xl overflow-hidden bg-gradient-to-br from-[#BFC9D2] via-[#94A3B8] to-[#DCE3EA] shadow-[0_0_20px_rgba(0,242,255,0.25)] group-hover:shadow-[0_0_30px_rgba(0,242,255,0.5)] transition-all duration-500">
                  <div className="relative w-full h-full rounded-[14px] overflow-hidden bg-[#020617]">
                    {/* Headshot Image */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={settings.profilePicture || "/images/headshot.jpg"} 
                      alt="Morgan Mhandu, Mechanical & Automation Engineer Profile" 
                      className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
                      key={refreshKey}
                    />
                    
                    {/* Technical Overlay: Scan Grid */}
                    <div className="absolute inset-0 pointer-events-none opacity-30 mix-blend-overlay bg-[linear-gradient(rgba(0,242,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,242,255,0.05)_1px,transparent_1px)] bg-[size:4px_4px]" />
                    <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(transparent_0%,rgba(0,242,255,0.1)_50%,transparent_100%)] bg-[size:100%_20px] animate-[scan_3s_linear_infinite]" />
                  </div>
                </div>
                
                {/* Frame corner accents */}
                <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-[#00F2FF] shadow-[0_0_8px_#00F2FF]" />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-[#00F2FF] shadow-[0_0_8px_#00F2FF]" />
              </div>
            )}

          </motion.div>

          {/* Line 1: Name */}
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-[1.3rem] font-light tracking-wide mb-1 text-[#E0F7FA]"
            style={{ textShadow: "0 0 8px rgba(0, 242, 255, 0.4)" }}
          >
            Morgan Michael Mhandu
          </motion.h2>

          {/* Line 2 & 3: Main Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-bold leading-[1.05] tracking-tighter mb-4 drop-shadow-lg"
            style={{ 
              fontSize: "4rem",
              backgroundImage: "linear-gradient(to bottom right, #FFFFFF 0%, #00F2FF 50%, #78909C 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
            Mechanical Systems &amp; <br />
            Automation Engineer
          </motion.h1>

          {/* Line 4: Role Tag with Neon HUD Glow */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6"
          >
            <span className="font-mono text-[#00F2FF] font-semibold tracking-widest uppercase bg-[#00F2FF]/5 border border-[#00F2FF]/30 px-4 py-2 shadow-[0_0_15px_rgba(0,242,255,0.1)] inline-block text-[10px] sm:text-xs rounded-lg">
              MECHANICAL DESIGN ENGINEER
            </span>
          </motion.div>

          {/* Line 4: Description */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-base text-[#B0F2F7] leading-relaxed max-w-[500px] mb-8"
          >
            Designing intelligent mechanical systems by integrating <span className="text-[#00F2FF] font-bold drop-shadow-[0_0_5px_rgba(0,242,255,0.6)]">industrial engineering</span>, <span className="text-[#00F2FF] font-bold drop-shadow-[0_0_5px_rgba(0,242,255,0.6)]">automation</span>, and <span className="text-[#00F2FF] font-bold drop-shadow-[0_0_5px_rgba(0,242,255,0.6)]">digital technologies</span>.
          </motion.p>

          {/* Refined "Explore Work" Glow Button */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex gap-4 mt-2"
          >
            <a href="#projects" className="px-8 py-4 bg-gradient-to-r from-white to-[#00F2FF]/90 text-black font-bold rounded-full transition-all duration-300 hover:scale-105 hover:from-[#00F2FF] hover:to-[#00F2FF] shadow-[0_0_15px_rgba(0,242,255,0.4)] hover:shadow-[0_0_40px_rgba(0,242,255,0.9)] hover:text-white text-sm">
              Explore Work
            </a>
          </motion.div>

        </div>

        {/* Right Column (40% width) - Graphic isolated entirely to this column */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="w-full lg:w-[42%] flex justify-center items-center relative aspect-video bg-black/40 border border-[#00F2FF]/30 rounded-2xl overflow-hidden shadow-[inset_0_0_60px_rgba(0,242,255,0.1),0_0_40px_rgba(0,242,255,0.2)] backdrop-blur-md group"
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
              <div className="absolute top-6 left-6 flex items-center gap-2 opacity-50">
                <div className="w-2 h-2 rounded-full bg-[#00F2FF] animate-pulse" />
                <span className="font-mono text-[8px] text-[#00F2FF] tracking-[0.2em] uppercase">Sim_Active</span>
              </div>
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
