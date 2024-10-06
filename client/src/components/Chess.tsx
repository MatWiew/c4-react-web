import React, { useState, useEffect, useRef } from "react";
import InteractiveChessboard from "./Chessboard";
import { motion } from "framer-motion";
import chesskid from "../img/chesskid.png";
import chesscom from "../img/chesscom.png";
import lichess from "../img/lichessorg.png";

const Chess = () => {
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

  return (
    <>
      <motion.div
        className="lg:relative relative w-full lg:top-[480px] top-[200px] max-w-[1200px] mx-auto"
        ref={refFirst}
        initial={{ opacity: 0, y: 100 }}
        animate={{
          opacity: isVisibleFirst ? 1 : 0,
          y: isVisibleFirst ? 0 : 100,
        }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex lg:gap-[10vw] justify-center">
          <div className="lg:flex hidden flex-col w-5/12 max-md:w-full">
            <div className="flex flex-col grow justify-center px-5 pt-16 pb-20 text-center max-md:mt-9 max-md:max-w-full">
              <div className="mt-15 lg:text-5xl text-4xl italic font-black text-white max-md:mt-10 max-md:max-w-full max-md:text-4xl">
                Rozwiązuj codziennie nasze zadania
              </div>
              <div className="lg:mt-12 mt-7 lg:text-lg text-base leading-7 text-zinc-400 max-md:mt-10 max-md:max-w-full">
                To doskonały sposób na poprawę swoich umiejętności w grze.
                Regularne ćwiczenie pozwala na rozwijanie analitycznego
                myślenia, zdolności do przewidywania ruchów przeciwnika oraz
                lepszego rozumienia strategii szachowych.
              </div>
            </div>
          </div>
          <div className="flex flex-col lg:ml-5 w-[37%] min-w-[300px]">
            <div className="flex flex-col grow justify-center lg:pb-5 pb-3 w-full lg:text-4xl text-2xl font-medium text-white rounded-lg bg-zinc-800">
              <InteractiveChessboard />
              <div className="self-center lg:mt-6 mt-3">Ruch białych</div>
            </div>
          </div>
        </div>
      </motion.div>
      <div className="relative absolute flex justify-between lg:h-[130px] h-[15vw] lg:top-[570px] top-[16rem] w-full overflow-x-clip">
        <motion.div
          className="relative lg:h-[130px] h-[15vw] max-h-[100px] lg:w-[50%] w-full max-w-[1200px] lg:rounded-r-lg bg-zinc-800"
          ref={refSecond}
          initial={{ opacity: 0, left: -100 }}
          animate={{
            opacity: isVisibleSecond ? 1 : 0,
            left: isVisibleSecond ? 0 : -100,
          }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex lg:gap-[5%] gap-[10vw] justify-center h-full items-center px-5 max-md:flex-wrap">
            <a
              href="https://www.kurnik.pl/szachy/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                srcSet={chesskid}
                className="lg:w-[13rem] w-[20vw] object-contain"
                alt="chesskid"
              />
            </a>
            <a
              href="https://lichess.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                srcSet={lichess}
                className="lg:w-[12rem] w-[20vw] rounded-md object-contain"
                alt="lichess"
              />
            </a>
            <a
              href="https://www.chess.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                srcSet={chesscom}
                className="lg:w-[13rem] w-[20vw] object-contain"
                alt="chesscom"
              />
            </a>
          </div>
        </motion.div>
        <div className="relative h-[130px] lg:w-[40%] right-0 flex items-center justify-center">
          <motion.span
            className="relative h-full hidden lg:flex w-full items-center justify-center text-outline font-extrabold text-[8vw]"
            initial={{ opacity: 0, right: -100 }}
            animate={{
              opacity: isVisibleSecond ? 1 : 0,
              right: isVisibleSecond ? 0 : -100,
            }}
            transition={{ duration: 0.5 }}
          >
            GRAJ
          </motion.span>
        </div>
      </div>
    </>
  );
};

export default Chess;
