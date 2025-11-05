import { MatchCard, upcomingMatches } from '@/components/MatchCard'
import { NewsCard, latestNews } from '@/components/NewsCard'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white dark:from-gray-900 dark:to-gray-800">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="py-20">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-red-600 dark:text-red-500 mb-6">Red Devils Fan Zone</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Your ultimate destination for all things Manchester United. Stay updated with the latest news, matches, and
              community discussions.
            </p>
            <div className="flex justify-center gap-4">
              <button className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors">
                Join Fan Club
              </button>
              <button className="bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white px-8 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                Match Schedule
              </button>
            </div>
          </div>
        </section>

        {/* Upcoming Matches */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Upcoming Matches</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-4">Don't miss any of the action</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {upcomingMatches.map((match, i) => (
              <MatchCard key={i} {...match} />
            ))}
          </div>
        </section>

        {/* Latest News */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Latest News</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-4">Stay up to date with club news and updates</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestNews.map((n, i) => (
              <NewsCard key={i} {...n} />
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 bg-gray-900 dark:bg-black">
          <div className="text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Red Devils Fan Zone. This is an unofficial fan website.</p>
          </div>
        </footer>
      </main>
    </div>
  )
}
