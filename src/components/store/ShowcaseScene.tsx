/**
 * ShowcaseScene — lightweight Three.js scene for the product showcase.
 * 
 * Renders a slowly rotating wireframe torus (ring shape) with subtle
 * metallic lighting. Purely decorative — no heavy models.
 * 
 * Customize:
 *  - Change geometry: swap <torusGeometry> with other shapes
 *  - Adjust colors: modify the emissive/color props on the material
 *  - Speed: change rotationSpeed in the useFrame callback
 */
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

function RotatingRing() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.3;
      meshRef.current.rotation.x += delta * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={meshRef}>
        {/* Torus = ring shape. Args: [radius, tube, radialSegments, tubularSegments] */}
        <torusGeometry args={[2.2, 0.15, 32, 100]} />
        <meshStandardMaterial
          color="#c4a0ff"
          emissive="#7c3aed"
          emissiveIntensity={0.4}
          metalness={0.9}
          roughness={0.15}
          wireframe={false}
        />
      </mesh>
      {/* Inner accent ring */}
      <mesh rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[1.6, 0.05, 16, 80]} />
        <meshStandardMaterial
          color="#a78bfa"
          emissive="#7c3aed"
          emissiveIntensity={0.6}
          transparent
          opacity={0.4}
          wireframe
        />
      </mesh>
    </Float>
  );
}

export default function ShowcaseScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      style={{ width: '100%', height: '100%' }}
      gl={{ antialias: true, alpha: true }}
    >
      {/* Lighting — subtle and elegant */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#e9d5ff" />
      <pointLight position={[-3, -3, 2]} intensity={0.5} color="#7c3aed" />
      <pointLight position={[3, 2, -2]} intensity={0.3} color="#c084fc" />

      <RotatingRing />
    </Canvas>
  );
}
