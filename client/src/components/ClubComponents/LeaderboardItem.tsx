import React from "react";

interface LeaderboardItemProps {
  rank: number;
  name: string;
  score?: number;
}

const LeaderboardItem: React.FC<LeaderboardItemProps> = ({
  rank,
  name,
  score,
}) => {
  return (
    <div className="flex flex-col w-full rounded-none mt-5 first:mt-0">
      <div className="flex justify-between items-center px-4 py-6 w-full bg-black max-xl:bg-opacity-70 rounded-[45px]">
        <div className="flex gap-5 mr-3">
          <div className="font-bold">{rank}</div>
          <div className="text-white">{name}</div>
        </div>
        {score !== undefined ? (
          <div className="font-medium">{score}</div>
        ) : (
          <div className="font-medium"></div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardItem;
