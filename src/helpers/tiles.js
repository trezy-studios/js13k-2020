export const tiles = [
	() => { },//empty
	(ctx, x, y) => {
		ctx.color("red", "red");
		ctx.rect(x, y, 8, 8);
	},
	(ctx, x, y) => {
		ctx.color("green", "green");
		ctx.rect(x, y, 8, 8);
	},
]
