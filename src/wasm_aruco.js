let modulePromise = null;

export function loadArucoWasm() {
  if (modulePromise) return modulePromise;

  modulePromise = new Promise((resolve, reject) => {
    const base = import.meta.env.BASE_URL || './';
    const script = document.createElement('script');
    script.src = `${base}wasm/main.js`;
    script.async = true;

    script.onload = () => {
      const factory = window.webGenArucomapImage;
      if (typeof factory !== 'function') {
        reject(new Error('webGenArucomapImage not found'));
        return;
      }
      factory({
        locateFile: (path) => `${base}wasm/${path}`,
      }).then(resolve).catch(reject);
    };

    script.onerror = () => reject(new Error('Failed to load wasm/main.js'));
    document.head.appendChild(script);
  });

  return modulePromise;
}

/**
 * @param {string} mapText
 * @param {{ dictionaryId?: number, width?: number, height?: number, margin?: number, drawAxis?: boolean }} [opts]
 */
export async function generateMapImage(mapText, opts = {}) {
  const Module = await loadArucoWasm();
  const {
    dictionaryId = 2, // DICT_4X4_250 — типичный для Clover
    width = 800,
    height = 800,
    margin = 40,
    drawAxis = false,
  } = opts;

  return Module.generateMapImage(
    mapText,
    dictionaryId,
    width,
    height,
    margin,
    drawAxis
  );
}

export async function drawMapOnCanvas(canvas, mapText, opts = {}) {
  const result = await generateMapImage(mapText, opts);
  if (!result) return null;

  const { data, width, height } = result;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.putImageData(
    new ImageData(new Uint8ClampedArray(data), width, height),
    0,
    0
  );
  return result;
}