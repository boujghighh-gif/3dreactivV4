import React, { useState, useRef } from 'react';
import { useStore, TemplateType } from '../store';
import { 
  Heart, Flower, Orbit, Flame, Sparkles, 
  Palette, Hand, Volume2, VolumeX 
} from 'lucide-react';

const UI: React.FC = () => {
  const { 
    currentTemplate, setTemplate, 
    particleColor, setColor, 
    isHandDetected, handTension 
  } = useStore();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("Play failed:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const templates: { id: TemplateType; icon: React.ReactNode; label: string }[] = [
    { id: 'heart', icon: <Heart size={18} />, label: 'Love' },
    { id: 'flower', icon: <Flower size={18} />, label: 'Nature' },
    { id: 'saturn', icon: <Orbit size={18} />, label: 'Space' },
    { id: 'buddha', icon: <Sparkles size={18} />, label: 'Zen' },
    { id: 'fireworks', icon: <Flame size={18} />, label: 'Spark' },
  ];

  return (
    <div className="pointer-events-none fixed inset-0 z-10 flex flex-col justify-between p-4 sm:p-6 select-none font-sans">
      
      {/* Audio Element linked to public/mysong.mp3 */}
      <audio 
        ref={audioRef} 
        src="/mysong.mp3" 
        loop 
      />

      {/* Top Status Bar */}
      <div className="flex items-start justify-between w-full">
        <div className="pointer-events-auto flex items-center gap-3 rounded-full bg-neutral-900/50 p-2 pr-4 border border-white/5 backdrop-blur-xl">
           <div className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${isHandDetected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
             <Hand size={18} />
           </div>
           <div className="flex flex-col">
             <span className="text-[10px] font-bold text-white/40 tracking-wider">SYSTEM STATUS</span>
             <span className={`text-xs font-bold ${isHandDetected ? 'text-emerald-400' : 'text-neutral-500'}`}>
               {isHandDetected ? 'HANDS CONNECTED' : 'SEARCHING...'}
             </span>
           </div>
           {isHandDetected && (
              <div className="ml-2 w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div 
                   className="h-full bg-gradient-to-r from-cyan-400 to-blue-600 transition-all duration-75"
                   style={{width: `${Math.min(handTension * 100, 100)}%`}} 
                />
              </div>
           )}
        </div>

        <button 
          onClick={toggleAudio}
          className="pointer-events-auto group flex h-11 w-11 items-center justify-center rounded-full bg-neutral-900/50 border border-white/10 text-white hover:bg-white/10 transition-all active:scale-95"
        >
          {isPlaying ? <Volume2 size={20} className="text-cyan-400" /> : <VolumeX size={20} className="text-white/40" />}
        </button>
      </div>

      {/* Bottom Controls */}
      <div className="pointer-events-auto mx-auto w-full max-w-md">
        <div className="flex flex-col gap-4 rounded-3xl bg-neutral-900/60 p-4 backdrop-blur-2xl border border-white/10 shadow-2xl">
          
          {/* Template Icons */}
          <div className="flex justify-between items-center gap-1">
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => setTemplate(t.id)}
                className={`flex flex-col items-center gap-2 rounded-2xl py-3 px-2 flex-1 transition-all ${
                  currentTemplate === t.id 
                    ? 'bg-white/10 text-cyan-300 shadow-inner' 
                    : 'text-white/30 hover:bg-white/5 hover:text-white/80'
                }`}
              >
                {t.icon}
                <span className="text-[9px] font-bold uppercase tracking-widest">{t.label}</span>
              </button>
            ))}
          </div>

          <div className="w-full h-px bg-white/5" />

          {/* Color Selector */}
          <label className="flex items-center justify-between cursor-pointer px-2 group">
              <span className="text-xs font-bold text-white/50 uppercase tracking-widest group-hover:text-white/80 transition-colors">Particle Color</span>
              <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-white/40">{particleColor}</span>
                  <div className="relative h-8 w-8 rounded-full border border-white/20 overflow-hidden shadow-lg">
                    <input 
                        type="color" 
                        value={particleColor} 
                        onChange={(e) => setColor(e.target.value)}
                        className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] cursor-pointer p-0 m-0 opacity-0" 
                    />
                    <div className="w-full h-full" style={{ backgroundColor: particleColor }} />
                    <Palette size={12} className="absolute inset-0 m-auto text-black/50 pointer-events-none mix-blend-overlay" />
                  </div>
              </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default UI;
