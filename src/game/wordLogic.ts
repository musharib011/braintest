import { WORD_DATABASE, WordEntry } from './wordDatabase';
import { Difficulty } from './types';

// Letter sets for Word Builder game
export const LETTER_SETS = {
  easy: [
    { letters: ['A', 'T', 'E', 'R', 'S'], minWords: 8 },
    { letters: ['O', 'N', 'E', 'D', 'I'], minWords: 7 },
    { letters: ['L', 'I', 'K', 'E', 'S'], minWords: 6 },
    { letters: ['P', 'A', 'N', 'S', 'T'], minWords: 8 },
    { letters: ['C', 'A', 'R', 'E', 'S'], minWords: 9 },
    { letters: ['H', 'E', 'A', 'R', 'T'], minWords: 7 },
    { letters: ['S', 'T', 'O', 'N', 'E'], minWords: 8 },
    { letters: ['P', 'O', 'S', 'T', 'E'], minWords: 7 },
    { letters: ['R', 'A', 'T', 'E', 'S'], minWords: 9 },
    { letters: ['L', 'A', 'S', 'T', 'E'], minWords: 8 },
  ],
  medium: [
    { letters: ['P', 'L', 'A', 'N', 'E', 'T'], minWords: 10 },
    { letters: ['G', 'A', 'R', 'D', 'E', 'N'], minWords: 12 },
    { letters: ['S', 'C', 'H', 'O', 'O', 'L'], minWords: 8 },
    { letters: ['O', 'R', 'A', 'N', 'G', 'E'], minWords: 11 },
    { letters: ['S', 'T', 'A', 'R', 'S', 'E'], minWords: 13 },
    { letters: ['W', 'A', 'T', 'E', 'R', 'S'], minWords: 12 },
    { letters: ['F', 'L', 'O', 'W', 'E', 'R'], minWords: 10 },
    { letters: ['M', 'O', 'U', 'N', 'T', 'S'], minWords: 9 },
    { letters: ['R', 'I', 'V', 'E', 'R', 'S'], minWords: 11 },
    { letters: ['B', 'E', 'A', 'C', 'H', 'E'], minWords: 10 },
  ],
  hard: [
    { letters: ['A', 'D', 'V', 'E', 'N', 'T', 'U', 'R', 'E'], minWords: 15 },
    { letters: ['K', 'N', 'O', 'W', 'L', 'E', 'D', 'G', 'E'], minWords: 12 },
    { letters: ['I', 'M', 'P', 'O', 'R', 'T', 'A', 'N', 'T'], minWords: 14 },
    { letters: ['B', 'E', 'A', 'U', 'T', 'I', 'F', 'U', 'L'], minWords: 13 },
    { letters: ['E', 'X', 'C', 'E', 'L', 'L', 'E', 'N', 'T'], minWords: 11 },
    { letters: ['C', 'R', 'E', 'A', 'T', 'I', 'V', 'E'], minWords: 12 },
    { letters: ['D', 'I', 'S', 'C', 'O', 'V', 'E', 'R'], minWords: 14 },
    { letters: ['E', 'N', 'V', 'I', 'R', 'O', 'N'], minWords: 10 },
    { letters: ['A', 'C', 'H', 'I', 'E', 'V', 'E'], minWords: 13 },
    { letters: ['C', 'H', 'A', 'L', 'L', 'E', 'N', 'G', 'E'], minWords: 15 },
  ],
  expert: [
    { letters: ['P', 'H', 'O', 'T', 'O', 'S', 'Y', 'N', 'T', 'H'], minWords: 18 },
    { letters: ['M', 'E', 'T', 'A', 'M', 'O', 'R', 'P', 'H'], minWords: 16 },
    { letters: ['B', 'I', 'O', 'D', 'I', 'V', 'E', 'R', 'S'], minWords: 17 },
    { letters: ['T', 'E', 'L', 'E', 'C', 'O', 'M', 'M', 'U'], minWords: 15 },
    { letters: ['A', 'R', 'C', 'H', 'I', 'T', 'E', 'C', 'T'], minWords: 16 },
  ],
};

