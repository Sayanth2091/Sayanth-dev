import * as THREE from 'three';

function initElement(root){
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

  // Cyber accent for knot: additive scan band + edges
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

  // Hidden Easter-egg text sprite
  function createTextSprite(txt){
    const c = document.createElement('canvas');
    c.width = 512; c.height = 256;
    const ctx = c.getContext('2d');
    if (!ctx) return null;
    ctx.clearRect(0,0,c.width,c.height);
    const grad = ctx.createLinearGradient(0,0,c.width,0);
    grad.addColorStop(0, '#07f0ff'); grad.addColorStop(1, '#a24cff');
    ctx.fillStyle = grad;
    ctx.font = 'bold 120px ui-sans-serif, system-ui, Arial';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.shadowColor = '#07f0ff'; ctx.shadowBlur = 10;
    ctx.globalAlpha = 0.9;
    ctx.fillText(txt, c.width/2, c.height/2);
    const tex = new THREE.CanvasTexture(c);
    tex.anisotropy = 4; tex.needsUpdate = true;
    const mat = new THREE.SpriteMaterial({ map: tex, color: 0xffffff, transparent: true, opacity: 0.0, depthWrite:false, blending: THREE.AdditiveBlending });
    const spr = new THREE.Sprite(mat);
    const s = 1.6; spr.scale.set(s*2.0, s, 1);
    spr.position.set(0, 0, 0);
    return spr;
  }
  const textLabel = createTextSprite(type === 'ico' ? 'HEX' : 'CYBER');
  if (textLabel) group.add(textLabel);

  const light1 = new THREE.PointLight(0x07f0ff, 3, 0, 2); light1.position.set(2, 1, 3); scene.add(light1);
  const light2 = new THREE.PointLight(0xa24cff, 2.5, 0, 2); light2.position.set(-2, -1, -3); scene.add(light2);

  const resize = () => { const s = parseFloat(getComputedStyle(root).getPropertyValue('--size')) || size; renderer.setSize(s, s, false); camera.aspect = 1; camera.updateProjectionMatrix(); };
  resize(); addEventListener('resize', resize);

  const clock = new THREE.Clock(); const state = { running: false, raf: 0, reveal: 0 };
  const mouse = new THREE.Vector2(0,0); if (type === 'ico') { addEventListener('pointermove', (e)=>{ mouse.x = (e.clientX/innerWidth - 0.5); mouse.y = (e.clientY/innerHeight - 0.5); }, { passive:true }); }
  root.addEventListener('pointerenter', ()=>{ state.reveal = Math.min(1, state.reveal + 0.6); });
  root.addEventListener('click', ()=>{ state.reveal = 1; });
  function frame(){
    if (!state.running) return;
    const t = clock.getElapsedTime();
    if (type === 'ico'){
      const targetX = -mouse.y * 0.9 + 0.6 + Math.sin(t*0.5)*0.05;
      const targetY =  mouse.x * 0.9 + Math.cos(t*0.3)*0.05;
      group.rotation.x += (targetX - group.rotation.x) * 0.1;
      group.rotation.y += (targetY - group.rotation.y) * 0.1;
      const s = 1.0 + Math.sin(t*1.2)*0.03; group.scale.setScalar(s);
    } else {
      group.rotation.x = Math.sin(t*0.5)*0.25 + 0.6;
      group.rotation.y = t*0.35;
      if (scanMat) scanMat.uniforms.time.value = t;
      if (edgeLines) edgeLines.material.opacity = 0.25 + 0.1*Math.sin(t*1.5);
    }
    material.emissive = new THREE.Color().setHSL((Math.sin(t*0.5)*0.5+0.5)*0.8, 0.8, 0.2);
    if (textLabel){
      // Pulse subtly; increase when reveal>0 then decay
      const base = 0.05 + 0.05*Math.sin(t*1.2 + (type==='ico'?1:0));
      state.reveal = Math.max(0, state.reveal - 0.01);
      const op = Math.min(0.7, base + state.reveal);
      textLabel.material.opacity = op;
      textLabel.material.needsUpdate = true;
      textLabel.position.z = 0.0 + 0.05*Math.sin(t*2.0);
    }
    renderer.setPixelRatio(Math.min(2, devicePixelRatio)); renderer.setClearColor(0, 0); renderer.render(scene, camera);
    state.raf = requestAnimationFrame(frame);
  }
  const io = new IntersectionObserver((entries)=>{ const e = entries[0]; if (e && e.isIntersecting){ if (!state.running){ state.running = true; frame(); } } else { state.running = false; cancelAnimationFrame(state.raf); } }, { threshold: 0.05 });
  io.observe(root);
}

function initAll(){ document.querySelectorAll('.holo-wrap').forEach(initElement); }

if (document.readyState === 'loading') { addEventListener('DOMContentLoaded', initAll, { once:true }); } else { initAll(); }
addEventListener('astro:page-load', initAll);
