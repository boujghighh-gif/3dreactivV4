import { create } from 'zustand';

export type TemplateType = 'heart' | 'flower' | 'saturn' | 'buddha' | 'fireworks';

interface AppState {
  currentTemplate: TemplateType;
  particleColor: string;
  handTension: number; 
  isHandDetected: boolean;
  setTemplate: (template: TemplateType) => void;
  setColor: (color: string) => void;
  setHandTension: (tension: number) => void;
  setHandDetected: (detected: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  currentTemplate: 'heart',
  particleColor: '#00ffff',
  handTension: 0,
  isHandDetected: false,
  setTemplate: (template) => set({ currentTemplate: template }),
  setColor: (color) => set({ particleColor: color }),
  setHandTension: (tension) => set({ handTension: tension }),
  setHandDetected: (detected) => set({ isHandDetected: detected }),
}));
