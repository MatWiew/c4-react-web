import React, { forwardRef, useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Queen from "../assets/Queen";
import NewsSlider from "./NewsComponents/NewsSlider";

const News = forwardRef<HTMLDivElement>((props, ref) => {
  const [queenSize, setQueenSize] = useState(
    window.innerWidth > 1023 ? 385 : 335
  );
  // States for visibility
  const [isVisibleFirst, setIsVisibleFirst] = useState(false);
  const [isVisibleSecond, setIsVisibleSecond] = useState(false);

  // Refs for the elements to be animated
  const refFirst = useRef(null);
  const refSecond = useRef(null);

  useEffect(() => {
    const currentRefFirst = refFirst.current;
    const currentRefSecond = refSecond.current;

    // Intersection observer for the first element
    const observerFirst = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisibleFirst(true);
          observerFirst.unobserve(entry.target); // Stop observing after visibility
        }
      },
      { threshold: 0.1 } // Adjust threshold as needed
    );

    // Intersection observer for the second element
    const observerSecond = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisibleSecond(true);
          observerSecond.unobserve(entry.target); // Stop observing after visibility
        }
      },
      { threshold: 0.1 } // Adjust threshold as needed
    );

    if (currentRefFirst) {
      observerFirst.observe(currentRefFirst);
    }

    if (currentRefSecond) {
      observerSecond.observe(currentRefSecond);
    }

    return () => {
      if (currentRefFirst) {
        observerFirst.unobserve(currentRefFirst);
      }
      if (currentRefSecond) {
        observerSecond.unobserve(currentRefSecond);
      }
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setQueenSize(window.innerWidth > 767 ? 385 : 550);
    };

    // Call handleResize initially to set the correct size on mount
    handleResize();

    // Add event listeners
    window.addEventListener('resize', handleResize);

    return () => {
      // Clean up event listeners on unmount
      window.removeEventListener('resize', handleResize);
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
            bottom: isVisibleFirst ? 0 : -100,
          }}
          transition={{ duration: 0.5 }}
        >
          AKTUALNOŚCI
        </motion.span>
      </div>
      <motion.div
        ref={refSecond}
        className="relative flex gap-[20vw] items-center justify-center lg:top-[1300px] md:top-[640px] top-[800px] overflow-x-clip"
        initial={{ opacity: 0 }}
        animate={{
          opacity: isVisibleSecond ? 1 : 0,
          gap: isVisibleSecond ? "20vw" : "100vw",
        }}
        transition={{ duration: 0.5 }}
      >
        <div ref={ref} id="news" className="flex-row max-md:absolute max-md:opacity-25">
          <Queen size={queenSize} />
        </div>
        <div className="flex-row md:w-[50vw] w-[80vw] max-w-[1000px] md:h-[385px] h-[300px] bg-black rounded-lg ">
          <NewsSlider />
        </div>
      </motion.div>
    </>
  );
});

export default News;
