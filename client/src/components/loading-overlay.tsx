import { useEffect } from "react";
import { animations } from "@/lib/gsap-utils";

interface LoadingOverlayProps {
  onComplete: () => void;
}

export function LoadingOverlay({ onComplete }: LoadingOverlayProps) {
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
