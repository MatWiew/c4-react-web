import React, { forwardRef, useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import SponsorSection from "./FooterComponents/SponsorSection";
import FootEnd from "./FooterComponents/FootEnd";

interface FooterProps {
  scrollToDesiredContent: (section: string) => Promise<void>;
}

const Footer = forwardRef<HTMLDivElement, FooterProps>((props, ref) => {
  const { scrollToDesiredContent } = props;
  
  // States for visibility
  const [isVisibleFirst, setIsVisibleFirst] = useState(false);

  // Refs for the elements to be animated
  const refFirst = useRef(null);

  useEffect(() => {
    const currentRefFirst = refFirst.current;

    const observerFirst = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisibleFirst(true);
          observerFirst.unobserve(entry.target); // Stop observing after visibility
        }
      },
      { threshold: 0.1 }
    );

    if (currentRefFirst) {
      observerFirst.observe(currentRefFirst);
    }

    return () => {
      if (currentRefFirst) {
        observerFirst.unobserve(currentRefFirst);
      }
    };
  }, []);

  return (
    <>
      <div className="relative lg:top-[3200px] md:top-[2200px] top-[2200px]">
        <motion.div
          ref={refFirst}
          className="mx-[15vw]"
          initial={{ opacity: 0, bottom: -50 }}
          animate={{
            opacity: isVisibleFirst ? 1 : 0,
            bottom: isVisibleFirst ? 0 : -100,
          }}
          transition={{ duration: 0.5 }}
        >
          <SponsorSection />
        </motion.div>
        <FootEnd scrollToDesiredContent={scrollToDesiredContent} />
      </div>
      
    </>
  );
});

export default Footer;
