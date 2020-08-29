// Local imports
import {
	GRID_SIZE,
	TILE_SIZE,
} from './grid'
import * as maps from '../maps'





const stateObject = {
	currentTile: `010\n111`,
	map: null,
	placeX: 0,
	placeY: 0,
}

export const state = new Proxy(stateObject, {
	set (target, key, value) {
		if (key === 'map') {
			target[key] = maps[value]
			return true
		}

		const {
			columns = 2,
			rows = 3,
		} = target.currentTile

		switch (key) {
			case 'placeX':
				if ((value >= 0) && (value <= (TILE_SIZE.w * (GRID_SIZE.w - rows)))) {
					target[key] = value
				}
				break

			case 'placeY':
				if ((value >= 0) && (value <= (TILE_SIZE.h * (GRID_SIZE.h - columns)))) {
					target[key] = value
				}
				break

			default:
				target[key] = value
		}

		return true
	}
})
