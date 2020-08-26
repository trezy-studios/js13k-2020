import { tiles } from "../helpers/tiles";
import { TILE_SIZE } from "../render/canvas";
export class Map {
    constructor({ data, width, height }) {
        this.original = data;
        this.data = data;
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
        ctx.shadow.canvas.height = this.width * 7
        ctx.shadow.canvas.width = this.height * 9
        ctx.fitToScreen()

        this.data.forEach((type, index) => {
            const x = (index % this.width) * TILE_SIZE + offset_x
            const y = Math.floor(index / this.width) * TILE_SIZE + offset_y
            tiles[type](ctx, x, y);
        })
    }
}