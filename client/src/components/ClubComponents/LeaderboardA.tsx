import React, { useState, useEffect } from "react";
import LeaderboardItemA from "./LeaderboardItemA";

interface LeaderboardEntry {
  _id: string;
  rank: number;
  fullname: string;
  rating?: number;
}

interface LeaderboardProps {
  players: LeaderboardEntry[];
  onPlayerSelect: (player: LeaderboardEntry) => void;
  onPlayerUpdate: (player: LeaderboardEntry) => void;
}

const LeaderboardA: React.FC<LeaderboardProps> = ({
  players,
  onPlayerSelect,
}) => {
  const [leaderboardData, setLeaderboardData] =
    useState<LeaderboardEntry[]>(players);

  useEffect(() => {
    // Update leaderboard data when players prop changes
    setLeaderboardData(players);
  }, [players]);

  // Function to delete a player
  const handleDeletePlayer = async (_id: string) => {
    if (window.confirm("Czy jesteś pewien że chcesz usunąć tego zawodnika?")) {
      try {
        // Optimistically update the state before sending the delete request
        setLeaderboardData((prevData) =>
          prevData.filter((player) => player._id !== _id)
        );

        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/topplayers/${_id}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Nie udało się usunąć zawodnika");
        }

        alert("Zawodnik usunięty pomyślnie!");
      } catch (error) {
        console.error(error);
        alert("Wystąpił błąd podczas usuwania zawodnika");
      }
    }
  };

  return (
    <section className="flex flex-col text-lg text-white min-w-[280px] max-w-[364px]">
      {leaderboardData.length === 0 ? (
        <p className="text-red-500">Brak zawodników</p>
      ) : (
        leaderboardData.map((entry, index) => (
          <div key={entry._id} className="flex justify-between items-center">
            <LeaderboardItemA
              rank={index + 1} // Use the index for ranking
              name={entry.fullname} // Correctly accessing fullname
              score={entry.rating} // Correctly accessing rating
              onClick={() => onPlayerSelect(entry)}
            />
            <button
              onClick={() => handleDeletePlayer(entry._id)} // Ensure correct ID is passed
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
