import { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Float, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../hooks/useTheme';

function LiquidCrystal() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);
  const { theme } = useTheme();
  
  const isDark = theme === 'dark';

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle rotation
      meshRef.current.rotation.y += 0.002;
      meshRef.current.rotation.x += 0.001;
      
      // Mouse interaction (lerp rotation towards pointer)
      const targetX = (state.pointer.x * Math.PI) / 4;
      const targetY = (state.pointer.y * Math.PI) / 4;
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetX, 0.02);
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, -targetY, 0.02);
    }
  });

  return (
    <Float
      speed={2} // Animation speed, defaults to 1
      rotationIntensity={0.5} // XYZ rotation intensity, defaults to 1
      floatIntensity={1} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
      floatingRange={[-0.1, 0.1]} // Range of y-axis values the object will float within, defaults to [-0.1,0.1]
    >
      <mesh
        ref={meshRef}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
        scale={hovered ? 1.1 : 1}
      >
        <icosahedronGeometry args={[1.5, 128]} />
        <MeshDistortMaterial
          color={isDark ? '#a78bfa' : '#6d28d9'}
          envMapIntensity={isDark ? 1 : 2}
          clearcoat={1}
          clearcoatRoughness={0.1}
          metalness={0.9}
          roughness={0.1}
          distort={0.4}
          speed={3}
        />
      </mesh>
    </Float>
  );
}

export default function Hero3D() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="absolute inset-0 z-0 pointer-events-auto mix-blend-screen opacity-60">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={isDark ? 0.2 : 0.8} />
          <directionalLight position={[10, 10, 5]} intensity={isDark ? 2 : 4} color="#f472b6" />
          <directionalLight position={[-10, -10, -5]} intensity={isDark ? 2 : 4} color="#38bdf8" />
          <LiquidCrystal />
          <Environment preset={isDark ? 'night' : 'city'} />
          <ContactShadows position={[0, -2, 0]} opacity={0.5} scale={10} blur={2} far={4} />
        </Suspense>
      </Canvas>
    </div>
  );
}
