import { useRef, useMemo, Suspense, lazy, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';

// Lazy-load Three.js canvas to avoid blocking initial render
const LazyCanvas = lazy(() =>
  import('@react-three/fiber').then((mod) => ({ default: mod.Canvas }))
);

/**
 * Minimal 3D scene for the hero section.
 * Features floating geometric shapes with subtle scroll-driven rotation.
 * Customize: Change shape count, colors, speed, or geometry types below.
 */

function FloatingShape({
  position,
  rotation,
  scale,
  speed,
  type,
  index,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  speed: number;
  type: string;
  index: number;
}) {
  const meshRef = useRef<any>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    // Each shape floats independently — customize speed multipliers
    meshRef.current.rotation.x = rotation[0] + t * speed * 0.3;
    meshRef.current.rotation.z = rotation[2] + t * speed * 0.2;
    meshRef.current.position.y = position[1] + Math.sin(t * speed + index) * 0.3;
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      {type === 'octahedron' ? (
        <octahedronGeometry args={[1, 0]} />
      ) : (
        <icosahedronGeometry args={[1, 0]} />
      )}
      {/* Wireframe material — change color, opacity, or switch to meshStandardMaterial */}
      <meshBasicMaterial
        color="#ffffff"
        wireframe
        transparent
        opacity={0.15}
      />
    </mesh>
  );
}

function FloatingShapes() {
  const groupRef = useRef<any>(null);
  const scrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      scrollY.current = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    // Subtle scroll-driven rotation — customize multipliers for feel
    groupRef.current.rotation.y = t * 0.08 + scrollY.current * 0.0003;
    groupRef.current.rotation.x = Math.sin(t * 0.1) * 0.1 + scrollY.current * 0.0001;
  });

  // Generate random positions for shapes — customizable count and spread
  const shapes = useMemo(() => {
    const items = [];
    const count = 12; // Number of floating shapes
    for (let i = 0; i < count; i++) {
      items.push({
        position: [
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 4,
        ] as [number, number, number],
        rotation: [
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI,
        ] as [number, number, number],
        scale: 0.08 + Math.random() * 0.15,
        speed: 0.2 + Math.random() * 0.5,
        type: Math.random() > 0.5 ? 'octahedron' : 'icosahedron',
      });
    }
    return items;
  }, []);

  return (
    <group ref={groupRef}>
      {shapes.map((shape, i) => (
        <FloatingShape key={i} {...shape} index={i} />
      ))}
    </group>
  );
}

/**
 * HeroScene — a Three.js canvas overlay for the hero section.
 * Lazy-loaded after initial paint. Respects prefers-reduced-motion.
 * Customize: Adjust camera position, dpr, shape count in FloatingShapes.
 */
export function HeroScene() {
  const [shouldRender, setShouldRender] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check reduced motion preference
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mql.matches) {
      setPrefersReducedMotion(true);
      return;
    }

    // Lazy-load: only render Three.js after initial paint
    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    if (typeof window.requestIdleCallback === 'function') {
      idleId = window.requestIdleCallback(() => setShouldRender(true));
    } else {
      timeoutId = setTimeout(() => setShouldRender(true), 500);
    }

    return () => {
      if (idleId !== undefined) {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  if (prefersReducedMotion || !shouldRender) return null;

  return (
    <div className="absolute inset-0 z-[1] pointer-events-none">
      <Suspense fallback={null}>
        <LazyCanvas
          camera={{ position: [0, 0, 5], fov: 50 }}
          dpr={[1, 1.5]}
          style={{ background: 'transparent' }}
          gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        >
          <ambientLight intensity={0.3} />
          <pointLight position={[5, 5, 5]} intensity={0.5} />
          <FloatingShapes />
        </LazyCanvas>
      </Suspense>
    </div>
  );
}
