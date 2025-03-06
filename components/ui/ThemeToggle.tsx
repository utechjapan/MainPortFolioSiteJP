// components/ui/ThemeToggle.tsx
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

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
        <i className="fa-solid fa-sun text-yellow-500 text-xl"></i>
      ) : (
        <i className="fa-solid fa-moon text-gray-800 text-xl"></i>
      )}
    </button>
  );
}
