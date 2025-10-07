/**
 * @fileoverview This file centralizes all GSAP (GreenSock Animation Platform)
 * animations used throughout the application. It provides a collection of reusable
 * animation functions for various UI elements and interactions.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * @description A collection of reusable GSAP animation functions.
 */
export const animations = {
  /**
   * Animates an element by fading it in and moving it up.
   * @param {string | Element} element - The target element or selector.
   * @param {number} [delay=0] - The delay before the animation starts.
   * @returns {gsap.core.Tween} The GSAP tween instance.
   */
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

  /**
   * Animates an element by fading it in and scaling it up.
   * @param {string | Element} element - The target element or selector.
   * @param {number} [delay=0] - The delay before the animation starts.
   * @returns {gsap.core.Tween} The GSAP tween instance.
   */
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

  /**
   * Animates a list of elements by fading them in with a stagger effect.
   * @param {string | Element[]} elements - The target elements or selector.
   * @param {number} [stagger=0.1] - The stagger delay between each element's animation.
   * @returns {gsap.core.Tween} The GSAP tween instance.
   */
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

  /**
   * Adds a hover effect to an element that scales it up and down.
   * @param {string | Element} element - The target element or selector.
   */
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

  /**
   * Defines the animation sequence for the loading overlay.
   * @param {() => void} [onComplete] - A callback function to execute when the animation completes.
   * @returns {gsap.core.Timeline} The GSAP timeline instance.
   */
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

  /**
   * Defines the entrance animation for the hero section elements.
   * @returns {gsap.core.Timeline} The GSAP timeline instance.
   */
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

  /**
   * Defines the entrance animation for a single gallery item.
   * @param {Element} element - The gallery item element.
   * @param {number} index - The index of the item, used for staggering the delay.
   * @returns {gsap.core.Tween} The GSAP tween instance.
   */
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

  /**
   * Defines the animation for opening the lightbox.
   * @param {Element} lightbox - The lightbox container element.
   * @param {Element} image - The image or media element inside the lightbox.
   * @returns {gsap.core.Timeline} The GSAP timeline instance.
   */
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

  /**
   * Defines the animation for closing the lightbox.
   * @param {Element} lightbox - The lightbox container element.
   * @param {Element} image - The image or media element inside the lightbox.
   * @param {() => void} [onComplete] - A callback function to execute when the animation completes.
   * @returns {gsap.core.Timeline} The GSAP timeline instance.
   */
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

  /**
   * Animates the theme toggle button on click.
   * @param {Element} element - The theme toggle button element.
   * @returns {gsap.core.Tween} The GSAP tween instance.
   */
  themeToggle: (element: Element) => {
    return gsap.to(element, {
      rotation: 360,
      duration: 0.5,
      ease: "power2.out"
    });
  },

  /**
   * Animates a list of elements by fading them out.
   * @param {Element[]} elements - The array of elements to animate.
   * @returns {Promise<void>} A promise that resolves when the animation is complete.
   */
  fadeOut: (elements: Element[]) => {
    return new Promise<void>((resolve) => {
      gsap.to(elements, {
        opacity: 0,
        y: -30,
        scale: 0.9,
        duration: 0.4,
        stagger: 0.05,
        ease: "power2.in",
        onComplete: resolve
      });
    });
  },

  /**
   * Animates a list of elements by fading them in.
   * @param {Element[]} elements - The array of elements to animate.
   * @returns {gsap.core.Tween} The GSAP tween instance.
   */
  fadeIn: (elements: Element[]) => {
    return gsap.fromTo(
      elements,
      { 
        opacity: 0, 
        y: 30, 
        scale: 0.9 
      },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        duration: 0.6,
        stagger: 0.08,
        ease: "power3.out"
      }
    );
  },

  /**
   * Animates the active category filter button.
   * @param {Element} activeButton - The button element to animate.
   * @returns {gsap.core.Tween} The GSAP tween instance.
   */
  categoryFilterAnimation: (activeButton: Element) => {
    return gsap.to(activeButton, {
      scale: 1.1,
      duration: 0.2,
      ease: "power2.out",
      yoyo: true,
      repeat: 1
    });
  },

  /**
   * Initializes all scroll-triggered animations for the site.
   * This uses GSAP's ScrollTrigger batch functionality for performance.
   */
  initScrollAnimations: () => {
    // Gallery items batch animation
    ScrollTrigger.batch(".gallery-item", {
      onEnter: (elements) => {
        gsap.fromTo(
          elements,
          { y: 100, opacity: 0, scale: 0.8 },
          { 
            y: 0, 
            opacity: 1, 
            scale: 1,
            duration: 0.8, 
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
