// components/blog/BlogCard.tsx
import Link from 'next/link';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import Tag from '../ui/Tag';
import { Post } from '../../types';

interface BlogCardProps {
  post: Post;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="bg-dark-card rounded-lg overflow-hidden transition-transform hover:-translate-y-1 duration-300">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative h-48 w-full">
          <Image 
            src={post.frontMatter.image || '/images/placeholder.jpg'} 
            alt={post.frontMatter.title} 
            fill
            className="object-cover"
          />
        </div>
      </Link>
      
      <div className="p-6">
        <div className="flex items-center text-sm text-gray-400 mb-3">
          <time dateTime={post.frontMatter.date} className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {format(parseISO(post.frontMatter.date), 'MMMM d, yyyy')}
          </time>
          <span className="mx-2">•</span>
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {post.frontMatter.readingTime || '5 min read'}
          </span>
        </div>
        
        <Link href={`/blog/${post.slug}`}>
          <h3 className="text-xl font-bold mb-2 text-white hover:text-primary transition-colors">
            {post.frontMatter.title}
          </h3>
        </Link>
        
        <p className="text-gray-400 mb-4 line-clamp-2">
          {post.frontMatter.description}
        </p>
        
        {post.frontMatter.tags && (
          <div className="flex flex-wrap gap-2">
            {post.frontMatter.tags.slice(0, 3).map(tag => (
              <Tag key={tag} text={tag} href={`/blog/tag/${tag}`} />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

// components/blog/BlogMeta.tsx
import { format, parseISO } from 'date-fns';

interface BlogMetaProps {
  date: string;
  readingTime?: string;
}

export default function BlogMeta({ date, readingTime }: BlogMetaProps) {
  return (
    <div className="flex flex-wrap items-center text-sm text-gray-400 gap-x-4">
      <time dateTime={date} className="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {format(parseISO(date), 'MMMM d, yyyy')}
      </time>
      
      {readingTime && (
        <span className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {readingTime}
        </span>
      )}
    </div>
  );
}

// components/blog/GiscusComments.tsx
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { siteConfig } from '../../lib/siteConfig';

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

    const theme = resolvedTheme === 'dark' ? 'dark' : 'light';
    
    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', giscusConfig.repo);
    script.setAttribute('data-repo-id', giscusConfig.repoId);
    script.setAttribute('data-category', giscusConfig.category);
    script.setAttribute('data-category-id', giscusConfig.categoryId);
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'top');
    script.setAttribute('data-theme', theme);
    script.setAttribute('data-lang', 'en');
    script.setAttribute('crossorigin', 'anonymous');
    script.setAttribute('async', 'true');
    
    const commentsDiv = document.getElementById('giscus-comments');
    if (commentsDiv) {
      // Clear any existing comments container first
      commentsDiv.innerHTML = '';
      commentsDiv.appendChild(script);
    }
    
    return () => {
      if (commentsDiv) {
        commentsDiv.innerHTML = '';
      }
    };
  }, [mounted, resolvedTheme, slug, giscusConfig]);

  if (!mounted) return null;

  return (
    <section className="pt-10 mt-10 border-t border-gray-700">
      <h2 className="text-2xl font-bold mb-8 text-white">Comments</h2>
      <div id="giscus-comments"></div>
    </section>
  );
}

// components/blog/TableOfContents.tsx
import { useState, useEffect } from 'react';
import { TocItem } from '../../types';

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