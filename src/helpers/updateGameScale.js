export function updateGameScale () {
	let gameHeight = 127
	let gameWidth = 240
	let windowHeight = window.innerHeight
	let windowWidth = window.innerWidth

	// Get the aspect ratios in case we need to expand or shrink to fit
	let gameAspectRatio = gameWidth / gameHeight;
	let windowAspectRatio = windowWidth / windowHeight;

	let scale = windowHeight / gameHeight

	// Get the larger aspect ratio of the two
	// If aspect ratio is 1 then no adjustment needed
	if (gameAspectRatio > windowAspectRatio) {
		scale = Math.floor(windowWidth / gameWidth)
	}

	let gameWrapper = document.querySelector('#game-wrapper')
	gameWrapper.style.transform = `scale(${scale})`
}
