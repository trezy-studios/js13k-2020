// Local imports
import { tiles } from '../data/tiles'
import {
	GRID_SIZE,
	TILE_SIZE,
} from '../data/grid'





class Map {
	constructor({ data }) {
		const computed_data = BigInt(data).toString().padStart(GRID_SIZE.w * GRID_SIZE.h, '0').split('').map(num => +num)
		this.original = computed_data
		this.data = computed_data
	}

	index(x, y) {
		return y * GRID_SIZE.w + x
	}

	reset() {
		this.data = this.original
	}

	update(tile, x, y) {
		this.data[this.index(x, y)] = tile
	}

	at(x, y) {
		return this.data[this.index(x, y)]
	}

	render(ctx, offset_x, offset_y) {
		this.data.forEach((type, index) => {
			if (tiles[type]) {
				const x = (index % GRID_SIZE.w) * TILE_SIZE.w + offset_x
				const y = Math.floor(index / GRID_SIZE.w) * TILE_SIZE.h + offset_y
				tiles[type](ctx, x, y)
			}
		})
	}
}
globalThis.Map = Map;