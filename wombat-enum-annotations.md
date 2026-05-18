# Wombat Engine API — Enum-Annotated Signatures

Functions where at least one integer parameter maps to a named C enumeration or constant group.
Identified by static analysis of `wombat_exec.c` against `wombat-enums.md`.

**Coverage:** 10 functions out of 111 candidates analyzed (652 total engine functions).

---

## Enumerations referenced

- `EventType`
- `ItemFlag`
- `MobileFlag`
- `TIMER_EVENT_*`
- `WTYPE_*`
- `WeaponType_*`

---

## Function signatures

### `isinlist`

**Original C signature:**
```c
int Script_isinlist(CList *list, uintptr_t type, uintptr_t value)
```

**Original Wombat signature:**
```
isInList(list list, any value)
```

**Revised Wombat signature:**
```
isInList(list list, any value)
```

**Enum parameters:**

- `type` → `WTYPE_*`: Type discriminator passed to CList_Find. WTYPE_INT=0, WTYPE_STRING=1, WTYPE_USTRING=2, WTYPE_LOC=3, WTYPE_OBJ=4, WTYPE_LIST=5, WTYPE_VOID=6, WTYPE_UNKNOWN=7.

### `callbackAdvanced`

**Original C signature:**
```c
void Script_callbackAdvanced(uint32_t serial, int delay, int eventType, int callbackId)
```

**Original Wombat signature:**
```
void callbackAdvanced(obj entity, int delay, int eventType, int callbackId)
```

**Revised Wombat signature:**
```
void callbackAdvanced(obj entity, int delay, int eventType /*TIMER_EVENT_**/, int callbackId)
```

**Enum parameters:**

- `eventType` → `TIMER_EVENT_*`: Passed to ScheduleEvent(). TIMER_EVENT_CALLBACK=5, TIMER_EVENT_NPC_TICK=10, etc.

### `removeCallbackAdvanced`

**Original C signature:**
```c
void Script_removeCallbackAdvanced(uint32_t serial, int eventType, int callbackId)
```

**Original Wombat signature:**
```
void removeCallbackAdvanced(obj entity, int eventType, int callbackId)
```

**Revised Wombat signature:**
```
void removeCallbackAdvanced(obj entity, int eventType /*TIMER_EVENT_**/, int callbackId)
```

**Enum parameters:**

- `eventType` → `TIMER_EVENT_*`: Passed to CEntity_RemoveTimer().

### `hasCallbackAdvanced`

**Original C signature:**
```c
int Script_hasCallbackAdvanced(uint32_t serial, int eventType, int callbackId)
```

**Original Wombat signature:**
```
int hasCallbackAdvanced(obj entity, int eventType, int callbackId)
```

**Revised Wombat signature:**
```
int hasCallbackAdvanced(obj entity, int eventType /*EventType*/, int callbackId)
```

**Enum parameters:**

- `eventType` → `EventType`: Passed to CEntity_HasTimerEx(); sparse trigger-slot index.

### `doDamageType`

**Original C signature:**
```c
void Script_doDamageType(uint32_t attacker, uint32_t defender, int damage, int type)
```

**Original Wombat signature:**
```
void doDamageType(obj, obj, int, int)
```

**Revised Wombat signature:**
```
void doDamageType(obj, obj, int, int)
```

**Enum parameters:**

- `type` → `WeaponType_*` *(bitmask)*: Damage category bitmask: Slashing=0x01, Piercing=0x02, Bashing=0x04, Ranged=0x08, Shield=0x10.

### `setMobFlag`

**Original C signature:**
```c
void Script_setMobFlag(uint32_t serial, int flagId, int value)
```

**Original Wombat signature:**
```
void setMobFlag(obj mobile, int flagId, int value)
```

**Revised Wombat signature:**
```
void setMobFlag(obj mobile, int flagId /*MobileFlag bitmask*/, int value)
```

**Enum parameters:**

- `flagId` → `MobileFlag` *(bitmask)*: Flag bit mask passed to CMobile_SetStatusFlag.

### `getMobFlag`

**Original C signature:**
```c
int Script_getMobFlag(uint32_t serial, int flagId)
```

**Original Wombat signature:**
```
int getMobFlag(obj mobile, int flagId)
```

**Revised Wombat signature:**
```
int getMobFlag(obj mobile, int flagId /*MobileFlag bitmask*/)
```

**Enum parameters:**

- `flagId` → `MobileFlag` *(bitmask)*: Flag bit mask passed to CMobile_CheckStatusFlag.

### `getObjectsInRangeWithFlags`

**Original C signature:**
```c
void Script_getObjectsInRangeWithFlags(CList *list, CLocation *loc, int range, int flags)
```

**Original Wombat signature:**
```
void getObjectsInRangeWithFlags(list out, loc center, int range, int flags)
```

**Revised Wombat signature:**
```
void getObjectsInRangeWithFlags(list out, loc center, int range, int flags /*ItemFlag bitmask*/)
```

**Enum parameters:**

- `flags` → `ItemFlag` *(bitmask)*: Tested as (VT_GetFlags(entity) & flags) == flags.

### `getNumAllObjectsInRangeWithFlags`

**Original C signature:**
```c
int Script_getNumAllObjectsInRangeWithFlags(CLocation *loc, int range, int flags)
```

**Original Wombat signature:**
```
int getNumAllObjectsInRangeWithFlags(loc center, int range, int flags)
```

**Revised Wombat signature:**
```
int getNumAllObjectsInRangeWithFlags(loc center, int range, int flags /*ItemFlag bitmask*/)
```

**Enum parameters:**

- `flags` → `ItemFlag` *(bitmask)*: Same ItemFlag bitmask filter, applied to both item and static chains.

### `scriptTrig`

**Original C signature:**
```c
void Script_scriptTrig(uint32_t serial, int trigType, uint32_t objArgSerial)
```

**Original Wombat signature:**
```
void scriptTrig(obj target, int trigType, obj objArg)
```

**Revised Wombat signature:**
```
void scriptTrig(obj target, int trigType /*EventType*/, obj objArg)
```

**Enum parameters:**

- `trigType` → `EventType`: EventType values: GotAttacked=1, KilledTarget=2, WasHit=7, EnterRange=0x10, LeaveRange=0x11, UseItem=0x17, LookedAt=0x1C, StolenFrom=0x3C. Passed to Entity_ExecuteEvent.

---

## Enum definitions

The full enum and constant definitions referenced above are reproduced below for quick lookup.

# Wombat Engine — Enum & Constant Reference

Extracted from `ouo/` source (headers and implementation files).
Comments from the original source are preserved verbatim.

---

## `account.h`

### Line 42 — enum

```c
/*
 * Bit flags for CAccount.flags.
 */
enum AccountFlag {
	ACCT_BANNED = 0x01,
	ACCT_GODMODE = 0x02,
};
```

## `entity.h`

### Line 45 — enum

