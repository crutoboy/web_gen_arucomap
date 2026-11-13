import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import './dark_mode_changer.js'
import { aruco_gen_str } from './genmap.js';
import { drawMapOnCanvas } from './wasm_aruco.js';
import { generateMapSvg, generateMapSvgString } from './svg_map';

document.getElementById('generate_button').addEventListener('click', () => {
    let length = document.getElementById('length').valueAsNumber
    let first = document.getElementById('first').valueAsNumber
    let x0 = document.getElementById('x0').valueAsNumber
    let y0 = document.getElementById('y0').valueAsNumber
    let markers_x = document.getElementById('markers_x').valueAsNumber
    let markers_y = document.getElementById('markers_y').valueAsNumber
    let dist_x = document.getElementById('dist_x').valueAsNumber
    let dist_y = document.getElementById('dist_y').valueAsNumber
    let bottom_left = document.getElementById('bottom_left').checked

    let map = aruco_gen_str(
        length, markers_x, markers_y, dist_x, dist_y,
        first, x0, y0, bottom_left
    )
    document.getElementById('test_out').value = map

    update_aruco_image()
})

document.getElementById('download_maptxt_button').addEventListener('click', () => {
    let content = document.getElementById('test_out').value
    let filename = 'map.txt'

    let blob = new Blob([content], { type: "text/plain" })
    let url = window.URL.createObjectURL(blob);

    let a = document.createElement("a")
    a.style = "display: none"
    a.href = url
    a.download = filename
    a.click()

    window.URL.revokeObjectURL(url)
})

document.getElementById('download_topic_button').addEventListener('click', () => {
    let canvas = document.getElementById('image_topic');
    if (!canvas) return;

    canvas.toBlob(blob => {
        if (!blob) return
        
        let url = URL.createObjectURL(blob)
        let a = document.createElement('a')
        a.href = url;
        a.download = 'aruco_topic.png'
        a.click()

        window.URL.revokeObjectURL(url)
    }, 'image/png')
})

document.getElementById('saveSVG').addEventListener('click', async () => {
  let map = document.getElementById('test_out').value;
  let svg_pxpm = document.getElementById('svg_pxpm').valueAsNumber;
  let svg_margin = document.getElementById('svg_margin').valueAsNumber;
  let svg_drawIDs = document.getElementById('svg_drawIDs').checked
  let options = {
    dictName: '4x4_1000',
    markerW: 4,
    markerH: 4,
    pxPerMeter: svg_pxpm,
    margin: svg_margin,
    showIds: svg_drawIDs,
  }
  let svgStr = await generateMapSvgString(map, options);
  let blob = new Blob([svgStr], { type: 'image/svg+xml' });
  let url = URL.createObjectURL(blob);
  let a = document.createElement('a');
  a.href = url;
  a.download = 'aruco_map.svg';
  a.click();
  URL.revokeObjectURL(url);
});

function update_aruco_image() {
    let map = document.getElementById('test_out').value
    let canvas = document.getElementById('image_topic')
    let width = document.getElementById('topic_width').valueAsNumber
    let height = document.getElementById('topic_height').valueAsNumber
    let margin = document.getElementById('topic_margin').valueAsNumber
    let drawAxis = document.getElementById('topic_drawAxis').checked

    let result = drawMapOnCanvas(canvas, map, {
      dictionaryId: 2,
      width: width,
      height: height,
      margin: margin,
      drawAxis: drawAxis,
    });
}

document.getElementById('test_out').addEventListener('change', update_aruco_image)
document.getElementById('topic_width').addEventListener('change', update_aruco_image)
document.getElementById('topic_height').addEventListener('change', update_aruco_image)
document.getElementById('topic_margin').addEventListener('change', update_aruco_image)
document.getElementById('topic_drawAxis').addEventListener('change', update_aruco_image)

