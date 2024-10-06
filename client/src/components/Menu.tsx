import { motion, useScroll, useTransform } from "framer-motion";
import React from "react";
import { NavLink } from "react-router-dom";
import ClubLogo from "../assets/ClubLogo";
import { MenuButton } from "./MenuButtonAnimation/MenuButton";

interface MenuProps {
  scrollToDesiredContent: (section: string) => void;
  activeSection: string | null;
}

const Menu: React.FC<MenuProps> = ({
  scrollToDesiredContent,
  activeSection,
}) => {
  const handleLinkClick = (section: string) => () => {
    scrollToDesiredContent(section);
  };

  const linkClasses = (section: string) =>
    activeSection === section
      ? "font-semibold important-white-color block mt-4 lg:inline-block lg:mt-0 font-sans text-2xl mr-6"
      : "important-text-gray block mt-4 lg:inline-block lg:mt-0 font-sans text-2xl mr-6";

  const { scrollYProgress } = useScroll();

  // Define the width range based on scroll progress
  const scale = useTransform(
    scrollYProgress,
    [0, 0.05], // Input range: from 0% to 5% of scroll progress
    ["100%", "80%"] // Output range: from 100% to 80% width
  );

  const logoScale = useTransform(
    scrollYProgress,
    [0, 0.05], // Input range: from 0% to 5% of scroll progress
    ["100%", "55%"] // Output range: from 100% to 80% width
  );

  const navY = useTransform(
    scrollYProgress,
    [0, 0.05], // Input range: from 0% to 5% of scroll progress
    [0, "-45"]
  );

  const logoY = useTransform(
    scrollYProgress,
    [0, 0.05], // Input range: from 0% to 5% of scroll progress
    [0, "-45"]
  );

  const color = useTransform(
    scrollYProgress,
    [0, 0.1], // Input range: from 0% to 5% of scroll progress
    ["#fff", "rgba(255, 255, 255, 0.5)"]
  );

  return (
    <nav className="fixed flex items-center justify-between p-6 mx-auto z-[40] w-full">
      <div className="flex w-full justify-between items-center lg:hidden overflow-x-clip">
        <MenuButton
          scrollToDesiredContent={scrollToDesiredContent}
          sectionInView={activeSection}
        />
        <div className="absolute items-center text-white top-0 right-0">
          <ClubLogo size={"7rem"} color={color} />
        </div>
      </div>
      <div className="hidden lg:flex items-center justify-between w-full">
        <motion.div
          className="absolute items-center text-white top-0 left-0"
          style={{ scale: logoScale, transformOrigin: "left", y: logoY }}
        >
          <ClubLogo size={"200px"} color={color} />
        </motion.div>
        <motion.div
          className="absolute text-sm lg:flex-grow lg:text-right top-[75px] right-5"
          style={{ scale: scale, transformOrigin: "right", y: navY }}
        >
          <NavLink
            to="/"
            onClick={handleLinkClick("about")}
            className={linkClasses("about")}
          >
            <motion.span
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="inline-block"
            >
              Strona główna
            </motion.span>
          </NavLink>
          <NavLink
            to="/news"
            onClick={handleLinkClick("news")}
            className={linkClasses("news")}
          >
            <motion.span
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="inline-block"
            >
              Aktualności
            </motion.span>
          </NavLink>
          <NavLink
            to="/tournaments"
            onClick={handleLinkClick("tournaments")}
            className={linkClasses("tournaments")}
          >
            <motion.span
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="inline-block"
            >
              Turnieje
            </motion.span>
          </NavLink>
          <NavLink
            to="/club"
            onClick={handleLinkClick("club")}
            className={linkClasses("club")}
          >
            <motion.span
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="inline-block"
            >
              Klub
            </motion.span>
          </NavLink>
          <NavLink
            to="/contact"
            onClick={handleLinkClick("contact")}
            className={linkClasses("contact")}
          >
            <motion.span
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="inline-block"
            >
              Kontakt
            </motion.span>
          </NavLink>
        </motion.div>
      </div>
    </nav>
  );
};

export default Menu;
