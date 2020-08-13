function ctx2d(el) {
    return canvas.getContext("2d");
}

class Canvas {
    constructor(el) {
        this.target = ctx2d(el);
        this.shadow = ctx2d(el.cloneNode());
        this.queue = [[], [], []];
    }
    //queue an image to be drown to the current layer.
    //image(img:HTMLImageElement|HTMLCanvasElement)
    image(img, x, y, w, h, opts) {

    }
    //no params, push all updates to screen.
    update() {
        this.shadow.width = this.shadow.width;


        this.target.drawImage(this.shadow.canvas, 0, 0);
        this.queue = [[], [], []];
    }
    static BG = 0;
    static FG = 1;
    static SPRITES = 2;
}

export function canvas(el) {
    return new Canvas(el);
}