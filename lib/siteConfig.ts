// lib/siteConfig.ts
export const siteConfig = {
  // Site information
  title: "UTechLab",
  description: "井ノ原力のテックブログ＆ポートフォリオサイト",
  siteUrl: "https://www.utechjapan.net",

  // Author information
  author: {
    name: "井ノ原 力",
    avatar: "/images/profile.jpg",
    bio: "自治体向けITインフラエンジニア｜新技術探求中",
  },

  // Navigation links
  navLinks: [
    { href: "/", label: "ホーム", icon: "fas fa-home" },
    { href: "/about", label: "自己紹介", icon: "fas fa-info-circle" },
    { href: "/blog", label: "ブログ", icon: "fas fa-blog" },
    { href: "/portfolio", label: "ポートフォリオ", icon: "fas fa-laptop-code" },
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
      name: "自動化",
      icon: "/images/categories/automation.png",
      slug: "automation",
      description: "業務効率化のためのスクリプトとツール",
    },
    {
      name: "セキュリティ",
      icon: "/images/categories/security.png",
      slug: "security",
      description: "ネットワークとデータを守るための対策",
    },
  ],

  // Social links (英語のままにしています)
  socialLinks: [
    {
      name: "GitHub",
      url: "https://github.com/utechjapan",
      icon: "fab fa-github",
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/chikara-inohara",
      icon: "fab fa-linkedin",
    },
    {
      name: "Twitter",
      url: "https://twitter.com/_utechlab",
      icon: "fab fa-twitter",
    },
    {
      name: "YouTube",
      url: "https://www.youtube.com/channel/UCWlf8tLDjoS07y3yKqRVww",
      icon: "fab fa-youtube",
    },
    {
      name: "Discord",
      url: "https://discord.gg/yourinvite",
      icon: "fab fa-discord",
    },
  ],

  // Giscus comments configuration
  comments: {
    provider: "giscus",
    giscusConfig: {
      repo: "utechjapan/MainPortFolioSite",
      repoId: "R_kgDOODVR4Q",
      category: "General",
      categoryId: "DIC_kwDOODVR4c4Cnkk9",
    },
  },

  // Analytics (optional)
  analytics: {
    googleAnalyticsId: "G-M4CBBS8KGS",
  },

  // Newsletter (Mailchimp)
  newsletter: {
    provider: "mailchimp",
    endpoint: "/api/subscribe",
  },
};