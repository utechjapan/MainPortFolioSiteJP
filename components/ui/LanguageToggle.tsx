// components/ui/LanguageToggle.tsx
import { useEffect, useState } from "react";

export default function LanguageToggle() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => (window.location.href = "https://main-port-folio-site.vercel.app/")}
      className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      aria-label="Switch to English"
    >
      EN
    </button>
  );
}
