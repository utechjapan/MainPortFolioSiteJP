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

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                1. 総則
              </h2>
              <div className="prose dark:prose-dark">
                <p>
                  本規約は、当サイト「My Portfolio」（以下「当サイト」といいます）の利用条件を定めるものです。ユーザーの皆様（以下「ユーザー」といいます）には、本規約に従って当サイトをご利用いただきます。
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                2. サービス内容
              </h2>
              <div className="prose dark:prose-dark">
                <p>
                  当サイトは、運営者のポートフォリオ、ブログ記事、制作物の展示、技術情報の共有などを目的としたウェブサイトです。運営者は、ユーザーに通知することなく、当サイトの内容を変更したり、提供を停止したりすることができます。
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                3. 知的財産権
              </h2>
              <div className="prose dark:prose-dark">
                <p>
                  当サイトに掲載されているテキスト、画像、デザイン、ロゴ、ソースコード等のコンテンツ（以下「コンテンツ」といいます）の著作権、商標権その他の知的財産権は、当サイト運営者または正当な権利者に帰属します。
                </p>
                <p className="mt-4">
                  ユーザーは、以下の行為を行うことはできません：
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>コンテンツの複製、改変、二次的著作物の作成</li>
                  <li>コンテンツの商業的利用</li>
                  <li>コンテンツの第三者への再配布</li>
                  <li>運営者の明示的な許可なくコンテンツをダウンロードまたは保存すること</li>
                </ul>
                <p className="mt-4">
                  ただし、個人的な学習目的での参照や、適切な引用（出典の明記を含む）は許可されます。
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                4. 免責事項
              </h2>
              <div className="prose dark:prose-dark">
                <p>
                  当サイトの情報は、可能な限り正確性を期していますが、その完全性、正確性、適時性、有用性等について保証するものではありません。
                </p>
                <p className="mt-4">
                  当サイトのご利用により生じたいかなる損害（直接的、間接的、偶発的、結果的損害を含む）についても、当サイト運営者は一切の責任を負いません。また、当サイトからリンクされている外部サイトの内容についても責任を負いません。
                </p>
                <p className="mt-4">
                  当サイトに掲載されているプログラムコード、技術情報などを利用する場合は、ユーザー自身の責任において行ってください。
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                5. 禁止事項
              </h2>
              <div className="prose dark:prose-dark">
                <p>ユーザーは、当サイトの利用にあたり、以下の行為を行わないものとします：</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>法令または公序良俗に違反する行為</li>
                  <li>犯罪行為に関連する行為</li>
                  <li>当サイトの運営を妨害する行為</li>
                  <li>当サイトのサーバーやネットワークに過度の負荷をかける行為</li>
                  <li>他のユーザーの迷惑となる行為</li>
                  <li>他者になりすます行為</li>
                  <li>当サイト運営者のサービスに関連して、不正アクセス、ハッキングを試みる行為</li>
                  <li>当サイト運営者が不適切と判断する行為</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                6. お問い合わせとフィードバック
              </h2>
              <div className="prose dark:prose-dark">
                <p>
                  当サイトに関するお問い合わせやフィードバックは、お問い合わせフォームから受け付けています。いただいたフィードバックやアイデアは、当サイト運営者の裁量で、通知や補償なく自由に使用することがあります。
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                7. 利用規約の変更
              </h2>
              <div className="prose dark:prose-dark">
                <p>
                  当サイト運営者は、必要と判断した場合には、ユーザーに通知することなく本規約を変更することがあります。変更後の利用規約は、当サイトに掲載された時点で効力を生じるものとします。定期的に本ページをご確認いただくことをお勧めします。
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                8. 準拠法と管轄裁判所
              </h2>
              <div className="prose dark:prose-dark">
                <p>
                  本規約の解釈および適用は、日本国法に準拠するものとします。本規約に関する紛争については、当サイト運営者の所在地を管轄する裁判所を第一審の専属的合意管轄裁判所とします。
                </p>
              </div>
            </section>

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                最終更新日: 2025年3月10日
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}