// Valid words dictionary for Word Builder (common English words)
export const VALID_WORDS = new Set([
  // 3-letter words
  'ACE', 'ACT', 'ADD', 'AGE', 'AID', 'AIM', 'AIR', 'ALL', 'AND', 'ANT', 'ANY', 'APE', 'ARC', 'ARE', 'ARK', 'ARM', 'ART', 'ATE', 'AWE',
  'BAD', 'BAG', 'BAN', 'BAR', 'BAT', 'BED', 'BET', 'BIG', 'BIT', 'BOW', 'BOX', 'BOY', 'BUD', 'BUG', 'BUN', 'BUS', 'BUT', 'BUY',
  'CAB', 'CAN', 'CAP', 'CAR', 'CAT', 'COP', 'COT', 'COW', 'CRY', 'CUB', 'CUP', 'CUR', 'CUT',
  'DAD', 'DAM', 'DAY', 'DEN', 'DEW', 'DID', 'DIG', 'DIM', 'DIP', 'DOG', 'DOT', 'DRY', 'DUB', 'DUD', 'DUE', 'DUG', 'DUN', 'DUO', 'DYE',
  'EAR', 'EAT', 'EEL', 'EGG', 'EGO', 'ELF', 'ELK', 'ELM', 'EMU', 'END', 'ERA', 'EVE', 'EWE', 'EYE',
  'FAD', 'FAN', 'FAR', 'FAT', 'FAX', 'FED', 'FEW', 'FIG', 'FIN', 'FIR', 'FIT', 'FIX', 'FLY', 'FOB', 'FOE', 'FOG', 'FOP', 'FOR', 'FOX', 'FRY', 'FUN', 'FUR',
  'GAB', 'GAG', 'GAP', 'GAS', 'GAY', 'GEL', 'GEM', 'GET', 'GIG', 'GIN', 'GNU', 'GOB', 'GOD', 'GOT', 'GUM', 'GUN', 'GUT', 'GUY', 'GYM',
  'HAD', 'HAM', 'HAS', 'HAT', 'HAY', 'HEN', 'HER', 'HEW', 'HID', 'HIM', 'HIP', 'HIS', 'HIT', 'HOB', 'HOG', 'HOP', 'HOT', 'HOW', 'HUB', 'HUE', 'HUG', 'HUM', 'HUT',
  'ICE', 'ICY', 'ILL', 'IMP', 'INK', 'INN', 'ION', 'IRE', 'IRK', 'ITS', 'IVY',
  'JAB', 'JAG', 'JAM', 'JAR', 'JAW', 'JAY', 'JET', 'JIG', 'JOB', 'JOG', 'JOT', 'JOY', 'JUG', 'JUT',
  'KEG', 'KEN', 'KEY', 'KID', 'KIN', 'KIT',
  'LAB', 'LAD', 'LAG', 'LAP', 'LAW', 'LAY', 'LEA', 'LED', 'LEG', 'LET', 'LID', 'LIE', 'LIP', 'LIT', 'LOG', 'LOT', 'LOW', 'LUG',
  'MAD', 'MAN', 'MAP', 'MAR', 'MAT', 'MAW', 'MAX', 'MAY', 'MEN', 'MET', 'MID', 'MIX', 'MOB', 'MOD', 'MOM', 'MOP', 'MOW', 'MUD', 'MUG', 'MUM',
  'NAB', 'NAG', 'NAP', 'NET', 'NEW', 'NIL', 'NIT', 'NOB', 'NOD', 'NOR', 'NOT', 'NOW', 'NUB', 'NUN', 'NUT',
  'OAF', 'OAK', 'OAR', 'OAT', 'ODD', 'ODE', 'OFF', 'OFT', 'OIL', 'OLD', 'ONE', 'OPT', 'ORB', 'ORE', 'OUR', 'OUT', 'OWE', 'OWL', 'OWN',
  'PAD', 'PAN', 'PAP', 'PAR', 'PAT', 'PAW', 'PAY', 'PEA', 'PEG', 'PEN', 'PEP', 'PER', 'PET', 'PEW', 'PIE', 'PIG', 'PIN', 'PIT', 'PLY', 'POD', 'POP', 'POT', 'POW', 'PRO', 'PRY', 'PUB', 'PUG', 'PUN', 'PUP', 'PUS', 'PUT',
  'RAG', 'RAM', 'RAN', 'RAP', 'RAT', 'RAW', 'RAY', 'RED', 'REF', 'RIB', 'RID', 'RIG', 'RIM', 'RIP', 'ROB', 'ROD', 'ROE', 'ROT', 'ROW', 'RUB', 'RUG', 'RUM', 'RUN', 'RUT',
  'SAD', 'SAG', 'SAP', 'SAT', 'SAW', 'SAY', 'SEA', 'SET', 'SEW', 'SHE', 'SHY', 'SIN', 'SIP', 'SIS', 'SIT', 'SIX', 'SKI', 'SKY', 'SLY', 'SOB', 'SOD', 'SON', 'SOP', 'SOT', 'SOW', 'SOY', 'SPA', 'SPY', 'SUB', 'SUD', 'SUM', 'SUN', 'SUP',
  'TAB', 'TAD', 'TAG', 'TAN', 'TAP', 'TAR', 'TAT', 'TAX', 'TEA', 'TEN', 'THE', 'TIE', 'TIN', 'TIP', 'TOE', 'TON', 'TOO', 'TOP', 'TOW', 'TOY', 'TUB', 'TUG', 'TWO',
  'URN', 'USE',
  'VAN', 'VAT', 'VET', 'VEX', 'VIA', 'VIE', 'VOW',
  'WAD', 'WAG', 'WAR', 'WAS', 'WAX', 'WAY', 'WEB', 'WED', 'WET', 'WHO', 'WHY', 'WIG', 'WIN', 'WIT', 'WOE', 'WOK', 'WON', 'WOO', 'WOW',
  'YAK', 'YAM', 'YAP', 'YAW', 'YEA', 'YES', 'YET', 'YEW', 'YIN', 'YOU', 'YOW',
  'ZAP', 'ZEN', 'ZIP', 'ZIT', 'ZOO',
  
  // 4-letter words
  'ABLE', 'ACHE', 'ACID', 'ACRE', 'AGED', 'AIDE', 'ALSO', 'ARCH', 'AREA', 'ARMY', 'ATOM', 'AUNT', 'AUTO', 'AVER', 'AWAY',
  'BACK', 'BAKE', 'BALD', 'BALL', 'BAND', 'BANG', 'BANK', 'BARE', 'BARK', 'BARN', 'BASE', 'BATH', 'BEAD', 'BEAM', 'BEAN', 'BEAR', 'BEAT', 'BEEF', 'BEEN', 'BEER', 'BELL', 'BELT', 'BEND', 'BENT', 'BEST', 'BIKE', 'BILL', 'BIND', 'BIRD', 'BITE', 'BLOW', 'BLUE', 'BLUR', 'BOAT', 'BODY', 'BOLD', 'BOLT', 'BOMB', 'BOND', 'BONE', 'BOOK', 'BOOT', 'BORE', 'BORN', 'BOSS', 'BOTH', 'BOWL', 'BULK', 'BULL', 'BURN', 'BUSH', 'BUSY',
  'CAFE', 'CAGE', 'CAKE', 'CALL', 'CALM', 'CAME', 'CAMP', 'CAPE', 'CARD', 'CARE', 'CART', 'CASE', 'CASH', 'CAST', 'CAVE', 'CELL', 'CHAT', 'CHIP', 'CHOP', 'CITE', 'CITY', 'CLAD', 'CLAM', 'CLAN', 'CLAP', 'CLAY', 'CLIP', 'CLUB', 'CLUE', 'COAL', 'COAT', 'CODE', 'COIL', 'COIN', 'COLD', 'COME', 'COOK', 'COOL', 'COPE', 'COPY', 'CORD', 'CORE', 'CORK', 'CORN', 'COST', 'CREW', 'CROP', 'CUBE', 'CURE', 'CURL', 'CUTE',
  'DALE', 'DAME', 'DAMP', 'DARE', 'DARK', 'DART', 'DASH', 'DATA', 'DATE', 'DAWN', 'DEAD', 'DEAF', 'DEAL', 'DEAR', 'DEBT', 'DECK', 'DEED', 'DEEM', 'DEEP', 'DEER', 'DEMO', 'DENY', 'DESK', 'DIAL', 'DICE', 'DIET', 'DIRT', 'DISC', 'DISH', 'DOCK', 'DOES', 'DOME', 'DONE', 'DOOM', 'DOOR', 'DOSE', 'DOWN', 'DRAG', 'DRAW', 'DREW', 'DROP', 'DRUG', 'DRUM', 'DUAL', 'DUCK', 'DUEL', 'DULL', 'DUMB', 'DUMP', 'DUNE', 'DUSK', 'DUST', 'DUTY',
  'EACH', 'EARL', 'EARN', 'EASE', 'EAST', 'EASY', 'EDGE', 'EDIT', 'ELSE', 'EMIT', 'EPIC', 'EVEN', 'EVER', 'EVIL', 'EXAM', 'EXEC', 'EXIT', 'EYED',
  'FACE', 'FACT', 'FADE', 'FAIL', 'FAIR', 'FAKE', 'FALL', 'FAME', 'FANG', 'FARE', 'FARM', 'FAST', 'FATE', 'FAWN', 'FEAR', 'FEAT', 'FEED', 'FEEL', 'FEET', 'FELL', 'FELT', 'FEND', 'FILE', 'FILL', 'FILM', 'FIND', 'FINE', 'FIRE', 'FIRM', 'FISH', 'FIST', 'FLAG', 'FLAP', 'FLAT', 'FLAW', 'FLEA', 'FLED', 'FLEW', 'FLIP', 'FLOG', 'FLOW', 'FOAM', 'FOIL', 'FOLD', 'FOLK', 'FOND', 'FONT', 'FOOD', 'FOOL', 'FOOT', 'FORD', 'FORE', 'FORK', 'FORM', 'FORT', 'FOUL', 'FOUR', 'FREE', 'FROM', 'FUEL', 'FULL', 'FUND', 'FURY', 'FUSE', 'FUZZ',
  'GAIN', 'GALE', 'GAME', 'GANG', 'GAPE', 'GARAGE', 'GARB', 'GATE', 'GAVE', 'GAZE', 'GEAR', 'GENE', 'GIFT', 'GILD', 'GIRL', 'GIVE', 'GLAD', 'GLOW', 'GLUE', 'GOAL', 'GOAT', 'GOES', 'GOLD', 'GOLF', 'GONE', 'GOOD', 'GORE', 'GRAB', 'GRAY', 'GREW', 'GRID', 'GRIM', 'GRIP', 'GROW', 'GULF', 'GUST',
  'HACK', 'HAIL', 'HAIR', 'HALE', 'HALF', 'HALL', 'HALT', 'HAND', 'HANG', 'HARD', 'HARE', 'HARM', 'HARP', 'HATE', 'HAUL', 'HAVE', 'HEAD', 'HEAL', 'HEAP', 'HEAR', 'HEAT', 'HEEL', 'HELD', 'HELL', 'HELP', 'HERB', 'HERD', 'HERE', 'HERO', 'HIGH', 'HIKE', 'HILL', 'HINT', 'HIRE', 'HOLD', 'HOLE', 'HOME', 'HOOD', 'HOOK', 'HOPE', 'HORN', 'HOSE', 'HOST', 'HOUR', 'HUGE', 'HULL', 'HUNG', 'HUNT', 'HURT', 'HYMN',
  'IDEA', 'INCH', 'INTO', 'IRON', 'ISLE', 'ITEM',
  'JACK', 'JADE', 'JAIL', 'JAZZ', 'JEAN', 'JERK', 'JEST', 'JILT', 'JINX', 'JIVE', 'JOBS', 'JOIN', 'JOKE', 'JOLT', 'JUDO', 'JUGS', 'JUMP', 'JUNE', 'JUNK', 'JURY', 'JUST',
  'KEEN', 'KEEP', 'KEPT', 'KICK', 'KIDS', 'KILL', 'KIND', 'KING', 'KISS', 'KITE', 'KNEE', 'KNEW', 'KNIT', 'KNOB', 'KNOT', 'KNOW',
  'LACE', 'LACK', 'LAID', 'LAKE', 'LAMB', 'LAME', 'LAMP', 'LAND', 'LANE', 'LARD', 'LARK', 'LASH', 'LAST', 'LATE', 'LAWN', 'LEAD', 'LEAF', 'LEAK', 'LEAN', 'LEAP', 'LEFT', 'LEND', 'LENS', 'LENT', 'LESS', 'LIAR', 'LICK', 'LIED', 'LIFE', 'LIFT', 'LIKE', 'LIMB', 'LIME', 'LIMP', 'LINE', 'LINK', 'LION', 'LIST', 'LIVE', 'LOAD', 'LOAF', 'LOAN', 'LOCK', 'LOFT', 'LOGO', 'LONE', 'LONG', 'LOOK', 'LOOP', 'LORD', 'LORE', 'LOSE', 'LOSS', 'LOST', 'LOUD', 'LOVE', 'LUCK', 'LUMP', 'LUNG', 'LURE', 'LURK', 'LUSH', 'LUST',
  'MACE', 'MADE', 'MAIL', 'MAIN', 'MAKE', 'MALE', 'MALL', 'MALT', 'MANE', 'MANY', 'MARK', 'MARS', 'MASK', 'MASS', 'MAST', 'MATE', 'MAZE', 'MEAL', 'MEAN', 'MEAT', 'MEET', 'MELD', 'MELT', 'MEMO', 'MEND', 'MENU', 'MERE', 'MESH', 'MESS', 'MILD', 'MILE', 'MILK', 'MILL', 'MIND', 'MINE', 'MINT', 'MISS', 'MIST', 'MOAT', 'MOCK', 'MODE', 'MOLD', 'MOLE', 'MOLT', 'MONK', 'MOOD', 'MOON', 'MOOR', 'MORE', 'MOSS', 'MOST', 'MOTH', 'MOVE', 'MUCH', 'MULE', 'MUSE', 'MUSH', 'MUST', 'MUTE',
  'NAIL', 'NAME', 'NAPE', 'NAVY', 'NEAR', 'NEAT', 'NECK', 'NEED', 'NEST', 'NEWS', 'NEXT', 'NICE', 'NINE', 'NODE', 'NONE', 'NOON', 'NORM', 'NOSE', 'NOTE', 'NOUN', 'NUDE',
  'OATH', 'OBEY', 'ODDS', 'OGRE', 'OMEN', 'OMIT', 'ONCE', 'ONLY', 'ONTO', 'OPAL', 'OPEN', 'ORAL', 'OVEN', 'OVER',
  'PACE', 'PACK', 'PADS', 'PAGE', 'PAID', 'PAIL', 'PAIN', 'PAIR', 'PALE', 'PALM', 'PANE', 'PANG', 'PANT', 'PARK', 'PART', 'PASS', 'PAST', 'PATH', 'PAVE', 'PEAK', 'PEAL', 'PEAR', 'PEAT', 'PECK', 'PEEL', 'PEER', 'PELT', 'PEND', 'PENS', 'PERK', 'PEST', 'PICK', 'PIER', 'PIKE', 'PILE', 'PINE', 'PINK', 'PINT', 'PIPE', 'PITY', 'PLAN', 'PLAY', 'PLEA', 'PLOT', 'PLOW', 'PLUG', 'PLUM', 'PLUS', 'POEM', 'POET', 'POLE', 'POLL', 'POLO', 'POND', 'PONY', 'POOL', 'POOR', 'POPE', 'PORK', 'PORT', 'POSE', 'POST', 'POUR', 'PRAY', 'PREY', 'PROP', 'PULL', 'PULP', 'PUMP', 'PUNK', 'PURE', 'PUSH',
  'QUAD', 'QUIT', 'QUIZ', 'QUOTE',
  'RACE', 'RACK', 'RAFT', 'RAGE', 'RAID', 'RAIL', 'RAIN', 'RAKE', 'RAMP', 'RANG', 'RANK', 'RARE', 'RASH', 'RATE', 'RAVE', 'READ', 'REAL', 'REAP', 'REAR', 'REED', 'REEF', 'REEL', 'REIN', 'RELY', 'RENT', 'REST', 'RICH', 'RIDE', 'RIFT', 'RING', 'RIOT', 'RIPE', 'RISE', 'RISK', 'ROAD', 'ROAM', 'ROAR', 'ROBE', 'ROCK', 'RODE', 'ROLE', 'ROLL', 'ROOF', 'ROOM', 'ROOT', 'ROPE', 'ROSE', 'ROSY', 'ROUT', 'RUDE', 'RUIN', 'RULE', 'RUNG', 'RUNS', 'RUSH', 'RUST',
  'SACK', 'SAFE', 'SAGE', 'SAID', 'SAIL', 'SAKE', 'SALE', 'SALT', 'SAME', 'SAND', 'SANE', 'SANG', 'SANK', 'SAVE', 'SCAN', 'SEAL', 'SEAM', 'SEAR', 'SEAT', 'SEED', 'SEEK', 'SEEM', 'SEEN', 'SELF', 'SELL', 'SEND', 'SENT', 'SHED', 'SHIN', 'SHIP', 'SHOE', 'SHOO', 'SHOP', 'SHOT', 'SHOW', 'SHUT', 'SICK', 'SIDE', 'SIFT', 'SIGH', 'SIGN', 'SILK', 'SILL', 'SILO', 'SILT', 'SING', 'SINK', 'SIRE', 'SITE', 'SIZE', 'SKIP', 'SLAB', 'SLAG', 'SLAM', 'SLAP', 'SLAT', 'SLAY', 'SLED', 'SLEW', 'SLID', 'SLIM', 'SLIT', 'SLOB', 'SLOP', 'SLOT', 'SLOW', 'SLUG', 'SLUM', 'SLUR', 'SMOG', 'SNAP', 'SNAG', 'SNIP', 'SNOB', 'SNOW', 'SNUB', 'SNUG', 'SOAK', 'SOAP', 'SOAR', 'SOCK', 'SODA', 'SOFA', 'SOFT', 'SOIL', 'SOLD', 'SOLE', 'SOME', 'SONG', 'SOON', 'SOOT', 'SORE', 'SORT', 'SOUL', 'SOUR', 'SPAN', 'SPAR', 'SPEC', 'SPED', 'SPIN', 'SPIT', 'SPOT', 'SPUR', 'STAB', 'STAR', 'STAY', 'STEM', 'STEP', 'STEW', 'STIR', 'STOP', 'STUB', 'STUD', 'STUN', 'SUCH', 'SUCK', 'SUIT', 'SULK', 'SUMO', 'SUNG', 'SUNK', 'SURE', 'SURF', 'SWAN', 'SWAP', 'SWIM',
  'TACK', 'TACT', 'TAIL', 'TAKE', 'TALE', 'TALK', 'TALL', 'TAME', 'TANG', 'TANK', 'TAPE', 'TAPS', 'TART', 'TASK', 'TAXI', 'TEAM', 'TEAR', 'TELL', 'TEND', 'TENT', 'TERM', 'TEST', 'TEXT', 'THAN', 'THAT', 'THEM', 'THEN', 'THEY', 'THIN', 'THIS', 'THUS', 'TICK', 'TIDE', 'TIDY', 'TIED', 'TIER', 'TILE', 'TILL', 'TILT', 'TIME', 'TINY', 'TIRE', 'TOAD', 'TOIL', 'TOLD', 'TOLL', 'TOMB', 'TONE', 'TOOK', 'TOOL', 'TOPS', 'TORE', 'TORN', 'TORT', 'TOSS', 'TOUR', 'TOWN', 'TRAP', 'TRAY', 'TREE', 'TREK', 'TRIM', 'TRIO', 'TRIP', 'TROD', 'TROT', 'TRUE', 'TUBE', 'TUCK', 'TUNA', 'TUNE', 'TURF', 'TURN', 'TUSK', 'TWIN', 'TYPE',
  'UGLY', 'UNDO', 'UNIT', 'UNTO', 'UPON', 'URGE', 'USED',
  'VAIN', 'VALE', 'VANE', 'VARY', 'VAST', 'VEIL', 'VEIN', 'VENT', 'VERB', 'VERY', 'VEST', 'VETO', 'VICE', 'VIEW', 'VINE', 'VOID', 'VOLT', 'VOTE', 'VOWS',
  'WADE', 'WAGE', 'WAIT', 'WAKE', 'WALK', 'WALL', 'WAND', 'WANT', 'WARD', 'WARM', 'WARN', 'WARP', 'WARY', 'WASH', 'WASP', 'WAVE', 'WAVY', 'WAXY', 'WEAK', 'WEAR', 'WEED', 'WEEK', 'WELL', 'WENT', 'WERE', 'WEST', 'WHAT', 'WHEN', 'WHOM', 'WIDE', 'WIFE', 'WILD', 'WILL', 'WILT', 'WILY', 'WIMP', 'WIND', 'WINE', 'WING', 'WINK', 'WIPE', 'WIRE', 'WISE', 'WISH', 'WITH', 'WOKE', 'WOLF', 'WOMB', 'WOOD', 'WOOL', 'WORD', 'WORE', 'WORK', 'WORM', 'WORN', 'WOVE', 'WRAP',
  'YARD', 'YARN', 'YEAR', 'YELL', 'YOUR',
  'ZEAL', 'ZERO', 'ZEST', 'ZINC', 'ZONE', 'ZOOM',
  
  // 5+ letter words (sample)
  'ABOUT', 'ABOVE', 'ACTOR', 'ADAPT', 'ADMIT', 'ADOPT', 'AFTER', 'AGAIN', 'AGENT', 'AGREE', 'AHEAD', 'ALARM', 'ALBUM', 'ALERT', 'ALIEN', 'ALIGN', 'ALIKE', 'ALIVE', 'ALLEY', 'ALLOW', 'ALONE', 'ALONG', 'ALTER', 'AMONG', 'ANGEL', 'ANGER', 'ANGLE', 'ANGRY', 'APART', 'APPLE', 'APPLY', 'ARENA', 'ARGUE', 'ARISE', 'ASIDE', 'ASSET', 'AVOID', 'AWAKE', 'AWARD', 'AWARE',
  'BADLY', 'BASIC', 'BASIN', 'BATCH', 'BEACH', 'BEGIN', 'BEING', 'BELOW', 'BENCH', 'BIBLE', 'BIRTH', 'BLACK', 'BLADE', 'BLAME', 'BLANK', 'BLAST', 'BLAZE', 'BLEED', 'BLEND', 'BLESS', 'BLIND', 'BLOCK', 'BLOOD', 'BLOWN', 'BOARD', 'BOAST', 'BONUS', 'BOOTH', 'BOUND', 'BRAIN', 'BRAND', 'BRAVE', 'BREAD', 'BREAK', 'BREED', 'BRICK', 'BRIEF', 'BRING', 'BROAD', 'BROKE', 'BROWN', 'BRUSH', 'BUILD', 'BUNCH', 'BURST', 'BUYER',
  'CABIN', 'CANDY', 'CARRY', 'CATCH', 'CAUSE', 'CHAIN', 'CHAIR', 'CHARM', 'CHART', 'CHASE', 'CHEAP', 'CHECK', 'CHEEK', 'CHEER', 'CHESS', 'CHEST', 'CHIEF', 'CHILD', 'CHINA', 'CHOSE', 'CIVIL', 'CLAIM', 'CLASS', 'CLEAN', 'CLEAR', 'CLIMB', 'CLING', 'CLOCK', 'CLONE', 'CLOSE', 'CLOTH', 'CLOUD', 'COACH', 'COAST', 'COULD', 'COUNT', 'COURT', 'COVER', 'CRACK', 'CRAFT', 'CRANE', 'CRASH', 'CRAZY', 'CREAM', 'CRIME', 'CROSS', 'CROWD', 'CROWN', 'CRUDE', 'CURVE', 'CYCLE',
  'DAILY', 'DANCE', 'DEATH', 'DEBUT', 'DELAY', 'DELTA', 'DENSE', 'DEPTH', 'DIRTY', 'DOUBT', 'DOZEN', 'DRAFT', 'DRAIN', 'DRAMA', 'DRANK', 'DRAWN', 'DREAM', 'DRESS', 'DRIED', 'DRIFT', 'DRILL', 'DRINK', 'DRIVE', 'DROVE', 'DYING',
  'EAGER', 'EARLY', 'EARTH', 'EIGHT', 'ELECT', 'ELITE', 'EMPTY', 'ENEMY', 'ENJOY', 'ENTER', 'ENTRY', 'EQUAL', 'ERROR', 'EVENT', 'EVERY', 'EXACT', 'EXIST', 'EXTRA',
  'FAITH', 'FALSE', 'FANCY', 'FATAL', 'FAULT', 'FEAST', 'FENCE', 'FEVER', 'FEWER', 'FIBER', 'FIELD', 'FIFTH', 'FIFTY', 'FIGHT', 'FINAL', 'FIRST', 'FIXED', 'FLAME', 'FLASH', 'FLEET', 'FLESH', 'FLOAT', 'FLOOD', 'FLOOR', 'FLOUR', 'FLUID', 'FLUSH', 'FOCAL', 'FOCUS', 'FORCE', 'FORGE', 'FORTH', 'FORTY', 'FORUM', 'FOUND', 'FRAME', 'FRANK', 'FRAUD', 'FRESH', 'FRONT', 'FROST', 'FROZE', 'FRUIT', 'FULLY', 'FUNNY',
  'GIANT', 'GIVEN', 'GLASS', 'GLOBE', 'GLOOM', 'GLORY', 'GOING', 'GRACE', 'GRADE', 'GRAIN', 'GRAND', 'GRANT', 'GRAPH', 'GRASP', 'GRASS', 'GRAVE', 'GREAT', 'GREEN', 'GREET', 'GRIEF', 'GRILL', 'GRIND', 'GROSS', 'GROUP', 'GROVE', 'GROWN', 'GUARD', 'GUESS', 'GUEST', 'GUIDE', 'GUILT',
  'HAPPY', 'HARSH', 'HASTE', 'HAVEN', 'HEART', 'HEAVY', 'HENCE', 'HERBS', 'HONOR', 'HORSE', 'HOTEL', 'HOUSE', 'HUMAN', 'HUMOR', 'HURRY',
  'IDEAL', 'IMAGE', 'IMPLY', 'INDEX', 'INDIA', 'INNER', 'INPUT', 'ISSUE',
  'JAPAN', 'JEWEL', 'JOINT', 'JUDGE', 'JUICE',
  'KNIFE', 'KNOCK', 'KNOWN',
  'LABEL', 'LABOR', 'LARGE', 'LASER', 'LATER', 'LAUGH', 'LAYER', 'LEARN', 'LEASE', 'LEAST', 'LEAVE', 'LEGAL', 'LEVEL', 'LIGHT', 'LIMIT', 'LINEN', 'LINKS', 'LIVER', 'LOCAL', 'LODGE', 'LOGIC', 'LOOSE', 'LOVER', 'LOWER', 'LOYAL', 'LUCKY', 'LUNCH',
  'MAGIC', 'MAJOR', 'MAKER', 'MARCH', 'MATCH', 'MAYOR', 'MEDAL', 'MERCY', 'MERGE', 'MERIT', 'METAL', 'METER', 'MIGHT', 'MINOR', 'MINUS', 'MIXED', 'MODEL', 'MONEY', 'MONTH', 'MORAL', 'MOTOR', 'MOUNT', 'MOUSE', 'MOUTH', 'MOVED', 'MOVIE', 'MUSIC',
  'NAKED', 'NERVE', 'NEVER', 'NIGHT', 'NOBLE', 'NOISE', 'NORTH', 'NOTED', 'NOVEL', 'NURSE',
  'OCCUR', 'OCEAN', 'OFFER', 'OFTEN', 'ORDER', 'OTHER', 'OUGHT', 'OUTER', 'OWNER',
  'PAINT', 'PANEL', 'PANIC', 'PAPER', 'PARTY', 'PASTA', 'PATCH', 'PAUSE', 'PEACE', 'PEARL', 'PENNY', 'PHASE', 'PHONE', 'PHOTO', 'PIANO', 'PIECE', 'PILOT', 'PITCH', 'PIZZA', 'PLACE', 'PLAIN', 'PLANE', 'PLANT', 'PLATE', 'PLAZA', 'PLEAD', 'PLUCK', 'PLUMB', 'PLUME', 'PLUMP', 'PLUNGE', 'POINT', 'POLAR', 'POUND', 'POWER', 'PRESS', 'PRICE', 'PRIDE', 'PRIME', 'PRINT', 'PRIOR', 'PRIZE', 'PROBE', 'PROOF', 'PROUD', 'PROVE', 'PSALM', 'PULSE', 'PUNCH', 'PUPIL', 'PURSE',
  'QUEEN', 'QUERY', 'QUEST', 'QUEUE', 'QUICK', 'QUIET', 'QUITE', 'QUOTA', 'QUOTE',
  'RADAR', 'RADIO', 'RAISE', 'RALLY', 'RANCH', 'RANGE', 'RAPID', 'RATIO', 'REACH', 'REACT', 'READY', 'REALM', 'REBEL', 'REFER', 'REIGN', 'RELAX', 'REPLY', 'RIDER', 'RIFLE', 'RIGHT', 'RIGID', 'RISKY', 'RIVAL', 'RIVER', 'ROBIN', 'ROBOT', 'ROCKY', 'ROMAN', 'ROOST', 'ROUGH', 'ROUND', 'ROUTE', 'ROYAL', 'RUGBY', 'RULER', 'RURAL',
  'SAINT', 'SALAD', 'SALON', 'SAUCE', 'SCALE', 'SCARE', 'SCENE', 'SCOPE', 'SCORE', 'SCOUT', 'SCRAP', 'SEIZE', 'SENSE', 'SERVE', 'SETUP', 'SEVEN', 'SHALL', 'SHAME', 'SHAPE', 'SHARE', 'SHARP', 'SHEEP', 'SHEER', 'SHEET', 'SHELF', 'SHELL', 'SHIFT', 'SHINE', 'SHIRT', 'SHOCK', 'SHOOT', 'SHORT', 'SHOUT', 'SHOWN', 'SIGHT', 'SINCE', 'SIXTH', 'SIXTY', 'SIZED', 'SKILL', 'SKULL', 'SLAVE', 'SLEEP', 'SLICE', 'SLIDE', 'SLOPE', 'SMALL', 'SMART', 'SMELL', 'SMILE', 'SMOKE', 'SOLAR', 'SOLID', 'SOLVE', 'SORRY', 'SOUND', 'SOUTH', 'SPACE', 'SPARE', 'SPEAK', 'SPEED', 'SPEND', 'SPENT', 'SPICE', 'SPITE', 'SPLIT', 'SPOKE', 'SPORT', 'SPRAY', 'SQUAD', 'STACK', 'STAFF', 'STAGE', 'STAIN', 'STAIR', 'STAKE', 'STALE', 'STALL', 'STAMP', 'STAND', 'STARE', 'START', 'STATE', 'STAYS', 'STEAM', 'STEEL', 'STEEP', 'STEER', 'STERN', 'STICK', 'STIFF', 'STILL', 'STOCK', 'STOLE', 'STONE', 'STOOD', 'STORE', 'STORM', 'STORY', 'STOVE', 'STRAP', 'STRAW', 'STRIP', 'STUCK', 'STUDY', 'STUFF', 'STYLE', 'SUGAR', 'SUITE', 'SUPER', 'SURGE', 'SWAMP', 'SWEAR', 'SWEEP', 'SWEET', 'SWEPT', 'SWIFT', 'SWING', 'SWORD',
  'TABLE', 'TAKEN', 'TASTE', 'TEACH', 'TEETH', 'TEMPO', 'TENSE', 'TERMS', 'THEME', 'THERE', 'THICK', 'THING', 'THINK', 'THIRD', 'THOSE', 'THREE', 'THREW', 'THROW', 'THUMB', 'TIGHT', 'TIMER', 'TIRED', 'TITLE', 'TODAY', 'TOKEN', 'TOTAL', 'TOUCH', 'TOUGH', 'TOWEL', 'TOWER', 'TOXIC', 'TRACE', 'TRACK', 'TRADE', 'TRAIL', 'TRAIN', 'TRAIT', 'TRASH', 'TREAT', 'TREND', 'TRIAL', 'TRIBE', 'TRICK', 'TRIED', 'TROOP', 'TRUCK', 'TRULY', 'TRUNK', 'TRUST', 'TRUTH', 'TUMOR', 'TWICE', 'TWIST',
  'ULTRA', 'UNCLE', 'UNDER', 'UNION', 'UNITE', 'UNITY', 'UNTIL', 'UPPER', 'UPSET', 'URBAN', 'USAGE', 'USUAL', 'UTTER',
  'VALID', 'VALUE', 'VIDEO', 'VIRUS', 'VISIT', 'VITAL', 'VOCAL', 'VOICE', 'VOTER',
  'WASTE', 'WATCH', 'WATER', 'WEIGH', 'WEIRD', 'WHEAT', 'WHEEL', 'WHERE', 'WHICH', 'WHILE', 'WHITE', 'WHOLE', 'WHOSE', 'WOMAN', 'WORLD', 'WORRY', 'WORSE', 'WORST', 'WORTH', 'WOULD', 'WOUND', 'WRITE', 'WRONG', 'WROTE',
  'YIELD', 'YOUNG', 'YOUTH',
]);

