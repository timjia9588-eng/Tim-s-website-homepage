import { useRef, type ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

// A little depth follows the reader's scroll; the content keeps its full layout.
export default function ScrollScene({
  children,
  className,
  expand = false,
}: {
  children: ReactNode;
  className?: string;
  expand?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 32,
    mass: 0.4,
  });
  const y = useTransform(progress, [0, 0.4, 1], [32, 0, -24]);
  const scale = useTransform(progress, [0, 0.4, 1], [0.96, 1, 1]);
  return (
    <motion.div
      ref={ref}
      className={className}
      style={reduced ? undefined : { y, scale: expand ? scale : 1 }}
    >
      {children}
    </motion.div>
  );
}
