import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { AdminProvider } from "@/context/AdminContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.morganmichael.pro"),
  title: "Morgan Michael Mhandu | Mechanical Systems & Automation Engineer",
  description: "Portfolio of Morgan Michael Mhandu — Mechanical Systems, Industrial Automation, PLC Logic, Mechatronics, CAD & Plant Engineering.",
  keywords: [
    "Morgan Michael Mhandu",
    "Mechanical Engineer",
    "Automation Engineer",
    "Mechatronics",
    "PLC Logic",
    "CAD Design",
    "FEA Simulation",
    "Industrial Automation",
    "Plant Engineering"
  ],
  authors: [{ name: "Morgan Michael Mhandu", url: "https://www.morganmichael.pro" }],
  creator: "Morgan Michael Mhandu",
  openGraph: {
    title: "Morgan Michael Mhandu | Mechanical Systems & Automation Engineer",
    description: "Designing intelligent mechanical systems by integrating industrial engineering, automation, and digital technologies.",
    url: "https://www.morganmichael.pro",
    siteName: "Morgan Michael Mhandu Portfolio",
    images: [
      {
        url: "/images/headshot.jpg",
        width: 1200,
        height: 630,
        alt: "Morgan Michael Mhandu Profile",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Morgan Michael Mhandu | Mechanical Systems & Automation Engineer",
    description: "Designing intelligent mechanical systems by integrating industrial engineering, automation, and digital technologies.",
    images: ["/images/headshot.jpg"],
  },
  other: {
    "build-id": `v-${Date.now()}`
  }
};

export const dynamic = 'force-dynamic';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth bg-background">
      <body className={`${inter.variable} ${jetbrains.variable} font-sans antialiased text-foreground overflow-x-hidden min-h-screen selection:bg-muted selection:text-heading`}>
        <AdminProvider>
          {children}
        </AdminProvider>
      </body>
    </html>
  );
}
