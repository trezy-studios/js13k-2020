// Local imports
import { createObservable } from '../helpers/createObservable'
import { localStoragePrefix } from './prefix'
import { state } from './state'





let scoreObject = {
	corruptedTileBonus: 0,
	earlyStartBonus: 0,
	total: 0,

	get moveBonus() {
		if (state.totalMoves) {
			return Math.floor((192 / state.totalMoves) * 1000)
		}

		return 0
	},

	get remainingTileBonus() {
		return (state.map.tiles.length - state.currentTile) * 1000
	},

	get timeBonus() {
		if (state.timeRemaining < 0) {
			return Math.floor(600000 / Math.abs(state.timeRemaining)) * 100
		}

		return 0
	},

	get preTotal() {
		return this.earlyStartBonus + this.corruptedTileBonus
	},

	get total() {
		return this.earlyStartBonus + this.moveBonus + this.timeBonus + this.remainingTileBonus + this.corruptedTileBonus
	},

	reset: () => {
		scoreObject.corruptedTileBonus = 0
		scoreObject.earlyStartBonus = 0
	},
}

export let score = createObservable(scoreObject)
