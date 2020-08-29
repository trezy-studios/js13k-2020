// Local imports
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

		switch (key) {
			default:
				target[key] = value
		}

		return true
	}
})
