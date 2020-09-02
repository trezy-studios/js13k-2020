let localstoragePrefix = 'Trezy Studios::Not Found::'

function getFromLocalStorage(key, defaultValue) {
	let value = localStorage.getItem(`${localstoragePrefix}${key}`)

	if (value) {
		try {
			return JSON.parse(value)
		} catch (error) {
			return value
		}
	}

	return defaultValue
}

let defaultSettings = {
	enableMusic: getFromLocalStorage('enableMusic', 1),
	enableSFX: getFromLocalStorage('enableSFX', 1),
	musicVolume: getFromLocalStorage('musicVolume', 50),
	soundFXVolume: getFromLocalStorage('soundFXVolume', 50),
}

let settingsStore = { ...defaultSettings }

let eventTarget = new EventTarget

export let settings = new Proxy(settingsStore, {
	get (object, key) {
		if (key === 'on') {
			return eventTarget.on.bind(eventTarget)
		}

		return settingsStore[key]
	},

	set (object, key, value) {
		let eventOptions = {
			detail: {
				key,
				value,
			},
		}

		settingsStore[key] = value
		localStorage.setItem(`${localstoragePrefix}${key}`, value)

		eventTarget.dispatchEvent(new CustomEvent(`change:${key}`, eventOptions))
		eventTarget.dispatchEvent(new CustomEvent('change', eventOptions))

		return 1
	},
})
