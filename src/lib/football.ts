// Server-side helper to fetch upcoming football matches.
// If an environment variable `FOOTBALL_DATA_API_KEY` is provided (from Football-Data.org),
// this will fetch live scheduled matches for the Premier League and map them to the
// shape expected by the `MatchCard` component. If no key is available or the fetch
// fails, it falls back to the static `upcomingMatches` defined in the components.

export type Match = {
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  venue: string;
  competition: string;
};

export async function getUpcomingMatches(): Promise<Match[]> {
  const key = process.env.FOOTBALL_DATA_API_KEY;

  // If no API key is configured, fall back to the bundled static data.
  if (!key) {
    try {
      // Import the static placeholder matches from the component file.
      const mod = await import('../components/MatchCard');
      return mod.upcomingMatches;
    } catch (e) {
      console.error('Failed to load static upcomingMatches fallback:', e);
      return [];
    }
  }

  try {
    // Football-Data.org example endpoint for Premier League scheduled matches.
    // You can adjust the competition code (e.g., 'PL') or the query as needed.
    const url = 'https://api.football-data.org/v4/competitions/PL/matches?status=SCHEDULED';

    const res = await fetch(url, {
      headers: {
        'X-Auth-Token': key,
      },
      // Revalidate every 5 minutes on the server (ISR-like behaviour)
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      throw new Error(`Football API returned ${res.status}`);
    }

    const data = await res.json();

    // Map API response to the Match shape expected by the UI.
    const matches: Match[] = (data.matches || [])
      .slice(0, 10)
      .map((m: any) => {
        const dateObj = m.utcDate ? new Date(m.utcDate) : null;
        const date = dateObj ? dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBD';
        const time = dateObj ? dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBD';
        return {
          homeTeam: m.homeTeam?.name || 'TBD',
          awayTeam: m.awayTeam?.name || 'TBD',
          date,
          time,
          venue: m.venue || '',
          competition: m.competition?.name || 'Premier League',
        } as Match;
      });

    return matches;
  } catch (err) {
    // On any error, log and fall back to the static placeholder data.
    console.error('Error fetching live matches:', err);
    try {
      const mod = await import('../components/MatchCard');
      return mod.upcomingMatches;
    } catch (e) {
      console.error('Failed to load static upcomingMatches fallback after fetch error:', e);
      return [];
    }
  }
}