```c
/*
 * Entity type tags. Binary uses actual vtable pointers (unique per class).
 * VT_ForType() and VT_GetType() convert between ETYPE_* and vtable pointers.
 * Keep in sync with Save dispatch in dynamic.c.
 */
enum EntityTypeTag {
	ETYPE_ITEM = 1,       // @=D (CItem, 0x50 bytes, vtable 0x005EF620)
	ETYPE_CONTAINER = 2,  // @=C (CContainer, 0x5C bytes, vtable 0x005EE888)
	ETYPE_WEAPON = 3,     // @=W (CWeapon, 0x58 bytes, vtable 0x005F00F8)
	ETYPE_MOBILE = 4,     // @=M (CMobile, 0x37C bytes, vtable 0x005EEF48)
	ETYPE_NPC = 5,        // @=N (CNPC, 0x474 bytes, vtable 0x005EF1F8)
	ETYPE_PLAYER = 6,     // @=P (CPlayer, 0x458 bytes, vtable 0x005EEA50)
	ETYPE_SHOPKEEPER = 7, // @=S (shopkeeper NPC, 0x480 bytes, vtable 0x005EFDE8)
	ETYPE_GUARD = 12,     // @=G (guard NPC, same struct as shopkeeper)
	ETYPE_MULTI = 8,      // @=X (CMulti, 0xCC bytes, vtable 0x005EF7C8)
	ETYPE_EGG = 9,        // @=E (CEgg, 0x50 bytes, vtable 0x005EFB38)
	ETYPE_SIGNPOST = 10,  // @=Z (CSignpost, 0x64 bytes, vtable 0x005EF988)
	ETYPE_BOAT = 11,      // @=B (CItem variant, 0x64 bytes)
};
```

### Line 80 — enum

```c
/*
 * Wombat script event types - sparse indices into CScript trigger array
 * (71 slots at offset 0x18). DispatchEvent jump table at 0x0042D7B8.
 * Events > 0x43 fall through to the default handler with no parameters.
 */
enum EventType {
	/* Combat events */
	Speech = 0x00,       /* obj speaker, str text */
	GotAttacked = 0x01,  /* obj attacker */
	KilledTarget = 0x02, /* obj victim */
	Death = 0x04,        /* obj attacker, obj corpse */
	SawDeath = 0x05,     /* obj attacker */
	FightPulse = 0x06,   /* obj opponent */
	WasHit = 0x07,       /* obj attacker, int damage */
	IsHitting = 0x22,    /* obj victim, int damage */
	MobIsHitting = 0x43, /* obj victim, int damage */

	/* Item interaction events */
	UseItem = 0x17,       /* obj user */
	UseObject = 0x33,     /* obj user (ooruse - out-of-range use) */
	LookedAt = 0x1C,      /* obj looker */
	WasDropped = 0x1B,    /* obj user */
	WasGotten = 0x1E,     /* obj user */
	Give = 0x1D,          /* obj givenObj */
	Equip = 0x2C,         /* obj user */
	Unequip = 0x2D,       /* obj user */
	IsStackableOn = 0x2E, /* obj target */
	StackOnto = 0x2F,     /* obj target */

	/* Targeting events */
	TargetObject = 0x18,    /* obj user, obj target */
	TargetLocation = 0x19,  /* obj user, int x, int y, int z */
	TargetObjectPre = 0x38, /* obj user, obj target */

	/* Script/callback events */
	Creation = 0x0F,     /* (filter-based) */
	ObjectLoaded = 0x36, /* (no params) */
	DeleteEntity = 0x2B, /* (no params) */
	Callback = 0x21,     /* int callbackId (filter-based) */
	Message = 0x16,      /* obj arg */

	/* UI events */
	GumpResponse = 0x37,   /* int gumpId, obj user, int button */
	StringResponse = 0x3A, /* obj user, str text */
	PickedObj = 0x24,      /* obj user, int type */
	HueSelected = 0x25,    /* obj user, int hue */

	/* Range events */
	EnterRange = 0x10, /* obj target */
	LeaveRange = 0x11, /* obj target */

	/* Access/snooping */
	ObjAccess = 0x3D,  /* (filter-based) */
	StolenFrom = 0x3C, /* obj thief */

	/* World events */
	LoginAppearance = 0x3F,    /* (no params) */
	CheckTransfer = 0x40,      /* obj player, int flag */
	Transfer = 0x41,           /* obj player, int flag */
	FameChanged = 0x44,        /* (no params) */
	KarmaChanged = 0x45,       /* (no params) */
	MurderCountChanged = 0x46, /* (no params) */

	/* Vendor events */
	Shop = 0x3B,   /* int value */
	CanBuy = 0x42, /* obj buyer, obj vendor, int quantity */
};
```

## `feature.h`

### Line 10 — enum

```c
/*
 * Bitmask selecting which custom server extensions are active. Queried
 * at runtime via feat(FEAT_*); the -features CLI flag writes g_Features.
 */
enum FeatureFlag {
	FEAT_SKILL_LOCK = 1 << 0,
	FEAT_SKILL_MEDITATION = 1 << 1,  // skill 46
	FEAT_SKILL_STEALTH = 1 << 2,     // skill 47
	FEAT_SKILL_REMOVE_TRAP = 1 << 3, // skill 48
	FEAT_ECOLOGY = 1 << 4,
	FEAT_LIGHTS = 1 << 5,
	FEAT_CREATION_COLORS = 1 << 6,
	FEAT_SPAWN_BUDGET = 1 << 7,
	FEAT_SPAWN_STRICT_TAGS = 1 << 8,
	FEAT_SKILL_TRACKING = 1 << 11,
	FEAT_ALL = FEAT_SKILL_LOCK | FEAT_SKILL_MEDITATION | FEAT_SKILL_STEALTH | FEAT_SKILL_REMOVE_TRAP | FEAT_ECOLOGY | FEAT_LIGHTS | FEAT_CREATION_COLORS | FEAT_SPAWN_BUDGET |
	           FEAT_SPAWN_STRICT_TAGS | FEAT_SKILL_TRACKING,
};
```

## `help_queue.c`

### Line 300 — enum

```c
/*
 * Target kinds for GM_TargetSet (.set <target> <value>).
 */
enum {
	SET_STR,
	SET_DEX,
	SET_INT,
	SET_HITS,
	SET_MANA,
	SET_STAM,
	SET_SKILL,
	SET_ALL_SKILLS,
	SET_FAME,
	SET_KARMA,
	SET_MAXHP,
	SET_MAXMANA,
	SET_MAXSTAM,
	SET_STRMOD,
	SET_DEXMOD,
	SET_INTMOD,
	SET_NOTORIETY,
	SET_HUNGER,
	SET_STOMACH,
	SET_SKILLMOD,
	SET_ATTITUDE,
	SET_CHANGEFAME,
	SET_CHANGEKARMA,
	SET_NAC,
	SET_NWC,
	SET_BODY,
	SET_PHUE,
	SET_HOMEX,
	SET_HOMEY,
};
```

### Line 1967 — enum

```c
		enum { WORLDRES_MAX_IDS = 64 };
```

## `item.h`

### Line 69 — enum

```c
/*
 * Bit values for CItem.itemFlags. Bit 0x04 is dual-purpose: stackable
 * for items, open-state for doors and containers.
 */
enum ItemFlag {
	ItemFlag_Invisible = 0x02,     // bit 1: entity is hidden/invisible (0x00486B11)
	ItemFlag_Stackable = 0x04,     // bit 2: stackable item (0x00491260 → 0x00490EF9 → 0x00486B11)
	ItemFlag_Open = 0x04,          // bit 2: open state (doors/containers, 0x00490F0E)
	ItemFlag_Poisoned = 0x08,      // bit 3: weapon poison (runtime); also save skip flag (0x004C8B2D)
	ItemFlag_ServerOnly = 0x10,    // bit 4: server-only, not sent to clients (0x00486AB7)
	ItemFlag_DeletePending = 0x20, // bit 5: marked for deletion
	ItemFlag_Deleted = 0x40,       // bit 6: fully destroyed
};
```

