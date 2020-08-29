const screens = []

export class Screen {
	appendChild (child) {
		this.node.appendChild(child)
	}

	constructor (options) {
		const {
			onInit,
			onShow,
			selector,
		} = options

		screens.push(this)

		this.node = document.querySelector(selector)
		this.onShow = onShow

		if (onInit) {
			onInit.call(this)
		}
	}

	hide () {
		this.node.setAttribute('hidden', 'true')
	}

	show () {
		screens.forEach(screen => {
			screen.hide()
		})

		this.node.removeAttribute('hidden')

		if (this.onShow) {
			this.onShow()
		}
	}
}
