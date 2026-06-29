function aruco_gen_str(
    length, markers_x, markers_y, dist_x, dist_y,
    first=0, x0=0, y0=0, bottom_left=false
){
    let res = '# id\tlength\tx\ty\tz\trot_z\trot_y\trot_x\n'
    let max_y = y0 + (markers_y - 1) * dist_y
    for (let y = 0; y < markers_y; y++) {
        for (let x = 0; x < markers_y; x++){
            let pos_x = x0 + x * dist_x
            let pos_y = y0 + y * dist_y
            if (!bottom_left)
                pos_y = max_y - pos_y
            res += [first, length, pos_x, pos_y, 0, 0, 0, 0].join('\t') + '\n'
            first += 1
        }
    }
    return res
}