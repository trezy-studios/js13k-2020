// Local imports
import {
	tiles
} from '../data/tiles'
import {
	GRID_SIZE,
	TILE_SIZE,
} from '../data/grid'





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
		return y * this.size.w + x
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

	render(ctx, offsetX = 0, offsetY = 0, targetMap = 0) {
		const horizontalOffset = offsetX * TILE_SIZE.w
		const verticalOffset = offsetY * TILE_SIZE.h
		this.data.forEach((type, index) => {
			if (tiles[type]) {
				let x = index % this.size.w
				let xPixel = x * TILE_SIZE.w + horizontalOffset
				let y = Math.floor(index / this.size.w)
				let yPixel = y * TILE_SIZE.h + verticalOffset

				tiles[type](ctx, xPixel, yPixel, targetMap, !targetMap || !targetMap.at(x + offsetX, y + offsetY))
			}
		})
	}

	path(start, end) {
		return path(this.data, this.size, start, end);
	}
}
globalThis.Map = Map

export default Map
