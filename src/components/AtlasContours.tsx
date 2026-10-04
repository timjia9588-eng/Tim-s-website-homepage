import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";

/** Compositor-only geographic drift; stops off-screen and never moves reading text or hit targets. */
export default function AtlasContours() {
  const reduced = useReducedMotion();
  const field = useRef<HTMLDivElement>(null);
  const visible = useInView(field);
  return (
    <div ref={field} className="atlas-contour-field" aria-hidden="true">
      <motion.div
        className="atlas-contour-drift"
        animate={
          visible && !reduced
            ? { x: [0, 12, 0], y: [0, -8, 0] }
            : { x: 0, y: 0 }
        }
        transition={{
          duration: 24,
          repeat: visible && !reduced ? Infinity : 0,
          ease: "easeInOut",
        }}
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
    </div>
  );
}
