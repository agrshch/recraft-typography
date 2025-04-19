export interface EffectOptions {
  effect: 'wave' | 'cylinder' | 'random';
  applyTo: 'letters' | 'words';
  waveLen: number; // 0-1
  wavePhase: number; // 0-1
  cylinderContr: number; // 0-1
  cylinderPhase: number; //-0.5 - 0.5
  justifyHor: boolean;
  justifyVert: boolean;
  whiteSpaceWidth: number; // 0-1
}

// Type for the message
export type PluginMessage = {
  type: 'apply' | 'applySpacesOnly';
} & EffectOptions;