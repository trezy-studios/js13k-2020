// Local imports
import ThaleahImage from '../assets/images/thaleah.font.png'





export let fontImage = new Image
export let state = {
	loaded: 0,
}

fontImage.src = ThaleahImage
fontImage.on('load', () => state.loaded = 1)

export let characterDefaults = {
	h: 7,
	w: 7,
}

export let coords = {
	a: {
		x: 0,
	},

	b: {
		x: 7,
	},

	c: {
		x: 14,
	},

	d: {
		x: 21,
	},

	e: {
		x: 28,
	},

	f: {
		x: 35,
	},

	g: {
		x: 42,
	},

	h: {
		x: 49,
	},

	i: {
		x: 56,
		w: 2,
	},

	j: {
		x: 58,
	},

	k: {
		x: 65,
	},

	l: {
		x: 72,
	},

	m: {
		x: 79,
	},

	n: {
		x: 86,
	},

	o: {
		x: 93,
	},

	p: {
		x: 100,
	},

	q: {
		x: 107,
	},

	r: {
		x: 114,
	},

	s: {
		x: 121,
	},

	t: {
		x: 128,
		w: 6,
	},

	u: {
		x: 134,
	},

	v: {
		x: 141,
	},

	w: {
		x: 148,
	},

	x: {
		x: 155,
	},

	y: {
		x: 162,
		w: 6,
	},

	z: {
		x: 168,
	},

	0: {
		x: 175,
	},

	1: {
		x: 182,
		w: 4,
	},

	2: {
		x: 186,
	},

	3: {
		x: 193,
	},

	4: {
		x: 200,
	},

	5: {
		x: 207,
	},

	6: {
		x: 214,
	},

	7: {
		x: 221,
	},

	8: {
		x: 228,
	},

	9: {
		x: 235,
	},

	':': {
		w: 2,
		x: 242,
	},

	'!': {
		w: 2,
		x: 244,
	},

	'?': {
		x: 246,
	},

	' ': {
		x: 254,
	},
}
