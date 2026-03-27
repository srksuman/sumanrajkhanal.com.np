import { useEffect, useRef } from 'react';
import * as THREE from 'three';

function getThemeColors() {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  return {
    primary: isLight ? 0x8a6d1b : 0xc9a84c,
    secondary: isLight ? 0x4a37a0 : 0x7b68ee,
    particleOpacity: isLight ? 0.9 : 0.7,
    wireOpacity: isLight ? 0.15 : 0.08,
    lineOpacity: isLight ? 0.12 : 0.06,
    ringOpacity: isLight ? 0.12 : 0.06,
  };
}

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const clickPulseRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const colors = getThemeColors();

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      canvas.offsetWidth / canvas.offsetHeight,
      0.1,
      100,
    );
    camera.position.set(0, 0, 5);

    const icoGeo = new THREE.IcosahedronGeometry(2.2, 1);
    const icoMat = new THREE.MeshBasicMaterial({
      color: colors.primary,
      wireframe: true,
      transparent: true,
      opacity: colors.wireOpacity,
    });
    const ico = new THREE.Mesh(icoGeo, icoMat);
    ico.position.set(2.5, 0, -2);
    scene.add(ico);

    const particleCount = 500;
    const positions = new Float32Array(particleCount * 3);
    const basePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    const goldColor = new THREE.Color(colors.primary);
    const purpleColor = new THREE.Color(colors.secondary);

    for (let i = 0; i < particleCount; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      const r = 3 + Math.random() * 3;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      basePositions[i * 3] = x;
      basePositions[i * 3 + 1] = y;
      basePositions[i * 3 + 2] = z;

      const color = Math.random() > 0.3 ? goldColor : purpleColor;
      particleColors[i * 3] = color.r;
      particleColors[i * 3 + 1] = color.g;
      particleColors[i * 3 + 2] = color.b;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.012,
      vertexColors: true,
      transparent: true,
      opacity: colors.particleOpacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    const linePositions = new Float32Array(particleCount * 6);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: colors.primary,
      transparent: true,
      opacity: colors.lineOpacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lines);

    const rings: THREE.Mesh[] = [];
    for (let i = 0; i < 2; i++) {
      const ringGeo = new THREE.TorusGeometry(3.0 + i * 0.6, 0.005, 8, 100);
      const ringMat = new THREE.MeshBasicMaterial({
        color: colors.primary,
        transparent: true,
        opacity: colors.ringOpacity,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI * 0.4 + i * 0.3;
      ring.rotation.y = i * 0.5;
      rings.push(ring);
      scene.add(ring);
    }

    const clock = new THREE.Clock();
    let animId = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      camera.position.x += (mx * 0.8 - camera.position.x) * 0.03;
      camera.position.y += (-my * 0.8 - camera.position.y) * 0.03;
      camera.lookAt(0, 0, 0);

      ico.rotation.x = t * 0.1 + my * 0.3;
      ico.rotation.y = t * 0.15 + mx * 0.3;
      icoMat.opacity = colors.wireOpacity + Math.sin(t * 1.5) * 0.04;

      const pulseDecay = Math.max(0, clickPulseRef.current);
      clickPulseRef.current *= 0.95;

      const posArr = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const bx = basePositions[i * 3];
        const by = basePositions[i * 3 + 1];
        const bz = basePositions[i * 3 + 2];

        const wave = Math.sin(t * 0.5 + bx * 0.3) * 0.1;
        const pulse = pulseDecay * 0.3;

        posArr[i * 3] = bx + wave + (bx * pulse);
        posArr[i * 3 + 1] = by + Math.sin(t * 0.4 + by * 0.3) * 0.1 + (by * pulse);
        posArr[i * 3 + 2] = bz + (bz * pulse);
      }
      particleGeo.attributes.position.needsUpdate = true;

      particles.rotation.y = t * 0.03 + mx * 0.1;
      particles.rotation.x = t * 0.01 + my * 0.05;

      rings.forEach((ring, i) => {
        ring.rotation.x += 0.001 * (i + 1);
        ring.rotation.z += 0.0005 * (i + 1);
      });

      const lineArr = lineGeo.attributes.position.array as Float32Array;
      let lineIdx = 0;
      const maxLines = particleCount;

      for (let i = 0; i < Math.min(80, particleCount); i++) {
        for (let j = i + 1; j < Math.min(80, particleCount); j++) {
          if (lineIdx >= maxLines * 2) break;
          const dx = posArr[i * 3] - posArr[j * 3];
          const dy = posArr[i * 3 + 1] - posArr[j * 3 + 1];
          const dz = posArr[i * 3 + 2] - posArr[j * 3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < 1.8) {
            lineArr[lineIdx * 3] = posArr[i * 3];
            lineArr[lineIdx * 3 + 1] = posArr[i * 3 + 1];
            lineArr[lineIdx * 3 + 2] = posArr[i * 3 + 2];
            lineIdx++;
            lineArr[lineIdx * 3] = posArr[j * 3];
            lineArr[lineIdx * 3 + 1] = posArr[j * 3 + 1];
            lineArr[lineIdx * 3 + 2] = posArr[j * 3 + 2];
            lineIdx++;
          }
        }
      }
      for (let k = lineIdx; k < particleCount * 2; k++) {
        lineArr[k * 3] = 0;
        lineArr[k * 3 + 1] = 0;
        lineArr[k * 3 + 2] = 0;
      }
      lineGeo.attributes.position.needsUpdate = true;
      lineGeo.setDrawRange(0, lineIdx);

      renderer.render(scene, camera);
    };
    animate();

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.targetY = (e.clientY / window.innerHeight) * 2 - 1;
    };

    const onClick = () => {
      clickPulseRef.current = 1;
    };

    window.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('click', onClick);

    const onResize = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    const observer = new MutationObserver(() => {
      const c = getThemeColors();
      icoMat.color.setHex(c.primary);
      lineMat.color.setHex(c.primary);
      particleMat.opacity = c.particleOpacity;
      rings.forEach((r) => {
        (r.material as THREE.MeshBasicMaterial).color.setHex(c.primary);
        (r.material as THREE.MeshBasicMaterial).opacity = c.ringOpacity;
      });
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('click', onClick);
      window.removeEventListener('resize', onResize);
      observer.disconnect();
      renderer.dispose();
      icoGeo.dispose();
      icoMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      rings.forEach((r) => {
        (r.geometry as THREE.BufferGeometry).dispose();
        (r.material as THREE.Material).dispose();
      });
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="hero-canvas"
      aria-hidden="true"
      style={{ width: '100%', height: '100%' }}
    />
  );
}
