import React, { useState, useEffect } from "react";
import Queen from "../assets/Queen";

const News = () => {
  const [queenSize, setQueenSize] = useState(
    window.innerWidth > 1024 ? 385 : 290
  );

  useEffect(() => {
    const handleResize = () => {
      setQueenSize(window.innerWidth > 1024 ? 385 : 290);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div className="relative top-[1000px]">
        <Queen size={queenSize} />
      </div>
    </>
  );
};

export default News;
