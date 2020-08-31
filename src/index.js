// Local imports
import './index.scss'
import './patches/addEventListener'
import LoadingImage from './assets/images/loading.png'
import {
	preloadAudio,
	preloadFonts,
	preloadSprites,
} from './helpers/preloaders'
import { canvas } from './render/canvas'
import { Controller } from './structures/Controller'
import { createStringCanvas } from './render/font'
import { playAudio } from './helpers/audio'
import { Screen } from './structures/Screen'
import { settings } from './helpers/settings'
import { state } from './data/state'
import { updateGameScale } from './helpers/updateGameScale'
import * as maps from './maps/index'





// Local constants
const canvasElement = document.querySelector('canvas')
const canvasHeight = canvasElement.height
const canvasWidth = canvasElement.width
const controller = new Controller
const gameElement = document.querySelector('#game')
const gameWrapperElement = document.querySelector('#game-wrapper')
const mainMenuElement = document.querySelector('#main')
const mapSelectMenuElement = document.querySelector('#map-select')
const render = canvas(canvasElement)





// screens
const loadingScreen = new Screen({
	async onInit() {
		console.log('loading')

		// Load the "LOADING" image so it displays before we start loading anything
		// else.
		const loadingElement = document.querySelector('#loading')
		const loadingImageElement = document.createElement('img')
		const loadingMessageElement = document.querySelector('#loading-message')

		function setMessage (text) {
			loadingMessageElement.innerHTML = text
		}

		loadingElement.appendChild(loadingImageElement)
		loadingImageElement.src = LoadingImage
		await new Promise(resolve => loadingImageElement.on('load', resolve))

		setMessage('Loading fonts')
		await preloadFonts()

		setMessage('Loading sprites')
		await preloadSprites()

		setMessage('Loading audio')
		await preloadAudio()

		setMessage('Done')
		setTimeout(() => mainMenuScreen.show(), 1000)
	},

	selector: '#loading-screen',
})

const settingsScreen = new Screen({
	onInit() {
		const resumeButton = this.node.querySelector('[data-action="open:game"]')
		resumeButton.on('click', () => gameScreen.show())

		const handleAutoscaleChange = ({ detail }) => {
			const resolutionInputElement = this.node.querySelector('#resolution')
			// const resolutionValueElement = this.node.querySelector('[for="resolution"].value')
			const resolutionOptionElements = this.node.querySelectorAll('[name="resolution"]')

			if (settings.autoscale) {
				resolutionOptionElements.forEach(resolutionOptionElement => {
					resolutionOptionElement.setAttribute('disabled', true)
				})
				// resolutionInputElement.parentNode.classList.add('disabled')
				// resolutionInputElement.setAttribute('disabled', true)
				// resolutionValueElement.innerHTML = 'Autoscale'
				// settings.resolution = 'Autoscale'
			} else {
				resolutionOptionElements.forEach(resolutionOptionElement => {
					resolutionOptionElement.removeAttribute('disabled')
				})
				// resolutionInputElement.parentNode.classList.remove('disabled')
				// resolutionInputElement.removeAttribute('disabled')
				// resolutionValueElement.innerHTML = settings.resolution
				// settings.resolution = 'Autoscale'
			}
		}

		settings.on('change:autoscale', handleAutoscaleChange)

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

		const resolutionsDropdownElement = this.node.querySelector('details')
		const resolutionOptionsElement = this.node.querySelector('#resolution-options')
		const resolutions = [
			'640x480',
			'1280x720',
			'1920x1080',
			'3840x2160',
		]
		const closeResolutionsDropdown = (refocus = false) => {
			resolutionsDropdownElement.removeAttribute('open')

			if (refocus) {
				resolutionsDropdownElement.querySelector('summary').focus()
			}
		}
		resolutions.forEach(resolution => {
			const listItemElement = document.createElement('li')
			const inputElement = document.createElement('input')
			const labelElement = document.createElement('label')

			inputElement.setAttribute('id', `r${resolution}`)
			inputElement.setAttribute('name', 'resolution')
			inputElement.setAttribute('type', 'radio')
			inputElement.setAttribute('value', resolution)

			// Managing focus is weird. When tabbing from one radio button to the
			// next, there's a moment where there nothing is in focus. Also, clicking
			// on a form element element causes the element to be unfocused for a
			// second. Hence the tiny delay before closing the dropdown.
			inputElement.on('blur', () => setTimeout(() => {
				if (!resolutionsDropdownElement.contains(document.activeElement)) {
					closeResolutionsDropdown()
				}
			}, 100))

			inputElement.on('keydown', ({ code, target }) => {
				if (code ==='Escape') {
					closeResolutionsDropdown(true)
				}
			})

			inputElement.on('keypress', ({ code, target }) => {
				if (code === 'Enter') {
					closeResolutionsDropdown(true)
				}
			})

			if (settings.resolution === resolution) {
				inputElement.setAttribute('checked', true)
			}

			labelElement.setAttribute('for', `r${resolution}`)
			labelElement.innerHTML = resolution

			listItemElement.appendChild(inputElement)
			listItemElement.appendChild(labelElement)
			resolutionOptionsElement.appendChild(listItemElement)
		})

		resolutionsDropdownElement.on('toggle', ({ target }) => {
			if (target.open) {
				resolutionOptionsElement.querySelector(':checked').focus()
			}
		})

		const inputs = this.node.querySelectorAll('input')
		inputs.forEach(inputElement => {
			const {
				name,
				type,
			} = inputElement

			inputElement.on('change', ({ target }) => {
				const {
					checked,
				} = target

				switch (type) {
					case 'checkbox':
						settings[name] = checked
						break

					case 'number':
						settings[name] = target.value.replace(/[^/d]/gu, '')
						break

					default:
						settings[name] = target.value
				}
			})

			const settingsValue = settings[name]

			if (typeof settingsValue === 'boolean') {
				inputElement.checked = settingsValue
			} else if (inputElement.type === 'radio') {
				const targetElement = this.node.querySelector(`[name="${inputElement.name}"][value="${settingsValue}"]`)
				targetElement.checked = true
			} else {
				inputElement.value = settingsValue
			}
		})
	},

	selector: '#settings-menu',
})

