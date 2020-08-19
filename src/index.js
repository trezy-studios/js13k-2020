// Local imports
import './index.css'
import './patches/addEventListener'
import { canvas } from './render/canvas'
import { tileColors } from './helpers/tileColors'
import * as maps from './maps/index'





// Local constants
const canvasElement = document.querySelector('canvas')
const canvasHeight = canvasElement.height
const canvasWidth = canvasElement.width
const render = canvas(canvasElement)





// Local variables
let currentMap = 'test'
let frame = 0





function gameLoop () {
	const {
		grid,
		columns,
		rows,
	} = maps[currentMap]

	frame++

	const tileHeight = canvasHeight / rows
	const tileWidth = canvasWidth / columns

	grid.forEach((type, index) => {
		const x = (index % columns) * tileWidth
		const y = Math.floor(index / rows) * tileHeight
		const tileColor = tileColors[type]
		render.color(tileColor, tileColor)
		render.rect(x, y, tileWidth, tileHeight)
		render.rect(x, y, tileWidth, tileHeight, [], 'stroke')
	})

	render.update()

	requestAnimationFrame(gameLoop)
}

gameLoop()
