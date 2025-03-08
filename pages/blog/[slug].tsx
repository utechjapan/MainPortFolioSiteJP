// pages/blog/[slug].tsx
import { GetStaticProps, GetStaticPaths } from "next";
import Head from "next/head";
import Image from "next/image";
import { motion } from "framer-motion";
import { ParsedUrlQuery } from "querystring";
import { useMemo } from "react";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeCodeTitles from "rehype-code-titles";
import rehypePrism from "rehype-prism-plus";

import Layout from "../../components/layout/Layout";
import TableOfContents from "../../components/blog/TableOfContents";
import GiscusComments from "../../components/blog/GiscusComments";
import BlogMeta from "../../components/blog/BlogMeta";
import Tag from "../../components/ui/Tag";
import CopyButton from "../../components/ui/CopyButton";
import BlogPostActions from "../../components/blog/BlogPostActions";

import {
  getMDXContent,
  getAllMDXSlugs,
  getAllMDXContent,
  MDXFrontMatter,
} from "../../lib/mdx";
import { siteConfig } from "../../lib/siteConfig";

interface MDXPost {
  source: any;
  frontMatter: MDXFrontMatter;
  slug: string;
  toc: {
    id: string;
    text: string;
    level: number;
  }[];
}

interface BlogPostProps {
  post: MDXPost;
  recentPosts: {
    slug: string;
    title: string;
  }[];
  tags: string[];
}

interface Params extends ParsedUrlQuery {
  slug: string;
}

