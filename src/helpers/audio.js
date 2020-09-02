// Local imports
import { settings } from '../data/settings'





// Local constants
const audioContext = new AudioContext
const sampleRate = 44100
export const audioBuffers = {}





export const playAudio = (name, isMusic = 0) => {
}

export const setMusicVolume = () => musicGainNode.gain.value = settings.musicVolume * 0.01

export const setSFXVolume = () => sfxGainNode.gain.value = settings.soundFXVolume * 0.01
