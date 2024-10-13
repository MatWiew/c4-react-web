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
    <div onClick={onClick} className="cursor-pointer hover:bg-gray-700 p-2">
      <span>{rank}</span>. <span>{name}</span>{" "}
      {score !== undefined && <span>({score})</span>}
    </div>
  );
};

export default LeaderboardItemA;