// Word Scramble Types
export interface ScrambleGameState {
  currentWord: WordEntry | null;
  scrambledLetters: string[];
  userInput: string;
  score: number;
  combo: number;
  maxCombo: number;
  wordsSolved: number;
  attempts: number;
  maxAttempts: number;
  hintsUsed: number;
  timeElapsed: number;
  gameStarted: boolean;
  gameFinished: boolean;
  difficulty: Difficulty;
  revealedLetters: boolean[];
  showDefinition: boolean;
  perfectRun: boolean;
}

// Word Builder Types
export interface BuilderGameState {
  letters: string[];
  foundWords: string[];
  score: number;
  combo: number;
  maxCombo: number;
  timeElapsed: number;
  timeLimit: number;
  gameStarted: boolean;
  gameFinished: boolean;
  difficulty: Difficulty;
  validWords: string[];
  longestWord: string;
  hintsUsed: number;
  attempts: number;
  perfectRun: boolean;
}

// Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Scramble letters, ensuring result is different from original
export function scrambleWord(word: string): string[] {
  const letters = word.split('');
  let scrambled: string[];
  let attempts = 0;
  
  do {
    scrambled = shuffleArray(letters);
    attempts++;
    // Prevent infinite loop
    if (attempts > 10) break;
  } while (scrambled.join('') === word && word.length > 2);
  
  return scrambled;
}

