// Local imports

import { audioBuffers } from './audio'
import { zzfxG } from '../lib/zzfx'
import { zzfxM } from '../lib/zzfxm'
import * as sounds from '../sounds'
import AwkwardImage from '../assets/images/awkward.font.png'
import BrandImage from '../assets/images/brand.png'
import HeaderBorderImage from '../assets/images/header-border.png'
import SpritesheetImage from '../assets/images/spritesheet.png'
import ThaleahImage from '../assets/images/thaleah.font.png'
import TimerBorderImage from '../assets/images/timer-border.png'
import WallImage from '../assets/images/wall.png'





async function preloadImages (images) {
	return Promise.all(images.map(imageFile => {
		const imageElement = document.createElement('img')
		imageElement.src = imageFile
		return imageElement.decode()
	}))
}

export function preloadAudio () {
	return new Promise(resolve => setTimeout(() => {
		Object.entries(sounds).forEach(([name, data]) => {
			audioBuffers[name] = (data.t === 'm' ? zzfxM : zzfxG)(...data.a)
		})

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
