// components/layout/RightSidebar.tsx - Update to include table of contents
import Link from 'next/link';
import { useRouter } from 'next/router';
import TableOfContents from '../blog/TableOfContents';

export default function RightSidebar({ recentPosts, tags, toc = null }) {
  const router = useRouter();
  const isPostPage = router.pathname.startsWith('/blog/') && router.pathname !== '/blog';

  // Use props if available (server-rendered), otherwise use mock data
  const posts = recentPosts || [];
  const tagList = tags || [];

  return (
    <aside className="hidden lg:block fixed top-0 right-0 bottom-0 w-64 bg-dark-sidebar border-l border-gray-700 p-6 overflow-y-auto">
      {/* Table of contents for blog posts */}
      {isPostPage && toc && toc.length > 0 && (
        <div className="mb-10">
          <TableOfContents toc={toc} />
        </div>
      )}

      {/* Recently updated posts */}
      <div className="mb-10">
        <h3 className="text-lg font-bold mb-4 pb-2 border-b border-gray-700 text-white">
          Recent Posts
        </h3>
        {posts.length > 0 ? (
          <ul className="space-y-3">
            {posts.map(post => (
              <li key={post.slug} className="transition-transform hover:translate-x-1">
                <Link 
                  href={`/blog/${post.slug}`} 
                  className="text-gray-400 hover:text-primary text-sm"
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
        <h3 className="text-lg font-bold mb-4 pb-2 border-b border-gray-700 text-white">
          Trending Tags
        </h3>
        {tagList.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {tagList.map(tag => (
              <Link 
                key={tag}
                href={`/blog/tag/${tag}`}
                className="inline-block bg-primary/20 hover:bg-primary/30 text-primary text-xs px-3 py-1 rounded-full transition-colors"
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