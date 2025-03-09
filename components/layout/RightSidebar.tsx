// components/layout/RightSidebar.tsx
import Link from "next/link";
import { useRouter } from "next/router";
import TableOfContents from "../blog/TableOfContents";
import { RecentPost, TocItem } from "../../types";
import { useEffect, useState } from "react";

interface RightSidebarProps {
  recentPosts?: RecentPost[];
  tags?: string[];
  toc?: TocItem[] | null;
}

export default function RightSidebar({
  recentPosts = [],
  tags = [],
  toc = null,
}: RightSidebarProps) {
  const router = useRouter();
  const isPostPage =
    router.pathname.startsWith("/blog/") && router.pathname !== "/blog";

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <aside className="h-full pt-6 overflow-y-auto">
      {/* Table of contents for blog posts */}
      {isPostPage && toc && toc.length > 0 && (
        <div className="mb-10">
          <TableOfContents toc={toc} />
        </div>
      )}

      {/* Recently updated posts */}
      <div className="mb-10">
        <h3 className="text-lg font-bold mb-4 pb-2 border-b border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white transition-colors">
          Recent Posts
        </h3>
        {recentPosts.length > 0 ? (
          <ul className="space-y-3">
            {recentPosts.map((post) => (
              <li
                key={post.slug}
                className="transition-transform hover:translate-x-1 overflow-hidden"
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary text-sm transition-colors block truncate"
                  title={post.title}
                >
                  <i className="fas fa-angle-right mr-2 text-primary/70"></i>
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">No recent posts yet.</p>
        )}
      </div>

      {/* Popular tags */}
      <div>
        <h3 className="text-lg font-bold mb-4 pb-2 border-b border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white transition-colors">
          Trending Tags
        </h3>
        {tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog/tag/${tag}`}
                className="inline-block bg-primary/20 hover:bg-primary/30 text-primary text-xs px-3 py-1 rounded-full transition-colors mb-2"
              >
                {tag}
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No tags available yet.</p>
        )}
      </div>
    </aside>
  );
}