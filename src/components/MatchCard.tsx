interface MatchProps {
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  venue: string;
  competition: string;
}

export const upcomingMatches: MatchProps[] = [
  {
    homeTeam: "Manchester United",
    awayTeam: "Liverpool",
    date: "Nov 10, 2025",
    time: "20:00",
    venue: "Old Trafford",
    competition: "Premier League"
  },
  {
    homeTeam: "Manchester United",
    awayTeam: "Bayern Munich",
    date: "Nov 15, 2025",
    time: "21:00",
    venue: "Allianz Arena",
    competition: "Champions League"
  },
  {
    homeTeam: "Arsenal",
    awayTeam: "Manchester United",
    date: "Nov 20, 2025",
    time: "17:30",
    venue: "Emirates Stadium",
    competition: "Premier League"
  }
];

export function MatchCard({ homeTeam, awayTeam, date, time, venue, competition }: MatchProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="text-sm text-red-600 dark:text-red-400 font-semibold mb-2">{competition}</div>
      <div className="flex justify-between items-center mb-4">
        <span className="text-lg font-bold text-gray-900 dark:text-white">{homeTeam}</span>
        <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">VS</span>
        <span className="text-lg font-bold text-gray-900 dark:text-white">{awayTeam}</span>
      </div>
      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
        <span>{date} - {time}</span>
        <span>{venue}</span>
      </div>
    </div>
  );
}
