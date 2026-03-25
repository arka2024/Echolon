'use client';

import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function NetworkGraph() {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  // Generate random node positions
  const { positions, linesPositions } = useMemo(() => {
    const numNodes = 100;
    const pos = new Float32Array(numNodes * 3);
    const nodes: THREE.Vector3[] = [];
    
    for (let i = 0; i < numNodes; i++) {
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 10;
      const z = (Math.random() - 0.5) * 10;
      
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      
      nodes.push(new THREE.Vector3(x, y, z));
    }

    // Connect nodes that are close to each other
    const lines = [];
    for (let i = 0; i < numNodes; i++) {
        for (let j = i + 1; j < numNodes; j++) {
            if (nodes[i].distanceTo(nodes[j]) < 4) {
                lines.push(
                    nodes[i].x, nodes[i].y, nodes[i].z,
                    nodes[j].x, nodes[j].y, nodes[j].z
                );
            }
        }
    }
    
    return { positions: pos, linesPositions: new Float32Array(lines) };
  }, []);

  useFrame((state) => {
    if (pointsRef.current && linesRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      linesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
      linesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <group position={[0, 0, -5]}>
      {/* Nodes */}
      <Points ref={pointsRef} positions={positions} stride={3}>
        <PointMaterial
          transparent
          color="#4CAF50"
          size={0.15}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
      
      {/* Connections */}
      <lineSegments ref={linesRef}>
          <bufferGeometry>
              <bufferAttribute 
                 attach="attributes-position"
                 args={[linesPositions, 3]}
                 count={linesPositions.length / 3}
              />
          </bufferGeometry>
          <lineBasicMaterial attach="material" color="#81C784" transparent opacity={0.15} />
      </lineSegments>
    </group>
  );
}

export function CommunityScene() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
        <NetworkGraph />
      </Canvas>
    </div>
  );
}
