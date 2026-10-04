// Shared timing: enter slowly, travel smoothly, and settle before reading.
import { cubicBezier } from "framer-motion";
export const easyEase: [number, number, number, number] = [0.65, 0, 0.35, 1];
export const scrollEase = cubicBezier(...easyEase);
export const contentTransition = { duration: 0.95, ease: easyEase };
export const revealTransition = { duration: 1.05, ease: easyEase };
