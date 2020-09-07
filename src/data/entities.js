// Local imports
import { spritesheetImage } from '../helpers/spritesheet'
import { state } from '../data/state'
import { TILE_SIZE } from '../data/grid'





export let entities = {
	robot(context, offsetX, offsetY) {
		let framerate = 30
		let x = TILE_SIZE.w * offsetX
		let y = TILE_SIZE.h * offsetY
		let sourceX = 8

		if ((state.frame % framerate) > (framerate / 2)) {
			sourceX += 8
		}

		context.image(spritesheetImage, sourceX, 0, 8, 16, x, y - 13, 8, 16)
	}
}
