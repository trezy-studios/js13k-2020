const defaultSettings = {
	autoscale: true,
	pixelScale: 5,
	resolution: '3840x2160',
}

const settingsStore = { ...defaultSettings }

export const settings = new Proxy(new EventTarget, {
	get (object, key) {
		if (key === 'on') {
			return object.on.bind(object)
		}

		return settingsStore[key]
	},

	set (object, key, value) {
		const eventOptions = {
			detail: {
				key,
				value,
			},
		}

		settingsStore[key] = value

		object.dispatchEvent(new CustomEvent('change', eventOptions))

		return true
	},
})
