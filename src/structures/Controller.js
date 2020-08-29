// Local imports
import { decodeTile } from '../helpers/decodeTile'
import { state } from '../data/state'





export class Controller {
	constructor () {
		this.enabled = false

		document.on('keydown', ({ code }) => {
			if (this.enabled) {
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
						this.place()
						break
				}
			}
		})
	}

	place() {
		const {
			currentTile,
			map,
			placeX,
			placeY,
		} = state

		const tile = decodeTile(currentTile)

		tile.grid.forEach((rowTiles, rowIndex) => {
			rowTiles.forEach((type, columnIndex) => {
				if (type) {
					const x = columnIndex + placeX
					const y = rowIndex + placeY
					map.update(type, x, y)
				}
			})
		})
	}

	start () {
		this.enabled = true
	}

	stop () {
		this.enabled = false
	}
}
