// Iconos pixelados: cada mapa es una grilla de 10x10 ('#' = píxel encendido)
// que se dibuja como SVG nítido a cualquier tamaño.
const ICONS = {
  vj: [ // pantalla con "play"
    '##########',
    '#........#',
    '#..#.....#',
    '#..##....#',
    '#..###...#',
    '#..##....#',
    '#..#.....#',
    '#........#',
    '##########',
    '..######..',
  ],
  dj: [ // vinilo
    '..######..',
    '.########.',
    '###....###',
    '##..##..##',
    '##.####.##',
    '##.####.##',
    '##..##..##',
    '###....###',
    '.########.',
    '..######..',
  ],
  lj: [ // foco con haz de luz
    '...####...',
    '...####...',
    '...####...',
    '..######..',
    '..#....#..',
    '.#......#.',
    '.#......#.',
    '#........#',
    '#........#',
    '##########',
  ],
  sj: [ // niveles de audio
    '.......##.',
    '.......##.',
    '....##.##.',
    '....##.##.',
    '.##.##.##.',
    '.##.##.##.',
    '.##.##.##.',
    '.##.##.##.',
    '.##.##.##.',
    '.##.##.##.',
  ],
  cj: [ // cámara
    '..........',
    '..###.....',
    '#######..#',
    '#######.##',
    '##...#####',
    '##...#####',
    '##...#####',
    '#######.##',
    '#######..#',
    '..........',
  ],
};

for (const el of document.querySelectorAll('[data-icon]')) {
  const map = ICONS[el.dataset.icon];
  if (!map) continue;
  let rects = '';
  map.forEach((row, y) => [...row].forEach((c, x) => {
    if (c === '#') rects += `<rect x="${x}" y="${y}" width="1.02" height="1.02"/>`;
  }));
  el.innerHTML = `<svg viewBox="0 0 10 10" shape-rendering="crispEdges" aria-hidden="true">${rects}</svg>`;
}

document.getElementById('year').textContent = new Date().getFullYear();
