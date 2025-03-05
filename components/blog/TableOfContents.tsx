// components/blog/TableOfContents.tsx
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

    // Observe all section headings
    const headings = document.querySelectorAll("h2, h3, h4");
    headings.forEach((heading) => observer.observe(heading));

    return () => {
      headings.forEach((heading) => observer.unobserve(heading));
    };
  }, [toc]);

  // Handle click to scroll to heading
  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // Get header height for offset calculation
      const headerOffset = window.innerWidth < 768 ? 60 : 0; // Mobile header height is about 60px
      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset - 20; // Extra 20px padding

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      // Set active ID immediately for better UX
      setActiveId(id);
    }
  };

  if (toc.length === 0) return null;

  return (
    <div className="mb-8 sticky top-4">
      <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-700 pb-2 transition-colors">
        Contents
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
