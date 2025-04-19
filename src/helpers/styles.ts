export async function getStyles(){
  const styles = await figma.getLocalTextStylesAsync();
  const straightStyles = styles.filter(style => /^wdth(?:1[0-4][0-9]|150|[5-9][0-9])$/.test(style.name));
  const italicStyles   = styles.filter(style => /^wdth(?:1[0-4][0-9]|150|[5-9][0-9])it$/.test(style.name));

  if (straightStyles.length < 101) {
    figma.notify('No styles found. Open document with the styles inside');
    figma.closePlugin();
    return [];
  }
  return [straightStyles, italicStyles];
}


export async function removeStyles( text: TextNode ){
  for (let i = 0; i < text.characters.length; i++) {
    await text.setRangeTextStyleIdAsync(i, i + 1, '');
  }
}