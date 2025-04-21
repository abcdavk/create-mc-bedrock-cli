export async function displayAsciiArt() {
  const artLines = [
    '---',
    '',
    ' ▄▄· ▄▄▄  ▄▄▄ . ▄▄▄· ▄▄▄▄▄▄▄▄ .    ▄▄▄▄· ▄▄▄ .·▄▄▄▄  ▄▄▄         ▄▄· ▄ •▄      ▄▄· ▄▄▌  ▪  ',
    '▐█ ▌▪▀▄ █·▀▄.▀·▐█ ▀█ •██  ▀▄.▀·    ▐█ ▀█▪▀▄.▀·██▪ ██ ▀▄ █·▪     ▐█ ▌▪█▌▄▌▪    ▐█ ▌▪██•  ██ ',
    '██ ▄▄▐▀▀▄ ▐▀▀▪▄▄█▀▀█  ▐█.▪▐▀▀▪▄    ▐█▀▀█▄▐▀▀▪▄▐█· ▐█▌▐▀▀▄  ▄█▀▄ ██ ▄▄▐▀▀▄·    ██ ▄▄██▪  ▐█·',
    '▐███▌▐█•█▌▐█▄▄▌▐█ ▪▐▌ ▐█▌·▐█▄▄▌    ██▄▪▐█▐█▄▄▌██. ██ ▐█•█▌▐█▌.▐▌▐███▌▐█.█▌    ▐███▌▐█▌▐▌▐█▌',
    '·▀▀▀ .▀  ▀ ▀▀▀  ▀  ▀  ▀▀▀  ▀▀▀     ·▀▀▀▀  ▀▀▀ ▀▀▀▀▀• .▀  ▀ ▀█▄▀▪·▀▀▀ ·▀  ▀    ·▀▀▀ .▀▀▀ ▀▀▀',
    '',
    '---',
    'by @keyyard - workspaces from Microsoft Minecraft Scripting Samples',
    '---',
  ];

  for (const line of artLines) {
    console.log(line);
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}
