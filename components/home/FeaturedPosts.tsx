// components/home/FeaturedPosts.tsx
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import BlogMeta from "../blog/BlogMeta";
import Tag from "../ui/Tag";
import { Post } from "../../types";

interface FeaturedPostsProps {
  posts: Post[];
}

export default function FeaturedPosts({ posts }: FeaturedPostsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {posts.map((post, index) => (
        <motion.article
          key={post.slug}
          className="bg-light-card dark:bg-dark-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow flex flex-col h-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Link href={`/blog/${post.slug}`} className="block">
            <div className="relative h-60 w-full">
              {post.frontMatter.image ? (
                <Image
                  src={post.frontMatter.image}
                  alt={post.frontMatter.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                  <span className="text-gray-500 dark:text-gray-400">
                    No image
                  </span>
                </div>
              )}
            </div>
          </Link>

          <div className="p-6 flex flex-col flex-grow">
            <Link href={`/blog/${post.slug}`} className="block">
              <h3 className="text-xl font-bold mb-2 hover:text-primary transition-colors">
                {post.frontMatter.title}
              </h3>
            </Link>

            <BlogMeta
              date={post.frontMatter.date}
              readingTime={post.frontMatter.readingTime}
            />

            {post.frontMatter.description && (
              <p className="text-gray-700 dark:text-gray-300 mt-3 mb-4 flex-grow">
                {post.frontMatter.description}
              </p>
            )}

            {post.frontMatter.tags && post.frontMatter.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-auto">
                {post.frontMatter.tags.slice(0, 3).map((tag) => (
                  <Tag key={tag} text={tag} />
                ))}
              </div>
            )}
          </div>
        </motion.article>
      ))}
    </div>
  );
}
