"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

function Particles({ count, tier }: { count: number; tier: string }) {
  const mesh = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      position: [
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6 - 2,
      ] as [number, number, number],
      scale: Math.random() * 0.08 + 0.02,
      speed: Math.random() * 0.3 + 0.1,
      offset: Math.random() * Math.PI * 2,
    }));
  }, [count]);

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const t = clock.getElapsedTime();
    particles.forEach((p, i) => {
      dummy.position.set(
        p.position[0] + Math.sin(t * p.speed + p.offset) * 0.3,
        p.position[1] + Math.cos(t * p.speed * 0.8 + p.offset) * 0.4,
        p.position[2]
      );
      dummy.scale.setScalar(p.scale);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, tier === "high" ? 16 : 8, tier === "high" ? 16 : 8]} />
      <meshBasicMaterial color="#00A88F" transparent opacity={0.6} />
    </instancedMesh>
  );
}

function GlowOrb() {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.position.y = Math.sin(t * 0.3) * 0.5;
    ref.current.rotation.x = t * 0.1;
    ref.current.rotation.z = t * 0.05;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <Sphere ref={ref} args={[1.2, 32, 32]} position={[2, 0, -1]}>
        <MeshDistortMaterial
          color="#00A88F"
          transparent
          opacity={0.15}
          distort={0.4}
          speed={2}
          roughness={0}
        />
      </Sphere>
    </Float>
  );
}

interface FloatingParticlesProps {
  tier?: "high" | "mid" | "low";
  className?: string;
}

export function FloatingParticles({ tier = "mid", className = "" }: FloatingParticlesProps) {
  const count = tier === "high" ? 80 : tier === "mid" ? 40 : 20;

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`} aria-hidden="true">
      <Canvas
        dpr={[1, tier === "high" ? 2 : 1.5]}
        gl={{ antialias: tier === "high", alpha: true }}
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.5} />
        <Particles count={count} tier={tier} />
        {tier !== "low" && <GlowOrb />}
        {tier === "high" && (
          <EffectComposer>
            <Bloom
              luminanceThreshold={0.2}
              luminanceSmoothing={0.9}
              intensity={0.4}
            />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
