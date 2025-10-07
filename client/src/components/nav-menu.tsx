/**
 * @fileoverview This file defines the NavMenu component, a floating, toggleable
 * menu that provides site navigation and controls for theme and auto-scrolling.
 */
import { useState } from "react";
import { Menu, X, Sun, Moon, Play, Pause, BookOpen, Package } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { Link } from "wouter";

/**
 * @interface NavMenuProps
 * @description Defines the properties for the NavMenu component.
 * @property {boolean} isScrolling - Indicates whether the auto-scroll feature is currently active.
 * @property {() => void} onToggleScroll - A callback function to toggle the auto-scroll feature.
 */
interface NavMenuProps {
  isScrolling: boolean;
  onToggleScroll: () => void;
}

/**
 * A floating navigation menu component that provides access to different pages
 * of the website, as well as controls for toggling the theme and auto-scroll functionality.
 *
 * @param {NavMenuProps} props - The props for the component.
 * @returns {JSX.Element} The rendered navigation menu component.
 */
export function NavMenu({ isScrolling, onToggleScroll }: NavMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  /**
   * Toggles the visibility of the navigation menu.
   */
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      <button
        onClick={toggleMenu}
        className="fixed top-6 right-6 z-50 p-3 backdrop-blur-xl bg-black/10 dark:bg-white/10 rounded-lg hover:bg-black/20 dark:hover:bg-white/20 transition-all duration-300"
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isOpen}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {isOpen && (
        <div className="fixed top-20 right-6 z-40 backdrop-blur-xl bg-white/90 dark:bg-black/90 rounded-2xl shadow-2xl p-6 min-w-[200px] animate-in slide-in-from-top-5 duration-300">
          <nav className="space-y-4">
            <Link 
              href="/" 
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <span className="font-medium">Home</span>
            </Link>
            
            <Link 
              href="/blog" 
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span className="font-medium">Blog</span>
            </Link>
            
            <Link 
              href="/packages" 
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Package className="w-4 h-4" />
              <span className="font-medium">Packages</span>
            </Link>

            <div className="h-px bg-gray-200 dark:bg-gray-700 my-4" />

            <button
              onClick={onToggleScroll}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors w-full text-left"
            >
              {isScrolling ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span className="font-medium">{isScrolling ? "Pause" : "Play"} Scroll</span>
            </button>

            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors w-full text-left"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              <span className="font-medium">{theme === "dark" ? "Light" : "Dark"} Mode</span>
            </button>
          </nav>
        </div>
      )}
    </>
  );
}