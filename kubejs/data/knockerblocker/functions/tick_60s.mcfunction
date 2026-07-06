# Re-schedule this function every 60 seconds
schedule function knockerblocker:tick_60s 60s

# Safety: make sure objectives exist
scoreboard objectives add click dummy
scoreboard objectives add knocker_cd dummy

# Increment global cooldown timer by 60s
scoreboard players add #cd knocker_cd 600

# Default: keep everyone gated (1) so RandomAmbientEventProcedure won't spawn a sign
scoreboard players set @a click 1

# If 10 minutes (600s) elapsed, open a 60s window by setting exactly one random player's score to 0
# (TheKnocker only places a sign when it sees a nearby player with click==0 AND its own random roll hits.)
execute if score #cd knocker_cd matches 12000.. run execute if entity @a run scoreboard players set @r click 0
execute if score #cd knocker_cd matches 12000.. run scoreboard players set #cd knocker_cd 0
