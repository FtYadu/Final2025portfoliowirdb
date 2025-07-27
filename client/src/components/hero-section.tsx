import { useEffect, useRef, useState } from "react";
import { ChevronDown, MessageCircle, Calendar, Download } from "lucide-react";
import { animations } from "@/lib/gsap-utils";
import { socialLinks } from "@/lib/portfolio-data";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    animations.heroAnimation();
  }, []);

  const handleCVDownload = async () => {
    try {
      const response = await fetch('/api/cv/download');
      const data = await response.json();
      
      // Create a temporary link to download
      const link = document.createElement('a');
      link.href = data.url;
      link.download = data.name;
      link.click();
    } catch (error) {
      console.error('Error downloading CV:', error);
    }
  };

  return (
    <section 
      ref={heroRef}
      className="min-h-screen flex items-center justify-center relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 dark:from-gray-900 dark:via-gray-800 dark:to-black"
    >
      <div className="text-center z-10 relative px-4">
        <h1 className="hero-title font-bebas text-8xl md:text-[12rem] font-black mb-6 bg-gradient-to-r from-accent-purple to-accent-gold bg-clip-text text-transparent uppercase tracking-widest leading-none">
          YADU KRISHNA
        </h1>
        <p className="hero-subtitle text-xl md:text-3xl text-gray-300 mb-8 max-w-2xl mx-auto font-space font-light italic">
          Creative Visual Storyteller & Graphic Designer
        </p>
        <div className="hero-tags flex flex-wrap justify-center gap-4 mb-12">
          {["Photography", "Graphic Design", "Visual Arts", "Branding"].map((tag) => (
            <span 
              key={tag}
              className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm border border-white/20"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="hero-buttons flex flex-wrap justify-center gap-4">
          <a 
            href={socialLinks.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 bg-accent-purple hover:bg-accent-purple/80 rounded-full font-semibold transition-all duration-300 hover:scale-105 flex items-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            Get in Touch
          </a>
          <a 
            href={socialLinks.calendar}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 border border-white/30 hover:bg-white/10 rounded-full font-semibold transition-all duration-300 hover:scale-105 flex items-center gap-2"
          >
            <Calendar className="w-5 h-5" />
            Schedule Meeting
          </a>
          <button
            onClick={handleCVDownload}
            className="px-8 py-3 border border-white/30 hover:bg-white/10 rounded-full font-semibold transition-all duration-300 hover:scale-105 flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            Download CV
          </button>
        </div>
      </div>
      
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-8 h-8 text-white/70" />
      </div>
    </section>
  );
}
