// Local imports
import {
	GRID_SIZE,
	TILE_SIZE,
} from '../data/grid'
import { settings } from '../helpers/settings'
import { state } from '../data/state'
import { tiles } from '../data/tiles'
import { updateGameScale } from '../helpers/updateGameScale'





let canvasOffset = {
	x: 0,
	y: 7,
}





function ctx2d(el) {
	return el.getContext("2d")
}

class Canvas {
	constructor(el) {
		this.target = ctx2d(el)
		this.shadow = ctx2d(el.cloneNode())
		this.queue = [[], [], []]
		this.layer = canvas.BG
		window.on('resize', () => {
			if (settings.autoscale) {
				updateGameScale()
			}
		})
	}

	alpha(alpha) {
		this.queue[this.layer].push(["a", alpha])
	}

	color(stroke = "black", fill = "black") {
		this.queue[this.layer].push(["col", stroke, fill])
	}

	//queue an image to be drawn to the current layer.
	//image(img:HTMLImageElement|HTMLCanvasElement)
	image(img, sx, sy, sw, sh, dx, dy, dw, dh, opts = []) {
		this.queue[this.layer].push(["drawImage", img, sx, sy, sw, sh, dx, dy, dw, dh, ...opts])
	}

	line(sx, sy, dx, dy, opts = []) {
		this.queue[this.layer].push(["beginPath"])
		this.queue[this.layer].push(["moveTo", sx, sy])
		this.queue[this.layer].push(["lineTo", dx, dy])
		this.queue[this.layer].push(["stroke"])
	}

	lineWidth(width) {
		this.queue[this.layer].push(["lineWidth", lineWidth])
	}

	rect(x, y, w, h, opts = [], mode = "fill") {
		this.queue[this.layer].push([mode + "Rect", x, y, w, h, ...opts])
	}

	text(x, y, fontSize, text, opts = [], mode = "fill") {
		this.queue[this.layer].push([mode + "Text", x, y, fontSize, text, ...opts])
	}

	//no params, push all updates to screen.
	update() {
		//clear the canvas
		let toRender = this.queue.flat()
		let context = this.shadow
		context.clearRect(0, 0, 0xffff, 0xffff)
		context.translate(canvasOffset.x, canvasOffset.y)

		for (let task of toRender) {
			let [call] = task
			switch (call) {
				case "a":
					[, context.globalAlpha] = task
					break
				case "col":
					[, context.strokeStyle, context.fillStyle] = task
					break
				case "lineWidth":
					[, context.lineWidth] = task
					break
				default:
					let [, ...args] = task
					context[call](...args)
					break
			}
		}
		context.setTransform(1, 0, 0, 1, 0, 0)
		this.refresh()
		this.queue = [[], [], []]
	}

	refresh() {
		this.target.canvas.height = this.shadow.canvas.height
		this.target.canvas.width = this.shadow.canvas.width
		this.target.clearRect(0, 0, 0xffff, 0xffff)
		this.target.drawImage(this.shadow.canvas, 0, 0)
	}

	drawGrid() {
		let color = `hsla(278, 19%, 25%, 0.5)`
		let column = 0
		let row = 0

		while (row <= GRID_SIZE.h) {
			let y = (6 * row) + 0.5
			this.color(color, 'transparent')
			this.line(0, y, 97, y)
			row += 1
		}

		while (column <= GRID_SIZE.w) {
			let x = (8 * column) + 0.5
			this.color(color, 'transparent')
			this.line(x, 0, x, 97)
			column += 1
		}
	}

	drawMap(map, x, y) {
		map.render(this, x, y)
	}

	drawPlacement() {
		let {
			currentTile,
			map,
			placeX,
			placeY,
		} = state
		let {
			grid,
			h,
			w,
		} = currentTile

		grid.forEach((type, index) => {
			if (type) {
				let x = (index % w) + placeX
				let xPixel = x * TILE_SIZE.w
				let y = Math.floor(index / w) + placeY
				let yPixel = y * TILE_SIZE.h

				let canPlace = map.at(x, y) === 0

				tiles[type](this, xPixel, yPixel, true, canPlace)
			}
		})
	}
}

canvas.BG = 0
canvas.FG = 1
canvas.SPRITES = 2

export function canvas(el) {
	return new Canvas(el)
}
