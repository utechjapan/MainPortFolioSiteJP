// components/layout/Layout.tsx
import { ReactNode, useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Sidebar from "./Sidebar";
import RightSidebar from "./RightSidebar";
import MobileMenu from "./MobileMenu";
import Footer from "./Footer";
import BackToTop from "../ui/BackToTop";
import { RecentPost, TocItem } from "../../types";

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
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-light-bg dark:bg-dark-bg text-gray-900 dark:text-gray-300 transition-theme">
      <Sidebar isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />
      <div className="fixed top-0 left-0 right-0 z-50 md:hidden bg-light-bg dark:bg-dark-bg border-b border-gray-300 dark:border-gray-700 py-3 px-4 flex justify-between items-center transition-theme">
        <button
          className="p-2 rounded-md bg-primary/80 text-white hover:bg-primary transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <i className="fa-solid fa-times h-6 w-6" aria-hidden="true"></i>
          ) : (
            <i className="fa-solid fa-bars h-6 w-6" aria-hidden="true"></i>
          )}
        </button>
        <span className="text-lg font-bold text-gray-900 dark:text-white transition-theme">
          UTechLab
        </span>
        <div></div>
      </div>
      <MobileMenu isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />
      <main className="flex-1 ml-0 md:ml-72 transition-all duration-300 ease-in-out pt-16 md:pt-0">
        <div className={`p-4 md:p-6 lg:p-8 ${rightSidebar ? "lg:mr-64" : ""} max-w-full overflow-hidden`}>
          {children}
          <Footer />
        </div>
      </main>
      {rightSidebar && mounted && (
        <div className="hidden lg:block w-64 fixed top-0 right-0 h-screen bg-light-sidebar dark:bg-dark-sidebar border-l border-light-border dark:border-gray-700 p-6 overflow-y-auto transition-theme">
          <RightSidebar recentPosts={recentPosts} tags={tags} toc={toc} />
        </div>
      )}
      <BackToTop />
    </div>
  );
}
