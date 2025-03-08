// pages/search.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Layout from "../components/layout/Layout";
import SearchBar from "../components/ui/SearchBar";
import BlogCard from "../components/blog/BlogCard";
import { getAllMDXContent } from "../lib/mdx";
import { motion } from "framer-motion";
import { Post, RecentPost } from "../types";
import { siteConfig } from "../lib/siteConfig";

interface SearchProps {
  allPosts: Post[];
  recentPosts: RecentPost[];
  tags: string[];
}

export default function Search({ allPosts, recentPosts, tags }: SearchProps) {
  const router = useRouter();
  const { q } = router.query;
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Post[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && typeof q === "string") {
      setSearchTerm(q);
      performSearch(q);
    }
  }, [q, mounted]);

  const performSearch = (term: string) => {
    if (!mounted) return;

    setIsSearching(true);
    const results = allPosts.filter((post) => {
      const title = post.frontMatter.title.toLowerCase();
      const description = (post.frontMatter.description || "").toLowerCase();
      const tags = (post.frontMatter.tags || []).join(" ").toLowerCase();
      const searchTermLower = term.toLowerCase();
      return title.includes(searchTermLower) || description.includes(searchTermLower) || tags.includes(searchTermLower);
    });
    setSearchResults(results);
    setIsSearching(false);
  };

  if (!mounted) {
    return <div className="min-h-screen bg-light-bg dark:bg-dark-bg"></div>;
  }

  return (
    <Layout rightSidebar={true} recentPosts={recentPosts} tags={tags}>
      <Head>
        <title>
          検索結果 | {searchTerm ? `"${searchTerm}"` : "検索"} | {siteConfig.title}
        </title>
        <meta
          name="description"
          content={`「${siteConfig.title}」内の記事を検索`}
        />
      </Head>

      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white transition-colors">
          記事検索
        </h1>
        <SearchBar placeholder="タイトル、内容、タグで検索…" className="max-w-3xl" />
      </div>

      {searchTerm && (
        <div className="mb-8">
          <h2 className="text-xl text-gray-700 dark:text-gray-400 transition-colors">
            {isSearching
              ? "検索中..."
              : `${searchResults.length} 件の結果が見つかりました: "${searchTerm}"`}
          </h2>
        </div>
      )}

      {searchResults.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {searchResults.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </motion.div>
      ) : (
        !isSearching &&
        searchTerm && (
          <div className="bg-light-card dark:bg-dark-card p-8 rounded-lg text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-gray-600 dark:text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white transition-colors">
              該当する記事が見つかりませんでした
            </h3>
            <p className="text-gray-700 dark:text-gray-400 mb-6 transition-colors">
              別のキーワードで検索するか、カテゴリーからご覧ください。
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => router.push("/")}
                className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md transition-colors"
              >
                カテゴリーを閲覧する
              </button>
            </div>
          </div>
        )
      )}

      {!searchTerm && (
        <div className="bg-light-card dark:bg-dark-card p-8 rounded-lg transition-colors">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white transition-colors">
            検索のヒント
          </h2>
          <ul className="text-gray-700 dark:text-gray-300 space-y-2 transition-colors">
            <li>• 関連するキーワードを具体的に入力してください</li>
            <li>• 「homelab」や「docker」などカテゴリー名で検索する</li>
            <li>• 「proxmox」や「kubernetes」など技術名で検索する</li>
            <li>• 記事タイトルや説明文から検索することも可能です</li>
          </ul>
        </div>
      )}
    </Layout>
  );
}

export async function getStaticProps() {
  const allPosts = (await getAllMDXContent("blog")) || [];
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
      allPosts: allPosts.map((post) => ({
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
