// Local imports
import {
	tiles
} from '../data/tiles'
import {
	GRID_SIZE,
	TILE_SIZE,
} from '../data/grid'

//floodfill check offsets
let PATH_OFFSETS = [[-1, 0], [1, 0], [0, 1], [0, -1], [0, 0]]
//data = grid,
//size = grid size,
//start = x,y start post
//end = x,y end pos
function path(data, size, start, end) {
	let
		{ x: sx, y: sy } = start,
		{ x: ex, y: ey } = end,
		map = [],
		frame,
		temp
	data.forEach((item, index) => {
		let
			x = index % size.w,
			y = (index - x) / size.w
		map[x] = map[x] || []
		map[x][y] = item
	})
	frame = {
		mask: map.map((row) => row.map((cell) => cell == 1)),
		layer: map.map((row, x) =>
			row.map((cell, y) =>
				+(x == sx && y == sy)
			))
	}
	for (let i = 0, next_frame = {}; i < size.w * size.h && (ex == -1 || frame.layer[ex][ey] == 0); i++) {
		next_frame.mask = frame.mask
		next_frame.layer = frame.layer.map((row, x) => row.map((cell, y) => {
			let to_update = false
			for (let offset of PATH_OFFSETS) {
				if ((temp = frame.layer[x + offset[0]]) && temp[y + offset[1]]) {
					to_update = true
				}
			}
			return frame.layer[x][y] + to_update * frame.mask[x][y]
		}))
		frame = next_frame
	}
	if (ex == -1) {
		return frame.layer.map(
			(row, x) => row.map(
				(v, y) => v ? { x, y } : 0)
		)
			.flat(3)
			.filter(_ => _)//bool check
	}
	let x = ex
	let y = ey
	let moves = []
	while (sx != x || sy != y) {
		let positions = []
		let max = 0
		for (let offset of PATH_OFFSETS) {
			let loc = [x + offset[0], y + offset[1]]
			max = Math.max(max, (temp = frame.layer[loc[0]]) && temp[loc[1]] || 0)
		}
		if (max == 0) {
			return { x: -1, y: -1 }
		}
		for (let offset of PATH_OFFSETS) {
			let loc = [x + offset[0], y + offset[1]]
			let val = (temp = frame.layer[loc[0]]) && temp[loc[1]]
			if (val == max) positions.push(loc)
		}
		moves.push({ x, y });
		[x, y] = positions[Math.random() * positions.length | 0]
	}
	return moves.reverse()
}


export class Map {
	constructor(data, w = GRID_SIZE.w, h = GRID_SIZE.h) {
		let computed_data = data[0].toString().padStart(w * h, '0').split('').map(num => +num)

		this.original = computed_data
		this.delay = data[1]
		this.originalObjects = data[2]
		this.size = { w, h }
		this.reset()
		this.tiles = data.slice(3).map(tile => {
			console.log({tile})
			let w = +tile[0]
			let h = +tile[1]
			let data = BigInt(tile.slice(2))
			return new Map([data, 0, []], w, h)
		})
	}

	index(x, y) {
		return y * this.size.w + x
	}

	reset() {
		this.data = [...this.original]
		this.objects = this.originalObjects.map(([x, y, type]) => ({ x, y, type, state: { ox: 0, oy: 0 } }))
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
		return path(this.data, this.size, start, end)
	}
}
export default Map