## `mobile.h`

### Line 132 — enum

```c
/*
 * Bits in CMobile.mobileFlags (offset 0x379).
 */
enum MobileFlag {
	MobileFlag_WarMode = 0x40,
};
```

## `npc.h`

### Line 179 — enum

```c
/*
 * NPC AI state tags stored in CNPC.aiState. Case labels mirror
 * GetNPCStateString at 0x004828B0.
 */
enum {
	NPC_STATE_SEEK_FOOD = 0,
	NPC_STATE_SEEK_SHELTER = 1,
	NPC_STATE_PURSE_SHELTER = 2, // sic: "Purse" in binary, likely typo for "Pursue"
	NPC_STATE_SEEK_DESIRES = 3,
	NPC_STATE_PURSE_DESIRES = 4,
	NPC_STATE_EAT_FOOD = 5,
	NPC_STATE_LOITER = 6,
	NPC_STATE_RUNAWAY = 7,
	NPC_STATE_TALKING = 8,
	NPC_STATE_ATTACK_TARGET = 9,
	NPC_STATE_IDLE = 10, // 0x0A - init default
	NPC_STATE_WANDER = 11,
	NPC_STATE_SLEEP = 12,
	NPC_STATE_FOLLOWING = 13,
};
```

## `packet_handler.h`

### Line 17 — enum

```c
/*
 * Inbound packet opcodes, matched by DoHandlePacket_Player and its
 * sibling dispatchers.
 */
enum {
	PacketType_LOGIN = 0x00,
	PacketType_REQ_MOVE = 0x02,
	PacketType_LOGOUT = 0x01,
	PacketType_SPEECH = 0x03,
	PacketType_GODMODE_TOGGLE = 0x04,
	PacketType_ATTACK = 0x05,
	PacketType_REQ_OBJUSE = 0x06,
	PacketType_REQ_GETOBJ = 0x07,
	PacketType_REQ_DROPOBJ = 0x08,
	PacketType_REQ_LOOK = 0x09,
	PacketType_PAPERDOLL = 0x0F, // unimplemented in UoDemo.exe
	PacketType_GODCOMMAND = 0x12,
	PacketType_REQ_OBJEQUIP = 0x13,
	PacketType_OK_MOVE = 0x22,
	PacketType_DEATH = 0x2C,
	PacketType_CLIENTQUERY = 0x34,
	PacketType_MOVEOBJECT = 0x37,
	PacketType_GROUPS = 0x39,
	PacketType_OFFERACCEPT = 0x3B,
	PacketType_CHECK_VER = 0x4B,
	PacketType_POSTMSG = 0x52,
	PacketType_MAP_COMMAND = 0x56,
	PacketType_PRELOGIN = 0x5D,
	PacketType_BOOKPAGE = 0x66,
	PacketType_FRIENDS = 0x69,
	PacketType_KEY_USE = 0x6B,
	PacketType_TARGET = 0x6C,
	PacketType_TRADE = 0x6F,
	PacketType_BBOARD = 0x71,
	PacketType_COMBAT = 0x72,
	PacketType_PING = 0x73,
	PacketType_RENAME_MOB = 0x75,
	PacketType_ResourceQuery = 0x79, // unknown name
	PacketType_PICKEDOBJ = 0x7D,
	PacketType_GodViewQuery = 0x7E, // unknown name
	PacketType_ACCT_LOGIN_REQ = 0x80,
	PacketType_ACCT_DEL_CHAR = 0x83,
	PacketType_CHG_CHAR_PW = 0x84,
	PacketType_SendResources = 0x87, // unknown name
	PacketType_TriggerEdit = 0x8A,   // unknown name
	PacketType_POSTLOGIN = 0x91,
	PacketType_BOOKHDR = 0x93,
	PacketType_HUEPICKER = 0x95,
	PacketType_GameCentMon = 0x96, // unknown name
	PacketType_MOBNAME = 0x98,
	PacketType_TEXT_ENTRY = 0x9A,
	PacketType_REQUEST_ASSIST = 0x9B,
	PacketType_SHOP_OFFER = 0x9F,
	PacketType_BRITANNIA_SELECT = 0xA0,
	PacketType_HARDWARE_INFO = 0xA4,
	PacketType_REQ_TIP = 0xA7,
	PacketType_STRING_RESPONSE = 0xAC,
	PacketType_SPEECH_UNICODE = 0xAD,
	PacketType_GumpMenuSelection = 0xB1, // unknown name
	PacketType_CHAT_TEXT = 0xB3,
	PacketType_CHAT_OPEN = 0xB5,
	PacketType_HELP_REQUEST = 0xB6,
	PacketType_CHAR_PROFILE = 0xB8,
	PacketType_CLIENT_VERSION = 0xBD,

	// GM
	PacketType_EDIT = 0x0A,
	PacketType_TILEDATA = 0x0C,
	PacketType_TEMPLATEDATA = 0x0E,
	PacketType_ELEVCHANGE = 0x14,
	PacketType_NPCCONVO_DATA = 0x19,
	PacketType_DESTROY_OBJECT = 0x1D,
	PacketType_AddResource = 0x35, // unknown name
	PacketType_RESOURCETILEDATA = 0x36,
	PacketType_NEW_ART = 0x46,
	PacketType_NEW_TERR = 0x47,
	PacketType_NEW_ANIM = 0x48,
	PacketType_NEW_HUES = 0x49,
	PacketType_DESTROY_ART = 0x4A,
	PacketType_NEW_REGION = 0x58,
	PacketType_DESTROY_STATIC = 0x61,
	PacketType_MOVESTATIC = 0x62,
	PacketType_SIMPED = 0x67,
	PacketType_RequestAssistance = 0x9C, // unknown name
	PacketType_GMSingle = 0x9D,          // unknown name
};
```

## `packet_manager.h`

### Line 47 — enum

