import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { animations } from "@/lib/gsap-utils";
import { useRef } from "react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const buttonRef = useRef<HTMLButtonElement>(null);

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
      className="fixed top-8 right-8 z-[100] w-15 h-15 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 hover:bg-white/20"
    >
      {theme === "dark" ? (
        <Sun className="w-6 h-6 text-white" />
      ) : (
        <Moon className="w-6 h-6 text-gray-800" />
      )}
    </button>
  );
}
