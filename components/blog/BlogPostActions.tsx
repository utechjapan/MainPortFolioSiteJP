// components/blog/BlogPostActions.tsx
import { useState } from "react";

export default function BlogPostActions() {
  // Use window.location.href if available; otherwise fallback to empty string.
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleShare = () => {
    const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      currentUrl
    )}&text=${encodeURIComponent("Check out this post!")}`;
    window.open(shareUrl, "_blank");
  };

  return (
    <>
      {/* Desktop version: inline share button above comments */}
      <div className="hidden md:flex items-center justify-end my-6">
        <button
          onClick={handleShare}
          className="flex items-center text-gray-600 hover:text-primary transition-colors"
        >
          <i className="fa-solid fa-share-alt mr-2" aria-hidden="true"></i>
          Share
        </button>
      </div>

      {/* Mobile version: fixed bottom bar with share button */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-dark-bg border-t border-gray-300 dark:border-gray-700 flex justify-around items-center py-3 z-50">
        <button
          onClick={handleShare}
          className="flex flex-col items-center text-gray-600 hover:text-primary transition-colors"
        >
          <i className="fa-solid fa-share-alt text-xl" aria-hidden="true"></i>
          <span className="text-xs">Share</span>
        </button>
      </div>
    </>
  );
}
