import { motion } from "framer-motion";
import Head from "next/head";
import Layout from "../components/layout/Layout";

export default function Terms() {
  return (
    <Layout rightSidebar={false} toc={null}>
      <Head>
        <title>利用規約 | My Portfolio</title>
        <meta name="description" content="My Portfolioの利用規約" />
      </Head>

      <div className="max-w-3xl mx-auto py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            利用規約
          </h1>

          <p className="text-lg mb-10 text-gray-700 dark:text-gray-300">
            本サイトをご利用になる前に、以下の利用規約をよくお読みください。サイトへのアクセスまたは利用は、これらの規約に同意したものとみなされます。すべての規約に同意いただけない場合は、サイトのご利用をお控えください。
          </p>

          {/* 詳細な利用規約の内容をここに記述 */}
        </motion.div>
      </div>
    </Layout>
  );
}
