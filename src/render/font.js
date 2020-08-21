const baseCharacter = {
	h: 7,
	w: 7,
}

let loaded = false

const fontImage = new Image()
fontImage.src = '/assets/images/font.png'
fontImage.on('load', () => loaded = true)

export const coords = {
	a: {
		...baseCharacter,
		x: 0,
	},

	b: {
		...baseCharacter,
		x: 7,
	},

	c: {
		...baseCharacter,
		x: 14,
	},

	d: {
		...baseCharacter,
		x: 21,
	},

	e: {
		...baseCharacter,
		x: 28,
	},

	f: {
		...baseCharacter,
		x: 35,
	},

	g: {
		...baseCharacter,
		x: 42,
	},

	h: {
		...baseCharacter,
		x: 49,
	},

	i: {
		...baseCharacter,
		x: 56,
		w: 2,
	},

	j: {
		...baseCharacter,
		x: 58,
	},

	k: {
		...baseCharacter,
		x: 65,
	},

	l: {
		...baseCharacter,
		x: 72,
	},

	m: {
		...baseCharacter,
		x: 79,
	},

	n: {
		...baseCharacter,
		x: 86,
	},

	o: {
		...baseCharacter,
		x: 93,
	},

	p: {
		...baseCharacter,
		x: 100,
	},

	q: {
		...baseCharacter,
		x: 107,
	},

	r: {
		...baseCharacter,
		x: 114,
	},

	s: {
		...baseCharacter,
		x: 121,
	},

	t: {
		...baseCharacter,
		x: 128,
		w: 6,
	},

	u: {
		...baseCharacter,
		x: 134,
	},

	v: {
		...baseCharacter,
		x: 141,
	},

	w: {
		...baseCharacter,
		x: 148,
	},

	x: {
	...baseCharacter,
		x: 155,
	},

	y: {
		...baseCharacter,
		x: 162,
		y: 6,
	},

	z: {
		...baseCharacter,
		x: 169,
	},

	0: {
		...baseCharacter,
		x: 176,
	},

	1: {
		...baseCharacter,
		x: 183,
		w: 4,
	},

	2: {
		...baseCharacter,
		x: 187,
	},

	3: {
		...baseCharacter,
		x: 194,
	},

	4: {
		...baseCharacter,
		x: 201,
	},

	5: {
		...baseCharacter,
		x: 208,
	},

	6: {
		...baseCharacter,
		x: 215,
	},

	7: {
		...baseCharacter,
		x: 222,
	},

	8: {
		...baseCharacter,
		x: 229,
	},

	9: {
		...baseCharacter,
		x: 236,
	},

	' ': {
		...baseCharacter,
		x: 243,
	},
}

function drawStringToCanvas (stringCoords, context) {
	let currentX = 0
	stringCoords.forEach(coord => {
		context.drawImage(fontImage, coord.x, 0, coord.w, coord.h, currentX, 0, coord.w, coord.h)
		currentX += coord.w + 1
	})
}

export const createStringCanvas = (string, scale = 1) => {
	const {
		stringCoords,
		stringHeight,
		stringWidth,
	} = string.toLowerCase().split('').reduce((accumulator, character) => {
		const characterCoords = coords[character]

		accumulator.stringCoords.push(coords[character])
		accumulator.stringHeight = Math.max(accumulator.stringHeight, characterCoords.h)
		accumulator.stringWidth += characterCoords.w + 1

		return accumulator
	}, {
		stringCoords: [],
		stringHeight: 0,
		stringWidth: 0,
	})

	const canvas = document.createElement('canvas')
	const context = canvas.getContext('2d')

	canvas.setAttribute('width', stringWidth)
	canvas.setAttribute('height', stringHeight)

	canvas.style.width = stringWidth * scale
	canvas.style.height = stringHeight * scale

	if (!loaded) {
		fontImage.on('load', () => drawStringToCanvas(stringCoords, context))
	} else {
		drawStringToCanvas(stringCoords, context)
	}

	return canvas
}
