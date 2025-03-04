import { ReactNode, useState } from 'react';
import Sidebar from './Sidebar';
import RightSidebar from './RightSidebar';
import MobileMenu from './MobileMenu';
import ThemeToggle from '../ui/ThemeToggle';
import Footer from './Footer';
import BackToTop from '../ui/BackToTop';

interface LayoutProps {
  children: ReactNode;
  rightSidebar?: boolean;
  recentPosts?: any[];
  tags?: string[];
  toc: any[] | null;
}

export default function Layout({
  children,
  rightSidebar = true,
  recentPosts,
  tags,
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
