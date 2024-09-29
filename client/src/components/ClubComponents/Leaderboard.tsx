import React, { useState, useEffect } from 'react';
import LeaderboardItem from './LeaderboardItem';

interface LeaderboardEntry {
  rank: number;
  name: string;
  score?: number;
}

const leaderboardData: LeaderboardEntry[] = [
  { rank: 1, name: "Yury Aksianevich", score: 1928 },
  { rank: 2, name: "Wojciech Kmiecik", score: 1816 },
  { rank: 3, name: "Anna Michalak", score: 1789 },
  { rank: 4, name: "Paweł Janic", score: 1754 },
  { rank: 5, name: "Szymon Rudowski", score: 1729 }
];

const Leaderboard: React.FC = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    // Function to check window size and update isSmallScreen
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 639); // 639px is the sm breakpoint in Tailwind
    };

    // Run the function on mount and resize
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Dynamically slice the leaderboard based on screen size
  const displayedData = isSmallScreen ? leaderboardData.slice(0, 3) : leaderboardData;

  return (
    <section className="flex flex-col text-lg text-green-500 min-w-[280px] max-w-[364px]">
      {displayedData.map((entry) => (
        <LeaderboardItem
          key={entry.rank}
          rank={entry.rank}
          name={entry.name}
          score={entry.score}
        />
      ))}
    </section>
  );
};

export default Leaderboard;
