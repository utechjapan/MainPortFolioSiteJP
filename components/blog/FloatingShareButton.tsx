import { useEffect, useState } from "react";

export default function FloatingShareButton() {
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, []);

  const handleShare = () => {
    // Updated share message: a more compelling message in Japanese
    const shareText = "この記事をシェアしよう！";
    const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      currentUrl
    )}&text=${encodeURIComponent(shareText)}`;
    window.open(shareUrl, "_blank");
  };

  return (
    <div className="md:hidden fixed bottom-5 right-5 z-[100]">
      <button
        onClick={handleShare}
        className="bg-white dark:bg-dark-bg shadow-lg p-3 rounded-full border border-gray-300 dark:border-gray-700 focus:outline-none hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Share"
      >
        <i className="fa-solid fa-share-alt text-xl text-gray-600 dark:text-gray-300"></i>
      </button>
    </div>
  );
}