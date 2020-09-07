// Local imports
import {
	GRID_SIZE,
	TILE_SIZE,
} from '../data/grid'
import { settings } from '../data/settings'
import { entities } from '../data/entities'
import { state } from '../data/state'
import { tiles } from '../data/tiles'
import { updateGameScale } from '../helpers/updateGameScale'





// Local constants
let BG = 0
let FG = 1
let SPRITES = 2





function ctx2d(el) {
	return el.getContext("2d")
}

class Canvas {
	constructor(el, offsetX = 0, offsetY = 0) {
		this.target = ctx2d(el)
		this.shadow = ctx2d(el.cloneNode())
		this.queue = [[], [], []]
		this.offsetX = offsetX
		this.offsetY = offsetY
		window.on('resize', updateGameScale)
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
		context.translate(this.offsetX, this.offsetY)

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

	drawEntities(entitiesToDraw) {
		this.layer = SPRITES

		entitiesToDraw.forEach(([x, y, t]) => entities[t](this, x, y))
	}

	drawGrid() {
		this.layer = BG

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

	drawMap(map, x, y, targetMap) {
		this.layer = FG
		map.render(this, x, y, targetMap)
	}

	drawPlacement() {
		let {
			currentTile,
			map,
			placeX,
			placeY,
		} = state

		this.drawMap(map.tiles[currentTile], placeX, placeY, map)
	}
}

export function canvas(el, offsetX, offsetY) {
	return new Canvas(el, offsetX, offsetY)
}
