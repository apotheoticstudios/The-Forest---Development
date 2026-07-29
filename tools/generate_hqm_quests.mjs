import { createHash } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const outDir = 'config/hqm/default';
const setsDir = join(outDir, 'sets');

const wt = text => ({ text, isTranslationKey: false });
const stack = (id, Count = 1, tag = undefined) => tag ? { id, Count, tag } : { id, Count };
const itemPart = (id, required = 1, precision = undefined) => {
  const part = { item: stack(id), required };
  if (required === 1) delete part.required;
  if (precision) part.precision = precision;
  return part;
};
const textTask = (title, body) => ({
  type: 'hardcorequesting:checkbox',
  description: wt(title),
  longDescription: wt(body)
});
const detectTask = (title, items, body = '') => ({
  type: 'hardcorequesting:detect',
  description: wt(title),
  longDescription: wt(body || 'Have the listed supplies in your inventory.'),
  items: items.map(item => Array.isArray(item) ? itemPart(...item) : itemPart(item))
});
const craftTask = (title, items, body = '') => ({
  type: 'hardcorequesting:craft',
  description: wt(title),
  longDescription: wt(body || 'Craft the listed item after this quest is available.'),
  items: items.map(item => Array.isArray(item) ? itemPart(...item) : itemPart(item))
});
const consumeTask = (title, items, body = '') => ({
  type: 'hardcorequesting:consume',
  description: wt(title),
  longDescription: wt(body || 'Submit the listed supplies.'),
  items: items.map(item => Array.isArray(item) ? itemPart(...item) : itemPart(item))
});
const killTask = (title, mob, kills, body = '') => ({
  type: 'hardcorequesting:kill',
  description: wt(title),
  longDescription: wt(body || 'Kill the listed hostile mobs.'),
  mobs: [{ name: wt(title), mob, kills }]
});
const locationTask = (title, dim, body = '') => ({
  type: 'hardcorequesting:location',
  description: wt(title),
  longDescription: wt(body || `Enter ${dim}.`),
  locations: [{ name: wt(title), x: 0, y: 64, z: 0, dim, radius: -1, visible: 'FULL' }]
});

