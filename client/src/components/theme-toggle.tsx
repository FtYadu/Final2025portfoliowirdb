/**
 * @fileoverview This file defines the ThemeToggle component, a button for
 * switching between light and dark color themes.
 */
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { animations } from "@/lib/gsap-utils";
import { useRef } from "react";

/**
 * A floating button component that allows the user to toggle the application's
 * color theme between light and dark modes. It uses a custom hook `useTheme`
 * to manage the theme state and GSAP for a subtle animation on toggle.
 *
 * @returns {JSX.Element} The rendered theme toggle button.
 */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const buttonRef = useRef<HTMLButtonElement>(null);

  /**
   * Handles the click event on the toggle button.
   * It triggers a GSAP animation and then calls the `toggleTheme` function.
   */
  const handleToggle = () => {
    if (buttonRef.current) {
      animations.themeToggle(buttonRef.current);
    }
    toggleTheme();
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleToggle}
      className="fixed top-8 right-8 z-[100] w-12 h-12 p-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 hover:bg-white/20"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === "dark" ? (
        <Sun className="w-6 h-6 text-white" />
      ) : (
        <Moon className="w-6 h-6 text-gray-800" />
      )}
    </button>
  );
}
