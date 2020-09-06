// Local imports
import {
	GRID_SIZE,
	TILE_SIZE,
} from './grid'
import { createObservable } from '../helpers/createObservable'
import * as maps from '../maps'





let stateObject = {
	currentTile: 0,
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
