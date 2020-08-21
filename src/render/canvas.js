// Local imports
import { tileColors } from '../helpers/tileColors'
import * as maps from '../maps/index'





// Local constants
const TILE_SIZE = 8





function ctx2d(el) {
	return el.getContext("2d");
}

class Canvas {
	constructor(el) {
		this.map = null
		this.target = ctx2d(el);
		this.shadow = ctx2d(el.cloneNode());
		this.target.canvas.parentNode.appendChild(this.shadow.canvas);
		this.queue = [[], [], []];
		this.layer = canvas.BG;
		// window.on('resize', () => this.fitToScreen());
		// this.fitToScreen()
	}

	//queue an image to be drown to the current layer.
	//image(img:HTMLImageElement|HTMLCanvasElement)
	color(stroke = "black", fill = "black") {
		this.queue[this.layer].push(["col", stroke, fill]);
	}
	image(img, x, y, w, h, opts = []) {
		this.queue[this.layer].push(["drawImage", img, x, y, w, h, ...opts]);
	}
	rect(x, y, w, h, opts = [], mode = "fill") {
		this.queue[this.layer].push([mode + "Rect", x, y, w, h, ...opts]);
	}
	text(x, y, fontSize, text, opts = [], mode = "fill") {
		this.queue[this.layer].push([mode + "Text", x, y, fontSize, text, ...opts]);
	}

	//no params, push all updates to screen.
	update() {
		const {
			columns,
			rows,
		} = maps[this.map]
		const ctx = this.shadow
		const toRender = this.queue.flat()

		this.shadow.canvas.height = rows * TILE_SIZE
		this.shadow.canvas.width = columns * TILE_SIZE
		this.fitToScreen()

		for (const task of toRender) {
			const [call] = task
			switch (call) {
				case "col":
					[, ctx.strokeStyle, ctx.fillStyle] = task
					break
				default:
					const [, ...args] = task
					ctx[call](...args)
					break
			}
		}

		this.refresh()
		this.queue = [[], [], []]
	}

	refresh() {
		this.target.clearRect(0, 0, 0xffff, 0xffff);
		this.target.drawImage(this.shadow.canvas, 0, 0);
	}

	drawEntities() {
		this.layer = canvas.SPRITES
	}

	drawMap() {
		const {
			grid,
			columns,
			rows,
		} = maps[this.map]

		this.layer = canvas.FG

		grid.forEach((type, index) => {
			const x = (index % columns) * TILE_SIZE
			const y = Math.floor(index / columns) * TILE_SIZE
			const tileColor = tileColors[type]
			this.color(tileColor, tileColor)
			this.rect(x, y, TILE_SIZE, TILE_SIZE)
		})
	}

	fitToScreen() {
		// Get the aspect ratios in case we need to expand or shrink to fit
		const canvasAspectRatio = this.target.canvas.width / this.target.canvas.height;
		const windowAspectRatio  = window.innerWidth / window.innerHeight;

		// No need to adjust the size if current size is square
		let adjustedWidth  = window.innerWidth;
		let adjustedHeight = window.innerHeight;

		// Get the larger aspect ratio of the two
		// If aspect ratio is 1 then no adjustment needed
		if (canvasAspectRatio > windowAspectRatio) {
			adjustedHeight = window.innerWidth / canvasAspectRatio;
		} else if (canvasAspectRatio < windowAspectRatio) {
			adjustedWidth = window.innerHeight * canvasAspectRatio;
		}

		this.target.canvas.style.width = `${adjustedWidth}px`
		this.target.canvas.style.height = `${adjustedHeight}px`

		this.refresh()
	}
}

canvas.BG = 0;
canvas.FG = 1;
canvas.SPRITES = 2;

export function canvas(el) {
	return new Canvas(el);
}
