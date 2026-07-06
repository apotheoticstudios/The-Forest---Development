PlayerEvents.tick(event => {
  const player = event.player
  const level = player.level

  // Only run on the server
  if (level.isClientSide()) return

  // Only trigger once per player per world
  if (player.persistentData.getBoolean('firstNightShown')) return

  // Minecraft night time: 13000–23000
  const timeOfDay = level.getDayTime() % 24000
  if (timeOfDay >= 13000 && timeOfDay <= 23000) {
    player.persistentData.putBoolean('firstNightShown', true)

    player.runCommandSilent(
      `/immersivemessages sendcustom @s {anchor:"BOTTOM_CENTRE",y:90,typewriter:1b,shake:1b,typewriter_speed:5,glow:1b,color:"#7a88a6"} 7 Night has fallen......`
    )
  }
})
