// components/layout/Layout.tsx
import { ReactNode, useState } from 'react';
import Sidebar from './Sidebar';
import RightSidebar from './RightSidebar';
import MobileMenu from './MobileMenu';
import ThemeToggle from '../ui/ThemeToggle';
import Footer from './Footer';
import BackToTop from '../ui/BackToTop';
import { RecentPost, TocItem } from '../../types';

interface LayoutProps {
  children: ReactNode;
  rightSidebar?: boolean;
  recentPosts?: RecentPost[];
  tags?: string[];
  toc?: TocItem[] | null;
}

export default function Layout({
  children,
  rightSidebar = true,
  recentPosts = [],
  tags = [],
  toc = null,
}: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-dark-bg text-gray-300">
      {/* Sidebar */}
      <Sidebar isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />

      {/* Mobile menu button */}
      <div className="fixed top-0 left-0 right-0 z-50 md:hidden bg-dark-bg border-b border-gray-700 py-3 px-4 flex justify-between items-center">
        <button
          className="p-2 rounded-md bg-primary/80 backdrop-blur-sm text-white hover:bg-primary transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        <span className="text-lg font-bold text-white">UTechLab</span>

        <ThemeToggle className="py-1 px-1" />
      </div>

      {/* Mobile menu overlay */}
      <MobileMenu isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />

      {/* Main content */}
      <main className="flex-1 ml-0 md:ml-72 transition-all duration-300 ease-in-out pt-14 md:pt-0">
        <div className={`p-6 md:p-8 lg:p-10 ${rightSidebar ? 'lg:mr-64' : ''}`}>
          {children}
          <Footer />
        </div>
      </main>

      {/* Right sidebar */}
      {rightSidebar && <RightSidebar recentPosts={recentPosts} tags={tags} toc={toc} />}

      {/* Back to top button */}
      <BackToTop />
    </div>
  );
}

// components/layout/MobileMenu.tsx
interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function MobileMenu({ isOpen, setIsOpen }: MobileMenuProps) {
  if (!isOpen) return null;
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
      onClick={() => setIsOpen(false)}
    ></div>
  );
}

// components/layout/RightSidebar.tsx
import Link from 'next/link';
import { useRouter } from 'next/router';
import TableOfContents from '../blog/TableOfContents';
import { RecentPost, TocItem } from '../../types';

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
  const isPostPage = router.pathname.startsWith('/blog/') && router.pathname !== '/blog';

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
        {recentPosts.length > 0 ? (
          <ul className="space-y-3">
            {recentPosts.map(post => (
              <li key={post.slug} className="transition-transform hover:translate-x-1">
                <Link href={`/blog/${post.slug}`} className="text-gray-400 hover:text-primary text-sm">
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
        {tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
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

// components/layout/Sidebar.tsx
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { siteConfig } from '../../lib/siteConfig';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const router = useRouter();

  return (
    <aside 
      className={`fixed top-0 left-0 bottom-0 w-72 bg-light-sidebar dark:bg-dark-sidebar border-r border-light-border dark:border-dark-border transition-transform duration-300 z-30 ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      <div className="h-full flex flex-col justify-between py-8">
        <div className="px-6">
          {/* Profile section */}
          <div className="flex flex-col items-center mb-8">
            <Link href="/" className="mb-4">
              <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-primary/50 hover:border-primary transition-colors duration-300">
                <Image 
                  src={siteConfig.author.avatar} 
                  alt={siteConfig.author.name}
                  fill
                  className="object-cover"
                />
              </div>
            </Link>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              {siteConfig.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              {siteConfig.description}
            </p>
          </div>
          
          {/* Navigation */}
          <nav className="mb-8">
            <ul className="space-y-2">
              {siteConfig.navLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                      router.pathname === link.href
                        ? 'bg-primary text-white font-medium'
                        : 'hover:bg-light-card dark:hover:bg-dark-card text-gray-700 dark:text-gray-300'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <i className={`${link.icon} w-5 text-center mr-3`}></i>
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        
        {/* Social links */}
        <div className="px-6">
          <div className="flex justify-center space-x-4">
            {siteConfig.socialLinks.map((social) => (
              <a 
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
                aria-label={social.name}
              >
                <i className={`${social.icon} text-xl`}></i>
              </a>
            ))}
          </div>
          <div className="text-center text-xs text-gray-500 dark:text-gray-500 mt-6">
            &copy; {new Date().getFullYear()} {siteConfig.title}
          </div>
        </div>
      </div>
    </aside>
  );
}

// components/layout/Footer.tsx
import Link from 'next/link';
import { siteConfig } from '../../lib/siteConfig';

export default function Footer() {
  return (
    <footer className="mt-20 pt-10 border-t border-light-border dark:border-dark-border">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center">
          <span className="text-gray-600 dark:text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} {siteConfig.title}. All rights reserved.
          </span>
        </div>
        
        <div className="flex space-x-6">
          {siteConfig.socialLinks.map((social) => (
            <a 
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
              aria-label={social.name}
            >
              <i className={`${social.icon} text-lg`}></i>
            </a>
          ))}
        </div>
      </div>
      
      <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-500">
        <p>Made with <i className="fas fa-heart text-primary"></i> and open-source tech</p>
        <div className="mt-2">
          <Link href="/subscribe" className="text-primary hover:underline">Subscribe</Link>
          <span className="mx-2">•</span>
          <Link href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary">Privacy</Link>
          <span className="mx-2">•</span>
          <Link href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary">Terms</Link>
        </div>
      </div>
    </footer>
  );
}