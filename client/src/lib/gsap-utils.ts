import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const animations = {
  // Entrance animations
  fadeInUp: (element: string | Element, delay: number = 0) => {
    return gsap.fromTo(
      element,
      { opacity: 0, y: 50 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.8, 
        delay,
        ease: "power3.out" 
      }
    );
  },

  fadeInScale: (element: string | Element, delay: number = 0) => {
    return gsap.fromTo(
      element,
      { opacity: 0, scale: 0.8 },
      { 
        opacity: 1, 
        scale: 1, 
        duration: 0.6, 
        delay,
        ease: "power2.out" 
      }
    );
  },

  staggerFadeIn: (elements: string | Element[], stagger: number = 0.1) => {
    return gsap.fromTo(
      elements,
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.6, 
        stagger,
        ease: "power2.out" 
      }
    );
  },

  // Hover animations
  hoverScale: (element: string | Element) => {
    const el = typeof element === "string" ? document.querySelector(element) : element;
    if (!el) return;

    el.addEventListener("mouseenter", () => {
      gsap.to(el, { scale: 1.05, duration: 0.3, ease: "power2.out" });
    });

    el.addEventListener("mouseleave", () => {
      gsap.to(el, { scale: 1, duration: 0.3, ease: "power2.out" });
    });
  },

  // Loading animations
  loadingSequence: (onComplete?: () => void) => {
    const tl = gsap.timeline({ onComplete });
    
    tl.to(".loading-overlay", {
      opacity: 0,
      duration: 0.5,
      ease: "power2.out"
    })
    .to(".loading-overlay", {
      display: "none",
      duration: 0
    });

    return tl;
  },

  // Hero section animation
  heroAnimation: () => {
    const tl = gsap.timeline({ delay: 0.5 });
    
    tl.from(".hero-title", { 
      y: 100, 
      opacity: 0, 
      duration: 1.2, 
      ease: "power3.out" 
    })
    .from(".hero-subtitle", { 
      y: 50, 
      opacity: 0, 
      duration: 0.8, 
      ease: "power3.out" 
    }, "-=0.8")
    .from(".hero-tags", { 
      y: 30, 
      opacity: 0, 
      duration: 0.6, 
      ease: "power3.out" 
    }, "-=0.4")
    .from(".hero-buttons", { 
      y: 30, 
      opacity: 0, 
      duration: 0.6, 
      ease: "power3.out" 
    }, "-=0.2");

    return tl;
  },

  // Gallery animations
  galleryItemEntrance: (element: Element, index: number) => {
    return gsap.fromTo(
      element,
      { 
        opacity: 0, 
        y: 50, 
        scale: 0.8 
      },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        duration: 0.6,
        delay: index * 0.1,
        ease: "power2.out"
      }
    );
  },

  // Lightbox animations
  lightboxOpen: (lightbox: Element, image: Element) => {
    const tl = gsap.timeline();
    
    tl.set(lightbox, { display: "flex" })
    .to(lightbox, { 
      opacity: 1, 
      duration: 0.3,
      ease: "power2.out"
    })
    .fromTo(image, 
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.4, ease: "power2.out" },
      "-=0.1"
    );

    return tl;
  },

  lightboxClose: (lightbox: Element, image: Element, onComplete?: () => void) => {
    const tl = gsap.timeline({ onComplete });
    
    tl.to(image, {
      scale: 0.8,
      opacity: 0,
      duration: 0.3,
      ease: "power2.in"
    })
    .to(lightbox, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.in"
    }, "-=0.1")
    .set(lightbox, { display: "none" });

    return tl;
  },

  // Theme toggle animation
  themeToggle: (element: Element) => {
    return gsap.to(element, {
      rotation: 360,
      duration: 0.5,
      ease: "power2.out"
    });
  },

  // Scroll-triggered animations
  initScrollAnimations: () => {
    // Gallery items batch animation
    ScrollTrigger.batch(".masonry-item", {
      onEnter: (elements) => {
        gsap.fromTo(
          elements,
          { y: 100, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            duration: 0.6, 
            stagger: 0.1, 
            ease: "power3.out" 
          }
        );
      },
      once: true
    });

    // Section titles animation
    ScrollTrigger.batch(".section-title", {
      onEnter: (elements) => {
        gsap.fromTo(
          elements,
          { y: 50, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            duration: 0.8, 
            ease: "power3.out" 
          }
        );
      },
      once: true
    });
  }
};

export { gsap, ScrollTrigger };
