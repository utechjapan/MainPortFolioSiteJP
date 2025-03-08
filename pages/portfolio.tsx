// pages/portfolio.tsx
import Head from "next/head";
import Layout from "../components/layout/Layout";
import { motion } from "framer-motion";
import Timeline from "../components/portfolio/Timeline";
import { siteConfig } from "../lib/siteConfig";
import { TimelineEvent } from "../types";
import Image from "next/image";
import Link from "next/link";

// サンプルのタイムラインイベント（必要に応じて内容を更新してください）
const timelineEvents: TimelineEvent[] = [
  {
    id: "1",
    date: "2023 – 現在",
    title: "NTT西日本 | デジタルガバメント",
    description:
      "役割：インフラ・システムエンジニア\n\n【主な業務】\n・自治体向けITシステムの構築・保守\n・Cisco CatalystおよびFortiGateを用いたネットワーク構成\n・Hinemos、Zabbixによる監視システムの運用\n\n【実績】システムの信頼性と運用効率の向上を実現",
    side: "right",
    iconBg: "#00bcd4",
  },
  {
    id: "2",
    date: "2020 – 2021",
    title: "Polaris Export",
    description:
      "役割：営業・マーケティング\n\n【主な業務】\n・営業およびカスタマーサービスの統括\n・SNSキャンペーンおよびYouTubeコンテンツの企画・制作\n\n【実績】オンラインフォロワー数を30%向上",
    side: "left",
    iconBg: "#4caf50",
  },
  {
    id: "3",
    date: "2017 – 2020",
    title: "Bagus Bar (芝浦アイランド店)",
    description:
      "役割：ホールスタッフ → 副店長\n\n【主な業務】\n・高品質な顧客サービスおよび業務サポート\n・スタッフの育成、シフト管理、コスト管理\n・SNS運用およびプロモーション活動\n\n【実績】従業員離職率を15%削減し、サービス品質を向上",
    side: "right",
    iconBg: "#ff9800",
  },
];

