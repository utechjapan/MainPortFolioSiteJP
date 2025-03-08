// components/blog/BlogPostActions.tsx
import { useState } from "react";

export default function BlogPostActions() {
  // Use window.location.href if available; otherwise fallback to empty string.
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleSave = () => {
    setSaved(!saved);
  };

  const handleShare = () => {
    const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      currentUrl
    )}&text=${encodeURIComponent("Check out this post!")}`;
    window.open(shareUrl, "_blank");
  };

  return (
    <>
      {/* Desktop version: inline bar above comments */}
      <div className="hidden md:flex items-center justify-end space-x-4 my-6">
        <button
          onClick={handleLike}
          className="flex items-center text-gray-600 hover:text-primary transition-colors"
        >
          <i className={`fa${liked ? "s" : "r"} fa-heart mr-2`} aria-hidden="true"></i>
          {liked ? "Liked" : "Like"}
        </button>
        <button
          onClick={handleSave}
          className="flex items-center text-gray-600 hover:text-primary transition-colors"
        >
          <i className={`fa${saved ? "s" : "r"} fa-bookmark mr-2`} aria-hidden="true"></i>
          {saved ? "Saved" : "Save"}
        </button>
        <button
          onClick={handleShare}
          className="flex items-center text-gray-600 hover:text-primary transition-colors"
        >
          <i className="fa-solid fa-share-alt mr-2" aria-hidden="true"></i>
          Share
        </button>
      </div>

      {/* Mobile version: fixed bottom bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-dark-bg border-t border-gray-300 dark:border-gray-700 flex justify-around items-center py-3 z-50">
        <button
          onClick={handleLike}
          className="flex flex-col items-center text-gray-600 hover:text-primary transition-colors"
        >
          <i className={`fa${liked ? "s" : "r"} fa-heart text-xl`} aria-hidden="true"></i>
          <span className="text-xs">Like</span>
        </button>
        <button
          onClick={handleSave}
          className="flex flex-col items-center text-gray-600 hover:text-primary transition-colors"
        >
          <i className={`fa${saved ? "s" : "r"} fa-bookmark text-xl`} aria-hidden="true"></i>
          <span className="text-xs">Save</span>
        </button>
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
