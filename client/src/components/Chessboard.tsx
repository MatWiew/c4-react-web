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
  const [expectedMoves, setExpectedMoves] = useState<string[]>([]); // State to hold expected moves

  // Fetch a random daily puzzle from Chess.com
  useEffect(() => {
    const fetchPuzzle = async () => {
      try {
        const response = await fetch("https://api.chess.com/pub/puzzle/random");
        if (!response.ok) {
          throw new Error("Failed to fetch puzzle");
        }
        const puzzleData: Puzzle = await response.json();

        // Check if the fetched puzzle is valid
        if (!puzzleData.fen || !puzzleData.pgn) {
          throw new Error("Puzzle data is invalid");
        }

        // Extracting moves from PGN
        if (puzzleData.pgn) {
          // Check if pgn is not null
          const lines = puzzleData.pgn.split("\n");

          const moveLines = lines
            .filter((line) => !line.startsWith("[")) // Keep only lines that do not start with '['
            .join(" "); // Join the lines into one large string, separated by spaces

          // Check if matches are found and process them
          const cleanedMoves = moveLines ? moveLines.split(" ") : []; // Fallback to empty array if no matches
          const filteredMoves = cleanedMoves
            .map((move) => move.replace(/\r/g, "")) // Remove '\r' from each move
            .filter((move) => move.length > 1 && !/[/.\\*]/.test(move)); // Filter based on length and unwanted characters

          console.log(puzzleData.pgn);
          console.log(filteredMoves);
          // Set the expected moves using nullish coalescing
          setExpectedMoves(cleanedMoves ?? []); // Using nullish coalescing to ensure it's never null
        }

        // Set the game state with the fetched puzzle data
        setGame(new Chess(puzzleData.fen));
      } catch (error) {
        setError((error as Error).message);
        // Fallback to an empty state if error occurs
        setGame(new Chess());
        setExpectedMoves([]); // Clear expected moves
      } finally {
        setLoading(false);
      }
    };

    fetchPuzzle();
  }, []);

  const onPieceDrop = (
    sourceSquare: string,
    targetSquare: string,
    piece: string
  ): boolean => {
    if (sourceSquare) {
      // Create the base move notation for expectedMoves check
      let moveNotation =
        piece.slice(1).toLowerCase() === "p"
          ? targetSquare // Format for pawn move like "b5"
          : `${piece.slice(1).toUpperCase()}${targetSquare}`; // Format for other pieces

      // Make the move
      const move = game.move({ from: sourceSquare, to: targetSquare });

      // Check if the move resulted in a capture
      const isCapture = move?.captured !== undefined; // Check if the captured property is defined

      // Check for promotion
      const isPromotion =
        piece.toLowerCase() === "p" &&
        (targetSquare[1] === "8" || targetSquare[1] === "1");

      // If the move is a capture, add 'x'
      if (isCapture) {
        moveNotation += "x";
      }

      // Check if the game is in check after the move
      if (game.inCheck()) {
        moveNotation += "+";
      }

      // Check if the game is in checkmate after the move
      if (game.isCheckmate()) {
        moveNotation += "#";
      }

      // Handle promotion notation
      if (isPromotion) {
        // Assuming we promote to a queen (you can modify this based on user choice)
        moveNotation += "=Q"; // Change to "=N" for knight promotion
      }

      // Clean up moveNotation

      // Get the list of possible legal moves
      const legalMoves = game.moves();

      const filteredLegalMoves = legalMoves.map(
        (move) => move.replace(/[x+]/g, "") // Clean up legal moves as well
      );

      // Check if the attempted move is valid
      const isLegalMove = filteredLegalMoves.some(
        (move) => move === moveNotation // Check against cleaned notation
      );

      if (isLegalMove) {
        // Check if the move is correct according to the expectedMoves
        if (expectedMoves.length > 0 && expectedMoves[0] === moveNotation) {
          console.log("ok"); // Log "ok" for the correct move
          setExpectedMoves((prev) => prev.slice(1)); // Remove the first expected move
        } else {
          console.log("nie ok", expectedMoves[0], moveNotation); // Log "nie ok" for an illegal but correct move
          return false; // Don't apply the move if it's not the expected one
        }

        setGame(new Chess(game.fen())); // Update the game state with the new position
        return true;
      } else {
        console.log("nielegalny", moveNotation, legalMoves); // Log "nielegalny" for invalid moves
        return false; // Return false for invalid moves
      }
    }

    return false; // Return false if no sourceSquare is set
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <Chessboard
        id="StyledBoard"
        position={game.fen()}
        onPieceDrop={onPieceDrop}
        customBoardStyle={{
          borderRadius: "4px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
        }}
        customArrowColor="rgb(0,0,0)"
        customLightSquareStyle={{
          backgroundColor: "#676767",
        }}
        customDarkSquareStyle={{
          backgroundColor: "#383838",
        }}
        showBoardNotation={false}
        boardOrientation="black"
      />
      {/* Display whose turn it is */}
      <div className="self-center lg:mt-6 mt-3 text-center">
        {game.turn() === "w" ? "Ruch białych" : "Ruch czarnych"}
      </div>
    </div>
  );
};

export default InteractiveChessboard;
