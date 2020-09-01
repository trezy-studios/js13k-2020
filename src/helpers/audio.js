// Local imports
import {
	zzfxR,
	zzfxX,
} from '../lib/zzfx'
import { settings } from '../helpers/settings'





// Local constants
export const audioBuffers = {}





// Local variables
const musicGainNode = zzfxX.createGain()
const sfxGainNode = zzfxX.createGain()





// Setup the audio gain nodes
musicGainNode.connect(zzfxX.destination)
musicGainNode.gain.value = settings.musicVolume
sfxGainNode.connect(zzfxX.destination)
sfxGainNode.gain.value = settings.soundFXVolume





export const playAudio = (name, isMusic = 0) => {
	const originalSamplesArray = audioBuffers[name]
	const samplesArray = isMusic ? originalSamplesArray : [originalSamplesArray]

	// create buffer and source
	const buffer = zzfxX.createBuffer(samplesArray.length, samplesArray[0].length, zzfxR)
	const source = zzfxX.createBufferSource()

	// copy samples to buffer
	samplesArray.map((sample, index) => buffer.getChannelData(index).set(sample))
	source.buffer = buffer

	// connect to the gain node and start the track
	source.connect(isMusic ? musicGainNode : sfxGainNode)
	source.loop = isMusic

	isMusic ? setMusicVolume() : setSFXVolume()

	if ((isMusic && settings.enableMusic) || (!isMusic && settings.enableSFX)) {
		source.start()
	}

	return source
}

export const setMusicVolume = () => musicGainNode.gain.value = settings.musicVolume * 0.01

export const setSFXVolume = () => sfxGainNode.gain.value = settings.soundFXVolume * 0.01
