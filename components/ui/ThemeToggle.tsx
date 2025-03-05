// components/ui/ThemeToggle.tsx
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Only execute client-side
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <button
      aria-label="Toggle Dark Mode"
      type="button"
      className={`p-3 h-10 w-10 rounded-full bg-light-card dark:bg-dark-card flex items-center justify-center hover:ring-2 ring-primary transition-all ${className}`}
      onClick={toggleTheme}
    >
      {theme === "dark" ? (
        <i className="fas fa-sun text-yellow-500"></i>
      ) : (
        <i className="fas fa-moon text-slate-800"></i>
      )}
    </button>
  );
}
