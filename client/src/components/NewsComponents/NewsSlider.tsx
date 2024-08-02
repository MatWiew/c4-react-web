import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./slider.css";
import { NextArrow, PrevArrow } from "./Arrows";

interface Article {
  _id: string;
  title: string;
  content: string;
  image_url: string;
}

const NewsSlider: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/articles");
        const data: Article[] = await response.json();
        setArticles(data);
      } catch (error) {
        console.error("Failed to fetch articles:", error);
      }
    };

    fetchArticles();
  }, []);

  const settings: Settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    adaptiveHeight: true,
    lazyLoad: "ondemand",
    appendDots: (dots) => (
      <div>
        <ul style={{ margin: "0px" }}>{dots}</ul>
      </div>
    ),
    customPaging: (i) => (
      <motion.div
        whileHover={{ scale: 1.1, color: "#fefe" }}
        whileTap={{ scale: 1.2, color: "#0055EE" }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        style={{
          width: "30px",
          color: "white",
          fontSize: "1.3rem",
        }}
      >
        •
      </motion.div>
    ),
  };

  return (
    <Slider {...settings}>
      {articles.length > 0 ? (
        articles.map((article) => (
          <div
            key={article._id}
            className="relative md:h-[385px] h-[300px] rounded-lg overflow-hidden"
          >
            <img
              src={article.image_url}
              alt={article.title}
              className="absolute inset-0 w-full h-full object-cover mx-auto z-[-1] rounded-lg border border-transparent"
            />

            <div className="flex flex-col text-center justify-between h-full rounded-lg">
              <h3 className="mt-7 px-3 text-2xl text-white font-semibold z-[3]">
                {article.title}
              </h3>
              <p className="text-sm text-gray-200 md:w-[35vw] w-[70vw] mb-8 mx-auto line-clamp-4 z-[3]">
                {article.content}
              </p>
            </div>
            <div className="absolute inset-0 pointer-events-none rounded-lg">
              <div className="absolute inset-x-0 top-0 h-full bg-gradient-to-b h-[90%] from-black/90 from-10% z-[1]"></div>
              <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t h-[90%] from-black/90 from-10% z-[1]"></div>
            </div>
          </div>
        ))
      ) : (
        <p>Loading...</p>
      )}
    </Slider>
  );
};

export default NewsSlider;
