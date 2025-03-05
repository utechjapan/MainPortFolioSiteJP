// pages/index.tsx
import Head from "next/head";
import Layout from "../components/layout/Layout";
import Image from "next/image";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { getAllMDXContent } from "../lib/mdx";
import { motion } from "framer-motion";
import { useState } from "react";
import SearchBar from "../components/ui/SearchBar";
import { siteConfig } from "../lib/siteConfig";
import Tag from "../components/ui/Tag";
import { Post, RecentPost } from "../types";

interface HomeProps {
  posts: Post[];
  recentPosts: RecentPost[];
  tags: string[];
}

export default function Home({ posts, recentPosts, tags }: HomeProps) {
  const [activeTag, setActiveTag] = useState("all");

  // Filter posts by tag
  const filteredPosts =
    activeTag === "all"
      ? posts
      : posts.filter((post) => post.frontMatter.tags?.includes(activeTag));

  // Extract all unique tags
  const allTags = [
    "all",
    ...new Set(posts.flatMap((post) => post.frontMatter.tags || [])),
  ];

  return (
    <Layout recentPosts={recentPosts} tags={tags}>
      <Head>
        <title>
          {siteConfig.title} | {siteConfig.description}
        </title>
        <meta name="description" content={siteConfig.description} />
      </Head>

      <div className="space-y-16">
        {/* Hero section - Simplified design without the intro text */}
        <section className="mb-10">
          <motion.div
            className="bg-light-card dark:bg-dark-card rounded-lg p-8 shadow-md dark:shadow-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                Welcome to{" "}
                <span className="text-primary">{siteConfig.title}</span>
              </h1>
              <p className="text-base text-gray-700 dark:text-gray-300 mb-4">
                Explore technical guides, tutorials, and best practices for
                modern IT infrastructure and development.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/blog"
                  className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors inline-flex items-center"
                >
                  <i className="fas fa-book-open mr-2" aria-hidden="true"></i>
                  Read Articles
                </Link>
                <Link
                  href="/about"
                  className="border border-primary text-primary hover:bg-primary/10 px-4 py-2 rounded-lg transition-colors inline-flex items-center"
                >
                  <i className="fas fa-user mr-2" aria-hidden="true"></i>
                  About Me
                </Link>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Latest Posts */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">
              <span className="inline-block border-b-2 border-primary pb-1">
                Latest Posts
              </span>
            </h2>
            <Link
              href="/blog"
              className="text-primary hover:text-primary-dark flex items-center transition-colors"
            >
              View all posts
              <i className="fas fa-arrow-right ml-2" aria-hidden="true"></i>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPosts.map((post, index) => (
              <motion.article
                key={post.slug}
                className="bg-light-card dark:bg-dark-card rounded-lg overflow-hidden shadow-md hover:shadow-lg dark:shadow-none transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
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
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3 transition-colors">
                    <time
                      dateTime={post.frontMatter.date}
                      className="flex items-center"
                    >
                      <i
                        className="fas fa-calendar-alt mr-2"
                        aria-hidden="true"
                      ></i>
                      {format(parseISO(post.frontMatter.date), "MMMM d, yyyy")}
                    </time>
                    <span className="mx-2">•</span>
                    <span className="flex items-center">
                      <i className="fas fa-clock mr-2" aria-hidden="true"></i>
                      {post.frontMatter.readingTime || "5 min read"}
                    </span>
                  </div>

                  <Link href={`/blog/${post.slug}`}>
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white hover:text-primary dark:hover:text-primary transition-colors">
                      {post.frontMatter.title}
                    </h3>
                  </Link>

                  <p className="text-gray-700 dark:text-gray-400 mb-4 line-clamp-2 transition-colors">
                    {post.frontMatter.description}
                  </p>

                  {post.frontMatter.tags &&
                    post.frontMatter.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {post.frontMatter.tags.slice(0, 3).map((tag) => (
                          <Tag key={tag} text={tag} href={`/blog/tag/${tag}`} />
                        ))}
                      </div>
                    )}
                </div>
              </motion.article>
            ))}
          </div>

          <div className="flex justify-center mt-10">
            <Link
              href="/blog"
              className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-md inline-flex items-center transition-colors"
            >
              View More Posts
              <i className="fas fa-arrow-right ml-2" aria-hidden="true"></i>
            </Link>
          </div>
        </section>

        {/* Subscribe section */}
        <section className="bg-light-card dark:bg-dark-card rounded-lg p-8 text-center shadow-md dark:shadow-none transition-colors">
          <div className="flex justify-center mb-6">
            <div className="bg-primary/20 p-4 rounded-full">
              <i
                className="fas fa-envelope text-primary text-3xl"
                aria-hidden="true"
              ></i>
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white transition-colors">
            Stay Updated
          </h2>
          <p className="text-gray-700 dark:text-gray-400 mb-8 max-w-2xl mx-auto transition-colors">
            Get the latest tutorials, guides, and updates delivered directly to
            your inbox. No spam, unsubscribe anytime.
          </p>

          <form className="max-w-md mx-auto">
            <div className="mb-4">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-3 rounded-md bg-white dark:bg-dark-sidebar border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-white py-3 px-6 rounded-md flex items-center justify-center transition-colors"
            >
              Subscribe Now
              <i className="fas fa-arrow-right ml-2" aria-hidden="true"></i>
            </button>
          </form>
        </section>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const allPosts = await getAllMDXContent("blog");
  const featuredPosts = allPosts.slice(0, 4);

  // Extract all tags
  const allTags = allPosts.flatMap((post) => post.frontMatter.tags || []);
  const tagCount: Record<string, number> = {};

  // Count tag occurrences
  allTags.forEach((tag) => {
    tagCount[tag] = (tagCount[tag] || 0) + 1;
  });

  // Sort by count and take top 10
  const popularTags = Object.entries(tagCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tag]) => tag);

  return {
    props: {
      posts: featuredPosts.map((post) => ({
        slug: post.slug,
        frontMatter: post.frontMatter,
      })),
      recentPosts: allPosts.slice(0, 5).map((post) => ({
        slug: post.slug,
        title: post.frontMatter.title,
      })),
      tags: popularTags,
    },
  };
}
