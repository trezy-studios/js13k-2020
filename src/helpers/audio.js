// Local imports
import * as sounds from '../sounds'
import {
	zzfxG,
	zzfxP,
} from '../lib/zzfx'
import { settings } from '../helpers/settings'
import { zzfxM } from '../lib/zzfxm'





// Local constants
const audioBuffers = Object.entries(sounds).reduce((accumulator, [name, data]) => ({
	...accumulator,
	[name]: {
		a: (data.t === 'm' ? zzfxM : zzfxG)(...data.a),
		t: data.t,
	},
}), {})





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
