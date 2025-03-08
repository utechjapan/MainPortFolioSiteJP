// components/ui/LanguageToggle.tsx
import { useRouter } from "next/router";

export default function LanguageToggle() {
  const router = useRouter();
  const { asPath } = router;

  // Check if current route is Japanese (i.e. starts with "/jp")
  const isJapanese = asPath.startsWith("/jp");

  // Determine target path and label:
  // If currently Japanese, remove "/jp" prefix; otherwise add "/jp"
  const targetPath = isJapanese ? asPath.replace(/^\/jp/, "") || "/" : `/jp${asPath}`;
  const label = isJapanese ? "EN" : "日本語";

  return (
    <button
      onClick={() => router.push(targetPath)}
      className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      aria-label="Toggle Language"
    >
      {label}
    </button>
  );
}
