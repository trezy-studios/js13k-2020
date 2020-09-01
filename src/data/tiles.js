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
			context.color(null, 'red')
			context.alpha(0.5)
			context.rect(x, y - 1, 8, 8)
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
