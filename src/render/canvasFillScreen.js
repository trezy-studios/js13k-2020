export function canvasFillScreen(canvas, render) {
    function update_scale() {
        const size = Math.min(window.innerWidth, window.innerHeight);
        canvas.height = canvas.width = size;
        canvas.setAttribute("style", `width:${size}px;height:${size}px;transform:translate(50vw,50vh) translate(-50%,-50%);`);
        render.refresh();
    };
    window.on("resize", update_scale);
    update_scale();
}