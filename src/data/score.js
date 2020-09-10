// Local imports
import { state } from './state'





export let score = 0

export let addTimeBonus = () => score += state.timeRemaining

export let resetScore = () => score = 0
