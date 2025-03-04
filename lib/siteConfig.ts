// lib/siteConfig.ts
export const siteConfig = {
  // Site information
  title: 'UTechLab',
  description: 'Innovating Technology',
  siteUrl: 'https://www.yourdomain.com',
  
  // Author information
  author: {
    name: 'John Doe',
    avatar: '/images/profile.jpg',
    bio: 'Tech enthusiast and self-hosting advocate',
  },
  
  // Navigation links
  navLinks: [
    { href: '/', label: 'HOME', icon: 'fas fa-home' },
    { href: '/about', label: 'ABOUT', icon: 'fas fa-info-circle' },
    { href: '/blog', label: 'BLOG', icon: 'fas fa-blog' },
    { href: '/portfolio', label: 'PORTFOLIO', icon: 'fas fa-laptop-code' },
    { href: '/search', label: 'SEARCH', icon: 'fas fa-search' },
    { href: '/subscribe', label: 'SUBSCRIBE', icon: 'fas fa-envelope' },
  ],
  
  // Categories
  categories: [
    { 
      name: 'HomeLab', 
      icon: '/images/categories/homelab.png', 
      slug: 'homelab',
      description: 'Building and managing home server setups'
    },
    { 
      name: 'Tutorials', 
      icon: '/images/categories/tutorials.png', 
      slug: 'tutorials',
      description: 'Step-by-step guides for various tech topics'
    },
    { 
      name: 'Automation', 
      icon: '/images/categories/automation.png', 
      slug: 'automation',
      description: 'Scripts, tools, and systems for automating tasks'
    },
    { 
      name: 'Security', 
      icon: '/images/categories/security.png', 
      slug: 'security',
      description: 'Protecting your systems, networks, and data'
    },
  ],
  
  // Social links
  socialLinks: [
    { name: 'GitHub', url: 'https://github.com/yourusername', icon: 'fab fa-github' },
    { name: 'LinkedIn', url: 'https://linkedin.com/in/yourusername', icon: 'fab fa-linkedin' },
    { name: 'Twitter', url: 'https://twitter.com/yourusername', icon: 'fab fa-twitter' },
    { name: 'YouTube', url: 'https://youtube.com/c/yourusername', icon: 'fab fa-youtube' },
    { name: 'Discord', url: 'https://discord.gg/yourinvite', icon: 'fab fa-discord' },
  ],
  
  // Giscus comments configuration
  comments: {
    provider: 'giscus',
    giscusConfig: {
      repo: 'yourusername/yourrepo',
      repoId: 'YOUR_REPO_ID',
      category: 'Announcements',
      categoryId: 'YOUR_CATEGORY_ID',
    },
  },
  
  // Analytics (optional)
  analytics: {
    googleAnalyticsId: 'G-XXXXXXXXXX', // Google Analytics measurement ID
  },
  
  // Newsletter (for Subscribe functionality)
  newsletter: {
    // Provider can be 'custom', 'convertkit', 'mailchimp', etc.
    provider: 'custom',
    // API endpoint for subscription
    endpoint: '/api/subscribe',
  },
};