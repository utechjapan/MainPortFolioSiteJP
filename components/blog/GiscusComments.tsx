// components/blog/GiscusComments.tsx
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { siteConfig } from "../../lib/siteConfig";

interface GiscusCommentsProps {
  slug: string;
}

export default function GiscusComments({ slug }: GiscusCommentsProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const giscusConfig = siteConfig.comments.giscusConfig;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Determine theme to use
    const theme = resolvedTheme === "dark" ? "dark" : "light";

    // Clean up existing comments
    const commentsDiv = document.getElementById("giscus-comments");
    if (commentsDiv) {
      commentsDiv.innerHTML = "";

      // Create and configure the script
      const script = document.createElement("script");
      script.src = "https://giscus.app/client.js";
      script.setAttribute("data-repo", giscusConfig.repo);
      script.setAttribute("data-repo-id", giscusConfig.repoId);
      script.setAttribute("data-category", giscusConfig.category);
      script.setAttribute("data-category-id", giscusConfig.categoryId);
      script.setAttribute("data-mapping", "pathname");
      script.setAttribute("data-strict", "0");
      script.setAttribute("data-reactions-enabled", "1");
      script.setAttribute("data-emit-metadata", "0");
      script.setAttribute("data-input-position", "top");
      script.setAttribute("data-theme", theme);
      script.setAttribute("data-lang", "en");
      script.setAttribute("crossorigin", "anonymous");
      script.setAttribute("async", "true");

      // Add the script to the DOM
      commentsDiv.appendChild(script);
    }

    return () => {
      if (commentsDiv) {
        commentsDiv.innerHTML = "";
      }
    };
  }, [mounted, resolvedTheme, slug, giscusConfig]);

  if (!mounted) return null;

  return (
    <section className="pt-10 mt-10 border-t border-gray-300 dark:border-gray-700 transition-colors">
      <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white transition-colors">
        Comments
      </h2>
      <div id="giscus-comments"></div>
    </section>
  );
}
