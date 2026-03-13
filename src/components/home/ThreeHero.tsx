import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial, Float, OrbitControls } from '@react-three/drei';
import { useRef, useMemo, useState, Suspense } from 'react';
import * as THREE from 'three';

function ParticleConstellation() {
  const ref = useRef<THREE.Points>(null);
  
  // Generate random points for the constellation
  const count = 2000;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.05;
      ref.current.rotation.x = state.clock.getElapsedTime() * 0.03;
    }
  });

  return (
    <group>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#3B82F6"
          size={0.05}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
      
      {/* Central Glowing Core */}
      <Float speed={2} rotationIntensity={2} floatIntensity={2}>
        <mesh>
          <icosahedronGeometry args={[1, 15]} />
          <meshStandardMaterial 
            color="#60A5FA" 
            wireframe 
            transparent 
            opacity={0.3} 
            emissive="#3B82F6"
            emissiveIntensity={2}
          />
        </mesh>
      </Float>

      {/* Secondary Floating Elements */}
      <Float speed={1.5} rotationIntensity={1} floatIntensity={1}>
        <mesh position={[4, 2, -2]}>
          <octahedronGeometry args={[0.5, 0]} />
          <meshStandardMaterial color="#93C5FD" wireframe />
        </mesh>
      </Float>

      <Float speed={1.8} rotationIntensity={1.5} floatIntensity={1.2}>
        <mesh position={[-4, -2, -1]}>
          <tetrahedronGeometry args={[0.4, 0]} />
          <meshStandardMaterial color="#2563EB" wireframe />
        </mesh>
      </Float>
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#3B82F6" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#1D4ED8" />
      <spotLight 
        position={[0, 5, 10]} 
        angle={0.3} 
        penumbra={1} 
        intensity={2} 
        castShadow 
        color="#60A5FA"
      />
      <ParticleConstellation />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
    </>
  );
}

export default function ThreeHero() {
  return (
    <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
      
      {/* Overlay Gradients for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-slate-950/50 to-slate-950 pointer-events-none" />
    </div>
  );
}
