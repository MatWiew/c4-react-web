import React from "react";
import { motion } from "framer-motion";

const navigationItems = [
  { name: "Statut klubu", url: "/statut" },
  { name: "Polityka prywatności", url: "/privacy-policy" },
  {
    name: "Mateusz Wiewióra",
    url: "https://www.linkedin.com/in/mateusz-wiewi%C3%B3ra-bb9b402bb/",
  },
];

const NavigationLinks: React.FC = () => {
  return (
    <ul className="flex flex-col justify-center gap-12 py-2 max-md:py-7 text-2xl text-white h-[285px] max-md:ml-[15vw] mr-12 max-md:text-center">
      {navigationItems.map((item, index) => (
        <li key={index}>
          <motion.a
            whileHover={{ scale: 1.1, color: "#aaa" }}
            transition={{ type: "spring", stiffness: 300 }}
            onClick={() => window.open(item.url, "_blank")}
            className="block hover:no-underline hover:text-current text-white cursor-pointer xl:text-[1.5rem] text-[2vw] min-w-[70px]"
          >
            {item.name}
          </motion.a>
        </li>
      ))}
    </ul>
  );
};

export default NavigationLinks;
