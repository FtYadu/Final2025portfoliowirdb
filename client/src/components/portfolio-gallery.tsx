/**
 * @fileoverview Defines the PortfolioGallery component, a dynamic and interactive
 * gallery for showcasing portfolio items including images and videos.
 */
import { useState, useEffect, useRef, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Images, Play, Grid, Filter } from "lucide-react";
import { animations } from "@/lib/gsap-utils";
import { shuffleArray } from "@/lib/portfolio-data";
import { Lightbox } from "./lightbox";
import type { PortfolioImage } from "@shared/schema";

/**
 * @description A list of predefined categories for filtering the portfolio.
 * Each category has an ID, a display label, and an associated color gradient.
 */
const categories = [
  { id: 'all', label: 'All Work', color: 'from-purple-500 to-blue-500' },
  { id: 'portrait', label: 'Portraits', color: 'from-orange-500 to-pink-500' },
  { id: 'landscape', label: 'Landscapes', color: 'from-green-500 to-teal-500' },
  { id: 'automotive', label: 'Automotive', color: 'from-red-500 to-orange-500' },
  { id: 'wedding', label: 'Weddings', color: 'from-pink-500 to-rose-500' },
  { id: 'sports', label: 'Sports', color: 'from-blue-500 to-indigo-500' },
  { id: 'creative', label: 'Creative', color: 'from-purple-500 to-violet-500' },
  { id: 'photography', label: 'General', color: 'from-gray-500 to-slate-500' }
];

/**
 * The PortfolioGallery component renders a feature-rich, masonry-style gallery.
 * Key features include:
 * - Fetches and combines images and videos from multiple API endpoints.
 * - Allows filtering by category with smooth GSAP animations.
 * - Implements a "Load More" functionality for pagination.
 * - Integrates a full-screen Lightbox for detailed viewing.
 * - Uses lazy loading for images to improve performance.
 *
 * @returns {JSX.Element} The rendered portfolio gallery section.
 */
