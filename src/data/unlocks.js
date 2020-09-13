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
	const newUnlockedLevels = JSON.stringify([...unlockedLevels, levelIndex])
	console.log({unlockedLevels,newUnlockedLevels})
	localStorage.setItem(`${localStoragePrefix}unlockedLevels`, newUnlockedLevels)
}
