// lib/siteConfig.ts
export const siteConfig = {
  // Site information
  title: "UTechLab",
  description: "井ノ原力によるポートフォリオと勉強ブログサイト",
  siteUrl: "https://www.utechjapan.net",

  // Author information
  author: {
    name: "Chikara Inohara",
    avatar: "/images/profile.jpg",
    bio: "技術革新に挑む",
  },

  // Navigation links
  navLinks: [
    { href: "/", label: "ホーム", icon: "fas fa-home" },
    { href: "/about", label: "自分について", icon: "fas fa-info-circle" },
    { href: "/blog", label: "ブログ", icon: "fas fa-blog" },
    { href: "/portfolio", label: "ポートフォリオ", icon: "fas fa-laptop-code" },
    { href: "/search", label: "検索", icon: "fas fa-search" },
    { href: "/subscribe", label: "登録", icon: "fas fa-envelope" },
  ],

  // Categories
  categories: [
    {
      name: "HomeLab",
      icon: "/images/categories/homelab.png",
      slug: "homelab",
      description: "ホームサーバーの構築と管理",
    },
    {
      name: "Tutorials",
      icon: "/images/categories/tutorials.png",
      slug: "tutorials",
      description: "各種技術トピックの手順ガイド",
    },
    {
      name: "Automation",
      icon: "/images/categories/automation.png",
      slug: "automation",
      description: "タスク自動化のスクリプトとツール",
    },
    {
      name: "Security",
      icon: "/images/categories/security.png",
      slug: "security",
      description: "システム、ネットワーク、データの保護",
    },
  ],

  // Social links (remain in English)
  socialLinks: [
    {
      name: "GitHub",
      url: "https://github.com/utechjapan",
      icon: "fab fa-github",
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/chikara-inohara-a26bb9143",
      icon: "fab fa-linkedin",
    },
    {
      name: "Twitter",
      url: "https://twitter.com/_utechlab",
      icon: "fab fa-twitter",
    },
    {
      name: "YouTube",
      url: "https://www.youtube.com/channel/UCWlf8tLDjoS07y3yHKqRVww",
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
