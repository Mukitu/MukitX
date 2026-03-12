import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, OrbitControls } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

function AnimatedShapes() {
  const sphereRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      sphereRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <>
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <Sphere args={[1, 64, 64]} position={[2, 0, 0]}>
          <MeshDistortMaterial
            color="#2563EB"
            attach="material"
            distort={0.4}
            speed={2}
            roughness={0.2}
            metalness={0.8}
          />
        </Sphere>
      </Float>

      <Float speed={3} rotationIntensity={2} floatIntensity={1.5}>
        <mesh position={[-2, 1, -1]}>
          <octahedronGeometry args={[0.8, 0]} />
          <meshStandardMaterial color="#38BDF8" wireframe />
        </mesh>
      </Float>

      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={3}>
        <mesh position={[0, -1.5, -2]}>
          <torusKnotGeometry args={[0.5, 0.2, 128, 16]} />
          <meshStandardMaterial color="#0F172A" metalness={0.9} roughness={0.1} />
        </mesh>
      </Float>
    </>
  );
}

export default function ThreeHero() {
  return (
    <div className="absolute inset-0 -z-10 opacity-50 dark:opacity-30">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <AnimatedShapes />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}
