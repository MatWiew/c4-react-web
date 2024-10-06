import React, { forwardRef, useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import MessageComponent from "./ContactComponents/MessageComponent";
import Rook from "../assets/Rook";

const Contact = forwardRef<HTMLDivElement>((props, ref) => {
  const [rookSize, setRookSize] = useState(
    window.innerWidth > 1023 ? 350 : 290
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
      setRookSize(window.innerWidth > 1023 ? 350 : 290);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      id="contact"
      ref={ref}
      className="relative overflow-x-clip lg:top-[2850px] md:top-[1900px] top-[2000px]"
    >
      <motion.span
        ref={refFirst}
        className="absolute w-full text-outline font-extrabold lg:text-[9vw] text-[10vw] text-center xl:top-[-270px] lg:top-[-150px] top-[-150px] z-[-10]"
        initial={{ opacity: 0, bottom: -50 }}
        animate={{
          opacity: isVisibleFirst ? 1 : 0,
          bottom: isVisibleFirst ? 0 : -100,
        }}
        transition={{ duration: 0.5 }}
      >
        KONTAKT
      </motion.span>

      <div className="flex h-[520px]">
        <motion.div
          ref={refSecond}
          className="w-2/5 max-lg:relative mx-auto lg:min-w-[570px] max-lg:w-5/6 z-10"
          initial={{ opacity: 0, x: 50 }} // Slide from the right
          animate={{
            opacity: isVisibleSecond ? 1 : 0,
            x: isVisibleSecond ? 0 : 50, // Animate sliding into view
          }}
          transition={{ duration: 0.5 }}
        >
          <MessageComponent />
        </motion.div>

        <motion.div
          className="flex max-lg:absolute max-lg:w-full mx-auto my-auto max-lg:top-[160px] min-[388px]:top-[200px] max-[388px]:top-[220px]"
          initial={{ opacity: 0, x: -50 }} // Slide from the left
          animate={{
            opacity: isVisibleSecond ? 1 : 0,
            x: isVisibleSecond ? 0 : -50,
          }}
          transition={{ duration: 0.5 }}
        >
          <Rook size={rookSize} />
        </motion.div>
      </div>
    </div>
  );
});

export default Contact;
