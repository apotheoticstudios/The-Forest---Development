ServerEvents.recipes(event => {

  const STONE = '#forge:stone'
  const STICK = 'minecraft:stick'
  const LEATHER = 'minecraft:leather'

  event.remove({ output: /minecraft:stone_.*/ })

  // stone Pickaxe
  event.shaped('minecraft:stone_pickaxe', [
    'PPP',
    'LSL',
    ' S '
  ], {
    P: STONE,
    S: STICK,
    L: LEATHER
  })

  // stone Axe
  event.shaped('minecraft:stone_axe', [
    'PP ',
    'PLS',
    ' L '
  ], {
    P: STONE,
    S: STICK,
    L: LEATHER
  })

  // stone Shovel
  event.shaped('minecraft:stone_shovel', [
    ' P ',
    ' L ',
    ' S '
  ], {
    P: STONE,
    L: LEATHER,
    S: STICK
  })

  // stone Sword
event.shaped('minecraft:stone_sword', [
    ' P ',
    ' P ',
    'LS '
  ], {
    P: STONE,
    L: LEATHER,
    S: STICK
  })

  // stone Hoe
  event.shaped('minecraft:stone_hoe', [
    'PP ',
    'LS ',
    ' L '
  ], {
    P: STONE,
    L: LEATHER,
    S: STICK
  })

})