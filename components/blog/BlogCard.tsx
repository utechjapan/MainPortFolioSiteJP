// components/blog/BlogCard.tsx
import Link from "next/link";
import Image from "next/image";
import { format, parseISO } from "date-fns";
import Tag from "../ui/Tag";
import { Post } from "../../types";

interface BlogCardProps {
  post: Post;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="bg-light-card dark:bg-dark-card rounded-lg overflow-hidden shadow-md hover:shadow-lg dark:shadow-none transition-all duration-300 hover:-translate-y-1">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative h-48 w-full">
          <Image
            src={post.frontMatter.image || "/images/placeholder.jpg"}
            alt={post.frontMatter.title}
            fill
            className="object-cover"
          />
        </div>
      </Link>

      <div className="p-6">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
          <time dateTime={post.frontMatter.date} className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {format(parseISO(post.frontMatter.date), "MMMM d, yyyy")}
          </time>
          <span className="mx-2">•</span>
          <span className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {post.frontMatter.readingTime || "5 min read"}
          </span>
        </div>

        <Link href={`/blog/${post.slug}`}>
          <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white hover:text-primary dark:hover:text-primary transition-colors">
            {post.frontMatter.title}
          </h3>
        </Link>

        <p className="text-gray-700 dark:text-gray-400 mb-4 line-clamp-2">
          {post.frontMatter.description}
        </p>

        {post.frontMatter.tags && post.frontMatter.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.frontMatter.tags.slice(0, 3).map((tag) => (
              <Tag key={tag} text={tag} href={`/blog/tag/${tag}`} />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
