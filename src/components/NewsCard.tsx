interface NewsCardProps {
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category: string;
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

export function NewsCard({ title, excerpt, image, date, category }: NewsCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
      <div className="h-48 relative bg-gray-200 dark:bg-gray-700">
        <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400 text-lg font-bold">
          Image Coming Soon
        </div>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-red-600 dark:text-red-400 text-sm font-semibold">{category}</span>
          <span className="text-gray-500 dark:text-gray-400 text-sm">{date}</span>
        </div>
        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300">{excerpt}</p>
      </div>
    </div>
  );
}
