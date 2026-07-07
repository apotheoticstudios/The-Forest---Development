const SHOWN_KEY = 'forestWelcomeShown_v4'

PlayerEvents.tick(event => {
  const player = event.player
  if (player.level.isClientSide()) return

  if (player.persistentData.getBoolean(SHOWN_KEY)) return
  player.persistentData.putBoolean(SHOWN_KEY, true)

  const server = event.server
  const name = player.username


  server.scheduleInTicks(40, () => {
    if (!player || player.isRemoved()) return

    // Title
    server.runCommandSilent(
      `immersivemessages sendcustom ${name} {anchor:0,y:-16f,size:3.0f,font:"immersivemessages:anton",color:"#8E1616",bold:1b,obfuscate:1b,fadein:1.8f,fadeout:2.4f} 8 Welcome to The Forest`
    )

    // Subtitle
    server.scheduleInTicks(40, () => {
      if (!player || player.isRemoved()) return
      server.runCommandSilent(
        `immersivemessages sendcustom ${name} {anchor:0,y:18f,size:1.25f,font:"immersivemessages:kalam",color:"#9A9184",italic:1b,typewriter:1b,fadein:1.2f,fadeout:2.0f} 6 Enjoy your stay...`
      )
    })
  })
})
