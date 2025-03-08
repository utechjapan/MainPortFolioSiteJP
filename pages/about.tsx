import React from "react";
import Head from "next/head";
import Image from "next/image";
import Layout from "../components/layout/Layout";
import { motion } from "framer-motion";
import { siteConfig } from "../lib/siteConfig";

export default function About() {
  return (
    <Layout rightSidebar={false}>
      <Head>
        <title>自己紹介 | {siteConfig.title}</title>
        <meta
          name="description"
          content="井ノ原力のプロフィールとUTechLabの紹介。ITインフラ技術とネットワークの知見を発信しています。"
        />
      </Head>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white transition-colors">
          自己紹介
        </h1>

        <div className="bg-light-card dark:bg-dark-card rounded-lg overflow-hidden mb-8 shadow-md dark:shadow-none transition-colors">
          <div className="relative h-64 w-full">
            <Image
              src="/images/about-cover.jpg"
              alt="自己紹介のカバー画像"
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="p-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white transition-colors">
              はじめまして
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6 transition-colors">
              <strong className="text-gray-900 dark:text-white">井ノ原 力</strong>
              と申します。自治体向けネットワークとサーバーインフラの設計・構築・運用に携わるITエンジニアです。技術の探究と知識の共有を通じて、ITインフラの価値を高めることに情熱を持っています。
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-6 transition-colors">
              このUTechLabでは、日々の業務や自己学習を通じて得た知識、特にネットワーク技術、サーバー構築、監視システム、クラウドサービスなどに関する情報を発信していきます。実践的なチュートリアルやトラブルシューティングの経験共有を通じて、皆さんのITインフラ運用に役立つ情報をお届けします。
            </p>

            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white transition-colors">
              経歴と専門分野
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6 transition-colors">
              通信事業者での経験を活かし、現在は自治体向けネットワーク構築と監視システムの設計・運用に従事しています。CCNAやITパスポート、AWS認定クラウドプラクティショナーなどの資格を取得し、特にCisco製ネットワーク機器、Hinemosなどの監視ツール、Windows ServerとLinuxサーバーの運用に強みを持っています。
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-6 transition-colors">
              これまでの職務経験を通じて、ネットワークインフラの設計から運用まで、一連のライフサイクル管理について深く学ぶことができました。特に障害対応や改善提案の場面では、技術的な知識だけでなく、お客様やチームメンバーとのコミュニケーションの重要性を実感しています。
            </p>

            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white transition-colors">
              このブログで扱うテーマ
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-light-sidebar dark:bg-dark-sidebar p-4 rounded-lg transition-colors">
                <h3 className="font-bold text-lg mb-2 text-primary">
                  ネットワーク構築
                </h3>
                <p className="text-gray-700 dark:text-gray-400 transition-colors">
                  Cisco製品を中心としたネットワーク設計と構築手順の解説
                </p>
              </div>
              <div className="bg-light-sidebar dark:bg-dark-sidebar p-4 rounded-lg transition-colors">
                <h3 className="font-bold text-lg mb-2 text-primary">
                  監視システム
                </h3>
                <p className="text-gray-700 dark:text-gray-400 transition-colors">
                  Hinemos、Zabbixを活用したシステム監視と運用自動化
                </p>
              </div>
              <div className="bg-light-sidebar dark:bg-dark-sidebar p-4 rounded-lg transition-colors">
                <h3 className="font-bold text-lg mb-2 text-primary">
                  ホームラボ
                </h3>
                <p className="text-gray-700 dark:text-gray-400 transition-colors">
                  Proxmoxなどを使った自宅サーバー環境の構築と実験
                </p>
              </div>
              <div className="bg-light-sidebar dark:bg-dark-sidebar p-4 rounded-lg transition-colors">
                <h3 className="font-bold text-lg mb-2 text-primary">
                  クラウド技術
                </h3>
                <p className="text-gray-700 dark:text-gray-400 transition-colors">
                  AWS、Azureの基礎知識と実践的な活用方法
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white transition-colors">
              趣味と興味
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6 transition-colors">
              技術以外の分野では、読書とドローン操縦を趣味としています。特に技術書や科学系のノンフィクション本を通じて知識を広げることが好きです。また、DJI製ドローンの免許を持っており、休日には風景写真の撮影を楽しんでいます。
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-6 transition-colors">
              新しい技術や考え方に触れることを常に大切にしており、学んだことを実践し、その経験を共有することで成長していきたいと考えています。このサイトも、そうした自己成長と知識共有の場として運営しています。
            </p>

            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white transition-colors">
              お問い合わせ
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6 transition-colors">
              技術的な質問やコラボレーションのご提案、または単に交流を希望される方は、以下のSNSからお気軽にご連絡ください。
            </p>
            <div className="flex items-center space-x-4">
              {siteConfig.socialLinks.map((social) => (
                <a
                  key={social.url}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl text-primary hover:text-primary-dark transition-colors"
                  aria-label={social.name}
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