const gameScreen = new Screen({
	onHide() {
		controller.stop()
	},

	onInit() {
		const menuButton = this.node.querySelector('[data-action="open:menu"]')
		menuButton.on('click', () => settingsScreen.show())
	},

	onShow() {
		let frame = 0

		controller.start()

		const gameLoop = () => {
			frame++

			render.drawGrid()
			render.drawMap(state.map, 0, 0)
			render.drawPlacement()
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
	onInit() {
		const mapsList = this.node.querySelector('#maps')

		const handleMapButtonClick = event => {
			const { target: { value } } = event
			state.map = value
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
	onInit() {
		const startButtonElement = this.node.querySelector('#start')
		startButtonElement.on('click', () => mapSelectScreen.show())
	},

	onShow() {
		playAudio('depp')
	},

	selector: '#main-menu',
})





const initialize = () => {
	function renderStrings(root = document.documentElement) {
		if (root.nodeType === 3) {
			root = root.parentNode
		}

		const treewalker = document.createTreeWalker(
			root,
			NodeFilter.SHOW_TEXT,
			{
				acceptNode({ data }) {
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

			if (['SCRIPT', 'STYLE'].includes(container.tagName)) {
				continue
			}

			let fontFamily = (container.getAttribute('data-font') || 'awkward').toLowerCase()

			if (/^h\d$/iu.test(container.nodeName)) {
				fontFamily = 'thaleah'
			}

			const oldCanvas = container.querySelector('canvas')

			if (oldCanvas) {
				container.removeChild(oldCanvas)
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

	document.querySelectorAll('[data-bind]').forEach(boundElement => {
		function update(targetElement, value) {
			if (typeof value === 'boolean') {
				targetElement.innerHTML = value ? 'On' : 'Off'
			} else {
				targetElement.innerHTML = value
			}
		}

		const boundSetting = boundElement.getAttribute('data-bind')

		settings.on(`change:${boundSetting}`, ({ detail }) => {
			update(boundElement, detail.value)
		})

		update(boundElement, settings[boundSetting])
	})

	settings.on('change:autoscale', updateGameScale)

	updateGameScale()
	renderStrings()
	loadingScreen.show()

	document.querySelectorAll('button').forEach(buttonElement => {
		buttonElement.on('mousedown', () => playAudio('button'))
	})
}

initialize()
