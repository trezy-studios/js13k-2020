import './index.css'
// import { grid } from './state.js'
// import { updateTile } from './helpers/updateTile.js'
// updateTile(3, 4, 2)
// console.log(grid)



import "./patches/addEventListener"
import { canvas } from "./render/canvas"



const render = canvas(document.querySelector("canvas"))
let box_x = 100
let frame = 0

function gameLoop () {
	box_x += Math.sin(frame / 180 * Math.PI)
	frame++
	render.color("red", "red")
	render.rect(0, 0, innerWidth, innerHeight)
	render.color("black", "black")
	render.rect(box_x - 10, 0, 20, 20)
	render.update()
	requestAnimationFrame(gameLoop)
}

gameLoop()
