// Local imports
import SpritesheetImage from '../assets/images/spritesheet.png'





// Local constants
const spritesheetImage = new Image





spritesheetImage.src = SpritesheetImage





export const tiles = [
	// Empty
	() => { },

	// Normal tile
	(context, x, y) => {
		context.image(spritesheetImage, 0, 0, 8, 8, x, y - 1, 8, 8)
	},

	// Corrupted tile
	(context, x, y) => {
		context.image(spritesheetImage, 0, 8, 8, 8, x, y - 1, 8, 8)
	},
]
