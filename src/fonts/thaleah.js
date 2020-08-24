// Local imports
import ThaleahImage from '../assets/images/thaleah.font.png'





const baseCharacter = {
	h: 7,
	w: 7,
}

const fontImage = new Image
const state = {
	loaded: false,
}

fontImage.src = ThaleahImage
fontImage.on('load', () => state.loaded = true)

const coords = {
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
		w: 6,
	},

	z: {
		...baseCharacter,
		x: 168,
	},

	0: {
		...baseCharacter,
		x: 175,
	},

	1: {
		...baseCharacter,
		x: 182,
		w: 4,
	},

	2: {
		...baseCharacter,
		x: 186,
	},

	3: {
		...baseCharacter,
		x: 193,
	},

	4: {
		...baseCharacter,
		x: 200,
	},

	5: {
		...baseCharacter,
		x: 207,
	},

	6: {
		...baseCharacter,
		x: 214,
	},

	7: {
		...baseCharacter,
		x: 221,
	},

	8: {
		...baseCharacter,
		x: 228,
	},

	9: {
		...baseCharacter,
		x: 235,
	},

	':': {
		...baseCharacter,
		w: 2,
		x: 242,
	},

	'!': {
		...baseCharacter,
		w: 2,
		x: 244,
	},

	'?': {
		...baseCharacter,
		x: 246,
	},

	' ': {
		...baseCharacter,
		x: 254,
	},
}





export {
	coords,
	fontImage,
	state,
}
