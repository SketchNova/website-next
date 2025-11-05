'use client';
import { useState } from 'react';
import { useUser } from '@/context/UserContext';

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
  const [showTooltip, setShowTooltip] = useState(false);
  const { saveItem, removeItem, hasItem, toggleReminder, hasReminder } = useUser();
  
  const matchId = btoa(`${homeTeam}-${awayTeam}-${date}`).slice(0, 12);
  const isSaved = hasItem(matchId);
  const hasMatchReminder = hasReminder(matchId);

  const handleAddToCalendar = () => {
    const startDate = new Date(`${date} ${time}`);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // 2 hours duration
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`${homeTeam} vs ${awayTeam}`)}&details=${encodeURIComponent(`${competition} match at ${venue}`)}&dates=${startDate.toISOString().replace(/[-:.]/g, '').slice(0, 15)}/${endDate.toISOString().replace(/[-:.]/g, '').slice(0, 15)}`;
    
    window.open(googleCalendarUrl, '_blank');
  };

  const toggleSave = () => {
    if (isSaved) {
      removeItem(matchId);
    } else {
      saveItem({
        id: matchId,
        type: 'match',
        title: `${homeTeam} vs ${awayTeam}`,
        date: `${date} - ${time}`,
      });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div className="text-sm text-red-600 dark:text-red-400 font-semibold">{competition}</div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleAddToCalendar}
            className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
            aria-label="Add to calendar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            onClick={() => toggleReminder(matchId)}
            className={`text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors ${
              hasMatchReminder ? 'text-red-600 dark:text-red-400' : ''
            }`}
            aria-label={hasMatchReminder ? 'Remove reminder' : 'Set reminder'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
          </button>
          <button
            onClick={toggleSave}
            className={`text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors ${
              isSaved ? 'text-red-600 dark:text-red-400' : ''
            }`}
            aria-label={isSaved ? 'Remove from saved' : 'Save match'}
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
