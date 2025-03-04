// pages/blog/[slug].tsx
import { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { ParsedUrlQuery } from 'querystring';
import { useMemo } from 'react';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeCodeTitles from 'rehype-code-titles';
import rehypePrism from 'rehype-prism-plus';

import Layout from '../../components/layout/Layout';
import TableOfContents from '../../components/blog/TableOfContents';
import GiscusComments from '../../components/blog/GiscusComments';
import { getMDXContent, getAllMDXSlugs, getAllMDXContent, MDXFrontMatter } from '../../lib/mdx';
import BlogMeta from '../../components/blog/BlogMeta';
import Tag from '../../components/ui/Tag';
import CopyButton from '../../components/ui/CopyButton'; // Update path if needed

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

  // Custom components for MDX
  const components = useMemo(() => {
    return {
      h1: (props: any) => <h1 {...props} className="text-3xl font-bold mt-8 mb-4 text-white" />,
      h2: (props: any) => <h2 {...props} className="text-2xl font-bold mt-8 mb-4 text-white" />,
      h3: (props: any) => <h3 {...props} className="text-xl font-bold mt-6 mb-3 text-white" />,
      p: (props: any) => <p {...props} className="mb-4 text-gray-300" />,
      ul: (props: any) => <ul {...props} className="list-disc ml-6 mb-4 text-gray-300" />,
      ol: (props: any) => <ol {...props} className="list-decimal ml-6 mb-4 text-gray-300" />,
      li: (props: any) => <li {...props} className="mb-1" />,
      img: (props: any) => (
        <div className="my-8 relative h-96 w-full">
          <Image
            src={props.src}
            alt={props.alt || ''}
            fill
            className="object-cover rounded-lg"
          />
        </div>
      ),
      a: (props: any) => <a {...props} className="text-primary hover:text-primary-dark underline" />,
      code: (props: any) => {
        if (props.className) {
          return <code {...props} className={`${props.className} rounded p-1 text-sm`} />;
        }
        return <code {...props} className="bg-gray-800 rounded p-1 text-sm text-gray-200" />;
      },
      pre: (props: any) => {
        // Extract the code content
        const textContent = props.children?.props?.children || '';

        return (
          <div className="relative group">
            <pre {...props} className="bg-gray-800 p-4 rounded-lg overflow-x-auto mb-6 py-6">
              {props.children}
            </pre>
            <CopyButton text={textContent} />
          </div>
        );
      },
      blockquote: (props: any) => (
        <blockquote {...props} className="border-l-4 border-primary pl-4 italic my-6 text-gray-400" />
      ),
    };
  }, []);

  return (
    <Layout recentPosts={recentPosts} tags={tags} toc={toc}>
      <Head>
        <title>{frontMatter.title} | Blog</title>
        <meta name="description" content={frontMatter.description || frontMatter.excerpt} />
      </Head>

      <article className="max-w-4xl mx-auto">
        {/* Cover image */}
        {/* ...rest of your component */}

        {/* Mobile Table of Contents */}
        <div className="lg:hidden mb-8">
          <details className="bg-dark-card p-4 rounded-lg">
            <summary className="text-lg font-bold cursor-pointer text-white">
              Table of Contents
            </summary>
            <div className="pt-4">
              <TableOfContents toc={toc} />
            </div>
          </details>
        </div>

        {/* Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <MDXRemote {...source} components={components} />
        </div>

        {/* Comments */}
        <GiscusComments slug={slug} />
      </article>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllMDXSlugs('blog').map(slug => ({ params: { slug } }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<BlogPostProps, Params> = async ({ params }) => {
  const slug = params?.slug as string;
  const { content, frontMatter, toc } = await getMDXContent('blog', slug);

  // Get all posts for recent posts sidebar
  const allPosts = await getAllMDXContent('blog');

  // Extract all tags for sidebar
  const allTags = allPosts.flatMap(post => post.frontMatter.tags || []);
  const tagCount: { [key: string]: number } = {};

  // Count tag occurrences
  allTags.forEach(tag => {
    tagCount[tag] = (tagCount[tag] || 0) + 1;
  });

  // Sort by count and take top 10 tags
  const popularTags = Object.entries(tagCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tag]) => tag);

  const mdxSource = await serialize(content, {
    mdxOptions: {
      rehypePlugins: [
        rehypeSlug,
        [rehypeAutolinkHeadings, { behavior: 'wrap' }],
        rehypeCodeTitles,
        [rehypePrism, { showLineNumbers: true }], // Enable line numbers
      ],
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
      recentPosts: allPosts.slice(0, 5).map(post => ({
        slug: post.slug,
        title: post.frontMatter.title,
      })),
      tags: popularTags,
    },
  };
};
