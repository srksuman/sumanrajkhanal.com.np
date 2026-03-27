import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';

function getThemeColors() {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  return {
    primary: isLight ? 0x8a6d1b : 0xc9a84c,
    accent: isLight ? 0xc9a84c : 0xe8c97a,
    wireOpacity: isLight ? 0.15 : 0.08,
    nodeOpacity: isLight ? 1.0 : 0.8,
    ringOpacity: isLight ? 0.18 : 0.1,
  };
}

export default function SkillsGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const colors = getThemeColors();
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const rect = canvas.parentElement!.getBoundingClientRect();
    renderer.setSize(rect.width, rect.height);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, rect.width / rect.height, 0.1, 100);
    camera.position.set(0, 0, 4.5);

    const sphereGeo = new THREE.SphereGeometry(1.8, 24, 24);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: colors.primary,
      wireframe: true,
      transparent: true,
      opacity: colors.wireOpacity,
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(sphere);

    const latRings: THREE.Line[] = [];
    for (let i = 0; i < 5; i++) {
      const y = -1.2 + i * 0.6;
      const r = Math.sqrt(1.8 * 1.8 - y * y);
      const pts: THREE.Vector3[] = [];
      for (let j = 0; j <= 64; j++) {
        const angle = (j / 64) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(angle) * r, y, Math.sin(angle) * r));
      }
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({
        color: colors.primary,
        transparent: true,
        opacity: colors.wireOpacity * 1.5,
      });
      const line = new THREE.Line(geo, mat);
      latRings.push(line);
      scene.add(line);
    }

    const nodeCount = 12;
    const nodeGeo = new THREE.SphereGeometry(0.015, 6, 6);
    const nodes: { mesh: THREE.Mesh; phi: number; theta: number; speed: number }[] = [];

    for (let i = 0; i < nodeCount; i++) {
      const nodeMat = new THREE.MeshBasicMaterial({
        color: colors.accent,
        transparent: true,
        opacity: colors.nodeOpacity * 0.6,
      });
      const mesh = new THREE.Mesh(nodeGeo, nodeMat);
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      const speed = 0.1 + Math.random() * 0.2;
      nodes.push({ mesh, phi, theta, speed });
      scene.add(mesh);
    }

    const trailCount = 60;
    const trailPositions = new Float32Array(trailCount * 3);
    const trailGeo = new THREE.BufferGeometry();
    trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
    const trailMat = new THREE.PointsMaterial({
      color: colors.accent,
      size: 0.008,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const trailParticles = new THREE.Points(trailGeo, trailMat);
    scene.add(trailParticles);

    const outerRingGeo = new THREE.TorusGeometry(2.2, 0.006, 8, 100);
    const outerRingMat = new THREE.MeshBasicMaterial({
      color: colors.primary,
      transparent: true,
      opacity: colors.ringOpacity,
    });
    const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
    outerRing.rotation.x = Math.PI * 0.5;
    scene.add(outerRing);

    const clock = new THREE.Clock();
    let animId = 0;
    let trailIdx = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      sphere.rotation.y = t * 0.08 + mx * 0.3;
      sphere.rotation.x = Math.sin(t * 0.3) * 0.1 + my * 0.2;

      const s = 1 + Math.sin(t * 0.8) * 0.03;
      sphere.scale.set(s, s, s);

      latRings.forEach((ring, i) => {
        ring.rotation.y = t * 0.08 + i * 0.02 + mx * 0.3;
        ring.rotation.x = sphere.rotation.x;
      });

      nodes.forEach((node) => {
        node.theta += node.speed * 0.005;
        const r = 1.85;
        const x = r * Math.sin(node.phi) * Math.cos(node.theta);
        const y = r * Math.cos(node.phi);
        const z = r * Math.sin(node.phi) * Math.sin(node.theta);
        node.mesh.position.set(x, y, z);

        const trailArr = trailGeo.attributes.position.array as Float32Array;
        trailArr[trailIdx * 3] = x;
        trailArr[trailIdx * 3 + 1] = y;
        trailArr[trailIdx * 3 + 2] = z;
        trailIdx = (trailIdx + 1) % trailCount;
        trailGeo.attributes.position.needsUpdate = true;
      });

      outerRing.rotation.z = t * 0.05;

      renderer.render(scene, camera);
    };
    animate();

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    };
    canvas.parentElement!.addEventListener('mousemove', onMouseMove);

    const onResize = () => {
      const r = canvas.parentElement!.getBoundingClientRect();
      camera.aspect = r.width / r.height;
      camera.updateProjectionMatrix();
      renderer.setSize(r.width, r.height);
    };
    window.addEventListener('resize', onResize);

    const observer = new MutationObserver(() => {
      const c = getThemeColors();
      sphereMat.color.setHex(c.primary);
      sphereMat.opacity = c.wireOpacity;
      outerRingMat.color.setHex(c.primary);
      outerRingMat.opacity = c.ringOpacity;
      trailMat.color.setHex(c.accent);
      latRings.forEach((l) => {
        (l.material as THREE.LineBasicMaterial).color.setHex(c.primary);
        (l.material as THREE.LineBasicMaterial).opacity = c.wireOpacity * 1.5;
      });
      nodes.forEach((n) => {
        (n.mesh.material as THREE.MeshBasicMaterial).color.setHex(c.accent);
        (n.mesh.material as THREE.MeshBasicMaterial).opacity = c.nodeOpacity;
      });
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    return () => {
      cancelAnimationFrame(animId);
      canvas.parentElement!.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      observer.disconnect();
      renderer.dispose();
      sphereGeo.dispose();
      sphereMat.dispose();
      nodeGeo.dispose();
      outerRingGeo.dispose();
      outerRingMat.dispose();
      trailGeo.dispose();
      trailMat.dispose();
      latRings.forEach((l) => {
        l.geometry.dispose();
        (l.material as THREE.Material).dispose();
      });
      nodes.forEach((n) => {
        (n.mesh.material as THREE.Material).dispose();
      });
    };
  }, []);

  return (
    <motion.div
      className="skills-globe-wrapper"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false, amount: 0.1 }}
      transition={{ duration: 0.8 }}
    >
      <canvas ref={canvasRef} className="skills-globe-canvas" aria-hidden="true" />
    </motion.div>
  );
}
