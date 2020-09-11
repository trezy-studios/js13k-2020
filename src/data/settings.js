// Local imports
import { createObservable } from '../helpers/createObservable'
import { localStoragePrefix } from '../data/prefix'





function getFromLocalStorage(key, defaultValue) {
	let value = localStorage.getItem(`${localStoragePrefix}${key}`)

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
	musicVolume: getFromLocalStorage('musicVolume', 50),
	soundFXVolume: getFromLocalStorage('soundFXVolume', 50),
}

let settingsStore = { ...defaultSettings }

let eventTarget = new EventTarget

export let settings = createObservable(settingsStore)

settings.on('change', ({ detail })=> {
	let {
		key,
		value,
	} = detail

	localStorage.setItem(`${localStoragePrefix}${key}`, value)
})
