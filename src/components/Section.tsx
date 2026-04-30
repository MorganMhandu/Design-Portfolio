"use client";

import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function Section({ children, className, id }: SectionProps) {
  // Deterministic location number based on string ID to prevent hydration mismatch
  const locHash = id ? (id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) * 17 % 899 + 100) : 404;

  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={cn("relative py-20 md:py-32 w-full max-w-[1400px] mx-auto px-[10%]", className)}
    >
      {children}
    </motion.section>
  );
}

export function SectionHeading({ children, className, action }: { children: React.ReactNode; className?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-8 md:mb-12 w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <h2 
          className={cn("text-3xl md:text-5xl font-medium tracking-tight drop-shadow-[0_0_12px_rgba(0,242,255,0.6)] text-transparent bg-clip-text py-4 leading-normal overflow-visible", className)}
          style={{
            backgroundImage: "linear-gradient(to right, #00F2FF 0%, #FFFFFF 100%)",
          }}
        >
          {children}
        </h2>
        {action && (
          <div className="shrink-0 flex items-center">
            {action}
          </div>
        )}
      </div>
      <div className="h-[1px] w-full bg-gradient-to-r from-[#00F2FF] to-transparent mt-8 shadow-[0_0_8px_rgba(0,242,255,0.8)]" />
    </div>
  );
}
