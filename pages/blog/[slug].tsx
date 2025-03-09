import React, { useMemo } from "react";
import Head from "next/head";
import Image from "next/image";
import { motion } from "framer-motion";
import { MDXRemote } from "next-mdx-remote";
import GithubSlugger from "github-slugger";
import { serialize } from "next-mdx-remote/serialize";
import rehypeSlug from "rehype-slug";
import rehypeCodeTitles from "rehype-code-titles";
import rehypePrism from "rehype-prism-plus";
import { GetStaticPaths, GetStaticProps } from "next";

import Layout from "../../components/layout/Layout";
import TableOfContents from "../../components/blog/TableOfContents";
import GiscusComments from "../../components/blog/GiscusComments";
import BlogMeta from "../../components/blog/BlogMeta";
import Tag from "../../components/ui/Tag";
import CopyButton from "../../components/ui/CopyButton";
import FloatingShareButton from "../../components/blog/FloatingShareButton";

import { getMDXContent, getAllMDXSlugs, getAllMDXContent } from "../../lib/mdx";
import { siteConfig } from "../../lib/siteConfig";

interface BlogPostProps {
  post: {
    frontMatter: any;
    source: any;
    slug: string;
    toc: any[];
  };
  recentPosts: { slug: string; title: string }[];
  tags: string[];
}

export default function BlogPost({ post, recentPosts, tags }: BlogPostProps) {
  const { frontMatter, source, slug, toc } = post;

  // Create a GithubSlugger instance to generate fallback id attributes
  const slugger = useMemo(() => new GithubSlugger(), []);
  slugger.reset();

  // Custom MDX components: use props.id if provided (by rehype-slug), otherwise generate one.
  const components = useMemo(
    () => ({
      h1: (props: any) => {
        const text = React.Children.toArray(props.children).join(" ");
        const id = props.id || slugger.slug(text);
        return (
          <h1
            id={id}
            {...props}
            className="text-3xl font-bold mt-8 mb-4 text-gray-900 dark:text-white transition-colors break-words"
          />
        );
      },
      h2: (props: any) => {
        const text = React.Children.toArray(props.children).join(" ");
        const id = props.id || slugger.slug(text);
        return (
          <h2
            id={id}
            {...props}
            className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white transition-colors break-words"
          />
        );
      },
      h3: (props: any) => {
        const text = React.Children.toArray(props.children).join(" ");
        const id = props.id || slugger.slug(text);
        return (
          <h3
            id={id}
            {...props}
            className="text-xl font-bold mt-6 mb-3 text-gray-900 dark:text-white transition-colors break-words"
          />
        );
      },
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
      a: (props: any) => (
        <a
          {...props}
          className="text-primary hover:text-primary-dark underline transition-colors break-words"
          target={props.href && props.href.startsWith("http") ? "_blank" : undefined}
          rel={props.href && props.href.startsWith("http") ? "noopener noreferrer" : undefined}
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
    [slugger]
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
        {frontMatter.image && (
          <meta
            property="og:image"
            content={`${siteConfig.siteUrl}${frontMatter.image}`}
          />
        )}
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      {/* Updated container: horizontal padding removed for all breakpoints */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl mx-auto px-0"
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
                {frontMatter.tags.map((tag: string) => (
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

        <div className="bg-light-card dark:bg-dark-card rounded-lg p-4 sm:p-6 md:p-8 shadow-md dark:shadow-none transition-colors">
          <GiscusComments slug={slug} />
        </div>

        {/* Floating share button appears on mobile */}
        <FloatingShareButton />
      </motion.div>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = getAllMDXSlugs("blog");
  return {
    paths: slugs.map((slug: string) => ({ params: { slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!params?.slug) {
    return { notFound: true };
  }
  // Ensure slug is a string (if array, take the first element)
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const { content, frontMatter, toc } = await getMDXContent("blog", slug);
  const allPosts = await getAllMDXContent("blog");

  const recentPosts = allPosts.slice(0, 5).map((post: any) => ({
    slug: post.slug,
    title: post.frontMatter.title,
  }));

  const allTags = allPosts.flatMap((post: any) => post.frontMatter.tags || []);
  const tagCount: Record<string, number> = {};
  allTags.forEach((tag: string) => {
    tagCount[tag] = (tagCount[tag] || 0) + 1;
  });
  const popularTags = Object.entries(tagCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tag]) => tag);

  // Serialize MDX content with rehypeSlug so headings have id attributes.
  const mdxSource = await serialize(content, {
    mdxOptions: {
      rehypePlugins: [rehypeSlug, rehypeCodeTitles, [rehypePrism, { showLineNumbers: true }]],
    },
  });

  return {
    props: {
      post: {
        source: mdxSource,
        frontMatter,
        slug,
        toc,
      },
      recentPosts,
      tags: popularTags,
    },
  };
};
