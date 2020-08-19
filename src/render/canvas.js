import { canvasFillScreen } from "./canvasFillScreen";

function ctx2d(el) {
    return el.getContext("2d");
}

class Canvas {
    constructor(el) {
        this.target = ctx2d(el);
        this.shadow = ctx2d(el.cloneNode());
        canvasFillScreen(el, this);
        this.queue = [[], [], []];
        this.layer = canvas.BG;
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
                default:
                    const [, ...args] = task;
                    ctx[call](...args);
                    break;
            }
        }
        this.refresh();
        this.queue = [[], [], []];
    }
    refresh() {
        this.target.clearRect(0, 0, 0xffff, 0xffff);
        this.target.drawImage(this.shadow.canvas, 0, 0, this.target.canvas.width, this.target.canvas.height);
    }
}
canvas.BG = 0;
canvas.FG = 1;
canvas.SPRITES = 2;

export function canvas(el) {
    return new Canvas(el);
}