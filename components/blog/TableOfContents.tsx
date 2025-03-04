// components/blog/TableOfContents.tsx - Update to appear inside the right sidebar
import { useState, useEffect } from 'react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  toc: TocItem[];
}

export default function TableOfContents({ toc }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -40% 0px', threshold: 0.1 }
    );
    
    // Observe all section headings
    const headings = document.querySelectorAll('h2, h3, h4');
    headings.forEach(heading => observer.observe(heading));
    
    return () => {
      headings.forEach(heading => observer.unobserve(heading));
    };
  }, []);

  // Handle click to scroll to heading
  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: 'smooth'
      });
    }
  };

  if (toc.length === 0) return null;

  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold mb-4 text-white border-b border-gray-700 pb-2">Contents</h3>
      <nav>
        <ul className="space-y-2">
          {toc.map((item) => (
            <li 
              key={item.id}
              style={{ paddingLeft: `${(item.level - 2) * 0.75}rem` }}
            >
              <button
                onClick={() => handleClick(item.id)}
                className={`text-left text-sm hover:text-primary transition-colors ${
                  activeId === item.id 
                    ? 'text-primary font-medium' 
                    : 'text-gray-400'
                }`}
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