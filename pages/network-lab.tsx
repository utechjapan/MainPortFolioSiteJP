// pages/network-lab.tsx
import React from "react";
import Head from "next/head";
import Layout from "../components/layout/Layout";
import { motion } from "framer-motion";
import { siteConfig } from "../lib/siteConfig";
import dynamic from "next/dynamic";

// Dynamically import NetworkLabSimulator (client‑only)
const NetworkLabSimulator = dynamic(
  () => import("../components/labs/NetworkLabSimulator"),
  {
    ssr: false,
    loading: () => (
      <div className="bg-light-card dark:bg-dark-card p-4 md:p-6 rounded-lg shadow-lg mb-8 h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-700 dark:text-gray-300">ネットワークラボを読み込み中...</p>
        </div>
      </div>
    )
  }
);

export default function NetworkLab() {
  return (
    <Layout rightSidebar={false}>
      <Head>
        <title>ネットワークラボ | {siteConfig.title}</title>
        <meta
          name="description"
          content="高度なネットワーク構成をシミュレートしテストするための仮想ラボ環境。マルチサイトネットワークやVPN、ファイアウォールを体験できます。"
        />
      </Head>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white transition-colors bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              ネットワークラボ
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 transition-colors">
              実践的なネットワーク設計と構築を体験する仮想環境
            </p>
          </div>
          <div className="bg-light-sidebar dark:bg-dark-sidebar rounded-lg p-2">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">新機能</div>
            <div className="flex items-center space-x-2 text-sm">
              <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-xs">VPN接続</span>
              <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-xs">マルチサイト</span>
              <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-xs">ファイアウォール</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 bg-light-card dark:bg-dark-card rounded-lg shadow-md overflow-hidden">
            <div className="p-4 md:p-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white transition-colors">
                ネットワーク構成シミュレータ
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6 transition-colors">
                このラボでは、実際のネットワーク環境に近い構成をインタラクティブに構築し、シミュレートできます。
              </p>
            </div>
          </div>
          <div className="bg-light-card dark:bg-dark-card rounded-lg shadow-md overflow-hidden">
            <div className="p-4 md:p-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white transition-colors">使用方法</h2>
              {/* Insert usage instructions here */}
            </div>
          </div>
        </div>

        {/* Render the NetworkLabSimulator */}
        <NetworkLabSimulator />

        <div className="mt-10 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-6 rounded-lg">
          <div className="flex flex-col md:flex-row items-start">
            <div className="bg-blue-100 dark:bg-blue-800/50 rounded-full p-3 mr-4 mb-4 md:mb-0 flex-shrink-0">
              <i className="fas fa-info-circle text-blue-600 dark:text-blue-400 text-xl"></i>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">ラボについての注意事項</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">このシミュレーターは教育目的のみに設計されています。</p>
              <p className="text-gray-700 dark:text-gray-300">詳細についてはお問い合わせください。</p>
            </div>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
}
