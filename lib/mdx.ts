// lib/mdx.ts
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

// Use dynamic import for fs to avoid client-side errors
const fs = typeof window === "undefined" ? require("fs") : null;

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

// Create a safe ID from text
function createSafeId(text: string): string {
  // Create a simplified version that works for both English and Japanese
  const safeId = text
    .trim()
    .toLowerCase()
    // Replace non-alphanumeric characters with hyphens
    .replace(/[^\w\s]/g, '')
    // Replace whitespace with hyphens
    .replace(/\s+/g, '-')
    // Remove consecutive hyphens
    .replace(/-+/g, '-')
    // Remove leading and trailing hyphens
    .replace(/^-+|-+$/g, '');
  
  // Ensure the ID is not empty and doesn't start with a number (for CSS selector validity)
  if (!safeId) {
    return 'section';
  }
  
  // Prepend 'heading-' to IDs that start with numbers
  if (/^\d/.test(safeId)) {
    return `heading-${safeId}`;
  }
  
  return safeId;
}

// Extract headings from markdown content
function extractHeadings(content: string) {
  const headingRegex = /^(#{2,4})\s+(.*)$/gm;
  const headings: { id: string; text: string; level: number }[] = [];
  let match: RegExpExecArray | null;
  const idMap = new Map<string, number>(); // Track duplicate IDs

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    let id = createSafeId(text);
    
    // Handle duplicate IDs
    if (idMap.has(id)) {
      const count = idMap.get(id)! + 1;
      idMap.set(id, count);
      id = `${id}-${count}`;
    } else {
      idMap.set(id, 1);
    }

    headings.push({ id, text, level });
  }

  return headings;
}

// Get all MDX files in a directory
export function getAllMDXSlugs(contentType: string): string[] {
  // Server-side only
  if (typeof window !== "undefined") return [];

  const contentPath = path.join(process.cwd(), "content", contentType);

  // Check if directory exists
  if (!fs.existsSync(contentPath)) {
    console.warn(`Directory ${contentPath} does not exist`);
    return [];
  }

  const filenames = fs.readdirSync(contentPath);

  return filenames
    .filter((filename: string) => filename.endsWith(".mdx"))
    .map((filename: string) => filename.replace(".mdx", ""));
}

// Get content and frontmatter of an MDX file
export async function getMDXContent(contentType: string, slug: string) {
  // Server-side only
  if (typeof window !== "undefined") {
    return {
      content: "",
      frontMatter: { title: "", date: "" } as MDXFrontMatter,
      toc: [],
    };
  }

  const filePath = path.join(
    process.cwd(),
    "content",
    contentType,
    `${slug}.mdx`
  );

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    console.warn(`File ${filePath} does not exist`);
    return {
      content: "",
      frontMatter: { title: "", date: "" } as MDXFrontMatter,
      toc: [],
    };
  }

  const fileContent = fs.readFileSync(filePath, "utf8");

  const { content, data } = matter(fileContent);
  const toc = extractHeadings(content);

  // Calculate reading time
  const readingStats = readingTime(content);

  // Construct a complete frontMatter object with default values if properties are missing
  const frontMatter: MDXFrontMatter = {
    title: data.title || "Untitled",
    date: data.date || "1970-01-01",
    description: data.description || "",
    excerpt: data.excerpt || "",
    author: data.author || "",
    authorImage: data.authorImage || "",
    authorBio: data.authorBio || "",
    image: data.image || "",
    tags: data.tags || [],
    readingTime: readingStats.text,
  };

  return { content, frontMatter, toc };
}

// Get all MDX files with their frontmatter
export async function getAllMDXContent(contentType: string) {
  // Server-side only
  if (typeof window !== "undefined") return [];

  const slugs = getAllMDXSlugs(contentType);

  const contentArr = await Promise.all(
    slugs.map(async (slug) => {
      const { content, frontMatter, toc } = await getMDXContent(
        contentType,
        slug
      );
      return { slug, content, frontMatter, toc };
    })
  );

  // Sort by date (assuming every post now has a valid date string)
  return contentArr.sort((a, b) => {
    const dateA = new Date(a.frontMatter.date);
    const dateB = new Date(b.frontMatter.date);
    return dateB.getTime() - dateA.getTime();
  });
}