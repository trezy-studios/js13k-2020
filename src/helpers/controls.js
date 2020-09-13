// Local imports
import { score } from '../data/score'
import { state } from '../data/state'





let enabled = 0

let place = () => {
	let {
		map,
		placeX,
		placeY,
	} = state

	let currentTile = map.tiles[state.currentTile]

	if (!currentTile) {
		return
	}

	let canPlace = !currentTile.data.some((type, index) => {
		if (type) {
			let x = (index % currentTile.size.w) + placeX
			let y = Math.floor(index / currentTile.size.w) + placeY
			return map.at(x, y) !== 0
		}

		return 0
	})

	if (!canPlace) {
		return
	}

	let corruptedTileCount = 0

	currentTile.data.forEach((type, index) => {
		if (type) {
			let x = (index % currentTile.size.w) + placeX
			let y = Math.floor(index / currentTile.size.w) + placeY
			map.update(type, x, y)

			if (type == 2) {
				corruptedTileCount += 1
			}
		}
	})

	if (corruptedTileCount) {
		score.corruptedTileBonus += corruptedTileCount * 250
	}

	state.currentTile += 1
}

export let start = () => enabled = 1

export let stop = () => enabled = 0

document.on('keydown', ({ code }) => {
	if (enabled) {
		switch (code) {
			case 'ArrowDown':
			case 'KeyS':
				state.placeY += 1
				break

			case 'ArrowLeft':
			case 'KeyA':
				state.placeX -= 1
				break

			case 'ArrowRight':
			case 'KeyD':
				state.placeX += 1
				break

			case 'ArrowUp':
			case 'KeyW':
				state.placeY -= 1
				break

			case 'Space':
				place()
				break
		}
	}
})
