import React from "react";
import { motion } from "framer-motion";
import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./slider.css";
import { NextArrow, PrevArrow } from "./Arrows";
import AdminArchive from "./AdminArchive";

interface Article {
  _id: string;
  title: string;
  content: string; // Contains HTML formatted content
  created_at: Date;
  updated_at: Date;
  image_url: string;
  isSecond?: boolean;
}

interface NewsSliderProps {
  articles: Article[]; // Accept articles as a prop
  onClick?: (article: Article) => void; // Accept article as argument
}

const NewsSliderA: React.FC<NewsSliderProps> = ({ articles, onClick }) => {
  const [showArchive, setShowArchive] = React.useState(false);

  const sortedArticles = React.useMemo(() => {
    const secondArticle = articles.find((article) => article.isSecond);
    const otherArticles = articles.filter((article) => !article.isSecond);

    // Sort other articles by date (newest first)
    const sortedOtherArticles = otherArticles.sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return dateB.getTime() - dateA.getTime(); // Sort in descending order
    });

    const finalArticles = secondArticle
      ? [sortedOtherArticles[0], secondArticle, ...sortedOtherArticles.slice(1, 2)]
      : sortedOtherArticles.slice(0, 3);

    return finalArticles;
  }, [articles]);

  const handleClose = (article: any) => {
    setShowArchive(false); // Close the archive
    if (article) {
      onClick?.(article);
      console.log(article);
    }
  };

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
    <>
      <Slider {...settings}>
        {sortedArticles.length > 0 ? (
          sortedArticles.slice(0, 3).map((article) => (
            <div
              key={article._id}
              onClick={() => onClick?.(article)}
              className="relative md:h-[385px] h-[300px] rounded-lg border-[2px] border-transparent overflow-hidden cursor-pointer"
            >
              <img
                src={article.image_url}
                alt={article.title}
                className="absolute inset-0 w-full h-full object-cover mx-auto rounded-lg"
              />

              <div className="flex flex-col text-center justify-between h-full rounded-lg">
                <h3 className="mt-7 px-3 text-2xl text-white font-semibold z-[3]">
                  {article.title}
                </h3>
                <div
                  className="text-sm text-gray-200 md:w-[35vw] w-[70vw] mb-8 mx-auto z-[3] line-clamp-4"
                  dangerouslySetInnerHTML={{ __html: article.content }} // Render HTML content
                />
              </div>
              <div className="absolute inset-0 pointer-events-none rounded-lg">
                <div className="absolute inset-0 top-0 h-full bg-gradient-to-b h-[90%] from-black/40 from-10% z-[1]"></div>
                <div className="absolute inset-0 bottom-0 h-full bg-gradient-to-t h-[90%] from-black/40 from-10% z-[1]"></div>
              </div>
            </div>
          ))
        ) : (
          <p>Loading...</p>
        )}
        <div
          onClick={() => setShowArchive(true)}
          className="relative md:h-[385px] h-[300px] rounded-lg border-[2px] border-transparent overflow-hidden cursor-pointer"
        >
          <img
            src="/archive.jpeg"
            alt="Przejdź do archiwum"
            className="absolute inset-0 object-cover mx-auto rounded-lg w-full h-full"
          />

          <div className="flex flex-col justify-center items-center h-full rounded-lg text-center mx-auto">
            <h3 className="text-[2rem] lg:text-[3rem] text-white font-bold z-[3] italic font-extrabold ">
              Przejdź do <span className="text-blue-500 mt-5">archiwum</span>
            </h3>
          </div>

          <div className="absolute inset-0 pointer-events-none rounded-lg">
            <div className="absolute inset-0 top-0 h-full bg-gradient-to-b h-[90%] from-black/70 from-10% z-[1]"></div>
            <div className="absolute inset-0 bottom-0 h-full bg-gradient-to-t h-[90%] from-black/70 from-10% z-[1]"></div>
          </div>
        </div>
      </Slider>
      {showArchive && <AdminArchive onClose={handleClose} />}
    </>
  );
};

export default NewsSliderA;
