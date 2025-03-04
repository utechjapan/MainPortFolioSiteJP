// types/index.ts
export interface Post {
    slug: string;
    frontMatter: {
      title: string;
      date: string;
      description?: string;
      excerpt?: string;
      image?: string;
      readingTime?: string;
      author?: string;
      authorImage?: string;
      authorBio?: string;
      tags?: string[];
    };
    content?: string;
    toc?: TocItem[];
  }
  
  export interface RecentPost {
    slug: string;
    title: string;
  }
  
  export interface TocItem {
    id: string;
    text: string;
    level: number;
  }
  
  export interface CategoryInfo {
    name: string;
    icon: string;
    description: string;
    slug: string;
  }