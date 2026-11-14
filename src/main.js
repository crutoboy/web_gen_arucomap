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
    document.getElementById('maptxt_preview').value = map

    update_aruco_preview()
})

document.getElementById('download_maptxt_button').addEventListener('click', () => {
    let content = document.getElementById('maptxt_preview').value
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
    let map = document.getElementById('maptxt_preview').value;
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

document.getElementById("preview_group").addEventListener('change', () => {
    let is_preview_png = document.getElementById('preview_png_btn').checked
    let is_preview_svg = document.getElementById('preview_svg_btn').checked
    let preview_png = document.getElementById('image_topic')
    let preview_svg = document.getElementById('svg_preview')
    let download_png_btn = document.getElementById('download_topic_button')
    let download_svg_btn = document.getElementById('saveSVG')

    if (is_preview_png) {
        preview_png.style.display = 'block'
        download_png_btn.disabled = false
        preview_svg.style.display = 'none'
        download_svg_btn.disabled = true
    }

    if (is_preview_svg) {
        preview_png.style.display = 'none'
        download_png_btn.disabled = true
        preview_svg.style.display = 'block'
        download_svg_btn.disabled = false
    }

    update_aruco_preview()
})

function update_aruco_image() {
    let map = document.getElementById('maptxt_preview').value
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

async function update_aruco_svg() {
    let container = document.getElementById('svg_preview');
    let map = document.getElementById('maptxt_preview').value;
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
    let svg = await generateMapSvg(map, options);

    svg.removeAttribute('width');
    svg.removeAttribute('height');
    svg.style.width = '100%';
    svg.style.height = 'auto';
    svg.style.display = 'block';

    container.innerHTML = '';
    container.appendChild(svg);
}

function update_aruco_preview() {
    let is_preview_png = document.getElementById('preview_png_btn').checked
    let is_preview_svg = document.getElementById('preview_svg_btn').checked

    if (is_preview_png) update_aruco_image()
    if (is_preview_svg) update_aruco_svg()
}

document.getElementById('maptxt_preview').addEventListener('input', update_aruco_preview)

document.getElementById('topic_width').addEventListener('change', update_aruco_preview)
document.getElementById('topic_height').addEventListener('change', update_aruco_preview)
document.getElementById('topic_margin').addEventListener('change', update_aruco_preview)
document.getElementById('topic_drawAxis').addEventListener('change', update_aruco_preview)

document.getElementById('svg_pxpm').addEventListener('change', update_aruco_preview)
document.getElementById('svg_margin').addEventListener('change', update_aruco_preview)
document.getElementById('svg_drawIDs').addEventListener('change', update_aruco_preview)
