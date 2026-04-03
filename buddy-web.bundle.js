// ../buddy/types.ts
var RARITIES = [
  "common",
  "uncommon",
  "rare",
  "epic",
  "legendary"
];
var c = String.fromCharCode;
var duck = c(100, 117, 99, 107);
var goose = c(103, 111, 111, 115, 101);
var blob = c(98, 108, 111, 98);
var cat = c(99, 97, 116);
var dragon = c(100, 114, 97, 103, 111, 110);
var octopus = c(111, 99, 116, 111, 112, 117, 115);
var owl = c(111, 119, 108);
var penguin = c(112, 101, 110, 103, 117, 105, 110);
var turtle = c(116, 117, 114, 116, 108, 101);
var snail = c(115, 110, 97, 105, 108);
var ghost = c(103, 104, 111, 115, 116);
var axolotl = c(97, 120, 111, 108, 111, 116, 108);
var capybara = c(
  99,
  97,
  112,
  121,
  98,
  97,
  114,
  97
);
var cactus = c(99, 97, 99, 116, 117, 115);
var robot = c(114, 111, 98, 111, 116);
var rabbit = c(114, 97, 98, 98, 105, 116);
var mushroom = c(
  109,
  117,
  115,
  104,
  114,
  111,
  111,
  109
);
var chonk = c(99, 104, 111, 110, 107);
var SPECIES = [
  duck,
  goose,
  blob,
  cat,
  dragon,
  octopus,
  owl,
  penguin,
  turtle,
  snail,
  ghost,
  axolotl,
  capybara,
  cactus,
  robot,
  rabbit,
  mushroom,
  chonk
];
var EYES = ["\xB7", "\u2726", "\xD7", "\u25C9", "@", "\xB0"];
var HATS = [
  "none",
  "crown",
  "tophat",
  "propeller",
  "halo",
  "wizard",
  "beanie",
  "tinyduck"
];
var STAT_NAMES = [
  "DEBUGGING",
  "PATIENCE",
  "CHAOS",
  "WISDOM",
  "SNARK"
];
var RARITY_WEIGHTS = {
  common: 60,
  uncommon: 25,
  rare: 10,
  epic: 4,
  legendary: 1
};
var RARITY_STARS = {
  common: "\u2605",
  uncommon: "\u2605\u2605",
  rare: "\u2605\u2605\u2605",
  epic: "\u2605\u2605\u2605\u2605",
  legendary: "\u2605\u2605\u2605\u2605\u2605"
};

