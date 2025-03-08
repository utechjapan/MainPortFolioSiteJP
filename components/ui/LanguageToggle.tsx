import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function LanguageToggle() {
  const router = useRouter();
  const { asPath } = router;
  const [targetUrl, setTargetUrl] = useState<string | null>(null);
  const [label, setLabel] = useState<string>("");

  useEffect(() => {
    // Ensure this code runs only on the client.
    if (typeof window !== "undefined") {
      const currentHost = window.location.hostname;
      // Use a simple heuristic: if the hostname includes "jp" or "japan", assume Japanese.
      const isJapanese = currentHost.includes("jp") || currentHost.includes("japan");
      // Map domains accordingly.
      const targetHost = isJapanese
        ? "main-port-folio-site.vercel.app" // target English domain
        : "main-port-folio-site-jp.vercel.app"; // target Japanese domain
      setTargetUrl(`https://${targetHost}${asPath}`);
      setLabel(isJapanese ? "EN" : "日本語");
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
