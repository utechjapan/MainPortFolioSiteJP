// components/ui/LanguageToggle.tsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function LanguageToggle() {
  const router = useRouter();
  const { asPath } = router;
  const [currentHost, setCurrentHost] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentHost(window.location.hostname);
    }
  }, []);

  // If current host starts with "en.", then we are on the English version
  const isEnglish = currentHost.startsWith("en.");
  // Toggle: if currently English, go to Japanese domain; otherwise go to English domain
  const targetHost = isEnglish ? "utechjapan.net" : "en.utechjapan.net";
  const targetUrl = `https://${targetHost}${asPath}`;
  const label = isEnglish ? "日本語" : "EN";

  return (
    <button
      onClick={() => (window.location.href = targetUrl)}
      className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      aria-label="言語切替"
    >
      {label}
    </button>
  );
}
