import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  as?: "div" | "section" | "li";
}

export function Reveal({ children, delay = 0, y = 24, as = "div" }: RevealProps) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;
  const Comp = motion[as];
  return (
    <Comp
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, ease: "easeOut", delay }}
    >
      {children}
    </Comp>
  );
}
