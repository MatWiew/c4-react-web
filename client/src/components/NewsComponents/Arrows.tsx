import React from "react";
import { motion } from "framer-motion";

const NextArrow = (props: any) => {
  const { className, onClick } = props;
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={ 2.5 }
      stroke="white"
      className={`${className} custom-arrow prev-arrow ml-6`}
      onClick={onClick}
      whileHover={{
        strokeWidth: 3.5,
      }}
      whileTap={{ strokeWidth: 2.5 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m8.25 4.5 7.5 7.5-7.5 7.5"
      />
    </motion.svg>
  );
};

const PrevArrow = (props: any) => {
  const { className, onClick } = props;
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={ 2.5 }
      stroke="#fefe"
      className={`${className} custom-arrow prev-arrow`}
      onClick={onClick}
      whileHover={{
        strokeWidth: 3.5,
        stroke: "white"
      }}
      whileTap={{ strokeWidth: 2.5 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m15.75 4.5-7.5 7.5 7.5 7.5"
      />
    </motion.svg>
  );
};

export { NextArrow, PrevArrow };
