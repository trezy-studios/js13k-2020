// Local imports
import { localStoragePrefix } from '../data/prefix'
import { score } from '../data/score'
import { state } from '../data/state'





export let updateHighScore = () => {
	let key = `${localStoragePrefix}${state.mapName}::high-score`
	localStorage.setItem(key, Math.max(localStorage.getItem(key), score.total))
}
