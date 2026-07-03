import { useRef, useState, Suspense, Component } from 'react';
import type { ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../hooks/useTheme';

/* ── WebGL Error Boundary — prevents GPU crash from propagating ── */
interface EBState { hasError: boolean }
class WebGLErrorBoundary extends Component<{ children: ReactNode; fallback?: ReactNode }, EBState> {
  constructor(props: { children: ReactNode; fallback?: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(err: Error) {
    // Silently swallow WebGL errors
    if (process.env.NODE_ENV !== 'production') console.warn('[Hero3D] WebGL error:', err.message);
  }
  render() {
    if (this.state.hasError) return this.props.fallback ?? null;
    return this.props.children;
  }
}

/* ── Liquid Crystal Mesh (reduced geometry for performance) ── */
function LiquidCrystal() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useFrame((state) => {
    if (!meshRef.current) return;
    // Gentle self-rotation
    meshRef.current.rotation.y += 0.003;
    meshRef.current.rotation.x += 0.001;
    // Smooth mouse-tracking
    const targetX = (state.pointer.x * Math.PI) / 5;
    const targetY = (state.pointer.y * Math.PI) / 5;
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetX, 0.025);
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, -targetY, 0.025);
  });

  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.8} floatingRange={[-0.08, 0.08]}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
        scale={hovered ? 1.08 : 1}
      >
        {/* Reduced detail: 32 instead of 128 — dramatically reduces GPU load */}
        <icosahedronGeometry args={[1.5, 32]} />
        <MeshDistortMaterial
          color={isDark ? '#a78bfa' : '#6d28d9'}
          envMapIntensity={isDark ? 0.8 : 1.5}
          clearcoat={1}
          clearcoatRoughness={0.15}
          metalness={0.8}
          roughness={0.15}
          distort={0.35}
          speed={2}
        />
      </mesh>
    </Float>
  );
}

/* ── Suppress THREE.Clock warning globally ── */
const origWarn = console.warn;
console.warn = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('THREE.Clock')) return;
  origWarn(...args);
};

/* ── Main Hero3D Export ── */
export default function Hero3D() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [webglFailed, setWebglFailed] = useState(false);

  if (webglFailed) return null;



  return (
    <WebGLErrorBoundary fallback={null}>
      <div
        className="absolute inset-0 z-0 pointer-events-auto"
        style={{ mixBlendMode: 'screen', opacity: 0.55 }}
      >
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          gl={{
            powerPreference: 'high-performance',
            antialias: false, // Off for perf
            alpha: true,
            preserveDrawingBuffer: false,
          }}
          dpr={[1, 1.5]} // Cap pixel ratio for performance
          frameloop="always"
          onCreated={({ gl }) => {
            // Listen for WebGL context loss
            const canvas = gl.domElement;
            canvas.addEventListener('webglcontextlost', (e) => {
              e.preventDefault();
              setWebglFailed(true);
            }, false);
          }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={isDark ? 0.25 : 0.9} />
            <directionalLight position={[8, 8, 4]} intensity={isDark ? 1.8 : 3.5} color="#f472b6" />
            <directionalLight position={[-8, -8, -4]} intensity={isDark ? 1.5 : 3} color="#38bdf8" />
            <LiquidCrystal />
            {/* Environment preset removed — was fetching HDR from external CDN causing production crash */}
          </Suspense>
        </Canvas>
      </div>
    </WebGLErrorBoundary>
  );
}
