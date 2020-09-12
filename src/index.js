// Local imports
import './index.scss'
import './patches/addEventListener'
import {
	start as startController,
	stop as stopController,
} from './helpers/controls'
import {
	updateHighScore,
	updateScores,
} from './helpers/score'
import {
	resetTimer,
	updateTimer,
} from './helpers/timer'
import { canvas } from './render/canvas'
import { createStringCanvas } from './render/font'
import { getNextMap } from './helpers/getNextMap'
import { maps } from './maps/index'
import { score } from './data/score'
import { Screen } from './structures/Screen'
import { state } from './data/state'
import { TILE_SIZE } from './data/grid'
import { updateGameScale } from './helpers/updateGameScale'





let canvasElement = document.querySelector('canvas')
let canvasHeight = canvasElement.height
let canvasWidth = canvasElement.width
let render = canvas(canvasElement, 0, 14)





// Local variables
let music = null





// screens
let gameScreen = new Screen({
	onHide() {
		state.paused = 1
		stopController()
	},

	onInit() {
		let currentScoreElement = this.node.querySelector('#current-score .value')
		let levelRecapElement = this.node.querySelector('#level-recap')
		let highScoreElement = this.node.querySelector('#high-score')
		let tileQueueElement = this.node.querySelector('#tile-queue ol')
		let tilesRemainingElement = this.node.querySelector('#tiles-remaining')

		let quitButton = this.node.querySelector('[data-action="quit"]')
		quitButton.on('click', () => mapSelectScreen.show())

		let skipTimerButton = this.node.querySelector('#skip-timer')
		skipTimerButton.on('click', ({ target }) => {
			score.earlyStartBonus += state.timeRemaining
			state.timeRemaining = 0
			target.blur()
			target.setAttribute('hidden', 1)
			target.setAttribute('disabled', 1)
		})

		let nextLevelButton = this.node.querySelector('#next-level')
		nextLevelButton.on('click', () => state.map = getNextMap())

		let resetLevelButton = this.node.querySelector('#reset')
		resetLevelButton.on('click', () => state.map = state.mapIndex)

		let gameLoop = () => {
			if (!state.isVictory && !state.paused) {
				let now = performance.now()

				let {
					currentTile,
					entities,
					map,
				} = state

				state.frame += 1

				render.drawGrid()
				render.drawMap(map)
				render.drawEntities(entities)

				if (currentTile < map.tiles.length) {
					render.drawPlacement()
				}

				render.update()
				updateTimer(now)

				let [exits, robots] = state.entities.reduce((accumulator, entity) => {
					switch (entity.type) {
						case 'exit':
							accumulator[1].push(entity)
							break
						case 'robot':
							accumulator[0].push(entity)
							break
					}
					return accumulator
				}, [[], []])

				let allRobotsHaveFinished = robots.every(robot => exits.some(({x, y}) => (x === robot.x) && (y === robot.y)))

				if (allRobotsHaveFinished) {
					state.isVictory = 1
				}
			}

			requestAnimationFrame(gameLoop)
		}

		gameLoop()

		score.on('change', () => {
			if (currentScoreElement.innerText != score.preTotal) {
				currentScoreElement.innerText = score.preTotal
			}
		})

		state.on('change:currentTile', () => {
			let {
				currentTile,
				map,
			} = state

			if (map) {
				// Update the tile queue
				tileQueueElement.innerHTML = ''

				if (currentTile >= map.tiles.length - 1) {
					let noTilesRemainingElement = document.createElement('li')
					noTilesRemainingElement.innerHTML = 'Empty'
					tileQueueElement.appendChild(noTilesRemainingElement)
				}

				map.tiles.slice(currentTile + 1, currentTile + 4).forEach(tile => {
					let listItem = document.createElement('li')
					let tileCanvasElement = document.createElement('canvas')
					tileCanvasElement.height = (tile.size.h * TILE_SIZE.h) + 2
					tileCanvasElement.width = tile.size.w * TILE_SIZE.w

					let context = canvas(tileCanvasElement, 0, 1)
					context.drawMap(tile)
					context.update()

					listItem.appendChild(tileCanvasElement)
					tileQueueElement.appendChild(listItem)
				})

				let tilesUsedPercentage = (currentTile / map.tiles.length) * 100
				let tilesRemainingStatusColor = '#64b964'

				if (tilesUsedPercentage >= 50) {
					tilesRemainingStatusColor = '#e6c86e'
				}

				if (tilesUsedPercentage >= 75) {
					tilesRemainingStatusColor = '#d77355'
				}

				tilesRemainingElement.style.setProperty('--p', `${(currentTile / map.tiles.length) * 100}%`)
				tilesRemainingElement.style.setProperty('--c', tilesRemainingStatusColor)
			}
		})

		state.on('change:map', () => {
			let {
				currentTile,
				map,
			} = state

			if (map) {
				let highScoreElement = document.querySelector('#high-score')

				currentScoreElement.innerHTML = 0

				if (state.highScore) {
					highScoreElement.querySelector('.value').innerHTML = state.highScore
					highScoreElement.removeAttribute('hidden')
				} else {
					highScoreElement.setAttribute('hidden', 1)
				}

				levelRecapElement.setAttribute('hidden', 1)
			}
		})

		state.on('change:isVictory', () => {
			if (state.isVictory) {
				updateScores(levelRecapElement)
				updateHighScore()
				currentScoreElement.innerHTML = score.total
				levelRecapElement.removeAttribute('hidden')

				// mapSelectScreen.show()
			}
		})
	},

	onShow() {
		startController()
		state.paused = 0
	},

	selector: '#game',
})

