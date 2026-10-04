import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";

export default function SiteHeader({
  continuous = false,
}: {
  continuous?: boolean;
}) {
  const [menu, setMenu] = useState(false);
  const [hash, setHash] = useState(window.location.hash);
  const [section, setSection] = useState("");
  const [atlas, setAtlas] = useState(continuous);
  const boundary = useRef(Infinity);
  const atlasRef = useRef(continuous);
  const { scrollY, scrollYProgress } = useScroll();
  useMotionValueEvent(scrollY, "change", (value) => {
    if (!continuous) return;
    const next = value < boundary.current;
    if (next !== atlasRef.current) {
      atlasRef.current = next;
      setAtlas(next);
    }
  });
  useEffect(() => {
    const portal = document.getElementById("globe");
    const resize = new ResizeObserver(() => {
      boundary.current = portal
        ? portal.dataset.pinned === "true"
          ? (portal.offsetHeight - window.innerHeight) * 0.82
          : portal.offsetHeight - 130
        : 0;
      const next = continuous && window.scrollY < boundary.current;
      atlasRef.current = next;
      setAtlas(next);
    });
    if (portal) resize.observe(portal);
    let observer: IntersectionObserver;
    const observeSections = () => {
      observer?.disconnect();
      const line = Math.min(130, window.innerHeight * 0.16);
      // IO percentages use root width, even for vertical margins; use viewport pixels for a stable reading line.
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) setSection(`#${entry.target.id}`);
          }
        },
        {
          rootMargin: `-${line}px 0px -${Math.max(0, window.innerHeight - line - 2)}px 0px`,
          threshold: 0,
        },
      );
      ["globe", "top", "work", "research", "about"].forEach((id) => {
        const element = document.getElementById(id);
        if (element) observer.observe(element);
      });
    };
    observeSections();
    window.addEventListener("resize", observeSections, { passive: true });
    return () => {
      resize.disconnect();
      observer.disconnect();
      window.removeEventListener("resize", observeSections);
    };
  }, [continuous]);
  useEffect(() => {
    const close = () => {
      setMenu(false);
      setHash(window.location.hash);
    };
    window.addEventListener("hashchange", close);
    return () => window.removeEventListener("hashchange", close);
  }, []);
  const links = [
    { label: "All work", href: "#work" },
    { label: "Research", href: "#research" },
    { label: "About", href: "#about" },
  ];
  return (
    <header
      className={`site-header ${continuous ? "site-header--continuous" : ""} ${atlas ? "is-atlas" : ""}`}
    >
      {continuous && (
        <motion.div
          className="journey-progress"
          aria-hidden="true"
          style={{ scaleX: scrollYProgress }}
        />
      )}
      <nav
        className="nav-inner"
        aria-label="Main navigation"
        onClick={(event) => {
          if ((event.target as HTMLElement).closest("a")) setMenu(false);
        }}
      >
        <a className="wordmark" href="#globe" aria-label="Tim Jia home">
          tim jia<span className="wordmark-period">.</span>
        </a>
        <div className="desktop-links">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              aria-current={section === l.href ? "location" : undefined}
            >
              {l.label}
            </a>
          ))}
        </div>
        <div className="nav-utilities">
          <a
            className="nav-globe"
            href="#globe"
            aria-label="Explore the globe"
            aria-current={section === "#globe" ? "location" : undefined}
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <ellipse cx="12" cy="12" rx="4" ry="9" />
              <path d="M3 12h18M5 6.5c4 2 10 2 14 0M5 17.5c4-2 10-2 14 0" />
            </svg>
          </a>
          <a
            className="nav-resume"
            href="#resume"
            target={hash === "#resume" ? undefined : "_blank"}
            rel="noreferrer"
            aria-label={
              hash === "#resume" ? "Resume" : "Resume (opens in a new tab)"
            }
            aria-current={hash === "#resume" ? "page" : undefined}
          >
            Resume ↗
          </a>
        </div>
        <button
          className="menu-toggle"
          onClick={() => setMenu((v) => !v)}
          aria-expanded={menu}
          aria-controls="mobile-menu"
          aria-label={menu ? "Close menu" : "Open menu"}
        >
          <span />
          <span />
        </button>
      </nav>
      <AnimatePresence>
        {menu && (
          <motion.nav
            id="mobile-menu"
            className="mobile-menu"
            aria-label="Mobile navigation"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            {links.map((l) => (
              <a key={l.label} href={l.href} onClick={() => setMenu(false)}>
                {l.label}
              </a>
            ))}
            <a href="#globe" onClick={() => setMenu(false)}>
              Explore the globe
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
