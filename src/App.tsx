import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import ParticleSystem from './components/ParticleSystem';
import HandTracker from './components/HandTracker';
import UI from './components/UI';

const App = () => {
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black text-white select-none touch-none">
      
      {/* 3D Scene */}
      <div className="absolute inset-0 z-0">
        <Canvas 
          camera={{ position: [0, 0, 5.5], fov: 60 }} 
          gl={{ antialias: false, powerPreference: "high-performance" }}
          dpr={[1, 2]} 
        >
          <color attach="background" args={['#030303']} />
          <ambientLight intensity={0.5} />
          
          <ParticleSystem />
          
          <Stars 
            radius={100} 
            depth={50} 
            count={3000} 
            factor={4} 
            saturation={0} 
            fade 
            speed={0.5} 
          />
          
          <OrbitControls 
            enableZoom={true} 
            enablePan={false} 
            autoRotate 
            autoRotateSpeed={0.8}
            minDistance={3}
            maxDistance={8}
            dampingFactor={0.05}
          />
          
          <Suspense fallback={null}>
            <EffectComposer>
              <Bloom 
                luminanceThreshold={0.2} 
                luminanceSmoothing={0.9} 
                height={300} 
                intensity={1.2} 
                mipmapBlur={true} 
              />
            </EffectComposer>
          </Suspense>
        </Canvas>
      </div>
      
      <HandTracker />
      <UI />
    </div>
  );
};

export default App;
