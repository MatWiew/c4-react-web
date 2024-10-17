import React, { forwardRef, useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Queen from "../assets/Queen";
import NewsSlider from "./NewsComponents/NewsSlider";
import FullscreenArticleModal from "./NewsComponents/FullscreenArticleModal"; // Import the fullscreen modal

// Define the Article interface here if it's not globally available
interface Article {
  _id: string;
  title: string;
  content: string;
  image_url: string;
}

const News = forwardRef<HTMLDivElement>((props, ref) => {
  const [queenSize, setQueenSize] = useState(
    window.innerWidth > 1023 ? 385 : 335
  );

  const [isVisibleFirst, setIsVisibleFirst] = useState(false);
  const [isVisibleSecond, setIsVisibleSecond] = useState(false);

  // State to manage fullscreen mode for the article
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null); // Updated type

  // Refs for the elements to be animated
  const refFirst = useRef(null);
  const refSecond = useRef(null);

  useEffect(() => {
    const observerFirst = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisibleFirst(true);
          observerFirst.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    const observerSecond = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisibleSecond(true);
          observerSecond.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    const currentFirst = refFirst.current; // Store the current value
    const currentSecond = refSecond.current; // Store the current value

    if (currentFirst) observerFirst.observe(currentFirst);
    if (currentSecond) observerSecond.observe(currentSecond);

    return () => {
      if (currentFirst) observerFirst.unobserve(currentFirst); // Use the stored value
      if (currentSecond) observerSecond.unobserve(currentSecond); // Use the stored value
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setQueenSize(window.innerWidth > 767 ? 385 : 550);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <div className="relative lg:top-[1200px] top-[590px] w-full mx-auto text-center">
        <motion.span
          ref={refFirst}
          className="absolute w-full text-outline font-extrabold lg:text-[9vw] text-[10vw] left-0"
          initial={{ opacity: 0, bottom: -50 }}
          animate={{
            opacity: isVisibleFirst ? 1 : 0,
            bottom: isVisibleFirst ? 0 : -50,
          }}
          transition={{ duration: 0.5 }}
        >
          AKTUALNOŚCI
        </motion.span>
      </div>
      <motion.div
        ref={refSecond}
        className="relative flex gap-[20vw] items-center justify-center lg:top-[1300px] md:top-[640px] top-[800px] overflow-x-clip"
        initial={{ opacity: 0, gap: "25vw" }}
        animate={{
          opacity: isVisibleSecond ? 1 : 0,
          gap: isVisibleSecond ? "20vw" : "25vw",
        }}
        transition={{ duration: 0.5 }}
      >
        <div
          ref={ref}
          id="news"
          className="flex-row max-md:absolute max-md:opacity-25"
        >
          <Queen size={queenSize} />
        </div>
        <div className="flex-row md:w-[50vw] w-[80vw] max-w-[1000px] md:h-[385px] h-[300px] rounded-lg ">
          {/* Pass the handler to show fullscreen */}
          <NewsSlider
            onClick={(article: Article) => setSelectedArticle(article)}
          />
        </div>
      </motion.div>

      {/* Render FullscreenArticleModal when an article is selected */}
      {selectedArticle && (
        <FullscreenArticleModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)} // Close fullscreen
        />
      )}
    </>
  );
});

export default News;
