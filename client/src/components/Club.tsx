import React, { forwardRef, useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Bishop from "../assets/Bishop";
import Leaderboard from "./ClubComponents/Leaderboard";

const Club = forwardRef<HTMLDivElement>((props, ref) => {
  const [bishopSize, setBishopSize] = useState(
    window.innerWidth > 1279 ? 420 : 550
  );

  // States for visibility
  const [isVisibleFirst, setIsVisibleFirst] = useState(false);
  const [isVisibleSecond, setIsVisibleSecond] = useState(false);
  const [instructors, setInstructors] = useState<string[]>([]); // State for instructors

  // Refs for the elements to be animated
  const refFirst = useRef(null);
  const refSecond = useRef(null);

  useEffect(() => {
    const currentRefFirst = refFirst.current;
    const currentRefSecond = refSecond.current;

    const observerFirst = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisibleFirst(true);
          observerFirst.unobserve(entry.target); // Stop observing after visibility
        }
      },
      { threshold: 0.1 }
    );

    const observerSecond = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisibleSecond(true);
          observerSecond.unobserve(entry.target); // Stop observing after visibility
        }
      },
      { threshold: 0.1 }
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
      setBishopSize(window.innerWidth > 1279 ? 420 : 550);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Fetch instructors from the API
  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/trainers");
        if (!response.ok) {
          throw new Error("Failed to fetch instructors");
        }
        const data = await response.json();
        setInstructors(
          data.map((trainer: { fullname: string }) => trainer.fullname)
        );
      } catch (error) {
        console.error(error);
      }
    };

    fetchInstructors();
  }, []);

  return (
    <div
      ref={ref}
      id="club"
      className="relative items-center justify-between w-90 mx-[7rem] max-lg:mx-[1rem] lg:top-[2350px] md:top-[1540px] top-[1600px] text-white font-bold text-2xl"
    >
      <motion.span
        ref={refFirst}
        className="absolute w-full text-outline font-extrabold lg:text-[9vw] text-[10vw] text-center xl:top-[-190px] lg:top-[-150px] top-[-150px]"
        initial={{ opacity: 0, bottom: -50 }}
        animate={{
          opacity: isVisibleFirst ? 1 : 0,
          bottom: isVisibleFirst ? 0 : -100,
        }}
        transition={{ duration: 0.5 }}
      >
        KLUB
      </motion.span>

      <motion.div
        ref={refSecond}
        className="flex max-sm:flex-col justify-center xl:gap-[10vw] max-sm:gap-[300px] gap-[3vw] max-xl:min-gap align-items h-[500px] relative"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{
          opacity: isVisibleSecond ? 1 : 0,
          scale: isVisibleSecond ? 1 : 0.9,
        }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          className="xl:flex max-xl:absolute max-sm:w-full max-xl:top-[-30px] xl:h-[420px] h-[600px] xl:my-auto rounded-lg 2xl:left-0 z-[-1]"
          initial={{ opacity: 0, x: -50 }}
          animate={{
            opacity: isVisibleSecond ? 1 : 0,
            x: isVisibleSecond ? 0 : -50,
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Bishop size={bishopSize} />
        </motion.div>

        <motion.div
          className="relative sm:w-[280px] max-sm:w-full"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{
            opacity: isVisibleSecond ? 1 : 0,
            scale: isVisibleSecond ? 1 : 0.9,
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="relative sm:left-[-1vw] top-[15px] mx-auto max-sm:w-3/5 min-w-[280px]">
            <Leaderboard />
          </div>
        </motion.div>

        <motion.div
          className="bg-black min-w-[300px] max-sm:w-3/5 max-sm:mx-auto max-xl:bg-opacity-70 h-5/7 sm:my-auto max-sm:mt-[-250px] rounded-lg p-10 max-sm:py-5 text-3xl text-center"
          initial={{ opacity: 0, x: 50 }}
          animate={{
            opacity: isVisibleSecond ? 1 : 0,
            x: isVisibleSecond ? 0 : 50,
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p>Instruktorzy:</p>
          <div className="h-4/5 flex flex-col justify-between">
            {instructors.length > 0 ? (
              instructors.map((instructor, index) => (
                <p key={index} className="text-base font-normal mt-6">{`${
                  index + 1
                }. ${instructor}`}</p>
              ))
            ) : (
              <p className="text-base font-normal mt-6">Brak instruktorów</p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
});

export default Club;
