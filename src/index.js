// Local imports
import './index.css'
import './patches/addEventListener'
import { canvas } from './render/canvas'
import * as maps from './maps/index'





// Local constants
const canvasElement = document.querySelector('canvas')
const canvasHeight = canvasElement.height
const canvasWidth = canvasElement.width
const render = canvas(canvasElement)





// Local variables
let currentMap = 'test'
let frame = 0






const gameLoop = () => {
	frame++

	render.drawMap()
	render.update()

	requestAnimationFrame(gameLoop)
}
render.map = maps[value]

gameLoop()