```c
/*
 * Outbound packet opcodes assembled by PacketManager_MakePacket_* helpers.
 * Entries commented client+server also appear in packet_handler.h.
 */
enum {
	PacketType_MOBILESTAT = 0x11,
	PacketType_FOLLOW = 0x15,
	// PacketType_MOVE = 0x1A, // client+server
	PacketType_LOGIN_CONFIRM = 0x1B,
	PacketType_TEXT = 0x1C,
	PacketType_ZMOVE = 0x20,
	PacketType_BLOCKED_MOVE = 0x21,
	// PacketType_OK_MOVE = 0x22, // client+server
	// PacketType_OBJMOVE = 0x23, // client+server
	PacketType_OPEN_GUMP = 0x24,
	PacketType_OBJ_TO_OBJ = 0x25,
	PacketType_GETOBJ_FAILED = 0x27,
	PacketType_DROPOBJ_FAILED = 0x28,
	PacketType_DROPOBJ_OK = 0x29,
	PacketType_GODMODE = 0x2B,
	// PacketType_DEATH = 0x2C, // client+server
	PacketType_HEALTH = 0x2D,
	PacketType_EQUIP_ITEM = 0x2E,
	PacketType_SWING = 0x2F,
	PacketType_ATTACK_OK = 0x30,
	PacketType_ATTACK_END = 0x31,
	PacketType_FOLLOWMOVE = 0x38,
	// PacketType_GROUPS = 0x39, // client+server
	PacketType_SKILLS = 0x3A,
	// PacketType_OFFERACCEPT = 0x3B, // client+server
	PacketType_MULTI_OBJ_TO_OBJ = 0x3C,
	PacketType_VERSIONS = 0x3E,
	PacketType_UPD_OBJCHUNK = 0x3F,
	PacketType_UPD_TERRCHUNK = 0x40,
	PacketType_UPD_TILEDATA = 0x41,
	PacketType_UPD_ART = 0x42,
	PacketType_UPD_ANIM = 0x43,
	PacketType_UPD_HUES = 0x44,
	PacketType_VER_OK = 0x45,
	PacketType_LIGHTCHANGE = 0x4E,
	PacketType_SUNLIGHT = 0x4F,
	PacketType_LOGIN_REJECT = 0x53,
	PacketType_SOUND = 0x54,
	PacketType_LOGIN_COMPLETE = 0x55,
	// PacketType_MAP_COMMAND = 0x56, // client+server
	PacketType_UPD_REGIONS = 0x57,
	PacketType_GAMETIME = 0x5B,
	PacketType_RESTARTVER = 0x5C,
	PacketType_WEATHERCHANGE = 0x65,
	// PacketType_BOOKPAGE = 0x66, // client+server
	// PacketType_FRIENDS = 0x69, // client+server
	PacketType_FRIENDNOTIFY = 0x6A,
	// PacketType_TARGET = 0x6C, // client+server
	PacketType_MUSIC = 0x6D,
	PacketType_ANIM = 0x6E,
	// PacketType_TRADE = 0x6F, // client+server
	PacketType_EFFECT = 0x70,
	// PacketType_BBOARD = 0x71, // client+server
	// PacketType_COMBAT = 0x72, // client+server
	// PacketType_PING = 0x73, // client+server
	PacketType_SHOP_DATA = 0x74,
	PacketType_SERVERCHANGE = 0x76,
	PacketType_NAKED_MOB = 0x77,
	PacketType_EQUIPPED_MOB = 0x78,
	PacketType_SEQUENCE = 0x7B,
	PacketType_OBJPICKER = 0x7C,
	PacketType_ACCT_LOGIN_OK = 0x81,
	PacketType_ACCT_LOGIN_FAIL = 0x82,
	PacketType_CHG_CHAR_RESULT = 0x85,
	PacketType_ALL_CHARACTERS = 0x86,
	PacketType_OPEN_PAPERDOLL = 0x88,
	PacketType_CORPSE_EQ = 0x89,
	PacketType_DISPLAY_SIGN = 0x8B,
	PacketType_USER_SERVER = 0x8C,
	PacketType_OPEN_COURSEGUMP = 0x90,
	PacketType_UPD_MULTI = 0x92,
	// PacketType_BOOKHDR = 0x93, // client+server
	PacketType_UPD_SKILL = 0x94,
	// PacketType_HUEPICKER = 0x95, // client+server
	PacketType_PLAYERMOVE = 0x97,
	// PacketType_MOBNAME = 0x98, // client+server
	PacketType_TARGET_MULTI = 0x99,
	// PacketType_TEXT_ENTRY = 0x9A, // client+server
	PacketType_SHOP_SELL = 0x9E,
	PacketType_HP_HEALTH = 0xA1,
	PacketType_MANA_HEALTH = 0xA2,
	PacketType_FAT_HEALTH = 0xA3,
	PacketType_WEB_BROWSE = 0xA5,
	PacketType_MESSAGE = 0xA6,
	PacketType_BRITANNIA_LIST = 0xA8,
	PacketType_CITIES_AND_CHARS = 0xA9,
	PacketType_CURRENT_TARGET = 0xAA,
	PacketType_STRING_QUERY = 0xAB,
	PacketType_TEXT_UNICODE = 0xAE,
	PacketType_DEATH_ANIM = 0xAF,
	PacketType_GENERIC_GUMP = 0xB0,
	PacketType_CHAT_MSG = 0xB2,
	// PacketType_CHAT_TEXT = 0xB3, // client+server
	PacketType_TARGET_OBJLIST = 0xB4,
	// PacketType_CHAT_OPEN = 0xB5, // client+server
	PacketType_HELP_UNICODE_TEXT = 0xB7,
	// PacketType_CHAR_PROFILE = 0xB8, // client+server
	PacketType_FEATURES = 0xB9,
};
```

## `packet_utils.h`

### Line 6 — enum

```c

enum {
	PacketDynamicSize = 0x8000,
};
```

## `player.h`

### Line 79 — enum

```c
/*
 * Bits of CPlayer.pflags. Checked by CPlayer_IsGameMaster,
 * CPlayer_IsMovePrevented, etc.
 */
enum PlayerFlag {
	PlayerIsMovePrevented = 0x0001, // 0x004536AB: IsMovePrevented(). Set by scripts/spells to freeze.
	PlayerIsEditing = 0x0002,
	PlayerIsOnline = 0x0004,
	PlayerIsLoaded = 0x0008,
	PlayerIsManifesting = 0x0020,
	PlayerSpiritSpeak = 0x0400,
	PlayerIsGameMaster = 0x1000,
	PlayerFlag_0x2000 = 0x2000,
	PlayerIsDead = 0x4000,
	PlayerIsCounselor = 0x8000,
	PlayerIsGold = 0x20000,
};
```

## `resbank.h`

### Line 124 — enum

```c
/*
 * CTemplate field type IDs assigned by LoadTemplates (0x004BE297).
 * CreateEntity dispatches on (fieldType - 1) through the case table at
 * 0x004BE254 / jump table at 0x004BE1D8. Note: "frequency", first
 * "movetype", and "alignment" all collapse to type 40 (0x28), which the
 * case table maps to the default (skip) arm. "sk" and "skill" both map
 * to type 19 - there is no type 20.
 */
enum {
	TMPL_FIELD_ATTITUDE = 1,
	TMPL_FIELD_CONVFRAG = 3,
	TMPL_FIELD_DEXTERITY = 4,
	TMPL_FIELD_EQ = 5,
	TMPL_FIELD_HP = 6,
	TMPL_FIELD_HUE = 7,
	TMPL_FIELD_INTELLIGENCE = 8,
	TMPL_FIELD_MANA = 9,
	TMPL_FIELD_NOTORIETY = 10,
	TMPL_FIELD_FAME = 11,
	TMPL_FIELD_KARMA = 12,
	TMPL_FIELD_NAME = 13,
	TMPL_FIELD_RESOURCE = 14,
	TMPL_FIELD_STRENGTH = 15,
	TMPL_FIELD_SEX = 16,
	TMPL_FIELD_STAMINA = 17,
	TMPL_FIELD_SCRIPT = 18,
	TMPL_FIELD_SKILL = 19,
	TMPL_FIELD_REGION = 21,
	TMPL_FIELD_SFXNOTICE = 22,
	TMPL_FIELD_SFXIDLE = 23,
	TMPL_FIELD_SFXHIT = 24,
	TMPL_FIELD_SFXWASHIT = 25,
	TMPL_FIELD_SFXDIE = 26,
	TMPL_FIELD_MULTI = 27,
	TMPL_FIELD_OBJVAR = 28,
	TMPL_FIELD_QUALITY = 29,
	TMPL_FIELD_QUANTITY = 30,
	TMPL_FIELD_HEIGHT = 31,
	TMPL_FIELD_WEIGHT = 32,
	TMPL_FIELD_NATURALAC = 34,
	TMPL_FIELD_NATURALWC = 35,
	TMPL_FIELD_RESISTANCES = 36,
	TMPL_FIELD_IMMUNITIES = 37,
	TMPL_FIELD_JOB = 38,
	TMPL_FIELD_REGIONLIMIT = 39,
	TMPL_FIELD_FREQUENCY = 40,
	TMPL_FIELD_FRIENDS = 41,
	TMPL_FIELD_MOVETYPE = 42, // dead code: second "movetype" match, unreachable
	TMPL_FIELD_PARTIALHUE = 43,
	TMPL_FIELD_CORPSENAME = 44,
	TMPL_FIELD_FLEEVAL = 45,
	TMPL_FIELD_CREATESNPCS = 46,
	TMPL_FIELD_REQ = 47,
	TMPL_FIELD_REALNAME = 48,
};
```

