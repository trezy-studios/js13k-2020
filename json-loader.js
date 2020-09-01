
const arr_to_bigstr = (arr) => `0x${BigInt(arr.join("")).toString(16)}n`
const transform_map = (map) => {
    const res = [];
    const getPos = (x, y) => map[x + y * 12];
    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
            res.push(getPos(x, y));
        }
    }
    return res;
}
module.exports = function (content) {
    const json = JSON.parse(content)

    // extract important data
    const args = [];
    const layers = {};
    json.layers.forEach(layer => {
        layers[layer.name] = layer;
    });
    console.log(layers);
    args.push(`${arr_to_bigstr(layers.level.data)}`);
    args.push(`[${layers.objects.objects.map(obj => `{x:${Math.floor(obj.x / 8)},y:${Math.floor(obj.y / 8)},n:${JSON.stringify(obj.name)}}`).join(",")}]`);
    let tile = 0;
    do {
        args.push(`new Map([${arr_to_bigstr(transform_map(layers[tile].data))},[]])`);
    } while (layers[++tile]);
    console.log(`module.exports = new Map([${args}])`);
    return `module.exports = new Map([${args}])`;
}