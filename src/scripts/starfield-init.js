import * as THREE from 'three';

function initCanvas(canvas){`r`n  if (document.documentElement.classList.contains("reduced-effects")) return;
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

  const starCount = (window.innerWidth < 900) ? 900 : 1600;
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

  // Warp boost streaks (brief hyperspace effect on first scroll past hero)
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const streakCount = 160;
  const streakGeo = new THREE.BufferGeometry();
  const streakPos = new Float32Array(streakCount * 2 * 3); // line segments
  const streakSpeed = new Float32Array(streakCount);
  const streakLen = new Float32Array(streakCount);
  function resetStreak(i, zMin=0, zMax=8){
    const x = (Math.random() - 0.5) * 10;
    const y = (Math.random() - 0.5) * 6;
    const z = Math.random() * (zMax - zMin) + zMin;
    const len = 0.2 + Math.random() * 0.5;
    const speed = 18 + Math.random() * 24;
    const idx = i * 6;
    streakPos[idx] = x; streakPos[idx+1] = y; streakPos[idx+2] = z;
    streakPos[idx+3] = x; streakPos[idx+4] = y; streakPos[idx+5] = z - len;
    streakSpeed[i] = speed;
    streakLen[i] = len;
  }
  for (let i = 0; i < streakCount; i++) resetStreak(i, 2, 10);
  streakGeo.setAttribute('position', new THREE.BufferAttribute(streakPos, 3));
  const streakMat = new THREE.LineBasicMaterial({ color: 0x6fe7ff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending });
  const streaks = new THREE.LineSegments(streakGeo, streakMat);
  streaks.visible = false; scene.add(streaks);

  let boostOnce = false;
  function triggerBoost(){
    if (reduceMotion || boostOnce) return; boostOnce = true;
    streaks.visible = true; streakMat.opacity = 0.0; boostT = 0;
    const flash = document.createElement('div');
    flash.id = 'warp-flash'; document.body.appendChild(flash);
    setTimeout(()=> flash.remove(), 480);
  }

  addEventListener('scroll', () => {
    if (boostOnce) return;
    const y = window.scrollY;
    if (y > (innerHeight * 0.35)) triggerBoost();
  }, { passive: true });

  const clock = new THREE.Clock();
  let running = true;
  const io = new IntersectionObserver((entries)=>{
    running = entries.some(e=> e.isIntersecting);
  }, { threshold: 0.05 });
  io.observe(canvas);

  let boostT = 0; // seconds
  function animate(){
    const t = clock.getElapsedTime();
    const sy = Math.min(1, window.scrollY / (window.innerHeight||1));
    const rotBoost = Math.min(1, boostT / 0.15); // quick ramp when boosting
    stars.rotation.y = t * (0.02 + 0.35 * rotBoost) + sy * 0.1;
    stars.rotation.x = Math.sin(t * (0.2 + 0.8 * rotBoost)) * (0.05 + 0.12 * rotBoost) + sy * 0.05;

    // Update streaks if boosting
    if (boostT < 1.0 && (streaks.visible || boostT > 0)) {
      boostT += clock.getDelta();
      const env = boostT < 0.15 ? (boostT/0.15) : boostT < 0.6 ? 1 : Math.max(0, 1 - (boostT-0.6)/0.4);
      streakMat.opacity = 0.85 * env;
      const pos = streakGeo.getAttribute('position');
      const lenScale = 0.4 + 1.8 * env;
      for (let i = 0; i < streakCount; i++) {
        const base = i * 6;
        // Move along -Z in view space
        streakPos[base+2] -= streakSpeed[i] * 0.016; // head z
        streakPos[base+5] = streakPos[base+2] - streakLen[i] * lenScale; // tail z
        // recycle
        if (streakPos[base+2] < -18) resetStreak(i, 2, 8);
        // commit
        pos.array[base] = streakPos[base];
        pos.array[base+1] = streakPos[base+1];
        pos.array[base+2] = streakPos[base+2];
        pos.array[base+3] = streakPos[base+3];
        pos.array[base+4] = streakPos[base+4];
        pos.array[base+5] = streakPos[base+5];
      }
      pos.needsUpdate = true;
      if (boostT >= 1.0) { streaks.visible = false; }
    }
    if (running){ renderer.setPixelRatio(Math.min(1.5, devicePixelRatio)); renderer.setClearColor(0, 0); renderer.render(scene, camera); }
    requestAnimationFrame(animate);
  }
  animate();
}

function initAll(){ document.querySelectorAll('canvas[data-starfield]').forEach(initCanvas); }
if (document.readyState === 'loading') addEventListener('DOMContentLoaded', initAll, { once:true }); else initAll();
addEventListener('astro:page-load', initAll);

