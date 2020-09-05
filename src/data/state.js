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
		if (key === 'map') {
			target[key] = maps[value]
			return 1
		}

		switch (key) {
			default:
				target[key] = value
		}

		return 1
	}
}))
