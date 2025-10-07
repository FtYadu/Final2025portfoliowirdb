/**
 * @fileoverview This file defines the Lightbox component, a modal-style overlay
 * for displaying images and videos in a larger, focused view.
 */
import { useEffect, useRef } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { animations } from "@/lib/gsap-utils";
import type { PortfolioImage } from "@shared/schema";

/**
 * @interface LightboxProps
 * @description Defines the properties for the Lightbox component.
 * @property {boolean} isOpen - Whether the lightbox is currently open.
 * @property {() => void} onClose - A callback function to close the lightbox.
 * @property {PortfolioImage[]} images - An array of images or videos to display.
 * @property {number} currentIndex - The index of the currently displayed item in the `images` array.
 * @property {(direction: 'prev' | 'next') => void} onNavigate - A callback function to navigate to the previous or next item.
 */
interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: PortfolioImage[];
  currentIndex: number;
  onNavigate: (direction: 'prev' | 'next') => void;
}

/**
 * A full-screen modal component for displaying a carousel of images and videos.
 * It supports keyboard navigation (arrows and escape key), GSAP-powered animations for
 * opening and closing, and displays the current item's caption and position in the gallery.
 *
 * @param {LightboxProps} props - The props for the component.
 * @returns {JSX.Element | null} The rendered lightbox component or null if it is not open.
 */
export function Lightbox({ isOpen, onClose, images, currentIndex, onNavigate }: LightboxProps) {
  const lightboxRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLIFrameElement>(null);

  /**
   * Effect to trigger the opening animation when the lightbox becomes visible.
   */
  useEffect(() => {
    if (isOpen && lightboxRef.current) {
      const mediaElement = imageRef.current || videoRef.current;
      if (mediaElement) {
        animations.lightboxOpen(lightboxRef.current, mediaElement);
      }
    }
  }, [isOpen, currentIndex]);

  /**
   * Effect to handle keyboard navigation (Escape, ArrowLeft, ArrowRight).
   */
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

  /**
   * Handles the closing of the lightbox.
   * It triggers a GSAP animation before calling the `onClose` callback.
   */
  const handleClose = () => {
    if (lightboxRef.current) {
      const mediaElement = imageRef.current || videoRef.current;
      if (mediaElement) {
        animations.lightboxClose(lightboxRef.current, mediaElement, onClose);
      } else {
        onClose();
      }
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
      role="dialog"
      aria-modal="true"
      aria-label="Image and video viewer"
    >
      {currentImage.type === 'video' ? (
        // DEVELOPER_NOTE: The following line assumes that the video ID can be extracted from the end of the `imageurl`.
        // This might not be a robust solution if the URL format changes.
        // The schema has a `videoId` field which is currently unused but could be a better alternative.
        <iframe
          ref={videoRef}
          src={`https://player.vimeo.com/video/${currentImage.imageurl.split('/').pop()}`}
          className="w-[90vw] h-[90vh] max-w-[1200px] max-h-[800px] rounded-lg"
          allow="autoplay; fullscreen; picture-in-picture"
          onClick={(e) => e.stopPropagation()}
          title={currentImage.caption}
        />
      ) : (
        <img
          ref={imageRef}
          src={currentImage.imageurl}
          alt={currentImage.caption}
          className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
          onClick={(e) => e.stopPropagation()}
        />
      )}
      
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 text-white text-3xl hover:text-accent-purple transition-colors z-10"
        aria-label="Close lightbox"
      >
        <X className="w-8 h-8" />
      </button>
      
      <button
        onClick={(e) => {
          e.stopPropagation();
          onNavigate('prev');
        }}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-3xl hover:text-accent-purple transition-colors z-10"
        aria-label="Previous image"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>
      
      <button
        onClick={(e) => {
          e.stopPropagation();
          onNavigate('next');
        }}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-3xl hover:text-accent-purple transition-colors z-10"
        aria-label="Next image"
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
