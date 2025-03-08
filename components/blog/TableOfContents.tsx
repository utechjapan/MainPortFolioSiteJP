import { useState, useEffect } from "react";
import { TocItem } from "../../types";

interface TableOfContentsProps {
  toc: TocItem[];
}

export default function TableOfContents({ toc }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (toc.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -40% 0px", threshold: 0.1 }
    );

    // Observe all headings (h2, h3, h4) in the blog content
    const headings = document.querySelectorAll("h2, h3, h4");
    headings.forEach((heading) => observer.observe(heading));

    return () => {
      headings.forEach((heading) => observer.unobserve(heading));
    };
  }, [toc]);

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

  if (toc.length === 0) return null;

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
