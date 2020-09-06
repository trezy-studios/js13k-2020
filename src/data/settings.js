// Local imports
import { createObservable } from '../helpers/createObservable'





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

export let settings = createObservable(settingsStore)

settings.on('change', ({ detail })=> {
	const {
		key,
		value,
	} = detail

	localStorage.setItem(`${localstoragePrefix}${key}`, value)
})
