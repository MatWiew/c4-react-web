import * as React from "react";
import { motion, Variants } from "framer-motion";
import { NavLink } from "react-router-dom";

const variants: Variants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
    },
  },
};

const colors = ["#7000FF", "#0066FF", "#00FFD1", "#00FF2C", "#DBFF00"];

type MenuItemProps = {
  i: number; // Assuming i is the index
};

const menuItemsTexts = [
  "Strona główna",
  "Aktualności",
  "Turnieje",
  "Klub",
  "Sklep",
  "Kontakt",
];

const to = ["/", "/news", "/tournaments", "/club", "/shop", "/contact"];

export const MenuItem: React.FC<MenuItemProps> = ({ i }) => {
  const style = { color: `${colors[i % colors.length]}` };
  return (
    <motion.li
      variants={variants}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 1 }}
      style={{ listStyleType: "none" }}
      className="list-none mb-5 flex items-center justify-center cursor-pointer"
    >
      <NavLink
        to={to[i]}
        className={({ isActive }) =>
          isActive
            ? "font-semibold text-black block mt-4 lg:inline-block lg:mt-0 font-sans text-xl mr-6"
            : "text-gray-400 block mt-4 lg:inline-block lg:mt-0 font-sans text-xl mr-6"
        }
      >
        {menuItemsTexts[i % menuItemsTexts.length]}
      </NavLink>
    </motion.li>
  );
};
