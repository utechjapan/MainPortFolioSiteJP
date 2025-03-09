import { useState, useEffect, useCallback } from "react";
import { TocItem } from "../../types";

interface TableOfContentsProps {
  toc: TocItem[];
}

export default function TableOfContents({ toc }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  // Throttle function to prevent too many updates
  const throttle = (func: Function, delay: number) => {
    let lastCall = 0;
    return (...args: any[]) => {
      const now = new Date().getTime();
      if (now - lastCall < delay) {
        return;
      }
      lastCall = now;
      return func(...args);
    };
  };

  // Handle click on TOC item
  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // Set a fixed offset (e.g., header height) so the heading isn't hidden behind a fixed header
      const headerOffset = 80; // adjust this value as needed
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      // Set the active TOC item immediately for better UX
      setActiveId(id);
    }
  };

  // Observe headings to update active TOC item
  useEffect(() => {
    if (!toc || toc.length === 0) return;

    // Simple approach - just observe all headings
    const observer = new IntersectionObserver(
      throttle((entries: IntersectionObserverEntry[]) => {
        // Find the first visible heading
        const visibleHeadings = entries.filter(
          entry => entry.isIntersecting && entry.target.id
        );
        
        if (visibleHeadings.length > 0) {
          const firstVisibleHeading = visibleHeadings[0];
          setActiveId(firstVisibleHeading.target.id);
        }
      }, 100),
      { rootMargin: "-100px 0px -40% 0px", threshold: 0.1 }
    );

    // Observe all h2, h3, h4 headings directly
    const headings = document.querySelectorAll("h2, h3, h4");
    headings.forEach(heading => {
      if (heading) observer.observe(heading);
    });

    // Cleanup function to disconnect observer
    return () => {
      observer.disconnect();
    };
  }, [toc]);

  if (!toc || toc.length === 0) return null;

  return (
    <div className="mb-8 sticky top-4">
      <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-700 pb-2 transition-colors">
        目次
      </h3>
      <nav className="overflow-y-auto max-h-[70vh]">
        <ul className="space-y-2">
          {toc.map((item) => (
            <li
              key={item.id}
              style={{ paddingLeft: `${(item.level - 2) * 0.75}rem` }}
              className="overflow-hidden"
            >
              <button
                onClick={() => handleClick(item.id)}
                className={`text-left text-sm hover:text-primary transition-colors truncate w-full ${
                  activeId === item.id
                    ? "text-primary font-medium"
                    : "text-gray-600 dark:text-gray-400"
                }`}
                title={item.text}
              >
                {item.text}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}