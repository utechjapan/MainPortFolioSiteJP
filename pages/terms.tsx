import { motion } from 'framer-motion';
import Head from 'next/head';
import Layout from '../components/layout/Layout';

export default function Terms() {
  return (
    <Layout rightSidebar={false}>
      <Head>
        <title>Terms of Service | My Portfolio</title>
        <meta name="description" content="Terms of Service for My Portfolio" />
      </Head>
      
      <div className="max-w-3xl mx-auto py-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            Terms of Service
          </h1>
          
          <p className="text-lg mb-10 text-gray-700 dark:text-gray-300">
            Please read these terms of service carefully before using our website. By accessing
            or using the site, you agree to be bound by these terms. If you do not agree to all 
            the terms, then you may not access the site or use any of its services.
          </p>
          
          {/* Add more detailed terms of service text as needed */}
        </motion.div>
      </div>
    </Layout>
  );
}
