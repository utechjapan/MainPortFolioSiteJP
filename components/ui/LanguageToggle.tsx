import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function LanguageToggle() {
  const router = useRouter();
  const [targetUrl, setTargetUrl] = useState<string | null>(null);
  const [label, setLabel] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentHost = window.location.hostname;
      const asPath = router.asPath;
      const isEnglish = currentHost.startsWith("en.");
      const targetHost = isEnglish ? "utechjapan.net" : "en.utechjapan.net";
      setTargetUrl(`https://${targetHost}${asPath}`);
      setLabel(isEnglish ? "日本語" : "EN");
    }
  }, [router.asPath]);

  if (!targetUrl) return null;

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
