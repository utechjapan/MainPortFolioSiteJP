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
    <article className="bg-light-card dark:bg-dark-card rounded-lg overflow-hidden shadow-md hover:shadow-lg dark:shadow-none transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative h-48 w-full">
          <Image
            src={post.frontMatter.image || "/images/placeholder.jpg"}
            alt={post.frontMatter.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
      </Link>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3 transition-colors flex-wrap">
          <time
            dateTime={post.frontMatter.date}
            className="flex items-center mb-1 sm:mb-0"
          >
            <i
              className="fas fa-calendar-alt mr-1 flex-shrink-0"
              aria-hidden="true"
            ></i>
            {format(parseISO(post.frontMatter.date), "MMMM d, yyyy")}
          </time>
          <span className="mx-2 hidden sm:inline">•</span>
          <span className="flex items-center">
            <i
              className="fas fa-clock mr-1 flex-shrink-0"
              aria-hidden="true"
            ></i>
            {post.frontMatter.readingTime || "5 min read"}
          </span>
        </div>

        <Link href={`/blog/${post.slug}`} className="group">
          <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white group-hover:text-primary transition-colors break-words">
            {post.frontMatter.title}
          </h3>
        </Link>

        <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3 flex-grow transition-colors break-words">
          {post.frontMatter.description}
        </p>

        {post.frontMatter.tags && post.frontMatter.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-auto">
            {post.frontMatter.tags.slice(0, 3).map((tag) => (
              <Tag key={tag} text={tag} href={`/blog/tag/${tag}`} />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}