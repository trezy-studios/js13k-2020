// Local imports
import AwkwardImage from '../assets/images/awkward.font.png'





const baseCharacter = {
	h: 5,
	w: 4,
}

const fontImage = new Image
const state = {
	loaded: false,
}

fontImage.src = AwkwardImage
fontImage.on('load', () => state.loaded = true)

const coords = {
	a: {
		...baseCharacter,
		x: 0,
	},

	b: {
		...baseCharacter,
		x: 4,
	},

	c: {
		...baseCharacter,
		x: 8,
	},

	d: {
		...baseCharacter,
		x: 12,
	},

	e: {
		...baseCharacter,
		x: 16,
	},

	f: {
		...baseCharacter,
		x: 20,
	},

	g: {
		...baseCharacter,
		x: 24,
	},

	h: {
		...baseCharacter,
		x: 28,
	},

	i: {
		...baseCharacter,
		x: 32,
		w: 1,
	},

	j: {
		...baseCharacter,
		x: 33,
	},

	k: {
		...baseCharacter,
		x: 37,
	},

	l: {
		...baseCharacter,
		x: 41,
	},

	m: {
		...baseCharacter,
		w: 5,
		x: 45,
	},

	n: {
		...baseCharacter,
		w: 5,
		x: 50,
	},

	o: {
		...baseCharacter,
		x: 55,
	},

	p: {
		...baseCharacter,
		x: 59,
	},

	q: {
		...baseCharacter,
		x: 63,
	},

	r: {
		...baseCharacter,
		x: 67,
	},

	s: {
		...baseCharacter,
		x: 71,
	},

	t: {
		...baseCharacter,
		w: 5,
		x: 75,
	},

	u: {
		...baseCharacter,
		x: 80,
	},

	v: {
		...baseCharacter,
		x: 84,
	},

	w: {
		...baseCharacter,
		w: 5,
		x: 88,
	},

	x: {
	...baseCharacter,
		x: 93,
	},

	y: {
		...baseCharacter,
		x: 97,
	},

	z: {
		...baseCharacter,
		x: 101,
	},

	0: {
		...baseCharacter,
		x: 105,
	},

	1: {
		...baseCharacter,
		x: 109,
		w: 1,
	},

	2: {
		...baseCharacter,
		x: 110,
	},

	3: {
		...baseCharacter,
		x: 114,
	},

	4: {
		...baseCharacter,
		x: 118,
	},

	5: {
		...baseCharacter,
		x: 122,
	},

	6: {
		...baseCharacter,
		x: 126,
	},

	7: {
		...baseCharacter,
		x: 130,
	},

	8: {
		...baseCharacter,
		x: 134,
	},

	9: {
		...baseCharacter,
		x: 138,
	},

	':': {
		...baseCharacter,
		w: 1,
		x: 142,
	},

	'!': {
		...baseCharacter,
		w: 1,
		x: 143,
	},

	'?': {
		...baseCharacter,
		w: 3,
		x: 144,
	},

	',': {
		...baseCharacter,
		h: 6,
		w: 1,
		x: 147,
	},

	' ': {
		...baseCharacter,
		x: 148,
	},
}





export {
	coords,
	fontImage,
	state,
}
