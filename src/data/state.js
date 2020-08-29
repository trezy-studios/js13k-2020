// Local imports
import {
	GRID_SIZE,
	TILE_SIZE,
} from './grid'
import { decodeTile } from '../helpers/decodeTile'
import * as maps from '../maps'





const stateObject = {
	currentTile: `010\n111`,
	map: null,
	placeX: 0,
	placeY: 0,
}

export const state = new Proxy(stateObject, {
	set (target, key, value) {
		if (key === 'currentTile') {
			target[key] = decodeTile(value)
			return true
		}

		if (key === 'map') {
			target[key] = maps[value]
			return true
		}

		const {
			w = 2,
			h = 3,
		} = target.currentTile

		switch (key) {
			case 'placeX':
				if ((value >= 0) && (value <= (GRID_SIZE.w - h))) {
					target[key] = value
				}
				break

			case 'placeY':
				if ((value >= 0) && (value <= (GRID_SIZE.h - w))) {
					target[key] = value
				}
				break

			default:
				target[key] = value
		}

		return true
	}
})
