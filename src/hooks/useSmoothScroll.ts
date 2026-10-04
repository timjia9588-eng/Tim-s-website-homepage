import { useEffect, useLayoutEffect } from "react";
import Lenis from "lenis";
import { cancelFrame, frame } from "framer-motion";

let scroller: Lenis | null = null;
let locked = false;

export function setScrollLocked(next: boolean) {
  locked = next;
  if (next) scroller?.stop();
  else scroller?.start();
}

export function scrollToPosition(top: number, immediate = false) {
  if (scroller) scroller.scrollTo(top, { immediate, force: immediate });
  else window.scrollTo({ top, behavior: immediate ? "instant" : "smooth" });
}

export function scrollToSection(id: string, immediate = false) {
  const element = document.getElementById(id);
  if (!element) return;
  const margin =
    parseFloat(getComputedStyle(element).scrollMarginTop) ||
    parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) ||
    0;
  scrollToPosition(
    window.scrollY + element.getBoundingClientRect().top - margin,
    immediate,
  );
}

export default function useSmoothScroll() {
  useLayoutEffect(() => {
    if (window.location.hash && window.location.hash !== "#globe") return;
    let active = true;
    let frame = 0;
    const reset = () => {
      if (active) scrollToPosition(0, true);
    };
    const cancel = () => {
      active = false;
    };
    const inputs = ["wheel", "touchstart", "pointerdown", "keydown"] as const;
    inputs.forEach((name) =>
      window.addEventListener(name, cancel, { passive: true, once: true }),
    );
    reset();
    // Load and font layout can happen after React's first paint. Do not reset once a visitor interacts.
    window.addEventListener("load", reset, { once: true });
    document.fonts.ready.then(() => {
      if (active) frame = requestAnimationFrame(reset);
    });
    return () => {
      active = false;
      cancelAnimationFrame(frame);
      window.removeEventListener("load", reset);
      inputs.forEach((name) => window.removeEventListener(name, cancel));
    };
  }, []);

  useEffect(() => {
    const instance = new Lenis({
      autoRaf: false,
      lerp: 0.085,
      syncTouch: false,
      respectReducedMotion: true,
      prevent: (node) =>
        node.hasAttribute("data-lenis-prevent") ||
        Boolean(node.closest("[data-dialog]")),
    });
    scroller = instance;
    if (locked) instance.stop();
    // One clock for scrolling, Motion values and WebGL; never add a second easing layer to scroll-linked values.
    const tick = ({ timestamp }: { timestamp: number }) =>
      instance.raf(timestamp);
    frame.read(tick, true);
    return () => {
      cancelFrame(tick);
      instance.destroy();
      if (scroller === instance) scroller = null;
    };
  }, []);
}
