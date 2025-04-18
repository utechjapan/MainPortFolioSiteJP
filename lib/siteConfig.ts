// lib/siteConfig.ts
export const siteConfig = {
  // Site information
  title: "UTechLab",
  description: "Tech Blogs ＆ Portfolio Site",
  siteUrl: "https://www.utechjapan.net",

  // Author information
  author: {
    name: "井ノ原 力",
    avatar: "/images/profile.jpg",
    bio: "ITインフラエンジニア | クラウド・ネットワーク技術探究者",
  },

  // Navigation links - Updated order to put network-lab below blog
  navLinks: [
    { href: "/", label: "ホーム", icon: "fas fa-home" },
    { href: "/about", label: "自己紹介", icon: "fas fa-user" },
    { href: "/blog", label: "ブログ", icon: "fas fa-blog" },
    { href: "/network-lab", label: "ネットワークラボ", icon: "fas fa-network-wired" },
    { href: "/portfolio", label: "ポートフォリオ", icon: "fas fa-briefcase" },
    { href: "/search", label: "検索", icon: "fas fa-search" },
    { href: "/subscribe", label: "購読", icon: "fas fa-envelope" },
  ],

  // Categories
  categories: [
    {
      name: "ホームラボ",
      icon: "/images/categories/homelab.png",
      slug: "homelab",
      description: "自宅サーバー環境の構築と運用について",
    },
    {
      name: "チュートリアル",
      icon: "/images/categories/tutorials.png",
      slug: "tutorials",
      description: "様々な技術の実践ガイドと解説",
    },
    {
      name: "インフラ管理",
      icon: "/images/categories/automation.png",
      slug: "infrastructure",
      description: "ネットワークとサーバーの構築・運用ノウハウ",
    },
    {
      name: "セキュリティ",
      icon: "/images/categories/security.png",
      slug: "security",
      description: "ネットワークとデータを守るための対策",
    },
    {
      name: "クラウド技術",
      icon: "/images/categories/cloud.png",
      slug: "cloud",
      description: "AWSやAzureなどのクラウドサービス活用法",
    },
    {
      name: "キャリア",
      icon: "/images/categories/career.png",
      slug: "career",
      description: "ITエンジニアとしてのキャリア構築",
    },
  ],

  // Social links
  socialLinks: [
    { name: "LinkedIn", url: "https://www.linkedin.com/in/chikara-inohara", icon: "fab fa-linkedin" },
    { name: "GitHub", url: "https://github.com/utechjapan", icon: "fab fa-github" },
    { name: "Twitter", url: "https://twitter.com/_utechlab", icon: "fab fa-twitter" },
    { name: "YouTube", url: "https://www.youtube.com/@UTech-Lab", icon: "fab fa-youtube" },
    { name: "Blog", url: "https://utechjapan.net", icon: "fas fa-rss" },
  ],

  // Comments, analytics, newsletter, etc.
  comments: {
    provider: "giscus",
    giscusConfig: {
      repo: "utechjapan/MainPortFolioSiteJP",
      repoId: "R_kgDOOFRbFg",
      category: "General",
      categoryId: "DIC_kwDOOFRbFs4CntuS",
    },
  },

  analytics: { googleAnalyticsId: "G-M4CBBS8KGS" },

  newsletter: { provider: "mailchimp", endpoint: "/api/subscribe" },
};