export default function BlogPost({ post, recentPosts, tags }: BlogPostProps) {
  const { frontMatter, source, slug, toc } = post;

  // Define custom components for MDX
  const components = useMemo(
    () => ({
      h1: (props: any) => (
        <h1
          {...props}
          className="text-3xl font-bold mt-8 mb-4 text-gray-900 dark:text-white transition-colors break-words"
        />
      ),
      h2: (props: any) => (
        <h2
          {...props}
          className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white transition-colors break-words"
        />
      ),
      h3: (props: any) => (
        <h3
          {...props}
          className="text-xl font-bold mt-6 mb-3 text-gray-900 dark:text-white transition-colors break-words"
        />
      ),
      p: (props: any) => (
        <p
          {...props}
          className="mb-4 text-gray-700 dark:text-gray-300 transition-colors break-words"
        />
      ),
      ul: (props: any) => (
        <ul
          {...props}
          className="list-disc ml-6 mb-4 text-gray-700 dark:text-gray-300 transition-colors break-words"
        />
      ),
      ol: (props: any) => (
        <ol
          {...props}
          className="list-decimal ml-6 mb-4 text-gray-700 dark:text-gray-300 transition-colors break-words"
        />
      ),
      li: (props: any) => <li {...props} className="mb-1 break-words" />,
      img: (props: any) => (
        <div className="my-8 relative w-full rounded-lg overflow-hidden">
          <Image
            src={props.src}
            alt={props.alt || ""}
            width={800}
            height={450}
            className="object-cover max-w-full h-auto mx-auto"
            style={{ maxHeight: "500px" }}
          />
        </div>
      ),
      a: (props: any) => (
        <a
          {...props}
          className="text-primary hover:text-primary-dark underline transition-colors break-words"
          target={props.href.startsWith("http") ? "_blank" : undefined}
          rel={props.href.startsWith("http") ? "noopener noreferrer" : undefined}
        />
      ),
      code: (props: any) => {
        if (props.className) {
          return (
            <code
              {...props}
              className={`${props.className} rounded p-1 text-sm break-words overflow-x-auto`}
            />
          );
        }
        return (
          <code
            {...props}
            className="bg-gray-100 dark:bg-gray-800 rounded p-1 text-sm text-gray-800 dark:text-gray-200 transition-colors break-words"
          />
        );
      },
      pre: (props: any) => {
        const textContent = props.children?.props?.children || "";
        return (
          <div className="relative group">
            <pre
              {...props}
              className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-4 rounded-lg overflow-x-auto mb-6 py-6 transition-colors"
            >
              {props.children}
            </pre>
            <CopyButton text={textContent} />
          </div>
        );
      },
      blockquote: (props: any) => (
        <blockquote
          {...props}
          className="border-l-4 border-primary pl-4 italic my-6 text-gray-600 dark:text-gray-400 transition-colors break-words"
        />
      ),
      strong: (props: any) => (
        <strong
          {...props}
          className="font-bold text-gray-900 dark:text-gray-100 transition-colors"
        />
      ),
      table: (props: any) => (
        <div className="overflow-x-auto mb-6">
          <table
            {...props}
            className="min-w-full divide-y divide-gray-300 dark:divide-gray-700 transition-colors"
          />
        </div>
      ),
      th: (props: any) => (
        <th
          {...props}
          className="py-3 px-4 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider bg-gray-100 dark:bg-gray-800 transition-colors"
        />
      ),
      td: (props: any) => (
        <td
          {...props}
          className="py-2 px-4 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 transition-colors"
        />
      ),
    }),
    []
  );

  return (
    <Layout recentPosts={recentPosts} tags={tags} toc={toc}>
      <Head>
        <title>
          {frontMatter.title} | {siteConfig.title}
        </title>
        <meta
          name="description"
          content={
            frontMatter.description ||
            frontMatter.excerpt ||
            `${frontMatter.title} - ${siteConfig.title}`
          }
        />
        <meta
          property="og:title"
          content={`${frontMatter.title} | ${siteConfig.title}`}
        />
        <meta
          property="og:description"
          content={
            frontMatter.description ||
            frontMatter.excerpt ||
            `${frontMatter.title} - ${siteConfig.title}`
          }
        />
        {frontMatter.image && (
          <meta
            property="og:image"
            content={`${siteConfig.siteUrl}${frontMatter.image}`}
          />
        )}
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl mx-auto px-4 sm:px-0"
      >
        <div className="bg-light-card dark:bg-dark-card rounded-lg overflow-hidden mb-8 shadow-md dark:shadow-none transition-colors">
          {frontMatter.image && (
            <div className="relative w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px]">
              <Image
                src={frontMatter.image}
                alt={frontMatter.title}
                fill
                priority
                className="object-cover"
              />
            </div>
          )}

          <div className="p-4 sm:p-6 md:p-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 transition-colors leading-tight break-words">
              {frontMatter.title}
            </h1>

            <div className="mb-4">
              <BlogMeta
                date={frontMatter.date}
                readingTime={frontMatter.readingTime}
              />
            </div>

            {frontMatter.tags && frontMatter.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {frontMatter.tags.map((tag) => (
                  <Tag key={tag} text={tag} href={`/blog/tag/${tag}`} />
                ))}
              </div>
            )}

            {toc && toc.length > 0 && (
              <div className="lg:hidden mb-8">
                <details className="bg-light-sidebar dark:bg-dark-sidebar p-4 rounded-lg transition-colors">
                  <summary className="text-lg font-bold cursor-pointer text-gray-900 dark:text-white transition-colors">
                    目次
                  </summary>
                  <div className="pt-4">
                    <TableOfContents toc={toc} />
                  </div>
                </details>
              </div>
            )}

            <div className="prose prose-lg dark:prose-invert max-w-none overflow-hidden break-words">
              <MDXRemote {...source} components={components} />
            </div>
          </div>
        </div>

        {/* Blog Post Actions for desktop */}
        <div className="hidden md:flex">
          <BlogPostActions />
        </div>
      </motion.div>

      {/* Comments Section */}
      <div className="bg-light-card dark:bg-dark-card rounded-lg p-4 sm:p-6 md:p-8 shadow-md dark:shadow-none transition-colors">
        <GiscusComments slug={slug} />
      </div>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = getAllMDXSlugs("blog");
  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<BlogPostProps, Params> = async ({
  params,
}) => {
  if (!params?.slug) {
    return {
      notFound: true,
    };
  }

  const { content, frontMatter, toc } = await getMDXContent("blog", params.slug);
  const allPosts = await getAllMDXContent("blog");

  const allTags = allPosts.flatMap((post) => post.frontMatter.tags || []);
  const tagCount: { [key: string]: number } = {};
  allTags.forEach((tag) => {
    tagCount[tag] = (tagCount[tag] || 0) + 1;
  });
  const popularTags = Object.entries(tagCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tag]) => tag);

  const mdxSource = await serialize(content, {
    mdxOptions: {
      rehypePlugins: [
        rehypeSlug,
        [rehypeAutolinkHeadings, { behavior: "wrap" }],
        rehypeCodeTitles,
        [rehypePrism, { showLineNumbers: true }],
      ],
    },
  });

  return {
    props: {
      post: {
        source: mdxSource,
        frontMatter,
        slug: params.slug,
        toc,
      },
      recentPosts: allPosts.slice(0, 5).map((post) => ({
        slug: post.slug,
        title: post.frontMatter.title,
      })),
      tags: popularTags,
    },
  };
};