## `socket.h`

### Line 62 — enum

```c
/*
 * CSocket.status states.
 */
enum {
	SocketClosing = 1,
	SocketClosed = 2,
	SocketThree = 3,
	SocketDestroyed = 5,
};
```

## `terrain.h`

### Line 35 — enum

```c
/*
 * TileDataEntry.flags bits checked by the binary on items.
 */
enum TileFlag {
	TF_ARTICLE_A = 0x00004000,    // "a " article prefix
	TF_ARTICLE_AN = 0x00008000,   // "an " article prefix
	TF_ARTICLE_MASK = 0x0000C000, // both bits: "the " article prefix
	TF_WEAPON = 0x00000002,
	TF_STACKABLE = 0x00000800,
	TF_MAP = 0x00100000,          // map/signpost item
	TF_CONTAINER = 0x00200000,
	TF_EQUIPPABLE = 0x00400000,
	TF_LIGHT = 0x00800000,
	TF_ARMOR = 0x08000000,
	TF_DOOR = 0x20000000,
};
```

### Line 117 — enum

```c
/*
 * Land-section flags from tiledata.mul. Same bit positions overlap with
 * item tiledata flags but live in a separate table.
 */
enum LandTileFlag {
	LTF_IMPASSABLE = 0x00000040,
	LTF_WET = 0x00000080,
};
```

### Line 126 — enum

```c
/*
 * Movement-related item tile flags used by the terrain system. Extends
 * TileFlag above.
 */
enum TerrainTileFlag {
	TF_SURFACE = 0x00000200,
	TF_IMPASSABLE = 0x00000040,
	TF_WET = 0x00000080,
	TF_BRIDGE = 0x00000400,
};
```

## `timer.h`

### Line 38 — #define block

```c

// Event types for ScheduleEvent (0x00436688).
#define TIMER_EVENT_DELETE            1
#define TIMER_EVENT_DECAY_CONTAINER   2
#define TIMER_EVENT_IDLE_DISCONNECT   3
#define TIMER_EVENT_DOOR_CLOSE        4
#define TIMER_EVENT_CALLBACK          5
#define TIMER_EVENT_AI_SCHED_DELETE   6
#define TIMER_EVENT_SPEECH            7
#define TIMER_EVENT_VALUELESS_DECAY   8
#define TIMER_EVENT_ONLINE_CHECK      9
#define TIMER_EVENT_NPC_TICK          10
#define TIMER_EVENT_SET_STRING_PROP   11
#define TIMER_EVENT_WAR_MODE_CLEAR    12
#define TIMER_EVENT_SET_STRING_DETACH 13
#define TIMER_EVENT_UNFREEZE          14
#define TIMER_EVENT_UNSQUELCH         15
#define TIMER_EVENT_CLR_INVULN        16
#define TIMER_EVENT_CRIMINAL          0x11
#define TIMER_EVENT_SET_CHAOS         18
#define TIMER_EVENT_SET_ORDER         19
#define TIMER_EVENT_CTRL_TIMEOUT      20
```

## `twofish.c`

### Line 120 — #define block

```c
/*
 * P_ij permutation choice indices (standard Twofish) used by the
 * h-function at 0x004EB2D0. P_XY selects Q0 or Q1 for byte X at layer Y;
 * layer 0 = MDS precomp, 1 = outermost explicit, 2..4 = inner layers.
 */
#define P_00 1
#define P_01 0
#define P_02 0
#define P_03 1
#define P_04 1
#define P_10 0
#define P_11 0
#define P_12 1
#define P_13 1
#define P_14 0
#define P_20 1
#define P_21 1
#define P_22 0
#define P_23 0
#define P_24 0
#define P_30 0
#define P_31 1
#define P_32 1
#define P_33 0
#define P_34 1
```

### Line 244 — #define block

```c

/* Shift amounts */
#define S11 7
#define S12 12
#define S13 17
#define S14 22
#define S21 5
#define S22 9
#define S23 14
#define S24 20
#define S31 4
#define S32 11
#define S33 16
#define S34 23
#define S41 6
#define S42 10
#define S43 15
#define S44 21
```

## `version.h`

### Line 15 — enum

