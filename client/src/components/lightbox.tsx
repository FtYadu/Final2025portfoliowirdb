import { useEffect, useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { animations } from "@/lib/gsap-utils";
import type { PortfolioImage } from "@shared/schema";

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: PortfolioImage[];
  currentIndex: number;
  onNavigate: (direction: 'prev' | 'next') => void;
}

export function Lightbox({ isOpen, onClose, images, currentIndex, onNavigate }: LightboxProps) {
  const lightboxRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (isOpen && lightboxRef.current && imageRef.current) {
      animations.lightboxOpen(lightboxRef.current, imageRef.current);
    }
  }, [isOpen, currentIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          handleClose();
          break;
        case 'ArrowLeft':
          onNavigate('prev');
          break;
        case 'ArrowRight':
          onNavigate('next');
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onNavigate]);

  const handleClose = () => {
    if (lightboxRef.current && imageRef.current) {
      animations.lightboxClose(lightboxRef.current, imageRef.current, onClose);
    } else {
      onClose();
    }
  };

  if (!isOpen || !images[currentIndex]) return null;

  const currentImage = images[currentIndex];

  return (
    <div
      ref={lightboxRef}
      className="fixed inset-0 bg-black/95 z-[1000] flex items-center justify-center opacity-0 backdrop-blur-lg"
      onClick={handleClose}
      style={{ display: 'none' }}
    >
      <img
        ref={imageRef}
        src={currentImage.imageurl}
        alt={currentImage.caption}
        className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
        onClick={(e) => e.stopPropagation()}
      />
      
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 text-white text-3xl hover:text-accent-purple transition-colors z-10"
      >
        <X className="w-8 h-8" />
      </button>
      
      <button
        onClick={(e) => {
          e.stopPropagation();
          onNavigate('prev');
        }}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-3xl hover:text-accent-purple transition-colors z-10"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>
      
      <button
        onClick={(e) => {
          e.stopPropagation();
          onNavigate('next');
        }}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-3xl hover:text-accent-purple transition-colors z-10"
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-center z-10">
        <p className="text-lg font-medium mb-2">{currentImage.caption}</p>
        <p className="text-sm text-gray-300">
          {currentIndex + 1} of {images.length}
        </p>
      </div>
    </div>
  );
}
