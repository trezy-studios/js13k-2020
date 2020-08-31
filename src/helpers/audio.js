// Local imports
import {
	zzfxP,
	zzfxX,
} from '../lib/zzfx'
import { settings } from '../helpers/settings'





// Local constants
export const audioBuffers = {}





export const playAudio = name => {
	const sound = audioBuffers[name]

	if (sound.t === 'm') {
		sound.a.forEach(channel => channel[0] = settings.musicVolume * 0.01)
		zzfxP(...sound.a)
	} else {
		sound.a[0] = settings.soundFXVolume * 0.01
		zzfxP(sound.a)
	}
}
