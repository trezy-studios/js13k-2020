import './index.css'
import {
	grid,
	tileColors,
} from './state.js'
// import { updateTile } from './helpers/updateTile.js'
// updateTile(3, 4, 2)
// console.log(grid)



import "./patches/addEventListener"
import { canvas } from "./render/canvas"



const canvasElement = document.querySelector("canvas")
const canvasHeight = canvasElement.height
const canvasWidth = canvasElement.width
const render = canvas(canvasElement)
let box_x = 100
let frame = 0

function gameLoop () {
	const { columns } = grid

	box_x += Math.sin(frame / 180 * Math.PI)
	frame++

	const rows = grid.length / columns
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
