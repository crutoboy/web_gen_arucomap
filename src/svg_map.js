// Some functions is basically taken from https://github.com/okalachev/arucogen/blob/master/main.js

let dict = null;
const base = import.meta.env.BASE_URL || './';
let loadDict = fetch(`${base}dict.json`)
  .then(r => r.json())
  .then(json => { dict = json; });


function generateMarkerSvg(width, height, bits, fixPdfArtifacts = true) {
    let NS = 'http://www.w3.org/2000/svg';
    let svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', `0 0 ${width + 2} ${height + 2}`);
    svg.setAttribute('xmlns', NS);
    svg.setAttribute('shape-rendering', 'crispEdges');

    // Background rect
    let rect = document.createElementNS(NS, 'rect');
    rect.setAttribute('x', 0);
    rect.setAttribute('y', 0);
    rect.setAttribute('width', width + 2);
    rect.setAttribute('height', height + 2);
    rect.setAttribute('fill', 'black');
    svg.appendChild(rect);

    // "Pixels"
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            let white = bits[i * height + j];
            if (!white) continue;

            let pixel = document.createElementNS(NS, 'rect');
            pixel.setAttribute('width', 1);
            pixel.setAttribute('height', 1);
            pixel.setAttribute('x', j + 1);
            pixel.setAttribute('y', i + 1);
            pixel.setAttribute('fill', 'white');
            svg.appendChild(pixel);

            if (!fixPdfArtifacts) continue;

            if ((j < width - 1) && (bits[i * height + j + 1])) {
                pixel.setAttribute('width', 1.5);
            }

            if ((i < height - 1) && (bits[(i + 1) * height + j])) {
                let pixel2 = document.createElementNS(NS, 'rect');
                pixel2.setAttribute('width', 1);
                pixel2.setAttribute('height', 1.5);
                pixel2.setAttribute('x', j + 1);
                pixel2.setAttribute('y', i + 1);
                pixel2.setAttribute('fill', 'white');
                svg.appendChild(pixel2);
            }
        }
    }

    return svg;
}

function generateArucoMarker(width, height, dictName, id) {
    var bytes = dict[dictName][id];
    var bits = [];
    var bitsCount = width * height;

    // Parse marker's bytes
    for (var byte of bytes) {
        var start = bitsCount - bits.length;
        for (var i = Math.min(7, start - 1); i >= 0; i--) {
            bits.push((byte >> i) & 1);
        }
    }

    return generateMarkerSvg(width, height, bits);
}

/**
 * Парсит map.txt -> массив {id, length, x, y, ...}
 */
export function parseMapTxt(mapTxt) {
  let markers = [];
  for (let line of mapTxt.split('\n')) {
    let t = line.trim();
    if (!t || t.startsWith('#')) continue;
    let p = t.split(/\s+/).map(Number);
    if (p.length < 4) continue;
    markers.push({
      id: p[0],
      length: p[1],
      x: p[2],
      y: p[3],
      z: p[4] || 0,
      rot_z: p[5] || 0,
      rot_y: p[6] || 0,
      rot_x: p[7] || 0,
    });
  }
  return markers;
}


/**
 * Главная функция: строит SVG всей карты
 *
 * @param {string} mapTxt        — содержимое map.txt
 * @param {object} options
 * @param {string} options.dictName   — '4x4_1000', '5x5_1000' и т.д. (как в arucogen)
 * @param {number} options.markerW    — ширина сетки маркера (4/5/6)
 * @param {number} options.markerH    — высота сетки
 * @param {number} options.pxPerMeter — масштаб (пикселей на метр)
 * @param {number} options.margin     — отступ вокруг карты (в тех же единицах, что viewBox)
 * @param {boolean} options.showIds   — подписывать ID
 */
export async function generateMapSvg(mapTxt, options = {}) {
  await loadDict;

  let {
    dictName = '4x4_1000',
    markerW = 4,
    markerH = 4,
    pxPerMeter = 200,      // 1 м = 200 px (удобно для печати)
    margin = 40,
    showIds = true,
  } = options;

  let markers = parseMapTxt(mapTxt);
  if (!markers.length) throw new Error('Нет маркеров в map.txt');

  // Границы в мировых координатах (метры)
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (let m of markers) {
    let half = m.length / 2;
    minX = Math.min(minX, m.x - half);
    maxX = Math.max(maxX, m.x + half);
    minY = Math.min(minY, m.y - half);
    maxY = Math.max(maxY, m.y + half);
  }

  let worldW = maxX - minX;
  let worldH = maxY - minY;
  let svgW = worldW * pxPerMeter + margin * 2;
  let svgH = worldH * pxPerMeter + margin * 2;

  // Корневой SVG
  let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  svg.setAttribute('viewBox', `0 0 ${svgW} ${svgH}`);
  svg.setAttribute('width', svgW);
  svg.setAttribute('height', svgH);
  svg.setAttribute('shape-rendering', 'crispEdges');

  // Фон
  let bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  bg.setAttribute('width', '100%');
  bg.setAttribute('height', '100%');
  bg.setAttribute('fill', 'white');
  svg.appendChild(bg);

  // Группа карты (смещаем так, чтобы minX/minY были в (margin, margin))
  let g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  g.setAttribute('transform', `translate(${margin}, ${margin})`);

  for (let m of markers) {
    let markerSvg = generateArucoMarker(markerW, markerH, dictName, m.id)

    // Размер маркера в пикселях
    let sizePx = m.length * pxPerMeter;

    // Центр маркера → левый верхний угол в SVG
    // В мире Y растёт вверх, в SVG — вниз, поэтому инвертируем
    let cx = (m.x - minX) * pxPerMeter;
    let cy = (maxY - m.y) * pxPerMeter; // инверсия Y

    let x = cx - sizePx / 2;
    let y = cy - sizePx / 2;

    // Клонируем содержимое маркера и масштабируем
    let markerGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    markerGroup.setAttribute('transform', `translate(${x}, ${y}) scale(${sizePx / (markerW + 2)})`);

    // Переносим детей из markerSvg
    while (markerSvg.firstChild) {
      markerGroup.appendChild(markerSvg.firstChild);
    }
    g.appendChild(markerGroup);

    if (showIds) {
      let text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', cx);
      text.setAttribute('y', y - 4);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('font-size', Math.max(10, sizePx * 0.18));
      text.setAttribute('font-family', 'monospace');
      text.setAttribute('fill', '#333');
      text.textContent = m.id;
      g.appendChild(text);
    }
  }

  svg.appendChild(g);
  return svg;
}

/**
 * Удобный хелпер: получить строку SVG для скачивания
 */
export async function generateMapSvgString(mapTxt, options) {
  const svg = await generateMapSvg(mapTxt, options);
  return new XMLSerializer().serializeToString(svg);
}