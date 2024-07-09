import { motion } from "framer-motion";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import ClubLogo from "../assets/ClubLogo";
import { useMediaQuery } from "@react-hook/media-query";
import { MenuButton } from "./MenuButtonAnimation/MenuButton";



const Menu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Hook to detect screen size
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");

  // Close the menu when the screen size is lg
  React.useEffect(() => {
    if (isLargeScreen) {
      setIsOpen(false);
    }
  }, [isLargeScreen]);

  // Function to handle click on mobile menu button
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="flex items-center justify-between p-6 mx-auto mt-[-2.5vw]">
      {/* Wrapper for mobile view */}
      <div className="flex w-full justify-between items-center lg:hidden">
      
      
      {/* <motion.button
          whileHover={{ scale: [null, 1.3, 1.2] }}
          transition={{ duration: 0.3 }}
          onClick={toggleMenu}
          className="flex items-center  rounded text-white focus:outline-none"
        >
          <svg
            className={`fill-current h-[5vw] w-[5vw] ${
              isOpen ? "hidden" : "block"
            }`}
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </motion.button> */}


        <MenuButton />
        <div className="flex items-center text-white">
          <ClubLogo size={15} />
        </div>
      </div>

      {/* Wrapper for larger screens */}
      <div className="hidden lg:flex items-center justify-between w-full">
        <div className="flex items-center text-white">
          <ClubLogo size={15} />
        </div>
        <div className="text-sm lg:flex-grow lg:text-right">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "font-semibold text-white block mt-4 lg:inline-block lg:mt-0 font-sans text-2xl mr-6"
                : "text-gray-400 block mt-4 lg:inline-block lg:mt-0 font-sans text-2xl mr-6"
            }
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
            className={({ isActive }) =>
              isActive
                ? "font-semibold text-white block mt-4 lg:inline-block lg:mt-0 font-sans text-2xl mr-6"
                : "text-gray-400 block mt-4 lg:inline-block lg:mt-0 font-sans text-2xl mr-6"
            }
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
            className={({ isActive }) =>
              isActive
                ? "font-semibold text-white block mt-4 lg:inline-block lg:mt-0 font-sans text-2xl mr-6"
                : "text-gray-400 block mt-4 lg:inline-block lg:mt-0 font-sans text-2xl mr-6"
            }
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
            className={({ isActive }) =>
              isActive
                ? "font-semibold text-white block mt-4 lg:inline-block lg:mt-0 font-sans text-2xl mr-6"
                : "text-gray-400 block mt-4 lg:inline-block lg:mt-0 font-sans text-2xl mr-6"
            }
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
            to="/shop"
            className={({ isActive }) =>
              isActive
                ? "font-semibold text-white block mt-4 lg:inline-block lg:mt-0 font-sans text-2xl mr-6"
                : "text-gray-400 block mt-4 lg:inline-block lg:mt-0 font-sans text-2xl mr-6"
            }
          >
            <motion.span
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="inline-block"
            >
              Sklep
            </motion.span>
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive
                ? "font-semibold text-white block mt-4 lg:inline-block lg:mt-0 font-sans text-2xl mr-6"
                : "text-gray-400 block mt-4 lg:inline-block lg:mt-0 font-sans text-2xl mr-6"
            }
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
        </div>
      </div>

      {/* Conditional rendering for the navigation links on smaller screens */}
      <div
        className={`fixed top-0 left-0 w-[75%] max-w-[500px] h-full bg-purple-950 z-49 ${
          isOpen ? "block" : "hidden"
        }`}
      >
        <motion.button
          whileHover={{ scale: [null, 1.5, 1.4] }}
          transition={{ duration: 0.3 }}
          onClick={toggleMenu}
          className="absolute right-0 mx-[20px] my-[20px] rounded text-white focus:outline-none"
        >
          <svg
            className={`fill-current h-[20px] w-[20px] ${
              isOpen ? "block" : "hidden"
            }`}
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z" />
          </svg>
        </motion.button>
        <div className="text-sm text-center lg:flex-grow lg:text-right py-12 px-[10vw]">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "font-semibold text-white block bg-purple-700 lg:inline-block lg:mt-0 font-sans text-xl mr-4 py-3 rounded-lg"
                : "text-gray-400 block lg:inline-block lg:mt-0 font-sans text-xl mr-4 py-3 rounded-lg"
            }
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
            className={({ isActive }) =>
              isActive
                ? "font-semibold text-white block bg-purple-700 lg:inline-block lg:mt-0 font-sans text-xl mr-4 py-3 rounded-lg"
                : "text-gray-400 block lg:inline-block lg:mt-0 font-sans text-xl mr-4 py-3 rounded-lg"
            }
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
            className={({ isActive }) =>
              isActive
                ? "font-semibold text-white block bg-purple-700 lg:inline-block lg:mt-0 font-sans text-xl mr-4 py-3 rounded-lg"
                : "text-gray-400 block lg:inline-block lg:mt-0 font-sans text-xl mr-4 py-3 rounded-lg"
            }
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
            className={({ isActive }) =>
              isActive
                ? "font-semibold text-white block bg-purple-700 lg:inline-block lg:mt-0 font-sans text-xl mr-4 py-3 rounded-lg"
                : "text-gray-400 block lg:inline-block lg:mt-0 font-sans text-xl mr-4 py-3 rounded-lg"
            }
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
            to="/shop"
            className={({ isActive }) =>
              isActive
                ? "font-semibold text-white block bg-purple-700 lg:inline-block lg:mt-0 font-sans text-xl mr-4 py-3 rounded-lg"
                : "text-gray-400 block lg:inline-block lg:mt-0 font-sans text-xl mr-4 py-3 rounded-lg"
            }
          >
            <motion.span
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="inline-block"
            >
            Sklep
            </motion.span>
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive
                ? "font-semibold text-white block bg-purple-700 lg:inline-block lg:mt-0 font-sans text-xl mr-4 py-3 rounded-lg"
                : "text-gray-400 block lg:inline-block lg:mt-0 font-sans text-xl mr-4 py-3 rounded-lg"
            }
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
        </div>
      </div>
    </nav>
  );
};

export default Menu;
