import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { geoEquirectangular, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import { useReducedMotion } from "framer-motion";
import { places } from "../data/projects";
import type { Theme } from "../types";

const spherePoint = (lat: number, lon: number, radius: number) => {
  const a = (lat * Math.PI) / 180,
    b = (lon * Math.PI) / 180;
  return new THREE.Vector3(
    radius * Math.cos(a) * Math.sin(b),
    radius * Math.sin(a),
    radius * Math.cos(a) * Math.cos(b),
  );
};

export default function Globe({
  selected,
  onSelect,
  theme,
}: {
  selected: string;
  onSelect: (id: string) => void;
  theme: Theme | null;
}) {
  const container = useRef<HTMLDivElement>(null);
  const markers = useRef(new Map<string, HTMLButtonElement>());
  const selection = useRef(selected);
  selection.current = selected;
  const target = useRef<THREE.Vector3 | null>(null);
  const pausedRef = useRef(false);
  const themeRef = useRef(theme);
  themeRef.current = theme;
  const [failed, setFailed] = useState(false);
  const reduced = useReducedMotion();
  pausedRef.current = Boolean(reduced);
  useEffect(() => {
    const p = places.find((place) => place.id === selected);
    if (p) target.current = spherePoint(p.lat, p.lon, 1);
  }, [selected]);

  useEffect(() => {
    const host = container.current!;
    if (!host) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setFailed(true);
      return;
    }
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      40,
      host.clientWidth / host.clientHeight,
      0.1,
      100,
    );
    camera.position.copy(
      spherePoint(25, 65, 8 * Math.max(1, 0.95 / camera.aspect)),
    );
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.domElement.setAttribute("aria-hidden", "true");
    host.prepend(renderer.domElement);
    const globe = new THREE.Group();
    scene.add(globe);
    const surface = new THREE.Mesh(
      new THREE.SphereGeometry(2.48, 48, 32),
      new THREE.MeshBasicMaterial({ color: 0x202020 }),
    );
    globe.add(surface);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.055;
    controls.enablePan = false;
    controls.minDistance = 6.3;
    controls.maxDistance = 23;
    controls.autoRotateSpeed = 0.28;
    controls.rotateSpeed = 0.65;
    controls.zoomSpeed = 0.55;
    const dots = places.map((p) => {
      const position = spherePoint(p.lat, p.lon, 2.535);
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.026, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xe4e3df }),
      );
      mesh.position.copy(position);
      globe.add(mesh);
      return { id: p.id, position, mesh, themes: p.themes };
    });
    let cancelled = false,
      frame = 0,
      lastTime = 0,
      inView = true;
    const abort = new AbortController();
    async function addLand() {
      try {
        const response = await fetch("/data/world-land.json", {
          signal: abort.signal,
        });
        if (!response.ok) throw new Error("Map unavailable");
        const world = await response.json();
        if (cancelled) return;
        const land = feature(world, world.objects.land);
        const canvas = document.createElement("canvas");
        canvas.width = 1440;
        canvas.height = 720;
        const context = canvas.getContext("2d", { willReadFrequently: true });
        if (!context) return;
        context.fillStyle = "#000";
        context.fillRect(0, 0, canvas.width, canvas.height);
        const projection = geoEquirectangular()
          .translate([720, 360])
          .scale(1440 / (2 * Math.PI));
        context.beginPath();
        geoPath(projection, context)(land);
        context.fillStyle = "#fff";
        context.fill();
        const pixels = context.getImageData(0, 0, 1440, 720).data;
        const positions: number[] = [];
        for (let lat = -84; lat <= 84; lat += 0.65) {
          const step = 0.65 / Math.max(0.2, Math.cos((lat * Math.PI) / 180));
          for (let lon = -180; lon < 180; lon += step) {
            const xy = projection([lon, lat]);
            if (!xy) continue;
            const index = (Math.floor(xy[1]) * 1440 + Math.floor(xy[0])) * 4;
            if (pixels[index] > 128) {
              const v = spherePoint(lat, lon, 2.51);
              positions.push(v.x, v.y, v.z);
            }
          }
        }
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute(
          "position",
          new THREE.Float32BufferAttribute(positions, 3),
        );
        globe.add(
          new THREE.Points(
            geometry,
            new THREE.PointsMaterial({
              color: 0xaaaaa6,
              size: 0.011,
              transparent: true,
              opacity: 0.62,
              sizeAttenuation: true,
            }),
          ),
        );
      } catch (error) {
        if (
          !cancelled &&
          !(error instanceof DOMException && error.name === "AbortError")
        )
          setFailed(true);
      }
    }
    addLand();
    const resize = new ResizeObserver(() => {
      if (!host.clientWidth || !host.clientHeight) return;
      camera.aspect = host.clientWidth / host.clientHeight;
      const distance = 8 * Math.max(1, 0.95 / camera.aspect);
      camera.position.normalize().multiplyScalar(distance);
      camera.updateProjectionMatrix();
      renderer.setSize(host.clientWidth, host.clientHeight);
    });
    resize.observe(host);
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
      },
      { threshold: 0.05 },
    );
    observer.observe(host);
    let hovering = false,
      focused = false,
      dragging = false,
      resumeAt = 0;
    const move = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      const radius =
        ((2.5 / Math.sqrt(camera.position.lengthSq() - 6.25)) * rect.height) /
        (2 * Math.tan((20 * Math.PI) / 180));
      const next = x * x + y * y < radius * radius;
      if (hovering && !next) resumeAt = performance.now() + 2400;
      hovering = next;
    };
    const leave = () => {
      hovering = false;
      resumeAt = performance.now() + 2400;
    };
    const focusIn = (e: FocusEvent) => {
      focused = (e.target as HTMLElement).matches(":focus-visible");
    };
    const focusOut = (e: FocusEvent) => {
      if (!host.contains(e.relatedTarget as Node)) {
        focused = false;
        resumeAt = performance.now() + 2400;
      }
    };
    host.addEventListener("pointermove", move);
    host.addEventListener("pointerleave", leave);
    host.addEventListener("focusin", focusIn);
    host.addEventListener("focusout", focusOut);
    controls.addEventListener("start", () => {
      target.current = null;
      dragging = true;
    });
    controls.addEventListener("end", () => {
      dragging = false;
      resumeAt = performance.now() + 2400;
    });
    const projected = new THREE.Vector3(),
      normal = new THREE.Vector3();
    const offsets: Record<string, [number, number]> = {
      cambridge: [10, -30],
      ithaca: [10, -8],
      boston: [10, 18],
      melissa: [10, -30],
      kyle: [10, 0],
      "san-antonio": [10, 28],
      "new-orleans": [10, 12],
      aspen: [10, -14],
      beijing: [10, -16],
      guangzhou: [10, 20],
      nepal: [10, -14],
    };
    function animate(time: number) {
      frame = requestAnimationFrame(animate);
      if (!inView || document.hidden) {
        lastTime = time;
        return;
      }
      const dt = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;
      if (target.current) {
        const distance = camera.position.length();
        camera.position
          .normalize()
          .lerp(target.current, 1 - Math.exp(-dt * 4))
          .normalize()
          .multiplyScalar(distance);
        if (
          camera.position.clone().normalize().distanceTo(target.current) < 0.005
        )
          target.current = null;
      }
      controls.autoRotate =
        !pausedRef.current &&
        !target.current &&
        !hovering &&
        !focused &&
        !dragging &&
        time > resumeAt;
      host.dataset.rotation = controls.autoRotate ? "running" : "paused";
      controls.update(dt);
      camera.updateMatrixWorld();
      normal.copy(camera.position).normalize();
      const occupied: {
        left: number;
        top: number;
        width: number;
        height: number;
      }[] = [];
      const orderedDots = [...dots].sort(
        (a, b) =>
          Number(b.id === selection.current) -
          Number(a.id === selection.current),
      );
      for (const dot of orderedDots) {
        dot.mesh.scale.setScalar(dot.id === selection.current ? 1.8 : 1);
        const relevant =
          !themeRef.current || dot.themes.includes(themeRef.current);
        (dot.mesh.material as THREE.MeshBasicMaterial).color.setHex(
          relevant ? 0xe4e3df : 0x63635f,
        );
        const button = markers.current.get(dot.id);
        if (!button) continue;
        const facing = dot.position.clone().normalize().dot(normal) > 0.14;
        projected.copy(dot.position).project(camera);
        const x = (projected.x * 0.5 + 0.5) * host.clientWidth,
          y = (-projected.y * 0.5 + 0.5) * host.clientHeight;
        const [ox, oy] = offsets[dot.id] || [10, -10];
        button.hidden =
          !facing ||
          x < 0 ||
          x > host.clientWidth ||
          y < 0 ||
          y > host.clientHeight;
        if (button.hidden) continue;
        button.style.opacity = relevant ? "1" : ".3";
        const width = button.offsetWidth,
          height = button.offsetHeight;
        const left = Math.max(
          6,
          Math.min(host.clientWidth - width - 6, x + ox),
        );
        let top = Math.max(
          6,
          Math.min(host.clientHeight - height - 45, y + oy),
        );
        for (let attempt = 0; attempt < 10; attempt++) {
          const collision = occupied.find(
            (rect) =>
              left < rect.left + rect.width + 5 &&
              left + width + 5 > rect.left &&
              top < rect.top + rect.height + 5 &&
              top + height + 5 > rect.top,
          );
          if (!collision) break;
          top = collision.top + collision.height + 5;
        }
        if (
          top + height > host.clientHeight - 40 ||
          (top - (y + oy) > 55 && dot.id !== selection.current)
        ) {
          button.hidden = true;
          continue;
        }
        occupied.push({ left, top, width, height });
        button.style.left = `${left}px`;
        button.style.top = `${top}px`;
      }
      renderer.render(scene, camera);
    }
    frame = requestAnimationFrame(animate);
    return () => {
      cancelled = true;
      abort.abort();
      cancelAnimationFrame(frame);
      resize.disconnect();
      observer.disconnect();
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
      host.removeEventListener("focusin", focusIn);
      host.removeEventListener("focusout", focusOut);
      controls.dispose();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material)
            ? object.material
            : [object.material];
          materials.forEach((m) => m.dispose());
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);
  return (
    <div
      ref={container}
      className="globe-surface"
      aria-label="Interactive globe of Tim Jia’s education and professional experience"
    >
      {failed ? (
        <div className="globe-fallback">
          The globe is unavailable on this device. Explore every place using the
          Places menu.
        </div>
      ) : (
        <>
          {places.map((place) => (
            <button
              key={place.id}
              ref={(node) => {
                if (node) markers.current.set(place.id, node);
                else markers.current.delete(place.id);
              }}
              hidden
              className={`globe-marker ${selected === place.id ? "active" : ""}`}
              onClick={() => onSelect(place.id)}
              aria-pressed={selected === place.id}
            >
              {place.label}
            </button>
          ))}
        </>
      )}
    </div>
  );
}
