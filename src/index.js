// Local imports
import './index.scss'
import './patches/addEventListener'
import { canvas } from './render/canvas'
import { createStringCanvas } from './render/font'
import { Screen } from './structures/Screen'
import * as maps from './maps/index'





// Local constants
const canvasElement = document.querySelector('canvas')
const canvasHeight = canvasElement.height
const canvasWidth = canvasElement.width
const gameElement = document.querySelector('#game')
const mainMenuElement = document.querySelector('#main')
const mapSelectMenuElement = document.querySelector('#map-select')
const render = canvas(canvasElement)





// screens
const gameScreen = new Screen({
	onShow () {
		let frame = 0

		const gameLoop = () => {
			frame++

			render.drawGrid()
			render.drawMap()
			render.update()

			requestAnimationFrame(gameLoop)
		}

		gameLoop()
	},

	selector: '#game',
})

const mapSelectScreen = new Screen({
	onInit () {
		const mapsList = this.node.querySelector('#maps')

		const handleMapButtonClick = event => {
			const { target: { value } } = event
			render.map = value
			gameScreen.show()
		}

		const createMapButton = mapName => {
			const mapButton = document.createElement('button')
			mapButton.setAttribute('type', 'button')
			mapButton.setAttribute('value', mapName)
			mapButton.on('click', handleMapButtonClick)

			const mapNameCanvas = createStringCanvas(mapName)

			mapButton.appendChild(mapNameCanvas)
			mapsList.appendChild(mapButton)
		}

		this.node.querySelector('.back').addEventListener('click', () => mainMenuScreen.show())

		Object.keys(maps).forEach(createMapButton)
	},

	selector: '#map-select',
})

const mainMenuScreen = new Screen({
	onInit () {
		const startButtonElement = document.querySelector('#start')
		startButtonElement.on('click', () => mapSelectScreen.show())
	},

	selector: '#main-menu',
})





const initialize = () => {
	function renderStrings (root = document.documentElement) {
		if (root.nodeType === 3) {
			root = root.parentNode
		}

		const treewalker = document.createTreeWalker(
			root,
			NodeFilter.SHOW_TEXT,
			{
				acceptNode ({ data }) {
					if (Boolean(data.trim())) {
						return NodeFilter.FILTER_ACCEPT
					}
				},
			},
			false
		)

		let nextNode = null

		while (nextNode = treewalker.nextNode()) {
			const container = nextNode.parentNode
			let fontFamily = (container.getAttribute('data-font') || 'awkward').toLowerCase()

			if (/^h\d$/iu.test(container.nodeName)) {
				fontFamily = 'thaleah'
			}

			const textCanvas = createStringCanvas(container.innerText, fontFamily)

			container.style.fontSize = 0
			container.appendChild(textCanvas)
		}
	}

	const handleMutation = mutation => {
		const {
			addedNodes,
			type,
		} = mutation

		if ((type === 'childList') && addedNodes.length) {
			addedNodes.forEach(node => renderStrings(node))
		}
	}

	const mutationObserver = new MutationObserver((mutations, observer) => {
		mutations.forEach(handleMutation)
	})

	mutationObserver.observe(document.documentElement, {
		childList: true,
		subtree: true,
	})

	renderStrings()

	mainMenuScreen.show()
}

initialize()
