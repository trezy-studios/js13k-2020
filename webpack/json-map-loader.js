const path = require('path');
const arr_to_bigstr = (arr) => `${BigInt(arr.join('')).toString(10)}`
const get_tile = (map) => {
    const res = []
    const getPos = (x, y) => map[x + y * 12]
    const size = { w: 12, h: 16 }
    // for (let y = 12; y > 0; y--) {
    //     let isEmpty = true
    //     for (let x = 0; x < size.w; x++) {
    //         if (getPos(x, y)) {
    //             isEmpty = false
    //             continue;
    //         }
    //     }
    //     if (isEmpty) {
    //         size.h = y
    //     }
    // }
    // for (let x = 16; x > 0; x--) {
    //     let isEmpty = true
    //     for (let y = 0; y < size.h; y++) {
    //         if (getPos(x, y)) {
    //             isEmpty = false
    //             continue;
    //         }
    //     }
    //     if (isEmpty) {
    //         size.w = x
    //     }
    // }
    let tiles = [];
    for (let x = 0; x < 12; x++) {
        for (let y = 0; y < 16; y++) {
            if (getPos(x, y)) {
                tiles.push([x, y]);
            }
        }
    }
    size.w = Math.max(...tiles.map(_ => _[0])) + 1;
    size.h = Math.max(...tiles.map(_ => _[1])) + 1;
    console.log(size);
    for (let y = 0; y < size.h; y++) {
        for (let x = 0; x < size.w; x++) {
            res.push(getPos(x, y))
        }
    }
    return `'${size.w}${size.h}${arr_to_bigstr(res)}'`
}
module.exports = function (content) {
    const json = JSON.parse(content)

    // extract important data
    const args = []
    const layers = {}
    json.layers.forEach(layer => {
        layers[layer.name] = layer
    })
    args.push(`${arr_to_bigstr(layers.level.data)}n`)
    args.push(json.properties.find(({ name }) => name === 'Start Delay').value)
    args.push(`[${layers.objects.objects.map(obj => `[${Math.floor(obj.x / 8)},${Math.floor(obj.y / 8)},${JSON.stringify(obj.name)}]`).join(',')}]`)
    let tile = 0
    do {
        args.push(get_tile(layers[tile].data))
    } while (layers[++tile])
    return `export default new (require(${JSON.stringify(path.resolve(process.cwd(), 'src', 'maps', 'map.js'))}).Map)([${args}])`
}
