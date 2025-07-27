import { Play, Pause } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export function AutoScrollToggle() {
  const [isScrolling, setIsScrolling] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoScroll = () => {
    if (intervalRef.current) return;
    
    intervalRef.current = setInterval(() => {
      window.scrollBy({
        top: 2,
        behavior: 'smooth'
      });
      
      // Reset scroll when reaching bottom
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

  // Pause auto scroll on hover over gallery items
  useEffect(() => {
    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if target exists and has closest method
      if (target && typeof target.closest === 'function' && target.closest('.masonry-item') && isScrolling) {
        stopAutoScroll();
      }
    };

    const handleMouseLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if target exists and has closest method
      if (target && typeof target.closest === 'function' && target.closest('.masonry-item') && isScrolling) {
        startAutoScroll();
      }
    };

    document.addEventListener('mouseenter', handleMouseEnter, true);
    document.addEventListener('mouseleave', handleMouseLeave, true);

    return () => {
      document.removeEventListener('mouseenter', handleMouseEnter, true);
      document.removeEventListener('mouseleave', handleMouseLeave, true);
      stopAutoScroll();
    };
  }, [isScrolling]);

  return (
    <button
      onClick={toggleAutoScroll}
      className="fixed bottom-8 right-8 z-[100] px-6 py-3 bg-accent-purple/90 hover:bg-accent-purple text-white border-none rounded-full cursor-pointer font-semibold backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 flex items-center gap-2"
    >
      {isScrolling ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
      {isScrolling ? "Pause Scroll" : "Auto Scroll"}
    </button>
  );
}
