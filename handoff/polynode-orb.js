// polynode-orb.js — framework-agnostic. Mounts the glass lattice on the blue orb background inside `el`.
// Usage: const dispose = mountPolyNodeOrb(el, THREE, { turns: 1, hoverStrength: 1 });
// `el` gets the orb background; size it with CSS (square).

export const ORB_BACKGROUND = 'radial-gradient(circle closest-side at 50% 50%, #1167D8 0%, #328BFF 100%)';

export function buildPolyNode(THREE, R = 0.5) {
  const pivot = new THREE.Group(); pivot.name = 'polynode';
  const glass = new THREE.MeshStandardMaterial({ name: 'glass_blue', color: 0x2f9bff, emissive: 0x0b5fc4, emissiveIntensity: 0.6, roughness: 0.18, metalness: 0.1, transparent: true, opacity: 0.78, depthWrite: false });
  const facet = new THREE.MeshStandardMaterial({ name: 'inner_facet', color: 0x9ad2ff, emissive: 0x3a8fe0, emissiveIntensity: 0.5, roughness: 0.3, transparent: true, opacity: 0.3, depthWrite: false, side: THREE.DoubleSide });
  const strut = new THREE.MeshStandardMaterial({ name: 'strut_light', color: 0xdff5ff, emissive: 0xa8e6ff, emissiveIntensity: 1, roughness: 0.4 });
  const node = new THREE.MeshStandardMaterial({ name: 'node_glow', color: 0xffffff, emissive: 0xcff4ff, emissiveIntensity: 1.3, roughness: 0.3 });
  const halo = new THREE.MeshBasicMaterial({ name: 'node_halo', color: 0x9fe6ff, transparent: true, opacity: 0.25, depthWrite: false });

  const shellGeo = new THREE.IcosahedronGeometry(R, 1);
  const shell = new THREE.Mesh(shellGeo, glass); shell.name = 'shell'; shell.renderOrder = 2; pivot.add(shell);
  const inner = new THREE.Mesh(new THREE.IcosahedronGeometry(R * 0.66, 0), facet);
  inner.name = 'inner_facets'; inner.rotation.set(0.6, 0.3, 0.2); inner.renderOrder = 1; pivot.add(inner);
  const coreMat = halo.clone(); coreMat.name = 'core_glow'; coreMat.opacity = 0.35;
  const core = new THREE.Mesh(new THREE.SphereGeometry(R * 0.22, 32, 24), coreMat); core.name = 'core'; pivot.add(core);

  const pos = shellGeo.attributes.position, verts = new Map(), edges = new Map();
  const key = (v) => `${v.x.toFixed(4)},${v.y.toFixed(4)},${v.z.toFixed(4)}`;
  for (let i = 0; i < pos.count; i += 3) {
    const ks = [0, 1, 2].map((k) => { const v = new THREE.Vector3().fromBufferAttribute(pos, i + k), kk = key(v); verts.set(kk, v); return kk; });
    for (let e = 0; e < 3; e++) {
      const a = ks[e], b = ks[(e + 1) % 3], ek = a < b ? a + '|' + b : b + '|' + a;
      if (!edges.has(ek)) edges.set(ek, [verts.get(a), verts.get(b)]);
    }
  }
  const up = new THREE.Vector3(0, 1, 0);
  for (const [a, b] of edges.values()) {
    const dir = b.clone().sub(a), len = dir.length();
    const m = new THREE.Mesh(new THREE.CylinderGeometry(0.0035, 0.0035, len, 6, 1, true), strut);
    m.name = 'strut'; m.position.copy(a).add(b).multiplyScalar(0.5);
    m.quaternion.setFromUnitVectors(up, dir.normalize()); pivot.add(m);
  }
  const corners = new THREE.IcosahedronGeometry(R, 0).attributes.position, cornerKeys = new Set();
  for (let i = 0; i < corners.count; i++) cornerKeys.add(key(new THREE.Vector3().fromBufferAttribute(corners, i)));
  const bigG = new THREE.SphereGeometry(0.024, 32, 20), smallG = new THREE.SphereGeometry(0.012, 24, 16), haloG = new THREE.SphereGeometry(0.05, 24, 16);
  for (const [k, v] of verts) {
    const big = cornerKeys.has(k);
    const s = new THREE.Mesh(big ? bigG : smallG, node); s.name = big ? 'node_primary' : 'node'; s.position.copy(v); pivot.add(s);
    if (big) { const h = new THREE.Mesh(haloG, halo); h.name = 'node_halo'; h.position.copy(v); pivot.add(h); }
  }
  return { pivot, core };
}

