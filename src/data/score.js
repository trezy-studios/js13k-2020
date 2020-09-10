// Local imports
import { state } from './state'





export let score = 0

export let addTimeBonus = () => score += Math.max(state.timeRemaining, 0)

export let getTotalScore = () => {
	const {
		currentTile,
		map,
	} = state

	let earlyStartBonus = Math.floor((192 / state.totalMoves) * 1000)
	let remainingTileBonus = (map.tiles.length - currentTile) * 1000
	let timeBonus = Math.floor(600000 / Math.abs(state.timeRemaining)) * 100

	return [
		score,
		earlyStartBonus,
		timeBonus,
		remainingTileBonus,
		score + earlyStartBonus + timeBonus + remainingTileBonus,
	]
}

export let resetScore = () => score = 0
