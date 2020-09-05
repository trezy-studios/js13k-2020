// Local imports

import { audioBuffers } from './audio'
import { zzfxG } from '../lib/zzfx'
import { zzfxM } from '../lib/zzfxm'

// images
import AwkwardImage from '../assets/images/awkward.font.png'
import BrandImage from '../assets/images/brand.png'
import HeaderBorderImage from '../assets/images/header-border.png'
import SpritesheetImage from '../assets/images/spritesheet.png'
import ThaleahImage from '../assets/images/thaleah.font.png'
import TimerBorderImage from '../assets/images/timer-border.png'
import WallImage from '../assets/images/wall.png'

// audio
import button from '../sounds/button'
import placeTile from '../sounds/placeTile'
import TestMusic from '../sounds/test.zzfx'





async function preloadImages (images) {
	return Promise.all(images.map(imageFile => {
		const imageElement = document.createElement('img')
		imageElement.src = imageFile
		return imageElement.decode()
	}))
}

export function preloadAudio () {
	let generateAudioSamples = (name, data) => audioBuffers[name] = (data.t === 'm' ? zzfxM : zzfxG)(...data.a)

	return new Promise(resolve => setTimeout(() => {
		generateAudioSamples('button', button)
		generateAudioSamples('placeTile', placeTile)
		generateAudioSamples('test', TestMusic)

		resolve()
	}, 10))
}

export function preloadFonts () {
	return preloadImages([
		AwkwardImage,
		BrandImage,
		HeaderBorderImage,
		ThaleahImage,
		TimerBorderImage,
		WallImage,
	])
}

export function preloadSprites () {
	return preloadImages([SpritesheetImage])
}