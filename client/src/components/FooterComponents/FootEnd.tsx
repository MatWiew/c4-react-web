import React from "react";
import NavigationLinks from "./NavigationLinks";
import SocialLinks from "./SocialLinks";
import ClubLogo from "../../assets/ClubLogo";
import { motion, useTransform, useScroll } from "framer-motion";

interface FootEndProps {
  scrollToDesiredContent: (section: string) => Promise<void>;
}

const FootEnd: React.FC<FootEndProps> = ({ scrollToDesiredContent }) => {
  const { scrollYProgress } = useScroll();
  // Transform scroll progress to change opacity from 1 (100%) to 0.5 (50%)
  const opacity = useTransform(
    scrollYProgress,
    [0.95, 1], // Input range from 95% to 100% of scroll progress
    [0, 1] // Output range from 100% to 50% opacity
  );

  return (
    <>
      <motion.footer
        style={{ opacity }} // Apply dynamic opacity
        className="flex flex-wrap gap-5 justify-between mx-auto w-full lg:mt-[30vw] mt-[200px]"
      >
        <div className="my-auto max-md:hidden">
          <ClubLogo size="30vw" colorN="#fff" />{" "}
          {/* Set color to white for visibility */}
        </div>
        <nav className="flex items-start pr-5 max-md:w-full max-md:justify-between">
          <NavigationLinks scrollToDesiredContent={scrollToDesiredContent} />
          <SocialLinks />
        </nav>
      </motion.footer>
      <div
        className="flex justify-center items-center w-full text-center h-[70px]"
        style={{ backgroundColor: "#DBFF00" }}
      >
        <p className="text-black md:text-[1rem] max-md:text-[2vw] font-semibold">
          <span className="font-extrabold">©</span> 2024 Mateusz Wiewióra. All rights reserved.
        </p>
      </div>
    </>
  );
};

export default FootEnd;
