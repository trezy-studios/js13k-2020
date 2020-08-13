export function updateTile (x, y, newState) {
  grid[(x - 1) * y] = newState
}
