// Local imports
import { spritesheetImage } from '../helpers/spritesheet'
import { state } from '../data/state'
import { TILE_SIZE } from '../data/grid'





export let entities = {
	exit(context, e) {
		let frames = 10
		let x = TILE_SIZE.w * e.x
		let y = TILE_SIZE.h * e.y
		let sourceX = 24 + (Math.floor((state.frame % 60) / (60 / frames)) * 8)
		context.image(spritesheetImage, sourceX, 0, 8, 16, x, y - 13, 8, 16)
	},

	robot(context, e) {
		let frames = 2
		let x = TILE_SIZE.w * e.x
		let y = TILE_SIZE.h * e.y
		let robot_state = e.state;
		if (!robot_state.path || robot_state.path.length === 0) {
			let potential = state.map.path({ x: e.x, y: e.y }, { x: -1, y: -1 });
			let end = state.entities.find(ent => ent.type === "exit");
			let spot = potential.find(({ x, y }) => x == end.x && end.y == y)
			let max = Math.max(...potential.map(spot => spot.x));
			let rightmost = potential.filter(spot => spot.x === max);
			if (!spot) {
				spot = rightmost[Math.floor(Math.random() * rightmost.length)];
			}
			robot_state.path = state.map.path({ x: e.x, y: e.y }, spot);
			// console.log(robot_state);
		} else {
			let next = robot_state.path.shift();
			e.x = next.x;
			e.y = next.y;
		}
		let sourceX = 8 + (Math.floor((state.frame % 60) / (60 / frames)) * 8)
		context.image(spritesheetImage, sourceX, 0, 8, 16, x, y - 13, 8, 16)
	},
}
