import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';

function getThemeColors() {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  return {
    primary: isLight ? 0x8a6d1b : 0xc9a84c,
    accent: isLight ? 0xc9a84c : 0xe8c97a,
    secondary: isLight ? 0x4a37a0 : 0x7b68ee,
    wireOpacity: isLight ? 0.18 : 0.1,
    particleOpacity: isLight ? 0.8 : 0.6,
    ambientOpacity: isLight ? 0.6 : 0.4,
    ringOpacity: isLight ? 0.15 : 0.08,
  };
}

export default function ContactScene() {
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
    camera.position.set(0, 0, 5);

    const knotGeo = new THREE.TorusKnotGeometry(1.2, 0.35, 128, 16, 2, 3);
    const knotMat = new THREE.MeshBasicMaterial({
      color: colors.primary,
      wireframe: true,
      transparent: true,
      opacity: colors.wireOpacity,
    });
    const knot = new THREE.Mesh(knotGeo, knotMat);
    scene.add(knot);

    const surfaceParticleCount = 300;
    const surfacePositions = new Float32Array(surfaceParticleCount * 3);
    const knotPositionAttr = knotGeo.attributes.position;
    const stride = Math.floor(knotPositionAttr.count / surfaceParticleCount);

    for (let i = 0; i < surfaceParticleCount; i++) {
      const idx = (i * stride) % knotPositionAttr.count;
      surfacePositions[i * 3] = knotPositionAttr.getX(idx);
      surfacePositions[i * 3 + 1] = knotPositionAttr.getY(idx);
      surfacePositions[i * 3 + 2] = knotPositionAttr.getZ(idx);
    }

    const surfaceGeo = new THREE.BufferGeometry();
    surfaceGeo.setAttribute('position', new THREE.BufferAttribute(surfacePositions, 3));
    const surfaceMat = new THREE.PointsMaterial({
      color: colors.accent,
      size: 0.012,
      transparent: true,
      opacity: colors.particleOpacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const surfaceParticles = new THREE.Points(surfaceGeo, surfaceMat);
    scene.add(surfaceParticles);

    const ambientCount = 200;
    const ambientPositions = new Float32Array(ambientCount * 3);
    const ambientVelocities: number[] = [];

    for (let i = 0; i < ambientCount; i++) {
      ambientPositions[i * 3] = (Math.random() - 0.5) * 8;
      ambientPositions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      ambientPositions[i * 3 + 2] = (Math.random() - 0.5) * 8;
      ambientVelocities.push(
        (Math.random() - 0.5) * 0.003,
        (Math.random() - 0.5) * 0.003,
        (Math.random() - 0.5) * 0.003,
      );
    }

    const ambientGeo = new THREE.BufferGeometry();
    ambientGeo.setAttribute('position', new THREE.BufferAttribute(ambientPositions, 3));
    const ambientMat = new THREE.PointsMaterial({
      color: colors.secondary,
      size: 0.01,
      transparent: true,
      opacity: colors.ambientOpacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const ambientParticles = new THREE.Points(ambientGeo, ambientMat);
    scene.add(ambientParticles);

    const sceneRings: THREE.Mesh[] = [];
    for (let i = 0; i < 2; i++) {
      const ringGeo = new THREE.TorusGeometry(2.0 + i * 0.5, 0.005, 8, 80);
      const ringMat = new THREE.MeshBasicMaterial({
        color: colors.secondary,
        transparent: true,
        opacity: colors.ringOpacity,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI * 0.3 + i * 0.5;
      ring.rotation.y = i * 0.8;
      sceneRings.push(ring);
      scene.add(ring);
    }

    const clock = new THREE.Clock();
    let animId = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      knot.rotation.x = t * 0.1 + my * 0.4;
      knot.rotation.y = t * 0.15 + mx * 0.4;
      knotMat.opacity = colors.wireOpacity + Math.sin(t * 1.5) * 0.04;

      surfaceParticles.rotation.x = knot.rotation.x;
      surfaceParticles.rotation.y = knot.rotation.y;

      const ambArr = ambientGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < ambientCount; i++) {
        ambArr[i * 3] += ambientVelocities[i * 3];
        ambArr[i * 3 + 1] += ambientVelocities[i * 3 + 1];
        ambArr[i * 3 + 2] += ambientVelocities[i * 3 + 2];
        for (let j = 0; j < 3; j++) {
          if (ambArr[i * 3 + j] > 4) ambArr[i * 3 + j] = -4;
          if (ambArr[i * 3 + j] < -4) ambArr[i * 3 + j] = 4;
        }
      }
      ambientGeo.attributes.position.needsUpdate = true;

      sceneRings.forEach((ring, i) => {
        ring.rotation.x += 0.001 * (i + 1);
        ring.rotation.z += 0.0008 * (i + 1);
      });

      renderer.render(scene, camera);
    };
    animate();

    const onMouseMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      mouseRef.current.y = ((e.clientY - r.top) / r.height) * 2 - 1;
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
      knotMat.color.setHex(c.primary);
      knotMat.opacity = c.wireOpacity;
      surfaceMat.color.setHex(c.accent);
      surfaceMat.opacity = c.particleOpacity;
      ambientMat.color.setHex(c.secondary);
      ambientMat.opacity = c.ambientOpacity;
      sceneRings.forEach((r) => {
        (r.material as THREE.MeshBasicMaterial).color.setHex(c.secondary);
        (r.material as THREE.MeshBasicMaterial).opacity = c.ringOpacity;
      });
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    return () => {
      cancelAnimationFrame(animId);
      canvas.parentElement!.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      observer.disconnect();
      renderer.dispose();
      knotGeo.dispose();
      knotMat.dispose();
      surfaceGeo.dispose();
      surfaceMat.dispose();
      ambientGeo.dispose();
      ambientMat.dispose();
      sceneRings.forEach((r) => {
        (r.geometry as THREE.BufferGeometry).dispose();
        (r.material as THREE.Material).dispose();
      });
    };
  }, []);

  return (
    <motion.div
      className="contact-scene-wrapper"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false, amount: 0.1 }}
      transition={{ duration: 0.8 }}
    >
      <canvas ref={canvasRef} className="contact-scene-canvas" aria-hidden="true" />
    </motion.div>
  );
}