export function PortfolioGallery() {
  const [displayedMedia, setDisplayedMedia] = useState<PortfolioImage[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isFilterTransitioning, setIsFilterTransitioning] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);
  const categoryFilterRef = useRef<HTMLDivElement>(null);
  const mediaPerPage = 20;

  const { data: allImages = [], isLoading: imagesLoading } = useQuery<PortfolioImage[]>({
    queryKey: ['/api/portfolio/all'],
  });

  const { data: vimeoVideos = [], isLoading: videosLoading } = useQuery<PortfolioImage[]>({
    queryKey: ['/api/vimeo/videos'],
  });

  const allMedia = useMemo(() => [...allImages, ...vimeoVideos], [allImages, vimeoVideos]);
  const isLoading = imagesLoading || videosLoading;

  const filteredMedia = useMemo(() => {
    if (selectedCategory === 'all') return allMedia;
    return allMedia.filter(item => item.category === selectedCategory);
  }, [allMedia, selectedCategory]);

  useEffect(() => {
    if (filteredMedia.length > 0 && !hasInitialized) {
      const shuffled = shuffleArray(filteredMedia);
      setDisplayedMedia(shuffled.slice(0, mediaPerPage));
      setHasInitialized(true);
    }
  }, [filteredMedia, hasInitialized]);

  /**
   * Handles changing the active category filter.
   * It triggers animations for the filter buttons and gallery items,
   * then updates the displayed media.
   * @param {string} categoryId - The ID of the category to switch to.
   * @async
   */
  const handleCategoryChange = async (categoryId: string) => {
    if (categoryId === selectedCategory || isFilterTransitioning) return;
    
    setIsFilterTransitioning(true);
    
    const activeButton = categoryFilterRef.current?.querySelector(`[data-category="${categoryId}"]`);
    if (activeButton) {
      animations.categoryFilterAnimation(activeButton);
    }
    
    if (galleryRef.current) {
      const items = galleryRef.current.querySelectorAll('.gallery-item');
      await animations.fadeOut(Array.from(items));
    }
    
    setSelectedCategory(categoryId);
    setCurrentPage(0);
    
    const newFiltered = categoryId === 'all' ? allMedia : allMedia.filter(item => item.category === categoryId);
    const shuffled = shuffleArray(newFiltered);
    setDisplayedMedia(shuffled.slice(0, mediaPerPage));
    
    setTimeout(() => {
      if (galleryRef.current) {
        const items = galleryRef.current.querySelectorAll('.gallery-item');
        animations.fadeIn(Array.from(items));
      }
      setIsFilterTransitioning(false);
    }, 200);
  };

  useEffect(() => {
    animations.initScrollAnimations();
  }, []);

  /**
   * Loads the next page of media items into the gallery.
   */
  const loadMoreMedia = () => {
    const shuffled = shuffleArray(filteredMedia);
    const nextPage = currentPage + 1;
    const startIndex = nextPage * mediaPerPage;
    const endIndex = startIndex + mediaPerPage;
    const newMedia = shuffled.slice(startIndex, endIndex);
    
    setDisplayedMedia(prev => [...prev, ...newMedia]);
    setCurrentPage(nextPage);
  };

  /**
   * Opens the lightbox to display the selected media item.
   * @param {number} index - The index of the media item to display.
   */
  const openLightbox = (index: number) => {
    setCurrentMediaIndex(index);
    setLightboxOpen(true);
  };

  /**
   * Closes the lightbox.
   */
  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  /**
   * Navigates to the next or previous item in the lightbox.
   * @param {'prev' | 'next'} direction - The direction to navigate.
   */
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
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-space font-light mb-8">
            A curated collection of visual stories, creative expressions, and artistic endeavors
          </p>
          
          {/* Category Filter */}
          <div 
            ref={categoryFilterRef}
            className="flex flex-wrap justify-center gap-3 mb-8 max-w-4xl mx-auto"
          >
            {categories.map((category) => (
              <button
                key={category.id}
                data-category={category.id}
                onClick={() => handleCategoryChange(category.id)}
                disabled={isFilterTransitioning}
                className={`
                  px-6 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105
                  ${selectedCategory === category.id 
                    ? `bg-gradient-to-r ${category.color} text-white shadow-lg` 
                    : 'bg-white/10 backdrop-blur-sm border border-white/20 text-gray-300 hover:bg-white/20'
                  }
                  ${isFilterTransitioning ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <span className="flex items-center gap-2">
                  {category.id === 'all' && <Grid className="w-4 h-4" />}
                  {category.id !== 'all' && <Filter className="w-4 h-4" />}
                  {category.label}
                  {selectedCategory === category.id && (
                    <span className="ml-2 px-2 py-1 bg-white/20 rounded-full text-xs">
                      {filteredMedia.length}
                    </span>
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>
        
        <div 
          ref={galleryRef}
          className="columns-2 sm:columns-3 lg:columns-4 gap-2 md:gap-3"
        >
          {displayedMedia.map((media, index) => (
            <div
              key={`${media.id}-${index}`}
              className="gallery-item relative mb-2 md:mb-3 break-inside-avoid cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:z-10 group"
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
              {/* Category badge */}
              <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className={`
                  px-2 py-1 text-xs font-medium rounded-full bg-gradient-to-r 
                  ${categories.find(cat => cat.id === media.category)?.color || 'from-gray-500 to-slate-500'}
                  text-white shadow-lg backdrop-blur-sm
                `}>
                  {categories.find(cat => cat.id === media.category)?.label || 'General'}
                </span>
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3 rounded-lg">
                <p className="text-white text-xs font-medium line-clamp-2">{media.caption}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Results count and Load More section */}
        <div className="text-center mt-12 space-y-4">
          <div className="text-sm text-muted-foreground">
            Showing {displayedMedia.length} of {filteredMedia.length} {selectedCategory === 'all' ? 'items' : categories.find(cat => cat.id === selectedCategory)?.label.toLowerCase()}
          </div>
          
          {displayedMedia.length < filteredMedia.length && (
            <button
              onClick={loadMoreMedia}
              disabled={isFilterTransitioning}
              className="px-8 py-3 bg-accent-purple hover:bg-accent-purple/80 rounded-full font-semibold transition-all duration-300 hover:scale-105 flex items-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Images className="w-5 h-5" />
              Load More
            </button>
          )}
        </div>
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
