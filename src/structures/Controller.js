// Local imports
import { decodeTile } from '../helpers/decodeTile'
import { playAudio } from '../helpers/audio'
import { state } from '../data/state'





export class Controller {
	constructor () {
		this.enabled = false

		document.on('keydown', ({ code }) => {
			if (this.enabled) {
				switch (code) {
					case 'ArrowDown':
						playAudio('button')
						state.placeY += 1
						break

					case 'ArrowLeft':
						playAudio('button')
						state.placeX -= 1
						break

					case 'ArrowRight':
						playAudio('button')
						state.placeX += 1
						break

					case 'ArrowUp':
						playAudio('button')
						state.placeY -= 1
						break

					case 'Enter':
					case 'Space':
						playAudio('placeTile')
						this.place()
						break
				}
			}
		})
	}

	place() {
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

	start () {
		this.enabled = true
	}

	stop () {
		this.enabled = false
	}
}
