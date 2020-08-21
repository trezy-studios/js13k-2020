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
	render.drawEntities()
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
	const mapListItem = document.createElement('li')
	const mapButton = document.createElement('button')
	const mapNameCanvas = createStringCanvas(mapName, 8)
	const mapSelectMapListElement = mapSelectMenuElement.querySelector('ol')

	mapButton.setAttribute('type', 'button')
	mapButton.setAttribute('value', mapName)
	mapButton.on('click', handleMapButtonClick)
	mapButton.appendChild(mapNameCanvas)
	mapListItem.appendChild(mapButton)
	mapSelectMapListElement.appendChild(mapListItem)
}

const initialize = () => {
	mainMenuElement.style.display = 'flex'

	const startButtonElement = document.querySelector('#start')
	const startTextCanvas = createStringCanvas('start', 8)
	startButtonElement.on('click', mapSelect)
	startButtonElement.appendChild(startTextCanvas)

	const mapSelectTextCanvas = createStringCanvas('Choose a map', 8)
	const mapSelectMapListElement = document.createElement('ol')
	mapSelectMenuElement.appendChild(mapSelectTextCanvas)
	mapSelectMenuElement.appendChild(mapSelectMapListElement)

	document.querySelector('#start').on('click', mapSelect)
	Object.keys(maps).forEach(createMapButton)
}

initialize()
