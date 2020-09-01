// Local imports
import { decodeTile } from './decodeTile'
import { state } from '../data/state'





let enabled = false

const place = () => {
	const {
		canPlace,
		currentTile,
		map,
		placeX,
		placeY,
	} = state

	if (!canPlace) {
		return
	}

	currentTile.grid.forEach((type, index) => {
		if (type) {
			const x = (index % currentTile.w) + placeX
			const y = Math.floor(index / currentTile.w) + placeY
			map.update(type, x, y)
		}
	})
}

export const start = () => enabled = true

export const stop = () => enabled = false

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
