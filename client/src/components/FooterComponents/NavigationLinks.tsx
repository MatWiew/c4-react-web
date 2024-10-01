import React from "react";
import { motion } from "framer-motion";

const navigationItems = [
  { name: "Strona główna", section: "about" }, // Map to section names
  { name: "Aktualności", section: "news" },
  { name: "Turnieje", section: "tournaments" },
  { name: "Klub", section: "club" },
  { name: "Kontakt", section: "contact" },
];

interface NavigationLinksProps {
  scrollToDesiredContent: (section: string) => Promise<void>;
  activeSection: string | null; // Add this prop
}

const NavigationLinks: React.FC<NavigationLinksProps> = ({
  scrollToDesiredContent,
  activeSection,
}) => {
  return (
    <ul className="flex flex-col text-2xl text-white min-h-[285px] mr-12">
      {navigationItems.map((item, index) => (
        <li key={index} className={index > 0 ? "mt-7" : ""}>
          <motion.a
            whileHover={{ scale: 1.1, color: "#aaa" }}
            transition={{ type: "spring", stiffness: 300 }}
            onClick={() => scrollToDesiredContent(item.section)} // Use the scroll function
            href="#"
            className={`block hover:no-underline hover:text-current text-white cursor-pointer ${
              activeSection === item.section ? "text-blue-400 font-bold" : ""
            }`} // Highlight the active link
          >
            {item.name}
          </motion.a>
        </li>
      ))}
    </ul>
  );
};

export default NavigationLinks;
