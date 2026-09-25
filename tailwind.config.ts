import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#030712",
        foreground: "#f5f5f5",
        muted: "#1F2937",
        accent: "#d4d4d4",
        carbon: {
          950: "#030712",
          900: "#0B0F17",
          850: "#111827",
          800: "#1F2937",
          700: "#374151",
        },
        precision: {
          cyan: "#00F2FF",
          cyanHover: "#33F6FF",
          orange: "#FF5400",
          steel: "#94A3B8",
          platinum: "#F8FAFC",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        heading: ["var(--font-space-grotesk)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      boxShadow: {
        "cad-glow": "0 0 25px -5px rgba(0, 242, 255, 0.25)",
        "orange-glow": "0 0 25px -5px rgba(255, 84, 0, 0.3)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "fade-up": "fadeUp 0.5s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
