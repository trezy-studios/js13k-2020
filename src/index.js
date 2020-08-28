// Local imports
import './index.scss'
import './patches/addEventListener'
import { canvas } from './render/canvas'
import { createStringCanvas } from './render/font'
import { Screen } from './structures/Screen'
import { settings } from './helpers/settings'
import { updateGameScale } from './helpers/updateGameScale'
import * as maps from './maps/index'





// Local constants
const canvasElement = document.querySelector('canvas')
const canvasHeight = canvasElement.height
const canvasWidth = canvasElement.width
const gameElement = document.querySelector('#game')
const gameWrapperElement = document.querySelector('#game-wrapper')
const mainMenuElement = document.querySelector('#main')
const mapSelectMenuElement = document.querySelector('#map-select')
const render = canvas(canvasElement)





// screens
const settingsScreen = new Screen({
	onInit () {
		const resumeButton = this.node.querySelector('[data-action="open:game"]')
		resumeButton.on('click', () => gameScreen.show())

		const handleSettingsChange = ({ detail }) => {
			const {
				key,
				value,
			} = detail

			const inputElement = this.node.querySelector(`#${key}`)
			const valueElement = this.node.querySelector(`[for="${key}"].value`)

			switch (inputElement.type) {
				case 'checkbox':
					valueElement.innerHTML = value ? 'on' : 'off'
					break

				case 'number':
				case 'text':
					inputElement.innerHTML = value
			}
		}

		const handleAutoscaleChange = () => {
			const resolutionInputElement = this.node.querySelector('#resolution')
			const resolutionValueElement = this.node.querySelector('[for="resolution"].value')

			if (settings.autoscale) {
				resolutionInputElement.parentNode.classList.add('disabled')
				resolutionInputElement.setAttribute('disabled', true)
				resolutionValueElement.innerHTML = 'Autoscale'
			} else {
				resolutionInputElement.parentNode.classList.remove('disabled')
				resolutionInputElement.removeAttribute('disabled')
				resolutionValueElement.innerHTML = settings.resolution
			}
		}

		settings.on('change:autoscale', handleAutoscaleChange)
		settings.on('change', handleSettingsChange)

		const options = this.node.querySelectorAll('.option')
		options.forEach(option => {
			const [, target] = option.getAttribute('data-action').split(':')
			const targetElement = this.node.querySelector(`#${target}`)
			const menuElements = [...targetElement.parentNode.children]

			option.on('click', () => {
				options.forEach(otherOption => otherOption.classList.remove('active'))
				option.classList.add('active')

				menuElements.forEach(menuElement => menuElement.setAttribute('hidden', true))
				targetElement.removeAttribute('hidden')
			})
		})

		const inputs = this.node.querySelectorAll('input')
		inputs.forEach(inputElement => {
			const value = settings[inputElement.id]

			inputElement.on('change', ({ target }) => {
				const {
					checked,
					type,
					value,
				} = target

				switch (type) {
					case 'checkbox':
						settings[target.id] = checked
						break

					case 'number':
						settings[target.id] = value.replace(/[^/d]/gu, '')
						break

					default:
						settings[target.id] = value
				}
			})

			if (typeof value === 'boolean') {
				inputElement.checked = value
			} else {
				inputElement.value = value
			}

			handleSettingsChange({
				detail: {
					key: inputElement.id,
					value,
				},
			})
		})

		const resolutionSetting = this.node.querySelector('#resolution')
		const resolutions = [
			'640x480',
			'1280x720',
			'1920x1080',
			'3840x2160',
		]
		const resolutionOptionsElement = resolutionSetting.querySelector('.value ol')
		resolutions.forEach(resolution => {
			const listItemElement = document.createElement('li')
			const inputElement = document.createElement('input')
			const labelElement = document.createElement('label')

			inputElement.setAttribute('id', `r${resolution}`)
			inputElement.setAttribute('name', 'resolution')
			inputElement.setAttribute('type', 'radio')

			labelElement.setAttribute('for', `r${resolution}`)
			labelElement.innerHTML = resolution

			listItemElement.appendChild(inputElement)
			listItemElement.appendChild(labelElement)
			resolutionOptionsElement.appendChild(listItemElement)
		})
	},

	selector: '#settings-menu',
})

const gameScreen = new Screen({
	onInit () {
		const menuButton = this.node.querySelector('[data-action="open:menu"]')
		menuButton.on('click', () => settingsScreen.show())
	},

	onShow () {
		let frame = 0

		const gameLoop = () => {
			frame++

			render.drawGrid()
			render.drawMap()
			render.update()

			const timerElement = this.node.querySelector('#play-info time')
			const now = new Date
			const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`

			if (timerElement.innerText.trim() !== timestamp) {
				timerElement.innerHTML = timestamp
			}

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
		const startButtonElement = this.node.querySelector('#start')
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

	settings.on('change:autoscale', () => updateGameScale())

	updateGameScale()
	renderStrings()
	mainMenuScreen.show()
}

initialize()
