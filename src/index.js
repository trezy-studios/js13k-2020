// Local imports
import './index.scss'
import './patches/addEventListener'
import {
	playAudio,
	setMusicVolume,
} from './helpers/audio'
import {
	start as startController,
	stop as stopController,
} from './helpers/controls'
import { canvas } from './render/canvas'
import { createStringCanvas } from './render/font'
import { score } from './data/score'
import { Screen } from './structures/Screen'
import { settings } from './data/settings'
import { state } from './data/state'
import { TILE_SIZE } from './data/grid'
import { updateGameScale } from './helpers/updateGameScale'
import { updateHighScore } from './helpers/score'
import { updateTimer } from './helpers/timer'
import * as maps from './maps/index'





let canvasElement = document.querySelector('canvas')
let canvasHeight = canvasElement.height
let canvasWidth = canvasElement.width
let gameElement = document.querySelector('#game')
let gameWrapperElement = document.querySelector('#game-wrapper')
let mainMenuElement = document.querySelector('#main')
let mapSelectMenuElement = document.querySelector('#map-select')
let render = canvas(canvasElement, 0, 14)





// Local variables
let music = null





// screens
let settingsScreen = new Screen({
	onHide() {
		this.screenSource = null
	},

	onInit() {
		let resumeButton = this.node.querySelector('[data-action="open:game"]')
		resumeButton.on('click', () => {
			this.screenSource.show()
		})

		let quitButton = this.node.querySelector('[data-action="quit"]')
		quitButton.on('click', () => mapSelectScreen.show())

		settings.on('change:musicVolume', () => setMusicVolume())

		let options = this.node.querySelectorAll('.option')
		options.forEach(option => {
			let [, target] = option.getAttribute('data-action').split(':')
			let targetElement = this.node.querySelector(`#${target}`)
			let menuElements = [...targetElement.parentNode.children]

			option.on('click', () => {
				options.forEach(otherOption => otherOption.classList.remove('active'))
				option.classList.add('active')

				menuElements.forEach(menuElement => menuElement.setAttribute('hidden', 1))
				targetElement.removeAttribute('hidden')
			})
		})

		let inputs = this.node.querySelectorAll('input')
		inputs.forEach(inputElement => {
			let {
				name,
				type,
			} = inputElement

			inputElement.on('change', ({ target }) => {
				let {
					checked,
				} = target

				switch (type) {
					case 'checkbox':
						settings[name] = +checked
						break

					case 'number':
						settings[name] = target.value.replace(/[^/d]/gu, '')
						break

					default:
						settings[name] = target.value
				}
			})

			let settingsValue = settings[name]

			if (typeof settingsValue === 'boolean') {
				inputElement.checked = settingsValue
			} else if (inputElement.type === 'radio') {
				let targetElement = this.node.querySelector(`[name="${inputElement.name}"][value="${settingsValue}"]`)
				targetElement.checked = 1
			} else {
				inputElement.value = settingsValue
			}
		})
	},

	onShow(screenSource) {
		let quitButtonElement = this.node.querySelector('[data-action="quit"]')

		if (screenSource !== gameScreen) {
			quitButtonElement.setAttribute('hidden', 1)
		} else {
			quitButtonElement.removeAttribute('hidden')
		}

		this.screenSource = screenSource
	},

	selector: '#settings-menu',
})

let gameScreen = new Screen({
	onHide() {
		state.paused = 1
		stopController()
	},

	onInit() {
		let currentScoreValueElement = document.querySelector('#current-score .value')
		let topScoreElement = document.querySelector('#high-score')
		let tileQueueElement = document.querySelector('#tile-queue ol')
		let tilesRemainingElement = document.querySelector('#tiles-remaining')

		let menuButton = this.node.querySelector('[data-action="open:menu"]')
		menuButton.on('click', () => settingsScreen.show(this))

		let skipTimerButton = this.node.querySelector('#skip-timer')
		skipTimerButton.on('click', ({ target }) => {
			score.earlyStartBonus += state.timeRemaining
			state.timeRemaining = 0
			target.blur()
			target.setAttribute('hidden', 1)
			target.setAttribute('disabled', 1)
		})

		let gameLoop = () => {
			if (!state.paused) {
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
			if (currentScoreValueElement.innerText != score.preTotal) {
				currentScoreValueElement.innerText = score.preTotal
			}
		})

		state.on('change:map', () => {
			let {
				currentTile,
				map,
			} = state

			if (map) {
				tileQueueElement.innerHTML = ''

				skipTimerButton.removeAttribute('hidden')
				skipTimerButton.removeAttribute('disabled')

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

		state.on('change:isVictory', () => {
			if (state.isVictory) {
				updateHighScore()
				mapSelectScreen.show()
			}
		})
	},

	onShow() {
		let currentScoreElement = document.querySelector('#current-score')
		let topScoreElement = document.querySelector('#high-score')

		currentScoreElement.querySelector('.value').innerHTML = 0

		if (state.highScore) {
			topScoreElement.querySelector('.value').innerHTML = state.highScore
			topScoreElement.removeAttribute('hidden')
		} else {
			topScoreElement.setAttribute('hidden', 1)
		}

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

		let createMapButton = mapName => {
			let mapButton = document.createElement('button')
			mapButton.innerHTML = mapName
			mapButton.setAttribute('type', 'button')
			mapButton.setAttribute('value', mapName)
			mapButton.on('click', handleMapButtonClick)

			mapsList.appendChild(mapButton)
		}

		this.node.querySelector('.back').addEventListener('click', () => mainMenuScreen.show())

		Object.keys(maps).forEach(createMapButton)
	},

	selector: '#map-select',
})

let mainMenuScreen = new Screen({
	onInit() {
		let startButtonElement = this.node.querySelector('#start')
		startButtonElement.on('click', () => mapSelectScreen.show())

		let settingsButtonElement = this.node.querySelector('#settings')
		settingsButtonElement.on('click', () => settingsScreen.show(this))
	},

	onShow() {
		music = playAudio('test', 1)
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

	document.querySelectorAll('[data-bind]').forEach(boundElement => {
		function update(targetElement, value) {
			if ([0, 1].includes(value)) {
				targetElement.innerHTML = value ? 'On' : 'Off'
			} else {
				targetElement.innerHTML = value
			}
		}

		let boundSetting = boundElement.getAttribute('data-bind')

		settings.on(`change:${boundSetting}`, ({ detail }) => {
			update(boundElement, detail.value)
		})

		update(boundElement, settings[boundSetting])
	})

	updateGameScale()
	renderStrings()
	mainMenuScreen.show()

	document.querySelectorAll('button').forEach(buttonElement => {
		buttonElement.on('mousedown', () => playAudio('button'))
	})
}

initialize()
