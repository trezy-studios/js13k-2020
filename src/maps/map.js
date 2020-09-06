// Local imports
import {
	tiles
} from '../data/tiles'
import {
	GRID_SIZE,
	TILE_SIZE,
} from '../data/grid'

//floodfill check offsets
let PATH_OFFSETS = [[-1, 0], [1, 0], [0, 1], [0, -1], [0, 0]];
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
		temp;
	data.forEach((item, index) => {
		let
			x = index % size.w,
			y = (index - x) / size.w
		map[x] = map[x] || []
		map[x][y] = item;
	});
	frame = {
		mask: map.map((row) => row.map((cell) => cell == 1)),
		layer: map.map((row, x) =>
			row.map((cell, y) =>
				+(x == sx && y == sy)
			))
	};
	for (let i = 0, next_frame = {}; i < size.w * size.h && frame.layer[ex][ey] == 0; i++) {
		next_frame.mask = frame.mask;
		next_frame.layer = frame.layer.map((row, x) => row.map((cell, y) => {
			let to_update = false;
			for (let offset of PATH_OFFSETS) {
				if ((temp = frame.layer[x + offset[0]]) && temp[y + offset[1]]) {
					to_update = true;
				}
			}
			return frame.layer[x][y] + to_update * frame.mask[x][y];
		}));
		frame = next_frame;
	}
	let x = ex;
	let y = ey;
	let moves = [];
	while (sx != x || sy != y) {
		let positions = [];
		let max = 0;
		for (let offset of PATH_OFFSETS) {
			let loc = [x + offset[0], y + offset[1]];
			max = Math.max(max, (temp = frame.layer[loc[0]]) && temp[loc[1]] || 0);
		}
		if (max == 0) {
			return { x: -1, y: -1 };
		}
		for (let offset of PATH_OFFSETS) {
			let loc = [x + offset[0], y + offset[1]];
			let val = (temp = frame.layer[loc[0]]) && temp[loc[1]];
			if (val == max) positions.push(loc);
		}
		moves.push({ x, y });
		[x, y] = positions[Math.random() * positions.length | 0];
	}
	return moves.reverse();
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
