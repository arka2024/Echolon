'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';

interface AdvisorySceneProps {
  cropStage: string;
}

function PlantModel({ cropStage }: AdvisorySceneProps) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y += 0.005;
    }
  });

  // Simple procedural generation based on stage
  const scale = useMemo(() => {
    switch (cropStage) {
      case 'seedling': return 0.5;
      case 'vegetative': return 1.2;
      case 'flowering': return 1.8;
      case 'harvest': return 2.2;
      default: return 1;
    }
  }, [cropStage]);

  return (
    <group ref={group} scale={scale} position={[0, -1, 0]}>
      {/* Soil mound */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <cylinderGeometry args={[1, 1.5, 0.4, 32]} />
        <meshStandardMaterial color="#3E2723" roughness={1} />
      </mesh>

      {/* Trunk/Stem */}
      <mesh position={[0, 1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.1, 0.15, 2, 8]} />
        <meshStandardMaterial color="#558B2F" roughness={0.7} />
      </mesh>

      {/* Leaves based on stage */}
      {cropStage !== 'seedling' && (
        <group position={[0, 2, 0]}>
          {Array.from({ length: cropStage === 'harvest' ? 8 : (cropStage === 'flowering' ? 6 : 4) }).map((_, i, arr) => {
            const angle = (i / arr.length) * Math.PI * 2;
            return (
              <mesh 
                key={i} 
                rotation={[Math.PI / 4, angle, 0]} 
                position={[Math.sin(angle) * 0.5, -0.2, Math.cos(angle) * 0.5]}
                castShadow 
                receiveShadow
              >
                <coneGeometry args={[0.8, 2, 4]} />
                <meshStandardMaterial color={cropStage === 'harvest' ? '#8BC34A' : '#4CAF50'} roughness={0.5} />
              </mesh>
            );
          })}
        </group>
      )}

      {/* Fruits if harvest stage */}
      {cropStage === 'harvest' && (
        <group position={[0, 1.5, 0]}>
          <mesh castShadow receiveShadow>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial color="#FF9800" roughness={0.4} />
          </mesh>
          <mesh position={[0.2, -0.1, 0.2]} castShadow receiveShadow>
            <sphereGeometry args={[0.25, 16, 16]} />
            <meshStandardMaterial color="#FF5722" roughness={0.4} />
          </mesh>
        </group>
      )}
    </group>
  );
}

export function AdvisoryScene({ cropStage }: AdvisorySceneProps) {
  return (
    <Canvas camera={{ position: [3, 2, 4], fov: 50 }} className="w-full h-full bg-[#111]">
      <ambientLight intensity={0.6} />
      <directionalLight 
        position={[2, 5, 2]} 
        intensity={2} 
      />
      <pointLight position={[-2, 2, -2]} intensity={0.5} color="#4CAF50" />
      
      <PlantModel cropStage={cropStage} />

      <OrbitControls 
        enablePan={false}
        enableZoom={true}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
        autoRotate
        autoRotateSpeed={1}
      />
      <Environment preset="studio" />
    </Canvas>
  );
}
