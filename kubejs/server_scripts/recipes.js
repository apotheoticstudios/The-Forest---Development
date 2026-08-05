ServerEvents.recipes(event => {
  const hasLSO = Platform.isLoaded('legendarysurvivaloverhaul')

  event.remove({ output: 'minecraft:slime_ball' })
  event.shapeless(
    Item.of('minecraft:slime_ball', 1), 
    [
      'alexsmobs:banana_slug_slime',
      'alexsmobs:banana_slug_slime',
      'alexsmobs:banana_slug_slime'
    ]
  )

  event.remove({ output: 'minecraft:blaze_rod' })
  event.shaped(
    Item.of('minecraft:blaze_rod', 3), 
    [
      'GGG',
      'GLG',
      'GGG'
    ],
    {
      G: 'minecraft:gold_ingot',   
      L: 'minecraft:lava_bucket'    
    }
  )

  event.remove({ output: 'minecraft:glowstone' })
  event.shaped(
    Item.of('minecraft:glowstone', 1), 
    [
      'GCG',
      'CBC',
      'GCG'
    ],
    {
      G: 'minecraft:glow_ink_sac', 
      B: 'minecraft:blaze_powder',  
      C: 'minecraft:cobblestone'    
    }
  )

  if (hasLSO) {
    event.custom({
      type: 'minecraft:campfire_cooking',
      ingredient: { item: 'minecraft:potion' },
      result: 'legendarysurvivaloverhaul:purified_water_bottle',
      experience: 0.35,
      cookingtime: 360
    }).id('kubejs:campfire_water_bottle')

    event.shaped('legendarysurvivaloverhaul:sun_fern_seeds', [
      'RSR',
      'SPS',
      'RSR'
    ], {
      S: 'minecraft:magma_block',
      P: 'minecraft:fern',
      R: 'minecraft:blaze_rod'
    }).id('kubejs:sun_fern_seeds')
  }

  event.shapeless('4x minecraft:string', ['#minecraft:wool'])

  if (hasLSO) {
    event.remove({ output: 'legendarysurvivaloverhaul:heater' })
    event.shaped('legendarysurvivaloverhaul:heater', [
        ' I ',
        'IFI',
        'ICI'
    ], {
        I: 'minecraft:iron_ingot',
        C: "minecraft:coal_block",
        F: 'minecraft:blast_furnace'
    })
  }

    event.remove({ output: 'farmersdelight:cooking_pot' })
    event.shaped('farmersdelight:cooking_pot', [
            'BSB',
            'IWI',
            'III'
    ], {
            W: 'minecraft:water_bucket',
            I: 'minecraft:iron_ingot',
            S: 'minecraft:stick',
            B: 'minecraft:brick'
    }).id('kubejs:cooking_pot');

    event.remove({ output: 'farmersdelight:stove' })
    event.shaped('farmersdelight:stove', [
            'III',
            'B B',
            'BMB'
    ], {
            B: 'minecraft:bricks',
            I: 'minecraft:iron_ingot',
            M: 'minecraft:magma_block'
    }).id('kubejs:stove');  
    
  if (hasLSO) {
    event.remove({ output: 'legendarysurvivaloverhaul:heart_container' }) 
    
    event.shaped('legendarysurvivaloverhaul:heart_fragment', [
      'YRY',
      'RHR',
      'YRY'
    ], {
      R: 'minecraft:red_stained_glass',
      Y: 'minecraft:yellow_stained_glass',
      H: 'legendarysurvivaloverhaul:healing_herbs'
    })

    event.shaped('legendarysurvivaloverhaul:heart_container', [
      'GHG',
      ' G '
    ], {
      G: 'legendarysurvivaloverhaul:heart_fragment',
      H: 'minecraft:golden_apple'
    })
  }

  // Remove vanilla recipes (optional)
  event.remove({ output: 'minecraft:iron_ingot', type: 'minecraft:smelting' })
  event.remove({ output: 'minecraft:iron_ingot', type: 'minecraft:blasting' })

  // Furnace recipe
  event.smelting('minecraft:iron_ingot', 'minecraft:raw_iron')
   .xp(0.7)
   .cookingTime(200)

  // Blast Furnace recipe
  event.blasting('minecraft:iron_ingot', 'minecraft:raw_iron')
   .xp(0.7)
   .cookingTime(100)

})


BlockEvents.broken(event => {
  if (event.block.id === 'refurbished_furniture:light_fridge') {
    event.cancel()
  }
})
