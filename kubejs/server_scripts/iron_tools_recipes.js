ServerEvents.recipes(event => {

  const IRON = 'minecraft:iron_ingot'
  const STICK = 'minecraft:stick'
  const LEATHER = 'minecraft:leather'

  event.remove({ output: /minecraft:iron_.*/ })

  // iron Pickaxe
  event.shaped('minecraft:iron_pickaxe', [
    'PPP',
    'LSL',
    ' S '
  ], {
    P: IRON,
    S: STICK,
    L: LEATHER
  })

  // iron Axe
  event.shaped('minecraft:iron_axe', [
    'PP ',
    'PLS',
    ' L '
  ], {
    P: IRON,
    S: STICK,
    L: LEATHER
  })

  // iron Shovel
  event.shaped('minecraft:iron_shovel', [
    ' P ',
    ' L ',
    ' S '
  ], {
    P: IRON,
    L: LEATHER,
    S: STICK
  })

  // iron Sword
event.shaped('minecraft:iron_sword', [
    ' P ',
    ' P ',
    'LS '
  ], {
    P: IRON,
    L: LEATHER,
    S: STICK
  })

  // iron Hoe
  event.shaped('minecraft:iron_hoe', [
    'PP ',
    'LS ',
    ' L '
  ], {
    P: IRON,
    L: LEATHER,
    S: STICK
  })

})