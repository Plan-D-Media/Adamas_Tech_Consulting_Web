import type * as THREE_NS from "three";

/**
 * The three.js scene behind the homepage's "One connected delivery ecosystem" orb: a glass icosahedral lattice
 * with glowing struts and nodes, on the design's blue radial-gradient circle.
 *
 * Supplied as a handoff (`handoff/polynode-orb.js`, 18 November 2026) and moved here on 23 November with four
 * additions the brief asked for: the nodes pulse while idle and brighten on hover, the spin is integrated from a
 * delta so hovering can speed it up without the rotation jumping, a tap drives the same hover response once on
 * touch, and rendering stops when the tab is hidden as well as when the orb leaves the viewport.
 *
 * **three is injected, not imported.** The module only imports its *types*, so nothing pulls the library into a
 * bundle that merely references this file; `PolyNodeOrb` passes the namespace in after its own dynamic
 * `import("three")`. That is what keeps three out of the initial JavaScript for every page.
 */

type THREE = typeof THREE_NS;

export const ORB_BACKGROUND = "radial-gradient(circle closest-side at 50% 50%, #1167D8 0%, #328BFF 100%)";

export interface PolyNodeOptions {
  /** Full Y rotations as the orb travels through the viewport. */
  turns?: number;
  /** Tilt towards the pointer; 0 disables it. */
  hoverStrength?: number;
  /** Figure diameter as a fraction of the canvas. */
  figureScale?: number;
  /**
   * "orb" paints the design's blue circle on the host, as the standalone handoff did. On the homepage the blue
   * circle is already the parent element and the lattice sits in a smaller box above the caption, so that host
   * asks for "none" and keeps its background transparent.
   */
  background?: "orb" | "none";
}

interface BuiltNode {
  pivot: THREE_NS.Group;
  core: THREE_NS.Mesh<THREE_NS.BufferGeometry, THREE_NS.MeshBasicMaterial>;
  /** The materials the idle pulse and the hover glow animate. */
  nodeMat: THREE_NS.MeshStandardMaterial;
  haloMat: THREE_NS.MeshBasicMaterial;
  strutMat: THREE_NS.MeshStandardMaterial;
}

