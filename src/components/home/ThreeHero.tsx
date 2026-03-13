import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Float, OrbitControls, Text, MeshDistortMaterial } from '@react-three/drei';
import { useRef, useMemo, Suspense } from 'react';
import * as THREE from 'three';

function FloatingUIPanel({ position, rotation, title, color }: any) {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group position={position} rotation={rotation}>
        {/* Glass Panel */}
        <mesh>
          <planeGeometry args={[2.8, 1.8]} />
          <meshPhysicalMaterial 
            transparent 
            opacity={0.15} 
            roughness={0.05} 
            metalness={0.2} 
            transmission={0.8} 
            thickness={1}
            color={color}
          />
        </mesh>
        {/* Header Bar */}
        <mesh position={[0, 0.75, 0.01]}>
          <planeGeometry args={[2.8, 0.3]} />
          <meshBasicMaterial color={color} transparent opacity={0.3} />
        </mesh>
        {/* Window Controls */}
        <mesh position={[-1.1, 0.75, 0.02]}>
          <circleGeometry args={[0.05, 32]} />
          <meshBasicMaterial color="#ff5f56" />
        </mesh>
        <mesh position={[-0.95, 0.75, 0.02]}>
          <circleGeometry args={[0.05, 32]} />
          <meshBasicMaterial color="#ffbd2e" />
        </mesh>
        <mesh position={[-0.8, 0.75, 0.02]}>
          <circleGeometry args={[0.05, 32]} />
          <meshBasicMaterial color="#27c93f" />
        </mesh>
        {/* Content Title */}
        <Text
          position={[0, 0.2, 0.05]}
          fontSize={0.18}
          color="white"
          maxWidth={2}
          textAlign="center"
          font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff"
        >
          {title}
        </Text>
        {/* Decorative Lines (Code-like) */}
        {[...Array(5)].map((_, i) => (
          <mesh key={i} position={[0, -0.2 - i * 0.15, 0.02]}>
            <planeGeometry args={[2.2 - Math.random() * 0.5, 0.03]} />
            <meshBasicMaterial color="white" transparent opacity={0.1} />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

function DigitalCore() {
  const ref = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <group ref={ref}>
      <mesh>
        <icosahedronGeometry args={[1, 2]} />
        <meshStandardMaterial color="#3B82F6" wireframe transparent opacity={0.4} />
      </mesh>
      <mesh scale={0.8}>
        <icosahedronGeometry args={[1, 1]} />
        <MeshDistortMaterial color="#60A5FA" distort={0.3} speed={2} />
      </mesh>
    </group>
  );
}

function Particles() {
  const count = 1500;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, []);

  return (
    <Points positions={positions} stride={3}>
      <PointMaterial
        transparent
        color="#3B82F6"
        size={0.03}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

export default function ThreeHero() {
  return (
    <div className="absolute inset-0 -z-10 bg-slate-950">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#3B82F6" />
        <spotLight position={[0, 5, 10]} angle={0.3} penumbra={1} intensity={2} color="#60A5FA" />
        
        <Suspense fallback={null}>
          <Particles />
          <DigitalCore />
          
          {/* Floating "Software" UI Panels */}
          <FloatingUIPanel 
            position={[-3.5, 1.5, 0]} 
            rotation={[0, 0.4, 0]} 
            title="User Interface Design" 
            color="#3B82F6"
          />
          <FloatingUIPanel 
            position={[3.5, -1.5, -1]} 
            rotation={[0, -0.4, 0]} 
            title="Cloud Infrastructure" 
            color="#60A5FA"
          />
          <FloatingUIPanel 
            position={[2.5, 2, -2]} 
            rotation={[0.2, -0.2, 0]} 
            title="Data Analytics" 
            color="#2563EB"
          />
          <FloatingUIPanel 
            position={[-2.5, -2.5, -1.5]} 
            rotation={[-0.2, 0.2, 0]} 
            title="Mobile App Dev" 
            color="#1D4ED8"
          />
        </Suspense>

        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
      
      {/* Cinematic Overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(2,6,23,0.8)_100%)] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-transparent to-slate-950/80 pointer-events-none" />
    </div>
  );
}
