// Local imports
import { spritesheetImage } from '../helpers/spritesheet'





function renderStandardSizeTile(context, x, y, isPlacing = 0, canPlace = 1, sourceX, sourceY) {
	if (isPlacing) {
		let sourceY = canPlace ? 16 : 21
		context.alpha(0.5)
		context.image(spritesheetImage, 0, sourceY, 7, 5, x + 1, y + 2, 7, 5)
	}

	if (!canPlace) {
		context.color(null, 'red')
		context.alpha(0.5)
		context.rect(x, y - 1, 8, 8)
	} else {
		context.image(spritesheetImage, sourceX, sourceY, 8, 8, x, y - 1, 8, 8)
	}

	context.alpha(1)
}

export let tiles = [
	// Empty
	() => {},

	// Normal tile
	(context, x, y, isPlacing = 0, canPlace = 1) => renderStandardSizeTile(context, x, y, isPlacing, canPlace, 0, 0),

	// Corrupted tile
	(context, x, y, isPlacing = 0, canPlace = 1) => renderStandardSizeTile(context, x, y, isPlacing, canPlace, 0, 8),
]
