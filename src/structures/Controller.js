// Local imports
import { state } from '../data/state'
import { TILE_SIZE } from '../data/grid'





export class Controller {
	constructor () {
		this.enabled = false

		document.on('keydown', ({ code }) => {
			if (this.enabled) {
				switch (code) {
					case 'ArrowDown':
						state.placeY += TILE_SIZE.h
						break

					case 'ArrowLeft':
						state.placeX -= TILE_SIZE.w
						break

					case 'ArrowRight':
						state.placeX += TILE_SIZE.w
						break

					case 'ArrowUp':
						state.placeY -= TILE_SIZE.h
						break

					case 'Enter':
						// place the block
						break
				}
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
