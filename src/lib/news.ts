// Server-side helper to fetch latest news articles.
// If an environment variable `NEWS_API_KEY` is provided (e.g., NewsAPI.org),
// this will fetch recent articles for "Manchester United" and map them to the
// shape expected by the `NewsCard` component. If no key is available or the fetch
// fails, it falls back to the static `latestNews` defined in the components.

export type News = {
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category: string;
};

export async function getLatestNews(): Promise<News[]> {
  const key = process.env.NEWS_API_KEY;

  // If no API key is configured, fall back to the bundled static data.
  if (!key) {
    try {
      const mod = await import('../components/NewsCard');
      return mod.latestNews;
    } catch (e) {
      console.error('Failed to load static latestNews fallback:', e);
      return [];
    }
  }

  try {
    // NewsAPI.org everything endpoint example for Manchester United.
    // Adjust query, language or pageSize as needed.
    const q = encodeURIComponent('Manchester United');
    const url = `https://newsapi.org/v2/everything?q=${q}&language=en&sortBy=publishedAt&pageSize=6`;

    const res = await fetch(url, {
      headers: {
        Authorization: key,
      },
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      throw new Error(`News API returned ${res.status}`);
    }

    const data = await res.json();

    const articles = (data.articles || []).map((a: any) => {
      const dateObj = a.publishedAt ? new Date(a.publishedAt) : null;
      const date = dateObj
        ? dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
        : 'TBD';
      return {
        title: a.title || 'No title',
        excerpt: a.description || a.content || '',
        image: a.urlToImage || '',
        date,
        category: a.source?.name || 'News',
      } as News;
    });

    return articles;
  } catch (err) {
    console.error('Error fetching live news:', err);
    try {
      const mod = await import('../components/NewsCard');
      return mod.latestNews;
    } catch (e) {
      console.error('Failed to load static latestNews fallback after fetch error:', e);
      return [];
    }
  }
}
