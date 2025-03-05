import Head from "next/head";
import Image from "next/image";
import Layout from "../components/layout/Layout";
import { motion } from "framer-motion";
import { siteConfig } from "../lib/siteConfig";

export default function About() {
  return (
    <Layout rightSidebar={false}>
      <Head>
        <title>About | {siteConfig.title}</title>
        <meta
          name="description"
          content="Learn more about Chikara Inohara and UTechLabs, where we explore cutting-edge technologies."
        />
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
            {/* Our Mission */}
            <h2 className="text-2xl font-bold mb-4 text-white">Our Mission</h2>
            <p className="text-gray-300 mb-6">
              I'm <strong>Chikara Inohara</strong>, a technology enthusiast and
              innovator based in Japan. I created <strong>UTechLabs</strong> as
              a platform to document my journey through the ever-evolving world
              of technology.
            </p>
            <p className="text-gray-300 mb-6">
              At UTechLabs, my goal is to <strong>Educate</strong> through
              comprehensive tutorials, <strong> Innovate</strong> by exploring
              new tools and methodologies, and <strong> Collaborate</strong>{" "}
              with fellow tech enthusiasts.
            </p>

            {/* Who We Are */}
            <h2 className="text-2xl font-bold mb-4 text-white">Who We Are</h2>
            <p className="text-gray-300 mb-6">
              With years of experience in software development, networking, and
              system administration, I have worked on projects ranging from
              small business solutions to large-scale enterprise systems. My
              background has shaped UTechLabs into a resource for anyone
              interested in modern technology and self-hosting solutions.
            </p>

            {/* What We Cover */}
            <h2 className="text-2xl font-bold mb-4 text-white">
              What We Cover
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-dark-sidebar p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-2 text-primary">
                  Cloud Computing
                </h3>
                <p className="text-gray-400">
                  AWS, Azure, and GCP insights, reviews, and tutorials.
                </p>
              </div>
              <div className="bg-dark-sidebar p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-2 text-primary">
                  DevOps Practices
                </h3>
                <p className="text-gray-400">
                  CI/CD pipelines, automation, and containerization strategies.
                </p>
              </div>
              <div className="bg-dark-sidebar p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-2 text-primary">
                  Programming Languages
                </h3>
                <p className="text-gray-400">
                  Python, Go, and JavaScript development tips and best
                  practices.
                </p>
              </div>
              <div className="bg-dark-sidebar p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-2 text-primary">
                  HomeLab Enthusiast
                </h3>
                <p className="text-gray-400">
                  Building and experimenting with home servers and self-hosted
                  solutions.
                </p>
              </div>
            </div>

            {/* Get In Touch */}
            <h2 className="text-2xl font-bold mb-4 text-white">Get In Touch</h2>
            <p className="text-gray-300 mb-6">
              I'm always excited to connect with fellow tech enthusiasts. Have
              questions or suggestions? Reach out through any of these channels:
            </p>
            <div className="flex items-center space-x-4">
              {siteConfig.socialLinks.map((social) => (
                <a
                  key={social.url}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl text-primary hover:text-primary-dark transition-colors"
                >
                  <i className={social.icon} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
}
