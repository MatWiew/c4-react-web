import React, { useState, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";

export type Puzzle = {
  title: string;
  url: string;
  publish_time: number;
  fen: string;
  pgn: string;
  image: string;
  moves: string[]; // If you need to store the moves separately
};

const InteractiveChessboard: React.FC = () => {
  const [game, setGame] = useState(new Chess());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [puzzleUrl, setPuzzleUrl] = useState<string | null>(null); // Store the fetched puzzle URL

  useEffect(() => {
    const fetchPuzzle = async () => {
      try {
        const response = await fetch("https://api.chess.com/pub/puzzle/random");
        if (!response.ok) {
          throw new Error("Failed to fetch puzzle");
        }
        const puzzleData: Puzzle = await response.json();

        if (!puzzleData.fen || !puzzleData.pgn) {
          throw new Error("Puzzle data is invalid");
        }

        setGame(new Chess(puzzleData.fen));
        setPuzzleUrl(puzzleData.url); // Store the puzzle URL
      } catch (error) {
        setError((error as Error).message);
        setGame(new Chess());
      } finally {
        setLoading(false);
      }
    };

    fetchPuzzle();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Redirect to the fetched puzzle URL on board click
  const handleBoardClick = () => {
    if (puzzleUrl) {
      window.open(puzzleUrl, "_blank"); // Open the fetched puzzle URL in a new tab
    }
  };

  return (
    <div className="relative cursor-pointer z-50">
      <div className="relative z-10">
        <Chessboard
          id="StyledBoard"
          position={game.fen()}
          customBoardStyle={{
            borderRadius: "4px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
            zIndex: 1,
          }}
          customArrowColor="rgb(0,0,0)"
          customLightSquareStyle={{
            backgroundColor: "#676767",
            cursor: "pointer",
          }}
          customDarkSquareStyle={{
            backgroundColor: "#383838",
            cursor: "pointer",
          }}
          showBoardNotation={false}
          arePiecesDraggable={false}
          boardOrientation="white"
        />
      </div>

      {/* Transparent overlay for redirect */}
      <div
        className="absolute inset-0 z-20 bg-transparent cursor-pointer"
        onClick={handleBoardClick}
      ></div>

      <div className="self-center lg:mt-6 mt-3 text-center">
        {game.turn() === "w" ? "Ruch białych" : "Ruch czarnych"}
      </div>
    </div>
  );
};

export default InteractiveChessboard;
