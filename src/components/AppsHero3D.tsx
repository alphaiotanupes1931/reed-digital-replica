import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Environment } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

const GOLD = "#d4a82a";

const FloatingBox = ({ position, size = 0.6, color = "#ffffff" }: { position: [number, number, number]; size?: number; color?: string }) => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * 0.3;
    ref.current.rotation.y = state.clock.elapsedTime * 0.4;
  });
  return (
    <Float speed={2} rotationIntensity={0.6} floatIntensity={1.2}>
      <mesh ref={ref} position={position}>
        <boxGeometry args={[size, size, size]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
      </mesh>
    </Float>
  );
};

const CenterOrb = () => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.4;
    ref.current.rotation.x += delta * 0.2;
  });
  return (
    <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.8}>
      <mesh ref={ref}>
        <icosahedronGeometry args={[1.4, 4]} />
        <MeshDistortMaterial
          color={GOLD}
          distort={0.35}
          speed={2}
          metalness={0.9}
          roughness={0.15}
        />
      </mesh>
    </Float>
  );
};

const Particles = () => {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(400 * 3);
    for (let i = 0; i < 400; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6 - 2;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.04;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.025} color={GOLD} sizeAttenuation transparent opacity={0.7} />
    </points>
  );
};

const AppsHero3D = () => {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }} dpr={[1, 2]}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <directionalLight position={[-5, -3, 2]} intensity={0.5} color={GOLD} />
        <CenterOrb />
        <FloatingBox position={[-3, 1.5, -1]} size={0.5} color="#ffffff" />
        <FloatingBox position={[3, -1.2, -1]} size={0.4} color={GOLD} />
        <FloatingBox position={[-2.5, -1.8, 0]} size={0.35} color="#222222" />
        <FloatingBox position={[2.8, 1.8, -0.5]} size={0.45} color="#ffffff" />
        <Particles />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
};

export default AppsHero3D;