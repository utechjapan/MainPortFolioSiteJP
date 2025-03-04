// components/blog/BlogMeta.tsx
import { format, parseISO } from 'date-fns';

interface BlogMetaProps {
  date: string;
  readingTime?: string;
}

export default function BlogMeta({ date, readingTime }: BlogMetaProps) {
  return (
    <div className="flex flex-wrap items-center text-sm text-gray-400 gap-x-4">
      <time dateTime={date} className="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {format(parseISO(date), 'MMMM d, yyyy')}
      </time>
      
      {readingTime && (
        <span className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {readingTime}
        </span>
      )}
    </div>
  );
}