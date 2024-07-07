import * as React from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { NavLink, useLocation } from "react-router-dom";

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
  const location = useLocation();

  return (
    <motion.li
      variants={variants}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 1 }}
      style={{ listStyleType: "none" }}
      className="list-none mb-5 flex items-center justify-center cursor-pointer relative"
    >
      <NavLink
        to={to[i]}
        className={({ isActive }) =>
          `block lg:inline-block lg:mt-0 font-sans text-xl relative z-10 ${
            isActive
              ? "font-semibold text-white rounded-md p-2"
              : "text-gray-400"
          }`
        }
        style={{
          width: "100%",
          textAlign: "center",
          padding: "0.5rem 1rem", // Adjust padding as needed
          lineHeight: "1.5rem", // Adjust line height for consistency
          textDecoration: "none", // Remove default underline
        }}
      >
        {menuItemsTexts[i % menuItemsTexts.length]}
      </NavLink>
      <AnimatePresence>
        {location.pathname === to[i] && (
          <motion.div
            key="activeNavLinkSelection"
            layout
            layoutId="activeNavLinkSelection"
            className="absolute inset-0 bg-purple-700 rounded-md"
            style={{ zIndex: 0 }}
            animate={{ opacity: 1 }}
          />
        )}
      </AnimatePresence>
    </motion.li>
  );
};
