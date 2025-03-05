// pages/blog/category/[category].tsx
import { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import Layout from '../../../components/layout/Layout';
import BlogCard from '../../../components/blog/BlogCard';
import { getAllMDXContent } from '../../../lib/mdx';
import { motion } from 'framer-motion';
import { ParsedUrlQuery } from 'querystring';
import { siteConfig } from '../../../lib/siteConfig';
import Image from 'next/image';
import { Post, RecentPost, CategoryInfo } from '../../../types';

interface CategoryPageProps {
  posts: Post[];
  category: string;
  categoryInfo: CategoryInfo;
  recentPosts: RecentPost[];
  tags: string[];
}

interface Params extends ParsedUrlQuery {
  category: string;
}

export default function CategoryPage({ posts, category, categoryInfo, recentPosts, tags }: CategoryPageProps) {
  return (
    <Layout recentPosts={recentPosts} tags={tags}>
      <Head>
        <title>{categoryInfo.name} | {siteConfig.title}</title>
        <meta name="description" content={categoryInfo.description} />
      </Head>

      <div className="mb-8">
        <div className="flex items-center mb-6">
          <div className="mr-4 relative w-16 h-16">
            <Image 
              src={categoryInfo.icon} 
              alt={categoryInfo.name}
              fill
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">{categoryInfo.name}</h1>
            <p className="text-gray-400">{categoryInfo.description}</p>
          </div>
        </div>
        
        <p className="text-gray-400">
          Showing {posts.length} post{posts.length !== 1 ? 's' : ''} in this category
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
            We couldn't find any posts in the "{categoryInfo.name}" category.
          </p>
        </div>
      )}
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  // Get categories from siteConfig
  const categories = siteConfig.categories.map(cat => cat.slug);
  
  // Create paths for each category
  const paths = categories.map(category => ({ 
    params: { category }
  }));
  
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<CategoryPageProps, Params> = async ({ params }) => {
  const category = params?.category as string;
  const allPosts = await getAllMDXContent('blog');
  
  // Get category info from siteConfig
  const categoryInfo = siteConfig.categories.find(cat => cat.slug === category) || {
    name: category.charAt(0).toUpperCase() + category.slice(1),
    icon: '/images/categories/default.png',
    description: `Posts related to ${category}`,
    slug: category
  };
  
  // Filter posts by category (looking at tags for now)
  const filteredPosts = allPosts.filter(post => 
    post.frontMatter.tags?.includes(category)
  );
  
  // Extract all tags
  const allTags = allPosts.flatMap(post => post.frontMatter.tags || []);
  const tagCount: Record<string, number> = {};
  
  // Count tag occurrences
  allTags.forEach(t => {
    tagCount[t] = (tagCount[t] || 0) + 1;
  });
  
  // Sort by count and take top 10
  const popularTags = Object.entries(tagCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([t]) => t);
  
  return {
    props: {
      posts: filteredPosts.map(post => ({
        slug: post.slug,
        frontMatter: post.frontMatter,
      })),
      category,
      categoryInfo,
      recentPosts: allPosts.slice(0, 5).map(post => ({
        slug: post.slug,
        title: post.frontMatter.title,
      })),
      tags: popularTags,
    },
  };
};