import * as React from "react";
import { motion, SVGMotionProps } from "framer-motion";

interface PathProps extends SVGMotionProps<SVGPathElement> {
  variants: {
    closed: { d?: string; opacity?: number; stroke: string; transition?: { duration: number, delay?: number } };
    open: { d?: string; opacity?: number; stroke: string; transition?: { duration: number, delay?: number } };
  };
  transition?: {
    duration?: number;
  };
}

const Path: React.FC<PathProps> = ({ variants, transition, ...props }) => (
  <motion.path
    fill="transparent"
    strokeWidth="3"
    strokeLinecap="round"
    variants={variants}
    transition={transition}
    {...props}
  />
);

export default Path;
