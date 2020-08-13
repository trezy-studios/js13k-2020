// Memoize element selectors
const playerHealthEl = document.querySelector('.health')
const playerHealthMeterEl = playerHealthEl.querySelector('meter')
const playerHealthCurrentEl = playerHealthEl.querySelector('.current')
const playerHealthMaxEl = playerHealthEl.querySelector('.max')

const hotbarEl = document.querySelector('menu')

// Game state
const effects = []
const enemies = []
const playerState = {
  hotbar: {
    0: {
      id: 'fireball',
      type: 'spell',
    },
    1: {
      id: 'heal',
      type: 'spell',
    },
    2: {
      id: 'black-hole',
      type: 'spell',
    },
    3: {
      id: 'healing-potion',
      type: 'item',
    },
  },
  item: {
    'healing-potion': {},
  },
  spell: {
    fireball: {
      damage: 10,
      name: 'Fireball',
      targetType: 'bullet',
    },
    heal: {
      damage: -10,
      name: 'Heal Self',
      targetType: 'self',
    },
    'black-hole': {
      damage: 5,
      duration: 5000,
      name: 'Black Hole',
      targetType: 'point',
    },
  },
}
let currentAction = null
let exit = null
let gameOverScene = null
let gameScene = null
let message = null
let player = null
let treasure = null

const damageTarget = (damage, target = player) => {
  target.health -= damage

  if (target.health > target.maxHealth) {
    target.health = target.maxHealth
  }

  updatePlayerCurrentHealth()
}

const updatePlayerCurrentHealth = () => {
  playerHealthMeterEl.setAttribute('value', player.health)
  playerHealthCurrentEl.innerText = player.health
}

const updatePlayerMaxHealth = () => {
  playerHealthMeterEl.setAttribute('max', player.maxHealth)
  playerHealthMaxEl.innerText = player.maxHealth
}

const useAction = (action, target) => {
  const {
    damage,
    duration,
    targetType,
  } = action

  switch (targetType) {
    case 'self':
      break

    case 'point':
      let effect = g.circle(32, 32, 'purple')

      effect.x = event.clientX - effect.halfWidth
      effect.y = event.clientY - effect.halfHeight

      effects.push(effect)
      gameScene.add(effect)
      break
  }

  if (targetType === 'self') {
    target = player
  }

  if (damage) {
    damageTarget(damage, target)
  }

  // if (duration) {
  //   let intervalID = null
  //   intervalID = setInterval(() => {}, duration)
  // }
}

const end = () => {
  //Hide the `gameScene` and display the `gameOverScene`
  gameScene.visible = false
  gameOverScene.visible = true
}

const play = () => {
  g.move(player)
  g.contain(player, g.stage.localBounds)

  let playerHit = false

  enemies.forEach(enemy => {
    //Move the enemy
    g.move(enemy)

    //Check the enemy's screen boundaries
    var enemyHitsEdges = g.contain(enemy, g.stage.localBounds)

    //If the enemy hits the top or bottom of the stage, reverse
    //its direction
    if (['bottom', 'top'].includes(enemyHitsEdges)) {
      enemy.vy *= -1
    }

    //Test for a collision. If any of the enemies are touching
    //the player, set `playerHit` to `true`
    if (g.hitTestRectangle(player, enemy)) {
      playerHit = true
    }

    if (playerHit) {
      //Make the player semi-transparent
      player.alpha = 0.5
      player.health -= 1
      updatePlayerCurrentHealth()
    } else {
      //Make the player fully opaque (non-transparent) if it hasn't been hit
      player.alpha = 1
    }

    if (g.hitTestRectangle(player, treasure)) {
      //If the treasure is touching the player, center it over the player
      treasure.x = player.x + 8
      treasure.y = player.y + 8

      if (!treasure.pickedUp) {
        //If the treasure hasn't already been picked up,
        //play the `chimes` sound
        // chimes.play()
        treasure.pickedUp = true
      }

      //If the player has brought the treasure to the exit,
      //end the game and display 'You won!'
      if (g.hitTestRectangle(treasure, exit)) {
        g.state = end
        message.content = 'You won!'
      }
    }

    //Does the player have enough health? If the width of the `innerBar`
    //is less than zero, end the game and display 'You lost!'
    if (player.health <= 0) {
      g.state = end
      message.content = 'You lost!'
    }
  })
}

