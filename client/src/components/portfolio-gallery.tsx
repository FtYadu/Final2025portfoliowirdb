import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Images } from "lucide-react";
import { animations } from "@/lib/gsap-utils";
import { shuffleArray } from "@/lib/portfolio-data";
import { Lightbox } from "./lightbox";
import type { PortfolioImage } from "@shared/schema";

export function PortfolioGallery() {
  const [displayedImages, setDisplayedImages] = useState<PortfolioImage[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const galleryRef = useRef<HTMLDivElement>(null);
  const imagesPerPage = 20;

  const { data: allImages = [], isLoading } = useQuery<PortfolioImage[]>({
    queryKey: ['/api/portfolio/all'],
  });

  useEffect(() => {
    if (allImages.length > 0) {
      const shuffled = shuffleArray(allImages);
      setDisplayedImages(shuffled.slice(0, imagesPerPage));
    }
  }, [allImages]);

  useEffect(() => {
    // Initialize scroll animations when component mounts
    animations.initScrollAnimations();
  }, []);

  const loadMoreImages = () => {
    const shuffled = shuffleArray(allImages);
    const nextPage = currentPage + 1;
    const startIndex = nextPage * imagesPerPage;
    const endIndex = startIndex + imagesPerPage;
    const newImages = shuffled.slice(startIndex, endIndex);
    
    setDisplayedImages(prev => [...prev, ...newImages]);
    setCurrentPage(nextPage);
  };

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const navigateLightbox = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentImageIndex(prev => prev > 0 ? prev - 1 : displayedImages.length - 1);
    } else {
      setCurrentImageIndex(prev => prev < displayedImages.length - 1 ? prev + 1 : 0);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="loader w-12 h-12 border-3 border-accent-purple/30 rounded-full border-t-accent-purple animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="relative py-0 bg-background">
      {/* Gradient overlay at top */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-8 pt-20">
          <h2 className="section-title font-oswald text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-accent-purple to-accent-gold bg-clip-text text-transparent uppercase tracking-wider">
            Portfolio Gallery
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-space font-light">
            A curated collection of visual stories, creative expressions, and artistic endeavors
          </p>
        </div>
        
        <div 
          ref={galleryRef}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3"
        >
          {displayedImages.map((image, index) => (
            <div
              key={`${image.id}-${index}`}
              className="relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:z-10 group aspect-[4/3]"
              onClick={() => openLightbox(index)}
            >
              <img
                src={image.imageurl}
                alt={image.caption}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                <p className="text-white text-xs font-medium line-clamp-2">{image.caption}</p>
              </div>
            </div>
          ))}
        </div>
        
        {displayedImages.length < allImages.length && (
          <div className="text-center mt-12">
            <button
              onClick={loadMoreImages}
              className="px-8 py-3 bg-accent-purple hover:bg-accent-purple/80 rounded-full font-semibold transition-all duration-300 hover:scale-105 flex items-center gap-2 mx-auto"
            >
              <Images className="w-5 h-5" />
              Load More
            </button>
          </div>
        )}
      </div>

      <Lightbox
        isOpen={lightboxOpen}
        onClose={closeLightbox}
        images={displayedImages}
        currentIndex={currentImageIndex}
        onNavigate={navigateLightbox}
      />
      
      {/* Gradient overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
    </section>
  );
}
