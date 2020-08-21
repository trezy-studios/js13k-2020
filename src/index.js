// Local imports
import './index.css'
import './patches/addEventListener'
import { canvas } from './render/canvas'
import { createStringCanvas } from './render/font'
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

const handleMapButtonClick = event => {
	const { target: { value } } = event
	render.map = value
	mapSelectMenuElement.style.display = 'none'
	canvasElement.style.display = 'flex'
	gameLoop()
}

const createMapButton = mapName => {
	const mapButton = document.createElement('button')
	mapButton.setAttribute('type', 'button')
	mapButton.setAttribute('value', mapName)
	mapButton.on('click', handleMapButtonClick)
	const mapNameCanvas = createStringCanvas(mapName, 2)
	mapButton.appendChild(mapNameCanvas)
	mapSelectMenuElement.appendChild(mapButton)
}

const initialize = () => {
	mainMenuElement.style.display = 'flex'
	const startButtonElement = document.querySelector('#start')

	startButtonElement.on('click', mapSelect)
	const startTextCanvas = createStringCanvas('start', 2)
	startButtonElement.appendChild(startTextCanvas)

	document.querySelector('#start').on('click', mapSelect)
	Object.keys(maps).forEach(createMapButton)
}

initialize()
