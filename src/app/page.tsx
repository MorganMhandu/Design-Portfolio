import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { CaseStudies } from "@/components/CaseStudies";
import { Expertise } from "@/components/Expertise";
import { Contact } from "@/components/Contact";
import { DigitalSystems } from "@/components/DigitalSystems";
import { Footer } from "@/components/Footer";
import { AdminShortcut } from "@/components/AdminShortcut";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-background">
      <Navigation />
      <Hero />
      <CaseStudies />
      <Expertise />
      <DigitalSystems />
      <Contact />
      <Footer />
      <AdminShortcut />
    </main>
  );
}
