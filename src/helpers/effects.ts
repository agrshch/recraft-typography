import { EffectOptions } from './types';
const { PI, pow,sin, cos, abs, random, floor } = Math;
const MAX_WAVE_LENGTH = 12;

export function getEffectFunction(options: EffectOptions): Function {
  switch (options.effect) {
    case 'wave':
      return (options: EffectOptions, localIndex: number, globalIndex: number, charsNum: number, previousValue: number) => 
        sineWave(options.waveLen, options.wavePhase, globalIndex);
    case 'cylinder':
      return (options: EffectOptions, localIndex: number, globalIndex: number, charsNum: number, previousValue: number) => 
        cylinder(options.cylinderContr, options.cylinderPhase, localIndex, charsNum);
    case 'random':
      return (options: EffectOptions, localIndex: number, globalIndex: number, charsNum: number, previousValue: number) => 
        randomize(previousValue);
  }
}






function sineWave(waveLen: number, phase:number, index: number): number {
  const step = PI / (MAX_WAVE_LENGTH * waveLen);
  const angle = phase*PI + step*index;
  return (1+cos(angle))/2; // 0-1
}

function cylinder(contrast: number, phase: number, index: number, charsNum: number): number {
  const step = PI / (charsNum - 1);
  const value = 1-abs(cos(phase*-PI + PI + step * index));
  return (1-contrast)*0.5 + value*contrast; // 0-1
}

function randomize(prev: number){
  let value = random();
  for(let i=0; i<100; i++){
    if(abs(value-prev) > 0.35) break;
    else value = random();
  }
  return value; //0-1
}