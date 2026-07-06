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

    if (dim === 'the_deep_void:deep_void') {
      // FIRST message
      player.runCommandSilent(
        `/immersivemessages sendcustom @s {anchor:"BOTTOM_CENTRE",y:90,shake:1b,typewriter:1b,glow:1b,color:"#7a88a6"} 10 where.... am I......`
      )

      // SECOND message after 20 seconds
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

            player.runCommandSilent(`tellraw @s [{"text":"The Void Pendant: ","bold":true,"color":"dark_purple"}]`)
            player.runCommandSilent(`tellraw @s [{"text":"Ingredients: ","bold":true},{"text":"4 Bone Marrow Strands (B) + 4 Rotten Bones (R) + 1 Onyx (O)","bold":false}]`)
            player.runCommandSilent(`tellraw @s [{"text":"Arrange like so:","bold":true}]`)
            player.runCommandSilent(`tellraw @s [{"text":"R B R"}]`)
            player.runCommandSilent(`tellraw @s [{"text":"B O B"}]`)
            player.runCommandSilent(`tellraw @s [{"text":"R B R"}]`)
          })
      })
    }
  }
})