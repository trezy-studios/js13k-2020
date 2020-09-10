// Local imports
import {
	GRID_SIZE,
	TILE_SIZE,
} from './grid'
import { createObservable } from '../helpers/createObservable'
import { resetScore } from './score'
import { resetTimer } from '../helpers/timer'
import * as maps from '../maps'





let stateObject = {
	currentTile: 0,
	entities: [],
	frame: 0,
	isVictory: 0,
	lastTimerUpdate: 0,
	map: null,
	paused: 1,
	placeX: 0,
	placeY: 0,
	timeRemaining: 0,
	totalMoves: 0,
}

export let state = createObservable(new Proxy(stateObject, {
	set(target, key, value) {
		if (key === 'map') {
			let map = maps[value]
			resetScore()
			resetTimer()
			map.reset()
			target.currentTile = 0
			target.isVictory = 0
			target.entities = map.objects
			target.placeX = 0
			target.placeY = 0
			target.timeRemaining = map.delay
			target.totalMoves = 0
			target.map = map
			return 1
		}

		if (key === 'timeRemaining') {
			target[key] = Math.max(value, -599000)
			return 1
		}

		if (key === 'currentTile') {
			let tile = target.map.tiles[value]

			if (tile) {
				let maxX = GRID_SIZE.w - tile.size.w
				let maxY = GRID_SIZE.h - tile.size.h

				if (target.placeY > maxY) {
					target.placeY = maxY
				}

				if (target.placeX > maxX) {
					target.placeX = maxX
				}
			}
		}

		if (['placeX', 'placeY'].includes(key)) {
			let currentTile = target.map.tiles[target.currentTile]

			if (currentTile) {
				let {
					w,
					h,
				} = currentTile.size

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
				}
			}

			return 1
		}

		target[key] = value

		return 1
	}
}))
