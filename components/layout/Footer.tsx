// components/layout/Footer.tsx
import Link from "next/link";
import { siteConfig } from "../../lib/siteConfig";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="mt-20 pt-10 border-t border-gray-300 dark:border-gray-700 transition-colors">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center">
          <span className="text-gray-600 dark:text-gray-400 text-sm transition-colors">
            &copy; {currentYear} {siteConfig.title}. All rights reserved.
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
        <p>
          Made with <i className="fas fa-heart text-primary"></i> and
          open-source tech
        </p>
        <div className="mt-2">
          <Link href="/subscribe" className="text-primary hover:underline">
            Subscribe
          </Link>
          <span className="mx-2">•</span>
          <Link
            href="/privacy"
            className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
          >
            Privacy
          </Link>
          <span className="mx-2">•</span>
          <Link
            href="/terms"
            className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
          >
            Terms
          </Link>
        </div>
      </div>
    </div>
  );
}
