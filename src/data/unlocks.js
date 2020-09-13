// Local imports
import { localStoragePrefix } from './prefix'





export let getUnlockedLevels = () => {
	let unlockedLevels = localStorage.getItem(`${localStoragePrefix}unlockedLevels`)

	if (unlockedLevels) {
		return JSON.parse(unlockedLevels)
	}

	return [0]
}

export let unlockLevel = levelIndex => {
	const unlockedLevels = getUnlockedLevels()

	if (unlockedLevels.indexOf(levelIndex) == -1) {
		localStorage.setItem(`${localStoragePrefix}unlockedLevels`, JSON.stringify([...unlockedLevels, levelIndex]))
	}
}
