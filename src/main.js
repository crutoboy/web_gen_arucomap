import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { aruco_gen_str } from './genmap.js';

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
    document.getElementById('test_out').innerHTML = map
})

document.getElementById('download_maptxt_button').addEventListener('click', () => {
    let content = document.getElementById('test_out').innerHTML
    let filename = 'map.txt'

    let blob = new Blob([content], { type: "text/plain" })
    let url = window.URL.createObjectURL(blob);

    let a = document.createElement("a")
    a.style = "display: none"
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click();

    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
})