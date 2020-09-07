// Local imports
import { TILE_SIZE } from '../data/grid'
import { spritesheetImage } from '../helpers/spritesheet'





export let entities = {
	robot(context, offsetX, offsetY) {
		let x = TILE_SIZE.w * offsetX
		let y = TILE_SIZE.h * offsetY
		context.image(spritesheetImage, 8, 0, 8, 16, x, y - 13, 8, 16)
	}
}
