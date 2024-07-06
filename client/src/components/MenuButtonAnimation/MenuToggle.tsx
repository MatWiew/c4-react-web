import * as React from "react";
import Path from "./Path";

interface MenuToggleProps {
  toggle: () => void;
  isOpen: boolean;
}

const MenuToggle: React.FC<MenuToggleProps> = ({ toggle, isOpen }) => (
  <button 
  onClick={toggle} 
  style={{ background: 'transparent', border: 'none', padding: 0 }}
  className="outline-none border-none select-none cursor-pointer absolute top-[18px] left-[15px] w-12 h-12 rounded-full bg-transparent"
  >
    <svg width="50" height="25" viewBox="0 0 23 23">
      <Path
        variants={{
          closed: { d: "M 2 2.5 L 20 2.5", stroke: "white", transition: { duration: 0.2, delay: 0.9 } },
          open: { d: "M 3 16.5 L 17 2.5", stroke: "black", transition: { duration: 0.2 } }
        }}
        animate={isOpen ? "open" : "closed"}
      />
      <Path
        d="M 2 9.423 L 20 9.423"
        variants={{
          closed: { opacity: 1, stroke: "white", transition: { duration: 0.1, delay: 0.9 } },
          open: { opacity: 0, stroke: "black", transition: { duration: 0.1 } }
        }}
        animate={isOpen ? "open" : "closed"}
      />
      <Path
        variants={{
          closed: { d: "M 2 16.346 L 20 16.346", stroke: "white", transition: { duration: 0.2, delay: 0.9 } },
          open: { d: "M 3 2.5 L 17 16.346", stroke: "black", transition: { duration: 0.2 } }
        }}
        animate={isOpen ? "open" : "closed"}
      />
    </svg>
  </button>
);

export default MenuToggle;
