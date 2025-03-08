import React from "react";
import Head from "next/head";
import Layout from "../components/layout/Layout";
import { motion } from "framer-motion";
import Timeline from "../components/portfolio/Timeline";
import { siteConfig } from "../lib/siteConfig";
import { TimelineEvent } from "../types";
import Image from "next/image";
import Link from "next/link";

// タイムラインイベント - 職務経歴を反映
const timelineEvents: TimelineEvent[] = [
  {
    id: "1",
    date: "2023年4月 – 現在",
    title: "通信事業者 | デジタルガバメント担当",
    description:
      "役割：インフラ・システムエンジニア\n\n【主な業務】\n・自治体向けネットワークおよびサーバー監視システムの設計・構築\n・Cisco Catalyst 9300、ApresiaLightGM110GT-SS、Yamaha RTX1210などを用いたネットワーク構成\n・Hinemos、Zabbixによる監視システムの構築・運用\n・インフラ更改対応および開発工程におけるプロジェクト管理\n・障害発生時の問い合わせ対応および保守作業\n\n【実績】自治体向け監視システムの構築プロジェクトを担当し、提案から設計、デプロイまでを実施。ヘルプデスクを含む運用担当者からシステム全体の改善と運用効率の向上に対して高い評価を獲得。",
    side: "right",
    iconBg: "#00bcd4",
  },
  {
    id: "2",
    date: "2021年4月 – 2023年3月",
    title: "製造業 | 製造部",
    description:
      "役割：品質管理担当\n\n【主な業務】\n・製品の外観検査および動作確認作業\n・データ入力および品質報告書の作成・提出\n・改善点提案や情報共有による現場全体の意識向上\n\n【実績】製造ラインでの品質管理業務において、正確な検査作業とデータ分析により品質向上に貢献。現場全体の業務意識向上に寄与しました。製造工程における効率化を目的とした改善提案も積極的に行いました。",
    side: "left",
    iconBg: "#4caf50",
  },
  {
    id: "3",
    date: "2020年5月 – 2021年3月",
    title: "商社系企業",
    description:
      "役割：販売員・広報担当\n\n【主な業務】\n・ドローン等の次世代製品の販売・広報活動\n・SNSおよびYouTubeチャンネルを活用したプロモーション\n・製品の魅力を伝える動画コンテンツ制作および配信\n・顧客対応や販売促進イベントの企画・実施\n\n【実績】YouTubeやSNSを活用した情報発信によりフォロワー数が30%増加し、自社ブランドの認知度向上と売上アップに貢献。製品の魅力を効果的に伝えるコンテンツ制作を行い、オンライン経由での販売実績を大幅に向上させました。",
    side: "right",
    iconBg: "#ff9800",
  },
  {
    id: "4",
    date: "2017年8月 – 2020年4月",
    title: "飲食店",
    description:
      "役割：ホールスタッフ → 副店長\n\n【主な業務】\n・スタッフの育成およびシフト管理\n・原価管理や売上分析による店舗運営の効率化\n・SNS運用および広告映像制作による集客施策の実施\n\n【実績】副店長として店舗運営全般を担当し、スタッフの個性を活かした指導法で離職率を15%削減。サービス品質の向上に成功しました。また、SNSによる広報活動では、来店客数20%増加を達成。広告映像制作やキャンペーン企画にも携わり、顧客視点に立ったマーケティング施策で店舗の収益増加に貢献しました。",
    side: "left",
    iconBg: "#e91e63",
  },
];

