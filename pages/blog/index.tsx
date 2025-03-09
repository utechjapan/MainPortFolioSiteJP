// pages/blog/index.tsx
import Head from "next/head";
import Layout from "../../components/layout/Layout";
import BlogCard from "../../components/blog/BlogCard";
import { getAllMDXContent } from "../../lib/mdx";
import { motion } from "framer-motion";
import { useState } from "react";
import SearchBar from "../../components/ui/SearchBar";
import { siteConfig } from "../../lib/siteConfig";
import { Post, RecentPost } from "../../types";

interface BlogIndexProps {
  posts: Post[];
  recentPosts: RecentPost[];
  tags: string[];
}

export default function BlogIndex({ posts, recentPosts, tags }: BlogIndexProps) {
  const [activeTag, setActiveTag] = useState("all");
  const [expanded, setExpanded] = useState(false);

  // Filter posts by tag
  const filteredPosts =
    activeTag === "all"
      ? posts
      : posts.filter((post) => post.frontMatter.tags?.includes(activeTag));

  // Extract unique tags from posts
  const allTags = ["all", ...new Set(posts.flatMap((post) => post.frontMatter.tags || []))];

  return (
    <Layout recentPosts={recentPosts} tags={tags}>
      <Head>
        <title>Blog | {siteConfig.title}</title>
        <meta name="description" content="最新のブログ記事、チュートリアル、ガイドをお楽しみください" />
      </Head>

      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
          ブログ
        </h1>
        <SearchBar className="max-w-3xl mb-8" />

        {/* Tag Filter Container */}
        <div className="relative">
          <div
            className={`flex flex-wrap gap-2 transition-all ${
              expanded ? "max-h-full" : "max-h-[80px] overflow-hidden"
            }`}
          >
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  activeTag === tag
                    ? "bg-primary text-white"
                    : "bg-light-card dark:bg-dark-card text-gray-700 dark:text-gray-400 hover:bg-light-sidebar dark:hover:bg-dark-sidebar"
                }`}
              >
                {tag === "all" ? "全ての投稿" : tag}
              </button>
            ))}
          </div>
          {/* Toggle Button */}
          {allTags.length > 6 && (
            <div className="mt-2 text-center">
              <button
                onClick={() => setExpanded((prev) => !prev)}
                className="text-primary font-medium text-sm focus:outline-none hover:underline"
              >
                {expanded ? "閉じる" : "すべてのタグを表示"}
              </button>
            </div>
          )}
        </div>
      </div>

      {filteredPosts.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {filteredPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </motion.div>
      ) : (
        <div className="bg-dark-card p-8 rounded-lg text-center">
          <h3 className="text-xl font-bold mb-2 text-white">投稿が見つかりません</h3>
          <p className="text-gray-400 mb-6">
            選択したタグに一致する投稿はありません。別のタグを選択してください。
          </p>
          <button
            onClick={() => setActiveTag("all")}
            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md"
          >
            すべての投稿を表示
          </button>
        </div>
      )}
    </Layout>
  );
}

export async function getStaticProps() {
  const allPosts = await getAllMDXContent("blog");

  // Count tags for popular tags list (if needed elsewhere)
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
      posts: allPosts.map((post) => ({
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
