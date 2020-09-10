let screens = []

export class Screen {
	appendChild (child) {
		this.node.appendChild(child)
	}

	constructor (options) {
		let {
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
		this.node.setAttribute('hidden', 1)

		if (this.onHide) {
			this.onHide()
		}
	}

	show (options) {
		screens.forEach(screen => {
			screen.hide()
		})

		this.node.removeAttribute('hidden')

		if (this.onShow) {
			this.onShow(options)
		}
	}
}
