BlockEvents.modification(event => {
  event.modify('refurbished_furniture:light_fridge', block => {
    block.destroySpeed = -1
    block.explosionResistance = 3600000
  })
})