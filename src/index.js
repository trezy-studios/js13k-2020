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
import {
	getUnlockedLevels,
	unlockLevel,
} from './data/unlocks'
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
		let currentTileElement = this.node.querySelector('#current-tile')
		let highScoreElement = this.node.querySelector('#high-score')
		let levelRecapElement = this.node.querySelector('#level-recap')
		let nextTileElement = this.node.querySelector('#next-tile')
		let nextLevelButton = this.node.querySelector('#next-level')
		let quitButton = this.node.querySelector('[data-action="quit"]')
		let resetLevelButton = this.node.querySelector('#reset')
		let retryLevelButton = this.node.querySelector('#retry')
		let skipTimerButton = this.node.querySelector('#skip-timer')
		let tilesRemainingElement = this.node.querySelector('#tiles-remaining')
		let tutorialMessageElement = this.node.querySelector('#tutorial-message')

		this.timers = []

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

		let updateTileQueue = () => {
			let {
				currentTile,
				map,
			} = state

			;[currentTileElement, nextTileElement].forEach((tileElement, index) => {
				let tile = map.tiles[currentTile + index]
				let targetElement = tileElement.querySelector('.target')

				targetElement.innerHTML = ''

				if (tile) {
					let tileCanvasElement = document.createElement('canvas')
					tileCanvasElement.height = (tile.size.h * TILE_SIZE.h) + 2
					tileCanvasElement.width = tile.size.w * TILE_SIZE.w

					let context = canvas(tileCanvasElement, 0, 1)
					context.drawMap(tile)
					context.update()

					targetElement.appendChild(tileCanvasElement)

					tileElement.removeAttribute('hidden')
				} else {
					tileElement.setAttribute('hidden', 1)
				}
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

		quitButton.on('click', () => mapSelectScreen.show())

		skipTimerButton.on('click', ({ target }) => {
			score.earlyStartBonus += state.timeRemaining
			state.timeRemaining = 0
			target.blur()
			target.setAttribute('hidden', 1)
		})

		nextLevelButton.on('click', () => state.map = getNextMap())

		resetLevelButton.on('click', ({ target }) => {
			target.blur()
			state.map.reset()
			state.entities = state.map.objects
			state.currentTile = 0
		})

		retryLevelButton.on('click', () => state.map = state.mapIndex)

		score.on('change', () => {
			if (currentScoreElement.innerText != score.preTotal) {
				currentScoreElement.innerText = score.preTotal
			}
		})

		state.on('change:currentTile', updateTileQueue)

		state.on('change:map', () => {
			let {
				currentTile,
				map,
			} = state

			if (map) {
				this.timers.map(clearTimeout)

				currentScoreElement.innerHTML = 0

				if (state.highScore) {
					highScoreElement.querySelector('.value').innerHTML = state.highScore
					highScoreElement.removeAttribute('hidden')
				} else {
					highScoreElement.setAttribute('hidden', 1)
				}

				levelRecapElement.setAttribute('hidden', 1)

				updateTileQueue()

				if (tutorial) {
					tutorialMessageElement.innerHTML = ''

					if (state.tutorial) {
						let tutorialMessages = [
							[
								[
									'Use the arrow keys',
									'or W, A, S, and D',
									'to move the placer',
								],
								[
									'Press the Space Bar',
									'to place a tile',
								],
								[
									'Press the Enter key',
									'to start the bot',
								],
								[
									'Build a bridge so it',
									'can reach the portal',
								],
							],

							[
								[
									'Dark blocks are',
									'corrupted',
								],
								[
									'The bot cannot',
									'move on them',
								],
								[
									'Build your bridge',
									'around them instead',
								],
							],

							[
								[
									'Watch your timer!',
								],
								[
									'The bot will start',
									'moving when the',
									'timer hits 0',
								],
								[
									'You will earn bonus',
									'points for starting',
									'before the timer ends',
								],
							],
						]

						let updateTutorialMessage = index => {
							let messageQueue = tutorialMessages[state.mapIndex]

							if (messageQueue) {
								let message = messageQueue[index]

								tutorialMessageElement.innerHTML = ''

								if (message) {
									message.map(line => {
										let tutorialMessageFirstLine = document.createElement('div')
										tutorialMessageFirstLine.innerHTML = line
										tutorialMessageElement.appendChild(tutorialMessageFirstLine)
									})

									tutorialMessageElement.removeAttribute('hidden')

									this.timers.push(setTimeout(updateTutorialMessage, 3000, index + 1))
								} else {
									tutorialMessageElement.setAttribute('hidden', 1)
								}
							}
						}

						updateTutorialMessage(0)
					}
				}
			}
		})

		state.on('change:isVictory', () => {
			if (state.isVictory) {
				updateScores(levelRecapElement)
				updateHighScore()
				currentScoreElement.innerHTML = score.total
				tutorialMessageElement.innerHTML = ''
				this.timers.map(clearTimeout)

				let nextMap = getNextMap()

				if (!nextMap) {
					nextLevelButton.setAttribute('hidden', 1)
				} else {
					unlockLevel(nextMap)
				}

				levelRecapElement.removeAttribute('hidden')
			}
		})

		gameLoop()
	},

	onShow() {
		startController()
		state.paused = 0
	},

	selector: '#game',
})

let mapSelectScreen = new Screen({
	onInit() {
		this.node.querySelector('#tutorial').on('click', () => {
			state.tutorial = 1
			state.map = 0
			gameScreen.show()
		})
	},

	onShow() {
		let mapsList = this.node.querySelector('#maps')
		mapsList.innerHTML = ''

		let handleMapButtonClick = event => {
			let { target: { value } } = event
			state.tutorial = 0
			state.map = value
			gameScreen.show()
		}

		let createMapButton = mapIndex => {
			let map = maps[mapIndex]
			let mapButton = document.createElement('button')
			mapButton.innerHTML = map.name
			mapButton.setAttribute('type', 'button')
			mapButton.setAttribute('value', mapIndex)
			mapButton.on('click', handleMapButtonClick)

			mapsList.appendChild(mapButton)
		}

		this.node.querySelector('.back').addEventListener('click', () => mainMenuScreen.show())

		getUnlockedLevels().forEach(createMapButton)
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
