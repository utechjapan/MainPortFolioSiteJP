// components/ui/Tag.tsx
import Link from 'next/link';

interface TagProps {
  text: string;
  href?: string;
}

export default function Tag({ text, href }: TagProps) {
  const tagContent = (
    <span className="inline-block bg-primary/20 hover:bg-primary/30 text-primary text-xs px-3 py-1 rounded-full transition-colors">
      <i className="fas fa-tag fa-sm mr-1"></i>
      {text}
    </span>
  );

  if (href) {
    return (
      <Link href={href || `/blog/tag/${text}`}>
        {tagContent}
      </Link>
    );
  }

  return tagContent;
}