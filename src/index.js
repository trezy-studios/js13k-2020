// Local imports
import './index.scss'
import './patches/addEventListener'
import { canvas } from './render/canvas'
import {
	start as startController,
	stop as stopController,
} from './helpers/controls'
import { createStringCanvas } from './render/font'
import { Screen } from './structures/Screen'
import { settings } from './helpers/settings'
import { state } from './data/state'
import { updateGameScale } from './helpers/updateGameScale'
import * as maps from './maps/index'





let canvasElement = document.querySelector('canvas')
let canvasHeight = canvasElement.height
let canvasWidth = canvasElement.width
let gameElement = document.querySelector('#game')
let gameWrapperElement = document.querySelector('#game-wrapper')
let mainMenuElement = document.querySelector('#main')
let mapSelectMenuElement = document.querySelector('#map-select')
let render = canvas(canvasElement)





// screens
let settingsScreen = new Screen({
	onInit() {
		let resumeButton = this.node.querySelector('[data-action="open:game"]')
		resumeButton.on('click', () => gameScreen.show())

		let handleAutoscaleChange = ({ detail }) => {
			let resolutionInputElement = this.node.querySelector('#resolution')
			// let resolutionValueElement = this.node.querySelector('[for="resolution"].value')
			let resolutionOptionElements = this.node.querySelectorAll('[name="resolution"]')

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

		let options = this.node.querySelectorAll('.option')
		options.forEach(option => {
			let [, target] = option.getAttribute('data-action').split(':')
			let targetElement = this.node.querySelector(`#${target}`)
			let menuElements = [...targetElement.parentNode.children]

			option.on('click', () => {
				options.forEach(otherOption => otherOption.classList.remove('active'))
				option.classList.add('active')

				menuElements.forEach(menuElement => menuElement.setAttribute('hidden', true))
				targetElement.removeAttribute('hidden')
			})
		})

		let resolutionsDropdownElement = this.node.querySelector('details')
		let resolutionOptionsElement = this.node.querySelector('#resolution-options')
		let resolutions = [
			'640x480',
			'1280x720',
			'1920x1080',
			'3840x2160',
		]
		let closeResolutionsDropdown = (refocus = false) => {
			resolutionsDropdownElement.removeAttribute('open')

			if (refocus) {
				resolutionsDropdownElement.querySelector('summary').focus()
			}
		}
		resolutions.forEach(resolution => {
			let listItemElement = document.createElement('li')
			let inputElement = document.createElement('input')
			let labelElement = document.createElement('label')

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
						settings[name] = checked
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
				targetElement.checked = true
			} else {
				inputElement.value = settingsValue
			}
		})
	},

	selector: '#settings-menu',
})

let gameScreen = new Screen({
	onHide() {
		stopController()
	},

	onInit() {
		let menuButton = this.node.querySelector('[data-action="open:menu"]')
		menuButton.on('click', () => settingsScreen.show())
	},

	onShow() {
		let frame = 0

		startController()

		let gameLoop = () => {
			frame++

			render.drawGrid()
			render.drawMap(state.map, 0, 0)
			render.drawPlacement()
			render.update()

			let timerElement = this.node.querySelector('#play-info time')
			let now = new Date
			let timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`

			if (timerElement.innerText.trim() !== timestamp) {
				timerElement.innerHTML = timestamp
			}
			requestAnimationFrame(gameLoop)
		}

		gameLoop()
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
			mapButton.setAttribute('type', 'button')
			mapButton.setAttribute('value', mapName)
			mapButton.on('click', handleMapButtonClick)

			let mapNameCanvas = createStringCanvas(mapName)

			mapButton.appendChild(mapNameCanvas)
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
			false
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

			let textCanvas = createStringCanvas(container.innerText, fontFamily)

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

		let boundSetting = boundElement.getAttribute('data-bind')

		settings.on(`change:${boundSetting}`, ({ detail }) => {
			update(boundElement, detail.value)
		})

		update(boundElement, settings[boundSetting])
	})

	settings.on('change:autoscale', updateGameScale)

	updateGameScale()
	renderStrings()
	mainMenuScreen.show()
}

initialize()
