import { Section, SectionHeading } from "./Section";
import { Image as ImageIcon } from "lucide-react";

export function Experience() {
  const experiences = [
    {
      company: "TN Cybertech",
      role: "Mechanical Design Engineer",
      date: "NOV 2025 — PRESENT",
      tagLabel: "IMPACT",
      efficiency: "OPTIMIZED DURABILITY & COST EFFICIENCY",
      stack: ["SOLIDWORKS", "ANSYS", "CNC PROGRAMMING", "LOAD ANALYSIS"],
      renderRef: "MINING_STRUCTURAL_ASSEMBLY",
      details: [
        "Designed heavy-duty mechanical components and structural assemblies for mining projects.",
        "Optimized systems using load analysis and material selection to improve durability.",
        "Led mechanical, electrical, and automation coordination for industrial and banking infrastructure.",
        "Programmed CNC machines and conducted technical feasibility studies for mining investments.",
      ],
    },
    {
      company: "Fleischer Zimbabwe",
      role: "Mechanical & Automation Engineer",
      date: "2021.05 — 2022.12",
      tagLabel: "EFF_GAIN",
      efficiency: "80+ Components Deployed",
      stack: ["AutoCAD", "PLC", "Sensors"],
      renderRef: "CONVEYOR_AUTOMATION_SYS",
      details: [
        "Designed 80+ mechanical components and assemblies including shafts, gears, frames, and housings.",
        "Developed conveyor systems and integrated PLC-based automation with sensors and actuators.",
        "Conducted FEA and stress analysis to optimize performance and reduce material usage.",
      ],
    },
    {
      company: "Paddock Gears",
      role: "Mechanical Engineer",
      date: "2019.08 — 2021.04",
      tagLabel: "EFF_GAIN",
      efficiency: "100% Budget Adherence",
      stack: ["Fabrication", "Machining", "Maintenance"],
      renderRef: "INDUSTRIAL_GEARBOX_MOD",
      details: [
        "Designed and modified mechanical systems and components for industrial applications.",
        "Collaborated with machinists and production teams to refine fabrication drawings and execution.",
        "Performed corrective maintenance on large-scale mechanical systems across multiple industries.",
      ],
    },
    {
      company: "Delta Beverages",
      role: "Mechanical Intern",
      date: "2018.01 — 2018.12",
      tagLabel: "EFF_GAIN",
      efficiency: "+$20k Annual Savings",
      stack: ["Optimization", "RCA", "Sys Admin"],
      renderRef: "SYSTEM_RCA_DIAGRAM",
      details: [
        "Improved operational efficiency through process optimization, contributing to significant annual cost savings.",
        "Conducted root cause analysis on mechanical and electrical failures to resolve breakdowns effectively.",
        "Supported maintenance of industrial equipment and systems to ensure continuous production reliability.",
      ],
    },
  ];

  return (
    <Section id="projects">
      <SectionHeading>Projects</SectionHeading>
      <div className="flex flex-col gap-10">
        {experiences.map((exp, idx) => (
          <div key={idx} className="border border-muted/50 bg-background/40 backdrop-blur-sm rounded-none p-6 md:p-8 flex flex-col md:flex-row gap-8 relative group hover:border-accent/40 transition-colors">
            
            {/* Top-Right Decorative Detail */}
            <div className="absolute top-0 right-0 px-2 py-1 border-l border-b border-muted/40 text-[9px] font-mono text-muted-foreground/40 leading-none tracking-widest bg-muted/10">
              V{idx + 1}.0_SPEC
            </div>

            {/* Left Column: Data & Specs */}
            <div className="md:w-3/5 flex flex-col pt-1">
              <div className="mb-6">
                <h3 className="text-2xl md:text-3xl font-semibold text-heading mb-1">{exp.company}</h3>
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-[0.15em] mb-5">{exp.role} <span className="text-accent/30 mx-2">|</span> {exp.date}</p>
                
                <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4 items-start sm:items-center">
                   <div className="text-[10px] font-mono bg-accent/5 border border-accent/20 text-accent px-2.5 py-1.5 uppercase tracking-widest flex items-center gap-2">
                     <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse"></div>
                     {exp.tagLabel}: {exp.efficiency}
                   </div>
                   <div className="text-[10px] font-mono text-muted-foreground/80 tracking-widest uppercase flex gap-2 w-full sm:w-auto mt-1 sm:mt-0">
                     <span className="text-accent/50 mr-1">STACK:</span> {exp.stack.join(" / ")}
                   </div>
                </div>
              </div>
              <ul className="space-y-4 flex-grow border-l border-muted/30 pl-5 relative">
                {exp.details.map((detail, dIdx) => (
                  <li key={dIdx} className="text-foreground text-sm leading-relaxed relative">
                    <span className="absolute -left-[25px] top-2 w-[5px] h-[1px] bg-accent/50"></span>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Column: Visual Render Placeholder */}
            <div className="md:w-2/5 flex items-center justify-center border border-dashed border-muted bg-background/50 relative overflow-hidden min-h-[200px] group-hover:border-accent/30 transition-colors">
               {/* Inner technical grid */}
               <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:16px_16px]"></div>
               
               {/* Placeholder crosshairs */}
               <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-muted-foreground/30"></div>
               <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-muted-foreground/30"></div>
               <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-muted-foreground/30"></div>
               <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-muted-foreground/30"></div>

               <div className="relative flex flex-col items-center gap-3 text-muted-foreground/40 hover:text-accent/60 transition-colors cursor-crosshair px-4">
                  <ImageIcon className="w-8 h-8 opacity-50" strokeWidth={1} />
                  <div className="flex flex-col items-center gap-1.5 text-center">
                    <span className="text-[10px] font-mono tracking-widest uppercase">AWAITING_RENDER_DATA</span>
                    <span className="text-[8px] font-mono tracking-widest uppercase text-muted-foreground/50">[ REF: {exp.renderRef} ]</span>
                  </div>
               </div>
            </div>
            
          </div>
        ))}
      </div>
    </Section>
  );
}
