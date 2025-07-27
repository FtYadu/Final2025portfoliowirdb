import { useState, useRef, useEffect } from "react";
import { HeroSection } from "@/components/hero-section";
import { PortfolioGallery } from "@/components/portfolio-gallery";
import { ContactSection } from "@/components/contact-section";
import { LoadingOverlay } from "@/components/loading-overlay";
import { SocialDock } from "@/components/social-dock";
import { NavMenu } from "@/components/nav-menu";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoScroll = () => {
    if (intervalRef.current) return;
    
    intervalRef.current = setInterval(() => {
      window.scrollBy({
        top: 2,
        behavior: 'smooth'
      });
      
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 50);
  };

  const stopAutoScroll = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const toggleAutoScroll = () => {
    if (isScrolling) {
      stopAutoScroll();
      setIsScrolling(false);
    } else {
      startAutoScroll();
      setIsScrolling(true);
    }
  };

  useEffect(() => {
    return () => stopAutoScroll();
  }, []);

  return (
    <>
      {isLoading && <LoadingOverlay onComplete={() => setIsLoading(false)} />}
      
      <NavMenu isScrolling={isScrolling} onToggleScroll={toggleAutoScroll} />
      <SocialDock />
      
      <main className="min-h-screen">
        <HeroSection />
        <PortfolioGallery />
        <ContactSection />
      </main>
    </>
  );
}
