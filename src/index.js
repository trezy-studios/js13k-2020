// Local imports
import './index.css'
import './patches/addEventListener'
import { canvas } from './render/canvas'
import * as maps from './maps/index'





// Local constants
const canvasElement = document.querySelector('canvas')
const canvasHeight = canvasElement.height
const canvasWidth = canvasElement.width
const mainMenuElement = document.querySelector('#main')
const mapSelectMenuElement = document.querySelector('#map-select')
const render = canvas(canvasElement)





// Local variables
let frame = 0





const mapSelect = () => {
	mainMenuElement.style.display = 'none'
	mapSelectMenuElement.style.display = 'flex'
}

const gameLoop = () => {
	frame++

	render.drawMap()
	render.update()

	requestAnimationFrame(gameLoop)
}

const handleMapButtonClick = ({ target: { value } }) => {
	render.map = maps[value]
	mapSelectMenuElement.style.display = 'none'
	canvasElement.style.display = 'flex'
	gameLoop()
}

const createMapButton = mapName => {
	const mapButton = document.createElement('button')
	mapButton.setAttribute('type', 'button')
	mapButton.setAttribute('value', mapName)
	mapButton.on('click', handleMapButtonClick)
	mapButton.innerHTML = mapName
	mapSelectMenuElement.appendChild(mapButton)
}

const initialize = () => {
	mainMenuElement.style.display = 'flex'
	document.querySelector('#start').on('click', mapSelect)
	Object.keys(maps).forEach(createMapButton)
}

initialize()
