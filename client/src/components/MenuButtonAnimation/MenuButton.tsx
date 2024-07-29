import { useRef, useState, useEffect } from "react";
import { motion, useCycle } from "framer-motion";
import MenuToggle from "./MenuToggle";
import { Navigation } from "./Navigation";

const sidebar = {
  open: (height = 1000) => ({
    clipPath: `circle(${height * 2 + 200}px at 40px 40px)`,
    transition: {
      type: "spring",
      stiffness: 20,
      restDelta: 2
    }
  }),
  closed: {
    clipPath: "circle(0px at 39px 3.5rem)",
    transition: {
      delay: 0.5,
      type: "spring",
      stiffness: 400,
      damping: 40
    }
  }
};

interface MenuButtonProps {
  scrollToDesiredContent: (section: string) => void;
  sectionInView: string | null;
}

export const MenuButton: React.FC<MenuButtonProps> = ({ scrollToDesiredContent, sectionInView }) => {
  const [isOpen, toggleOpen] = useCycle(false, true);
  const [containerHeight, setContainerHeight] = useState<number | null>(null); // Set initial state to null or 0
  const containerRef = useRef<HTMLDivElement>(null); // Specify the type of ref

  useEffect(() => {
    const updateContainerHeight = () => {
      if (containerRef.current) {
        setContainerHeight(containerRef.current.offsetHeight);
      }
    };

    // Initial measurement
    updateContainerHeight();

    // Event listener for window resize
    const handleResize = () => {
      updateContainerHeight();
    };

    window.addEventListener("resize", handleResize);

    // Clean-up on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const closeMenu = () => {
    if (isOpen) {
      toggleOpen(); // Close the menu
    }
  };

  return (
    <motion.nav
      initial={false}
      animate={isOpen ? "open" : "closed"}
      custom={containerHeight ?? 0} // Use containerHeight or fallback to 0
      ref={containerRef}
    >
      <motion.div className="absolute top-0 left-0 bottom-0 w-72 h-[3000px] bg-purple-950 z-[45]" variants={sidebar} />
      <Navigation closeMenu={closeMenu} scrollToDesiredContent={scrollToDesiredContent} sectionInView={sectionInView} isOpen={isOpen} />
      <MenuToggle toggle={() => toggleOpen()} isOpen={isOpen} />
    </motion.nav>
  );
};
