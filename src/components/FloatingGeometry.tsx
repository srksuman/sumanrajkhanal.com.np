import { useEffect, useRef } from 'react';
import * as THREE from 'three';

type GeoType = 'octahedron' | 'tetrahedron' | 'dodecahedron' | 'icosahedron';

interface FloatingGeometryProps {
  type?: GeoType;
  size?: number;
  color?: number;
  className?: string;
}

const GEO_MAP: Record<GeoType, (size: number) => THREE.BufferGeometry> = {
  octahedron: (s) => new THREE.OctahedronGeometry(s, 0),
  tetrahedron: (s) => new THREE.TetrahedronGeometry(s, 0),
  dodecahedron: (s) => new THREE.DodecahedronGeometry(s, 0),
  icosahedron: (s) => new THREE.IcosahedronGeometry(s, 0),
};

function getThemeColor(color: number) {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  if (!isLight) return color;
  if (color === 0x7b68ee) return 0x4a37a0;
  return 0x8a6d1b;
}

export default function FloatingGeometry({
  type = 'octahedron',
  size = 0.8,
  color = 0xc9a84c,
  className,
}: FloatingGeometryProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const themeColor = getThemeColor(color);
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      canvas.offsetWidth / canvas.offsetHeight,
      0.1,
      50,
    );
    camera.position.set(0, 0, 3);

    const geo = GEO_MAP[type](size);
    const mat = new THREE.MeshBasicMaterial({
      color: themeColor,
      wireframe: true,
      transparent: true,
      opacity: isLight ? 0.25 : 0.15,
    });
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    const edges = new THREE.EdgesGeometry(geo);
    const edgeMat = new THREE.LineBasicMaterial({
      color: themeColor,
      transparent: true,
      opacity: isLight ? 0.4 : 0.25,
    });
    const edgeLine = new THREE.LineSegments(edges, edgeMat);
    scene.add(edgeLine);

    const pCount = 30;
    const pPositions = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      pPositions[i * 3] = (Math.random() - 0.5) * 3;
      pPositions[i * 3 + 1] = (Math.random() - 0.5) * 3;
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * 3;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const pMat = new THREE.PointsMaterial({
      color: themeColor,
      size: 0.02,
      transparent: true,
      opacity: isLight ? 0.5 : 0.3,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const pts = new THREE.Points(pGeo, pMat);
    scene.add(pts);

    const clock = new THREE.Clock();
    let animId = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      const mx = mouseRef.current.x;

      mesh.rotation.x = t * 0.2 + mx * 0.3;
      mesh.rotation.y = t * 0.3;
      edgeLine.rotation.x = mesh.rotation.x;
      edgeLine.rotation.y = mesh.rotation.y;

      const yOffset = Math.sin(t * 0.8) * 0.15;
      mesh.position.y = yOffset;
      edgeLine.position.y = yOffset;

      mat.opacity = (isLight ? 0.2 : 0.12) + Math.sin(t * 1.2) * 0.05;
      edgeMat.opacity = (isLight ? 0.35 : 0.2) + Math.sin(t * 1.2) * 0.08;

      pts.rotation.y = t * 0.05;

      renderer.render(scene, camera);
    };
    animate();

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
    };
    window.addEventListener('mousemove', onMouseMove);

    const onResize = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    const observer = new MutationObserver(() => {
      const c = getThemeColor(color);
      const lt = document.documentElement.getAttribute('data-theme') === 'light';
      mat.color.setHex(c);
      mat.opacity = lt ? 0.25 : 0.15;
      edgeMat.color.setHex(c);
      edgeMat.opacity = lt ? 0.4 : 0.25;
      pMat.color.setHex(c);
      pMat.opacity = lt ? 0.5 : 0.3;
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      observer.disconnect();
      renderer.dispose();
      geo.dispose();
      mat.dispose();
      edges.dispose();
      edgeMat.dispose();
      pGeo.dispose();
      pMat.dispose();
    };
  }, [type, size, color]);

  return (
    <div className={`floating-geo-wrapper ${className || ''}`}>
      <canvas ref={canvasRef} className="floating-geo-canvas" aria-hidden="true" />
    </div>
  );
}
