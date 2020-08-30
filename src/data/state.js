// Local imports
import {
	GRID_SIZE,
	TILE_SIZE,
} from './grid'
import { decodeTile } from '../helpers/decodeTile'
import * as maps from '../maps'





const stateObject = {
	canPlace: true,
	currentTile: decodeTile(`010\n111`),
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
			w,
			h,
		} = target.currentTile

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

			default:
				target[key] = value
		}

		if (['placeX', 'placeY'].includes(key)) {
			target.canPlace = !target.currentTile.grid.some((type, index) => {
					if (type) {
						const x = (index % w) + target.placeX
						const y = Math.floor(index / w) + target.placeY
						return target.map.at(x, y) !== 0
					}

					return false
			})
		}

		return true
	}
})
