import { EffectOptions } from './types';
import { getStyles, removeStyles } from './styles'




export async function applyEffectToLetters
  ( 
    text: TextNode, 
    effect: Function, 
    options: EffectOptions,
    styles: TextStyle[][]
  ){
    try {
      const straightStyles = styles[0];
      const lines = text.characters.split('\n').map(line => line.trim());
      trimIfNeeded(text, lines);
      let charNum = 0;
      let prev = -1;
      for(let line of lines){
        if(line.length === 0) {
          charNum ++;
          continue;
        }
        for (let i = 0; i < line.length; i++) {
          const effectValue = effect(options, i, charNum, line.length, prev);
          const styleIndex = Math.floor(effectValue * (straightStyles.length-1));
          const style = straightStyles[styleIndex];

          await text.setRangeTextStyleIdAsync(charNum, charNum + 1, style.id);
          charNum ++; 
          prev = effectValue;
        }
        charNum ++;
      }

      // После применения всех стилей, отвязываем их, сохраняя форматирование
      removeStyles(text);
      
    } catch (error) {
      console.error('Error:', error);
      figma.notify('Произошла ошибка');
    } 
  }


export async function applyEffectToWords
  ( 
    text: TextNode, 
    effect: Function, 
    options: EffectOptions,
    styles: TextStyle[][]
  ){
    try {
      const straightStyles = styles[0];
      const italicStyles = styles[1];
      const lines = text.characters.split('\n').map(line => line.trim());
      trimIfNeeded(text, lines);

      let charNum = 0;
      let prev = -1;
      for(let line of lines){
        if(line.length < 1) {
          charNum ++;
          continue;
        }
        const words = line.split(' ');
        for(let i in words){
          const word = words[i];
          const effectValue = effect(options, i, charNum, words.length, prev);
          const styleIndex = Math.floor(effectValue * (straightStyles.length-1));
          const isItalic = Math.random() < 0.3;
          const style = isItalic ? italicStyles[styleIndex] : straightStyles[styleIndex];

          await text.setRangeTextStyleIdAsync(charNum, charNum + word.length, style.id);

          prev = effectValue;
          charNum += word.length;
          charNum ++; // white spaces and line breaks
        }
      }

      // После применения всех стилей, отвязываем их, сохраняя форматирование
      removeStyles(text);
      
    } catch (error) {
      console.error('Error:', error);
      figma.notify('Произошла ошибка');
    } 
  }


  export async function updateSpacesOnly(
    text: TextNode, 
    options: { whiteSpaceWidth: number },
    styles: TextStyle[][]
  ){
    try {
      const straightStyles = styles[0];
      const spaceStyleIndex = Math.floor(options.whiteSpaceWidth * (straightStyles.length-1));
      const spaceStyle = straightStyles[spaceStyleIndex];
      
      const characters = text.characters;
      
      // Обновляем стиль всех пробелов
      for (let i = 0; i < characters.length; i++) {
        if (characters[i] === ' ') {
          await text.setRangeTextStyleIdAsync(i, i + 1, spaceStyle.id);
        }
      }
    } catch (error) {
      console.error('Error updating spaces:', error);
      figma.notify('Произошла ошибка при обновлении пробелов');
    }
  }


/////////////// PRIVATE /////////////////////

async function trimIfNeeded(text: TextNode, trimmedLines: Array<string>){
  let needsTriming = false;
  const lines = text.characters.split('\n');
  for(let line of lines){
    if(/^[\s]|[\s]$/.test(line)) {
      needsTriming = true;
      break;
    }
  }
  if(needsTriming){
    try{
      await figma.loadFontAsync(text.fontName as FontName);
      text.characters = trimmedLines.join('\n');
    } catch(err) {
      console.error('Error while trimming:', err);
    }
  }
}