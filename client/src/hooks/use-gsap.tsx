import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

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

export interface GSAPContext {
  gsap: typeof gsap;
  ScrollTrigger: typeof ScrollTrigger;
}

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
