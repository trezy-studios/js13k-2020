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
	a: [0],

	b: [7],

	c: [14],

	d: [21],

	e: [28],

	f: [35],

	g: [42],

	h: [49],

	i: [56, 2],

	j: [58],

	k: [65],

	l: [72],

	m: [79],

	n: [86],

	o: [93],

	p: [100],

	q: [107],

	r: [114],

	s: [121],

	t: [128, 6],

	u: [134],

	v: [141],

	w: [148],

	x: [155],

	y: [162, 6],

	z: [168],

	0: [175],

	1: [182, 4],

	2: [186],

	3: [193],

	4: [200],

	5: [207],

	6: [214],

	7: [221],

	8: [228],

	9: [235],

	':': [242, 2],

	'!': [244, 2],

	'?': [246],

	' ': [254],
}
