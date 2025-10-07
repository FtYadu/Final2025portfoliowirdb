/**
 * @fileoverview This file defines the LoadingOverlay component, a full-screen
 * indicator displayed while the main application content is loading.
 */
import { useEffect } from "react";
import { animations } from "@/lib/gsap-utils";

/**
 * @interface LoadingOverlayProps
 * @description Defines the properties for the LoadingOverlay component.
 * @property {() => void} onComplete - A callback function to be executed when the loading animation finishes.
 */
interface LoadingOverlayProps {
  onComplete: () => void;
}

/**
 * A full-screen loading overlay component that shows an animation while the
 * application is initializing. It uses GSAP for a sequenced animation and
 * executes a callback function upon completion to transition to the main content.
 *
 * @param {LoadingOverlayProps} props - The props for the component.
 * @returns {JSX.Element} The rendered loading overlay.
 */
export function LoadingOverlay({ onComplete }: LoadingOverlayProps) {
  /**
   * Effect to trigger the loading animation sequence after a short delay.
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      animations.loadingSequence(onComplete);
    }, 1500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="loading-overlay fixed inset-0 bg-dark-primary z-[2000] flex items-center justify-center flex-col">
      <div className="loader w-15 h-15 border-3 border-accent-purple/30 rounded-full border-t-accent-purple animate-spin">
      </div>
      <div className="loading-text font-playfair text-2xl text-accent-purple mt-4">
        Loading Portfolio
      </div>
      
      <style>{`
        .loader {
          width: 60px;
          height: 60px;
          border: 3px solid rgba(139, 95, 230, 0.3);
          border-radius: 50%;
          border-top-color: #8B5FE6;
          animation: spin 1s ease-in-out infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
