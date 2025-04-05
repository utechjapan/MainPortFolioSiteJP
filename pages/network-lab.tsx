// pages/network-lab.tsx
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import { siteConfig } from '../lib/siteConfig';
import useWindowSize from '../hooks/useWindowSize';

// Separate components for mobile and desktop
const NetworkTopologyDesigner = dynamic(
  () => import('../components/network-lab/NetworkTopologyDesigner'),
  {
    ssr: false,
    loading: () => <Loading message="ネットワークデザイナー読み込み中" />,
  }
);

const MobileTopologyViewer = dynamic(
  () => import('../components/network-lab/MobileTopologyViewer'),
  {
    ssr: false,
    loading: () => <Loading message="ビューア読み込み中" />,
  }
);

// Enhanced loading component
const Loading = ({ message = "読み込み中" }) => (
  <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center bg-white dark:bg-gray-900 rounded-lg p-6 shadow">
    <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mb-4"></div>
    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{message}</h3>
    <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
      少々お待ちください...
    </p>
  </div>
);

const NetworkLab: React.FC = () => {
  const { width } = useWindowSize();
  const [isMobile, setIsMobile] = useState(false);
  
  // Determine if on mobile device based on screen width
  useEffect(() => {
    setIsMobile(width < 768);
  }, [width]);

  return (
    <Layout rightSidebar={false}>
      <Head>
        <title>ネットワークラボ | {siteConfig.title}</title>
        <meta
          name="description"
          content="仮想ネットワーク構成を作成・テストするための対話型ネットワークトポロジーデザイナー。"
        />
      </Head>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gray-100 dark:bg-gray-900 pt-4 px-4 sm:px-6"
      >
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex flex-col">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                ネットワークトポロジーデザイナー
              </h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                この対話型ツールを使用して、ネットワークトポロジーを作成、テスト、視覚化します。
                {isMobile ? (
                  <span className="block mt-2 text-yellow-500 font-medium">
                    <i className="fas fa-info-circle mr-1"></i>
                    モバイルデバイスでは閲覧モードのみ利用可能です。フルエディタはPCからアクセスしてください。
                  </span>
                ) : (
                  <span>ネットワークをデザインし、デバイスを構成して、接続性をテストできます。</span>
                )}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="h-[calc(100vh-200px)] min-h-[500px]">
                {isMobile ? (
                  <MobileTopologyViewer />
                ) : (
                  <NetworkTopologyDesigner />
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                ネットワークラボについて
              </h2>
              <div className="prose dark:prose-invert max-w-none">
                <p>
                  ネットワークトポロジーデザイナーは、仮想ネットワーク構成を作成およびテストするための強力なツールです。
                  ネットワークエンジニア、IT専門家、学生がネットワークトポロジーを設計し、デバイスを構成し、
                  ネットワークコンポーネント間の接続をテストするのに役立ちます。
                </p>
                <h3>主な機能:</h3>
                <ul>
                  <li>
                    <strong>視覚的なネットワーク設計:</strong> デバイスをドラッグ＆ドロップし、接続を作成し、
                    ネットワークを視覚的に整理します。
                  </li>
                  <li>
                    <strong>デバイス構成:</strong> 各デバイスのIPアドレス、VLAN、ルーティングテーブルなどを
                    構成します。
                  </li>
                  <li>
                    <strong>ネットワークシミュレーション:</strong> pingテストでデバイス間の接続をテストし、
                    パケットの経路を表示します。
                  </li>
                  <li>
                    <strong>VLANサポート:</strong> VLANの作成と管理、ポートへのVLAN割り当て、
                    VLAN分離の視覚化を行います。
                  </li>
                  <li>
                    <strong>エクスポートオプション:</strong> 後でインポートするためにネットワークトポロジーを
                    JSONとしてエクスポートするか、ドキュメント用にPDFとしてエクスポートします。
                  </li>
                </ul>
                {!isMobile && (
                  <>
                    <h3>使い方:</h3>
                    <ol>
                      <li>左のツールバーからデバイスをキャンバスにドラッグします。</li>
                      <li>ポートをクリックして別のデバイスのポートにドラッグすることでデバイスを接続します。</li>
                      <li>右側のパネルを使用してIPアドレスなどのデバイスプロパティを設定します。</li>
                      <li>上部ツールバーのVLAN管理ツールを使用してVLANを管理します。</li>
                      <li>シミュレーションを開始してネットワーク構成をテストします。</li>
                    </ol>
                  </>
                )}
                <p>
                  このツールは、アクセスしやすく使いやすい状態を維持しながら、現実的なネットワークシミュレーション体験を
                  提供するように設計されています。ネットワーク認定資格の勉強をしている場合でも、ネットワーク展開を
                  計画している場合でも、単にネットワークの概念を実験している場合でも、ネットワークトポロジーデザイナーは
                  アイデアを視覚化してテストするのに役立ちます。
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default NetworkLab;