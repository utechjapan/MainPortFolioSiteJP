// pages/network-lab.tsx
import React from 'react';
import Head from 'next/head';
import Layout from '../components/layout/Layout';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { siteConfig } from '../lib/siteConfig';

// Dynamically import the simulator (client–side only)
const NetworkLabSimulator = dynamic(() => import('../components/labs/NetworkLabSimulator'), {
  ssr: false,
  loading: () => (
    <div className="bg-light-card dark:bg-dark-card p-6 rounded-lg shadow-lg h-96 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-gray-700 dark:text-gray-300">ネットワークラボを読み込み中...</p>
      </div>
    </div>
  ),
});

const NetworkLab: React.FC = () => {
  return (
    <Layout rightSidebar={false}>
      <Head>
        <title>ネットワークラボ | {siteConfig.title}</title>
        <meta name="description" content="高度なネットワーク構成をシミュレーションしテストする仮想ラボ環境" />
      </Head>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto p-6"
      >
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            ネットワークラボ
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            実践的なネットワーク設計・構築とシミュレーションを体験してください。
          </p>
        </div>
        <NetworkLabSimulator />
        <div className="mt-10 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-6 rounded-lg">
          <div className="flex flex-col md:flex-row items-start">
            <div className="bg-blue-100 dark:bg-blue-800/50 rounded-full p-3 mr-4 mb-4 md:mb-0 flex-shrink-0">
              <i className="fas fa-info-circle text-blue-600 dark:text-blue-400 text-xl"></i>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                ラボの注意事項
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                このシミュレーターは教育目的および実験用です。実際のネットワーク構成とは異なる点がありますのでご注意ください。
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                ノードの移動、ズーム、編集、接続作成、リージョン管理、CLI操作、そしてネットワークテスト機能を使って、仮想ネットワーク環境を自在に操作できます。
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default NetworkLab;
