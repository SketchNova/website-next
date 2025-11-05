interface NewsCardProps {
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category: string;
  url?: string;
  content?: string;
}

'use client';
import { useState } from 'react';

export const latestNews: NewsCardProps[] = [
  {
    title: "Team Captain Signs New Contract Extension",
    excerpt: "Our beloved captain commits his future to the club with a new 3-year deal",
    image: "/news1.jpg",
    date: "Nov 5, 2025",
    category: "Club News"
  },
  {
    title: "Youth Academy Star Makes First Team Debut",
    excerpt: "Rising talent impresses in their first senior appearance",
    image: "/news2.jpg",
    date: "Nov 4, 2025",
    category: "Academy"
  },
  {
    title: "Historic Victory in Champions League",
    excerpt: "Team secures crucial away win in dramatic fashion",
    image: "/news3.jpg",
    date: "Nov 1, 2025",
    category: "Match Report"
  }
];

export function NewsCard({ title, excerpt, image, date, category, url, content }: NewsCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
      {image ? (
        <div className="h-48 relative bg-gray-200 dark:bg-gray-700">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = ''; // Clear broken image
              e.currentTarget.classList.add('hidden');
              e.currentTarget.parentElement?.classList.add('flex', 'items-center', 'justify-center');
            }}
          />
        </div>
      ) : (
        <div className="h-48 relative bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <div className="text-gray-500 dark:text-gray-400 text-lg font-bold">
            Image Coming Soon
          </div>
        </div>
      )}
      <div className="p-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-red-600 dark:text-red-400 text-sm font-semibold">{category}</span>
          <span className="text-gray-500 dark:text-gray-400 text-sm">{date}</span>
        </div>
        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-400 transition-colors">
          {url ? (
            <a href={url} target="_blank" rel="noopener noreferrer">
              {title}
            </a>
          ) : (
            title
          )}
        </h3>
        <div className={`space-y-4 ${isExpanded ? '' : 'line-clamp-3'}`}>
          <p className="text-gray-600 dark:text-gray-300">{excerpt}</p>
          {content && isExpanded && (
            <p className="text-gray-600 dark:text-gray-300 mt-4">{content}</p>
          )}
        </div>
        {(content || excerpt.length > 150) && (
          <button
            onClick={toggleExpand}
            className="mt-4 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500 font-semibold text-sm transition-colors"
          >
            {isExpanded ? 'Show Less' : 'Read More'}
          </button>
        )}
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 block text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500 text-sm transition-colors"
          >
            Read Full Article →
          </a>
        )}
      </div>
    </div>
  );
}
