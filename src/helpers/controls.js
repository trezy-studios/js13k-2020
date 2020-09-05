// Local imports
import { state } from '../data/state'





let enabled = 0

let place = () => {
	let {
		canPlace,
		currentTile,
		map,
		placeX,
		placeY,
	} = state

	if (!canPlace) {
		return
	}

	state.currentTile += 1
}

export let start = () => enabled = 1

export let stop = () => enabled = 0

document.on('keydown', ({ code }) => {
	if (enabled) {
		switch (code) {
			case 'ArrowDown':
				state.placeY += 1
				break

			case 'ArrowLeft':
				state.placeX -= 1
				break

			case 'ArrowRight':
				state.placeX += 1
				break

			case 'ArrowUp':
				state.placeY -= 1
				break

			case 'Enter':
			case 'Space':
				place()
				break
		}
	}
})
