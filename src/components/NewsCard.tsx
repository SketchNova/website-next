'use client';
import { useState } from 'react';
import { useUser } from '@/context/UserContext';

interface NewsCardProps {
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category: string;
  url?: string;
  content?: string;
}

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
  const [showShareTooltip, setShowShareTooltip] = useState(false);
  const { saveItem, removeItem, hasItem } = useUser();
  
  const articleId = btoa(title).slice(0, 12); // Create a stable ID from the title
  const isSaved = hasItem(articleId);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: title,
          text: excerpt,
          url: url || window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(url || window.location.href);
        setShowShareTooltip(true);
        setTimeout(() => setShowShareTooltip(false), 2000);
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const toggleSave = () => {
    if (isSaved) {
      removeItem(articleId);
    } else {
      saveItem({
        id: articleId,
        type: 'article',
        title,
        date,
        url,
      });
    }
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
          <div className="mt-4 flex items-center justify-between">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500 text-sm transition-colors"
            >
              Read Full Article →
            </a>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleShare}
                className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors relative"
                aria-label="Share article"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
                {showShareTooltip && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap">
                    Link copied!
                  </div>
                )}
              </button>
              <button
                onClick={toggleSave}
                className={`text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors ${
                  isSaved ? 'text-red-600 dark:text-red-400' : ''
                }`}
                aria-label={isSaved ? 'Remove from saved' : 'Save article'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d={
                    isSaved
                      ? "M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"
                      : "M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4zm2-1a1 1 0 00-1 1v12.566l4 2 4-2V4a1 1 0 00-1-1H7z"
                  } />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
