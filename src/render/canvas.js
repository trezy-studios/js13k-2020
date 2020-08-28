// Local imports
import { settings } from '../helpers/settings'
import { updateGameScale } from '../helpers/updateGameScale'
import * as maps from '../maps/index'





function ctx2d(el) {
	return el.getContext("2d");
}

class Canvas {
	constructor(el) {
		this.map = null
		this.target = ctx2d(el);
		this.shadow = ctx2d(el.cloneNode());
		this.queue = [[], [], []];
		this.layer = canvas.BG;
		window.on('resize', () => {
			if (settings.autoscale) {
				updateGameScale()
			}
		})
	}

	color(stroke = "black", fill = "black") {
		this.queue[this.layer].push(["col", stroke, fill]);
	}

	//queue an image to be drawn to the current layer.
	//image(img:HTMLImageElement|HTMLCanvasElement)
	image(img, sx, sy, sw, sh, dx, dy, dw, dh, opts = []) {
		this.queue[this.layer].push(["drawImage", img, sx, sy, sw, sh, dx, dy, dw, dh, ...opts]);
	}

	line(sx, sy, dx, dy, opts = []) {
		this.queue[this.layer].push(["beginPath"]);
		this.queue[this.layer].push(["moveTo", sx, sy]);
		this.queue[this.layer].push(["lineTo", dx, dy]);
		this.queue[this.layer].push(["stroke"]);
	}

	lineWidth(width) {
		this.queue[this.layer].push(["lineWidth", lineWidth]);
	}

	rect(x, y, w, h, opts = [], mode = "fill") {
		this.queue[this.layer].push([mode + "Rect", x, y, w, h, ...opts]);
	}

	text(x, y, fontSize, text, opts = [], mode = "fill") {
		this.queue[this.layer].push([mode + "Text", x, y, fontSize, text, ...opts]);
	}

	//no params, push all updates to screen.
	update() {
		//clear the canvas
		const ctx = this.shadow;
		ctx.clearRect(0, 0, 0xffff, 0xffff);
		const toRender = this.queue.flat();
		for (const task of toRender) {
			const [call] = task;
			switch (call) {
				case "col":
					[, ctx.strokeStyle, ctx.fillStyle] = task;
					break;
				case "lineWidth":
					[, ctx.lineWidth] = task;
					break;
				default:
					const [, ...args] = task;
					ctx[call](...args);
					break;
			}
		}
		// ctx.setTransform(1, 0, 0, 1, 0, 0);
		this.refresh();
		this.queue = [[], [], []];
	}

	refresh() {
		this.target.canvas.height = this.shadow.canvas.height
		this.target.canvas.width = this.shadow.canvas.width
		this.target.clearRect(0, 0, 0xffff, 0xffff);
		this.target.drawImage(this.shadow.canvas, 0, 0);
	}

	drawGrid() {
		const color = `hsla(278, 19%, 25%, 0.5)`
		let column = 0
		let row = 0

		while (row <= 16) {
			const y = (6 * row) + 0.5
			this.color(color, 'transparent')
			this.line(0, y, 97, y)
			row += 1
		}

		while (column <= 12) {
			const x = (8 * column) + 0.5
			this.color(color, 'transparent')
			this.line(x, 0, x, 97)
			column += 1
		}
	}

	drawMap(map, x, y) {
		map.render(this, x, y);
	}
}

canvas.BG = 0;
canvas.FG = 1;
canvas.SPRITES = 2;

export function canvas(el) {
	return new Canvas(el);
}
