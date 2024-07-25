import React, { useState, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";

export type Puzzle = {
  fen: string;
  moves: string[];
  makeFirstMove?: boolean;
};

const examplePuzzle: Puzzle = {
  fen: "3rk1r1/5p2/Q1p1pP2/8/P2q4/5bB1/1PP1B2P/3RK3 b - - 0 1",
  moves: ["Qg1", "Bf1", "Rxd1"],
  makeFirstMove: false,
};

const InteractiveChessboard: React.FC = () => {
  const [game, setGame] = useState(new Chess(examplePuzzle.fen));
  const [moveIndex, setMoveIndex] = useState(0);

  useEffect(() => {
    if (examplePuzzle.makeFirstMove && moveIndex === 0) {
      const gameCopy = new Chess(game.fen());
      gameCopy.move(examplePuzzle.moves[0]);
      setGame(gameCopy);
      setMoveIndex(1);
    }
  }, [game, moveIndex]);

  const onPieceDrop = (sourceSquare: string, targetSquare: string, piece: string): boolean => {
    const move = `${piece[1]}${targetSquare}`;

    if (move === examplePuzzle.moves[moveIndex]) {
      console.log("ok");
      setMoveIndex((prevIndex) => prevIndex + 1);

      // Apply the move to the game state
      const gameCopy = new Chess(game.fen());
      const result = gameCopy.move({ from: sourceSquare, to: targetSquare, promotion: "q" });

      if (result) {
        setGame(gameCopy);
        return true;
      } else {
        console.log("Invalid move");
        return false;
      }
    } else {
      console.log("not ok", move);
      // setMoveIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
      return false;
    }
  };

  return (
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
  );
};

export default InteractiveChessboard;
