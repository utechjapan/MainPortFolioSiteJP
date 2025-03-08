// components/blog/FloatingShareButton.tsx
import { useEffect, useState } from "react";

export default function FloatingShareButton() {
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, []);

  const handleShare = () => {
    const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      currentUrl
    )}&text=${encodeURIComponent("Check out this post!")}`;
    window.open(shareUrl, "_blank");
  };

  return (
    <div className="md:hidden fixed bottom-5 left-5 z-[100]">
      <button
        onClick={handleShare}
        className="bg-white dark:bg-dark-bg shadow-lg p-3 rounded-full border border-gray-300 dark:border-gray-700 focus:outline-none hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Share"
      >
        <i className="fa-solid fa-share-alt text-xl text-gray-600"></i>
      </button>
    </div>
  );
}
