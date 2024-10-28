import React, { useState, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";

export type LichessPuzzle = {
  game: {
    id: string;
    pgn: string;
    clock: { initial: number; increment: number; totalTime: number };
  };
  puzzle: {
    rating: number;
    id: string;
    initialPly: number;
    solution: string[];
    themes: string[];
    fen: string;
  };
};

const InteractiveChessboard: React.FC = () => {
  const [game, setGame] = useState(new Chess());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [puzzleId, setPuzzleId] = useState<string | null>(null); // Store the fetched puzzle ID

  useEffect(() => {
    const fetchPuzzle = async () => {
      try {
        const response = await fetch("https://lichess.org/api/puzzle/daily");
        if (!response.ok) {
          throw new Error("Failed to fetch Lichess puzzle");
        }
        const puzzleData: LichessPuzzle = await response.json();

        if (!puzzleData.game.pgn) {
          console.log(puzzleData);
          throw new Error("Puzzle PGN is missing");
        }

        // Load the game with PGN
        const newGame = new Chess();
        newGame.loadPgn(puzzleData.game.pgn); // Set the game using the PGN data

        setGame(newGame); // Update the game state with the loaded PGN
        setPuzzleId(puzzleData.puzzle.id); // Store the puzzle ID for Lichess URL
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

  // Redirect to the specific Lichess puzzle page on board click
  const handleBoardClick = () => {
    if (puzzleId) {
      const lichessPuzzleUrl = `https://lichess.org/training/${puzzleId}`;

      window.open(lichessPuzzleUrl, "_blank"); // Open the specific Lichess puzzle in a new tab
    }
  };

  return (
    <div className="relative cursor-pointer z-5">
      <div className="relative">
        <Chessboard
          id="StyledBoard"
          position={game.fen()}
          customBoardStyle={{
            borderRadius: "4px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
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
          boardOrientation={game.turn() === "w" ? "white" : "black"}
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
