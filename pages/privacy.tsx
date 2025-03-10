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

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                1. 収集する情報
              </h2>
              <div className="prose dark:prose-dark">
                <p>当サイトでは、以下の情報を収集することがあります：</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>お問い合わせフォームから提供される情報（お名前、メールアドレス、メッセージ内容など）</li>
                  <li>アクセス解析ツールによって自動的に収集される情報（IPアドレス、ブラウザの種類、訪問したページ、訪問日時など）</li>
                  <li>当サイトを閲覧する際にブラウザに保存されるCookieなどの情報</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                2. 情報の利用目的
              </h2>
              <div className="prose dark:prose-dark">
                <p>収集した情報は、主に以下の目的で利用します：</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>お問い合わせやメッセージへの対応</li>
                  <li>サイトの利用状況の分析とユーザー体験の向上</li>
                  <li>サイトのセキュリティ確保</li>
                  <li>当サイトに関する重要なお知らせの配信</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                3. 個人情報の保護
              </h2>
              <div className="prose dark:prose-dark">
                <p>
                  当サイトでは、収集した個人情報の漏洩、紛失、改ざんなどを防ぐため、適切なセキュリティ対策を講じています。個人情報は、上記の利用目的の範囲内でのみ使用し、法律で定められた場合を除き、第三者への提供は行いません。
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                4. Cookieの使用について
              </h2>
              <div className="prose dark:prose-dark">
                <p>
                  当サイトでは、ユーザー体験の向上やサイト利用状況の分析のためにCookieを使用しています。Cookieは、ブラウザの設定から無効にすることが可能です。ただし、Cookieを無効にした場合、当サイトの一部機能が正常に動作しなくなる可能性があります。
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                5. アクセス解析ツールの使用
              </h2>
              <div className="prose dark:prose-dark">
                <p>
                  当サイトでは、Google Analyticsなどのアクセス解析ツールを使用して、サイトの利用状況を分析しています。これらのツールは、Cookieを使用してデータを収集しますが、個人を特定する情報は含まれません。収集されたデータは、各ツールのプライバシーポリシーに基づいて管理されます。
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                6. 第三者サービスについて
              </h2>
              <div className="prose dark:prose-dark">
                <p>
                  当サイトでは、コンテンツの共有機能やコメント機能などのために、SNSや外部サービスを利用している場合があります。これらのサービスを利用する際は、各サービスのプライバシーポリシーも併せてご確認ください。
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                7. 個人情報の開示・訂正・削除
              </h2>
              <div className="prose dark:prose-dark">
                <p>
                  ご提供いただいた個人情報の開示、訂正、削除などをご希望の場合は、お問い合わせフォームからご連絡ください。可能な限り迅速に対応いたします。
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                8. プライバシーポリシーの変更
              </h2>
              <div className="prose dark:prose-dark">
                <p>
                  当サイトは、必要に応じてプライバシーポリシーを変更することがあります。重要な変更がある場合は、サイト上でお知らせします。定期的にこのページをご確認いただくことをおすすめします。
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                9. お問い合わせ
              </h2>
              <div className="prose dark:prose-dark">
                <p>
                  プライバシーポリシーに関するご質問やお問い合わせは、お問い合わせフォームからお願いいたします。
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