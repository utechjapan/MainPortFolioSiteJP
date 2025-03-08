import { useState } from "react";
import Layout from "../components/layout/Layout";
import { motion } from "framer-motion";
import Head from "next/head";

export default function Subscribe() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Remove API call and simply simulate success.
    setSubmitted(true);
  };

  return (
    <Layout rightSidebar={false} toc={null}>
      <Head>
        <title>ニュースレター登録 | My Portfolio</title>
        <meta name="description" content="ニュースレターに登録して最新情報を受け取りましょう" />
      </Head>

      <div className="max-w-3xl mx-auto py-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            ニュースレター登録
          </h1>

          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 flex items-center justify-center bg-primary/20 rounded-full">
              <i
                className="fa-solid fa-envelope fa-fw text-primary text-3xl"
                aria-hidden="true"
              ></i>
            </div>
          </div>

          <p className="text-lg mb-10 text-gray-700 dark:text-gray-300">
            最新の技術チュートリアル、プロジェクト、インサイトをお届けします。
          </p>

          {submitted ? (
            <motion.div
              className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <svg
                className="w-16 h-16 text-green-500 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">
                ご登録ありがとうございます！
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                新しいコンテンツが公開されるとお知らせいたします。
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-6 text-primary hover:text-primary-dark"
              >
                別のメールアドレスで登録する
              </button>
            </motion.div>
          ) : (
            <div className="bg-light-card dark:bg-dark-card rounded-lg shadow-md p-8">
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    お名前
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-transparent transition"
                    placeholder="山田 太郎"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    メールアドレス
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-transparent transition"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center"
                >
                  登録する
                </button>

                <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                  プライバシーを尊重します。スパムは一切ありません。いつでも購読解除できます。
                </p>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
}
