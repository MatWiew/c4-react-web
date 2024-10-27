import React from "react";

interface LeaderboardItemProps {
  rank: number;
  name: string;
  score?: number;
  onClick: () => void; // Prop for click handler
}

const LeaderboardItemA: React.FC<LeaderboardItemProps> = ({
  rank,
  name,
  score,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer hover:bg-gray-700 p-2 flex justify-between items-center"
    >
      <div className="flex items-center">
        <span className="font-semibold">{rank}</span>
        <span className="ml-2">{name}</span>
      </div>
      {score !== undefined && <span className="text-gray-400">({score})</span>}
    </div>
  );
};

export default LeaderboardItemA;
