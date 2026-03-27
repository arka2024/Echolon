'use client';

import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Line, OrbitControls, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { random } from 'maath';

interface FinanceSceneProps {
  hectares: number;
  yieldTons: number;
}

function GrowthCurve({ hectares, yieldTons }: FinanceSceneProps) {
  const lineRef = useRef<THREE.Line>(null);
  
  // Create a curve based on inputs
  const curve = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const steps = 50;
    
    // Base curve shape (exponential growth)
    // Scale by inputs
    const heightScale = Math.max(0.2, (hectares * yieldTons) / 200000);
    
    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * 10 - 5; // From -5 to 5
      const progress = i / steps;
      
      // Calculate y using exponential + noise
      const y = Math.pow(progress * 2.5, 2) * heightScale - 2;
      const z = Math.sin(x * 2) * 0.5;
      
      points.push(new THREE.Vector3(x, y, z));
    }
    
    return points;
  }, [hectares, yieldTons]);

  // Dynamic particles following the curve
  const [positions] = useMemo(() => {
    const count = 500;
    const pos = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
        const x = (Math.random() * 10) - 5;
        const normalizedX = (x + 5) / 10;
        const heightScale = Math.max(0.2, (hectares * yieldTons) / 200000);
        
        // Base curve y
        const baseY = Math.pow(normalizedX * 2.5, 2) * heightScale - 2;
        
        // Add random scatter around the curve
        const scatterRange = 0.5 + (normalizedX * 1.5); // More scatter at the end
        const scatterY = (Math.random() - 0.5) * scatterRange;
        const scatterZ = (Math.random() - 0.5) * scatterRange;
        
        pos[i*3] = x;
        pos[i*3+1] = baseY + scatterY;
        pos[i*3+2] = Math.sin(x * 2) * 0.5 + scatterZ;
    }
    
    return [pos];
  }, [hectares, yieldTons]);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (pointsRef.current) {
        pointsRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
        pointsRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
    if (lineRef.current) {
        lineRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
        lineRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group position={[0, -1, 0]} rotateX={0.2} rotateY={-0.3}>
      <Line
        ref={lineRef as any}
        points={curve}
        color="#4CAF50"
        lineWidth={3}
        dashed={false}
      />
      
      <Points ref={pointsRef} positions={positions as any} stride={3}>
        <PointMaterial
          transparent
          color="#81C784"
          size={0.06}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>

      {/* Grid Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
        <planeGeometry args={[20, 20, 20, 20]} />
        <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.05} />
      </mesh>
    </group>
  );
}

export function FinanceScene({ hectares, yieldTons }: FinanceSceneProps) {
  return (
    <div className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing bg-zinc-950">
      <Canvas camera={{ position: [0, 2, 8], fov: 45 }}>
        <fog attach="fog" args={['#09090b', 8, 15]} />
        <ambientLight intensity={0.5} />
        
        <GrowthCurve hectares={hectares} yieldTons={yieldTons} />

        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
      
      {/* Abstract Grid overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,#09090b_100%)] opacity-80" />
    </div>
  );
}
