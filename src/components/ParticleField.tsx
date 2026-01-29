import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Particles = ({ count = 200 }: { count?: number }) => {
  const mesh = useRef<THREE.Points>(null);
  const mouse = useRef({ x: 0, y: 0 });

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5;
      speeds[i] = Math.random() * 0.02 + 0.005;
    }
    
    return { positions, speeds };
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    
    const positions = mesh.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 1] += particles.speeds[i];
      
      if (positions[i * 3 + 1] > 5) {
        positions[i * 3 + 1] = -5;
      }
    }
    
    mesh.current.geometry.attributes.position.needsUpdate = true;
    mesh.current.rotation.y = state.clock.elapsedTime * 0.02;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#ffffff"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
};

const ParticleField = () => {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        style={{ background: "transparent" }}
      >
        <Particles count={150} />
      </Canvas>
    </div>
  );
};

export default ParticleField;
