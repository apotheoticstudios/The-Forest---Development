PlayerEvents.tick(event => {
  if (event.player.level.isClientSide()) return

  const key = 'firstJoinMessage'
  if (event.player.persistentData.getBoolean(key)) return

  event.player.persistentData.putBoolean(key, true)

  event.server.scheduleInTicks(20, () => {
    event.player.runCommandSilent(
      `/immersivemessages sendcustom @s {anchor:"BOTTOM_CENTRE",y:90,shake:1b,typewriter:1b,glow:1b,color:"#ff5555"} 8 Welcome to The Forest`
    )
  })
})

