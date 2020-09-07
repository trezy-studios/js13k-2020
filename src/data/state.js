// Local imports
import {
	GRID_SIZE,
	TILE_SIZE,
} from './grid'
import { createObservable } from '../helpers/createObservable'
import * as maps from '../maps'





let stateObject = {
	currentTile: 0,
	frame: 0,
	entities: [],
	map: null,
	placeX: 0,
	placeY: 0,
}

export let state = createObservable(new Proxy(stateObject, {
	set (target, key, value) {
		if (key === 'map') {
			target[key] = maps[value]
			return 1
		}

		if (key === 'currentTile') {
			let tile = target.map.tiles[value]

			if (tile) {
				let maxX = GRID_SIZE.w - tile.size.w
				let maxY = GRID_SIZE.h - tile.size.h

				if (target.placeY > maxY) {
					target.placeY = maxY
				}

				if (target.placeX > maxX) {
					target.placeX = maxX
				}
			}
		}

		if (['placeX', 'placeY'].includes(key)) {
			let currentTile = target.map.tiles[target.currentTile]

			if (currentTile) {
				let {
					w,
					h,
				} = currentTile.size

				switch (key) {
					case 'placeX':
						if ((value >= 0) && (value <= (GRID_SIZE.w - w))) {
							target[key] = value
						}
						break

					case 'placeY':
						if ((value >= 0) && (value <= (GRID_SIZE.h - h))) {
							target[key] = value
						}
						break
				}
			}

			return 1
		}

		target[key] = value

		return 1
	}
}))
