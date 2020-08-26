export const tiles = [
	() => { },//empty
	(ctx, x, y) => {
		ctx.color("red", "red");
		ctx.rect(x, y, 7, 9);
	},
	(ctx, x, y) => {
		ctx.color("green", "green");
		ctx.rect(x, y, 7, 9);
	},
]
