// pages/blog/tag/[tag].tsx
import { GetStaticProps, GetStaticPaths } from "next";
import Head from "next/head";
import Layout from "../../../components/layout/Layout";
import BlogCard from "../../../components/blog/BlogCard";
import { getAllMDXContent } from "../../../lib/mdx";
import { motion } from "framer-motion";
import { ParsedUrlQuery } from "querystring";
import { siteConfig } from "../../../lib/siteConfig";
import { Post, RecentPost } from "../../../types";

interface TagPageProps {
  posts: Post[];
  tag: string;
  recentPosts: RecentPost[];
  tags: string[];
}

interface Params extends ParsedUrlQuery {
  tag: string;
}

export default function TagPage({
  posts,
  tag,
  recentPosts,
  tags,
}: TagPageProps) {
  return (
    <Layout recentPosts={recentPosts} tags={tags}>
      <Head>
        <title>
          Posts tagged "{tag}" | {siteConfig.title}
        </title>
        <meta
          name="description"
          content={`Browse all posts tagged with ${tag}`}
        />
      </Head>

      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          Posts tagged with <span className="text-primary">"{tag}"</span>
        </h1>
        <p className="text-gray-400">
          Showing {posts.length} post{posts.length !== 1 ? "s" : ""} with this
          tag
        </p>
      </div>

      {posts.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </motion.div>
      ) : (
        <div className="bg-dark-card p-8 rounded-lg text-center">
          <h3 className="text-xl font-bold mb-2 text-white">No posts found</h3>
          <p className="text-gray-400 mb-6">
            We couldn't find any posts with the tag "{tag}".
          </p>
        </div>
      )}
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const allPosts = await getAllMDXContent("blog");
  const allTags = [
    ...new Set(allPosts.flatMap((post) => post.frontMatter.tags || [])),
  ];
  const paths = allTags.map((tag) => ({
    params: { tag },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<TagPageProps, Params> = async ({
  params,
}) => {
  const tag = params?.tag as string;
  const allPosts = await getAllMDXContent("blog");

  const filteredPosts = allPosts.filter((post) =>
    post.frontMatter.tags?.includes(tag)
  );

  const allTags = allPosts.flatMap((post) => post.frontMatter.tags || []);
  const tagCount: Record<string, number> = {};

  allTags.forEach((t) => {
    tagCount[t] = (tagCount[t] || 0) + 1;
  });

  const popularTags = Object.entries(tagCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tag]) => tag);

  return {
    props: {
      posts: filteredPosts.map((post) => ({
        slug: post.slug,
        frontMatter: post.frontMatter,
      })),
      tag,
      recentPosts: allPosts.slice(0, 5).map((post) => ({
        slug: post.slug,
        title: post.frontMatter.title,
      })),
      tags: popularTags,
    },
  };
};
