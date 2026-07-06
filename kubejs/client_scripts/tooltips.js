ItemEvents.tooltip(event => {
  event.add('anotherflashlightmodport:flashlight_off', 'Requires batteries to stay powered')
  event.add('anotherflashlightmodport:flashlight_on', 'Requires batteries to stay powered')
  event.add('minecraft:gravel', 'Rocky')
  
  if (event.item.id === 'the_deep_void:void_mirror') {
    event.add('A Dark Reflection Stares Back')
  }
})