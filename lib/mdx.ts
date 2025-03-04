// lib/mdx.ts
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

// Use dynamic import for fs to avoid client-side errors
const fs = typeof window === 'undefined' ? require('fs') : null;

export interface MDXFrontMatter {
  title: string;
  date: string;
  description?: string;
  excerpt?: string;
  author?: string;
  authorImage?: string;
  authorBio?: string;
  image?: string;
  tags?: string[];
  readingTime?: string;
}

// Extract headings from markdown content
function extractHeadings(content: string) {
  const headingRegex = /^(#{2,4})\s+(.*)$/gm;
  const headings = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
    
    headings.push({ id, text, level });
  }

  return headings;
}

// Get all MDX files in a directory
export function getAllMDXSlugs(contentType: string): string[] {
  // Server-side only
  if (typeof window !== 'undefined') {
    return [];
  }

  const contentPath = path.join(process.cwd(), 'content', contentType);
  const filenames = fs.readdirSync(contentPath);
  
  return filenames
    .filter(filename => filename.endsWith('.mdx'))
    .map(filename => filename.replace('.mdx', ''));
}

// Get content and frontmatter of an MDX file
export async function getMDXContent(contentType: string, slug: string) {
  // Server-side only
  if (typeof window !== 'undefined') {
    return { content: '', frontMatter: {}, toc: [] };
  }

  const filePath = path.join(process.cwd(), 'content', contentType, `${slug}.mdx`);
  const fileContent = fs.readFileSync(filePath, 'utf8');
  
  const { content, data } = matter(fileContent);
  const toc = extractHeadings(content);
  
  // Calculate reading time
  const readingStats = readingTime(content);
  
  return {
    content,
    frontMatter: {
      ...data,
      readingTime: readingStats.text,
    } as MDXFrontMatter,
    toc,
  };
}

// Get all MDX files with their frontmatter
export async function getAllMDXContent(contentType: string) {
  // Server-side only
  if (typeof window !== 'undefined') {
    return [];
  }

  const slugs = getAllMDXSlugs(contentType);
  
  const content = await Promise.all(
    slugs.map(async (slug) => {
      const { content, frontMatter, toc } = await getMDXContent(contentType, slug);
      return {
        slug,
        content,
        frontMatter,
        toc,
      };
    })
  );
  
  // Sort by date
  return content.sort((a, b) => {
    const dateA = new Date(a.frontMatter.date);
    const dateB = new Date(b.frontMatter.date);
    return dateB.getTime() - dateA.getTime();
  });
}