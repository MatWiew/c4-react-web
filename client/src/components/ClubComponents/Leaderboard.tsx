import React, { useState, useEffect } from "react";
import LeaderboardItem from "./LeaderboardItem";

interface LeaderboardEntry {
  rank: number;
  name: string;
  score?: number;
}

const Leaderboard: React.FC = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
    []
  );
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/topplayers`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch leaderboard data");
        }
        const data = await response.json();
        const formattedData = data.map(
          (player: { fullname: string; rating: number }, index: number) => ({
            rank: index + 1,
            name: player.fullname,
            score: player.rating,
          })
        );
        setLeaderboardData(formattedData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchLeaderboardData();

    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 639);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Dynamically slice the leaderboard based on screen size
  const displayedData = isSmallScreen
    ? leaderboardData.slice(0, 3)
    : leaderboardData.slice(0, 5);

  // Fill remaining spots based on screen size
  const maxEntries = isSmallScreen ? 3 : 5;
  const filledData = [...displayedData];
  const remainingSlots = maxEntries - filledData.length;
  for (let i = 0; i < remainingSlots; i++) {
    filledData.push({
      rank: filledData.length + 1,
      name: "-------",
      score: undefined,
    });
  }

  return (
    <section className="flex flex-col text-lg text-green-500 min-w-[280px] max-w-[364px]">
      {filledData.map((entry) => (
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
