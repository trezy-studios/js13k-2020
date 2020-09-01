// Local imports
import * as awkward from '../fonts/awkward'
import * as thaleah from '../fonts/thaleah'





// Local constants
const fonts = {
	awkward,
	thaleah,
}





function drawStringToCanvas (stringCoords, sourceImage, context) {
	let currentX = 0
	stringCoords.forEach(coord => {
		context.drawImage(sourceImage, coord.x, 0, coord.w, coord.h, currentX, 0, coord.w, coord.h)
		currentX += coord.w + 1
	})
}

export const createStringCanvas = (string, fontFamily = 'awkward') => {
	const {
		characterDefaults,
		coords,
		fontImage,
		state,
	} = fonts[fontFamily]
	const normalizedString = string.toLowerCase().trim()

	const {
		stringCoords,
		stringHeight,
		stringWidth,
	} = normalizedString.split('').reduce((accumulator, character, index) => {
		const characterCoords = {
			...characterDefaults,
			...coords[character],
		}

		accumulator.stringCoords.push(characterCoords)
		accumulator.stringHeight = Math.max(accumulator.stringHeight, characterCoords.h)
		accumulator.stringWidth += characterCoords.w

		if (index !== normalizedString.length - 1) {
			accumulator.stringWidth += 1
		}

		return accumulator
	}, {
		stringCoords: [],
		stringHeight: 0,
		stringWidth: 0,
	})

	const canvas = document.createElement('canvas')
	const context = canvas.getContext('2d')

	canvas.classList.add('text')
	canvas.setAttribute('width', stringWidth)
	canvas.setAttribute('height', stringHeight)

	canvas.style.width = stringWidth
	canvas.style.height = stringHeight

	if (!state.loaded) {
		fontImage.on('load', () => drawStringToCanvas(stringCoords, fontImage, context))
	} else {
		drawStringToCanvas(stringCoords, fontImage, context)
	}

	return canvas
}
