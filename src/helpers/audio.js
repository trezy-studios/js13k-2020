// Local imports
import { settings } from '../data/settings'





// Local constants
let audioContext = new AudioContext
let noteDuration = 2
let sampleRate = 44100
export let audioBuffers = {}





// Local variables
let musicGainNode = audioContext.createGain()
let sfxGainNode = audioContext.createGain()





// Setup the audio gain nodes
musicGainNode.connect(audioContext.destination)
musicGainNode.gain.value = settings.musicVolume
sfxGainNode.connect(audioContext.destination)
sfxGainNode.gain.value = settings.soundFXVolume





function getFrequency (noteString) {
	let semitoneFrequencyRatio = 2 ** (1 / 12)
	let semitonesPerOctave = 12
	let frequencyAtA4 = 440

	let [, note, accidental, octave] = /([A-G])(#|b)?([0-8]*)/i.exec(noteString)
	let noteIndex = 'A|A#|B|C|C#|D|D#|E|F|F#|G|G#'.split`|`.indexOf(note)

	let baseOctave = 4 - (noteIndex > 2)
	let semitones = noteIndex + (semitonesPerOctave * (octave - baseOctave))

	return frequencyAtA4 * (semitoneFrequencyRatio ** semitones)
}

export let playAudio = (name, isMusic = 0) => {
	let index = 0
	let bpm = 100
	let song = [
		['G3', 'E3', 'C2', 'C1'],
		['G4', 'E4', 'C2', 'C1'],
		['F4', 'C#4', 'A3', 'A1'],
		['E4', 'C4', 'G3', 'A1'],
		['C#4', 'A3', 'F3', 'D3'],
		['C4', 'G3', 'D4', 'D3'],
		['A4', 'F4', 'C4', 'D1', 'D2'],
		[],
	]

	if (false) {
		setInterval(() => {
			let notes = song[index]

			notes.forEach(note => {
				let gain = audioContext.createGain()
				gain.connect(musicGainNode)
				gain.gain.value = 0.001
				gain.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + noteDuration)

				let oscillator = audioContext.createOscillator()
				oscillator.frequency.value = getFrequency(note)
				oscillator.connect(gain)
				oscillator.start(audioContext.currentTime)

				setTimeout(() => {
					oscillator.stop()
					gain.disconnect()
					oscillator.disconnect()
				}, noteDuration * 1000)
			})

			index++

			if (index > song.length - 1) {
				index = 0
			}
		}, 1000 / (bpm / 60))
	}
}

export let setMusicVolume = () => musicGainNode.gain.value = settings.musicVolume * 0.01

export let setSFXVolume = () => sfxGainNode.gain.value = settings.soundFXVolume * 0.01
