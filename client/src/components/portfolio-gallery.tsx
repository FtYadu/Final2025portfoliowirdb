import { useState, useEffect, useRef, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Images, Play } from "lucide-react";
import { animations } from "@/lib/gsap-utils";
import { shuffleArray } from "@/lib/portfolio-data";
import { Lightbox } from "./lightbox";
import type { PortfolioImage } from "@shared/schema";

export function PortfolioGallery() {
  const [displayedMedia, setDisplayedMedia] = useState<PortfolioImage[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [hasInitialized, setHasInitialized] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);
  const mediaPerPage = 20;

  const { data: allImages = [], isLoading: imagesLoading } = useQuery<PortfolioImage[]>({
    queryKey: ['/api/portfolio/all'],
  });

  const { data: vimeoVideos = [], isLoading: videosLoading } = useQuery<PortfolioImage[]>({
    queryKey: ['/api/vimeo/videos'],
  });

  // Combine images and videos using useMemo to prevent infinite loops
  const allMedia = useMemo(() => [...allImages, ...vimeoVideos], [allImages, vimeoVideos]);
  const isLoading = imagesLoading || videosLoading;

  useEffect(() => {
    if (allMedia.length > 0 && !hasInitialized) {
      const shuffled = shuffleArray(allMedia);
      setDisplayedMedia(shuffled.slice(0, mediaPerPage));
      setHasInitialized(true);
    }
  }, [allMedia, hasInitialized]);

  useEffect(() => {
    // Initialize scroll animations when component mounts
    animations.initScrollAnimations();
  }, []);

  const loadMoreMedia = () => {
    const shuffled = shuffleArray(allMedia);
    const nextPage = currentPage + 1;
    const startIndex = nextPage * mediaPerPage;
    const endIndex = startIndex + mediaPerPage;
    const newMedia = shuffled.slice(startIndex, endIndex);
    
    setDisplayedMedia(prev => [...prev, ...newMedia]);
    setCurrentPage(nextPage);
  };

  const openLightbox = (index: number) => {
    setCurrentMediaIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const navigateLightbox = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentMediaIndex(prev => prev > 0 ? prev - 1 : displayedMedia.length - 1);
    } else {
      setCurrentMediaIndex(prev => prev < displayedMedia.length - 1 ? prev + 1 : 0);
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
          className="columns-2 sm:columns-3 lg:columns-4 gap-2 md:gap-3"
        >
          {displayedMedia.map((media, index) => (
            <div
              key={`${media.id}-${index}`}
              className="relative mb-2 md:mb-3 break-inside-avoid cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:z-10 group"
              onClick={() => openLightbox(index)}
            >
              <img
                src={media.imageurl}
                alt={media.caption}
                className="w-full h-auto rounded-lg"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              {media.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
                  <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                    <Play className="w-8 h-8 text-gray-900 ml-1" />
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3 rounded-lg">
                <p className="text-white text-xs font-medium line-clamp-2">{media.caption}</p>
              </div>
            </div>
          ))}
        </div>
        
        {displayedMedia.length < allMedia.length && (
          <div className="text-center mt-12">
            <button
              onClick={loadMoreMedia}
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
        images={displayedMedia}
        currentIndex={currentMediaIndex}
        onNavigate={navigateLightbox}
      />
      
      {/* Gradient overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
    </section>
  );
}
