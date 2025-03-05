// components/ui/ThemeToggle.tsx
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  // Only execute client-side
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  // Determine actual theme
  const currentTheme = theme === "system" ? resolvedTheme : theme;

  const toggleTheme = () => {
    setTheme(currentTheme === "dark" ? "light" : "dark");
  };

  return (
    <button
      aria-label="Toggle Dark Mode"
      type="button"
      className={`p-3 h-10 w-10 rounded-full bg-light-card dark:bg-dark-card flex items-center justify-center hover:ring-2 ring-primary transition-all ${className}`}
      onClick={toggleTheme}
    >
      {currentTheme === "dark" ? (
        // Sun icon for dark mode
        <i className="fas fa-sun text-yellow-500"></i>
      ) : (
        // Moon icon for light mode
        <i className="fas fa-moon text-gray-800"></i>
      )}
    </button>
  );
}