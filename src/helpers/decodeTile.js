export function decodeTile(tile) {
	const tileLines = tile.split('\n')

	return {
		grid: tileLines.map(line => line.split('').map(type => parseInt(type))),
		raw: tile,
		h: tileLines.length,
		w: tileLines[0].length,
	}
}
