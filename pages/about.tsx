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
        <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white transition-colors">
          About
        </h1>

        <div className="bg-light-card dark:bg-dark-card rounded-lg overflow-hidden mb-8 shadow-md dark:shadow-none transition-colors">
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
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white transition-colors">
              Our Mission
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6 transition-colors">
              I'm{" "}
              <strong className="text-gray-900 dark:text-white">
                Chikara Inohara
              </strong>
              , a technology enthusiast and innovator based in Japan. I created{" "}
              <strong className="text-gray-900 dark:text-white">
                UTechLabs
              </strong>{" "}
              as a platform to document my journey through the ever-evolving
              world of technology.
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-6 transition-colors">
              At UTechLabs, my goal is to{" "}
              <strong className="text-gray-900 dark:text-white">Educate</strong>{" "}
              through comprehensive tutorials,{" "}
              <strong className="text-gray-900 dark:text-white">
                {" "}
                Innovate
              </strong>{" "}
              by exploring new tools and methodologies, and{" "}
              <strong className="text-gray-900 dark:text-white">
                {" "}
                Collaborate
              </strong>{" "}
              with fellow tech enthusiasts.
            </p>

            {/* Who We Are */}
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white transition-colors">
              Who We Are
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6 transition-colors">
              With years of experience in software development, networking, and
              system administration, I have worked on projects ranging from
              small business solutions to large-scale enterprise systems. My
              background has shaped UTechLabs into a resource for anyone
              interested in modern technology and self-hosting solutions.
            </p>

            {/* What We Cover */}
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white transition-colors">
              What We Cover
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-light-sidebar dark:bg-dark-sidebar p-4 rounded-lg transition-colors">
                <h3 className="font-bold text-lg mb-2 text-primary">
                  Cloud Computing
                </h3>
                <p className="text-gray-700 dark:text-gray-400 transition-colors">
                  AWS, Azure, and GCP insights, reviews, and tutorials.
                </p>
              </div>
              <div className="bg-light-sidebar dark:bg-dark-sidebar p-4 rounded-lg transition-colors">
                <h3 className="font-bold text-lg mb-2 text-primary">
                  DevOps Practices
                </h3>
                <p className="text-gray-700 dark:text-gray-400 transition-colors">
                  CI/CD pipelines, automation, and containerization strategies.
                </p>
              </div>
              <div className="bg-light-sidebar dark:bg-dark-sidebar p-4 rounded-lg transition-colors">
                <h3 className="font-bold text-lg mb-2 text-primary">
                  Programming Languages
                </h3>
                <p className="text-gray-700 dark:text-gray-400 transition-colors">
                  Python, Go, and JavaScript development tips and best
                  practices.
                </p>
              </div>
              <div className="bg-light-sidebar dark:bg-dark-sidebar p-4 rounded-lg transition-colors">
                <h3 className="font-bold text-lg mb-2 text-primary">
                  HomeLab Enthusiast
                </h3>
                <p className="text-gray-700 dark:text-gray-400 transition-colors">
                  Building and experimenting with home servers and self-hosted
                  solutions.
                </p>
              </div>
            </div>

            {/* Get In Touch */}
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white transition-colors">
              Get In Touch
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6 transition-colors">
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
