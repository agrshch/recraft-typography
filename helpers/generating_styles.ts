figma.showUI(__html__, { visible: false });

async function createTextStyles() {
  try {
    // Очищаем существующие стили
    const existingStyles = await figma.getLocalTextStylesAsync();
    for (const style of existingStyles) {
      if (style.name.startsWith('wdth')) {
        style.remove();
      }
    }
    // Загружаем шрифты
    await figma.loadFontAsync({ family: "ABC Gravity Variable", style: "Normal" });
    await figma.loadFontAsync({ family: "ABC Gravity Variable", style: "Normal Italic" });
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });

    // Создаем стили для Normal
    for (let width = 50; width <= 150; width++) {
      const style = figma.createTextStyle();
      
      style.name = `wdth${width}`;
      style.fontSize = 100;
      style.textDecoration = "NONE";
      style.lineHeight = { value: 75, unit: "PERCENT" };
      style.fontName = { family: "ABC Gravity Variable", style: "Normal" };
      style.textCase = "UPPER";
      
      // Вычисляем letterSpacing от 3% до -3%
      const progress = (width - 50) / 100; // от 0 до 1
      const letterSpacing = 3 - (progress * 6); // от 3 до -3
      style.letterSpacing = { unit: "PERCENT", value: letterSpacing };
    }

    // Создаем стили для Italic
    for (let width = 50; width <= 150; width++) {
      const style = figma.createTextStyle();
      
      style.name = `wdth${width}it`;
      style.fontSize = 100;
      style.textDecoration = "NONE";
      style.lineHeight = { value: 75, unit: "PERCENT" };
      style.fontName = { family: "ABC Gravity Variable", style: "Normal Italic" };
      
      // Вычисляем letterSpacing от 3% до -3%
      const progress = (width - 50) / 100; // от 0 до 1
      const letterSpacing = 3 - (progress * 6); // от 3 до -3
      style.letterSpacing = { unit: "PERCENT", value: letterSpacing };
      style.textCase = "UPPER";
    }

    figma.notify('202 стиля успешно созданы');
  } catch (error) {
    console.error('Error:', error);
    figma.notify('Произошла ошибка');
  } finally {
    figma.closePlugin();
  }
}

createTextStyles();
