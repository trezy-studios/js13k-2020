// Local imports
import AwkwardImage from '../assets/images/awkward.font.png'





export const fontImage = new Image
export const state = {
	loaded: false,
}

fontImage.src = AwkwardImage
fontImage.on('load', () => state.loaded = true)

export const characterDefaults = {
	h: 5,
	w: 4,
}

export const coords = {
	a: {
		x: 0,
	},

	b: {
		x: 4,
	},

	c: {
		x: 8,
	},

	d: {
		x: 12,
	},

	e: {
		x: 16,
	},

	f: {
		x: 20,
	},

	g: {
		x: 24,
	},

	h: {
		x: 28,
	},

	i: {
		x: 32,
		w: 1,
	},

	j: {
		x: 33,
	},

	k: {
		x: 37,
	},

	l: {
		x: 41,
	},

	m: {
		w: 5,
		x: 45,
	},

	n: {
		w: 5,
		x: 50,
	},

	o: {
		x: 55,
	},

	p: {
		x: 59,
	},

	q: {
		x: 63,
	},

	r: {
		x: 67,
	},

	s: {
		x: 71,
	},

	t: {
		w: 5,
		x: 75,
	},

	u: {
		x: 80,
	},

	v: {
		x: 84,
	},

	w: {
		w: 5,
		x: 88,
	},

	x: {
		x: 93,
	},

	y: {
		x: 97,
	},

	z: {
		x: 101,
	},

	0: {
		x: 105,
	},

	1: {
		x: 109,
		w: 1,
	},

	2: {
		x: 110,
	},

	3: {
		x: 114,
	},

	4: {
		x: 118,
	},

	5: {
		x: 122,
	},

	6: {
		x: 126,
	},

	7: {
		x: 130,
	},

	8: {
		x: 134,
	},

	9: {
		x: 138,
	},

	':': {
		w: 1,
		x: 142,
	},

	'!': {
		w: 1,
		x: 143,
	},

	'?': {
		w: 3,
		x: 144,
	},

	',': {
		h: 6,
		w: 1,
		x: 147,
	},

	' ': {
		x: 148,
	},
}
