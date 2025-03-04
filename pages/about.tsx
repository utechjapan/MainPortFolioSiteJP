// pages/about.tsx
import Head from 'next/head';
import Image from 'next/image';
import Layout from '../components/layout/Layout';
import { motion } from 'framer-motion';
import { siteConfig } from '../lib/siteConfig';

export default function About() {
  return (
    <Layout rightSidebar={false}>
      <Head>
        <title>About | {siteConfig.title}</title>
        <meta name="description" content="Learn more about our mission and values" />
      </Head>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-8 text-white">About</h1>
        
        <div className="bg-dark-card rounded-lg overflow-hidden mb-8">
          <div className="relative h-64 w-full">
            <Image
              src="/images/about-cover.jpg"
              alt="About us cover"
              fill
              className="object-cover"
            />
          </div>
          
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-4 text-white">Our Mission</h2>
            <p className="text-gray-300 mb-6">
              Welcome to {siteConfig.title}, where we're passionate about sharing knowledge and helping others build their perfect homelab and self-hosted environments.
            </p>
            
            <p className="text-gray-300 mb-6">
              Our mission is to provide high-quality tutorials, guides, and resources that empower tech enthusiasts to take control of their digital infrastructure and data. We believe in the power of self-hosting and open-source solutions to create more private, secure, and customizable technology experiences.
            </p>
            
            <h2 className="text-2xl font-bold mb-4 text-white">Who We Are</h2>
            <p className="text-gray-300 mb-6">
              {siteConfig.title} was founded by a group of technology enthusiasts with backgrounds in system administration, networking, security, and software development. What started as a personal blog to document homelab projects has grown into a community resource for anyone interested in self-hosting and home server setups.
            </p>
            
            <h2 className="text-2xl font-bold mb-4 text-white">What We Cover</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-dark-sidebar p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-2 text-primary">HomeLab Setups</h3>
                <p className="text-gray-400">
                  Hardware recommendations, build guides, and infrastructure planning for your home server environment.
                </p>
              </div>
              <div className="bg-dark-sidebar p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-2 text-primary">Self-Hosting</h3>
                <p className="text-gray-400">
                  Tutorials on running your own services like media servers, password managers, git repositories, and more.
                </p>
              </div>
              <div className="bg-dark-sidebar p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-2 text-primary">Security & Privacy</h3>
                <p className="text-gray-400">
                  Best practices for securing your home network, servers, and protecting your digital privacy.
                </p>
              </div>
              <div className="bg-dark-sidebar p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-2 text-primary">Automation</h3>
                <p className="text-gray-400">
                  Guides on automating deployments, backups, and maintenance tasks using tools like Ansible, Docker, and more.
                </p>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold mb-4 text-white">Get In Touch</h2>
            <p className="text-gray-300">
              Have questions, suggestions, or want to contribute? We'd love to hear from you! Reach out through any of our social channels or send us an email.
            </p>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
}