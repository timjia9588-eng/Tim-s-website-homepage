import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { useEffect, useRef } from "react";

/** Quiet geographic flow behind the atlas. Pointer response never moves text or hit targets. */
export default function AtlasContours() {
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const dx = useSpring(x, { stiffness: 35, damping: 20 });
  const dy = useSpring(y, { stiffness: 35, damping: 20 });
  const field = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const section = field.current?.parentElement;
    if (!section || reduced) return;
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const bounds = section.getBoundingClientRect();
      x.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 18);
      y.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 14);
    };
    const leave = () => {
      x.set(0);
      y.set(0);
    };
    section.addEventListener("pointermove", move, { passive: true });
    section.addEventListener("pointerleave", leave);
    return () => {
      section.removeEventListener("pointermove", move);
      section.removeEventListener("pointerleave", leave);
    };
  }, [reduced, x, y]);
  return (
    <motion.div
      ref={field}
      className="atlas-contour-field"
      aria-hidden="true"
      style={reduced ? undefined : { x: dx, y: dy }}
    >
      <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
        <g className="atlas-contours">
          {[0, 1, 2, 3, 4, 5].map((line) => (
            <path
              key={line}
              d={`M -200 ${460 + line * 48} C 240 ${720 + line * 42}, 480 ${30 + line * 50}, 850 ${240 + line * 60} S 1460 ${900 + line * 42}, 1800 ${430 + line * 48}`}
            />
          ))}
          <path
            className="atlas-flow-line"
            d="M -200 620 C 240 890, 480 160, 850 420 S 1460 1050, 1800 610"
          />
        </g>
      </svg>
    </motion.div>
  );
}