// ../feishu-buddy-bot/rollBuddy.ts
function mulberry32(seed) {
  let a = seed >>> 0;
  return function() {
    a |= 0;
    a = a + 1831565813 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function hashString(s) {
  if (typeof Bun !== "undefined") {
    return Number(BigInt(Bun.hash(s)) & 0xffffffffn);
  }
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function pick(rng, arr) {
  return arr[Math.floor(rng() * arr.length)];
}
function rollRarity(rng) {
  const total = Object.values(RARITY_WEIGHTS).reduce((a, b) => a + b, 0);
  let roll2 = rng() * total;
  for (const rarity of RARITIES) {
    roll2 -= RARITY_WEIGHTS[rarity];
    if (roll2 < 0) return rarity;
  }
  return "common";
}
var RARITY_FLOOR = {
  common: 5,
  uncommon: 15,
  rare: 25,
  epic: 35,
  legendary: 50
};
function rollStats(rng, rarity) {
  const floor = RARITY_FLOOR[rarity];
  const peak = pick(rng, STAT_NAMES);
  let dump = pick(rng, STAT_NAMES);
  while (dump === peak) dump = pick(rng, STAT_NAMES);
  const stats = {};
  for (const name of STAT_NAMES) {
    if (name === peak) {
      stats[name] = Math.min(100, floor + 50 + Math.floor(rng() * 30));
    } else if (name === dump) {
      stats[name] = Math.max(1, floor - 10 + Math.floor(rng() * 15));
    } else {
      stats[name] = floor + Math.floor(rng() * 40);
    }
  }
  return stats;
}
var SALT = "friend-2026-401";
function rollFrom(rng) {
  const rarity = rollRarity(rng);
  const bones = {
    rarity,
    species: pick(rng, SPECIES),
    eye: pick(rng, EYES),
    hat: rarity === "common" ? "none" : pick(rng, HATS),
    shiny: rng() < 0.01,
    stats: rollStats(rng, rarity)
  };
  return { bones, inspirationSeed: Math.floor(rng() * 1e9) };
}
var rollCache;
function roll(userId, bonesNonce = 0) {
  const key = bonesNonce === 0 ? userId + SALT : `${userId}${SALT}\0bones:${bonesNonce}`;
  if (rollCache?.key === key) return rollCache.value;
  const value = rollFrom(mulberry32(hashString(key)));
  rollCache = { key, value };
  return value;
}

// ../buddy/sprites.ts
var BODIES = {
  [duck]: [
    [
      "            ",
      "    __      ",
      "  <({E} )___  ",
      "   (  ._>   ",
      "    `--\xB4    "
    ],
    [
      "            ",
      "    __      ",
      "  <({E} )___  ",
      "   (  ._>   ",
      "    `--\xB4~   "
    ],
    [
      "            ",
      "    __      ",
      "  <({E} )___  ",
      "   (  .__>  ",
      "    `--\xB4    "
    ]
  ],
  [goose]: [
    [
      "            ",
      "     ({E}>    ",
      "     ||     ",
      "   _(__)_   ",
      "    ^^^^    "
    ],
    [
      "            ",
      "    ({E}>     ",
      "     ||     ",
      "   _(__)_   ",
      "    ^^^^    "
    ],
    [
      "            ",
      "     ({E}>>   ",
      "     ||     ",
      "   _(__)_   ",
      "    ^^^^    "
    ]
  ],
  [blob]: [
    [
      "            ",
      "   .----.   ",
      "  ( {E}  {E} )  ",
      "  (      )  ",
      "   `----\xB4   "
    ],
    [
      "            ",
      "  .------.  ",
      " (  {E}  {E}  ) ",
      " (        ) ",
      "  `------\xB4  "
    ],
    [
      "            ",
      "    .--.    ",
      "   ({E}  {E})   ",
      "   (    )   ",
      "    `--\xB4    "
    ]
  ],
  [cat]: [
    [
      "            ",
      "   /\\_/\\    ",
      "  ( {E}   {E})  ",
      "  (  \u03C9  )   ",
      '  (")_(")   '
    ],
    [
      "            ",
      "   /\\_/\\    ",
      "  ( {E}   {E})  ",
      "  (  \u03C9  )   ",
      '  (")_(")~  '
    ],
    [
      "            ",
      "   /\\-/\\    ",
      "  ( {E}   {E})  ",
      "  (  \u03C9  )   ",
      '  (")_(")   '
    ]
  ],
  [dragon]: [
    [
      "            ",
      "  /^\\  /^\\  ",
      " <  {E}  {E}  > ",
      " (   ~~   ) ",
      "  `-vvvv-\xB4  "
    ],
    [
      "            ",
      "  /^\\  /^\\  ",
      " <  {E}  {E}  > ",
      " (        ) ",
      "  `-vvvv-\xB4  "
    ],
    [
      "   ~    ~   ",
      "  /^\\  /^\\  ",
      " <  {E}  {E}  > ",
      " (   ~~   ) ",
      "  `-vvvv-\xB4  "
    ]
  ],
  [octopus]: [
    [
      "            ",
      "   .----.   ",
      "  ( {E}  {E} )  ",
      "  (______)  ",
      "  /\\/\\/\\/\\  "
    ],
    [
      "            ",
      "   .----.   ",
      "  ( {E}  {E} )  ",
      "  (______)  ",
      "  \\/\\/\\/\\/  "
    ],
    [
      "     o      ",
      "   .----.   ",
      "  ( {E}  {E} )  ",
      "  (______)  ",
      "  /\\/\\/\\/\\  "
    ]
  ],
  [owl]: [
    [
      "            ",
      "   /\\  /\\   ",
      "  (({E})({E}))  ",
      "  (  ><  )  ",
      "   `----\xB4   "
    ],
    [
      "            ",
      "   /\\  /\\   ",
      "  (({E})({E}))  ",
      "  (  ><  )  ",
      "   .----.   "
    ],
    [
      "            ",
      "   /\\  /\\   ",
      "  (({E})(-))  ",
      "  (  ><  )  ",
      "   `----\xB4   "
    ]
  ],
  [penguin]: [
    [
      "            ",
      "  .---.     ",
      "  ({E}>{E})     ",
      " /(   )\\    ",
      "  `---\xB4     "
    ],
    [
      "            ",
      "  .---.     ",
      "  ({E}>{E})     ",
      " |(   )|    ",
      "  `---\xB4     "
    ],
    [
      "  .---.     ",
      "  ({E}>{E})     ",
      " /(   )\\    ",
      "  `---\xB4     ",
      "   ~ ~      "
    ]
  ],
  [turtle]: [
    [
      "            ",
      "   _,--._   ",
      "  ( {E}  {E} )  ",
      " /[______]\\ ",
      "  ``    ``  "
    ],
    [
      "            ",
      "   _,--._   ",
      "  ( {E}  {E} )  ",
      " /[______]\\ ",
      "   ``  ``   "
    ],
    [
      "            ",
      "   _,--._   ",
      "  ( {E}  {E} )  ",
      " /[======]\\ ",
      "  ``    ``  "
    ]
  ],
  [snail]: [
    [
      "            ",
      " {E}    .--.  ",
      "  \\  ( @ )  ",
      "   \\_`--\xB4   ",
      "  ~~~~~~~   "
    ],
    [
      "            ",
      "  {E}   .--.  ",
      "  |  ( @ )  ",
      "   \\_`--\xB4   ",
      "  ~~~~~~~   "
    ],
    [
      "            ",
      " {E}    .--.  ",
      "  \\  ( @  ) ",
      "   \\_`--\xB4   ",
      "   ~~~~~~   "
    ]
  ],
  [ghost]: [
    [
      "            ",
      "   .----.   ",
      "  / {E}  {E} \\  ",
      "  |      |  ",
      "  ~`~``~`~  "
    ],
    [
      "            ",
      "   .----.   ",
      "  / {E}  {E} \\  ",
      "  |      |  ",
      "  `~`~~`~`  "
    ],
    [
      "    ~  ~    ",
      "   .----.   ",
      "  / {E}  {E} \\  ",
      "  |      |  ",
      "  ~~`~~`~~  "
    ]
  ],
  [axolotl]: [
    [
      "            ",
      "}~(______)~{",
      "}~({E} .. {E})~{",
      "  ( .--. )  ",
      "  (_/  \\_)  "
    ],
    [
      "            ",
      "~}(______){~",
      "~}({E} .. {E}){~",
      "  ( .--. )  ",
      "  (_/  \\_)  "
    ],
    [
      "            ",
      "}~(______)~{",
      "}~({E} .. {E})~{",
      "  (  --  )  ",
      "  ~_/  \\_~  "
    ]
  ],
  [capybara]: [
    [
      "            ",
      "  n______n  ",
      " ( {E}    {E} ) ",
      " (   oo   ) ",
      "  `------\xB4  "
    ],
    [
      "            ",
      "  n______n  ",
      " ( {E}    {E} ) ",
      " (   Oo   ) ",
      "  `------\xB4  "
    ],
    [
      "    ~  ~    ",
      "  u______n  ",
      " ( {E}    {E} ) ",
      " (   oo   ) ",
      "  `------\xB4  "
    ]
  ],
  [cactus]: [
    [
      "            ",
      " n  ____  n ",
      " | |{E}  {E}| | ",
      " |_|    |_| ",
      "   |    |   "
    ],
    [
      "            ",
      "    ____    ",
      " n |{E}  {E}| n ",
      " |_|    |_| ",
      "   |    |   "
    ],
    [
      " n        n ",
      " |  ____  | ",
      " | |{E}  {E}| | ",
      " |_|    |_| ",
      "   |    |   "
    ]
  ],
  [robot]: [
    [
      "            ",
      "   .[||].   ",
      "  [ {E}  {E} ]  ",
      "  [ ==== ]  ",
      "  `------\xB4  "
    ],
    [
      "            ",
      "   .[||].   ",
      "  [ {E}  {E} ]  ",
      "  [ -==- ]  ",
      "  `------\xB4  "
    ],
    [
      "     *      ",
      "   .[||].   ",
      "  [ {E}  {E} ]  ",
      "  [ ==== ]  ",
      "  `------\xB4  "
    ]
  ],
  [rabbit]: [
    [
      "            ",
      "   (\\__/)   ",
      "  ( {E}  {E} )  ",
      " =(  ..  )= ",
      '  (")__(")  '
    ],
    [
      "            ",
      "   (|__/)   ",
      "  ( {E}  {E} )  ",
      " =(  ..  )= ",
      '  (")__(")  '
    ],
    [
      "            ",
      "   (\\__/)   ",
      "  ( {E}  {E} )  ",
      " =( .  . )= ",
      '  (")__(")  '
    ]
  ],
  [mushroom]: [
    [
      "            ",
      " .-o-OO-o-. ",
      "(__________)",
      "   |{E}  {E}|   ",
      "   |____|   "
    ],
    [
      "            ",
      " .-O-oo-O-. ",
      "(__________)",
      "   |{E}  {E}|   ",
      "   |____|   "
    ],
    [
      "   . o  .   ",
      " .-o-OO-o-. ",
      "(__________)",
      "   |{E}  {E}|   ",
      "   |____|   "
    ]
  ],
  [chonk]: [
    [
      "            ",
      "  /\\    /\\  ",
      " ( {E}    {E} ) ",
      " (   ..   ) ",
      "  `------\xB4  "
    ],
    [
      "            ",
      "  /\\    /|  ",
      " ( {E}    {E} ) ",
      " (   ..   ) ",
      "  `------\xB4  "
    ],
    [
      "            ",
      "  /\\    /\\  ",
      " ( {E}    {E} ) ",
      " (   ..   ) ",
      "  `------\xB4~ "
    ]
  ]
};
var HAT_LINES = {
  none: "",
  crown: "   \\^^^/    ",
  tophat: "   [___]    ",
  propeller: "    -+-     ",
  halo: "   (   )    ",
  wizard: "    /^\\     ",
  beanie: "   (___)    ",
  tinyduck: "    ,>      "
};
function renderSprite(bones, frame = 0) {
  const frames = BODIES[bones.species];
  const body = frames[frame % frames.length].map(
    (line) => line.replaceAll("{E}", bones.eye)
  );
  const lines = [...body];
  if (bones.hat !== "none" && !lines[0].trim()) {
    lines[0] = HAT_LINES[bones.hat];
  }
  if (!lines[0].trim() && frames.every((f) => !f[0].trim())) lines.shift();
  return lines;
}
function spriteFrameCount(species) {
  return BODIES[species].length;
}
export {
  RARITY_STARS,
  STAT_NAMES,
  renderSprite,
  roll,
  spriteFrameCount
};
