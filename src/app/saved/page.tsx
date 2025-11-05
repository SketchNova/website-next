'use client';
import { useUser } from '@/context/UserContext';
import Link from 'next/link';

export default function SavedItems() {
  const { savedItems, removeItem } = useUser();

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white dark:from-gray-900 dark:to-gray-800">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Saved Items</h1>
        
        {savedItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">No saved items yet.</p>
            <Link 
              href="/"
              className="mt-4 inline-block text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500"
            >
              Browse Content →
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {savedItems.map((item) => (
              <div 
                key={item.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex justify-between items-center"
              >
                <div>
                  <div className="text-sm text-red-600 dark:text-red-400 mb-1">
                    {item.type === 'article' ? 'Article' : 'Match'}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {item.url ? (
                      <a 
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-red-600 dark:hover:text-red-400"
                      >
                        {item.title}
                      </a>
                    ) : (
                      item.title
                    )}
                  </h3>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {item.date}
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="ml-4 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  aria-label="Remove from saved items"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}