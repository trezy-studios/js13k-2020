import { TILE_SIZE } from "../data/grid";
export class Map {
    constructor({ data, width, height }) {
        const computed_data = BigInt(data).toString().padStart(width * height, '0').split('').map(num => +num)
        this.original = computed_data;
        this.data = computed_data;
        this.width = width;
        this.height = height;
    }
    index(x, y) {
        return y * this.width + x;
    }
    reset() {
        this.data = this.original;
    }
    update(tile, x, y) {
        this.data[this.index(x, y)] = tile;
    }
    at(x, y) {
        return this.data[this.index(x, y)];
    }
    render(ctx, offset_x, offset_y) {

        this.data.forEach((type, index) => {
            const x = (index % this.width) * TILE_SIZE.w + offset_x
            const y = Math.floor(index / this.width) * TILE_SIZE.h + offset_y
            tiles[type](ctx, x, y);
        })
    }
}