```c
/*
 * Supported client enum. Each version with distinct cipher keys or
 * packet sizes gets an entry; sub-versions that share keys (e.g.
 * 1.25.35g/h/i, 1.26.0a/b) reuse their base version's entry.
 */
enum {
	CLIENT_DEMO = 0,      // UoDemo.exe - no encryption
	CLIENT_12530 = 1,     // 1.25.30 - single-round (A1=0xF1A372D5, B=0x3A1FD527)
	CLIENT_12531 = 2,     // 1.25.31 - single-round (A1=0x395A647C, B=0x0297BCC6)
	CLIENT_12532 = 3,     // 1.25.32 - single-round (A1=0x389DE58C, B=0x026950C6)
	CLIENT_12533 = 4,
	CLIENT_12534 = 5,     // 1.25.34 - single-round (A1=0x38ECEDAC, B=0x025720C6)
	CLIENT_12535 = 6,     // 1.25.35 - single-round (A1=0x383477BC, B=0x02345CC6)
	CLIENT_12536 = 7,     // 1.25.36 - polynomial cipher
	CLIENT_12537 = 8,     // 1.25.37 - double-round (Win + Linux)
	CLIENT_12600 = 9,     // 1.26.0  - double-round, 1.26+ packets
	CLIENT_12601 = 10,    // 1.26.1 - double-round, 1.26+ packets
	CLIENT_12602 = 11,    // 1.26.2 - double-round, 1.26+ packets
	CLIENT_12603 = 12,    // 1.26.3 - double-round, 1.26+ packets
	CLIENT_12604 = 13,    // 1.26.4 - double-round, 1.26+ packets
	CLIENT_200 = 14,      // 2.0.0 (also 2.0.0a/b) - BF only (UOR)
	CLIENT_200C = 15,     // 2.0.0c (also 2.0.0d-g1) - BF+TF (UOR)
	CLIENT_201 = 16,      // 2.0.1 - BF+TF (UOR)
	CLIENT_202 = 17,      // 2.0.2 - BF+TF (UOR)
	CLIENT_203 = 18,      // 2.0.3 - BF+TF (UOR)
	CLIENT_204 = 19,      // 2.0.4 - TF only (UOR)
	CLIENT_205 = 20,      // 2.0.5 - TF only (UOR)
	CLIENT_206 = 21,      // 2.0.6 - TF only (UOR)
	CLIENT_207 = 22,      // 2.0.7 - TF only (UOR)
	CLIENT_208 = 23,      // 2.0.8 - TF only (UOR)
	CLIENT_GOD208 = 24,   // 2.0.8n GodClient (UOR)
	CLIENT_209 = 25,      // 2.0.9 - TF only (UOR)
	CLIENT_300 = 26,      // 3.0.0 - TF only (TD)
	CLIENT_301 = 27,      // 3.0.1 - TF only (TD)
	CLIENT_302 = 28,      // 3.0.2 - TF only (TD)
	CLIENT_303 = 29,      // 3.0.3 - TF only (TD)
	CLIENT_304 = 30,      // 3.0.4 - TF only (TD)
	CLIENT_305 = 31,      // 3.0.5 - TF only (TD)
	CLIENT_306 = 32,      // 3.0.6 - TF only (TD)
	CLIENT_307 = 33,      // 3.0.7 - TF only (TD)
	CLIENT_308 = 34,      // 3.0.8 - TF only (TD)
	CLIENT_400 = 35,      // 4.0.0 - TF only (AOS)
	CLIENT_401 = 36,      // 4.0.1 - TF only (AOS)
	CLIENT_402 = 37,      // 4.0.2 - TF only (AOS)
	CLIENT_403 = 38,      // 4.0.3 - TF only (AOS)
	CLIENT_404 = 39,      // 4.0.4 - TF only (AOS/SE)
	CLIENT_405 = 40,      // 4.0.5 - TF only (AOS/SE)
	CLIENT_406 = 41,      // 4.0.6 - TF only (AOS/SE)
	CLIENT_407 = 42,      // 4.0.7 - TF only (AOS/SE)
	CLIENT_408 = 43,      // 4.0.8 - TF only (AOS/SE)
	CLIENT_409 = 44,      // 4.0.9 - TF only (AOS/SE)
	CLIENT_4010 = 45,     // 4.0.10 - TF only (AOS/SE)
	CLIENT_4011 = 46,     // 4.0.11 - TF only (AOS/SE)
	CLIENT_500 = 47,      // 5.0.0 - TF only (ML)
	CLIENT_501 = 48,      // 5.0.1 - TF only (ML)
	CLIENT_502 = 49,      // 5.0.2 - TF only (ML)
	CLIENT_503 = 50,      // 5.0.3 - TF only (ML)
	CLIENT_504 = 51,      // 5.0.4 - TF only (ML)
	CLIENT_505 = 52,      // 5.0.5 - TF only (ML)
	CLIENT_506 = 53,      // 5.0.6 - TF only (ML)
	CLIENT_5065 = 54,     // 5.0.6.5 - TF only (ML, A1==A2 aliased)
	CLIENT_507 = 55,      // 5.0.7.x - TF only (ML, A1==A2 aliased)
	CLIENT_508 = 56,      // 5.0.8.x - TF only (ML, A1==A2 aliased)
	CLIENT_509 = 57,      // 5.0.9.x - TF only (ML, A1==A2 aliased)
	CLIENT_126_AUTO = 58, // Auto-detect client version from login packet
};
```

### Line 82 — enum

```c
/*
 * Login-packet cipher family. 1.25.36 uses a completely separate
 * polynomial cipher with six hardcoded constants; every other version
 * uses the XOR-shift LFSR in either single- or double-round form.
 */
enum CipherType {
	CIPHER_NONE = 0,
	CIPHER_SINGLE_ROUND = 1,
	CIPHER_DOUBLE_ROUND = 2,
	CIPHER_POLYNOMIAL = 3,
};
```

### Line 94 — enum

```c
/*
 * Which game-channel cipher the client uses once it reaches the game
 * server: Blowfish, Blowfish + Twofish, or Twofish alone.
 */
enum GameCipher {
	GAME_NONE = 0,
	GAME_BF = 1,
	GAME_BF_TF = 2,
	GAME_TF = 3,
};
```

### Line 105 — enum

```c
/*
 * Packet-layout family. Demo through 1.25.37 share the 1.25 sizes;
 * 1.26.0+ bumps 0x00 (+4), 0x02 (+4), and 0x93 (+1). Everything from
 * 2.0.0 upward keeps the 1.26 packet table.
 */
enum Protocol {
	PROTO_DEMO = 0,
	PROTO_125 = 1,
	PROTO_126 = 2,
};
```

## `vtable.h`

### Line 39 — #define block

