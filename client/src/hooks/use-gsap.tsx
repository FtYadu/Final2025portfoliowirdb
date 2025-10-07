/**
 * @fileoverview This file defines custom React hooks for working with the GSAP
 * animation library, providing convenient wrappers for common animation patterns
 * like context-safe animations, timelines, and scroll triggers.
 */
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

/**
 * @interface GSAPContext
 * @description Defines the context object passed to GSAP-related callbacks.
 * @property {typeof gsap} gsap - The GSAP instance.
 * @property {typeof ScrollTrigger} ScrollTrigger - The ScrollTrigger plugin instance.
 */
export interface GSAPContext {
  gsap: typeof gsap;
  ScrollTrigger: typeof ScrollTrigger;
}

/**
 * A custom hook that provides a context-safe environment for running GSAP animations.
 * It automatically handles the cleanup of animations when the component unmounts.
 *
 * @param {(context: GSAPContext) => void} callback - A function that receives the GSAP context and contains the animation logic.
 * @param {any[]} [dependencies=[]] - An array of dependencies that, when changed, will cause the effect to re-run.
 * @returns {React.RefObject<HTMLElement>} A ref object to be attached to the component's root element.
 */
export function useGSAP(callback: (context: GSAPContext) => void, dependencies: any[] = []) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      callback({ gsap, ScrollTrigger });
    }, ref);

    return () => ctx.revert();
  }, dependencies);

  return ref;
}

/**
 * A custom hook for creating and managing a GSAP timeline instance.
 * The timeline is automatically created on mount and killed on unmount.
 *
 * @param {any[]} [dependencies=[]] - An array of dependencies that, when changed, will cause the timeline to be re-created.
 * @returns {gsap.core.Timeline | null} The GSAP timeline instance, or null if not yet created.
 */
export function useGSAPTimeline(dependencies: any[] = []) {
  const timeline = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    timeline.current = gsap.timeline();
    return () => {
      timeline.current?.kill();
    };
  }, dependencies);

  return timeline.current;
}

/**
 * A custom hook for creating scroll-triggered GSAP animations.
 * It simplifies the process of setting up and cleaning up ScrollTrigger instances.
 *
 * @param {React.RefObject<HTMLElement>} element - A ref to the element that will be the scope of the animation.
 * @param {(ctx: GSAPContext) => void} animation - A function that contains the ScrollTrigger animation logic.
 * @param {ScrollTrigger.Vars} [options={}] - Optional configuration options for the ScrollTrigger instance.
 * @param {any[]} [dependencies=[]] - An array of dependencies that, when changed, will cause the effect to re-run.
 */
export function useScrollTrigger(
  element: React.RefObject<HTMLElement>,
  animation: (ctx: GSAPContext) => void,
  options: ScrollTrigger.Vars = {},
  dependencies: any[] = []
) {
  useEffect(() => {
    if (!element.current) return;

    const ctx = gsap.context(() => {
      animation({ gsap, ScrollTrigger });
    }, element);

    return () => ctx.revert();
  }, [element, ...dependencies]);
}