const setup = () => {
  // Resize the canvas with the window
  window.addEventListener('resize', () => {
    g.stage.height = window.innerHeight
    g.canvas.height = window.innerHeight
    g.stage.width = window.innerWidth
    g.canvas.width = window.innerWidth
  })

  g.canvas.addEventListener('click', event => {
    const effect = g.circle(32, 32, 'purple')

    effect.x = event.clientX - effect.halfWidth
    effect.y = event.clientY - effect.halfHeight

    effects.push(effect)
    gameScene.add(effect)
  })

  hotbarEl.querySelectorAll('button').forEach((button, index) => {
    const {
      id,
      type,
    } = playerState.hotbar[index]
    const action = playerState[type][id]

    button.innerText = action.name
    button.addEventListener('click', () => useAction(action))
  })

  //Set the canvas border and background color
  g.backgroundColor = 'white'

  //Create the `gameScene` group
  gameScene = g.group()

  //Create the `exit` door sprite
  exit = g.rectangle(48, 48, 'green')
  exit.x = 8
  exit.y = 8
  gameScene.add(exit)

  //Create the `player` sprite
  player = g.rectangle(32, 32, 'blue')
  player.health = 50
  player.maxHealth = 100
  updatePlayerMaxHealth()
  updatePlayerCurrentHealth()
  g.stage.putCenter(player)
  gameScene.add(player)

  //Create the `treasure` sprite
  treasure = g.rectangle(16, 16, 'gold')
  treasure.pickedUp = false
  g.stage.putCenter(treasure, 208, 0)
  gameScene.add(treasure)

  //Make the enemies
  // const numberOfEnemies = 6
  // const spacing = 48
  // const xOffset = 150
  // const speed = 2
  // let direction = 1

  // var enemy = g.rectangle(32, 32, 'red')
  //Make as many enemies as there are `numberOfEnemies`
  // for (var i = 0; i < numberOfEnemies; i++) {
  //   //Each enemy is a red rectangle
  //   var enemy = g.rectangle(32, 32, 'red')

  //   //Space each enemy horizontally according to the `spacing` value.
  //   //`xOffset` determines the point from the left of the screen
  //   //at which the first enemy should be added.
  //   var x = spacing * i + xOffset

  //   //Give the enemy a random y position
  //   var y = g.randomInt(0, g.canvas.height - enemy.height)

  //   //Set the enemy's direction
  //   enemy.x = x
  //   enemy.y = y

  //   //Set the enemy's vertical velocity. `direction` will be either `1` or
  //   //`-1`. `1` means the enemy will move down and `-1` means the enemy will
  //   //move up. Multiplying `direction` by `speed` determines the enemy's
  //   //vertical direction
  //   enemy.vy = speed * direction

  //   //Reverse the direction for the next enemy
  //   direction *= -1

  //   //Push the enemy into the `enemies` array
  //   enemies.push(enemy)

  //   //Add the enemy to the `gameScene`
  //   gameScene.add(enemy)
  // }

  //Add some text for the game over message
  message = g.text('Game Over!', '64px Futura', 'black', 20, 20)
  message.x = 120
  message.y = g.canvas.height / 2 - 64

  //Create a `gameOverScene` group and add the message sprite to it
  gameOverScene = g.group(message)

  //Make the `gameOverScene` invisible for now
  gameOverScene.visible = false

  //Assign the player's keyboard controllers
  g.fourKeyController(player, 5, 38, 39, 40, 37)

  g.state = play
}

const g = ga(
  window.innerWidth,
  window.innerHeight,
  setup,
)

g.start()
