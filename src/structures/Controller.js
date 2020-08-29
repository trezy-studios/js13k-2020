// Local imports
import { decodeTile } from '../helpers/decodeTile'
import { state } from '../data/state'
import {
	GRID_SIZE,
	TILE_SIZE,
} from '../data/grid'





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
					const x = columnIndex + (placeX / TILE_SIZE.w)
					const y = rowIndex + (placeY / TILE_SIZE.h)
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
