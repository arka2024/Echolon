'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

function StylizedTree() {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <group ref={group} position={[0, -1, 0]}>
      {/* Trunk */}
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.4, 3, 8]} />
        <meshStandardMaterial color="#3E2723" roughness={0.9} />
      </mesh>

      {/* Foliage Layers - stylized oil palm fronds */}
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
        <mesh position={[0, 3.5, 0]} castShadow receiveShadow>
          <coneGeometry args={[2, 1.5, 6]} />
          <meshStandardMaterial color="#2E7D32" roughness={0.5} />
        </mesh>
      </Float>
      
      <Float speed={2.5} rotationIntensity={0.1} floatIntensity={0.2} floatingRange={[-0.1, 0.1]}>
        <mesh position={[0, 4.2, 0]} castShadow receiveShadow>
          <coneGeometry args={[1.5, 1.2, 6]} />
          <meshStandardMaterial color="#4CAF50" roughness={0.4} />
        </mesh>
      </Float>

      <Float speed={3} rotationIntensity={0.1} floatIntensity={0.2} floatingRange={[-0.05, 0.05]}>
        <mesh position={[0, 4.8, 0]} castShadow receiveShadow>
          <coneGeometry args={[1, 1, 6]} />
          <meshStandardMaterial color="#81C784" roughness={0.3} />
        </mesh>
      </Float>

      {/* Floating data nodes / seeds */}
      {Array.from({ length: 8 }).map((_, i) => (
        <Float key={i} speed={1 + Math.random() * 2} rotationIntensity={2} floatIntensity={2}>
          <mesh 
            position={[
              (Math.random() - 0.5) * 4,
              2 + Math.random() * 3,
              (Math.random() - 0.5) * 4
            ]}
          >
            <octahedronGeometry args={[0.15]} />
            <meshStandardMaterial color="#A5D6A7" emissive="#A5D6A7" emissiveIntensity={0.5} wireframe={Math.random() > 0.5} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.01, 0]} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#1a1a1a" roughness={1} depthWrite={false} transparent opacity={0.4} />
    </mesh>
  );
}

export function HeroScene() {
  return (
    <div className="w-full h-[600px] lg:h-full cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [5, 3, 5], fov: 45 }}>
        <fog attach="fog" args={['#0a0a0a', 5, 15]} />
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[5, 10, 5]} 
          intensity={1.5} 
        />
        <pointLight position={[-5, 5, -5]} intensity={0.5} color="#4CAF50" />
        
        <StylizedTree />
        <Ground />
        
        <Sparkles 
          count={100} 
          scale={8} 
          size={2} 
          speed={0.4} 
          opacity={0.2} 
          color="#A5D6A7" 
        />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
          autoRotate
          autoRotateSpeed={0.5}
        />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
