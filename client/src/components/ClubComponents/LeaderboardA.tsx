import React, { useState, useEffect } from "react";
import LeaderboardItemA from "./LeaderboardItemA";

interface LeaderboardEntry {
  _id: string;
  rank: number;
  name: string;
  score?: number;
}

interface LeaderboardProps {
  onPlayerSelect: (player: LeaderboardEntry) => void;
}

const LeaderboardA: React.FC<LeaderboardProps> = ({ onPlayerSelect }) => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
    []
  );

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/topplayers");
        if (!response.ok) {
          throw new Error("Failed to fetch leaderboard data");
        }
        const data = await response.json();
        const formattedData = data.map(
          (
            player: { _id: string; fullname: string; rating: number },
            index: number
          ) => ({
            _id: player._id,
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
  }, []);

  // Function to delete a player
  const handleDeletePlayer = async (id: string) => {
    if (window.confirm("Czy jesteś pewien że chcesz usunąć tego zawodnika?")) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/topplayers/${id}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) {
          throw new Error("Failed to delete player");
        }
        setLeaderboardData(
          leaderboardData.filter((player) => player._id !== id)
        ); // Remove player from local state
        alert("Zawodnik usunięty pomyślnie!");
      } catch (error) {
        console.error(error);
        alert("Error deleting player");
      }
    }
  };

  return (
    <section className="flex flex-col text-lg text-white min-w-[280px] max-w-[364px]">
      {leaderboardData.length === 0 ? (
        <p className="text-red-500">Brak zawodników</p>
      ) : (
        leaderboardData.map((entry) => (
          <div key={entry._id} className="flex justify-between items-center">
            <LeaderboardItemA
              rank={entry.rank}
              name={entry.name}
              score={entry.score}
              onClick={() => onPlayerSelect(entry)}
            />
            <button
              onClick={() => handleDeletePlayer(entry._id)}
              className="text-red-500 bg-red-700 p-2 rounded-md"
            >
              Usuń
            </button>
          </div>
        ))
      )}
    </section>
  );
};

export default LeaderboardA;
