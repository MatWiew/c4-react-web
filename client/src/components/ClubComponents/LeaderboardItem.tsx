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
      <div className="flex items-center justify-between px-4 py-4 w-full bg-black max-xl:bg-opacity-70 rounded-[45px] min-h-[80px]">
        <div className="flex items-center gap-5 mr-3 flex-1">
          <div className="font-bold">{rank}</div>
          <div className="text-white text-base leading-snug break-words">
            {name}
          </div>
        </div>
        <div className="font-medium">{score ?? ""}</div>
      </div>
    </div>
  );
};

export default LeaderboardItem;
