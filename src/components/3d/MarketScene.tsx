'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Line, Sphere, OrbitControls, Billboard, Text } from '@react-three/drei';
import * as THREE from 'three';

const nodes = [
  { position: [-6, Math.random() - 0.5, 0], label: "Your Farm" },
  { position: [-2, Math.random() * 2 - 1, 1], label: "Collection Center A" },
  { position: [-2, Math.random() * 2 - 1, -1], label: "Collection Center B" },
  { position: [2, Math.random() * 2 - 1, 0.5], label: "Processing Unit 1" },
  { position: [2, Math.random() * 2 - 1, -0.5], label: "Processing Unit 2" },
  { position: [6, Math.random() - 0.5, 0], label: "Global Market" }
];

const paths = [
  [0, 1], [0, 2],
  [1, 3], [1, 4],
  [2, 3], [2, 4],
  [3, 5], [4, 5]
];

function NetworkPipeline() {
  const group = useRef<THREE.Group>(null);
  
  // Create moving particles along the paths
  const particles = useMemo(() => {
    return Array.from({ length: 40 }).map(() => {
      const pathIndex = Math.floor(Math.random() * paths.length);
      const speed = 0.005 + Math.random() * 0.005;
      return { pathIndex, progress: Math.random(), speed };
    });
  }, []);

  const particleMeshRef = useRef<THREE.InstancedMesh>(null);

  useFrame(() => {
    if (!particleMeshRef.current) return;
    
    particles.forEach((p, i) => {
      p.progress += p.speed;
      if (p.progress > 1) {
        p.progress = 0;
        p.pathIndex = Math.floor(Math.random() * paths.length);
      }
      
      const start = nodes[paths[p.pathIndex][0]].position;
      const end = nodes[paths[p.pathIndex][1]].position;
      
      const vStart = new THREE.Vector3(...start);
      const vEnd = new THREE.Vector3(...end);
      
      const currentPos = new THREE.Vector3().lerpVectors(vStart, vEnd, p.progress);
      
      const matrix = new THREE.Matrix4();
      matrix.setPosition(currentPos);
      
      particleMeshRef.current!.setMatrixAt(i, matrix);
    });
    
    particleMeshRef.current.instanceMatrix.needsUpdate = true;
    
    if (group.current) {
        group.current.rotation.y += 0.001;
    }
  });

  return (
    <group ref={group} position={[0, 0, 0]} scale={0.8}>
      {/* Nodes */}
      {nodes.map((node, i) => (
        <group key={i} position={node.position as [number, number, number]}>
          <Sphere args={[0.2, 16, 16]}>
            <meshStandardMaterial color={i === 0 || i === nodes.length - 1 ? "#4CAF50" : "#A6AEBF"} roughness={0.2} metalness={0.8} emissive={i === 0 || i === nodes.length - 1 ? "#4CAF50" : "#A6AEBF"} emissiveIntensity={0.2} />
          </Sphere>
          
          <Billboard follow={true} position={[0, 0.4, 0]}>
             <Text fontSize={0.25} color="#E2E8F0" anchorX="center" anchorY="bottom">
                {node.label}
             </Text>
          </Billboard>
        </group>
      ))}

      {/* Path lines */}
      {paths.map((path, i) => {
        const start = nodes[path[0]].position;
        const end = nodes[path[1]].position;
        return (
          <Line
            key={i}
            points={[new THREE.Vector3(...start), new THREE.Vector3(...end)]}
            color="#334155"
            lineWidth={2}
            transparent
            opacity={0.5}
          />
        );
      })}

      {/* Flow Particles */}
      <instancedMesh ref={particleMeshRef} args={[undefined, undefined, particles.length]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshBasicMaterial color="#4CAF50" transparent opacity={0.8} />
      </instancedMesh>
    </group>
  );
}

export function MarketScene() {
  return (
    <div className="absolute inset-0 cursor-grab active:cursor-grabbing bg-[#030614]">
      <Canvas camera={{ position: [0, 2, 8], fov: 45 }}>
        <fog attach="fog" args={['#030614', 5, 20]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[0, 5, 0]} intensity={1.5} color="#4CAF50" distance={15} />
        
        <NetworkPipeline />
        
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.2}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  );
}