export function mountPolyNodeOrb(el, THREE, { turns = 1, hoverStrength = 1, figureScale = 0.56 } = {}) {
  el.style.background = ORB_BACKGROUND;
  el.style.borderRadius = '50%';
  el.style.overflow = 'hidden';
  if (getComputedStyle(el).position === 'static') el.style.position = 'relative';

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  Object.assign(renderer.domElement.style, { position: 'absolute', inset: '0', width: '100%', height: '100%', display: 'block' });
  el.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight(0xffffff, 0x1a3c6e, 1.3));
  const key = new THREE.DirectionalLight(0xffffff, 2.4); key.position.set(2, 3, 2.5); scene.add(key);
  const fill = new THREE.DirectionalLight(0xa8dcff, 0.9); fill.position.set(-2, -1, 1); scene.add(fill);

  const fov = 35, camera = new THREE.PerspectiveCamera(fov, 1, 0.01, 100);
  // Figure diameter (1 unit) fills `figureScale` of the orb height
  camera.position.set(0, 0, 1 / figureScale / (2 * Math.tan((fov * Math.PI) / 360)));
  const { pivot, core } = buildPolyNode(THREE);
  scene.add(pivot);

  const fit = () => {
    const w = el.clientWidth || 1, h = el.clientHeight || 1;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(fit); ro.observe(el); fit();

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const tgt = { hx: 0, hy: 0, s: 1, p: 0, glow: 0 }, cur = { ...tgt };
  const move = (e) => {
    const r = el.getBoundingClientRect();
    tgt.hx = (((e.clientX - r.left) / r.width) * 2 - 1) * hoverStrength;
    tgt.hy = (((e.clientY - r.top) / r.height) * 2 - 1) * hoverStrength;
    tgt.s = 1.07; tgt.glow = 1;
  };
  const leave = () => { tgt.hx = tgt.hy = 0; tgt.s = 1; tgt.glow = 0; };
  // 0 when the orb enters the bottom of the viewport → 1 when it leaves the top
  const scroll = () => {
    const r = el.getBoundingClientRect();
    tgt.p = Math.min(1, Math.max(0, (window.innerHeight - r.top) / (window.innerHeight + r.height)));
  };
  el.addEventListener('pointermove', move); el.addEventListener('pointerleave', leave);
  window.addEventListener('scroll', scroll, { passive: true }); scroll();

  let raf = 0, visible = true;
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !raf) tick(); });
  io.observe(el);

  const clock = new THREE.Clock();
  const tick = () => {
    raf = 0;
    if (!visible) return;
    const t = clock.getElapsedTime(), k = reduce ? 1 : 0.08;
    for (const f in tgt) cur[f] += (tgt[f] - cur[f]) * k;
    pivot.rotation.y = cur.p * Math.PI * 2 * turns + cur.hx * 0.55 + (reduce ? 0 : t * 0.12);
    pivot.rotation.x = (cur.p - 0.5) * 0.6 + cur.hy * 0.4;
    pivot.rotation.z = -cur.hx * 0.08;
    pivot.scale.setScalar(cur.s);
    pivot.position.set(cur.hx * 0.03, (reduce ? 0 : Math.sin(t * 1.2) * 0.02) - cur.hy * 0.03, 0);
    core.material.opacity = 0.3 + cur.glow * 0.2 + Math.sin(t * 2) * 0.05;
    renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);
  };
  tick();

  return function dispose() {
    cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
    el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave);
    window.removeEventListener('scroll', scroll);
    scene.traverse((o) => { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); });
    renderer.dispose(); renderer.domElement.remove();
  };
}
