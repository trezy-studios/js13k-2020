// Local imports
import { maps } from '../maps/index'
import { state } from '../data/state'





export function getNextMap() {
	let nextMapIndex = maps.indexOf(state.map) + 1

	if (maps[nextMapIndex]) {
		return nextMapIndex
	}

	return null
}
