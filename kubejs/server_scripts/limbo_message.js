PlayerEvents.tick(event => {
  const player = event.player
  const level = player.level

  // Server only
  if (level.isClientSide()) return

  // Only check once per second to avoid TPS issues
  if (level.getDayTime() % 20 !== 0) return

  const dim = String(level.dimension)
  const data = player.persistentData

  if (!data.contains('lastDim')) {
    data.putString('lastDim', dim)
    return
  }

  if (data.getString('lastDim') !== dim) {
    data.putString('lastDim', dim)

    if (dim === 'dimdoors:limbo') {
      // FIRST message
      player.runCommandSilent(
        `/immersivemessages sendcustom @s {anchor:"BOTTOM_CENTRE",y:90,shake:1b,typewriter:1b,glow:1b,color:"#7a88a6"} 10 where.... am I......`
      )

      // SECOND message
      event.server.scheduleInTicks(400, () => {
        if (!player || player.isRemoved()) return

        player.runCommandSilent(
          `/immersivemessages sendcustom @s {anchor:"BOTTOM_CENTRE",y:90,typewriter:1b,glow:1b,color:"#7a88a6"} 8 This is above my pay grade.`
        )
      })

      // THIRD message after 30 seconds
      event.server.scheduleInTicks(600, () => {
        if (!player || player.isRemoved()) return

        player.runCommandSilent(
          `/immersivemessages sendcustom @s {anchor:"BOTTOM_CENTRE",y:90,typewriter:1b,glow:1b,color:"#7a88a6"} 8 I need to find a way out of here.`
        )
          // Send crafting recipe in chat after 700 ticks
          event.server.scheduleInTicks(200, () => {
            if (!player || player.isRemoved()) return

            player.runCommandSilent(`tellraw @s [{"text":"Delve down the layers of limbo to find a pool of blood.","bold":true,"color":"red"}]`)
          })
      })
    }
  }
})