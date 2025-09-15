import * as THREE from 'three';

function initCanvas(canvas){
  if (document.documentElement.classList.contains("reduced-effects")) return;
  if (canvas.dataset.init) return; canvas.dataset.init = '1';
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
  camera.position.z = 5;

  const resize = () => {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight * 0.8;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize(); addEventListener('resize', resize);

  const starCount = (window.innerWidth < 900) ? 500 : 1000;
  const positions = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    const r = 120 * Math.pow(Math.random(), 0.5);
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);
    positions.set([x, y, z], i * 3);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({ color: 0x77ffff, size: 0.02 });
  const stars = new THREE.Points(geometry, material);
  scene.add(stars);

  scene.fog = new THREE.FogExp2(0x030713, 0.03);

  const clock = new THREE.Clock();
  let running = true;
  const io = new IntersectionObserver((entries)=>{
    running = entries.some(e=> e.isIntersecting);
  }, { threshold: 0.05 });
  io.observe(canvas);

  function animate(){
    const t = clock.getElapsedTime();
    stars.rotation.y = t * 0.03;
    stars.rotation.x = Math.sin(t * 0.25) * 0.06;
    if (running){ renderer.setPixelRatio(1); renderer.setClearColor(0, 0); renderer.render(scene, camera); }
    requestAnimationFrame(animate);
  }
  animate();
}

function initAll(){ document.querySelectorAll('canvas[data-starfield]').forEach(initCanvas); }

function readyOrWait(cb){
  if (document.body.classList.contains('app-loading')) { addEventListener('app:ready', () => cb(), { once:true }); } else cb();
}

if (document.readyState === 'loading') addEventListener('DOMContentLoaded', () => readyOrWait(initAll), { once:true }); else readyOrWait(initAll);
addEventListener('astro:page-load', () => readyOrWait(initAll));

