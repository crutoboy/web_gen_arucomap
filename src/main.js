import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import './dark_mode_changer.js'
import { aruco_gen_str } from './genmap.js';
import { drawMapOnCanvas } from './wasm_aruco.js';

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

function update_aruco_image() {
    let map = document.getElementById('test_out').value
    let canvas = document.getElementById('image_topic')
    const result = drawMapOnCanvas(canvas, map, {
      dictionaryId: 2,
      width: 600,
      height: 500,
      margin: 40,
      drawAxis: false,
    });
}

document.getElementById('test_out').addEventListener('change', update_aruco_image)

