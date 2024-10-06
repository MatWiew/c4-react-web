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

type References = {
  [key: number]: string | undefined;
};

type MenuItemProps = {
  i: number;
  closeMenu: () => void;
  scrollToDesiredContent: (content: string) => void;
  sectionInView: string | null;
};

const menuItemsTexts = [
  "Strona główna",
  "Aktualności",
  "Turnieje",
  "Klub",
  "Kontakt",
];

const to = ["/", "/news", "/tournaments", "/club", "/contact"];

export const MenuItem: React.FC<MenuItemProps> = ({
  i,
  closeMenu,
  scrollToDesiredContent,
  sectionInView,
}) => {

  const refs: References = {
    0: "about",
    1: "news",
    2: "tournaments",
    3: "club",
    4: "contact",
  };

  const handleClick = async () => {
    const ref = refs[i];
    if (ref) {
      await scrollToDesiredContent(ref);
      closeMenu();
    }
  };

  // Determine if the current section is active
  const isActive = sectionInView === refs[i];

  // Define classes for active and inactive states
  const linkClasses = isActive
    ? "font-semibold text-white rounded-md p-2"
    : "text-gray-400";

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
        onClick={handleClick}
        className={`block lg:inline-block lg:mt-0 font-sans text-xl relative z-[47] ${linkClasses}`}
        style={{
          width: "100%",
          textAlign: "center",
          padding: "0.5rem 1rem",
          lineHeight: "1.5rem",
          textDecoration: "none",
          color: "white"
        }}
      >
        {menuItemsTexts[i % menuItemsTexts.length]}
      </NavLink>

      {isActive && (
        <motion.div
          layoutId={`activeNavLinkSelection`}
          className="absolute inset-0 bg-purple-700 rounded-md"
          style={{ zIndex: 0 }}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
    </motion.li>
  );
};
