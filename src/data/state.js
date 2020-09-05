// Local imports
import {
	GRID_SIZE,
	TILE_SIZE,
} from './grid'
import { createObservable } from '../helpers/createObservable'
import * as maps from '../maps'





let stateObject = {
	canPlace: 1,
	currentTile: decodeTile(`010\n111`),
	map: null,
	placeX: 0,
	placeY: 0,
}

export let state = createObservable(new Proxy(stateObject, {
	set (target, key, value) {
		if (key === 'currentTile') {
			target[key] = decodeTile(value)
			return 1
		}

		if (key === 'map') {
			target[key] = maps[value]
			return 1
		}

		let {
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
						let x = (index % w) + target.placeX
						let y = Math.floor(index / w) + target.placeY
						return target.map.at(x, y) !== 0
					}

					return 0
			})
		}

		return 1
	}
}))