let mapSelectScreen = new Screen({
	onInit() {
		let mapsList = this.node.querySelector('#maps')

		let handleMapButtonClick = event => {
			let { target: { value } } = event
			state.map = value
			gameScreen.show()
		}

		let createMapButton = (map, index) => {
			let mapButton = document.createElement('button')
			mapButton.innerHTML = map.name
			mapButton.setAttribute('type', 'button')
			mapButton.setAttribute('value', index)
			mapButton.on('click', handleMapButtonClick)

			mapsList.appendChild(mapButton)
		}

		this.node.querySelector('.back').addEventListener('click', () => mainMenuScreen.show())

		maps.forEach(createMapButton)
	},

	selector: '#map-select',
})

let mainMenuScreen = new Screen({
	onInit() {
		let startButtonElement = this.node.querySelector('#start')
		startButtonElement.on('click', () => mapSelectScreen.show())
	},

	selector: '#main-menu',
})





let initialize = () => {
	function renderStrings(root = document.documentElement) {
		if (root.nodeType === 3) {
			root = root.parentNode
		}

		let treewalker = document.createTreeWalker(
			root,
			NodeFilter.SHOW_TEXT,
			{
				acceptNode({ data }) {
					if (Boolean(data.trim())) {
						return NodeFilter.FILTER_ACCEPT
					}
				},
			},
			0
		)

		let nextNode = null

		while (nextNode = treewalker.nextNode()) {
			let container = nextNode.parentNode

			if (['SCRIPT', 'STYLE'].includes(container.tagName)) {
				continue
			}

			let fontFamily = (container.getAttribute('data-font') || 'awkward').toLowerCase()

			if (/^h\d$/iu.test(container.nodeName)) {
				fontFamily = 'thaleah'
			}

			let oldCanvas = container.querySelector('canvas')

			if (oldCanvas) {
				container.removeChild(oldCanvas)
			}

			let textCanvas = createStringCanvas(container.innerText, fontFamily, container.classList.contains('danger'))

			container.style.fontSize = 0
			container.appendChild(textCanvas)
		}
	}

	let handleMutation = mutation => {
		let {
			addedNodes,
			type,
		} = mutation

		if ((type === 'childList') && addedNodes.length) {
			addedNodes.forEach(node => renderStrings(node))
		}
	}

	let mutationObserver = new MutationObserver((mutations, observer) => {
		mutations.forEach(handleMutation)
	})

	mutationObserver.observe(document.documentElement, {
		childList: 1,
		subtree: 1,
	})

	updateGameScale()
	renderStrings()
	mainMenuScreen.show()
}

initialize()