// Get random word from database
export function getRandomWord(difficulty: Difficulty): WordEntry {
  const words = WORD_DATABASE.filter(w => w.difficulty === difficulty);
  return words[Math.floor(Math.random() * words.length)];
}

// Initialize Word Scramble game
export function createScrambleGameState(difficulty: Difficulty): ScrambleGameState {
  const word = getRandomWord(difficulty);
  return {
    currentWord: word,
    scrambledLetters: scrambleWord(word.word),
    userInput: '',
    score: 0,
    combo: 0,
    maxCombo: 0,
    wordsSolved: 0,
    attempts: 0,
    maxAttempts: 3,
    hintsUsed: 0,
    timeElapsed: 0,
    gameStarted: false,
    gameFinished: false,
    difficulty,
    revealedLetters: new Array(word.word.length).fill(false),
    showDefinition: false,
    perfectRun: true,
  };
}

// Validate answer
export function validateAnswer(userInput: string, correctWord: string): boolean {
  const normalized = userInput.trim().toUpperCase().replace(/\s+/g, '');
  return normalized === correctWord.toUpperCase();
}

// Calculate Word Scramble score
export function calculateScrambleScore(
  word: WordEntry,
  timeElapsed: number,
  attempts: number,
  hintsUsed: number,
  combo: number
): number {
  let baseScore = 100;
  
  // Difficulty multiplier
  const difficultyMultiplier = {
    easy: 1,
    medium: 1.5,
    hard: 2,
    expert: 3,
  }[word.difficulty];
  
  baseScore *= difficultyMultiplier;
  
  // Time bonus (faster = more points)
  const timeBonus = Math.max(0, 50 - timeElapsed);
  baseScore += timeBonus;
  
  // Attempt penalty
  if (attempts > 1) {
    baseScore -= (attempts - 1) * 10;
  }
  
  // Hint penalty
  if (hintsUsed > 0) {
    baseScore -= hintsUsed * 20;
  }
  
  // Combo bonus
  if (combo > 1) {
    baseScore *= 1 + (combo - 1) * 0.1;
  }
  
  return Math.max(10, Math.round(baseScore));
}

