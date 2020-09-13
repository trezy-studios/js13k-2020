// Local imports
import { state } from '../data/state'





let getTimer = () => document.querySelector('#play-info time')
let getSkipButton = () => document.querySelector('#skip-timer')

export function resetTimer() {
	let timerElement = getTimer()
	let skipTimerButton = getSkipButton()

	timerElement.classList.remove('danger')

	skipTimerButton.removeAttribute('hidden')
	skipTimerButton.removeAttribute('disabled')
}

export function updateTimer(now) {
	let {
		isVictory,
		lastTimerUpdate,
		mapIndex,
		timeRemaining,
		tutorial,
	} = state

	let skipTimerButton = getSkipButton()
	let timerElement = getTimer()
	if (tutorial && (mapIndex < 2)) {
		timerElement.innerHTML = '0:00'
	} else if (!isVictory && ((now - lastTimerUpdate) >= 1000)) {
		let totalSecondsRemaining = Math.abs(Math.floor(timeRemaining / 1000))
		let secondsRemaining = (totalSecondsRemaining % 60).toString().padStart(2, '0')
		let minutesRemaining = Math.floor(totalSecondsRemaining / 60)
		let timerPrefix = '-'

		if (timeRemaining <= 0) {
			// timerElement.classList.add('danger')
			timerPrefix = ''
			skipTimerButton.setAttribute('hidden', 1)
		}

		timerElement.innerHTML = `${timerPrefix}${minutesRemaining}:${secondsRemaining}`

		state.timeRemaining -= 1000
		state.lastTimerUpdate = now
	}
}
