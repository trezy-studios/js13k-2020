// Local imports
import SpritesheetImage from '../assets/images/spritesheet.png'





// Local constants
const spritesheetImage = new Image





spritesheetImage.src = SpritesheetImage





export const tiles = [
	() => { },//empty
	(context, x, y) => {
		context.image(spritesheetImage, 0, 0, 8, 8, x, y - 1, 8, 8)
	},
	(context, x, y) => {
		context.image(spritesheetImage, 0, 8, 8, 8, x, y - 1, 8, 8)
	},
]
