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
        {/* Hero section */}
        <section className="mb-16">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              Welcome to {siteConfig.title}
            </h1>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-8 transition-colors">
              Explore tutorials, guides, and insights on tech, self-hosting, and
              modern development practices.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/blog"
                className="btn btn-primary px-6 py-3 rounded-lg"
              >
                Browse Articles
              </Link>
              <Link
                href="/about"
                className="btn btn-outline px-6 py-3 rounded-lg"
              >
                About Me
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Browse by Category */}
        <section className="pb-10 border-b border-gray-300 dark:border-gray-700 transition-colors">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white transition-colors">
            <span className="inline-block border-b-2 border-primary pb-1">
              Browse by Category
            </span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {siteConfig.categories.map((category) => (
              <Link
                href={`/blog/category/${category.slug}`}
                key={category.slug}
                className="flex flex-col items-center group transition-transform hover:scale-105"
              >
                <div className="mb-3 relative w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center overflow-hidden">
                  <Image
                    src={category.icon}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-110"
                  />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
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
              className="text-primary hover:text-primary-dark flex items-center"
            >
              View all posts
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
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
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white hover:text-primary transition-colors">
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        </section>

        {/* Subscribe section */}
        <section className="bg-light-card dark:bg-dark-card rounded-lg p-8 text-center shadow-md dark:shadow-none transition-colors">
          <div className="flex justify-center mb-6">
            <div className="bg-primary/20 p-4 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
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
