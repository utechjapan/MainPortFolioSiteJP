// pages/blog/index.tsx
import Head from 'next/head';
import Layout from '../../components/layout/Layout';
import BlogCard from '../../components/blog/BlogCard';
import { getAllMDXContent } from '../../lib/mdx';
import { motion } from 'framer-motion';
import { useState } from 'react';
import SearchBar from '../../components/ui/SearchBar';
import { siteConfig } from '../../lib/siteConfig';

export default function BlogIndex({ posts, recentPosts, tags }) {
  const [activeTag, setActiveTag] = useState('all');
  
  // Filter posts by tag
  const filteredPosts = activeTag === 'all' 
    ? posts 
    : posts.filter(post => post.frontMatter.tags?.includes(activeTag));

  // Extract all unique tags
  const allTags = ['all', ...new Set(posts.flatMap(post => post.frontMatter.tags || []))];

  return (
    <Layout recentPosts={recentPosts} tags={tags}>
      <Head>
        <title>Blog | {siteConfig.title}</title>
        <meta name="description" content="Browse all blog posts, tutorials and guides" />
      </Head>

      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-white">Blog</h1>
        <SearchBar className="max-w-3xl mb-8" />
        
        {/* Filter tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-4 py-2 rounded-full text-sm ${
                activeTag === tag 
                  ? 'bg-primary text-white' 
                  : 'bg-dark-card text-gray-400 hover:bg-dark-sidebar'
              } transition-colors`}
            >
              {tag === 'all' ? 'All Posts' : tag}
            </button>
          ))}
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
          <h3 className="text-xl font-bold mb-2 text-white">No posts found</h3>
          <p className="text-gray-400 mb-6">
            No posts found with the selected tag. Try selecting a different category.
          </p>
          <button 
            onClick={() => setActiveTag('all')}
            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md"
          >
            Show All Posts
          </button>
        </div>
      )}
    </Layout>
  );
}

export async function getStaticProps() {
  const allPosts = await getAllMDXContent('blog');
  
  // Extract all tags
  const allTags = allPosts.flatMap(post => post.frontMatter.tags || []);
  const tagCount = {};
  
  // Count tag occurrences
  allTags.forEach(tag => {
    tagCount[tag] = (tagCount[tag] || 0) + 1;
  });
  
  // Sort by count and take top 10
  const popularTags = Object.entries(tagCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tag]) => tag);
  
  return {
    props: {
      posts: allPosts.map(post => ({
        slug: post.slug,
        frontMatter: post.frontMatter,
      })),
      recentPosts: allPosts.slice(0, 5).map(post => ({
        slug: post.slug,
        title: post.frontMatter.title,
      })),
      tags: popularTags,
    },
  };
}