// Local imports
import { spritesheetImage } from '../helpers/spritesheet'





export const tiles = [
	// Empty
	() => {},

	// Normal tile
	(context, x, y, placing = false) => {
		if (placing) {
			context.image(spritesheetImage, 0, 16, 7, 5, x + 1, y + 2, 7, 5)
			context.alpha(0.5)
		}

		context.image(spritesheetImage, 0, 0, 8, 8, x, y - 1, 8, 8)

		if (placing) {
			context.alpha(1)
		}
	},

	// Corrupted tile
	(context, x, y, placing = false) => {
		if (placing) {
			context.image(spritesheetImage, 0, 16, 7, 5, x + 1, y + 2, 7, 5)
			context.alpha(0.5)
		}

		context.image(spritesheetImage, 0, 8, 8, 8, x, y - 1, 8, 8)

		if (placing) {
			context.alpha(1)
		}
	},
]
