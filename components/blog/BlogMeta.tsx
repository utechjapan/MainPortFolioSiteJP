// components/blog/BlogMeta.tsx
import { format, parseISO } from "date-fns";

interface BlogMetaProps {
  date: string;
  readingTime?: string;
}

export default function BlogMeta({ date, readingTime }: BlogMetaProps) {
  return (
    <div className="flex flex-wrap items-center text-sm text-gray-600 dark:text-gray-400 gap-x-4 transition-colors">
      <time dateTime={date} className="flex items-center">
        <i className="fas fa-calendar-alt mr-1" aria-hidden="true"></i>
        {format(parseISO(date), "MMMM d, yyyy")}
      </time>

      {readingTime && (
        <span className="flex items-center">
          <i className="fas fa-clock mr-1" aria-hidden="true"></i>
          {readingTime}
        </span>
      )}
    </div>
  );
}
