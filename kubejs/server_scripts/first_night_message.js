// "Night has fallen" -- fires ONCE EACH NIGHT, right at nightfall, in the Overworld.
// Uses the Immersive Messages API (immersivemessages sendcustom).
//
// Runs from the SERVER source: /immersivemessages needs permission level 2, so
// player.runCommandSilent would be silently rejected for non-op players.
//
// NBT keys (verified against the jar): anchor is an INT (0=CENTER_CENTER),
// font/color are strings, size/x/y/fadein/fadeout are floats, typewriter/italic
// are presence flags. (glow / typewriter_speed / string anchors are NOT parsed.)

// Fire the moment Better Days considers night to begin. Keep this in sync with
// `nightStart` in config/betterdays-common.toml (default 12500). Better Days only
// changes how FAST the clock moves (15 min day / 10 min night); tick values like
// this are unaffected, so the message still lands exactly at nightfall.
const NIGHT_START = 12500
const LAST_NIGHT_KEY = 'lastNightMessageDay'

PlayerEvents.tick(event => {
  const player = event.player
  const level = player.level
  if (level.isClientSide()) return

  // Overworld only -- "night" is meaningless in the Nether / End / custom dims.
  if (String(level.dimension) !== 'minecraft:overworld') return

  const dayTime = level.getDayTime()
  const timeOfDay = ((dayTime % 24000) + 24000) % 24000
  if (timeOfDay < NIGHT_START) return

  // Fire once per in-game day. Each night has a unique day number, so this
  // resets automatically every dawn. `contains` guard lets it fire on day 0.
  const dayNumber = Math.floor(dayTime / 24000)
  const data = player.persistentData
  if (data.contains(LAST_NIGHT_KEY) && data.getInt(LAST_NIGHT_KEY) === dayNumber) return
  data.putInt(LAST_NIGHT_KEY, dayNumber)

  const server = event.server
  const name = player.username

  // Title: cold, moonlit slate-blue, types itself in and lingers.
  server.runCommandSilent(
    `immersivemessages sendcustom ${name} {anchor:0,y:-8f,size:2.2f,font:"immersivemessages:anton",color:"#8FA3C2",typewriter:1b,fadein:1.2f,fadeout:2.0f} 6 Night has fallen`
  )

  // Subtitle: a scrawled, uneasy line just below.
  server.scheduleInTicks(30, () => {
    if (!player || player.isRemoved()) return
    server.runCommandSilent(
      `immersivemessages sendcustom ${name} {anchor:0,y:18f,size:1.15f,font:"immersivemessages:kalam",color:"#9A9184",italic:1b,typewriter:1b,fadein:1.4f,fadeout:2.0f} 5 Something stirs in the dark...`
    )
  })
})
