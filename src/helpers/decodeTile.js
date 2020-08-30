export function decodeTile(tile) {
	const tileLines = tile.split('\n')

	return {
		grid: tile.replace('\n', '').split('').map(type => parseInt(type)),
		raw: tile,
		h: tileLines.length,
		w: tileLines[0].length,
	}
}