// Calculate rewards for Word Scramble
export function calculateScrambleRewards(
  wordsSolved: number,
  score: number,
  difficulty: Difficulty,
  perfectRun: boolean
): { coins: number; xp: number } {
  const baseCoins = wordsSolved * 5;
  const baseXP = wordsSolved * 10;
  
  // Difficulty bonus
  const difficultyBonus = {
    easy: 1,
    medium: 1.5,
    hard: 2,
  }[difficulty];
  
  const coins = Math.round(baseCoins * difficultyBonus);
  const xp = Math.round(baseXP * difficultyBonus);
  
  // Perfect run bonus
  const perfectBonus = perfectRun ? 50 : 0;
  
  return {
    coins: coins + perfectBonus,
    xp: xp + perfectBonus,
  };
}

// Word Builder Functions

// Get letter set for difficulty
export function getLetterSet(difficulty: Difficulty): string[] {
  const sets = LETTER_SETS[difficulty];
  const set = sets[Math.floor(Math.random() * sets.length)];
  return [...set.letters];
}

// Find all valid words that can be made from letters
export function findValidWords(letters: string[]): string[] {
  const letterCount: Record<string, number> = {};
  letters.forEach(l => {
    letterCount[l] = (letterCount[l] || 0) + 1;
  });
  
  const validWords: string[] = [];
  
  VALID_WORDS.forEach(word => {
    if (word.length < 3 || word.length > letters.length) return;
    
    const wordCount: Record<string, number> = {};
    word.split('').forEach(l => {
      wordCount[l] = (wordCount[l] || 0) + 1;
    });
    
    let canMake = true;
    for (const letter in wordCount) {
      if (!letterCount[letter] || wordCount[letter] > letterCount[letter]) {
        canMake = false;
        break;
      }
    }
    
    if (canMake) {
      validWords.push(word);
    }
  });
  
  return validWords;
}

