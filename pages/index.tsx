// pages/index.tsx
import Head from "next/head";
import Layout from "../components/layout/Layout";
import Image from "next/image";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";
import { useState } from "react";
import { siteConfig } from "../lib/siteConfig";
import Tag from "../components/ui/Tag";
import { Post, RecentPost } from "../types";
import { getAllMDXContent } from "../lib/mdx";

interface HomeProps {
  posts: Post[];
  recentPosts: RecentPost[];
  tags: string[];
}

export default function Home({ posts = [], recentPosts = [], tags = [] }: HomeProps) {
  const [activeTag, setActiveTag] = useState("all");

  const filteredPosts =
    activeTag === "all"
      ? posts || []
      : (posts || []).filter((post) => post.frontMatter.tags?.includes(activeTag));

  return (
    <Layout recentPosts={recentPosts} tags={tags}>
      <Head>
        <title>{siteConfig.title} | {siteConfig.description}</title>
        <meta name="description" content={siteConfig.description} />
      </Head>

      <div className="space-y-16">
        {/* Hero Section */}
        <section className="mb-10">
          <motion.div
            className="bg-light-card dark:bg-dark-card rounded-lg p-8 shadow-md dark:shadow-none text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                Welcome to my Portfolio and Blog Site!
              </h1>
              <p className="text-base text-gray-700 dark:text-gray-300 mb-4">
                最新の技術ガイド、チュートリアル、そして最先端のITインフラや開発に関するベストプラクティスを探索してください。
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link
                  href="/blog"
                  className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors inline-flex items-center"
                >
                  <i className="fa-solid fa-book-open mr-2" aria-hidden="true"></i>
                  記事を読む
                </Link>
                <Link
                  href="/about"
                  className="border border-primary text-primary hover:bg-primary/10 px-4 py-2 rounded-lg transition-colors inline-flex items-center"
                >
                  <i className="fa-solid fa-user mr-2" aria-hidden="true"></i>
                  私について
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
                最新の投稿
              </span>
            </h2>
            <Link
              href="/blog"
              className="text-primary hover:text-primary-dark flex items-center transition-colors"
            >
              すべての投稿を見る
              <i className="fa-solid fa-arrow-right ml-2" aria-hidden="true"></i>
            </Link>
          </div>

          {/* Updated grid layout using auto-fit */}
          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6">
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
                    <time dateTime={post.frontMatter.date} className="flex items-center">
                      <i className="fa-solid fa-calendar-alt mr-2" aria-hidden="true"></i>
                      {format(parseISO(post.frontMatter.date), "yyyy年M月d日")}
                    </time>
                    <span className="mx-2">•</span>
                    <span className="flex items-center">
                      <i className="fa-solid fa-clock mr-2" aria-hidden="true"></i>
                      {post.frontMatter.readingTime || "5分"}
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

                  {post.frontMatter.tags && post.frontMatter.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.frontMatter.tags.map((tag) => (
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
              もっと見る
              <i className="fa-solid fa-arrow-right ml-2" aria-hidden="true"></i>
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const allPosts = (await getAllMDXContent("blog")) || [];
  const featuredPosts = allPosts.slice(0, 4);
  const allTags = allPosts.flatMap((post) => post.frontMatter.tags || []);
  const tagCount: Record<string, number> = {};
  allTags.forEach((tag) => {
    tagCount[tag] = (tagCount[tag] || 0) + 1;
  });
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
