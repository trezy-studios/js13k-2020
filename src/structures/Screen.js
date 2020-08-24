export class Screen {
	appendChild (child) {
		this.node.appendChild(child)
	}

	constructor (options) {
		const {
			onInit,
			onShow,
			selector,
			store = {},
		} = options

		this.node = document.querySelector(selector)
		this.onShow = onShow
		this.store = store

		if (onInit) {
			onInit.call(this)
		}
	}

	show () {
		function hideElement (element) {
			element.setAttribute('hidden', 'true')
		}

		document.querySelectorAll('.screen').forEach(hideElement)

		this.node.removeAttribute('hidden')

		if (this.onShow) {
			this.onShow()
		}
	}
}
