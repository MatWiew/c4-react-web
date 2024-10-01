import React, { useState, useEffect } from "react";
import NavigationLinks from "./NavigationLinks";
import SocialLinks from "./SocialLinks";
import ClubLogo from "../../assets/ClubLogo";
import { useTransform, useScroll } from "framer-motion";

interface FootEndProps {
  scrollToDesiredContent: (section: string) => Promise<void>;
  activeSection: string | null;
}

const FootEnd: React.FC<FootEndProps> = ({
  scrollToDesiredContent,
  activeSection,
}) => {
  const [logoSize, setLogoSize] = useState(
    window.innerWidth > 1023 ? 350 : 290
  );

  const { scrollYProgress } = useScroll();

  const color = useTransform(
    scrollYProgress,
    [0, 0.1], // Input range: from 0% to 5% of scroll progress
    ["#fff", "rgba(255, 255, 255, 0.5)"]
  );

  useEffect(() => {
    const handleResize = () => {
      setLogoSize(window.innerWidth > 767 ? 385 : 550);
    };

    // Call handleResize initially to set the correct size on mount
    handleResize();

    // Add event listeners
    window.addEventListener("resize", handleResize);

    return () => {
      // Clean up event listeners on unmount
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <footer className="flex mt-12 flex-wrap gap-5 justify-between mx-auto w-full max-w-[1263px] max-md:max-w-full">
      <ClubLogo size={`${logoSize}px`} color={color} />
      <nav className="flex items-start max-md:max-w-full">
        <NavigationLinks
          scrollToDesiredContent={scrollToDesiredContent}
          activeSection={activeSection}
        />
        <div className="flex min-h-[36px]" />
        <SocialLinks />
      </nav>
    </footer>
  );
};

export default FootEnd;
