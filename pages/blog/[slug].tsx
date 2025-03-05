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

import {
  getMDXContent,
  getAllMDXSlugs,
  getAllMDXContent,
  MDXFrontMatter,
} from "../../lib/mdx";

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
        <h1 {...props} className="text-3xl font-bold mt-8 mb-4 text-white" />
      ),
      h2: (props: any) => (
        <h2 {...props} className="text-2xl font-bold mt-8 mb-4 text-white" />
      ),
      h3: (props: any) => (
        <h3 {...props} className="text-xl font-bold mt-6 mb-3 text-white" />
      ),
      p: (props: any) => <p {...props} className="mb-4 text-gray-300" />,
      ul: (props: any) => (
        <ul {...props} className="list-disc ml-6 mb-4 text-gray-300" />
      ),
      ol: (props: any) => (
        <ol {...props} className="list-decimal ml-6 mb-4 text-gray-300" />
      ),
      li: (props: any) => <li {...props} className="mb-1" />,
      img: (props: any) => (
        <div className="my-8 relative aspect-[16/9] w-full">
          <Image
            src={props.src}
            alt={props.alt || ""}
            fill
            className="object-cover rounded-lg"
          />
        </div>
      ),
      a: (props: any) => (
        <a
          {...props}
          className="text-primary hover:text-primary-dark underline"
        />
      ),
      code: (props: any) => {
        if (props.className) {
          return (
            <code
              {...props}
              className={`${props.className} rounded p-1 text-sm`}
            />
          );
        }
        return (
          <code
            {...props}
            className="bg-gray-800 rounded p-1 text-sm text-gray-200"
          />
        );
      },
      pre: (props: any) => {
        // Extract plain text from <pre> so CopyButton can use it
        const textContent = props.children?.props?.children || "";
        return (
          <div className="relative group">
            <pre
              {...props}
              className="bg-gray-800 p-4 rounded-lg overflow-x-auto mb-6 py-6"
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
          className="border-l-4 border-primary pl-4 italic my-6 text-gray-400"
        />
      ),
    }),
    []
  );

  return (
    <Layout recentPosts={recentPosts} tags={tags} toc={toc}>
      <Head>
        <title>{frontMatter.title} | Blog</title>
        <meta
          name="description"
          content={frontMatter.description || frontMatter.excerpt}
        />
      </Head>

      {/* Match 'About' style: fade-in + max-w + card container */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <div className="bg-dark-card rounded-lg overflow-hidden mb-8">
          {/* Cover image */}
          {frontMatter.image && (
            <div className="relative aspect-[16/9] w-full">
              <Image
                src={frontMatter.image}
                alt={frontMatter.title}
                fill
                priority
                className="object-cover"
              />
            </div>
          )}

          {/* Post content */}
          <div className="p-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              {frontMatter.title}
            </h1>

            <div className="mb-4">
              <BlogMeta
                date={frontMatter.date}
                readingTime={frontMatter.readingTime}
              />
            </div>

            {/* Optional tags */}
            {frontMatter.tags && frontMatter.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {frontMatter.tags.map((tag) => (
                  <Tag key={tag} text={tag} />
                ))}
              </div>
            )}

            {/* Table of Contents on mobile */}
            <div className="lg:hidden mb-8">
              <details className="bg-dark-sidebar p-4 rounded-lg">
                <summary className="text-lg font-bold cursor-pointer text-white">
                  Table of Contents
                </summary>
                <div className="pt-4">
                  <TableOfContents toc={toc} />
                </div>
              </details>
            </div>

            {/* Actual MDX content */}
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <MDXRemote {...source} components={components} />
            </div>
          </div>
        </div>

        {/* Comments in a separate card */}
        <div className="bg-dark-card rounded-lg p-8">
          <GiscusComments slug={slug} />
        </div>
      </motion.div>
    </Layout>
  );
}

//
// getStaticPaths
//
export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = getAllMDXSlugs("blog");
  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: false,
  };
};

//
// getStaticProps
//
export const getStaticProps: GetStaticProps<BlogPostProps, Params> = async ({
  params,
}) => {
  // Make sure we don't proceed if 'slug' is missing
  if (!params?.slug) {
    return {
      notFound: true,
    };
  }

  // Load the MDX file for this particular slug
  const { content, frontMatter, toc } = await getMDXContent(
    "blog",
    params.slug
  );

  // Load all blog posts to generate 'recentPosts' + 'popularTags'
  const allPosts = await getAllMDXContent("blog");

  // Extract all tags
  const allTags = allPosts.flatMap((post) => post.frontMatter.tags || []);
  const tagCount: { [key: string]: number } = {};
  allTags.forEach((tag) => {
    tagCount[tag] = (tagCount[tag] || 0) + 1;
  });
  // Sort by count and take top 10
  const popularTags = Object.entries(tagCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tag]) => tag);

  // Prepare MDX
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

  // Return props
  return {
    props: {
      post: {
        source: mdxSource,
        frontMatter,
        slug: params.slug,
        toc,
      },
      recentPosts: allPosts.slice(0, 5).map((p) => ({
        slug: p.slug,
        title: p.frontMatter.title,
      })),
      tags: popularTags,
    },
  };
};
