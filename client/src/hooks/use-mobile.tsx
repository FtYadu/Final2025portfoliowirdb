/**
 * @fileoverview This file defines the useIsMobile hook, a utility for detecting
 * whether the application is being viewed on a mobile-sized screen.
 */
import * as React from "react"

/**
 * @constant {number} MOBILE_BREAKPOINT - The pixel width at which the layout is considered mobile.
 */
const MOBILE_BREAKPOINT = 768

/**
 * A custom React hook that determines if the current viewport width is below
 * a defined mobile breakpoint. It listens for window resize events to provide
 * a reactive boolean value.
 *
 * @returns {boolean} `true` if the viewport is considered mobile, otherwise `false`.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
