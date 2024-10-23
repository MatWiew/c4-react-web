import React from "react";
import { motion } from "framer-motion";

const navigationItems = [
  { name: "Statut klubu", url: "https://www.wikipedia.org" },
  { name: "Aktualności", url: "news" },
  { name: "Turnieje", url: "tournaments" },
  { name: "Klub", url: "club" },
  { name: "Kontakt", url: "contact" },
];

const NavigationLinks: React.FC = () => {
  return (
    <ul className="flex flex-col justify-between py-2 max-md:py-7 text-2xl text-white h-[285px] max-md:ml-[15vw] mr-12 max-md:text-center">
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
