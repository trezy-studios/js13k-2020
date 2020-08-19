const tileColors = [
	'black', // abyss
	'grey', // floor
	'red', // obstacle
]

const grid = [
  0, 1, 1, 1, 1, 1, 1, 0,
  0, 1, 1, 1, 1, 1, 1, 0,
  0, 1, 1, 1, 1, 1, 1, 0,
  0, 0, 2, 0, 0, 0, 0, 0,
  0, 0, 2, 0, 0, 0, 0, 0,
  0, 1, 1, 1, 1, 1, 1, 0,
  0, 1, 1, 1, 1, 1, 1, 0,
  0, 1, 1, 1, 1, 1, 1, 0,
]

grid.columns = 8

export {
	grid,
	tileColors,
}
