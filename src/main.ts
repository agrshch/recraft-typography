import { EffectOptions, PluginMessage } from './helpers/types';
import { getEffectFunction } from './helpers/effects';
import { getStyles, removeStyles } from './helpers/styles'
import { applyEffectToLetters, applyEffectToWords, updateSpacesOnly } from './helpers/text';

const { PI, pow,sin, cos, abs, random, floor } = Math;
const TAU = PI*2;

figma.showUI(__html__, {width: 360, height: 560});

let styles: TextStyle[][] = [];


function updateOptions(msg: PluginMessage) :EffectOptions{
  return {
    effect: msg.effect,
    applyTo: msg.applyTo,
    waveLen: Number(msg.waveLen),
    wavePhase: Number(msg.wavePhase),
    cylinderContr: Number(msg.cylinderContr),
    cylinderPhase: Number(msg.cylinderPhase),
    justifyHor: msg.justifyHor,
    justifyVert: msg.justifyVert,
    whiteSpaceWidth: Number(msg.whiteSpaceWidth)
  };
}

figma.ui.onmessage = async (msg: PluginMessage) => {
  if (msg.type === 'apply') {

    if (styles.length === 0) {
      styles = await getStyles();
    }

    const options: EffectOptions = updateOptions(msg);
    
    const selection = figma.currentPage.selection;
    if (selection.length === 0) {
      figma.notify('Please select a text layer');
      return;
    }

    for (const node of selection) {
      if (node.type === 'TEXT') {
        if (options.applyTo === 'letters') {
          applyEffectToLetters(node, getEffectFunction(options), options, styles);
          updateSpacesOnly(node, options, styles);
        } else {
          options.effect = 'random';
          applyEffectToWords(node, getEffectFunction(options), options, styles);
          updateSpacesOnly(node, options, styles);
        }
      }
    }
  } 

  else if (msg.type === 'applySpacesOnly') {
    if (styles.length === 0) {
      styles = await getStyles();
    }
    
    const selection = figma.currentPage.selection;
    if (selection.length === 0) {
      figma.notify('Please select a text layer');
      return;
    }
    
    // Создаем минимальный объект options только с нужным параметром
    const options = {
      whiteSpaceWidth: Number(msg.whiteSpaceWidth)
    };
    
    for (const node of selection) {
      if (node.type === 'TEXT') {
        updateSpacesOnly(node, options, styles);
      }
    }
  }
};














// function getTextWidth(){

// }

// function adjustTextSize(){

// }

// function adjustHorizontally(){

// }

// function adjustVertically(){

// }
























































