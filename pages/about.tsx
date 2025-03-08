// pages/about.tsx
import Head from "next/head";
import Image from "next/image";
import Layout from "../components/layout/Layout";
import { motion } from "framer-motion";
import { siteConfig } from "../lib/siteConfig";

export default function About() {
  return (
    <Layout rightSidebar={false}>
      <Head>
        <title>私について | {siteConfig.title}</title>
        <meta
          name="description"
          content="千賀 井野原とUTechLabsについて。最先端技術の探求と知識の共有の場です。"
        />
      </Head>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white transition-colors">
          私について
        </h1>

        <div className="bg-light-card dark:bg-dark-card rounded-lg overflow-hidden mb-8 shadow-md dark:shadow-none transition-colors">
          <div className="relative h-64 w-full">
            <Image
              src="/images/about-cover.jpg"
              alt="私についてのカバー画像"
              fill
              className="object-cover"
            />
          </div>

          <div className="p-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white transition-colors">
              私の使命
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6 transition-colors">
              私は{" "}
              <strong className="text-gray-900 dark:text-white">
                Chikara Inohara
              </strong>
              です。日本を拠点とする技術愛好家であり革新者として、UTechLabsを
              テクノロジーの最新情報や知識の共有の場として立ち上げました。
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-6 transition-colors">
              UTechLabsでは、包括的なチュートリアル、最新ツールの探求、そして
              技術愛好家とのコラボレーションを通じて、知識の普及と技術の革新を目指しています。
            </p>

            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white transition-colors">
              私とは
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6 transition-colors">
              ソフトウェア開発、ネットワーク、システム管理の分野で培った経験を活かし、UTechLabsは最新技術やセルフホスティングに関心のある皆様にとって貴重なリソースとなっています。
            </p>

            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white transition-colors">
              取り扱っている内容
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-light-sidebar dark:bg-dark-sidebar p-4 rounded-lg transition-colors">
                <h3 className="font-bold text-lg mb-2 text-primary">
                  クラウドコンピューティング
                </h3>
                <p className="text-gray-700 dark:text-gray-400 transition-colors">
                  AWS、Azure、GCPのレビュー、解説、チュートリアル
                </p>
              </div>
              <div className="bg-light-sidebar dark:bg-dark-sidebar p-4 rounded-lg transition-colors">
                <h3 className="font-bold text-lg mb-2 text-primary">
                  DevOpsプラクティス
                </h3>
                <p className="text-gray-700 dark:text-gray-400 transition-colors">
                  CI/CDパイプライン、自動化、コンテナ化戦略の実践方法
                </p>
              </div>
              <div className="bg-light-sidebar dark:bg-dark-sidebar p-4 rounded-lg transition-colors">
                <h3 className="font-bold text-lg mb-2 text-primary">
                  プログラミング言語
                </h3>
                <p className="text-gray-700 dark:text-gray-400 transition-colors">
                  Python、Go、JavaScriptのコーディングのコツやベストプラクティス
                </p>
              </div>
              <div className="bg-light-sidebar dark:bg-dark-sidebar p-4 rounded-lg transition-colors">
                <h3 className="font-bold text-lg mb-2 text-primary">
                  ホームラボ愛好家
                </h3>
                <p className="text-gray-700 dark:text-gray-400 transition-colors">
                  ホームサーバーやセルフホスティングの構築事例や実験レポート
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white transition-colors">
              お問い合わせ
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6 transition-colors">
              技術に関するご質問やご提案がございましたら、下記のSNSリンクよりお気軽にご連絡ください。
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
