// Local imports
import { spritesheetImage } from '../helpers/spritesheet'
import { state } from '../data/state'
import { TILE_SIZE } from '../data/grid'





export let entities = {
	exit(context, offsetX, offsetY) {
		let frames = 10
		let x = TILE_SIZE.w * offsetX
		let y = TILE_SIZE.h * offsetY
		let sourceX = 24 + (Math.floor((state.frame % 60) / (60 / frames)) * 8)

		context.image(spritesheetImage, sourceX, 0, 8, 16, x, y - 13, 8, 16)
	},

	robot(context, offsetX, offsetY) {
		let frames = 2
		let x = TILE_SIZE.w * offsetX
		let y = TILE_SIZE.h * offsetY
		let sourceX = 8 + (Math.floor((state.frame % 60) / (60 / frames)) * 8)

		context.image(spritesheetImage, sourceX, 0, 8, 16, x, y - 13, 8, 16)
	},
}