// Initialize Word Builder game
export function createBuilderGameState(difficulty: Difficulty): BuilderGameState {
  const letters = getLetterSet(difficulty);
  const validWords = findValidWords(letters);
  
  const timeLimit = {
    easy: 75,
    medium: 60,
    hard: 45,
  }[difficulty];
  
  return {
    letters,
    foundWords: [],
    score: 0,
    combo: 0,
    maxCombo: 0,
    timeElapsed: 0,
    timeLimit,
    gameStarted: false,
    gameFinished: false,
    difficulty,
    validWords,
    longestWord: '',
    hintsUsed: 0,
    attempts: 0,
    perfectRun: true,
  };
}

// Validate word for Word Builder
export function validateBuilderWord(
  word: string,
  letters: string[],
  foundWords: string[],
  validWords: string[]
): { valid: boolean; message: string } {
  const normalized = word.trim().toUpperCase();
  
  if (normalized.length < 3) {
    return { valid: false, message: 'Word must be at least 3 letters' };
  }
  
  if (foundWords.includes(normalized)) {
    return { valid: false, message: 'Already found!' };
  }
  
  if (!validWords.includes(normalized)) {
    return { valid: false, message: 'Not a valid word' };
  }
  
  // Check if can be made from available letters
  const letterCount: Record<string, number> = {};
  letters.forEach(l => {
    letterCount[l] = (letterCount[l] || 0) + 1;
  });
  
  const wordCount: Record<string, number> = {};
  normalized.split('').forEach(l => {
    wordCount[l] = (wordCount[l] || 0) + 1;
  });
  
  for (const letter in wordCount) {
    if (!letterCount[letter] || wordCount[letter] > letterCount[letter]) {
      return { valid: false, message: 'Cannot make this word' };
    }
  }
  
  return { valid: true, message: 'Valid!' };
}