```c
// Vtable slot byte offsets (matching binary layout).
// Use VT_FN(ent, VT_SLOT) to get the function pointer.
#define VT_DTOR                    0x000
#define VT_DROP_AT_FEET            0x004
#define VT_SET_LOCATION            0x008
#define VT_HIDE                    0x00C
#define VT_DETACH_SPATIAL          0x010
#define VT_ATTACH_SPATIAL          0x014
#define VT_IS_PLAYER               0x018
#define VT_IS_CONTAINER            0x01C
#define VT_HAS_RESOURCE_FLAG       0x020
#define VT_GET_VALUE               0x024
#define VT_GET_HEIGHT              0x028
#define VT_GET_SURFACE_H           0x02C
#define VT_GET_FLAGS               0x030
#define VT_GET_NAME                0x034
#define VT_IS_HAIR                 0x038
#define VT_REATTACH_SPATIAL        0x03C
#define VT_GET_SURFACE_FLAGS       0x040
#define VT_CHECK_SURFACE           0x044
#define VT_CHECK_SURFACE_OF        0x048
#define VT_SPEAK_SYS_MSG           0x04C
#define VT_SAY_CUSTRING            0x050
#define VT_SAY_CSTRING             0x054
#define VT_EMOTE_CUSTRING          0x058
#define VT_EMOTE_CSTRING           0x05C
#define VT_SAY_HUED_CUSTRING       0x060
#define VT_SAY_HUED_CSTRING        0x064
#define VT_SAY_TO_CUSTRING         0x068
#define VT_SAY_TO_ENTITY           0x06C
#define VT_EMOTE_HUED_CUSTRING     0x070
#define VT_EMOTE_HUED_CSTRING      0x074
#define VT_EMOTE_TO_CUSTRING       0x078
#define VT_EMOTE_TO_ENTITY         0x07C
#define VT_GET_LOCATION            0x080
#define VT_IS_DOOR                 0x084
#define VT_IS_DOOR_NS              0x088
#define VT_DELETE                  0x090
#define VT_GET_MOVEMENT_TYPE       0x094
#define VT_GET_ITEM_AMOUNT         0x098
#define VT_ITEM_CHECK_9C           0x09C
#define VT_GET_RESOURCE_AMT        0x0A0
#define VT_SAVE_TEXT               0x0A4
#define VT_MOVE_TO                 0x0A8
#define VT_RETURN_TO_TRACKED       0x0AC
#define VT_TRANSFER_TO             0x0B0
#define VT_ADD_TO_CONTAINER        0x0B4
#define VT_ADD_TO_CONT_B8          0x0B8
#define VT_ADD_TO_CONT_BC          0x0BC
#define VT_EQUIP_ON_MOBILE         0x0C0
#define VT_ADD_TO_EQUIP            0x0C4
#define VT_SAVE                    0x0C8
#define VT_GET_MONETARY_VAL        0x0CC
#define VT_IS_MOBILE               0x0D0
#define VT_IS_MOBILE2              0x0D4
#define VT_HAS_ACCESSIBLE_CONTENTS 0x0D8
#define VT_CHECK_DC                0x0DC
#define VT_IS_SPATIAL              0x0E0
#define VT_IS_NPC                  0x0E4
#define VT_IS_VENDOR               0x0E8
#define VT_CHECK_EC                0x0EC
#define VT_IS_REMOVED              0x08C
#define VT_IS_DEAD                 0x0F4
#define VT_IS_WEAPON               0x0F8
#define VT_HAS_CORPSE_EQ           0x0FC
#define VT_EXCLUDED_AMOUNT         0x100
#define VT_HAS_CONTAINER           0x104
#define VT_IS_EQUIPPED_ITEM        0x108
#define VT_GET_LAYER               0x10C
#define VT_IS_MOVEABLE             0x110
#define VT_IS_FREELY_USABLE        0x114
#define VT_IS_FREELY_VIEWABLE      0x118
#define VT_IS_IN_WORLD             0x11C
#define VT_GET_WEIGHT              0x120
#define VT_GET_STORED_WEIGHT       0x124
#define VT_MERGE_INTO              0x128
#define VT_GET_NAME_STRING         0x12C
#define VT_NOTIFY_NEARBY           0x130
#define VT_SEND_ENTITY_UPDATE      0x134
#define VT_GET_DIRECTION           0x138
#define VT_GET_CONTAINER_DIM       0x13C
#define VT_SET_SERIAL              0x140
#define VT_DECAY_TICK              0x144
#define VT_DECAY_PLACE             0x148
#define VT_DECAY_RETURN_HOME       0x14C
#define VT_DECAY_CLEANUP           0x150
#define VT_WEIGHT_RELATED          0x154
#define VT_VALIDATE_REG            0x158
#define VT_FIND_IN_WORLD           0x15C
#define VT_COND_VALIDATE           0x160
#define VT_FIND_IN_TAG_LIST        0x164
#define VT_GET_AMOUNT              0x168
#define VT_APPLY_STATUS_FLAGS      0x16C
#define VT_GET_STATUS_FLAGS        0x170
#define VT_IS_HIDDEN               0x174
#define VT_SET_HIDDEN              0x178
#define VT_SET_MURDER_COUNT        0x17C
#define VT_GET_NOTORIETY           0x180
#define VT_REFRESH_AGGRESSION      0x184
#define VT_CAN_BE_FREELY_AGGRESSED 0x188
#define VT_CAN_BE_AGGRESSED        0x18C
#define VT_ADD_TO_AGGRESSOR_LIST   0x190
#define VT_ADD_TO_ATTACKER_LIST    0x194
#define VT_NOTIFY_DAMAGE           0x198
#define VT_FILL_AGGRO_INFO         0x19C
#define VT_FAME_KARMA_CHANGE       0x1A0
#define VT_GET_MAX_WEIGHT          0x1A4
#define VT_EQUIP_DECAY_TICK        0x1A8
#define VT_DELETE_CONTENTS         0x1AC
#define VT_CANCEL_TRADE            0x1B0
#define VT_EQUIP_ITERATE           0x1B4
#define VT_ON_DEATH                0x1B8
#define VT_PRE_DELETE_CLEAN        0x1BC
#define VT_SET_HP                  0x1C0
#define VT_SET_MAX_HP              0x1C4
#define VT_SET_STAMINA             0x1C8
#define VT_SET_MAX_STAMINA         0x1CC
#define VT_SET_MANA                0x1D0
#define VT_SET_MAX_MANA            0x1D4
#define VT_ADD_HP                  0x1D8
#define VT_ADD_MAX_HP              0x1DC
#define VT_ADD_STAMINA             0x1E0
#define VT_ADD_MAX_STAMINA         0x1E4
#define VT_ADD_MANA                0x1E8
#define VT_ADD_MAX_MANA            0x1EC
#define VT_SET_BASE_STAT           0x1F0
#define VT_ADD_BASE_STAT           0x1F4
#define VT_ADD_STAT_BONUS          0x1F8
#define VT_SET_STAT_BONUS          0x1FC
#define VT_SET_NOTORIETY           0x200
#define VT_PAPERDOLL_TITLE         0x204
#define VT_WALK_CHECK              0x208
#define VT_DO_WALK                 0x20C
#define VT_ON_DEATH_WRAP           0x210
#define VT_GET_SPEED               0x214
#define VT_WALK_Z                  0x218
#define VT_GET_STAMINA             0x21C
#define VT_HANDLE_STAM_DRAIN       0x220
#define VT_STAM_REGEN              0x224
#define VT_STAT_CHECK              0x228
#define VT_SEND_HP_UPDATE          0x22C
#define VT_SET_INVULN              0x230
#define VT_CLR_INVULN              0x234
#define VT_ON_STAT_CHANGE          0x238
#define VT_SET_STAT_ABS            0x23C
#define VT_SKILL_GAIN_NOTIFY       0x240
#define VT_TEST_BEHAVIOR           0x244
#define VT_SET_BEHAVIOR            0x248
#define VT_CLR_BEHAVIOR            0x24C
#define VT_KARMA_HANDLER           0x250
```

## `weapon.h`

### Line 15 — enum

```c
/*
 * Bitmask of damage categories set by CWeaponDef_AddType (0x004DE7D2).
 */
enum {
	WeaponType_Slashing = 0x01,
	WeaponType_Piercing = 0x02,
	WeaponType_Bashing = 0x04,
	WeaponType_Ranged = 0x08,
	WeaponType_Shield = 0x10,
};
```

### Line 26 — enum

```c
/*
 * Grip requirement set by CWeaponDef_SetHandedness (0x004DE891).
 */
enum {
	Handedness_None = 0,
	Handedness_Lefthand = 1,
	Handedness_Righthand = 2,
	Handedness_Twohanded = 4,
};
```

## `wombat.h`

### Line 20 — enum

