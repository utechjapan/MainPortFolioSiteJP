// pages/search.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../components/layout/Layout';
import SearchBar from '../components/ui/SearchBar';
import BlogCard from '../components/blog/BlogCard';
import { getAllMDXContent } from '../lib/mdx';
import { motion } from 'framer-motion';

export default function Search({ allPosts, recentPosts, tags }) {
  const router = useRouter();
  const { q } = router.query;
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (typeof q === 'string') {
      setSearchTerm(q);
      performSearch(q);
    }
  }, [q]);

  const performSearch = (term) => {
    setIsSearching(true);
    
    // Simple search logic: match against title, description, tags
    const results = allPosts.filter(post => {
      const title = post.frontMatter.title.toLowerCase();
      const description = (post.frontMatter.description || '').toLowerCase();
      const tags = (post.frontMatter.tags || []).join(' ').toLowerCase();
      const searchTermLower = term.toLowerCase();
      
      return (
        title.includes(searchTermLower) || 
        description.includes(searchTermLower) || 
        tags.includes(searchTermLower)
      );
    });
    
    setSearchResults(results);
    setIsSearching(false);
  };

  return (
    <Layout rightSidebar={true} recentPosts={recentPosts} tags={tags}>
      <Head>
        <title>Search Results | {searchTerm ? `"${searchTerm}"` : 'Search'}</title>
        <meta name="description" content="Search for blog posts and tutorials" />
      </Head>

      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-6 text-white">Search Posts</h1>
        <SearchBar 
          placeholder="Search for titles, content, or tags..." 
          className="max-w-3xl"
        />
      </div>
      
      {searchTerm && (
        <div className="mb-8">
          <h2 className="text-xl text-gray-400">
            {isSearching ? (
              'Searching...'
            ) : (
              <>
                {searchResults.length} results for <span className="text-primary">"{searchTerm}"</span>
              </>
            )}
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
        !isSearching && searchTerm && (
          <div className="bg-dark-card p-8 rounded-lg text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-bold mb-2 text-white">No results found</h3>
            <p className="text-gray-400 mb-6">
              We couldn't find any posts matching your search. Try different keywords or browse our categories.
            </p>
            <div className="flex justify-center">
              <button 
                onClick={() => router.push('/')}
                className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md"
              >
                Browse Categories
              </button>
            </div>
          </div>
        )
      )}
      
      {!searchTerm && (
        <div className="bg-dark-card p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-white">Search Tips</h2>
          <ul className="text-gray-300 space-y-2">
            <li>• Use specific keywords related to what you're looking for</li>
            <li>• Try searching for categories like "homelab" or "docker"</li>
            <li>• Search for technologies like "proxmox" or "kubernetes"</li>
            <li>• You can also search by post titles or descriptions</li>
          </ul>
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
      allPosts: allPosts.map(post => ({
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