// Calculate Word Builder score for a word
export function calculateBuilderWordScore(word: string, combo: number): number {
  const length = word.length;
  let baseScore = 0;
  
  if (length === 3) baseScore = 10;
  else if (length === 4) baseScore = 20;
  else if (length === 5) baseScore = 35;
  else if (length === 6) baseScore = 50;
  else baseScore = 75 + (length - 7) * 10;
  
  // Combo bonus
  if (combo > 1) {
    baseScore *= 1 + (combo - 1) * 0.1;
  }
  
  return Math.round(baseScore);
}

// Calculate rewards for Word Builder
export function calculateBuilderRewards(
  wordsFound: number,
  score: number,
  difficulty: Difficulty,
  perfectRun: boolean
): { coins: number; xp: number } {
  const baseCoins = wordsFound * 3;
  const baseXP = wordsFound * 8;
  
  // Difficulty bonus
  const difficultyBonus = {
    easy: 1,
    medium: 1.5,
    hard: 2,
  }[difficulty];
  
  const coins = Math.round(baseCoins * difficultyBonus);
  const xp = Math.round(baseXP * difficultyBonus);
  
  // Perfect run bonus (found 80%+ of valid words)
  const perfectBonus = perfectRun ? 50 : 0;
  
  return {
    coins: coins + perfectBonus,
    xp: xp + perfectBonus,
  };
}
