import { grid } from './state.js'
import { updateTile } from './helpers/updateTile.js'
updateTile(3, 4, 2)
console.log(grid);



import "./patches/addEventListener";
import { canvas } from "./render/canvas";



const render = canvas(document.querySelector("canvas"))
let box_x = 100;
let frame = 0;
setInterval(() => {
    box_x += Math.sin(frame / 180 * Math.PI);
    frame++;
    render.rect(box_x - 10, 0, 20, 20);
    render.update();
});
