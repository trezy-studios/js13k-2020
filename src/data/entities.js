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
		let robot_state = e.state

		if (state.timeRemaining < 0) {
			if (!robot_state.path || robot_state.path.length === 0 && e.x === robot_state.next.x && robot_state.next.y === e.y) {
				let potential = state.map.path({ x: e.x, y: e.y }, { x: -1, y: -1 });
				let end = state.entities.find(ent => ent.type === "exit");
				let spot = potential.find(({ x, y }) => x == end.x && end.y == y)
				let max = Math.max(...potential.map(spot => spot.x));
				let rightmost = potential.filter(spot => spot.x === max);
				if (!spot) {
					spot = rightmost[Math.floor(Math.random() * rightmost.length)];
				}
				robot_state.path = state.map.path({ x: e.x, y: e.y }, spot);
				robot_state.next = robot_state.path.shift() || e;
			}

			if (state.frame % 5 == 0) {
				if (
					e.x + robot_state.ox / TILE_SIZE.w == robot_state.next.x &&
					e.y + robot_state.oy / TILE_SIZE.h == robot_state.next.y
				) {
					state.totalMoves += 1
					e.x = robot_state.next.x;
					e.y = robot_state.next.y;
					robot_state.next = robot_state.path.shift() || e;
					robot_state.ox = 0;
					robot_state.oy = 0;
				}
				if (robot_state.next.x > e.x) {
					robot_state.ox++;
				}
				if (robot_state.next.x < e.x) {
					robot_state.ox--;
				}
				if (robot_state.next.y > e.y) {
					robot_state.oy++;
				}
				if (robot_state.next.y < e.y) {
					robot_state.oy--;
				}
			}
		}

		let x = TILE_SIZE.w * e.x
		let y = TILE_SIZE.h * e.y
		let sourceX = 8 + (Math.floor((state.frame % 60) / (60 / frames)) * 8)
		context.image(spritesheetImage, sourceX, 0, 8, 16, robot_state.ox + x, robot_state.oy + y - 13, 8, 16)
	},
}
