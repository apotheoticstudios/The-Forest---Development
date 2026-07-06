ServerEvents.recipes(event => {

  const PLANKS = '#minecraft:planks'
  const STICK = 'minecraft:stick'
  const LEATHER = 'minecraft:leather'

  event.remove({ output: /minecraft:wooden_.*/ })

  // Wooden Pickaxe
  event.shaped('minecraft:wooden_pickaxe', [
    'PPP',
    'LSL',
    ' S '
  ], {
    P: PLANKS,
    S: STICK,
    L: LEATHER
  })

  // Wooden Axe
  event.shaped('minecraft:wooden_axe', [
    'PP ',
    'PLS',
    ' L '
  ], {
    P: PLANKS,
    S: STICK,
    L: LEATHER
  })

  // Wooden Shovel
  event.shaped('minecraft:wooden_shovel', [
    ' P ',
    ' L ',
    ' S '
  ], {
    P: PLANKS,
    L: LEATHER,
    S: STICK
  })

  // Wooden Sword
event.shaped('minecraft:wooden_sword', [
    ' P ',
    ' P ',
    'LS '
  ], {
    P: PLANKS,
    L: LEATHER,
    S: STICK
  })

  // Wooden Hoe
  event.shaped('minecraft:wooden_hoe', [
    'PP ',
    'LS ',
    ' L '
  ], {
    P: PLANKS,
    L: LEATHER,
    S: STICK
  })

})