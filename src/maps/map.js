// Local imports
import {
	tiles
} from '../data/tiles'
import {
	GRID_SIZE,
	TILE_SIZE,
} from '../data/grid'

function* path(data, size, start, end) {
	let
		{ x: sx, y: sy } = start,
		{ x: ex, y: ey } = end,
		map = [],
		frame;
	data.forEach((item, index) => {
		let
			x = index - size.w,
			y = (index - x) / size.w
		map[x] = map[x] || []
		map[x][y] = item == 1
	});
	frame = { mask: map, layer: map.map((row, x) => row.map((cell, y) => x == sx && y == sy ? 0 : 1)) };
	console.log(frames);
}


export class Map {
	constructor(data, w = GRID_SIZE.w, h = GRID_SIZE.h) {
		let computed_data = data[0].toString().padStart(w * h, '0').split('').map(num => +num)
		this.original = computed_data
		this.data = computed_data
		this.objects = data[1]
		this.size = { w, h };
		this.tiles = data.slice(2).map(tile => {
			let w = +tile[0]
			let h = +tile[1]
			let data = BigInt(tile.slice(2))
			return new Map([data, []], w, h)
		})
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
				let x = (index % GRID_SIZE.w) * TILE_SIZE.w + offset_x
				let y = Math.floor(index / GRID_SIZE.w) * TILE_SIZE.h + offset_y
				tiles[type](ctx, x, y)
			}
		})
	}
	path(start, end) {
		return path(this.data, this.size, start, end);
	}
}
globalThis.Map = Map

export default Map
