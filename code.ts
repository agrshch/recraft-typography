const { PI, pow,sin, cos, abs, random, floor } = Math;
const TAU = PI*2;
let styles: TextStyle[] = [];

const UI_SETTINGS = {
  width: 420, 
  height: 600,
  visible: true
};

figma.showUI(__html__, UI_SETTINGS);



async function initialize() {
  styles = await getStyles();
}
initialize();




figma.ui.onmessage = async (msg) => {
  if (msg.type === 'apply') {
    let waveFunction: Function = cylinder;
    if(msg.style === 'cylinder') waveFunction = cylinder;
    if(msg.style === 'wave') waveFunction = sineWave;
    if(msg.style === 'random') waveFunction = () => Math.random();

    await applyStylesToText(waveFunction, msg.applyTo);
  }
};





async function applyStylesToText(waveFunction: Function, applyTo: String) {
  const selection = figma.currentPage.selection;
  if (selection.length === 0) {
    figma.notify('Please, select a text object');
    return;
  }
  
  try {
    // Обрабатываем каждый выделенный объект
    for (const node of selection) {
      if (node.type !== 'TEXT') {
        figma.notify('Please, select a text object');
        continue;
      }

      const text = node as TextNode;
      await figma.loadFontAsync(text.fontName as FontName);
      const lines = text.characters.split('\n').map(line => line.trim());
      text.characters = lines.join('\n');

      if(applyTo === 'letters'){
        let charNum = 0;
        for(let line of lines){
          const phase = random()*TAU;
          // Применяем стили к каждому символу
          for (let i = 0; i < line.length; i++) {
            const wave = waveFunction(line.length, i, phase)
            const styleIndex = floor(wave * (styles.length-1));
            const style = styles[styleIndex];
            await text.setRangeTextStyleIdAsync(charNum, charNum + 1, style.id);
            charNum ++;
          }
          charNum ++;
        }
      }
      
      if(applyTo === 'words'){
        let charNum = 0;
        for(let line of lines){
          const words = line.split(' ');
          const phase = random()*TAU;
          // Применяем стили к каждому слову
          for(let i in words){
            const word = words[i];
            const wave = waveFunction(words.length, i, phase);
            const styleIndex = floor(wave * (styles.length-1));
            const style = styles[styleIndex];
            await text.setRangeTextStyleIdAsync(charNum, charNum + word.length, style.id);
            charNum += word.length;
            charNum ++; // white spaces and line breaks
          }
          // charNum ++;
        }
      }
      

      // После применения всех стилей, отвязываем их, сохраняя форматирование
      for (let i = 0; i < text.characters.length; i++) {
        await text.setRangeTextStyleIdAsync(i, i + 1, '');
      }
    }

  } catch (error) {
    console.error('Error:', error);
    figma.notify('Произошла ошибка');
  } 
}













function cylinder(length: number, index: number): number {
  const step = PI / (length - 1);
  return 1-abs(cos(PI+step * index));
}

function sineWave(length: number, index: number, phase:number): number {
  const step = PI / (length - 1);
  const angle = phase + step*index;
  return (1+cos(angle))/2;
}





async function getStyles(){
  const styles = await figma.getLocalTextStylesAsync();
  const wStyles = styles.filter(style => /^wdth(?:1[0-4][0-9]|150|[5-9][0-9])$/.test(style.name));

  if (wStyles.length < 101) {
    figma.notify('Не найдены стили');
    return [];
  }
  return wStyles;
}





