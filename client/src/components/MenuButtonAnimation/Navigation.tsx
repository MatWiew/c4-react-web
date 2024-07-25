import { motion } from "framer-motion";
import { MenuItem } from "./MenuItem";

const variants = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 }
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 }
  }
};

interface NavigationProps {
  closeMenu: () => void;
  scrollToDesiredContent: (section: string) => void;
  sectionInView: string | null;
  isOpen: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({ closeMenu, scrollToDesiredContent, sectionInView, isOpen }) => (
  <motion.ul 
    variants={variants}
    className={`absolute top-20 m-5 w-56 z-[46] ${!isOpen ? 'pointer-events-none' : ''}`}
    style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
  >
    {itemIds.map(i => (
      <MenuItem i={i} key={i} closeMenu={closeMenu} scrollToDesiredContent={scrollToDesiredContent} sectionInView={sectionInView} />
    ))}
  </motion.ul>
);

const itemIds = [0, 1, 2, 3, 4, 5];
