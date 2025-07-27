import { useState } from "react";
import { HeroSection } from "@/components/hero-section";
import { PortfolioGallery } from "@/components/portfolio-gallery";
import { ContactSection } from "@/components/contact-section";
import { LoadingOverlay } from "@/components/loading-overlay";
import { ThemeToggle } from "@/components/theme-toggle";
import { SocialDock } from "@/components/social-dock";
import { AutoScrollToggle } from "@/components/auto-scroll-toggle";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && <LoadingOverlay onComplete={() => setIsLoading(false)} />}
      
      <ThemeToggle />
      <SocialDock />
      <AutoScrollToggle />
      
      <main className="min-h-screen">
        <HeroSection />
        <PortfolioGallery />
        <ContactSection />
      </main>
    </>
  );
}
