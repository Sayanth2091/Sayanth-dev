import * as THREE from 'three';

function initElement(root){
  if (document.documentElement.classList.contains("reduced-effects")) return;
  if (root.dataset.init) return;
  root.dataset.init = '1';
  const type = root.dataset.type || 'knot';
  const color = root.dataset.color || '#07f0ff';
  const size = parseFloat(root.dataset.size || '220');
  const canvas = root.querySelector('canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
  camera.position.z = 3.2;

  const material = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(color), metalness: 0.1, roughness: 0.2, transmission: 0.8,
    thickness: 1.2, envMapIntensity: 1.0, clearcoat: 1.0, clearcoatRoughness: 0.1,
  });
  const wire = new THREE.MeshBasicMaterial({ color: new THREE.Color(color), wireframe: true, opacity: 0.35, transparent: true });

  const group = new THREE.Group(); scene.add(group);
  let mesh;
  if (type === 'ico') {
    mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 1), material);
    const cage = new THREE.Mesh(new THREE.IcosahedronGeometry(1.05, 1), wire);
    group.add(cage);
  } else {
    mesh = new THREE.Mesh(new THREE.TorusKnotGeometry(0.76, 0.28, 128, 16), material);
  }
  group.add(mesh);

  let scanMat, scanMesh, edgeLines;
  if (type !== 'ico') {
    scanMat = new THREE.ShaderMaterial({
      uniforms: { time: { value: 0 }, color: { value: new THREE.Color(color) } },
      vertexShader: `varying vec3 vPos; void main(){ vPos = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader: `varying vec3 vPos; uniform float time; uniform vec3 color; void main(){ float b = abs(sin(vPos.y*5.0 + time*1.6)); float a = smoothstep(0.35, 0.1, b); gl_FragColor = vec4(color, a*0.7); }`,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
    });
    scanMesh = new THREE.Mesh(mesh.geometry.clone(), scanMat);
    group.add(scanMesh);

    const edges = new THREE.EdgesGeometry(mesh.geometry, 15);
    const lineMat = new THREE.LineBasicMaterial({ color: new THREE.Color(color), transparent: true, opacity: 0.35 });
    edgeLines = new THREE.LineSegments(edges, lineMat);
    group.add(edgeLines);
  }

  const light1 = new THREE.PointLight(0x07f0ff, 3, 0, 2); light1.position.set(2, 1, 3); scene.add(light1);
  const light2 = new THREE.PointLight(0xa24cff, 2.5, 0, 2); light2.position.set(-2, -1, -3); scene.add(light2);

  const resize = () => { const s = parseFloat(getComputedStyle(root).getPropertyValue('--size')) || size; renderer.setSize(s, s, false); camera.aspect = 1; camera.updateProjectionMatrix(); };
  resize(); addEventListener('resize', resize);

  const clock = new THREE.Clock(); const state = { running: false, raf: 0 };
  function frame(){
    if (!state.running) return;
    const t = clock.getElapsedTime();
    if (type !== 'ico') {
      group.rotation.x = Math.sin(t*0.5)*0.25 + 0.6;
      group.rotation.y = t*0.35;
      if (scanMat) scanMat.uniforms.time.value = t;
    }
    renderer.setPixelRatio(1); renderer.setClearColor(0, 0); renderer.render(scene, camera);
    state.raf = requestAnimationFrame(frame);
  }
  const io = new IntersectionObserver((entries)=>{ const e = entries[0]; if (e && e.isIntersecting){ if (!state.running){ state.running = true; frame(); } } else { state.running = false; cancelAnimationFrame(state.raf); } }, { threshold: 0.05 });
  io.observe(root);
}

function initAll(){ document.querySelectorAll('.holo-wrap').forEach(initElement); }

function readyOrWait(cb){
  if (document.body.classList.contains('app-loading')) { addEventListener('app:ready', () => cb(), { once:true }); } else cb();
}

if (document.readyState === 'loading') addEventListener('DOMContentLoaded', () => readyOrWait(initAll), { once:true }); else readyOrWait(initAll);
addEventListener('astro:page-load', () => readyOrWait(initAll));

