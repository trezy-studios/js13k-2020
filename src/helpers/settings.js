const localstoragePrefix = 'Trezy Studios::Not Found::'

function getFromLocalStorage(key, defaultValue) {
	const value = localStorage.getItem(`${localstoragePrefix}${key}`)

	if (value) {
		try {
			return JSON.parse(value)
		} catch (error) {
			return value
		}
	}

	return defaultValue
}

const defaultSettings = {
	autoscale: getFromLocalStorage('autoscale', true),
	enableMusic: getFromLocalStorage('enableMusic', true),
	musicVolume: getFromLocalStorage('musicVolume', 50),
	resolution: getFromLocalStorage('resolution', '3840x2160'),
	soundFXVolume: getFromLocalStorage('soundFXVolume', 50),
}

const settingsStore = { ...defaultSettings }

const eventTarget = new EventTarget

export const settings = new Proxy(settingsStore, {
	get (object, key) {
		if (key === 'on') {
			return eventTarget.on.bind(eventTarget)
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
		localStorage.setItem(`${localstoragePrefix}${key}`, value)

		eventTarget.dispatchEvent(new CustomEvent(`change:${key}`, eventOptions))
		eventTarget.dispatchEvent(new CustomEvent('change', eventOptions))

		return true
	},
})
