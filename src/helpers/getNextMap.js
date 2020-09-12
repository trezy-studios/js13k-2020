// Local imports
import { state } from '../data/state'
import * as maps from '../maps/index'





export function getNextMap() {
	let mapKeys = Object.keys(maps)
	let currentMapIndex = mapKeys.indexOf(state.mapName)
	return mapKeys[currentMapIndex + 1]
}
