/**
 * @fileoverview This file defines a React context and provider for managing
 * the application's color theme (light or dark).
 */
import { createContext, useContext, useEffect, useState } from "react";

/**
 * @type {'dark' | 'light'} Theme
 * @description Defines the possible theme values.
 */
type Theme = "dark" | "light";

/**
 * @typedef {object} ThemeProviderProps
 * @description Props for the ThemeProvider component.
 * @property {React.ReactNode} children - The child components to be rendered within the provider.
 * @property {Theme} [defaultTheme='dark'] - The default theme to use.
 * @property {string} [storageKey='yadu-portfolio-theme'] - The key to use for storing the theme in local storage.
 */
type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

/**
 * @typedef {object} ThemeProviderState
 * @description The shape of the context value provided by ThemeProvider.
 * @property {Theme} theme - The current active theme.
 * @property {(theme: Theme) => void} setTheme - Function to set a specific theme.
 * @property {() => void} toggleTheme - Function to toggle between light and dark themes.
 */
type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const initialState: ThemeProviderState = {
  theme: "dark",
  setTheme: () => null,
  toggleTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

/**
 * A React component that provides theme management capabilities to its children.
 * It handles theme persistence in local storage and applies the current theme
 * class to the document's root element.
 *
 * @param {ThemeProviderProps} props - The props for the component.
 * @returns {JSX.Element} The theme provider component.
 */
export function ThemeProvider({
  children,
  defaultTheme = "dark",
  storageKey = "yadu-portfolio-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
    toggleTheme: () => {
      const newTheme = theme === "light" ? "dark" : "light";
      localStorage.setItem(storageKey, newTheme);
      setTheme(newTheme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

/**
 * A custom hook for accessing the theme context.
 * It provides the current theme and functions to update it.
 * This hook must be used within a `ThemeProvider`.
 *
 * @returns {ThemeProviderState} The theme context value.
 * @throws {Error} If used outside of a `ThemeProvider`.
 */
export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
