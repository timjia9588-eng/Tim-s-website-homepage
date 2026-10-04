import { useEffect, useRef, useState, type ReactNode } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { geoEquirectangular, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import { cancelFrame, frame, useReducedMotion } from "framer-motion";
import { atlasPlaces as places } from "../data/atlas-tour";
import { scrollEase } from "../motion";

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
  spotlight,
  settled,
  enabled,
  onArrive,
  onTourAvailable,
}: {
  selected: string;
  onSelect: (id: string) => void;
  spotlight: ReactNode;
  settled: boolean;
  enabled: boolean;
  onArrive: (id: string) => void;
  onTourAvailable: (available: boolean) => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  const markers = useRef(new Map<string, HTMLButtonElement>());
  const callout = useRef<HTMLDivElement>(null);
  const callbacks = useRef({ onArrive, onTourAvailable });
  callbacks.current = { onArrive, onTourAvailable };
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;
  const selection = useRef(selected);
  selection.current = selected;
  const target = useRef<{ id: string; goal: THREE.Vector3 } | null>(null);
  const pausedRef = useRef(false);
  const [failed, setFailed] = useState(false);
  const reduced = useReducedMotion();
  pausedRef.current = Boolean(reduced);
  useEffect(() => {
    const p = places.find((place) => place.id === selected);
    if (p) target.current = { id: p.id, goal: spherePoint(p.lat, p.lon, 1) };
  }, [selected]);

  useEffect(() => {
    const host = container.current!;
    if (!host) return;
    const pageContent = document.getElementById("page-content");
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
      spherePoint(28, -88, 7.8 * Math.max(1, 0.95 / camera.aspect)),
    );
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.domElement.setAttribute("aria-hidden", "true");
    host.prepend(renderer.domElement);
    const globe = new THREE.Group();
    scene.add(globe);
    const surface = new THREE.Mesh(
      new THREE.SphereGeometry(2.48, 48, 32),
      new THREE.MeshPhongMaterial({
        color: 0x152b22,
        emissive: 0x07140e,
        specular: 0x29443c,
        shininess: 24,
      }),
    );
    globe.add(surface);
    scene.add(new THREE.AmbientLight(0xcbd6c7, 1.4));
    const light = new THREE.DirectionalLight(0xe2f1df, 2.3);
    light.position.set(-4, 3, 6);
    scene.add(light);
    globe.add(
      new THREE.Mesh(
        new THREE.SphereGeometry(2.55, 64, 48),
        new THREE.ShaderMaterial({
          vertexShader: `varying vec3 vNormal; varying vec3 vView; void main(){ vec4 p=modelViewMatrix*vec4(position,1.0); vNormal=normalize(normalMatrix*normal); vView=-p.xyz; gl_Position=projectionMatrix*p; }`,
          fragmentShader: `varying vec3 vNormal; varying vec3 vView; void main(){ float rim=pow(1.0-abs(dot(normalize(vNormal),normalize(vView))),3.0); gl_FragColor=vec4(0.58,0.73,0.63,rim*0.32); }`,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        }),
      ),
    );
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.055;
    controls.enablePan = false;
    // Page scrolling owns the wheel and vertical touch gestures; horizontal dragging rotates the atlas.
    controls.enableZoom = false;
    renderer.domElement.style.touchAction = "pan-y";
    controls.minDistance = 6.3;
    controls.maxDistance = 23;
    controls.autoRotateSpeed = 0.16;
    controls.rotateSpeed = 0.65;
    const dots = places.map((p) => {
      const position = spherePoint(p.lat, p.lon, 2.535);
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.026, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xe4e3df }),
      );
      mesh.position.copy(position);
      globe.add(mesh);
      return { id: p.id, position, mesh };
    });
    const locatorMaterial = new THREE.MeshBasicMaterial({
      color: 0xd8e3bf,
      transparent: true,
      opacity: 0.3,
      depthWrite: false,
    });
    const locator = new THREE.Mesh(
      new THREE.RingGeometry(0.075, 0.082, 48),
      locatorMaterial,
    );
    globe.add(locator);
    let cancelled = false,
      lastTime = 0,
      inView = true;
    let width = host.clientWidth,
      height = host.clientHeight;
    let compact = window.matchMedia("(max-width: 700px)").matches;
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
              color: 0xc4d3b6,
              size: 0.017,
              transparent: true,
              opacity: 0.8,
              sizeAttenuation: true,
            }),
          ),
        );
        const coast: number[] = [];
        type LandGeometry = {
          type: string;
          coordinates: number[][][] | number[][][][];
        };
        const geoLand = land as unknown as {
          type: string;
          geometry?: LandGeometry;
          features?: { geometry: LandGeometry }[];
        };
        const landGeometries =
          geoLand.type === "FeatureCollection"
            ? geoLand.features!.map((f) => f.geometry)
            : geoLand.geometry
              ? [geoLand.geometry]
              : [];
        for (const landGeometry of landGeometries)
          if (
            landGeometry.type === "MultiPolygon" ||
            landGeometry.type === "Polygon"
          ) {
            const polygons: number[][][][] =
              landGeometry.type === "MultiPolygon"
                ? (landGeometry.coordinates as number[][][][])
                : [landGeometry.coordinates as number[][][]];
            for (const polygon of polygons)
              for (const ring of polygon)
                for (let i = 1; i < ring.length; i++) {
                  const a = spherePoint(ring[i - 1][1], ring[i - 1][0], 2.516),
                    b = spherePoint(ring[i][1], ring[i][0], 2.516);
                  coast.push(a.x, a.y, a.z, b.x, b.y, b.z);
                }
          }
        if (coast.length) {
          const outline = new THREE.BufferGeometry();
          outline.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(coast, 3),
          );
          globe.add(
            new THREE.LineSegments(
              outline,
              new THREE.LineBasicMaterial({
                color: 0x94b399,
                transparent: true,
                opacity: 0.2,
              }),
            ),
          );
        }
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
      width = host.clientWidth;
      height = host.clientHeight;
      compact = window.matchMedia("(max-width: 700px)").matches;
      if (!width || !height) return;
      camera.aspect = width / height;
      const distance = 7.8 * Math.max(1, 0.95 / camera.aspect);
      camera.position.normalize().multiplyScalar(distance);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
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
      const next = Boolean(
        (event.target as HTMLElement).closest(".globe-marker, .globe-callout"),
      );
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
    const direction = new THREE.Vector3();
    let lastAvailable: boolean | undefined;
    let flight: {
      request: NonNullable<typeof target.current>;
      start: THREE.Vector3;
      turn: THREE.Quaternion;
      elapsed: number;
    } | null = null;
    const turn = new THREE.Quaternion();
    const identity = new THREE.Quaternion();
    function animate({ timestamp: time }: { timestamp: number }) {
      const available =
        inView &&
        !document.hidden &&
        enabledRef.current &&
        !host.closest("[inert]") &&
        !pausedRef.current &&
        !hovering &&
        !focused &&
        !dragging &&
        time > resumeAt;
      if (lastAvailable !== available) {
        lastAvailable = available;
        callbacks.current.onTourAvailable(available);
      }
      if (!inView || document.hidden || pageContent?.inert) {
        if (host.dataset.rotation !== "paused")
          host.dataset.rotation = "paused";
        lastTime = time;
        return;
      }
      const dt = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;
      if (target.current) {
        const distance = camera.position.length();
        if (flight?.request !== target.current) {
          const start = camera.position.clone().normalize();
          flight = {
            request: target.current,
            start,
            turn: new THREE.Quaternion().setFromUnitVectors(
              start,
              target.current.goal,
            ),
            elapsed: 0,
          };
          // Clear residual orbit damping once before a guided camera move.
          controls.autoRotate = false;
          controls.enableDamping = false;
          controls.update(0);
        }
        flight.elapsed += dt;
        const fraction = pausedRef.current
          ? 1
          : Math.min(1, flight.elapsed / 2.4);
        turn.copy(identity).slerp(flight.turn, scrollEase(fraction));
        camera.position
          .copy(flight.start)
          .applyQuaternion(turn)
          .multiplyScalar(distance);
        if (fraction === 1) {
          const arrived = target.current.id;
          target.current = null;
          flight = null;
          controls.enableDamping = true;
          callbacks.current.onArrive(arrived);
        }
      } else if (flight) {
        flight = null;
        controls.enableDamping = true;
      }
      controls.autoRotate = available && !target.current && !dragging;
      const rotation = controls.autoRotate ? "running" : "paused";
      if (host.dataset.rotation !== rotation) host.dataset.rotation = rotation;
      controls.update(dt);
      camera.updateMatrixWorld();
      normal.copy(camera.position).normalize();
      const selectedDot = dots.find((dot) => dot.id === selection.current);
      if (selectedDot) {
        locator.position.copy(selectedDot.position).multiplyScalar(1.003);
        locator.lookAt(direction.copy(selectedDot.position).multiplyScalar(2));
        locator.scale.setScalar(
          pausedRef.current ? 1 : 1.15 + Math.sin(time * 0.0014) * 0.18,
        );
        locatorMaterial.opacity = pausedRef.current
          ? 0.35
          : 0.28 + Math.sin(time * 0.0014) * 0.1;
      }
      for (const dot of dots) {
        dot.mesh.scale.setScalar(dot.id === selection.current ? 1.8 : 1);
        const button = markers.current.get(dot.id);
        if (!button) continue;
        const facing =
          direction.copy(dot.position).normalize().dot(normal) > 0.14;
        projected.copy(dot.position).project(camera);
        const x = (projected.x * 0.5 + 0.5) * width,
          y = (-projected.y * 0.5 + 0.5) * height;
        button.hidden = !facing || x < 0 || x > width || y < 0 || y > height;
        if (button.hidden) continue;
        // Transparent 44px targets align with the visible geographic points.
        // No text boxes or per-frame layout measurements are needed.
        button.style.transform = `translate3d(${(x - 22).toFixed(2)}px,${(y - 22).toFixed(2)}px,0)`;
        if (
          dot.id === selection.current &&
          callout.current &&
          !target.current
        ) {
          const cardWidth = compact ? Math.min(260, width - 40) : 318;
          const cardX = compact
            ? Math.max(20, Math.min(width - cardWidth - 20, x - cardWidth / 2))
            : Math.max(24, Math.min(width - cardWidth - 24, x + 48));
          const cardY = compact
            ? Math.max(20, Math.min(height - 236, y + 28))
            : Math.max(24, Math.min(height - 270, y - 128));
          callout.current.style.transform = `translate3d(${cardX.toFixed(2)}px,${cardY.toFixed(2)}px,0)`;
          callout.current.hidden = button.hidden;
        }
      }
      if (
        selectedDot &&
        callout.current &&
        !target.current &&
        markers.current.get(selectedDot.id)?.hidden
      )
        callout.current.hidden = true;
      renderer.render(scene, camera);
    }
    const visibility = () => {
      if (document.hidden) {
        lastAvailable = false;
        callbacks.current.onTourAvailable(false);
      }
    };
    document.addEventListener("visibilitychange", visibility);
    frame.update(animate, true);
    return () => {
      cancelled = true;
      abort.abort();
      cancelFrame(animate);
      resize.disconnect();
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
      host.removeEventListener("focusin", focusIn);
      host.removeEventListener("focusout", focusOut);
      controls.dispose();
      scene.traverse((object) => {
        if (
          object instanceof THREE.Mesh ||
          object instanceof THREE.Points ||
          object instanceof THREE.Line
        ) {
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
      aria-label="Interactive globe of Tim Jia’s projects and research"
    >
      {failed ? (
        <div className="globe-fallback">
          The globe is unavailable on this device.{" "}
          <a href="#work">Browse the projects below.</a>
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
              <span className="sr-only">{place.label}</span>
            </button>
          ))}
          <div ref={callout} className="globe-callout" hidden inert={!settled}>
            {spotlight}
          </div>
        </>
      )}
    </div>
  );
}
