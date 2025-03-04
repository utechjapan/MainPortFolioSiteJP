// pages/index.tsx
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import Layout from '../components/layout/Layout';
import { getAllMDXContent } from '../lib/mdx';
import { motion } from 'framer-motion';
import { siteConfig } from '../lib/siteConfig';
import Tag from '../components/ui/Tag';

export default function Home({ posts, recentPosts, tags }) {
  // Define categories
  const categories = [
    ...siteConfig.categories,
    { name: 'HomeLab', icon: '/images/categories/homelab.png', slug: 'homelab' },
    { name: 'Tutorials', icon: '/images/categories/tutorials.png', slug: 'tutorials' },
    { name: 'Automation', icon: '/images/categories/automation.png', slug: 'automation' },
    { name: 'Security', icon: '/images/categories/security.png', slug: 'security' },
  ];
  

  return (
    <Layout recentPosts={recentPosts} tags={tags}>
      <Head>
        <title>{siteConfig.title} | {siteConfig.description}</title>
        <meta name="description" content={siteConfig.description} />
      </Head>

      <div className="space-y-16">
        {/* Browse by Category */}
        <section className="pb-4 border-b border-gray-700">
  <h2 className="text-2xl font-bold mb-6 text-white">
    <span className="inline-block border-b-2 border-primary pb-1">Browse by Category</span>
  </h2>
  
  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
    {siteConfig.categories.map((category) => (
      <Link 
        href={`/blog/category/${category.slug}`} 
        key={category.slug}
        className="flex flex-col items-center group"
      >
        <div className="mb-3 relative w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center overflow-hidden">
          <Image 
            src={category.icon} 
            alt={category.name}
            width={64}
            height={64}
            className="object-contain transition-transform group-hover:scale-110"
          />
        </div>
        <h3 className="text-lg font-medium text-white group-hover:text-primary transition-colors">
          {category.name}
        </h3>
      </Link>
    ))}
  </div>
</section>

        {/* Latest Posts */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              <span className="inline-block border-b-2 border-primary pb-1">Latest Posts</span>
            </h2>
            <Link 
              href="/blog" 
              className="text-primary hover:text-primary-dark flex items-center"
            >
              View all posts 
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <motion.article 
                key={post.slug}
                className="bg-dark-card rounded-lg overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="relative h-48 w-full">
                    <Image 
                      src={post.frontMatter.image || '/images/placeholder.jpg'} 
                      alt={post.frontMatter.title} 
                      fill
                      className="object-cover"
                    />
                  </div>
                </Link>
                
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-400 mb-3">
                    <time dateTime={post.frontMatter.date} className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {format(parseISO(post.frontMatter.date), 'MMMM d, yyyy')}
                    </time>
                    <span className="mx-2">•</span>
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {post.frontMatter.readingTime || '5 min read'}
                    </span>
                  </div>
                  
                  <Link href={`/blog/${post.slug}`}>
                    <h3 className="text-xl font-bold mb-2 text-white hover:text-primary transition-colors">
                      {post.frontMatter.title}
                    </h3>
                  </Link>
                  
                  <p className="text-gray-400 mb-4 line-clamp-2">
                    {post.frontMatter.description}
                  </p>
                  
                  {post.frontMatter.tags && (
                    <div className="flex flex-wrap gap-2">
                      {post.frontMatter.tags.slice(0, 3).map(tag => (
                        <Tag key={tag} text={tag} />
                      ))}
                    </div>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
          
          <div className="flex justify-center mt-10">
            <Link 
              href="/blog" 
              className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-md inline-flex items-center transition-colors"
            >
              View More Posts
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </section>
        
        {/* Subscribe section */}
        <section className="bg-dark-card rounded-lg p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-primary/20 p-4 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-4 text-white">Stay Updated</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Get the latest tutorials, guides, and updates delivered directly to your inbox.
            No spam, unsubscribe anytime.
          </p>
          
          <form className="max-w-md mx-auto">
            <div className="mb-4">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="w-full px-4 py-3 rounded-md bg-dark-sidebar border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary-dark text-white py-3 px-6 rounded-md flex items-center justify-center transition-colors"
            >
              Subscribe Now
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </form>
        </section>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const allPosts = await getAllMDXContent('blog');
  const featuredPosts = allPosts.slice(0, 4);
  
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
      posts: featuredPosts.map(post => ({
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