const uuid = slug => {
  const h = createHash('md5').update(`the-forest-hqm:${slug}`).digest('hex');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-4${h.slice(13, 16)}-a${h.slice(17, 20)}-${h.slice(20, 32)}`;
};

const questIds = new Map();
const qid = slug => {
  if (!questIds.has(slug)) questIds.set(slug, uuid(slug));
  return questIds.get(slug);
};

function quest(slug, name, description, x, y, icon, tasks, rewards = [], prereq = []) {
  return {
    uuid: qid(slug),
    name: wt(name),
    description: wt(description),
    x,
    y,
    icon: stack(icon),
    tasks,
    prerequisites: prereq.map(qid),
    optionlinks: [],
    reward: rewards,
    rewardchoice: [],
    commandrewards: []
  };
}

const sets = [
  {
    file: 'first_clearing',
    name: 'The First Clearing',
    description: 'The first chapter teaches the player how this pack expects them to survive: check the kit, keep the atlas, make a shelter, and respect nightfall.',
    quests: [
      quest('clearing-wake', 'Wake In The Redwoods',
        'You did not spawn in a normal overworld start. Read the journal, check the kit, and mark this entry once you understand that the forest is already watching.',
        0, 0, 'minecraft:writable_book',
        [textTask('Read the journal', 'The starter journal establishes the watchtower job and the warning about voices in the woods. This quest is manual so the book can serve as a diegetic introduction.')],
        [stack('minecraft:bread', 4)]),
      quest('clearing-kit', 'Inventory Audit',
        'Confirm the essentials from CustomStartingGear: flashlight, water, atlas, axe, and cleaver. This teaches players that the starter kit is not flavor; it is survival equipment.',
        30, 0, 'omegaflashlight:flashlight',
        [detectTask('Carry the kit', ['omegaflashlight:flashlight', ['legendarysurvivaloverhaul:purified_water_bottle', 2], 'antiqueatlas:empty_antique_atlas', 'minecraft:stone_axe', 'butchery:bone_cleaver'])],
        [stack('hardcorequesting:quarterheart')], ['clearing-wake']),
      quest('clearing-wood', 'Hands Full Of Bark',
        'Gather enough wood to make the first shelter. FallingTree makes this quick, but the point is to establish a perimeter before the light goes.',
        60, 0, 'minecraft:oak_log',
        [detectTask('Gather logs', [['minecraft:oak_log', 16, 'TAG_FUZZY']])],
        [stack('minecraft:torch', 8)], ['clearing-kit']),
      quest('clearing-stone', 'Stone Before Steel',
        'Collect stone and cobblestone before committing to a base location. The forest rewards simple preparation.',
        90, 0, 'minecraft:cobblestone',
        [detectTask('Gather rough stone', [['minecraft:cobblestone', 24, 'TAG_FUZZY']])],
        [stack('minecraft:coal', 8)], ['clearing-wood']),
      quest('clearing-shelter', 'A Door Between You And It',
        'Build a sealed room with a bed or bedroll nearby. Check this once you can close the door and stop watching every tree line.',
        120, 0, 'minecraft:oak_door',
        [textTask('Build a shelter', 'Make a small enclosed shelter before the first night. HQM cannot reliably inspect a whole base, so this is intentionally a manual survival checkpoint.')],
        [stack('minecraft:glass', 8)], ['clearing-stone']),
      quest('clearing-atlas', 'Name The Place',
        'Open or craft an Antique Atlas and start marking useful landmarks. Navigation matters because F3 information is intentionally restricted.',
        150, 0, 'antiqueatlas:empty_antique_atlas',
        [detectTask('Keep an atlas', ['antiqueatlas:empty_antique_atlas'])],
        [stack('minecraft:paper', 8)], ['clearing-shelter']),
      quest('clearing-backpack', 'Leave Room For Panic',
        'Craft a backpack so caving and supply runs do not turn into inventory management disasters.',
        180, 0, 'backpacked:backpack',
        [craftTask('Craft a backpack', ['backpacked:backpack'])],
        [stack('minecraft:leather', 4)], ['clearing-atlas']),
      quest('clearing-night', 'Night Has Fallen',
        'The first night message is not just atmosphere. Darkness, sound, fog, and stalker events make night a real system.',
        210, 0, 'minecraft:clock',
        [textTask('Survive a night', 'Stay alive through a full night cycle in the Overworld. Use light, walls, distance, and sound instead of rushing combat.')],
        [stack('hardcorequesting:quarterheart')], ['clearing-shelter']),
      quest('clearing-hostiles', 'The Usual Dead',
        'Prove you can handle normal Minecraft hostiles before chasing the things added by the horror mods.',
        240, 0, 'minecraft:iron_sword',
        [killTask('Kill zombies', 'minecraft:zombie', 5), killTask('Kill skeletons', 'minecraft:skeleton', 3)],
        [stack('minecraft:arrow', 16)], ['clearing-night']),
      quest('clearing-routine', 'One More Day',
        'Finish the basic loop: shelter, food, water, light, map. From here the pack opens into specialist systems.',
        270, 0, 'minecraft:campfire',
        [textTask('Stabilize the first base', 'Mark this once you have a defensible base, a marked atlas, spare food, drinkable water, and a plan for the next trip.')],
        [stack('hardcorequesting:halfheart')], ['clearing-hostiles', 'clearing-backpack'])
    ]
  },
  {
    file: 'light_and_climate',
    name: 'Light And Climate',
    description: 'Light is the central tool in The Forest. This chapter moves from fire and water into flashlights, lamps, cold protection, and seasonal awareness.',
    quests: [
      quest('light-water', 'Boil The Creek',
        'Water is not optional. The pack starts you with purified bottles and adds a campfire recipe for more.',
        0, 0, 'legendarysurvivaloverhaul:purified_water_bottle',
        [craftTask('Make purified water', ['legendarysurvivaloverhaul:purified_water_bottle'])],
        [stack('minecraft:charcoal', 8)], ['clearing-routine']),
      quest('light-canteen', 'Something With A Cap',
        'Craft a canteen so thirst stops controlling every trip.',
        30, 0, 'legendarysurvivaloverhaul:canteen',
        [craftTask('Craft a canteen', ['legendarysurvivaloverhaul:canteen'])],
        [stack('legendarysurvivaloverhaul:purified_water_bottle', 2)], ['light-water']),
      quest('light-bandage', 'Stop The Bleeding',
        'Carry medical supplies before hunting the things that make the soundscape go quiet.',
        60, 0, 'legendarysurvivaloverhaul:bandage',
        [craftTask('Craft bandages', [['legendarysurvivaloverhaul:bandage', 3]])],
        [stack('minecraft:string', 8)], ['light-canteen']),
      quest('light-thermometer', 'Read The Air',
        'Temperature is enabled and dangerous cold can hurt you. Craft a thermometer before traveling far.',
        90, 0, 'legendarysurvivaloverhaul:thermometer',
        [craftTask('Craft a thermometer', ['legendarysurvivaloverhaul:thermometer'])],
        [stack('minecraft:redstone', 8)], ['light-bandage']),
      quest('light-calendar', 'The Season Has Teeth',
        'Serene Seasons and survival temperature make long-term shelter planning matter.',
        120, 0, 'legendarysurvivaloverhaul:seasonal_calendar',
        [craftTask('Craft a seasonal calendar', ['legendarysurvivaloverhaul:seasonal_calendar'])],
        [stack('minecraft:paper', 8)], ['light-thermometer']),
      quest('light-boiler', 'Warm Room',
        'The custom boiler recipe is intentionally heavier. Build one before winter or high-altitude travel gets ugly.',
        150, 0, 'legendarysurvivaloverhaul:heater',
        [craftTask('Craft a boiler', ['legendarysurvivaloverhaul:heater'])],
        [stack('minecraft:coal_block')], ['light-calendar']),
      quest('light-battery', 'Reserve Power',
        'The flashlight is reliable because it uses its own path, but batteries still define how long a trip can last.',
        30, 45, 'omegaflashlight:large_battery',
        [craftTask('Craft spare batteries', ['omegaflashlight:small_battery', 'omegaflashlight:medium_battery'])],
        [stack('minecraft:redstone', 12)], ['clearing-kit']),
      quest('light-lamp', 'Fixed Light',
        'Move from handheld panic to permanent lighting with Omega lamps.',
        60, 45, 'omegaflashlight:basic_lamp',
        [craftTask('Craft a basic lamp', ['omegaflashlight:basic_lamp'])],
        [stack('minecraft:glowstone_dust', 8)], ['light-battery']),
      quest('light-dye', 'Colored Warnings',
        'The Colorful Lighting compatibility work makes colored lamps useful as navigation language: red for danger, blue for water, green for exits.',
        90, 45, 'omegaflashlight:dye_table',
        [craftTask('Craft the dye table', ['omegaflashlight:dye_table'])],
        [stack('minecraft:red_dye', 4), stack('minecraft:blue_dye', 4)], ['light-lamp']),
      quest('light-high-grade', 'A Beam You Trust',
        'Upgrade beyond basic lamps once you can afford the materials. Better light should feel like progress.',
        120, 45, 'omegaflashlight:high_quality_lamp',
        [craftTask('Craft a high-quality lamp', ['omegaflashlight:high_quality_lamp'])],
        [stack('hardcorequesting:quarterheart')], ['light-dye'])
    ]
  },
  {
    file: 'food_and_butchery',
    name: 'Food And Butchery',
    description: 'The pack leans into practical, uncomfortable food production. Butchery, Farmer\'s Delight, thirst, and custom recipes turn meals into progression.',
    quests: [
      quest('food-forage', 'Forage Before Hunger',
        'Collect simple food before hunting. The goal is to teach that every trip starts with calories.',
        0, 0, 'minecraft:sweet_berries',
        [detectTask('Carry simple food', [['minecraft:bread', 8, 'TAG_FUZZY']])],
        [stack('minecraft:apple', 4)], ['clearing-routine']),
      quest('food-cleaver', 'The Cleaver Is Not A Weapon',
        'The starter bone cleaver points directly at Butchery progression. Keep it on you.',
        30, 0, 'butchery:bone_cleaver',
        [detectTask('Carry a cleaver', ['butchery:bone_cleaver'])],
        [stack('minecraft:bone', 8)], ['food-forage']),
      quest('food-knife', 'Cleaner Work',
        'Craft a skinning knife for proper carcass processing.',
        60, 0, 'butchery:bone_skinning_knife',
        [craftTask('Craft a skinning knife', ['butchery:bone_skinning_knife'])],
        [stack('minecraft:leather', 3)], ['food-cleaver']),
      quest('food-table', 'Table Work',
        'Build a butcher table and move carcass work out of your main room.',
        90, 0, 'butchery:oak_butchers_table',
        [craftTask('Craft a butcher table', ['butchery:oak_butchers_table'])],
        [stack('minecraft:iron_nugget', 16)], ['food-knife']),
      quest('food-hunt', 'Meat Has A Cost',
        'Hunt normal animals first. Save the horror entities for when you have armor, light, and an exit route.',
        120, 0, 'minecraft:beef',
        [killTask('Hunt cows', 'minecraft:cow', 2), killTask('Hunt pigs', 'minecraft:pig', 2)],
        [stack('minecraft:coal', 8)], ['food-table']),
      quest('food-pot', 'A Real Meal',
        'The cooking pot recipe is custom and more expensive, so it marks the shift from scraps to meals.',
        150, 0, 'farmersdelight:cooking_pot',
        [craftTask('Craft a cooking pot', ['farmersdelight:cooking_pot'])],
        [stack('minecraft:bowl', 8)], ['food-hunt']),
      quest('food-stove', 'Permanent Kitchen',
        'A stove is a base investment. Once built, long trips become easier to prepare for.',
        180, 0, 'farmersdelight:stove',
        [craftTask('Craft a stove', ['farmersdelight:stove'])],
        [stack('minecraft:brick', 8)], ['food-pot']),
      quest('food-storage', 'Crates And Shelves',
        'Store ingredients in crates and keep the base scannable under pressure.',
        210, 0, 'farmersdelight:carrot_crate',
        [craftTask('Craft a food crate', ['farmersdelight:carrot_crate'])],
        [stack('minecraft:chest', 2)], ['food-stove']),
      quest('food-heart', 'Crystal Heart',
        'The custom heart-container recipe ties healing herbs and gold apples into long-term survival.',
        240, 0, 'legendarysurvivaloverhaul:heart_container',
        [craftTask('Craft a crystal heart', ['legendarysurvivaloverhaul:heart_container'])],
        [stack('hardcorequesting:halfheart')], ['food-storage'])
    ]
  },
  {
    file: 'exploration_and_evidence',
    name: 'Exploration And Evidence',
    description: 'The forest is larger than the first clearing. This chapter turns mapping, caves, bunkers, photography, and strange encounters into a field log.',
    quests: [
      quest('explore-map', 'Map The Perimeter',
        'Use the atlas to mark water, shelter, caves, and anything that looks deliberately placed.',
        0, 0, 'antiqueatlas:antique_atlas',
        [textTask('Mark three locations', 'Add at least three useful markers to your atlas: water, base, cave, bunker, campsite, or a suspicious structure.')],
        [stack('minecraft:paper', 12)], ['clearing-routine']),
      quest('explore-campsite', 'Campsite Sweep',
        'Campsite structures and bunkers are the first signs that other people were here before you.',
        30, 0, 'minecraft:lantern',
        [textTask('Loot a campsite or bunker', 'Find and clear a campsite, abandoned shelter, or underground bunker. Mark it on the atlas before leaving.')],
        [stack('minecraft:torch', 12)], ['explore-map']),
      quest('explore-camera', 'Proof Beats Memory',
        'Exposure gives the pack a perfect evidence loop. Build a camera before the forest convinces you nothing happened.',
        60, 0, 'exposure:camera',
        [craftTask('Craft a camera', ['exposure:camera'])],
        [stack('minecraft:glass_pane', 8)], ['explore-campsite']),
      quest('explore-film', 'Load The Reel',
        'A camera without film is just extra weight.',
        90, 0, 'exposure:black_and_white_film',
        [craftTask('Craft film', ['exposure:black_and_white_film'])],
        [stack('minecraft:paper', 8)], ['explore-camera']),
      quest('explore-photo', 'Photograph The Wrong Thing',
        'Use the camera on an unexplained structure, cave entrance, silhouette, or corpse scene.',
        120, 0, 'exposure:photograph',
        [textTask('Take an evidence photo', 'Take at least one photograph of something worth reporting. HQM cannot inspect photo contents, so this is manual.')],
        [stack('hardcorequesting:quarterheart')], ['explore-film']),
      quest('explore-album', 'Case File',
        'Keep evidence together. An album turns scattered photos into a readable field record.',
        150, 0, 'exposure:album',
        [craftTask('Craft a photo album', ['exposure:album'])],
        [stack('minecraft:ink_sac', 4)], ['explore-photo']),
      quest('explore-geode', 'Stone With Teeth',
        'Spelunker\'s Charm adds cave finds that make underground trips feel different from strip mining.',
        30, 45, 'spelunkers_charm:geode',
        [detectTask('Find a geode', ['spelunkers_charm:geode'])],
        [stack('minecraft:iron_ingot', 4)], ['explore-campsite']),
      quest('explore-helmet', 'Light On Your Head',
        'Hands-free cave lighting is a major upgrade when dynamic held lights are expensive.',
        60, 45, 'spelunkers_charm:candle_helmet',
        [craftTask('Craft a candle helmet', ['spelunkers_charm:candle_helmet'])],
        [stack('minecraft:candle', 8)], ['explore-geode']),
      quest('explore-caves', 'Below The Roots',
        'Caves contain resources, sound traps, ghost events, cave dust, and the things that do not announce themselves politely.',
        90, 45, 'minecraft:deepslate',
        [textTask('Complete a cave run', 'Enter a cave, collect resources, mark the entrance, and return to base with the same or better gear than you left with.')],
        [stack('minecraft:iron_ingot', 6)], ['explore-helmet']),
      quest('explore-nature', 'Catalog The Living Forest',
        'Alex\'s Mobs and Naturalist make wildlife part of the setting, not just ambient decoration.',
        120, 45, 'alexsmobs:banana_slug_slime',
        [detectTask('Collect a forest specimen', ['alexsmobs:banana_slug_slime'])],
        [stack('minecraft:slime_ball', 2)], ['explore-map'])
    ]
  },
  {
    file: 'signals_and_escalation',
    name: 'Signals And Escalation',
    description: 'Once the base is stable, the pack shifts toward communication, power, ranged defense, and a final attempt to make contact.',
    quests: [
      quest('signal-wire', 'Copper Voice',
        'Simple Radio starts with parts. Make wire before building a whole station.',
        0, 0, 'simpleradio:copper_wire',
        [craftTask('Craft copper wire', ['simpleradio:copper_wire'])],
        [stack('minecraft:copper_ingot', 4)], ['explore-caves']),
      quest('signal-walkie', 'Short Range',
        'A handheld radio is useful in multiplayer and still thematic in single player: someone might answer.',
        30, 0, 'simpleradio:walkie_talkie',
        [craftTask('Craft a walkie talkie', ['simpleradio:walkie_talkie'])],
        [stack('minecraft:redstone', 8)], ['signal-wire']),
      quest('signal-station', 'Build The Station',
        'Build the radio hardware that turns a camp into an outpost.',
        60, 0, 'simpleradio:radio',
        [craftTask('Craft a radio', ['simpleradio:radio']), craftTask('Craft an antenna', ['simpleradio:antenna'])],
        [stack('minecraft:iron_ingot', 6)], ['signal-walkie']),
      quest('signal-smithing', 'Tune The Signal',
        'The Radiosmithing Station and Frequencer make communication feel like a project rather than a button.',
        90, 0, 'simpleradio:radiosmither',
        [craftTask('Craft radio tools', ['simpleradio:radiosmither', 'simpleradio:frequencer'])],
        [stack('minecraft:gold_ingot', 2)], ['signal-station']),
      quest('signal-transceiver', 'Two-Way Contact',
        'A transceiver is the late-stage communication milestone.',
        120, 0, 'simpleradio:transceiver',
        [craftTask('Craft a transceiver', ['simpleradio:transceiver'])],
        [stack('hardcorequesting:quarterheart')], ['signal-smithing']),
      quest('signal-backup', 'Backup Channel',
        'The separate Walkie-Talkie mod gives a simpler fallback channel.',
        150, 0, 'walkietalkie:iron_walkietalkie',
        [craftTask('Craft an iron walkie-talkie', ['walkietalkie:iron_walkietalkie'])],
        [stack('minecraft:iron_ingot', 4)], ['signal-walkie']),
      quest('signal-range', 'Range Markers',
        'Test contact from the edge of your marked perimeter.',
        180, 0, 'minecraft:repeater',
        [textTask('Test the radio range', 'Walk to a marked atlas point outside the base, test the handheld/radio setup, and return before nightfall.')],
        [stack('minecraft:redstone_torch', 4)], ['signal-transceiver']),
      quest('signal-bench', 'Escalation Bench',
        'TaCZ exists for the moment avoidance stops being enough. Build the workbench before wasting ammo.',
        60, 45, 'tacz:workbench_a',
        [craftTask('Craft a gun workbench', [['tacz:workbench_a', 1, 'NBT_FUZZY']])],
        [stack('minecraft:gunpowder', 8)], ['explore-caves']),
      quest('signal-target', 'Do Not Learn Under Chase',
        'Practice with targets before bringing firearms into a cave or night event.',
        90, 45, 'tacz:target',
        [craftTask('Craft a target', ['tacz:target'])],
        [stack('minecraft:paper', 8)], ['signal-bench']),
      quest('signal-holdout', 'Hold The Line',
        'End the first quest arc by proving the outpost can survive pressure.',
        210, 0, 'minecraft:crossbow',
        [textTask('Survive a holdout night', 'Spend a full night at the outpost with stocked water, food, light, medical supplies, radio access, and an escape route.')],
        [stack('hardcorequesting:heart')], ['signal-range', 'signal-target'])
    ]
  },
  {
    file: 'wrong_places',
    name: 'Wrong Places',
    description: 'This chapter reserves room for Limbo and Deep Void progression referenced by KubeJS scripts. It stays mostly manual because the dimension jars are not present in the current mods folder.',
    quests: [
      quest('wrong-limbo-note', 'Limbo Note',
        'KubeJS has a Limbo entry message, but the matching Dimensional Doors jar is not in this mods folder. Keep this as the story hook for when the dimension returns.',
        0, 0, 'minecraft:ender_eye',
        [textTask('Read the Limbo hook', 'The script says: delve down the layers of limbo to find a pool of blood. Mark this complete after confirming Dimensional Doors is installed in the target build.')],
        [stack('minecraft:ender_pearl', 2)], ['explore-caves']),
      quest('wrong-limbo-enter', 'Where Am I',
        'If Dimensional Doors is restored, this can be completed by entering Limbo.',
        30, 0, 'minecraft:compass',
        [locationTask('Enter Limbo', 'dimdoors:limbo')],
        [stack('hardcorequesting:quarterheart')], ['wrong-limbo-note']),
      quest('wrong-void-note', 'Deep Void Note',
        'KubeJS references The Deep Void and a Void Pendant recipe, but only config/cache files are present right now.',
        60, 0, 'minecraft:echo_shard',
        [textTask('Read the Deep Void hook', 'The script names the Void Pendant ingredients: Bone Marrow Strands, Rotten Bones, and Onyx. Keep this note until the dimension mod is restored.')],
        [stack('minecraft:amethyst_shard', 4)], ['wrong-limbo-note']),
      quest('wrong-void-enter', 'Above My Pay Grade',
        'If The Deep Void is restored, this can be completed by entering the Deep Void dimension.',
        90, 0, 'minecraft:sculk',
        [locationTask('Enter the Deep Void', 'the_deep_void:deep_void')],
        [stack('hardcorequesting:quarterheart')], ['wrong-void-note']),
      quest('wrong-return', 'Find A Way Out',
        'The point of both wrong-place chapters is escape, not tourism.',
        120, 0, 'minecraft:recovery_compass',
        [textTask('Return alive', 'Return to the Overworld from Limbo or the Deep Void with your quest book, atlas, and one useful artifact.')],
        [stack('hardcorequesting:halfheart')], ['wrong-limbo-note', 'wrong-void-note']),
      quest('wrong-report', 'File The Impossible',
        'Bring the impossible back into the normal progression loop: map it, photograph it, and report it over the radio.',
        150, 0, 'exposure:album',
        [textTask('Document the event', 'Add a photo or written note about the wrong-place trip, mark the route if possible, and transmit from the radio station.')],
        [stack('hardcorequesting:heart')], ['wrong-return', 'signal-transceiver'])
    ]
  }
];

mkdirSync(setsDir, { recursive: true });
writeFileSync(join(outDir, 'description.txt'), 'The Forest is a survival-horror questline about staying alive long enough to understand what is happening in the trees.\n');
writeFileSync(join(outDir, 'sets.json'), JSON.stringify({ sets: sets.map(set => set.file) }, null, 2) + '\n');

for (const set of sets) {
  writeFileSync(join(setsDir, `${set.file}.json`), JSON.stringify({
    name: set.name,
    description: wt(set.description),
    quests: set.quests,
    reputationBar: []
  }, null, 2) + '\n');
}
