import React, { useEffect, useRef, useState } from 'react';
import { Hands, Results } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';
import { useStore } from '../store';

const HandTracker: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { setHandTension, setHandDetected } = useStore();
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    
    const hands = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      },
    });

    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    hands.onResults(onResults);

    let camera: Camera | null = null;
    
    try {
        camera = new Camera(video, {
        onFrame: async () => {
          if (videoRef.current) {
            await hands.send({ image: videoRef.current });
          }
        },
        width: 640,
        height: 480,
      });
      camera.start().catch(err => {
        console.error("Camera error:", err);
        setCameraError("Enable Camera Access");
      });
    } catch (error) {
       console.error("Camera error:", error);
       setCameraError("Camera Error");
    }

    return () => {
      // cleanup handled by page lifecycle
    };
  }, []);

  const onResults = (results: Results) => {
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      setHandDetected(true);
      
      let totalTension = 0;

      for (const landmarks of results.multiHandLandmarks) {
        const wrist = landmarks[0];
        const tips = [4, 8, 12, 16, 20];
        let avgDist = 0;
        
        tips.forEach(tipIdx => {
          const tip = landmarks[tipIdx];
          const dist = Math.sqrt(
            Math.pow(tip.x - wrist.x, 2) + 
            Math.pow(tip.y - wrist.y, 2)
          );
          avgDist += dist;
        });
        
        avgDist /= tips.length;
        const minClosed = 0.15;
        const maxOpen = 0.35;
        
        let tension = 1 - Math.min(Math.max((avgDist - minClosed) / (maxOpen - minClosed), 0), 1);
        totalTension += tension;
      }
      
      const finalTension = totalTension / results.multiHandLandmarks.length;
      setHandTension(finalTension);

    } else {
      setHandDetected(false);
      setHandTension(0);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 overflow-hidden rounded-xl border border-white/10 bg-black/40 shadow-xl backdrop-blur-sm transition-opacity duration-300 opacity-30 hover:opacity-100">
      {cameraError && <div className="p-2 text-xs text-red-400 font-bold bg-black/80">{cameraError}</div>}
      <video
        ref={videoRef}
        className="h-20 w-auto -scale-x-100 object-cover"
        playsInline
      />
      <canvas ref={canvasRef} className="hidden" /> 
      <div className="absolute bottom-1 left-0 w-full text-center text-[8px] text-white/50 font-mono">
        VISION AI
      </div>
    </div>
  );
};

export default HandTracker;
