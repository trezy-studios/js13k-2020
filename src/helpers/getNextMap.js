// Local imports
import { maps } from '../maps/index'
import { state } from '../data/state'





export function getNextMap() {
	return maps.indexOf(state.map) + 1
}
