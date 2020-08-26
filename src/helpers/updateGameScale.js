export function updateGameScale () {
	const gameHeight = 119
	const gameWidth = 232
	const windowHeight = window.innerHeight
	const windowWidth = window.innerWidth

	// Get the aspect ratios in case we need to expand or shrink to fit
	const gameAspectRatio = gameWidth / gameHeight;
	const windowAspectRatio = windowWidth / windowHeight;

	let scale = windowHeight / gameHeight

	// Get the larger aspect ratio of the two
	// If aspect ratio is 1 then no adjustment needed
	if (gameAspectRatio > windowAspectRatio) {
		scale = windowWidth / gameWidth
	}

	const gameWrapper = document.querySelector('#game-wrapper')
	gameWrapper.style.transform = `scale(${Math.floor(scale)})`
}