export function buildPolyNode(THREE: THREE, R = 0.5): BuiltNode {
  const pivot = new THREE.Group();
  pivot.name = "polynode";

  const glass = new THREE.MeshStandardMaterial({
    name: "glass_blue",
    color: 0x2f9bff,
    emissive: 0x0b5fc4,
    emissiveIntensity: 0.6,
    roughness: 0.18,
    metalness: 0.1,
    transparent: true,
    opacity: 0.78,
    depthWrite: false,
  });
  const facet = new THREE.MeshStandardMaterial({
    name: "inner_facet",
    color: 0x9ad2ff,
    emissive: 0x3a8fe0,
    emissiveIntensity: 0.5,
    roughness: 0.3,
    transparent: true,
    opacity: 0.3,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const strut = new THREE.MeshStandardMaterial({ name: "strut_light", color: 0xdff5ff, emissive: 0xa8e6ff, emissiveIntensity: 1, roughness: 0.4 });
  const node = new THREE.MeshStandardMaterial({ name: "node_glow", color: 0xffffff, emissive: 0xcff4ff, emissiveIntensity: 1.3, roughness: 0.3 });
  const halo = new THREE.MeshBasicMaterial({ name: "node_halo", color: 0x9fe6ff, transparent: true, opacity: 0.25, depthWrite: false });

  const shellGeo = new THREE.IcosahedronGeometry(R, 1);
  const shell = new THREE.Mesh(shellGeo, glass);
  shell.name = "shell";
  shell.renderOrder = 2;
  pivot.add(shell);

  const inner = new THREE.Mesh(new THREE.IcosahedronGeometry(R * 0.66, 0), facet);
  inner.name = "inner_facets";
  inner.rotation.set(0.6, 0.3, 0.2);
  inner.renderOrder = 1;
  pivot.add(inner);

  const coreMat = halo.clone();
  coreMat.name = "core_glow";
  coreMat.opacity = 0.35;
  const core = new THREE.Mesh(new THREE.SphereGeometry(R * 0.22, 32, 24), coreMat);
  core.name = "core";
  pivot.add(core);

  // Every unique vertex becomes a node, every unique triangle edge a strut.
  const pos = shellGeo.attributes.position;
  const verts = new Map<string, THREE_NS.Vector3>();
  const edges = new Map<string, [THREE_NS.Vector3, THREE_NS.Vector3]>();
  const key = (v: THREE_NS.Vector3) => `${v.x.toFixed(4)},${v.y.toFixed(4)},${v.z.toFixed(4)}`;
  for (let i = 0; i < pos.count; i += 3) {
    const ks = [0, 1, 2].map((k) => {
      const v = new THREE.Vector3().fromBufferAttribute(pos, i + k);
      const kk = key(v);
      verts.set(kk, v);
      return kk;
    });
    for (let e = 0; e < 3; e += 1) {
      const a = ks[e];
      const b = ks[(e + 1) % 3];
      const ek = a < b ? `${a}|${b}` : `${b}|${a}`;
      if (!edges.has(ek)) edges.set(ek, [verts.get(a)!, verts.get(b)!]);
    }
  }

  const up = new THREE.Vector3(0, 1, 0);
  for (const [a, b] of edges.values()) {
    const dir = b.clone().sub(a);
    const len = dir.length();
    const m = new THREE.Mesh(new THREE.CylinderGeometry(0.0035, 0.0035, len, 6, 1, true), strut);
    m.name = "strut";
    m.position.copy(a).add(b).multiplyScalar(0.5);
    m.quaternion.setFromUnitVectors(up, dir.normalize());
    pivot.add(m);
  }

  // The twelve icosahedron corners get the larger node and a halo; the subdivided midpoints get a small one.
  const corners = new THREE.IcosahedronGeometry(R, 0).attributes.position;
  const cornerKeys = new Set<string>();
  for (let i = 0; i < corners.count; i += 1) cornerKeys.add(key(new THREE.Vector3().fromBufferAttribute(corners, i)));

  const bigG = new THREE.SphereGeometry(0.024, 32, 20);
  const smallG = new THREE.SphereGeometry(0.012, 24, 16);
  const haloG = new THREE.SphereGeometry(0.05, 24, 16);
  for (const [k, v] of verts) {
    const big = cornerKeys.has(k);
    const s = new THREE.Mesh(big ? bigG : smallG, node);
    s.name = big ? "node_primary" : "node";
    s.position.copy(v);
    pivot.add(s);
    if (big) {
      const h = new THREE.Mesh(haloG, halo);
      h.name = "node_halo";
      h.position.copy(v);
      pivot.add(h);
    }
  }

  return { pivot, core, nodeMat: node, haloMat: halo, strutMat: strut };
}

export interface PolyNodeHandle {
  dispose(): void;
}

export function mountPolyNodeOrb(
  el: HTMLElement,
  THREE: THREE,
  { turns = 1, hoverStrength = 1, figureScale = 0.56, background = "orb" }: PolyNodeOptions = {},
): PolyNodeHandle {
  if (background === "orb") {
    el.style.background = ORB_BACKGROUND;
    el.style.borderRadius = "50%";
    el.style.overflow = "hidden";
  }
  if (getComputedStyle(el).position === "static") el.style.position = "relative";

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  Object.assign(renderer.domElement.style, { position: "absolute", inset: "0", width: "100%", height: "100%", display: "block" });
  // Decorative: the heading beside it carries the meaning.
  renderer.domElement.setAttribute("aria-hidden", "true");
  el.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight(0xffffff, 0x1a3c6e, 1.3));
  const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
  keyLight.position.set(2, 3, 2.5);
  scene.add(keyLight);
  const fillLight = new THREE.DirectionalLight(0xa8dcff, 0.9);
  fillLight.position.set(-2, -1, 1);
  scene.add(fillLight);

  const fov = 35;
  const camera = new THREE.PerspectiveCamera(fov, 1, 0.01, 100);
  // The figure (1 unit across) fills `figureScale` of the orb's height.
  camera.position.set(0, 0, 1 / figureScale / (2 * Math.tan((fov * Math.PI) / 360)));

  const { pivot, core, nodeMat, haloMat, strutMat } = buildPolyNode(THREE);
  scene.add(pivot);

  const fit = () => {
    const w = el.clientWidth || 1;
    const h = el.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(fit);
  ro.observe(el);
  fit();

  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let reduce = motionQuery.matches;
  const onMotionChange = () => {
    reduce = motionQuery.matches;
  };
  motionQuery.addEventListener("change", onMotionChange);

  const tgt = { hx: 0, hy: 0, s: 1, p: 0, glow: 0 };
  const cur = { ...tgt };

  const aim = (clientX: number, clientY: number) => {
    const r = el.getBoundingClientRect();
    tgt.hx = (((clientX - r.left) / r.width) * 2 - 1) * hoverStrength;
    tgt.hy = (((clientY - r.top) / r.height) * 2 - 1) * hoverStrength;
    tgt.s = 1.07;
    tgt.glow = 1;
  };
  const rest = () => {
    tgt.hx = 0;
    tgt.hy = 0;
    tgt.s = 1;
    tgt.glow = 0;
  };

  let tapTimer = 0;
  const onMove = (e: PointerEvent) => {
    if (e.pointerType === "touch") return; // touch is handled by the tap below
    aim(e.clientX, e.clientY);
  };
  const onLeave = () => rest();
  /** Touch has no hover, so a tap plays the same response once and eases back. */
  const onDown = (e: PointerEvent) => {
    if (e.pointerType !== "touch") return;
    aim(e.clientX, e.clientY);
    window.clearTimeout(tapTimer);
    tapTimer = window.setTimeout(rest, 1600);
  };

  // 0 when the orb enters the bottom of the viewport, 1 when it leaves the top.
  const onScroll = () => {
    const r = el.getBoundingClientRect();
    tgt.p = Math.min(1, Math.max(0, (window.innerHeight - r.top) / (window.innerHeight + r.height)));
  };

  el.addEventListener("pointermove", onMove);
  el.addEventListener("pointerleave", onLeave);
  el.addEventListener("pointerdown", onDown);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // performance.now() rather than THREE.Clock, which three 0.187 deprecates in favour of THREE.Timer - and a
  // timestamp needs neither, since the loop only wants a delta.
  let last = 0;
  let raf = 0;
  let onScreen = true;
  let spin = 0;
  let elapsed = 0;

  const running = () => onScreen && !document.hidden;
  const kick = () => {
    if (running() && !raf) raf = requestAnimationFrame(tick);
  };

  const io = new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    if (onScreen) last = 0;
    kick();
  });
  io.observe(el);

  const onVisibility = () => {
    if (document.hidden) {
      cancelAnimationFrame(raf);
      raf = 0;
    } else {
      last = 0; // resume where it left off rather than jumping by the time the tab was hidden
      kick();
    }
  };
  document.addEventListener("visibilitychange", onVisibility);

  function tick(now = performance.now()) {
    raf = 0;
    if (!running()) return;

    // A delta rather than a running total: the spin is integrated, so hovering can speed it up without the
    // rotation jumping, and a tab that was hidden resumes where it left off.
    const dt = last === 0 ? 0 : Math.min((now - last) / 1000, 0.1);
    last = now;
    elapsed += dt;
    const k = reduce ? 1 : 0.08;
    for (const f of Object.keys(tgt) as (keyof typeof tgt)[]) cur[f] += (tgt[f] - cur[f]) * k;

    if (!reduce) spin += dt * (0.12 + cur.glow * 0.2);

    pivot.rotation.y = cur.p * Math.PI * 2 * turns + cur.hx * 0.55 + spin;
    pivot.rotation.x = (cur.p - 0.5) * 0.6 + cur.hy * 0.4;
    pivot.rotation.z = -cur.hx * 0.08;
    pivot.scale.setScalar(cur.s);
    pivot.position.set(cur.hx * 0.03, (reduce ? 0 : Math.sin(elapsed * 1.2) * 0.02) - cur.hy * 0.03, 0);

    // Idle pulse on the nodes, lifted further while the pointer is on the orb.
    const pulse = reduce ? 0 : Math.sin(elapsed * 1.6) * 0.5 + 0.5;
    nodeMat.emissiveIntensity = 1.3 + pulse * 0.4 + cur.glow * 0.9;
    haloMat.opacity = 0.25 + pulse * 0.07 + cur.glow * 0.22;
    strutMat.emissiveIntensity = 1 + cur.glow * 0.5;
    core.material.opacity = 0.3 + cur.glow * 0.2 + (reduce ? 0 : Math.sin(elapsed * 2) * 0.05);

    renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);
  }
  tick();

  return {
    dispose() {
      cancelAnimationFrame(raf);
      window.clearTimeout(tapTimer);
      ro.disconnect();
      io.disconnect();
      motionQuery.removeEventListener("change", onMotionChange);
      document.removeEventListener("visibilitychange", onVisibility);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("scroll", onScroll);
      scene.traverse((o) => {
        const mesh = o as THREE_NS.Mesh;
        mesh.geometry?.dispose();
        const m = mesh.material;
        if (Array.isArray(m)) m.forEach((x) => x.dispose());
        else m?.dispose();
      });
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