export default function Portfolio() {
  return (
    <Layout rightSidebar={false}>
      <Head>
        <title>井ノ原力のポートフォリオ | {siteConfig.title}</title>
        <meta
          name="description"
          content="井ノ原力のITインフラ、ネットワーク、サーバー管理の職務経験と技術スキルのポートフォリオ"
        />
      </Head>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto px-4 py-8 space-y-12"
      >
        {/* 切替リンク */}
        <div className="text-right">
          <a
            href="https://main-port-folio-site.vercel.app/"
            className="text-primary hover:underline text-sm"
          >
            英語版に切り替え
          </a>
        </div>

        {/* ページヘッダー */}
        <header className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white transition-colors mb-4">
            井ノ原力のポートフォリオ
          </h1>
          <p className="text-gray-700 dark:text-gray-300 transition-colors">
            私の職務経験、技術スキル、そしてこれまで手がけたプロジェクトをご紹介します。
          </p>
        </header>

        {/* 概要セクション */}
        <section className="bg-light-card dark:bg-dark-card p-6 rounded-lg shadow-md dark:shadow-none transition-colors">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors mb-4">
            概要
          </h2>
          <p className="text-gray-700 dark:text-gray-300 transition-colors">
            システムエンジニアとして、自治体向けネットワークおよびサーバーの構築・運用に従事しています。CCNAやITパスポートなどの資格を活かし、監視システムの構築、障害対応、ベンダー調整など多岐にわたる業務を担当。問題発生時は冷静に原因を分析し、迅速かつ的確な解決策を実行。常に新技術への探究心とチーム全体を支えるコミュニケーション力を武器に、自己研鑽を重ねながら成長を続けています。
          </p>
        </section>

        <hr className="border-gray-300 dark:border-gray-700" />

        {/* 職務経歴タイムライン */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors mb-6">
            職務経歴
          </h2>
          <Timeline events={timelineEvents} />
        </section>

        <hr className="border-gray-300 dark:border-gray-700" />

        {/* 技術スキルセクション */}
        <section className="bg-light-card dark:bg-dark-card p-6 rounded-lg shadow-md dark:shadow-none transition-colors">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors mb-4">
            技術スキル
          </h2>
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">インフラ技術</h3>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 transition-colors ml-4">
              <li>
                <strong className="text-gray-900 dark:text-white">ネットワーク技術:</strong>{" "}
                Cisco Catalyst、FortiGate、VLAN構成、障害切り分け、ルーティング設計
              </li>
              <li>
                <strong className="text-gray-900 dark:text-white">サーバー管理:</strong>{" "}
                Windows Server、Linux（CentOS、RHEL）、Trastation、仮想化環境
              </li>
              <li>
                <strong className="text-gray-900 dark:text-white">監視・運用:</strong>{" "}
                Hinemos（ver 6.0～7.2）、Zabbix、システム性能チューニング、アラート設計
              </li>
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">クラウド・開発</h3>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 transition-colors ml-4">
              <li>
                <strong className="text-gray-900 dark:text-white">クラウド技術:</strong>{" "}
                AWS（EC2、S3、RDS、IAM）、Microsoft Azure基礎知識
              </li>
              <li>
                <strong className="text-gray-900 dark:text-white">自動化・運用:</strong>{" "}
                PowerShell、シェルスクリプト、基本的なPython
              </li>
              <li>
                <strong className="text-gray-900 dark:text-white">コンテナ技術:</strong>{" "}
                Docker基礎、docker-compose、基本的なコンテナ運用
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">資格</h3>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 transition-colors ml-4">
              <li>CCNA（2024年12月取得）</li>
              <li>ITパスポート（2024年5月取得）</li>
              <li>LPIC Level 1（2024年12月取得）</li>
              <li>AWS認定クラウドプラクティショナー（2024年12月取得）</li>
              <li>AZ-900: Microsoft Azure Fundamentals（2024年12月取得）</li>
              <li>DJI スペシャリスト（2021年3月取得）</li>
              <li>TOEIC 910点（2017年7月取得）</li>
            </ul>
          </div>
        </section>

        <hr className="border-gray-300 dark:border-gray-700" />

        {/* 主なプロジェクトセクション */}
        <section className="bg-light-card dark:bg-dark-card p-6 rounded-lg shadow-md dark:shadow-none transition-colors">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors mb-4">
            主なプロジェクト
          </h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">
                自治体向けネットワーク監視システム構築
              </h3>
              <p className="text-gray-700 dark:text-gray-300 transition-colors">
                <strong>概要:</strong> 自治体向け監視システムの構築プロジェクトにおいて、提案から設計、デプロイまでを担当。Hinemosを用いたサーバーおよびネットワーク機器の統合監視環境を構築。お客様の要望を的確に汲み取り、ベンダー間での事実確認の重要性を徹底的に学び、実践しました。
              </p>
              <p className="text-gray-700 dark:text-gray-300 transition-colors">
                <strong>技術環境:</strong> Hinemos 7.2、Cisco Catalyst 9300、Yamaha RTX1210、Windows Server 2019/2024、Linux（CentOS、RHEL）
              </p>
              <p className="text-gray-700 dark:text-gray-300 transition-colors">
                <strong>成果:</strong> 運用担当者からシステム全体の大幅な改善と運用効率の向上に対して高い評価を獲得。初期は多数のミスを経験しましたが、その過程でお客様の要望を的確に汲み取り、システム全体の改善に取り組みました。
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">
                Proxmoxを活用した自宅検証環境構築
              </h3>
              <p className="text-gray-700 dark:text-gray-300 transition-colors">
                <strong>概要:</strong> 自宅の検証環境としてProxmox VEを導入し、複数の仮想マシンを用いた検証環境を構築。業務で使用するサーバー構成の事前検証やスキルアップのための実験環境として活用。GitLabやNextcloudなどのサービスも自宅サーバーでセルフホスティングし、常に新しい技術の検証を行っています。
              </p>
              <p className="text-gray-700 dark:text-gray-300 transition-colors">
                <strong>技術環境:</strong> Proxmox VE、Ubuntu Server、CentOS、Docker、Portainer、Traefik、Let's Encrypt
              </p>
              <p className="text-gray-700 dark:text-gray-300 transition-colors">
                <strong>学習成果:</strong> 仮想化環境の構築・運用、コンテナオーケストレーション、リバースプロキシとSSL証明書の自動更新など、実践的なインフラ管理スキルを習得。トラブルシューティング能力も大きく向上しました。
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">
                ドローン関連デジタルマーケティング
              </h3>
              <p className="text-gray-700 dark:text-gray-300 transition-colors">
                <strong>概要:</strong> 次世代モビリティ製品（主にドローン）の販売促進のためのデジタルマーケティング戦略を企画・実行。商品の特性を理解し、顧客目線に立った情報発信を心がけました。
              </p>
              <p className="text-gray-700 dark:text-gray-300 transition-colors">
                <strong>使用ツール:</strong> YouTube、Instagram、Twitter、Final Cut Pro（動画編集）
              </p>
              <p className="text-gray-700 dark:text-gray-300 transition-colors">
                <strong>実績:</strong> YouTubeやSNSを活用した情報発信によりフォロワー数が30%増加。オンライン経由での販売実績を大幅に向上させました。製品の技術的な特徴と実用例を分かりやすく伝えることで、専門知識がない顧客にも訴求力のあるコンテンツを制作しました。
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
            詳細な経歴と職務内容については、以下の履歴書をご参照ください。
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 transition-colors">
            <li>
              <a
                href="/resume/resume_jp.pdf"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                職務経歴書（PDF形式）
              </a>
            </li>
          </ul>
        </section>

        <p className="text-gray-700 dark:text-gray-300 italic transition-colors">
          ポートフォリオをご覧いただきありがとうございます。ご質問やお仕事のご相談がございましたら、お気軽にSNSよりご連絡ください。
        </p>
      </motion.div>
    </Layout>
  );
}