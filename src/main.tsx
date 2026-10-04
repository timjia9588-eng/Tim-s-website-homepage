import React from "react";
import ReactDOM from "react-dom/client";
import { MotionConfig } from "framer-motion";
import App from "./App";
import { contentTransition } from "./motion";
import "lenis/dist/lenis.css";
import "./styles.css";
import "./narrative.css";
import "./experience.css";
import "./journey.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MotionConfig reducedMotion="user" transition={contentTransition}>
      <App />
    </MotionConfig>
  </React.StrictMode>,
);
