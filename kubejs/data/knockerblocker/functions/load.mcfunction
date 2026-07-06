# Ensure objectives exist
scoreboard objectives add click dummy
scoreboard objectives add knocker_cd dummy

# Initialize cooldown fake player and set everyone to 'clicked' state (1)
scoreboard players set #cd knocker_cd 0
scoreboard players set @a click 1

# Start the 60-second scheduler loop
schedule function knockerblocker:tick_60s 1s
