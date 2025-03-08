import { motion } from "framer-motion";
import Head from "next/head";
import Layout from "../components/layout/Layout";

export default function Privacy() {
  return (
    <Layout rightSidebar={false} toc={null}>
      <Head>
        <title>プライバシーポリシー | My Portfolio</title>
        <meta name="description" content="My Portfolioのプライバシーポリシー" />
      </Head>

      <div className="max-w-3xl mx-auto py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            プライバシーポリシー
          </h1>

          <p className="text-lg mb-10 text-gray-700 dark:text-gray-300">
            お客様のプライバシーは私たちにとって非常に重要です。本ページでは、個人情報の収集、利用、保護方法について説明します。ご不明な点がございましたら、お問い合わせください。
          </p>

          {/* 詳細なプライバシーポリシーの内容をここに記述 */}
        </motion.div>
      </div>
    </Layout>
  );
}
