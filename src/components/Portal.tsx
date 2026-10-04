import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { places } from "../data/projects";
import { atlasSpotlight, atlasTour } from "../data/atlas-tour";
import AtlasContours from "./AtlasContours";
import { easyEase, scrollEase } from "../motion";
const Globe = lazy(() => import("./Globe"));

export default function Portal() {
  const [tourIndex, setTourIndex] = useState(0);
  const [selected, setSelected] = useState(atlasTour[0].place);
  const [arrived, setArrived] = useState<string | null>(null);
  const [available, setAvailable] = useState(false);
  const [imageState, setImageState] = useState<{
    src: string;
    loaded: boolean;
  } | null>(null);
  const reduced = useReducedMotion();
  const [wide, setWide] = useState(
    () => window.matchMedia("(min-width: 701px)").matches,
  );
  const [phase, setPhase] = useState("opening");
  const phaseRef = useRef("opening");
  const pinned = wide && !reduced;
  const tourEnabled = !pinned || phase === "opening";
  useEffect(() => {
    const media = window.matchMedia("(min-width: 701px)");
    const update = () => setWide(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  const section = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start start", "end end"],
  });
  const progress = useTransform(() => scrollYProgress.get());
  const globeY = useTransform(progress, [0, 0.18, 1], [0, 0, -120], {
    ease: scrollEase,
  });
  const globeScale = useTransform(progress, [0, 0.18, 1], [1, 1, 0.68], {
    ease: scrollEase,
  });
  const globeOpacity = useTransform(
    progress,
    [0, 0.3, 0.82, 1],
    [1, 1, 0.12, 0],
  );
  const background = useTransform(
    progress,
    [0, 0.3, 0.72, 1],
    ["#18382b", "#18382b", "#bbc8b7", "#f7f6f2"],
  );
  const atmosphereOpacity = useTransform(progress, [0, 0.3, 0.9], [1, 1, 0], {
    ease: scrollEase,
  });
  const calloutOpacity = useTransform(progress, [0, 0.12, 0.42], [1, 1, 0], {
    ease: scrollEase,
  });
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = value < 0.42 ? "opening" : "handoff";
    if (next !== phaseRef.current) {
      phaseRef.current = next;
      setPhase(next);
    }
  });
  const choosePlace = useCallback(
    (id: string) => {
      if (id !== selected) setArrived(null);
      setSelected(id);
      const index = atlasTour.findIndex((stop) => stop.place === id);
      if (index !== -1) setTourIndex(index);
    },
    [selected],
  );
  const place = places.find((place) => place.id === selected)!;
  const work = atlasSpotlight(selected, atlasTour[tourIndex]);
  const ready = !work.src || imageState?.src === work.src;
  const showImage = Boolean(work.src && ready && imageState?.loaded);
  // A held image and a guided camera move are one tour stop. Pointer/focus, a dialog,
  // the scroll hand-off and hidden tabs suspend it; no per-frame React updates.
  useEffect(() => {
    if (!available || arrived !== selected || !ready || reduced || !tourEnabled)
      return;
    const timer = window.setTimeout(() => {
      const next = (tourIndex + 1) % atlasTour.length;
      setArrived(null);
      setTourIndex(next);
      setSelected(atlasTour[next].place);
    }, 5200);
    return () => window.clearTimeout(timer);
  }, [available, arrived, selected, ready, tourIndex, reduced, tourEnabled]);
  useEffect(() => {
    if (!work.src) return;
    const src = work.src;
    let active = true;
    const image = new Image();
    image.src = src.replace(".webp", "-small.webp");
    image
      .decode()
      .then(() => {
        if (active) setImageState({ src, loaded: true });
      })
      .catch(() => {
        if (active) setImageState({ src, loaded: false });
      });
    return () => {
      active = false;
    };
  }, [work.src]);
  const spotlight = (
    <motion.div style={{ opacity: pinned ? calloutOpacity : 1 }}>
      <AnimatePresence mode="wait">
        {arrived === selected && ready && (
          <motion.a
            key={`${selected}/${work.href}`}
            className={`atlas-callout-link ${showImage ? "" : "atlas-callout-link--record"}`}
            href={work.href}
            aria-label={`${work.title} · ${place.label}`}
            data-image-fit={work.fit}
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{
              opacity: 0,
              y: reduced ? 0 : -6,
              transition: { duration: reduced ? 0 : 0.45, ease: easyEase },
            }}
            transition={{ duration: reduced ? 0 : 1, ease: easyEase }}
          >
            <span className="atlas-callout-place">
              {place.label}
              {work.context.startsWith("Research") ? " · Research" : ""}
            </span>
            {showImage && work.src && (
              <img
                src={work.src.replace(".webp", "-small.webp")}
                alt={work.alt}
                decoding="async"
              />
            )}
            <span className="atlas-callout-title">{work.title}</span>
            {!showImage && (
              <span className="atlas-callout-context">{work.context}</span>
            )}
          </motion.a>
        )}
      </AnimatePresence>
    </motion.div>
  );
  return (
    <section
      ref={section}
      id="globe"
      className="globe-portal atlas-portal atlas-portal--tour"
      aria-label="An atlas of design and inquiry"
      data-phase={pinned ? phase : "opening"}
      data-pinned={pinned}
      data-tour-place={selected}
    >
      <h1 className="sr-only">
        Tim Jia — Landscape design and research across places
      </h1>
      <motion.div
        className="atlas-scene"
        style={{ backgroundColor: pinned ? background : "#18382b" }}
      >
        <motion.div
          className="atlas-atmosphere"
          aria-hidden="true"
          style={{ opacity: pinned ? atmosphereOpacity : 1 }}
        />
        <AtlasContours />
        <motion.div
          className="atlas-globe"
          style={
            pinned
              ? { y: globeY, scale: globeScale, opacity: globeOpacity }
              : undefined
          }
          inert={pinned && phase !== "opening"}
        >
          <Suspense
            fallback={
              <div className="globe-loading">Bringing the world into view…</div>
            }
          >
            <Globe
              selected={selected}
              onSelect={choosePlace}
              spotlight={spotlight}
              settled={arrived === selected && ready}
              enabled={tourEnabled}
              onArrive={setArrived}
              onTourAvailable={setAvailable}
            />
          </Suspense>
        </motion.div>
      </motion.div>
    </section>
  );
}
