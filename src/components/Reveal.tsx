import { motion, useReducedMotion } from "framer-motion";
import { revealTransition } from "../motion";
import type { ReactNode } from "react";
export default function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -35px 0px" }}
      transition={{
        ...revealTransition,
        duration: reduced ? 0 : revealTransition.duration,
        delay: reduced ? 0 : delay,
      }}
    >
      {children}
    </motion.div>
  );
}
