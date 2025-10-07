/**
 * @fileoverview This file defines the AutoScrollToggle component, which provides a
 * floating button to enable or disable automatic scrolling of the page.
 */
import { Play, Pause } from "lucide-react";
import { useState, useEffect, useRef } from "react";

/**
 * A React component that renders a floating button to toggle auto-scrolling.
 * The auto-scroll feature smoothly scrolls the page down and resets to the top
 * upon reaching the bottom. It also intelligently pauses when the user's mouse
 * hovers over a gallery item (elements with the `.masonry-item` class) and
 * resumes when the mouse leaves.
 *
 * @returns {JSX.Element} The floating toggle button component.
 */
export function AutoScrollToggle() {
  const [isScrolling, setIsScrolling] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Starts the auto-scrolling behavior.
   * It sets an interval to scroll the window down periodically and handles
   * looping back to the top when the bottom of the page is reached.
   */
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

  /**
   * Stops the auto-scrolling behavior by clearing the interval.
   */
  const stopAutoScroll = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  /**
   * Toggles the auto-scroll state. If scrolling, it stops; otherwise, it starts.
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

  // Effect to handle pausing and resuming auto-scroll on hover.
  useEffect(() => {
    /**
     * Pauses scrolling when the mouse enters a gallery item.
     * @param {MouseEvent} e The mouse event.
     */
    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && typeof target.closest === 'function' && target.closest('.masonry-item') && isScrolling) {
        stopAutoScroll();
      }
    };

    /**
     * Resumes scrolling when the mouse leaves a gallery item.
     * @param {MouseEvent} e The mouse event.
     */
    const handleMouseLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
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
      aria-label={isScrolling ? "Pause automatic scrolling" : "Start automatic scrolling"}
    >
      {isScrolling ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
      {isScrolling ? "Pause Scroll" : "Auto Scroll"}
    </button>
  );
}
