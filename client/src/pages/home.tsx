/**
 * @fileoverview This file defines the Home page component, which serves as the
 * main landing page of the application.
 */
import { useState, useRef, useEffect } from "react";
import { HeroSection } from "@/components/hero-section";
import { PortfolioGallery } from "@/components/portfolio-gallery";
import { ContactSection } from "@/components/contact-section";
import { LoadingOverlay } from "@/components/loading-overlay";
import { SpiralSocialDock } from "@/components/spiral-social-dock";
import { NavMenu } from "@/components/nav-menu";

/**
 * The Home page component.
 * It orchestrates the main sections of the landing page, including the Hero,
 * Portfolio Gallery, and Contact sections. It also manages the initial loading
 * overlay and the auto-scroll functionality.
 *
 * @returns {JSX.Element} The rendered home page.
 */
export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Starts the auto-scrolling behavior.
   */
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

  /**
   * Stops the auto-scrolling behavior.
   */
  const stopAutoScroll = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  /**
   * Toggles the auto-scroll state.
   */
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
      <SpiralSocialDock />
      
      <main className="min-h-screen">
        <HeroSection />
        <PortfolioGallery />
        <ContactSection />
      </main>
    </>
  );
}
