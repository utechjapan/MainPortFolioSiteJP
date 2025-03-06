// lib/siteConfig.ts
export const siteConfig = {
  // Site information
  title: "UTechLab",
  description: "Portfolio and documentations by Chikara Inohara",
  siteUrl: "https://www.utechjapan.net",

  // Author information
  author: {
    name: "Chikara Inohara",
    avatar: "/images/profile.jpg",
    bio: "Innovating Technology",
  },

  // Navigation links
  navLinks: [
    { href: "/", label: "HOME", icon: "fas fa-home" },
    { href: "/about", label: "ABOUT", icon: "fas fa-info-circle" },
    { href: "/blog", label: "BLOG", icon: "fas fa-blog" },
    { href: "/portfolio", label: "PORTFOLIO", icon: "fas fa-laptop-code" },
    { href: "/search", label: "SEARCH", icon: "fas fa-search" },
    { href: "/subscribe", label: "SUBSCRIBE", icon: "fas fa-envelope" },
  ],

  // Categories
  categories: [
    {
      name: "HomeLab",
      icon: "/images/categories/homelab.png",
      slug: "homelab",
      description: "Building and managing home server setups",
    },
    {
      name: "Tutorials",
      icon: "/images/categories/tutorials.png",
      slug: "tutorials",
      description: "Step-by-step guides for various tech topics",
    },
    {
      name: "Automation",
      icon: "/images/categories/automation.png",
      slug: "automation",
      description: "Scripts, tools, and systems for automating tasks",
    },
    {
      name: "Security",
      icon: "/images/categories/security.png",
      slug: "security",
      description: "Protecting your systems, networks, and data",
    },
  ],

  // Social links
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
    googleAnalyticsId: "G-M4CBBS8KGS", // Google Analytics measurement ID
  },

  // Newsletter (for Subscribe functionality)
  newsletter: {
    // Provider can be 'custom', 'convertkit', 'mailchimp', etc.
    provider: "mailchimp",
    // API endpoint for subscription
    endpoint: "/api/subscribe",
  },
};
