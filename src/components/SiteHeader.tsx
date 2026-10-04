import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function SiteHeader() {
  const [menu, setMenu] = useState(false);
  const [hash, setHash] = useState(window.location.hash);
  const [section, setSection] = useState("");
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const readingLine = Math.min(180, window.innerHeight * 0.25);
      const current = ["globe", "work", "research", "about"].find((id) => {
        const element = document.getElementById(id);
        if (!element) return false;
        const bounds = element.getBoundingClientRect();
        return bounds.top <= readingLine && bounds.bottom > readingLine;
      });
      setSection(current ? `#${current}` : "");
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
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
    { label: "Explore the globe", href: "#globe" },
  ];
  return (
    <header className="site-header">
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
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
