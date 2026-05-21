import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const GOLD = "#d4a82a";

/** Dotted sphere surface — gives the "globe" look */
const GlobeDots = () => {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const count = 2200;
    const arr = new Float32Array(count * 3);
    const radius = 2;
    for (let i = 0; i < count; i++) {
      // Fibonacci sphere distribution
      const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      arr[i * 3] = radius * Math.cos(theta) * Math.sin(phi);
      arr[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
      arr[i * 3 + 2] = radius * Math.cos(phi);
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.12;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.028} color={GOLD} sizeAttenuation transparent opacity={0.95} />
    </points>
  );
};

const GlobeWire = () => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.12;
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1.98, 32, 24]} />
      <meshBasicMaterial color={GOLD} wireframe transparent opacity={0.15} />
    </mesh>
  );
};

const GlobeCore = () => (
  <mesh>
    <sphereGeometry args={[1.9, 48, 48]} />
    <meshStandardMaterial color="#0a0a0a" metalness={0.4} roughness={0.6} />
  </mesh>
);

const OrbitRing = ({ tilt = 0, speed = 0.4, size = 0.18 }: { tilt?: number; speed?: number; size?: number }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * speed;
  });
  return (
    <group rotation={[tilt, 0, 0]} ref={ref}>
      <mesh position={[2.7, 0, 0]}>
        <boxGeometry args={[size, size, size]} />
        <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.2} />
      </mesh>
      {/* faint ring outline */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.7, 0.003, 8, 100]} />
        <meshBasicMaterial color={GOLD} transparent opacity={0.25} />
      </mesh>
    </group>
  );
};

const Scene = () => (
  <>
    <ambientLight intensity={0.5} />
    <directionalLight position={[5, 4, 5]} intensity={1.1} color="#ffffff" />
    <directionalLight position={[-4, -2, -3]} intensity={0.4} color={GOLD} />

    <Float speed={1} rotationIntensity={0} floatIntensity={0.4}>
      <group>
        <GlobeCore />
        <GlobeDots />
        <GlobeWire />
      </group>
    </Float>

    <OrbitRing tilt={0.3} speed={0.5} size={0.18} />
    <OrbitRing tilt={-0.6} speed={-0.35} size={0.14} />
    <OrbitRing tilt={1.1} speed={0.25} size={0.12} />

    <OrbitControls
      enableZoom={false}
      enablePan={false}
      autoRotate
      autoRotateSpeed={0.6}
      rotateSpeed={0.6}
    />
  </>
);

const AppsGlobe3D = () => {
  return (
    <div className="w-full h-full cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [0, 0, 6.5], fov: 45 }} dpr={[1, 2]}>
        <Scene />
      </Canvas>
    </div>
  );
};

export default AppsGlobe3D;