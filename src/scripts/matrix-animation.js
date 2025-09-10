import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass';

function initMatrixAnimation() {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  const composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);
  const glitchPass = new GlitchPass();
  composer.addPass(glitchPass);

  const blockCount = 1000;
  const blocks = [];
  for (let i = 0; i < blockCount; i++) {
    const geometry = new THREE.BoxGeometry(0.1, 0.5, 0.1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const block = new THREE.Mesh(geometry, material);
    block.position.x = (Math.random() - 0.5) * 50;
    block.position.y = (Math.random() - 0.5) * 50;
    block.position.z = (Math.random() - 0.5) * 50;
    scene.add(block);
    blocks.push(block);
  }

  function animateMatrix() {
    blocks.forEach((block) => {
      block.position.y -= 0.1;
      if (block.position.y < -25) block.position.y = 25;
    });
  }

  const mouse = new THREE.Vector2();
  const interactiveObjects = [];

  for (let i = 0; i < 5; i++) {
    const geometry = new THREE.IcosahedronGeometry(1, 0);
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 1, roughness: 0.5 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = (Math.random() - 0.5) * 10;
    mesh.position.y = (Math.random() - 0.5) * 10;
    mesh.position.z = (Math.random() - 0.5) * 10;
    scene.add(mesh);
    interactiveObjects.push(mesh);
  }

  window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }, { passive: true });

  function animateInteractive() {
    interactiveObjects.forEach((mesh) => {
      mesh.rotation.x += 0.01;
      mesh.rotation.y += 0.01;
      const target = new THREE.Vector3(mouse.x * 10, mouse.y * 10, 5);
      mesh.position.lerp(target, 0.01);
    });
  }

  function onResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    composer.setSize(w, h);
  }
  window.addEventListener('resize', onResize);

  function loop() {
    requestAnimationFrame(loop);
    animateMatrix();
    animateInteractive();
    composer.render();
  }

  loop();
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initMatrixAnimation();
} else {
  window.addEventListener('DOMContentLoaded', initMatrixAnimation, { once: true });
}

