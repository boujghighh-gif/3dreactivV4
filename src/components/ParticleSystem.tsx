import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../store';

const COUNT = 10000;

// Shape logic
const getSpherePoints = (count: number, radius: number) => {
  const points = [];
  for (let i = 0; i < count; i++) {
    const phi = Math.acos(-1 + (2 * i) / count);
    const theta = Math.sqrt(count * Math.PI) * phi;
    points.push(
      radius * Math.cos(theta) * Math.sin(phi),
      radius * Math.sin(theta) * Math.sin(phi),
      radius * Math.cos(phi)
    );
  }
  return points;
};

const getHeartPoints = (count: number) => { 
  const points = [];
  for (let i = 0; i < count; i++) {
    const t = Math.random() * Math.PI * 2;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    const scale = 0.15;
    const z = (Math.random() - 0.5) * 4;
    points.push(x * scale, y * scale, z);
  }
  return points;
};

const getFlowerPoints = (count: number) => {
  const points = [];
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const r = Math.sin(5 * theta) + 2; 
    const h = (Math.random() - 0.5) * 1;
    const x = r * Math.cos(theta);
    const z = r * Math.sin(theta);
    const y = h + Math.cos(r * 5) * 0.5;
    points.push(x, y, z);
  }
  return points;
};

const getSaturnPoints = (count: number) => {
  const points = [];
  const sphereCount = Math.floor(count * 0.4);
  const ringCount = count - sphereCount;
  const sphere = getSpherePoints(sphereCount, 1.5);
  points.push(...sphere);
  for (let i = 0; i < ringCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = 2.5 + Math.random() * 2.0;
    points.push(Math.cos(angle) * dist, (Math.random()-0.5)*0.2, Math.sin(angle) * dist);
  }
  return points;
};

const getBuddhaPoints = (count: number) => {
  const points = [];
  const headC = Math.floor(count * 0.2);
  const bodyC = Math.floor(count * 0.5);
  const baseC = count - headC - bodyC;
  const head = getSpherePoints(headC, 0.7);
  head.forEach((p,i) => { if(i%3===1) head[i] += 1.8 }); 
  const body = getSpherePoints(bodyC, 1.4);
  body.forEach((p,i) => { if(i%3===0) body[i] *= 0.8; });
  const base = [];
  for(let i=0; i<baseC; i++) {
    const theta = Math.random() * Math.PI * 2;
    const r = Math.random() * 2.5;
    const y = (Math.random() * 0.5) - 1.5;
    base.push(r * Math.cos(theta), y, r * Math.sin(theta));
  }
  for(let i=0; i<head.length; i++) points.push(head[i]);
  for(let i=0; i<body.length; i++) points.push(body[i]);
  for(let i=0; i<base.length; i++) points.push(base[i]);
  return points;
};

const ParticleSystem: React.FC = () => {
  const { currentTemplate, particleColor, handTension } = useStore();
  const pointsRef = useRef<THREE.Points>(null);
  
  const targetPositions = useMemo(() => new Float32Array(COUNT * 3), []);
  const currentPositions = useMemo(() => new Float32Array(COUNT * 3), []);

  useEffect(() => {
    let pts: number[] = [];
    switch (currentTemplate) {
      case 'heart': pts = getHeartPoints(COUNT); break;
      case 'flower': pts = getFlowerPoints(COUNT); break;
      case 'saturn': pts = getSaturnPoints(COUNT); break;
      case 'buddha': pts = getBuddhaPoints(COUNT); break;
      case 'fireworks': pts = getSpherePoints(COUNT, 0.1); break;
      default: pts = getSpherePoints(COUNT, 2);
    }
    for (let i = 0; i < COUNT * 3; i++) {
        if (i >= pts.length) pts[i] = (Math.random()-0.5); 
        targetPositions[i] = pts[i];
    }
  }, [currentTemplate, targetPositions]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const damp = 4 * delta; 

    // Visual Mechanics
    const isFireworks = currentTemplate === 'fireworks';
    const expansionFactor = isFireworks 
        ? (0.1 + handTension * 15.0) 
        : (1.0 + handTension * 2.0); 

    for (let i = 0; i < COUNT; i++) {
      const ix = i * 3, iy = i * 3 + 1, iz = i * 3 + 2;

      let tx = targetPositions[ix] * expansionFactor;
      let ty = targetPositions[iy] * expansionFactor;
      let tz = targetPositions[iz] * expansionFactor;

      // Add noise on explosion
      if (handTension > 0.1) {
          const noise = isFireworks ? 2.5 : 0.2;
          tx += (Math.random()-0.5) * handTension * noise;
          ty += (Math.random()-0.5) * handTension * noise;
          tz += (Math.random()-0.5) * handTension * noise;
      }

      positions[ix] += (tx - positions[ix]) * damp;
      positions[iy] += (ty - positions[iy]) * damp;
      positions[iz] += (tz - positions[iz]) * damp;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.rotation.y += delta * 0.1;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={COUNT}
          array={currentPositions}
          itemSize={3}
          usage={THREE.DynamicDrawUsage}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color={particleColor}
        transparent={true}
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

export default ParticleSystem;