```c
/*
 * Bytecode token type IDs (138 entries, 0x00-0x89). The variant-encoded
 * range uses g_TokenVariantTable; the trigger-name range (0x42-0x88) is
 * compared by string.
 */
enum {
	/* Punctuation / symbols (variant-encoded) */
	SM_LPAREN = 0x02,   /* ( */
	SM_RPAREN = 0x03,   /* ) */
	SM_COMMA = 0x04,    /* , */
	SM_SEMI = 0x06,     /* ; */
	SM_LBRACE = 0x07,   /* { */
	SM_RBRACE = 0x08,   /* } */
	SM_LBRACKET = 0x09, /* [ */
	SM_RBRACKET = 0x0A, /* ] */

	/* Operators (variant-encoded) */
	OP_NOT = 0x0B,    /* ! */
	OP_ADD = 0x0C,    /* + */
	OP_SUB = 0x0D,    /* - */
	OP_MUL = 0x0E,    /* * */
	OP_DIV = 0x0F,    /* / */
	OP_MOD = 0x10,    /* % */
	OP_ISEQ = 0x11,   /* == */
	OP_ISNEQ = 0x12,  /* != */
	OP_LT = 0x13,     /* < */
	OP_GT = 0x14,     /* > */
	OP_LTEQ = 0x15,   /* <= */
	OP_GTEQ = 0x16,   /* >= */
	OP_ASSIGN = 0x17, /* = */
	OP_LOGAND = 0x18, /* && */
	OP_LOGOR = 0x19,  /* || */
	OP_XOR = 0x1A,    /* ^ */
	OP_INC = 0x1B,    /* ++ */
	OP_DEC = 0x1C,    /* -- */

	/* Type keywords (variant-encoded) */
	TK_INT = 0x1D,
	TK_STRING = 0x1E,
	TK_USTRING = 0x1F, /* unsigned string */
	TK_LOC = 0x20,
	TK_OBJ = 0x21,
	TK_LIST = 0x22,
	TK_VOID = 0x23,

	/* Misc (variant-encoded) */
	T_OFFSET = 0x24,

	/* Control flow (variant-encoded) */
	TK_IF = 0x25,
	TK_ELSE = 0x26,
	TK_ENDIF = 0x27,
	TK_WHILE = 0x28,
	TK_ENDWHILE = 0x29,
	TK_FOR = 0x2A,
	TK_ENDFOR = 0x2B,
	TK_CONTINUE = 0x2C,
	TK_BREAK = 0x2D,
	TK_GOTO = 0x2E,
	TK_SWITCH = 0x2F,
	TK_ENDSWITCH = 0x30,
	TK_CASE = 0x31,
	TK_DEFAULT = 0x32,
	TK_RETURN = 0x33,

	/* Top-level declarations (variant-encoded) */
	TK_FUNCTION = 0x34,
	TK_TRIGGER = 0x35,
	TK_MEMBER = 0x36,
	TK_INHERITS = 0x37,
	TK_FORWARD = 0x38,

	/* Data tokens (variant-encoded) */
	T_STR = 0x3A,   /* string literal: 2-byte sdb index follows */
	T_BYTE = 0x3C,  /* 3 bytes inline data follows */
	T_WORD = 0x3D,  /* 4 bytes inline data follows */
	T_DWORD = 0x3E, /* 6 bytes inline data follows */
	T_ID = 0x41,    /* identifier: 2-byte sdb index follows */

	/* Text-based trigger names (string comparison, 0x42..0x88) */
	TR_SPEECH = 0x42,
	TR_GOTATTACKED = 0x43,
	TR_KILLEDTARGET = 0x44,
	TR_AVERSION = 0x45,
	TR_DEATH = 0x46,
	TR_SAWDEATH = 0x47,
	TR_FIGHTPULSE = 0x48,
	TR_WASHIT = 0x49,
	TR_FAILFOOD = 0x4A,
	TR_FAILDESIRE = 0x4B,
	TR_FAILSHELTER = 0x4C,
	TR_FOUNDFOOD = 0x4D,
	TR_FOUNDDESIRE = 0x4E,
	TR_FOUNDSHELTER = 0x4F,
	TR_TIME = 0x50,
	TR_CREATION = 0x51,
	TR_ENTERRANGE = 0x52,
	TR_LEAVERANGE = 0x53,
	TR_LOITER = 0x54,
	TR_SEEKFOOD = 0x55,
	TR_SEEKDESIRE = 0x56,
	TR_SEEKSHELTER = 0x57,
	TR_MESSAGE = 0x58,
	TR_USE = 0x59,
	TR_TARGETOBJ = 0x5A,
	TR_TARGETLOC = 0x5B,
	TR_WEATHER = 0x5C,
	TR_WASDROPPED = 0x5D,
	TR_LOOKEDAT = 0x5E,
	TR_GIVE = 0x5F,
	TR_WASGOTTEN = 0x60,
	TR_PATHFOUND = 0x61,
	TR_PATHNOTFOUND = 0x62,
	TR_CALLBACK = 0x63,
	TR_ISHITTING = 0x64,
	TR_CONVOFUNC = 0x65,
	TR_TYPESELECTED = 0x66,
	TR_HUESELECTED = 0x67,
	TR_MOON = 0x68,
	TR_MINRANGEATTACK = 0x69,
	TR_MINRANGEDEFEND = 0x6A,
	TR_MAXRANGEATTACK = 0x6B,
	TR_MAXRANGEDEFEND = 0x6C,
	TR_DESTROYED = 0x6D,
	TR_EQUIP = 0x6E,
	TR_UNEQUIP = 0x6F,
	TR_ISSTACKABLEON = 0x70,
	TR_STACKONTO = 0x71,
	TR_MULTIRECYCLE = 0x72,
	TR_DECAY = 0x73,
	TR_SERVERSWITCH = 0x74,
	TR_OORUSE = 0x75,
	TR_ACQUIREDESIRE = 0x76,
	TR_LOGOUT = 0x77,
	TR_OBJECTLOADED = 0x78,
	TR_GENERICGUMP = 0x79,
	TR_OORTARGETOBJ = 0x7A,
	TR_PKPOST = 0x7B,
	TR_TEXTENTRY = 0x7C,
	TR_SHOP = 0x7D,
	TR_STOLENFROM = 0x7E,
	TR_OBJACCESS = 0x7F,
	TR_ISHEALTHY = 0x80,
	TR_ONLINE = 0x81,
	TR_TRANSACCOUNTCHECK = 0x82,
	TR_TRANSRESPONSE = 0x83,
	TR_CANBUY = 0x84,
	TR_MOBISHITTING = 0x85,
	TR_FAMECHANGED = 0x86,
	TR_KARMACHANGED = 0x87,
	TR_MURDERCOUNTCHANGED = 0x88,

	TOKEN_TYPE_COUNT = 0x8A, /* g_MaxTokenType + 1 */
};
```

### Line 263 — #define block

```c
/*
 * 0x0042912B - GetTypeId
 *
 * Maps a type keyword in tokenBuf to a type index. Type codes:
 *   0 = int ('i'),  1 = string ('s'), 2 = ustring ('q'),
 *   3 = loc ('c'),  4 = obj ('o'),    5 = list ('l'),
 *   6 = void ('v'), 7 = unknown ('u')
 * Returns 8 (WTYPE_COUNT) when the token does not match any type.
 */
#define WTYPE_INT     0
#define WTYPE_STRING  1
#define WTYPE_USTRING 2
#define WTYPE_LOC     3
#define WTYPE_OBJ     4
#define WTYPE_LIST    5
#define WTYPE_VOID    6
#define WTYPE_UNKNOWN 7
#define WTYPE_COUNT   8
```

### Line 287 — #define block

```c

#define WOMBAT_ARRAY_MAX_DIM   1024
#define WOMBAT_ARRAY_MAX_ID    256
#define WOMBAT_ARRAY_TYPE_INT  0
#define WOMBAT_ARRAY_TYPE_STR  1
#define WOMBAT_ARRAY_TYPE_USTR 2
```

