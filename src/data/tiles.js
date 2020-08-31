// Local imports
import { spritesheetImage } from '../helpers/spritesheet'





export const tiles = [
	// Empty
	() => {},

	// Normal tile
	(context, x, y, placing = false, canPlace = true) => {
		if (placing) {
			const sourceY = canPlace ? 16 : 21
			context.alpha(0.5)
			context.image(spritesheetImage, 0, sourceY, 7, 5, x + 1, y + 2, 7, 5)
		}

		if (!canPlace) {
			const bufferCanvas = document.createElement('canvas')
			const bufferContext = bufferCanvas.getContext('2d')
			bufferCanvas.height = 8
			bufferCanvas.width = 8

			bufferContext.fillStyle = 'red'
			bufferContext.fillRect(0, 0, 8, 8)
			bufferContext.globalCompositeOperation = 'destination-atop'
			bufferContext.drawImage(spritesheetImage, 0, 0, 8, 8, 0, 0, 8, 8)
			context.alpha(0.5)
			context.image(bufferCanvas, 0, 0, 8, 8, x, y - 1, 8, 8)
			context.alpha(1)
		} else {
			context.image(spritesheetImage, 0, 0, 8, 8, x, y - 1, 8, 8)
		}

		if (placing) {
			context.alpha(1)
		}
	},

	// Corrupted tile
	(context, x, y, placing = false, canPlace = true) => {
		if (placing) {
			context.alpha(0.5)
			context.image(spritesheetImage, 0, 16, 7, 5, x + 1, y + 2, 7, 5)
		}

		context.image(spritesheetImage, 0, 8, 8, 8, x, y - 1, 8, 8)

		if (placing) {
			context.alpha(1)
		}
	},
]