export default function Portfolio() {
  return (
    <Layout rightSidebar={false}>
      <Head>
        <title>井ノ原力のポートフォリオ | {siteConfig.title}</title>
        <meta
          name="description"
          content="ITインフラ、ネットワーキング、革新的な技術ソリューションにおける職務経験、技術スキル、選ばれたプロジェクトの概要"
        />
      </Head>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto px-4 py-8 space-y-12"
      >
        {/* トップの切替リンク */}
        <div className="text-right">
          <a href="https://main-port-folio-site.vercel.app/" className="text-primary hover:underline text-sm">
            英語版に切り替え
          </a>
        </div>

        {/* ページヘッダー */}
        <header className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white transition-colors mb-4">
            井ノ原力のポートフォリオ
          </h1>
          <p className="text-gray-700 dark:text-gray-300 transition-colors">
            私の職務経験、技術スキル、そして革新的なプロジェクトの数々をご紹介するポートフォリオおよび勉強ブログサイトへようこそ。
          </p>
        </header>

        {/* 概要セクション */}
        <section className="bg-light-card dark:bg-dark-card p-6 rounded-lg shadow-md dark:shadow-none transition-colors">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors mb-4">
            概要
          </h2>
          <p className="text-gray-700 dark:text-gray-300 transition-colors">
            私はシステムおよびネットワークエンジニアとして、自治体や企業向けのITシステムの設計、導入、運用において豊富な経験を持っています。技術的なエンジニアリング、営業、デジタルマーケティングの各分野での経験が、システムの信頼性、運用効率、そしてデジタルイノベーションの向上に寄与しています。
          </p>
        </section>

        <hr className="border-gray-300 dark:border-gray-700" />

        {/* 職務経験タイムライン */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors mb-6">
            職務経験タイムライン
          </h2>
          <Timeline events={timelineEvents} />
        </section>

        <hr className="border-gray-300 dark:border-gray-700" />

        {/* 技術スキルセクション */}
        <section className="bg-light-card dark:bg-dark-card p-6 rounded-lg shadow-md dark:shadow-none transition-colors">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors mb-4">
            技術スキル
          </h2>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 transition-colors">
            <li>
              <strong className="text-gray-900 dark:text-white">ネットワーキング:</strong> Cisco Catalyst, FortiGate, VLAN構成、トラブルシューティング
            </li>
            <li>
              <strong className="text-gray-900 dark:text-white">サーバー管理:</strong> Windows Server, Linux（RHEL, CentOS）、仮想化技術
            </li>
            <li>
              <strong className="text-gray-900 dark:text-white">監視・管理:</strong> Hinemos, Zabbix, パフォーマンスチューニング
            </li>
            <li>
              <strong className="text-gray-900 dark:text-white">クラウド・インフラ:</strong> AWS Cloud Practitioner, Azure Fundamentals (AZ-900)
            </li>
            <li>
              <strong className="text-gray-900 dark:text-white">スクリプティング・自動化:</strong> Python, PowerShell
            </li>
            <li>
              <strong className="text-gray-900 dark:text-white">資格:</strong> CCNA, ITパスポート, LPIC Level 1, AWS Cloud Practitioner, AZ-900
            </li>
          </ul>
        </section>

        <hr className="border-gray-300 dark:border-gray-700" />

        {/* 選ばれたプロジェクトセクション */}
        <section className="bg-light-card dark:bg-dark-card p-6 rounded-lg shadow-md dark:shadow-none transition-colors">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors mb-4">
            選ばれたプロジェクト
          </h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">
                Proxmox Homelab &amp; Hugoブログ
              </h3>
              <p className="text-gray-700 dark:text-gray-300 transition-colors">
                <strong>概要:</strong> Proxmoxを用いたHomelabの構築と、Hugoを使ったブログの運用。PowerShellとPythonを使用し、コンテンツの自動デプロイを実現。
              </p>
              <p className="text-gray-700 dark:text-gray-300 transition-colors">
                <strong>技術:</strong> Proxmox VE, Hugo, Nginx, Python, PowerShell
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">
                自治体向けセキュアネットワーク・監視システム
              </h3>
              <p className="text-gray-700 dark:text-gray-300 transition-colors">
                <strong>概要:</strong> 地方自治体向けに、先進的なネットワーク機器と監視ツールを統合したセキュアなITインフラを設計・構築。
              </p>
              <p className="text-gray-700 dark:text-gray-300 transition-colors">
                <strong>技術:</strong> Cisco, FortiGate, Hinemos, Zabbix
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">
                Polaris Export向けデジタルマーケティング
              </h3>
              <p className="text-gray-700 dark:text-gray-300 transition-colors">
                <strong>概要:</strong> SNSキャンペーンやYouTubeコンテンツを通して、オンラインでのブランド認知度を向上。
              </p>
              <p className="text-gray-700 dark:text-gray-300 transition-colors">
                <strong>実績:</strong> オンラインフォロワー数を30%増加
              </p>
            </div>
          </div>
        </section>

        <hr className="border-gray-300 dark:border-gray-700" />

        {/* 履歴書セクション */}
        <section className="bg-light-card dark:bg-dark-card p-6 rounded-lg shadow-md dark:shadow-none transition-colors">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors mb-4">
            履歴書
          </h2>
          <p className="text-gray-700 dark:text-gray-300 transition-colors mb-4">
            詳細な経歴を確認するには、以下の履歴書をダウンロードしてください。
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 transition-colors">
            <li>
              <a
                href="/resume/resume_jp.pdf"
                className="text-primary hover:underline"
              >
                履歴書（日本語）
              </a>
            </li>
            {/*
            英語版がある場合はコメントを外してください:
            <li>
              <a href="/resume/resume_en.pdf" className="text-primary hover:underline">
                Resume (English)
              </a>
            </li>
            */}
          </ul>
        </section>

        <p className="text-gray-700 dark:text-gray-300 italic transition-colors">
          ポートフォリオをご覧いただきありがとうございます。ご質問やご提案がございましたら、お気軽にお問い合わせください！
        </p>
      </motion.div>
    </Layout>
  );
}

