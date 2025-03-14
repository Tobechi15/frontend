import React, { useEffect, useState, createContext, useContext } from "react";
import { SunIcon, MoonIcon } from "lucide-react";
type Theme = "dark" | "light";
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  ThemeToggle: () => JSX.Element;
}
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
export function ThemeProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme as Theme || "dark";
  });
  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);
  const toggleTheme = () => {
    setTheme(prev => prev === "dark" ? "light" : "dark");
  };
  const ThemeToggle = () => <button onClick={toggleTheme} className="p-2 rounded-lg transition-colors dark:hover:bg-slate-700 hover:bg-slate-200" aria-label="Toggle theme">
      {theme === "dark" ? <SunIcon className="w-5 h-5 text-yellow-400" /> : <MoonIcon className="w-5 h-5 text-slate-600" />}
    </button>;
  return <ThemeContext.Provider value={{
    theme,
    toggleTheme,
    ThemeToggle
  }}>
      {children}
    </ThemeContext.Provider>;
}
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};