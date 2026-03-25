'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, SoftShadows } from '@react-three/drei';
import * as THREE from 'three';

interface Props {
  sliderPos: number; // 0 to 100
}

function ForestSide({ opacity }: { opacity: number }) {
  const group = useRef<THREE.Group>(null);

  // A messy array of trees for the forest side
  return (
    <group ref={group} scale={opacity}>
      <mesh position={[-2, -1, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#2E7D32" roughness={1} transparent opacity={Math.min(1, opacity * 2)} />
      </mesh>

      {/* Random Pine Trees */}
      {Array.from({ length: 30 }).map((_, i) => (
         <group key={i} position={[
            -1 - Math.random() * 4, 
            -1 + (Math.random() * 0.2), 
            (Math.random() - 0.5) * 8
         ]}>
            <mesh position={[0, 0.5, 0]} castShadow>
               <cylinderGeometry args={[0.1, 0.1, 1]} />
               <meshStandardMaterial color="#4E342E" transparent opacity={Math.min(1, opacity * 2)} />
            </mesh>
            <mesh position={[0, 1.5, 0]} castShadow>
               <coneGeometry args={[0.8, 2]} />
               <meshStandardMaterial color="#1B5E20" transparent opacity={Math.min(1, opacity * 2)} />
            </mesh>
         </group>
      ))}
    </group>
  );
}

function FarmSide({ opacity }: { opacity: number }) {
  const group = useRef<THREE.Group>(null);

  // Ordered array of palm trees for the farm side
  return (
    <group ref={group} scale={opacity}>
      <mesh position={[2, -1, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#7CB342" roughness={0.8} transparent opacity={Math.min(1, opacity * 2)} />
      </mesh>

      {/* Grid of Palm Trees */}
      {[0, 1, 2, 3].map((row) => (
         [0, 1, 2].map((col) => (
            <group key={`farm-${row}-${col}`} position={[
               1 + col * 1.5, 
               -1, 
               -3 + row * 2
            ]}>
               {/* Trunk */}
               <mesh position={[0, 0.8, 0]} castShadow>
                  <cylinderGeometry args={[0.1, 0.15, 1.6]} />
                  <meshStandardMaterial color="#5D4037" transparent opacity={Math.min(1, opacity * 2)} />
               </mesh>
                {/* Leaves */}
               <mesh position={[0, 1.6, 0]} castShadow>
                  <sphereGeometry args={[0.6, 8, 8]} />
                  <meshStandardMaterial color="#689F38" roughness={0.5} transparent opacity={Math.min(1, opacity * 2)} />
               </mesh>
            </group>
         ))
      ))}
    </group>
  );
}

function Scene({ sliderPos }: Props) {
  // sliderPos goes 0 (Forest) to 100 (Farm)
  const forestOpacity = 1 - (sliderPos / 100);
  const farmOpacity = sliderPos / 100;
  
  const group = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (group.current) {
        group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <group ref={group} position={[0, 0, 0]} rotation={[-Math.PI / 8, 0, 0]}>
      {/* Dynamic light based on side bias */}
      <ambientLight intensity={0.4} />
      <directionalLight
        castShadow
        position={[0, 5, 2]}
        intensity={1.5}
        color={forestOpacity > 0.5 ? '#e8f5e9' : '#f1f8e9'}
        shadow-mapSize={[1024, 1024]}
      />

      <group position={[0, -0.5, 0]}>
         <ForestSide opacity={forestOpacity} />
         <FarmSide opacity={farmOpacity} />
         
         {/* Split Divider */}
         <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.05, 4, 10]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} transparent opacity={0.3} />
         </mesh>
      </group>
    </group>
  );
}

export function SustainabilityScene({ sliderPos }: Props) {
  return (
    <div className="absolute inset-0 bg-[#09090b]">
      <Canvas camera={{ position: [0, 4, 10], fov: 40 }} shadows>
        <SoftShadows size={20} samples={10} />
        <fog attach="fog" args={['#09090b', 8, 20]} />
        <Scene sliderPos={sliderPos} />
        <Environment preset="forest" />
      </Canvas>
    </div>
  );
}
