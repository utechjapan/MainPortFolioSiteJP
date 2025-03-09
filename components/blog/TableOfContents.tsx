// components/blog/TableOfContents.tsx
import { useState, useEffect } from "react";
import { TocItem } from "../../types";

interface TableOfContentsProps {
  toc: TocItem[];
}

export default function TableOfContents({ toc }: TableOfContentsProps) {
  // Filter to only level 2 headings (adjust if needed)
  const filteredToc = toc.filter((item) => item.level === 2);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (filteredToc.length === 0) return;

    // Function to handle intersection updates
    const handleIntersections = (entries: IntersectionObserverEntry[]) => {
      // Find all entries that are intersecting
      const visibleEntries = entries.filter(entry => entry.isIntersecting && entry.target.id);
      if (visibleEntries.length > 0) {
        // Sort by vertical position (closest to top)
        visibleEntries.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        setActiveId(visibleEntries[0].target.id);
      }
    };

    // Create the IntersectionObserver with an offset to trigger when heading crosses near top
    const observer = new IntersectionObserver(handleIntersections, {
      rootMargin: "-40% 0px -40% 0px",
      threshold: 0,
    });

    // Loop through each toc item, get its element by id and observe it
    filteredToc.forEach((item) => {
      const elem = document.getElementById(item.id);
      if (elem) {
        observer.observe(elem);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [filteredToc]);

  // When a TOC item is clicked, scroll smoothly to it.
  const handleClick = (id: string) => {
    const elem = document.getElementById(id);
    if (elem) {
      // Adjust headerOffset if you have a fixed header (set to 80px here)
      const headerOffset = 80;
      const elemPosition = elem.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elemPosition - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setActiveId(id);
    }
  };

  if (filteredToc.length === 0) return null;

  return (
    <div className="mb-8 sticky top-4">
      <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-700 pb-2 transition-colors">
        目次
      </h3>
      <nav className="overflow-y-auto max-h-[70vh]">
        <ul className="space-y-2">
          {filteredToc.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleClick(item.id)}
                className={`text-left text-sm truncate w-full transition-colors ${
                  activeId === item.id
                    ? "text-primary font-medium"
                    : "text-gray-600 dark:text-gray-400 hover:text-primary"
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
