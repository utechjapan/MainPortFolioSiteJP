import { motion } from 'framer-motion';
import Head from 'next/head';
import Layout from '../components/layout/Layout';
// If using older Next.js, you may need: import React from 'react';

export default function Privacy() {
  return (
    <Layout rightSidebar={false}>
      <Head>
        <title>Privacy Policy | My Portfolio</title>
        <meta name="description" content="Privacy Policy for My Portfolio" />
      </Head>
      
      <div className="max-w-3xl mx-auto py-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          
          <p className="text-lg mb-10 text-gray-700 dark:text-gray-300">
            Your privacy is important to us. This page outlines how we collect, use,
            and protect your personal data. Please review this policy carefully and
            contact us if you have any questions.
          </p>

          {/* Add more detailed privacy policy text as needed */}
        </motion.div>
      </div>
    </Layout>
  );
}
