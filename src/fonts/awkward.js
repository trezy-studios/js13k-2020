// Local imports
import AwkwardImage from '../assets/images/awkward.font.png'





export let fontImage = new Image
export let state = {
	loaded: 0,
}

fontImage.src = AwkwardImage
fontImage.on('load', () => state.loaded = 1)

export let characterDefaults = {
	h: 5,
	w: 4,
}

export let coords = {
	a: [0],

	b: [4],

	c: [8],

	d: [12],

	e: [16],

	f: [20],

	g: [24],

	h: [28],

	i: [32, 1],

	j: [33],

	k: [37],

	l: [41],

	m: [45, 5],

	n: [50, 5],

	o: [55],

	p: [59],

	q: [63],

	r: [67],

	s: [71],

	t: [75, 5],

	u: [80],

	v: [84],

	w: [88, 5],

	x: [93],

	y: [97],

	z: [101],

	0: [105],

	1: [109, 1],

	2: [110],

	3: [114],

	4: [118],

	5: [122],

	6: [126],

	7: [130],

	8: [134],

	9: [138],

	':': [142, 1],

	'!': [143, 1],

	'?': [144, 3],

	',': [147, 1, 6],

	'+': [148, 3],

	'-': [151, 3],

	' ': [154],
}
