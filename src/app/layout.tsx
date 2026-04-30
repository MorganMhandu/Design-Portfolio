import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { AdminProvider } from "@/context/AdminContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: "Morgan Michael Mhandu | Portfolio",
  description: "Mechanical Systems & Automation Engineer Portfolio",
};

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
