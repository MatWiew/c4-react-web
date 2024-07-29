import React, { useState, useEffect } from "react";
import Queen from "../assets/Queen";
import Slider from "react-slick";
import NewsSlider from "./NewsComponents/NewsSlider";

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
      <div className="relative top-[1000px] w-[40vw] left-5 bg-white h-[300px]">
        <NewsSlider />
      </div>
    </>
  );
};

export default News;
