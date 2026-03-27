import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

const CODE_LINES = [
  'const dev = new SoftwareEngineer();',
  'await dev.initialize({ passion: true });',
  'import { creativity } from "imagination";',
  'while (alive) { code(); learn(); grow(); }',
  'export default function Portfolio() {',
  'git commit -m "building the future"',
  'const skills = [...fullStack, ...devOps];',
  'return <Experience excellence={true} />;',
  'npm run deploy --production',
  'console.log("changing the world ✨");',
];

const BOOT_PHASES = [
  { label: 'Compiling modules', icon: '>' },
  { label: 'Linking dependencies', icon: '$' },
  { label: 'Building assets', icon: '#' },
  { label: 'Initializing runtime', icon: '~' },
  { label: 'Loading portfolio', icon: '::' },
  { label: 'Ready', icon: '✓' },
];

function getLoadingColors() {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  return {
    primary: isLight ? 0x8a6d1b : 0xc9a84c,
    wireOpacity: isLight ? 0.35 : 0.25,
    glowOpacity: isLight ? 0.12 : 0.08,
    particleOpacity: isLight ? 0.7 : 0.5,
    ringBase: isLight ? 0.18 : 0.12,
  };
}

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [currentLine, setCurrentLine] = useState(0);
  const [bootPhase, setBootPhase] = useState(0);
  const [completedPhases, setCompletedPhases] = useState<number[]>([]);

  const stableOnComplete = useCallback(onComplete, [onComplete]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLine((prev) => (prev + 1) % CODE_LINES.length);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const totalDuration = 5000;
    const phaseCount = BOOT_PHASES.length;
    const phaseInterval = totalDuration / phaseCount;

    const timers: ReturnType<typeof setTimeout>[] = [];

    for (let i = 0; i < phaseCount; i++) {
      timers.push(
        setTimeout(() => {
          setBootPhase(i);
          if (i > 0) {
            setCompletedPhases((prev) => [...prev, i - 1]);
          }
        }, i * phaseInterval)
      );
    }

    timers.push(
      setTimeout(() => {
        setCompletedPhases((prev) => [...prev, phaseCount - 1]);
      }, totalDuration)
    );

    timers.push(
      setTimeout(() => {
        setIsVisible(false);
        setTimeout(stableOnComplete, 700);
      }, totalDuration + 600)
    );

    return () => timers.forEach(clearTimeout);
  }, [stableOnComplete]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const colors = getLoadingColors();

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 5);

    const icoGeo = new THREE.IcosahedronGeometry(1.6, 1);
    const icoMat = new THREE.MeshBasicMaterial({
      color: colors.primary,
      wireframe: true,
      transparent: true,
      opacity: colors.wireOpacity,
    });
    const ico = new THREE.Mesh(icoGeo, icoMat);
    scene.add(ico);

    const glowGeo = new THREE.SphereGeometry(0.6, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({
      color: colors.primary,
      transparent: true,
      opacity: colors.glowOpacity,
    });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    scene.add(glow);

    const particleCount = 600;
    const positions = new Float32Array(particleCount * 3);
    const velocities: number[] = [];
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
      velocities.push(
        (Math.random() - 0.5) * 0.003,
        (Math.random() - 0.5) * 0.003,
        (Math.random() - 0.5) * 0.003,
      );
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: colors.primary,
      size: 0.02,
      transparent: true,
      opacity: colors.particleOpacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    const rings: THREE.Mesh[] = [];
    for (let i = 0; i < 3; i++) {
      const ringGeo = new THREE.TorusGeometry(2.2 + i * 0.4, 0.008, 8, 80);
      const ringMat = new THREE.MeshBasicMaterial({
        color: colors.primary,
        transparent: true,
        opacity: colors.ringBase - i * 0.03,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI * 0.3 * i;
      ring.rotation.y = Math.PI * 0.2 * i;
      rings.push(ring);
      scene.add(ring);
    }

    const clock = new THREE.Clock();
    let animId = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      ico.rotation.x = t * 0.15;
      ico.rotation.y = t * 0.2;
      ico.rotation.z = t * 0.1;
      icoMat.opacity = colors.wireOpacity * 0.7 + Math.sin(t * 2) * colors.wireOpacity * 0.3;

      const scale = 0.6 + Math.sin(t * 1.5) * 0.15;
      glow.scale.set(scale, scale, scale);
      glowMat.opacity = colors.glowOpacity * 0.75 + Math.sin(t * 2) * colors.glowOpacity * 0.5;

      rings.forEach((ring, i) => {
        ring.rotation.x += 0.002 * (i + 1);
        ring.rotation.z += 0.001 * (i + 1);
      });

      const posArr = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        posArr[i * 3] += velocities[i * 3];
        posArr[i * 3 + 1] += velocities[i * 3 + 1];
        posArr[i * 3 + 2] += velocities[i * 3 + 2];
        for (let j = 0; j < 3; j++) {
          if (posArr[i * 3 + j] > 6) posArr[i * 3 + j] = -6;
          if (posArr[i * 3 + j] < -6) posArr[i * 3 + j] = 6;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      icoGeo.dispose();
      icoMat.dispose();
      glowGeo.dispose();
      glowMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      rings.forEach((r) => {
        (r.geometry as THREE.BufferGeometry).dispose();
        (r.material as THREE.Material).dispose();
      });
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="loading-screen"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
        >
          <canvas ref={canvasRef} className="loading-canvas" />

          <div className="loading-content">
            <motion.div
              className="loading-terminal"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <span className="loading-terminal-prompt">❯</span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentLine}
                  className="loading-terminal-text"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                >
                  {CODE_LINES[currentLine]}
                </motion.span>
              </AnimatePresence>
              <span className="loading-terminal-cursor">▊</span>
            </motion.div>

            <motion.div
              className="loading-name"
              initial={{ opacity: 0, letterSpacing: '20px' }}
              animate={{ opacity: 1, letterSpacing: '8px' }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Suman Raj Khanal
            </motion.div>

            <motion.div
              className="loading-subtitle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Software Engineer · Full-Stack Developer
            </motion.div>

            <motion.div
              className="boot-sequence"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {BOOT_PHASES.map((phase, i) => {
                const isActive = i === bootPhase;
                const isDone = completedPhases.includes(i);
                const isPhaseVisible = i <= bootPhase;

                return (
                  <AnimatePresence key={i}>
                    {isPhaseVisible && (
                      <motion.div
                        className={`boot-phase ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <span className="boot-phase-icon">
                          {isDone ? '✓' : phase.icon}
                        </span>
                        <span className="boot-phase-label">{phase.label}</span>
                        {isActive && !isDone && (
                          <span className="boot-phase-dots">
                            <span className="dot-1">.</span>
                            <span className="dot-2">.</span>
                            <span className="dot-3">.</span>
                          </span>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                );
              })}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
