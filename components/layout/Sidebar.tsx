// components/layout/Sidebar.tsx
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { siteConfig } from "../../lib/siteConfig";
import ThemeToggle from "../ui/ThemeToggle";
interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const router = useRouter();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 w-72 bg-light-sidebar dark:bg-dark-sidebar border-r border-gray-300 dark:border-dark-border transition-all duration-300 z-30 ${
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}
    >
      <div className="h-full flex flex-col justify-between py-8">
        <div className="px-6">
          {/* Profile section */}
          <div className="flex flex-col items-center mb-8">
            <Link href="/" className="mb-4" onClick={() => setIsOpen(false)}>
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
            {/* Centered description */}
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 text-center">
              {siteConfig.description}
            </p>
            {/* New toggle section below the description */}
            <div className="flex justify-center space-x-2 mt-4">
              <ThemeToggle />
            </div>
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
                        ? "bg-primary text-white font-medium"
                        : "hover:bg-light-card dark:hover:bg-dark-card text-gray-700 dark:text-gray-300"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <i
                      className={`${link.icon} fa-fw w-5 text-center mr-3`}
                      aria-hidden="true"
                    ></i>
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
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
                aria-label={social.name}
              >
                <i
                  className={`${social.icon} fa-fw text-xl`}
                  aria-hidden="true"
                ></i>
              </a>
            ))}
          </div>
          <div className="text-center text-xs text-gray-500 dark:text-gray-500 mt-6">
            &copy; 2025 UTechLab. All rights reserved.
          </div>
        </div>
      </div>
    </aside>
  );
}
