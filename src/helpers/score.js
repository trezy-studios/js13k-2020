// Local imports
import { localStoragePrefix } from '../data/prefix'
import { score } from '../data/score'
import { state } from '../data/state'





export let updateHighScore = () => {
	let key = `${localStoragePrefix}${state.mapIndex}::high-score`
	localStorage.setItem(key, Math.max(localStorage.getItem(key), score.total))
}

export let updateScores = node => {
	node.querySelectorAll('[data-score]').forEach(scoreElement => {
		scoreElement.innerHTML = score[scoreElement.getAttribute('data-score')]
	})
	node.querySelector('#final-score .value').innerHTML = score.total
}
