const screens = []

export class Screen {
	appendChild (child) {
		this.node.appendChild(child)
	}

	constructor (options) {
		const {
			onHide,
			onInit,
			onShow,
			selector,
		} = options

		screens.push(this)

		this.node = document.querySelector(selector)
		this.onHide = onHide
		this.onShow = onShow

		if (onInit) {
			onInit.call(this)
		}
	}

	hide () {
		this.node.setAttribute('hidden', 'true')

		if (this.onHide) {
			this.onHide()
		}
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
