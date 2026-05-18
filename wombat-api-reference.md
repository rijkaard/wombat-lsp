# Wombat Engine API Reference

Generated from `wombat_exec.c` and `wombat_builtins.inc` (UoDemo.exe, June 1998).

## Type conventions

| Wombat type | C type | Notes |
|------------|--------|-------|
| `void`   | `void` | |
| `int`    | `int32_t` / `uint32_t` | |
| `obj`    | `uint32_t` serial | `this` = serial of the attached entity |
| `string` | `CString *` | |
| `ustring`| `CUString *` | Unicode string |
| `loc`    | `CLocation *` | x/y/z coordinate |
| `list`   | `CList *` | |
| `any`    | (type-tagged union) | Generic list element; return type resolved at compile time |

Wombat convention: `this` is a keyword holding the serial (obj) of the entity to which the script is attached, and is passed explicitly as the first argument to functions that operate on an entity.

---

### Script_abs
**C:** `int Script_abs(int value)`
**Wombat:** `int abs(int value)` _(aliases: [766])_
**Notes:** Returns the absolute value of value.

---

### Script_actionBark
**C:** `void Script_actionBark(uint32_t serial, int hue, CString *text1, CString *text2)`
**Wombat:** `void actionBark(obj player, int hue, string selfText, string otherText)`
**Notes:** Sends `selfText` to the player as a self-message and broadcasts `otherText` to nearby observers, both at the given speech `hue`.

---

### Script_addConsumer
**C:** `void Script_addConsumer(CLocation *loc, int templateIndex, int amount, int templateValue)`
**Wombat:** `void addConsumer(loc position, string templateIndex, int amount, int templateValue)`
**Notes:** Schedules a respawn of `templateIndex` (with `amount` and `templateValue`) at `position` on the resource bank manager. (Note: typeSig `"vCsii"` — second arg dispatched as string in Wombat but used as an index internally.)

---

### Script_addFatigue
**C:** `void Script_addFatigue(uint32_t serial, int amount)`
**Wombat:** `void addFatigue(obj, int)` _(builtin 337)_
**Notes:** Adds `amount` to the mobile's current stamina via `VT_SET_STAMINA`.

---

### Script_addFrag
**C:** `void Script_addFrag(uint32_t serial, CString *fragName)`
**Wombat:** `void addfrag(obj npc, string fragName)` _(aliases: addfrag, addFrag, addfragment, addFragment)_
**Notes:** Adds the named AI fragment to an NPC; entity must be an NPC and not removed from world.

---

### Script_addGlobalQuantity
**C:** `void Script_addGlobalQuantity(uint32_t serial, int quantity)`
**Wombat:** `void addGlobalQuantity(obj entity, int quantity)`
**Notes:** Adds `quantity` to a resource entity in global mode (bypassing the per-region resource bank cap).

---

### Script_addHelpRequestToQueue
**C:** `void Script_addHelpRequestToQueue(uint32_t serial, int hasLevel, uint8_t level, CString *message)`
**Wombat:** `void addHelpRequestToQueue(obj player, int hasLevel, int level, string message)`
**Notes:** Adds a help request to the global help queue; when `hasLevel != 0` the request is enqueued with the explicit `level` value.

---

### Script_addHP
**C:** `void Script_addHP(uint32_t serial, int amount)`
**Wombat:** `void addHP(obj, int)` _(builtin 335)_
**Notes:** Adds `amount` to the mobile's current HP and sends a stat update via `VT_SEND_HP_UPDATE`.

---

### Script_addMana
**C:** `void Script_addMana(uint32_t serial, int amount)`
**Wombat:** `void addMana(obj, int)` _(builtin 336)_
**Notes:** Adds `amount` to the mobile's current mana via `VT_SET_MANA`.

---

### Script_addNotoriety
**C:** `void Script_addNotoriety(uint32_t serial, int amount)`
**Wombat:** `void addNotoriety(obj, int)` _(builtin 298)_
**Notes:** Adds `amount` to the mobile's notoriety via `CMobile_ChangeNotoriety`; values above 255 are silently ignored.

---

### Script_addSatiety
**C:** `void Script_addSatiety(uint32_t serial, int amount)`
**Wombat:** `void addSatiety(obj mobile, int amount)` _(index 386)_
**Notes:** Adds `amount` to `mobile`'s hunger byte, silently ignored when hunger is already at 100.

---

### Script_addSkillLevel
**C:** `void Script_addSkillLevel(uint32_t serial, int skillId, int delta)`
**Wombat:** `void addSkillLevel(obj mobile, int skillId, int delta)` _(index 397)_
**Notes:** Adds `delta` to the mobile's base skill value for `skillId`.

---

### Script_addToObjVarListSet
**C:** `int Script_addToObjVarListSet(uint32_t serial, CString *varname, int typeTag, uintptr_t value)`
**Wombat:** `int addToObjVarListSet(obj entity, string varname, any value)`
**Notes:** Appends `value` to the list-typed ObjVar `varname` unless already present; returns 1 on insert, 0 otherwise.

---

### Script_amtGoldInBank
**C:** `int Script_amtGoldInBank(uint32_t mobileSerial)`
**Wombat:** `int amtGoldInBank(obj mobile)`
**Notes:** Returns the total gold amount in the mobile's bank box, or -1 when the serial is invalid.

---

### Script_animateMobile
**C:** `void Script_animateMobile(uint32_t serial, int animType, int action, int frameCount, int repeat, int backwards)`
**Wombat:** `void animateMobile(obj mobile, int animType, int action, int frameCount, int repeat, int backwards)`
**Notes:** Plays an animation clip on the mobile; either records into an active AnimSequence or broadcasts an ANIM packet to nearby clients. Validates action and frame count limits.

---

### Script_append
**C:** `void Script_append(CList *list, uintptr_t typeTag, uintptr_t value)`
**Wombat:** `void append(list list, any value)` _(aliases: append, appendToList)_
**Notes:** Appends a typed element to the end of `list`.

---

### Script_applyWeaponTemplate
**C:** `int Script_applyWeaponTemplate(uint32_t serial, int templateId)`
**Wombat:** `int applyWeaponTemplate(obj weapon, int templateId)` _(index 608)_
**Notes:** Stamps `weapon` with all values from weapon definition `templateId`; returns 0 when the template is unknown.

---

### Script_areBehaviorsEnabled
**C:** `int Script_areBehaviorsEnabled(uint32_t serial)`
**Wombat:** `int areBehaviorsEnabled(obj npc)`
**Notes:** Returns 1 when the NPC's AI behaviors are active (the disable bit 0x08 is clear).

---

### Script_areMobilesInMultiArea
**C:** `int Script_areMobilesInMultiArea(int multiSerial, CLocation *loc)`
**Wombat:** `int areMobilesInMultiArea(int multiSerial, loc position)`
**Notes:** Returns 1 when any mobile is present within the specified multi's area around `position`.

---

### Script_areObjectsOn
**C:** `int Script_areObjectsOn(uint32_t serial)`
**Wombat:** `int areObjectsOn(obj entity)`
**Notes:** Returns 1 when at least one object exists at the XYZ position immediately above the entity (entity's Z + effective height).

---

### Script_areSpellsOkay
**C:** `int Script_areSpellsOkay(CLocation *loc)`
**Wombat:** `int areSpellsOkay(loc position)`
**Notes:** Returns 1 when the specified location lies in a region that permits spell casting.

---

### Script_attachScript
**C:** `void Script_attachScript(uint32_t serial, CString *scriptName)`
**Wombat:** `void attachscript(obj entity, string scriptName)` _(aliases: attachscript, attachScript)_
**Notes:** Attaches the named script to an entity (fireCreation=1); logs an error if the entity is invalid.

---

### Script_attack
**C:** `void Script_attack(uint32_t attackerSerial, uint32_t victimSerial)`
**Wombat:** `void attack(obj, obj)` _(builtin 611)_
**Notes:** Initiates combat between `attacker` and `victim` via `CombatInitiate`; both must be valid mobiles.

---

### Script_bark
**C:** `void Script_bark(uint32_t serial, CString *text)` (string variant); `void Script_barkUnicode(uint32_t serial, CUString *text)` (unicode variant)
**Wombat:** `void bark(obj entity, string text)` / `void bark(obj entity, ustring text)` _(overloaded on string vs ustring argument)_
**Notes:** Speaks `text` on behalf of the entity; when the entity is held by another player it is delivered as a system message to that player instead of broadcast speech.

---

### Script_barkTo
**C:** `void Script_barkTo(uint32_t speakerSerial, uint32_t targetSerial, CString *text)`
**Wombat:** `void barkTo(obj speaker, obj target, string text)`
**Notes:** Sends `text` as directed speech from `speaker` to a single `target` player using the default speech hue. String variant.

---

### Script_barkToHued
**C:** `void Script_barkToHued(uint32_t speakerSerial, uint32_t targetSerial, int hue, CString *text)`
**Wombat:** `void barkToHued(obj speaker, obj target, int hue, string text)`
**Notes:** Like `barkTo` but uses an explicit speech hue instead of the default. String variant.

---

### Script_barkToHuedUnicode
**C:** `void Script_barkToHuedUnicode(uint32_t speakerSerial, uint32_t targetSerial, int hue, CUString *text)`
**Wombat:** `void barkToHued(obj speaker, obj target, int hue, ustring text)`
**Notes:** Unicode overload of `barkToHued`; directed speech at explicit hue to a single player.

---

### Script_barkToUnicode
**C:** `void Script_barkToUnicode(uint32_t speakerSerial, uint32_t targetSerial, CUString *text)`
**Wombat:** `void barkTo(obj speaker, obj target, ustring text)`
**Notes:** Unicode overload of `barkTo`; directed speech to a single player.

---

### Script_barkUnicode
**C:** `void Script_barkUnicode(uint32_t serial, CUString *text)`
**Wombat:** `void bark(obj entity, ustring text)`
**Notes:** Unicode overload of `bark`; speaks unicode text from the entity, sending it as a unicode system message when the entity is held by a player.

---

### Script_becomeTemplate
**C:** `void Script_becomeTemplate(uint32_t serial, int templateId)`
**Wombat:** `void becomeTemplate(obj serial, int templateId)`
**Notes:** Applies template `templateId` to the mobile, replacing body type, stats, and equipment. _(builtin [486])_

---

### Script_beginSequence
**C:** `void Script_beginSequence(void)`
**Wombat:** `void beginSequence()`
**Notes:** Starts an AnimSequence batch: sets `g_AnimSequence.state` to 1 if it was 0. Subsequent effect calls queue into the sequence rather than being sent immediately.

---

### Script_callback
**C:** `void Script_callback(uint32_t serial, int delay, int callbackId)`
**Wombat:** `void callback(obj entity, int delay, int callbackId)` _(aliases: callback, callBack)_
**Notes:** Schedules event type 5 (callback) on `entity` with a delay of `delay * 4` ticks.

---

### Script_callbackAdvanced
**C:** `void Script_callbackAdvanced(uint32_t serial, int delay, int eventType, int callbackId)`
**Wombat:** `void callbackAdvanced(obj entity, int delay, int eventType, int callbackId)`
**Notes:** Schedules an event of a caller-specified `eventType` (not restricted to type 5) with raw delay.

---

### Script_callGuards
**C:** `void Script_callGuards(uint32_t serial, CLocation *loc, int range)`
**Wombat:** `void callGuards(obj mobile, loc location, int range)`
**Notes:** Summons guards toward `location` within `range` tiles, attributed to the given mobile with no specific target.

---

### Script_callGuards2
**C:** `void Script_callGuards2(uint32_t serial1, uint32_t serial2, int range)`
**Wombat:** `void callGuards(obj caller, obj target, int range)` _(aliases: callGuards)_
**Notes:** Summons guards toward `caller`'s location, attributed to `caller`, targeting `target` within `range`.

---

### Script_canBeFreelyAggressedBy
**C:** `int Script_canBeFreelyAggressedBy(uint32_t victimSerial, uint32_t attackerSerial)`
**Wombat:** `int canBeFreelyAggressedBy(obj victim, obj attacker)` _(aliases: [567])_
**Notes:** Returns 1 if attacker can act aggressively toward victim without triggering criminal flags; missing entities return 1 permissively.

---

### Script_canBeGeneric
**C:** `int Script_canBeGeneric(uint32_t serial)`
**Wombat:** `int canBeGeneric(obj entity)` _(aliases: [703])_
**Notes:** Returns 1 if the entity's tiledata flags include the stackable bit (TF_STACKABLE / 0x800).

---

### Script_canExistAt
**C:** `int Script_canExistAt(CLocation *loc, int currentZ, int stepHeight)`
**Wombat:** `int canExistAt(loc loc, int currentZ, int stepHeight)`
**Notes:** Returns 1 if an entity with the given step height can stand at `loc` starting from `currentZ`. _(builtins [214], [480])_

---

### Script_canHold
**C:** `int Script_canHold(uint32_t containerSerial, uint32_t itemSerial)`
**Wombat:** `int canHold(obj container, obj item)`
**Notes:** Returns 1 if the container can hold the item (calls vtable CanHold); returns 0 if either entity is invalid.

---

### Script_canMultiExistAt
**C:** `int Script_canMultiExistAt(uint32_t serial, CLocation *loc, int moveType)`
**Wombat:** `int canMultiExistAt(obj serial, loc loc, int moveType)`
**Notes:** Checks whether the multi entity can exist at `loc` using the given move type; returns 0 for invalid or non-multi entities. _(builtin [645])_

---

### Script_canSeeLoc
**C:** `int Script_canSeeLoc(uint32_t serial, CLocation *loc)`
**Wombat:** `int canSeeLoc(obj serial, loc loc)`
**Notes:** Returns 1 if the entity has line-of-sight to `loc` via raycast from its eye height. _(builtin [481])_

---

### Script_canSeeObj
**C:** `int Script_canSeeObj(uint32_t serialA, uint32_t serialB)`
**Wombat:** `int canSeeObj(obj serialA, obj serialB)`
**Notes:** Returns 1 if entity A can see entity B (accounts for hidden mobiles; same entity always returns 1). _(builtin [478])_

---

### Script_canWield
**C:** `int Script_canWield(uint32_t mobSerial, uint32_t itemSerial)`
**Wombat:** `int canWield(obj mobile, obj item)` _(index 583)_
**Notes:** Returns 1 when `mobile` can equip `item` in its natural equipment slot.

---

### Script_changeFame
**C:** `void Script_changeFame(uint32_t serial, int amount)`
**Wombat:** `void changeFame(obj, int)` _(builtin 307)_
**Notes:** Adjusts the mobile's fame by a signed `amount` via `CMobile_ChangeFame`.

---

### Script_changeKarma
**C:** `void Script_changeKarma(uint32_t serial, int amount)`
**Wombat:** `void changeKarma(obj, int)` _(builtin 312)_
**Notes:** Adjusts the mobile's karma by a signed `amount` via `CMobile_ChangeKarma`.

---

### Script_changeLoc
**C:** `void Script_changeLoc(CLocation *loc, int dx, int dy, int dz)`
**Wombat:** `void changeLoc(loc* loc, int dx, int dy, int dz)`
**Notes:** Adds `(dx, dy, dz)` to a location variable in place; modifies the location directly via the output-pointer `C` parameter.

---

## Targeting

### Script_changeRange
**C:** `int Script_changeRange(uint32_t serial, int isString, int oldValue, int newValue)`
**Wombat:** `int changeRange(obj entity, int isString, int oldValue, int newValue)`
**Notes:** Searches the entity's ObjVar list for an entry with value `oldValue` and replaces it with `newValue`; `isString=0` targets int ObjVars, nonzero targets string ObjVars; returns 1 on success, 0 on failure.

---

### Script_checkEntity
**C:** `static int Script_checkEntity(uint32_t serial, int (*checker)(CItem *), const char *name)`
**Wombat:** _(no Wombat equivalent — internal static helper)_
**Notes:** Resolves `serial` to a non-removed entity and runs `checker`; returns 0 when the entity is missing or removed.

---

### Script_checkMobile
**C:** `static int Script_checkMobile(uint32_t serial, int (*checker)(CItem *), const char *name)`
**Wombat:** _(no Wombat equivalent — internal static helper)_
**Notes:** Same as `Script_checkEntity` but additionally validates the entity is a mobile (vtable `IsMobile`).

---

### Script_checkPlayer
**C:** `static int Script_checkPlayer(uint32_t serial, int (*checker)(CItem *), const char *name)`
**Wombat:** _(no Wombat equivalent — internal static helper)_
**Notes:** Same as `Script_checkEntity` but additionally validates the entity is a player (vtable `IsPlayer`).

---

## Tracking

### Script_checkTransferAccount
**C:** `void Script_checkTransferAccount(uint32_t sourceSerial, uint32_t targetSerial)`
**Wombat:** `void checkTransferAccount(obj source, obj player)` _(aliases: [739])_
**Notes:** Fires the CheckTransfer event (0x40) on source to validate a cross-shard account transfer.

---

### Script_clearBehavior
**C:** `void Script_clearBehavior(uint32_t serial, int flags)`
**Wombat:** `void clearBehavior(obj npc, int flags)`
**Notes:** Clears (AND-NOT-assigns) the given behavior flag bits on the NPC.

---

### Script_clearlist
**C:** `void Script_clearlist(CList *list)`
**Wombat:** `void clearlist(list list)` _(aliases: clearlist, clearList)_
**Notes:** Removes every element from `list`.

---

### Script_closeGump
**C:** `void Script_closeGump(uint32_t serial, int gumpId)`
**Wombat:** `void closeGump(obj player, int gump_id)`
**Notes:** Closes a gump on the player's client by sending an OPEN_GUMP packet with a zero serial; when `gump_id` is 0x1392, uses serial 0.

---

### Script_committedCrimeAt
**C:** `void Script_committedCrimeAt(uint32_t serial, CLocation *loc, int duration)`
**Wombat:** `void committedCrimeAt(obj mobile, loc location, int duration)` _(aliases: [560])_
**Notes:** Marks the mobile as criminally punishable at loc for duration ticks.

---

### Script_concatList
**C:** `void Script_concatList(CList *dst, CList *src)`
**Wombat:** `void concatList(list dst, list src)`
**Notes:** Appends every element of `src` to `dst`, leaving existing entries in place.

---

### Script_containedBy
**C:** `uint32_t Script_containedBy(uint32_t serial)`
**Wombat:** `obj containedBy(obj entity)`
**Notes:** Returns the parent container's serial when the entity is inside a container, or 0 when on the ground or detached.

---

### Script_containsObj
**C:** `int Script_containsObj(uint32_t containerSerial, uint32_t entitySerial)`
**Wombat:** `int containsObj(obj containerSerial, obj entitySerial)`
**Notes:** Returns 1 if the container (recursively) holds the specified entity. _(builtin [512])_

---

### Script_containsObjType
**C:** `uint32_t Script_containsObjType(uint32_t containerSerial, int type)`
**Wombat:** `obj containsObjType(obj containerSerial, int type)` _(aliases: takeMoney [415])_
**Notes:** Recursively searches the container for an item of the given body type; returns its serial or 0. _(builtins [513], [415])_

---

### Script_copyAllObjVars
**C:** `void Script_copyAllObjVars(uint32_t destSerial, uint32_t srcSerial)`
**Wombat:** `void copyAllObjVars(obj dest, obj src)`
**Notes:** Copies every ObjVar from `src` onto `dest`; no-op when either entity is invalid or `src == dest`.

---

### Script_copybook
**C:** `int Script_copybook(uint32_t srcSerial, uint32_t dstSerial)`
**Wombat:** `int copybook(obj src, obj dst)`
**Notes:** Copies the source writable book's pages into the destination book; returns 0 when either serial is invalid, both are the same, or the destination is read-only.

---

### Script_copyControllerInfo
**C:** `void Script_copyControllerInfo(uint32_t controlledSerial, uint32_t controllerSerial)`
**Wombat:** `void copyControllerInfo(obj controlled, obj controller)` _(aliases: [572])_
**Notes:** Copies the controller's identity (serial, name, guild info) to the controlled entity and detaches the "defensive" script from it.

---

### Script_copylist
**C:** `void Script_copylist(CList *dst, CList *src)`
**Wombat:** `void copylist(list dst, list src)` _(aliases: copylist, copyList)_
**Notes:** Replaces the contents of `dst` with a shallow copy of every entry from `src`.

---

### Script_copyObjVar
**C:** `void Script_copyObjVar(uint32_t destSerial, uint32_t srcSerial, CString *varname)`
**Wombat:** `void copyObjVar(obj dest, obj src, string varname)`
**Notes:** Copies the named ObjVar from `src` to `dest`; no-op when either entity is invalid or `src == dest`.

---

### Script_createGlobalNPCAt
**C:** `uint32_t Script_createGlobalNPCAt(uint32_t templateId, CLocation *loc, int flags)`
**Wombat:** `obj createGlobalNPCAt(int templateId, loc location, int flags)` _(aliases: [685])_
**Notes:** Spawns NPC template near loc using the resource-bank spiral search; returns new mobile serial or 0 on failure.

---

### Script_createGlobalNPCAtSpecificLoc
**C:** `uint32_t Script_createGlobalNPCAtSpecificLoc(int templateId, CLocation *loc)`
**Wombat:** `obj createGlobalNPCAtSpecificLoc(int templateId, loc location)` _(aliases: [686])_
**Notes:** Spawns NPC template at the exact loc given (no spiral search); returns new mobile serial or 0 if loc/template invalid.

---

### Script_createGlobalObjectAt
**C:** `uint32_t Script_createGlobalObjectAt(int artId, CLocation *loc)`
**Wombat:** `obj createGlobalObjectAt(int artId, loc position)`
**Notes:** Creates an item of art ID `artId` at `position` in global resource mode with the tiledata default hue; returns the new serial, or 0 on failure.

---

### Script_createGlobalObjectIn
**C:** `uint32_t Script_createGlobalObjectIn(int artId, uint32_t containerSerial)`
**Wombat:** `obj createGlobalObjectIn(int artId, obj container)`
**Notes:** Creates an item of art ID `artId` inside `container` in global resource mode; returns the new serial, or 0 on failure.

---

### Script_createGlobalObjectOn
**C:** `uint32_t Script_createGlobalObjectOn(uint32_t entitySerial, int artId)`
**Wombat:** `obj createGlobalObjectOn(obj entity, int artId)`
**Notes:** Creates an item of art ID `artId` next to `entity`: inside the entity's parent container when it is contained but not equipped, otherwise at the entity's world location.

---

### Script_createNoResObjectAt
**C:** `uint32_t Script_createNoResObjectAt(int artId, CLocation *loc)`
**Wombat:** `obj createNoResObjectAt(int artId, loc position)`
**Notes:** Like `createGlobalObjectAt` but skips the `CItem_Setup` resource initialization step; the item carries no resource node.

---

### Script_createNoResObjectIn
**C:** `uint32_t Script_createNoResObjectIn(int artId, uint32_t containerSerial)`
**Wombat:** `obj createNoResObjectIn(int artId, obj container)`
**Notes:** Like `createGlobalObjectIn` but skips resource initialization; the item carries no resource node.

---

### Script_createStatic
**C:** `void Script_createStatic(CLocation *loc, int typeID)`
**Wombat:** `void createStatic(loc position, int typeID)`
**Notes:** Creates a new static entity at `position` with the given graphic type ID; `typeID` must be in [0, 0x4000).

---

### Script_createStaticHued
**C:** `void Script_createStaticHued(CLocation *loc, int typeID, int hue)`
**Wombat:** `void createStaticHued(loc location, int typeID, int hue)` _(aliases: [762])_
**Notes:** Same as createStatic but also applies the given hue/color to the static entity.

---

### Script_criminalAct
**C:** `void Script_criminalAct(uint32_t criminalSerial, uint32_t victimSerial, int fameAmount, int crimeWeight)`
**Wombat:** `void criminalAct(obj criminal, obj victim, int fameAmount, int crimeWeight)` _(aliases: [558])_
**Notes:** Notifies the system of a criminal act; drops notoriety if victim is invalid, otherwise calls the crime notification stub.

---

### Script_criminalActAdvanced
**C:** `void Script_criminalActAdvanced(uint32_t criminalSerial, uint32_t victimSerial, int fameAmount, int crimeWeight, int bound, int flags)`
**Wombat:** `void criminalActAdvanced(obj criminal, obj victim, int fameAmount, int crimeWeight, int bound, int flags)`
**Notes:** Like `criminalAct` but passes additional `bound` and `flags` parameters to the crime notification system.

---

### Script_debugMessage
**C:** `void Script_debugMessage(CString *message)`
**Wombat:** `void debugMessage(string message)`
**Notes:** Sends `message` as a system message to the player registered as the current entity's "debugger" ObjVar; no-op if no debugger is set. _(builtin [508])_

---

### Script_defineResource
**C:** `int Script_defineResource(uint32_t serial, CString *resourceName, int type, int value1, int value2)`
**Wombat:** `int defineResource(obj entity, string resourceName, int type, int value1, int value2)`
**Notes:** Adds a resource node of the named type to the entity with category `type` (0, 1, or 2) and counters `value1`/`value2`; always returns 0 (matching binary behaviour).

---

### Script_deleteArray
**C:** `void Script_deleteArray(int id)`
**Wombat:** `void deleteArray(int id)`
**Notes:** Deletes the array with the given ID, freeing all its data.

---

### Script_deleteIfValid
**C:** `void Script_deleteIfValid(uint32_t serial, int bodyType)`
**Wombat:** `void deleteIfValid(obj entity, int bodyType)`
**Notes:** Deletes the entity only when its body type matches `bodyType`; refreshes any items that were resting on top of it afterward.

---

### Script_deleteIfValidNoFall
**C:** `void Script_deleteIfValidNoFall(uint32_t serial, int bodyType)`
**Wombat:** `void deleteIfValidNoFall(obj entity, int bodyType)`
**Notes:** Like `deleteIfValid` but does not refresh items that were resting on top of the deleted entity.

---

### Script_deleteObject
**C:** `void Script_deleteObject(uint32_t serial)`
**Wombat:** `void deleteObject(obj entity)`
**Notes:** Deletes the entity and refreshes nearby clients; players are silently protected from deletion.

---

### Script_deleteObjectNoFall
**C:** `void Script_deleteObjectNoFall(uint32_t serial)`
**Wombat:** `void deleteObjectNoFall(obj entity)`
**Notes:** Like `deleteObject` but skips post-delete spatial notifications (no item-fall physics); players are protected.

---

### Script_depositIntoBank
**C:** `int Script_depositIntoBank(uint32_t mobileSerial, uint32_t entitySerial, int amount)`
**Wombat:** `int depositIntoBank(obj mobile, obj entity, int amount)`
**Notes:** Deposits `entity` into the mobile's bank box; returns 2 on invalid arguments, otherwise passes through the bank-deposit result code.

---

### Script_destroyContents
**C:** `void Script_destroyContents(uint32_t containerSerial)`
**Wombat:** `void destroyContents(obj container)` _(aliases: [736])_
**Notes:** Recursively deletes every item inside the container, broadcasting DESTROY_OBJECT to nearby clients.

---

### Script_destroyGeneric
**C:** `void Script_destroyGeneric(uint32_t mobileSerial, uint32_t itemType, uint32_t count)`
**Wombat:** `void destroyGeneric(obj mobile, int item_type, int count)`
**Notes:** Removes `count` units of the stackable type `item_type` from `mobile`'s equipment and deletes the resulting stack outright.

---

### Script_destroyOne
**C:** `void Script_destroyOne(uint32_t serial)`
**Wombat:** `void destroyOne(obj entity)`
**Notes:** Removes a single unit of the entity: stackable resources have one quantum consumed, non-stackable items are deleted outright; items resting on top are refreshed.

---

### Script_detachScript
**C:** `void Script_detachScript(uint32_t serial, CString *scriptName)`
**Wombat:** `void detachscript(obj entity, string scriptName)` _(aliases: detachscript, detachScript)_
**Notes:** Stops running threads for the named script on this entity, then removes the script attachment.

---

## Container / Equipment Queries

### Script_dice
**C:** `int Script_dice(int numDice, int numSides)`
**Wombat:** `int dice(int numDice, int numSides)`
**Notes:** Rolls `numDice` dice each with `numSides` sides and returns the sum.

---

### Script_disableBehaviors
**C:** `void Script_disableBehaviors(uint32_t serial)`
**Wombat:** `void disableBehaviors(obj npc)`
**Notes:** Sets all NPC behavior flags (0x1003F) to disable the entity's automatic AI behaviors.

---

### Script_doDamage
**C:** `void Script_doDamage(uint32_t attacker, uint32_t defender, int damage)`
**Wombat:** `void doDamage(obj, obj, int)` _(builtin 339)_
**Notes:** Applies `damage` from `attacker` to `defender` with no specific weapon, combat initiation enabled; delegates to `doDamageCore` with `weaponSerial=0` and `damageType=0`.

---

### Script_doDamageFight
**C:** `void Script_doDamageFight(uint32_t attacker, uint32_t defender, int damage, int flag)`
**Wombat:** `void doDamageFight(obj, obj, int, int)` _(builtin 340)_
**Notes:** Applies `damage` from `attacker` to `defender`; `flag` controls whether the hit also starts combat between them (1 = initiate, 0 = skip).

---

### Script_doDamageType
**C:** `void Script_doDamageType(uint32_t attacker, uint32_t defender, int damage, int type)`
**Wombat:** `void doDamageType(obj, obj, int, int)` _(builtin 341)_
**Notes:** Applies typed damage from `attacker` to `defender` with combat initiation enabled; `type` is passed as the damage type to `Combat_DamageResolve`.

---

### Script_doDamageWithWeapon
**C:** `void Script_doDamageWithWeapon(uint32_t attacker, uint32_t defender, uint32_t weapon, int damage)`
**Wombat:** `void doDamageWithWeapon(obj, obj, obj, int)` _(builtin 338)_
**Notes:** Applies `damage` from `attacker` to `defender` using `weapon`, with combat initiation enabled; delegates to `doDamageCore`. Binary bug in `doDamageCore`: weapon lookup passes `defenderSerial` instead of `weaponSerial`.

---

### Script_doLightning
**C:** `void Script_doLightning(uint32_t serial)`
**Wombat:** `void doLightning(obj mobile)`
**Notes:** Plays a lightning bolt effect at the mobile's location (EFFECT packet type 1); supports AnimSequence batching (AnimSequence type 2).

---

### Script_doLocAnimation
**C:** `void Script_doLocAnimation(CLocation *loc, int effectId, int speed, int duration, int hue, int renderMode)`
**Wombat:** `void doLocAnimation(loc position, int effect_id, int speed, int duration, int hue, int render_mode)`
**Notes:** Plays a stationary graphical effect at a map location; supports AnimSequence batching (AnimSequence type 0).

---

### Script_doLookAt
**C:** `void Script_doLookAt(uint32_t playerSerial, uint32_t targetSerial)`
**Wombat:** `void doLookAt(obj playerSerial, obj targetSerial)`
**Notes:** Performs a programmatic look-at on `target` from the player's perspective. _(builtin [519])_

---

### Script_doMissile_Loc2Loc
**C:** `void Script_doMissile_Loc2Loc(CLocation *srcLoc, CLocation *dstLoc, int effectId, int speed, int duration, int hue)`
**Wombat:** `void doMissile_Loc2Loc(loc src, loc dst, int effect_id, int speed, int duration, int hue)`
**Notes:** Plays a moving missile effect from one map location to another; batches into the AnimSequence if active, otherwise broadcasts immediately to nearby players.

---

### Script_doMissile_Loc2Mob
**C:** `void Script_doMissile_Loc2Mob(CLocation *srcLoc, uint32_t dstSerial, int effectId, int speed, int duration, int hue)`
**Wombat:** `void doMissile_Loc2Mob(loc src, obj dst, int effect_id, int speed, int duration, int hue)`
**Notes:** Plays a moving missile effect from a location to a mobile's current position; supports AnimSequence batching.

---

### Script_doMissile_Mob2Loc
**C:** `void Script_doMissile_Mob2Loc(uint32_t srcSerial, CLocation *dstLoc, int effectId, int speed, int duration, int hue)`
**Wombat:** `void doMissile_Mob2Loc(obj src, loc dst, int effect_id, int speed, int duration, int hue)`
**Notes:** Plays a moving missile effect from a mobile's current position to a location; supports AnimSequence batching.

---

### Script_doMissile_Mob2Mob
**C:** `void Script_doMissile_Mob2Mob(uint32_t srcSerial, uint32_t dstSerial, int effectId, int speed, int duration, int hue)`
**Wombat:** `void doMissile_Mob2Mob(obj src, obj dst, int effect_id, int speed, int duration, int hue)`
**Notes:** Plays a moving missile effect between two mobiles' current positions; supports AnimSequence batching.

---

### Script_doMobAnimation
**C:** `void Script_doMobAnimation(uint32_t serial, int effectId, int speed, int duration, int hue, int renderMode)`
**Wombat:** `void doMobAnimation(obj mobile, int effect_id, int speed, int duration, int hue, int render_mode)`
**Notes:** Plays a stationary graphical effect at a mobile's current location; supports AnimSequence batching (AnimSequence type 1).

---

### Script_doNPCHandleStates
**C:** `int Script_doNPCHandleStates(uint32_t serial)`
**Wombat:** `int doNPCHandleStates(obj mobile)` _(aliases: [728])_
**Notes:** Runs CNPC_HandleStates on the mobile; returns 1 on success, 0 if serial does not resolve.

---

### Script_doNPCHeartBeat
**C:** `int Script_doNPCHeartBeat(uint32_t serial)`
**Wombat:** `int doNPCHeartBeat(obj mobile)` _(aliases: [727])_
**Notes:** Runs CNPC_Heartbeat on the mobile; returns 1 on success, 0 if serial does not resolve.

---

### Script_doSCommand
**C:** `void Script_doSCommand(uint32_t serial, CString *str)`
**Wombat:** `void doSCommand(obj player, string command)` _(aliases: [734])_
**Notes:** Executes str as an admin S-command on behalf of the player.

---

### Script_doTakeMoney
**C:** `uint32_t Script_doTakeMoney(uint32_t containerSerial, int bodyType, int amount)`
**Wombat:** `obj doTakeMoney(obj container, int bodyType, int amount)`
**Notes:** Withdraws `amount` items of body type `bodyType` from the container; if the resulting stack was in the world it is dropped at the container's location; returns the stack serial, or 0 on failure.

---

### Script_dropCheck
**C:** `int Script_dropCheck(CLocation *loc, uint32_t serial, int stepHeight)`
**Wombat:** `int dropCheck(loc position, obj entity, int stepHeight)`
**Notes:** Checks whether `position` is a valid drop location given `stepHeight`; on success updates `position.z` with the computed drop Z and returns 1, otherwise returns 0.

---

### Script_dropObj
**C:** `int Script_dropObj(uint32_t serial, CLocation *loc)`
**Wombat:** `int dropObj(obj entity, loc destination)`
**Notes:** Drops `entity` at `loc`; thin wrapper around `teleport`. Returns 1 on success, 0 on failure.

---

### Script_eatObject
**C:** `int Script_eatObject(uint32_t serial, uint32_t foodSerial)`
**Wombat:** `int eatObject(obj npc, obj food)`
**Notes:** Stub — always returns 0; NPC eating was not implemented in the June 1998 demo binary.

---

### Script_ebark
**C:** `void Script_ebark(uint32_t serial, CString *text)`
**Wombat:** `void ebark(obj entity, string text)`
**Notes:** Broadcasts `text` from the entity as an emote (italic speech). String variant.

---

### Script_ebarkTo
**C:** `void Script_ebarkTo(uint32_t speakerSerial, uint32_t targetSerial, CString *text)`
**Wombat:** `void ebarkTo(obj speaker, obj target, string text)`
**Notes:** Sends `text` as a directed emote from `speaker` to a single `target` player. String variant.

---

### Script_ebarkToUnicode
**C:** `void Script_ebarkToUnicode(uint32_t speakerSerial, uint32_t targetSerial, CUString *text)`
**Wombat:** `void ebarkTo(obj speaker, obj target, ustring text)`
**Notes:** Unicode overload of `ebarkTo`; directed emote to a single player.

---

### Script_ebarkUnicode
**C:** `void Script_ebarkUnicode(uint32_t serial, CUString *text)`
**Wombat:** `void ebark(obj entity, ustring text)`
**Notes:** Unicode overload of `ebark`; broadcasts unicode text from the entity as an emote.

---

### Script_enableBehaviors
**C:** `void Script_enableBehaviors(uint32_t serial)`
**Wombat:** `void enableBehaviors(obj npc)`
**Notes:** Clears all NPC behavior flags (0x1003F), restoring automatic AI behaviors.

---

### Script_endSequence
**C:** `void Script_endSequence(int actionId)`
**Wombat:** `void endSequence(int action_id)`
**Notes:** Processes and broadcasts the accumulated AnimSequence using `action_id`, then clears the sequence state.

---

### Script_equipObj
**C:** `int Script_equipObj(uint32_t itemSerial, uint32_t targetSerial, int layer)`
**Wombat:** `int equipObj(obj item, obj mobile, int layer)`
**Notes:** Equips `item` on `mobile` at `layer`; on failure the item is returned to its tracked location. Returns 1 on success.

---

### Script_escript
**C:** `void Script_escript(uint32_t serial, CString *scriptName, CString *args)`
**Wombat:** `void escript(obj player, string scriptName, string args)`
**Notes:** Runs an escript file (`../.rundir/escripts/<scriptName>.esc`) for `player` with the supplied `args`, holding the static lock during execution.

---

### Script_faceHere
**C:** `void Script_faceHere(uint32_t serial, int dir)`
**Wombat:** `void faceHere(obj mobile, int dir)`
**Notes:** Sets the mobile's facing direction and refreshes nearby clients; silently ignores directions outside [0, 7].

---

### Script_facingEachOther
**C:** `int Script_facingEachOther(uint32_t serial1, uint32_t serial2)`
**Wombat:** `int facingEachOther(obj mob1, obj mob2)` _(aliases: facingEachOther — note: binary has a NULL-check bug where mob1 is checked twice instead of mob2)_
**Notes:** Returns 1 when both mobiles are facing each other along the line between their positions.

---

### Script_findClosestArea
**C:** `int Script_findClosestArea(uintptr_t resultName_str, uint32_t *resultLoc, uintptr_t namePrefix_str, uint32_t *fromLoc, int flag)`
**Wombat:** `int findClosestArea(string resultName, loc resultLoc, string namePrefix, loc fromLoc, int flag)` _(aliases: [529] — resultName and resultLoc are out-params)_
**Notes:** Finds the region with namePrefix closest to fromLoc (3D squared distance); writes center coords into resultLoc and region description into resultName. Returns 1 on match, 0 on no match.

---

### Script_findClosestBBoard
**C:** `uint32_t Script_findClosestBBoard(CLocation *loc)`
**Wombat:** `obj findClosestBBoard(loc location)` _(aliases: [708])_
**Notes:** Returns the serial of the nearest bulletin board to loc, or 0 if none exists.

---

### Script_findGoodSpotNear
**C:** `int Script_findGoodSpotNear(CLocation *loc, int zMax, int range, int height)`
**Wombat:** `int findGoodSpotNear(loc position, int z_max, int range, int height)`
**Notes:** Finds a usable spawn position near `position` within `range` tiles, capped at `z_max`; modifies `position` in place and returns 1 on success.

---

### Script_findGoodSpotNearMin
**C:** `int Script_findGoodSpotNearMin(CLocation *loc, int zMin, int zMax, int range, int height)`
**Wombat:** `int findGoodSpotNearMin(loc position, int z_min, int z_max, int range, int height)`
**Notes:** Like `findGoodSpotNear` but restricts valid z values to the range `[z_min, z_max]`; modifies `position` in place and returns 1 on success.

### Script_findGoodSpotNearWithElev
**C:** `int Script_findGoodSpotNearWithElev(CLocation *loc, int minElev, int maxElev, int zMax, int range, int height)`
**Wombat:** `int findGoodSpotNearWithElev(loc loc, int minElev, int maxElev, int zMax, int range, int height)` — writes result into `loc` (in/out)
**Notes:** Finds a valid spawn location near `loc` within the given elevation and range constraints; returns 1 on success. _(builtin [210])_

---

### Script_findGoodZ
**C:** `int Script_findGoodZ(CLocation *loc, int currentZ, int direction, int stepHeight, int height)`
**Wombat:** `int findGoodZ(loc loc, int currentZ, int direction, int stepHeight, int height)`
**Notes:** Returns the resting Z for a mobile of the given height walking onto `loc` from `currentZ` in `direction`; returns -128 for out-of-map coordinates. _(builtin [213])_

---

### Script_fixBank
**C:** `void Script_fixBank(uint32_t serial)`
**Wombat:** `void fixBank(obj mobile)` _(aliases: [719])_
**Notes:** Ensures the mobile has a bank container in equipment slot 29, creating one if missing.

---

### Script_followNpc
**C:** `void Script_followNpc(uint32_t serial, uint32_t leaderSerial, int range)`
**Wombat:** `void followNpc(obj npc, obj leader, int range)`
**Notes:** Puts the NPC into following state, tracking `leader` within `range`; passing `range=0` also clears the wander-radius behavior flag.

---

### Script_gainFame
**C:** `void Script_gainFame(uint32_t serial, int amount)`
**Wombat:** `void gainFame(obj, int)` _(builtin 294)_
**Notes:** Adds `amount` to the mobile's notoriety (despite the name, routes through `CMobile_GainNotoriety`); values above 255 are silently ignored.

---

### Script_getAC
**C:** `int Script_getAC(uint32_t serial)`
**Wombat:** `int getAC(obj)` _(builtin 289)_
**Notes:** Returns the mobile's combat armor class via `Combat_CalcArmorClass`.

---

### Script_getAccountNum
**C:** `int Script_getAccountNum(uint32_t serial)`
**Wombat:** `int getAccountNum(obj player)`
**Notes:** Returns the player's account number, or 0 when the serial is not a valid player.

---

### Script_getAdjFame
**C:** `int Script_getAdjFame(uint32_t serial)`
**Wombat:** `int getAdjFame(obj)` _(builtin 305)_
**Notes:** Returns the mobile's adjusted (effective) fame value via `CMobile_GetAdjFame`.

---

### Script_getAdjKarma
**C:** `int Script_getAdjKarma(uint32_t serial)`
**Wombat:** `int getAdjKarma(obj)` _(builtin 310)_
**Notes:** Returns the mobile's adjusted (effective) karma value via `CMobile_GetAdjKarma`.

---

### Script_getAmmoType
**C:** `int Script_getAmmoType(uint32_t serial)`
**Wombat:** `int getAmmoType(obj weapon)` _(index 590)_
**Notes:** Returns the weapon's ammo type (uint16), or −1 when invalid.

---

### Script_getArrayHeight
**C:** `int Script_getArrayHeight(int id)`
**Wombat:** `int getArrayHeight(int id)`
**Notes:** Returns the number of data rows in array `id`, or 0 if not found or uninitialized.

---

## Control / Misc

### Script_getArrayIntElem
**C:** `int Script_getArrayIntElem(int id, int x, int y)`
**Wombat:** `int getArrayIntElem(int id, int x, int y)`
**Notes:** Returns the integer element at column `x`, row `y` in array `id`, or 0 if not found or uninitialized.

---

### Script_getArrayStrElem
**C:** `CString *Script_getArrayStrElem(CString *retval, int id, int x, int y)`
**Wombat:** `string getArrayStrElem(int id, int x, int y)`
**Notes:** Returns the string element at column `x`, row `y` in array `id`, or an empty string if not found or element is NULL.

---

### Script_getArrayUStrElem
**C:** `CUString *Script_getArrayUStrElem(CUString *retval, int id, int x, int y)`
**Wombat:** `ustring getArrayUStrElem(int id, int x, int y)`
**Notes:** Returns the unicode string element at column `x`, row `y` in array `id`, or an empty ustring if not found or element is NULL.

---

### Script_getArrayWidth
**C:** `int Script_getArrayWidth(int id)`
**Wombat:** `int getArrayWidth(int id)`
**Notes:** Returns the number of columns in array `id`, or 0 if not found or uninitialized.

---

### Script_getArticle
**C:** `CString *Script_getArticle(CString *dest, int typeId)`
**Wombat:** `string getArticle(int typeId)`
**Notes:** Returns the article prefix for the tile type ("a", "an", "the", or ""); returns "BUG!" for out-of-range typeId. _(builtin [520])_

---

### Script_getAttackers
**C:** `void Script_getAttackers(CList *list, uint32_t serial)`
**Wombat:** `void getAttackers(list, obj)` _(builtin 619)_
**Notes:** Clears `list` and appends the serial of every mobile in the mobile's attacker list.

---

### Script_getAttackersNearby
**C:** `void Script_getAttackersNearby(CList *list, uint32_t serial)`
**Wombat:** `void getAttackersNearby(list, obj)` _(builtin 620)_
**Notes:** Clears `list` and appends the serials of attackers tracked by every mobile within range 8 of `serial`; binary bug: the end-iterator check references `mob`'s own attacker list instead of each nearby mobile's list (reproduced exactly from binary).

---

### Script_getAverageDamage
**C:** `int Script_getAverageDamage(uint32_t serial)`
**Wombat:** `int getAverageDamage(obj weapon)` _(index 597)_
**Notes:** Returns the average damage of the weapon computed from its embedded NdF+B damage dice.

---

### Script_getBackpack
**C:** `uint32_t Script_getBackpack(uint32_t serial)`
**Wombat:** `obj getBackpack(obj mobile)` _(index 411)_
**Notes:** Returns the serial of the mobile's backpack (slot 21) if it has accessible contents; falls back to the first other equipment slot with contents; returns 0 when none qualify.

---

### Script_getBookPages
**C:** `int Script_getBookPages(uint32_t serial)`
**Wombat:** `int getBookPages(obj serial)`
**Notes:** Returns the page count for a book entity (from bookPages ObjVar or tiledata fallback), or 0 if not found. _(builtin [706])_

---

### Script_getBow
**C:** `int Script_getBow(uint32_t serial)`
**Wombat:** `int getBow(obj weapon)` _(index 591)_
**Notes:** Returns the weapon's bow type code, or −1 when invalid.

---

### Script_getCanCarry
**C:** `int Script_getCanCarry(uint32_t serial)`
**Wombat:** `int getCanCarry(obj)` _(builtin 320)_
**Notes:** Returns the mobile's maximum carry weight via `CMobile_GetMaxWeight`.

---

### Script_getCappedSkillTotal
**C:** `int Script_getCappedSkillTotal(uint32_t serial)`
**Wombat:** `int getCappedSkillTotal(obj)` _(builtin 322)_
**Notes:** Returns the mobile's total skill weight (skills capped by the per-skill weight curve) via `CMobile_CalcTotalSkillWeight`.

---

### Script_getCharacterNum
**C:** `int Script_getCharacterNum(uint32_t serial)`
**Wombat:** `int getCharacterNum(obj player)`
**Notes:** Returns the player's character slot index within the account, or 0 when not valid.

---

### Script_getChunkEgg
**C:** `uint32_t Script_getChunkEgg(CLocation *loc)`
**Wombat:** `obj getChunkEgg(loc position)`
**Notes:** Returns the serial of the spawn-egg entity tied to the map block containing `position`, or 0 when none exists.

---

### Script_getClosestMobile
**C:** `uint32_t Script_getClosestMobile(CLocation *loc, int range)`
**Wombat:** `obj getClosestMobile(loc center, int range)`
**Notes:** Returns the serial of the mobile nearest to `center` within Chebyshev distance `range`, or 0 when none qualify.

---

### Script_getClosestMobileOrOnlinePlayer
**C:** `uint32_t Script_getClosestMobileOrOnlinePlayer(CLocation *loc, int range)`
**Wombat:** `obj getClosestMobileOrOnlinePlayer(loc center, int range)`
**Notes:** Returns the serial of the nearest NPC or online player within Chebyshev distance `range` of `center`, or 0 when none qualify.

---

### Script_getClosestOnlinePlayer
**C:** `uint32_t Script_getClosestOnlinePlayer(CLocation *loc, int range)`
**Wombat:** `obj getClosestOnlinePlayer(loc center, int range)`
**Notes:** Returns the serial of the online player nearest to `center` within Chebyshev distance `range`, or 0 when none qualify.

---

### Script_getClosestPlayer
**C:** `uint32_t Script_getClosestPlayer(CLocation *loc, int range)`
**Wombat:** `obj getClosestPlayer(loc center, int range)`
**Notes:** Returns the serial of the player nearest to `center` within Chebyshev distance `range`, or 0 when none qualify.

---

### Script_getClosestVisibleOnlinePlayer
**C:** `uint32_t Script_getClosestVisibleOnlinePlayer(CLocation *loc, int range)`
**Wombat:** `obj getClosestVisibleOnlinePlayer(loc center, int range)`
**Notes:** Like `getClosestOnlinePlayer` but excludes hidden players and dead players unless they have the ghost-visible flag set.

---

### Script_getCombatMode
**C:** `int Script_getCombatMode(uint32_t serial)`
**Wombat:** `int getCombatMode(obj player)`
**Notes:** Returns 1 when the player has war mode active (mobile flag 0x40).

---

### Script_getCompileFlag
**C:** `int Script_getCompileFlag(int flagId)`
**Wombat:** `int getCompileFlag(int flagId)`
**Notes:** Returns the compile-time feature flag for `flagId`; flag 1 is permanently set (UO Demo build), all others return 0.

---

### Script_getContainersOnMobile
**C:** `void Script_getContainersOnMobile(CList *list, uint32_t serial)`
**Wombat:** `void getContainersOnMobile(list list, obj serial)`
**Notes:** Fills `list` with the serials of all containers currently equipped by the mobile. _(builtin [517])_

---

### Script_getcontents
**C:** `void Script_getcontents(CList *list, uint32_t serial)`
**Wombat:** `void getcontents(list out, obj container)` _(aliases: getcontents, getContents)_
**Notes:** Clears `out` then appends the serial of every item in the container's contents linked list.

---

### Script_getCorpseBodyType
**C:** `int Script_getCorpseBodyType(uint32_t serial)`
**Wombat:** `int getCorpseBodyType(obj entity)`
**Notes:** Returns the 16-bit body type stored in the corpse object (`[entity+0xC4] & 0xFFFF`), or 0 when not a valid corpse.

---

### Script_getCreationLoc
**C:** `CLocation *Script_getCreationLoc(CLocation *retloc, uint32_t serial)`
**Wombat:** `loc getCreationLoc(obj serial)`
**Notes:** Returns the entity's creation-time location; falls back to (-1, -1, 0) for invalid serials. _(builtin [492])_

---

### Script_getCurArmorClass
**C:** `int Script_getCurArmorClass(uint32_t serial)`
**Wombat:** `int getCurArmorClass(obj weapon)` _(index 589)_
**Notes:** Returns the weapon's effective armor rating (scaled by current durability), or −1 when invalid.

---

### Script_getCurFatigue
**C:** `int Script_getCurFatigue(uint32_t serial)`
**Wombat:** `int getCurFatigue(obj)` _(builtin 316)_
**Notes:** Returns the mobile's current stamina via `CMobile_GetStamina`.

---

### Script_getCurHP
**C:** `int Script_getCurHP(uint32_t serial)`
**Wombat:** `int getCurHP(obj)` _(builtin 314)_
**Notes:** Returns the mobile's current HP via `CMobile_GetHp`.

---

### Script_getCurMana
**C:** `int Script_getCurMana(uint32_t serial)`
**Wombat:** `int getCurMana(obj)` _(builtin 318)_
**Notes:** Returns the mobile's current mana via `CMobile_GetMana`.

---

### Script_getCurrentTimeStr
**C:** `void Script_getCurrentTimeStr(CString *out)`
**Wombat:** `void getCurrentTimeStr(string out)` _(aliases: [743] — out-param, typeSig `"vs"` with S write-back)_
**Notes:** Fills out with the current real-world timestamp formatted as "YYYY-MM-DD HH:MM".

---

### Script_getDay
**C:** `int Script_getDay(void)`
**Wombat:** `int getDay()` _(index 362)_
**Notes:** Returns the in-game day counter.

---

### Script_getDecayCount
**C:** `int Script_getDecayCount(uint32_t serial)`
**Wombat:** `int getDecayCount(obj entity)`
**Notes:** Returns the entity's current decay counter (low byte), or -10 when the serial is invalid.

---

### Script_getDecayInterval
**C:** `int Script_getDecayInterval(void)`
**Wombat:** `int getDecayInterval()`
**Notes:** Returns the per-bucket decay interval scaled by 2^16 (`decayInterval << 16 / bucketsPerTick`), or 0 when no buckets are scanned per tick.

---

### Script_getDecayMax
**C:** `int Script_getDecayMax(uint32_t serial)`
**Wombat:** `int getDecayMax(obj entity)`
**Notes:** Returns the world's global decay-counter cap (low byte), or -10 when the serial is invalid.

---

### Script_getDefaultAlignment
**C:** `int Script_getDefaultAlignment(int templateId)`
**Wombat:** `int getDefaultAlignment(int templateId)`
**Notes:** Returns the alignment value declared by template `templateId`, or 0 if the template does not exist. _(builtin [484])_

---

### Script_getDefaultDieDecay
**C:** `int Script_getDefaultDieDecay(void)`
**Wombat:** `int getDefaultDieDecay()`
**Notes:** Returns the world's default death-triggered decay cap (low byte).

---

### Script_getDefaultTextHue
**C:** `int Script_getDefaultTextHue(uint32_t serial)`
**Wombat:** `int getDefaultTextHue(obj mobile)`
**Notes:** Returns the mobile's default speech hue.

---

### Script_getDesireLevel
**C:** `int Script_getDesireLevel(uint32_t serial)`
**Wombat:** `int getDesireLevel(obj npc)`
**Notes:** Returns the NPC's desire level scaled up by 10 (inverse of `setDesireLevel`'s storage), or 0 when the serial is not an NPC.

---

### Script_getDexterity
**C:** `int Script_getDexterity(uint32_t serial)`
**Wombat:** `int getDexterity(obj mobile)` _(index 373)_
**Notes:** Returns the mobile's effective dexterity (base + bonus).

---

### Script_getDirection
**C:** `CString *Script_getDirection(CString *dest, CLocation *loc1, CLocation *loc2)`
**Wombat:** `string getDirection(loc from, loc to)`
**Notes:** Returns a human-readable compass bearing string from `from` to `to` ("to the north", "to the southeast", etc.); returns "right here" for distances under 10 tiles.

---

### Script_getDistance
**C:** `CString *Script_getDistance(CString *dest, CLocation *loc1, CLocation *loc2)`
**Wombat:** `string getDistance(loc a, loc b)`
**Notes:** Returns a human-readable distance phrase ("right here", "just a short way", "a fair distance", "a long way", etc.) bucketed in tens of tiles.

---

### Script_getDistanceInTiles
**C:** `int Script_getDistanceInTiles(const CLocation *loc1, const CLocation *loc2)`
**Wombat:** `int getDistanceInTiles(loc a, loc b)`
**Notes:** Returns the Chebyshev (wrapping) distance in tiles between two locations.

---

### Script_getElevation
**C:** `int Script_getElevation(CLocation *loc)`
**Wombat:** `int getElevation(loc location)` _(aliases: [760])_
**Notes:** Returns the land Z height at loc.

---

### Script_getElevationAt
**C:** `int Script_getElevationAt(int x, int y)`
**Wombat:** `int getElevationAt(int x, int y)`
**Notes:** Returns the average land Z at map coordinates (x, y), or 0 when the coordinates fall outside the map.

---

### Script_getEncumbrance
**C:** `int Script_getEncumbrance(uint32_t serial)`
**Wombat:** `int getEncumbrance(obj mobile)`
**Notes:** Returns the mobile's carry-weight encumbrance as a percentage; returns -1 when the mobile is not found.

---

### Script_getequipment
**C:** `void Script_getequipment(CList *list, uint32_t serial)`
**Wombat:** `void getequipment(list out, obj mobile)` _(aliases: getequipment, getEquipment)_
**Notes:** Clears `out` then appends the serial of every non-NULL item in the mobile's 26 equipment slots.

---

## Callbacks / Timers

### Script_getEquipSlot
**C:** `int Script_getEquipSlot(uint32_t serial)`
**Wombat:** `int getEquipSlot(obj entity)` _(index 354)_
**Notes:** Returns the entity's natural equipment layer byte; always returns 0 for mobiles.

---

### Script_getFacing
**C:** `int Script_getFacing(uint32_t serial)`
**Wombat:** `int getFacing(obj mobile)`
**Notes:** Returns the mobile's current facing direction (0–7).

---

### Script_getFame
**C:** `int Script_getFame(uint32_t serial)`
**Wombat:** `int getFame(obj)` _(builtin 304)_
**Notes:** Returns the mobile's fame value via `CMobile_GetFame`.

---

### Script_getFameLevel
**C:** `int Script_getFameLevel(uint32_t serial)`
**Wombat:** `int getFameLevel(obj)` _(builtin 306)_
**Notes:** Returns the bucketed fame level for the mobile via `CMobile_GetFameLevel`.

---

### Script_getFatigueLevel
**C:** `int Script_getFatigueLevel(uint32_t serial)`
**Wombat:** `int getFatigueLevel(obj)` _(builtin 325)_
**Notes:** Returns the mobile's current stamina as a percentage of its maximum (`curStamina * 100 / maxStamina`).

---

### Script_getFeluccaPhase
**C:** `int Script_getFeluccaPhase(void)`
**Wombat:** `int getFeluccaPhase()`
**Notes:** Returns the current Felucca moon phase (0–7). _(builtin [580])_

---

### Script_getFirstObjectOfType
**C:** `uint32_t Script_getFirstObjectOfType(CLocation *loc, int bodyType)`
**Wombat:** `obj getFirstObjectOfType(loc position, int body_type)`
**Notes:** Returns the serial of the first item near `position` whose body type matches `body_type`, or 0 when none qualify; pair with `getNextObjectOfType` to iterate.

---

### Script_getFirstTarget
**C:** `uint32_t Script_getFirstTarget(uint32_t serial)`
**Wombat:** `obj getFirstTarget(obj mobile)` _(index 623)_
**Notes:** Returns the serial of the first entry in the mobile's combat target list, or 0 when the list is empty.

---

### Script_getFirstVisableTarget
**C:** `uint32_t Script_getFirstVisableTarget(uint32_t serial)`
**Wombat:** `obj getFirstVisableTarget(obj serial)`
**Notes:** Returns the serial of the first non-hidden, visible combat target of the mobile, or 0 if none. _(builtin [617])_

---

### Script_getFirstVisableTargetInRange
**C:** `uint32_t Script_getFirstVisableTargetInRange(uint32_t serial, int range)`
**Wombat:** `obj getFirstVisableTargetInRange(obj serial, int range)`
**Notes:** Like `getFirstVisableTarget` but additionally requires the target to be within Chebyshev distance `range`. _(builtin [618])_

---

### Script_getFreeHandSlot
**C:** `int Script_getFreeHandSlot(uint32_t serial)`
**Wombat:** `int getFreeHandSlot(obj mobile)` _(index 358)_
**Notes:** Returns 1 (right hand) or 2 (left hand) for the first free hand slot on `mobile`, or 0 when both hands are occupied.

---

### Script_getGeneric
**C:** `int Script_getGeneric(uint32_t serial, int type)`
**Wombat:** `int getGeneric(obj, int)` _(builtin 292)_
**Notes:** Returns the total quantity of items with body type `type` carried by the mobile.

---

### Script_getGMCallStatus
**C:** `int Script_getGMCallStatus(void)`
**Wombat:** `int getGMCallStatus()` _(aliases: [740])_
**Notes:** Returns the global GM call-queue status flag.

---

### Script_getHeight
**C:** `int Script_getHeight(uint32_t serial)`
**Wombat:** `int getHeight(obj entity)`
**Notes:** Returns the entity's collision height: the tiledata height for items, or a fixed 16 for mobiles.

---

### Script_getHeShe
**C:** `CString *Script_getHeShe(CString *out, uint32_t serial)`
**Wombat:** `string getHeShe(obj)` _(builtin 349)_
**Notes:** Returns `"he"`, `"she"`, or `"it"` based on the mobile's sex (0 = male, 1 = female, other = neuter).

---

### Script_getHimHer
**C:** `CString *Script_getHimHer(CString *out, uint32_t serial)`
**Wombat:** `string getHimHer(obj)` _(builtin 350)_
**Notes:** Returns `"him"`, `"her"`, or `"it"` based on the mobile's sex (0 = male, 1 = female, other = neuter).

---

### Script_getHint
**C:** `int Script_getHint(uint32_t serial, int flags, int *outInt1, uint32_t *outInt2, int *outInt3, CString *outStr1, CString *outStr2, CLocation *outLoc, uint32_t *outObjSerial, CString *outStr3, int *outParam)`
**Wombat:** `int getHint(obj serial, int flags, int &outInt1, obj &outInt2, int &outInt3, string &outStr1, string &outStr2, loc &outLoc, obj &outObjSerial, string &outStr3, int &outParam)`
**Notes:** Looks up a hint by (serial, flags) and unpacks all its fields into output parameters; returns 1 on hit, 0 otherwise. _(builtin [575], typeSig `ioiIOISSCOSI`)_

---

### Script_getHisHer
**C:** `CString *Script_getHisHer(CString *out, uint32_t serial)`
**Wombat:** `string getHisHer(obj)` _(builtin 351)_
**Notes:** Returns `"his"`, `"her"`, or `"its"` based on the mobile's sex (0 = male, 1 = female, other = neuter).

---

### Script_getHome
**C:** `CLocation *Script_getHome(CLocation *retloc, uint32_t serial)`
**Wombat:** `loc getHome(obj serial)`
**Notes:** Returns the NPC's home location; falls back to (-1, -1, 0) for invalid serials. _(builtin [490])_

---

### Script_getHomeDecayRate
**C:** `int Script_getHomeDecayRate(void)`
**Wombat:** `int getHomeDecayRate()`
**Notes:** Returns the world's home-region decay rate (low byte).

---

### Script_getHour
**C:** `int Script_getHour(void)`
**Wombat:** `int getHour()` _(index 363)_
**Notes:** Returns the in-game hour counter.

---

### Script_getHPLevel
**C:** `int Script_getHPLevel(uint32_t serial)`
**Wombat:** `int getHPLevel(obj)` _(builtin 324)_
**Notes:** Returns the mobile's current HP as a percentage of its maximum (`curHP * 100 / maxHP`).

---

### Script_getHue
**C:** `int Script_getHue(uint32_t serial)`
**Wombat:** `int getHue(obj entity)`
**Notes:** Returns the entity's current color value.

---

### Script_getHungerLevel
**C:** `int Script_getHungerLevel(uint32_t serial)`
**Wombat:** `int getHungerLevel(obj npc)`
**Notes:** Returns the NPC's hunger as a percentage of capacity (0–100); returns 100 when the NPC has no hunger system, -1 when the serial is not an NPC.

---

### Script_getIntelligence
**C:** `int Script_getIntelligence(uint32_t serial)`
**Wombat:** `int getIntelligence(obj mobile)` _(index 374)_
**Notes:** Returns the mobile's effective intelligence (base + bonus).

---

### Script_getItemAtSlot
**C:** `uint32_t Script_getItemAtSlot(uint32_t serial, int slot)`
**Wombat:** `obj getItemAtSlot(obj mobile, int slot)` _(index 355)_
**Notes:** Returns the serial of the item equipped in `slot` (1–30) on `mobile`, or 0 when the slot is empty or out of range.

---

### Script_getKarma
**C:** `int Script_getKarma(uint32_t serial)`
**Wombat:** `int getKarma(obj)` _(builtin 309)_
**Notes:** Returns the mobile's karma value via `CMobile_GetKarma`.

---

### Script_getKarmaLevel
**C:** `int Script_getKarmaLevel(uint32_t serial)`
**Wombat:** `int getKarmaLevel(obj)` _(builtin 311)_
**Notes:** Returns the bucketed karma level for the mobile via `CMobile_GetKarmaLevel`.

---

### Script_getLeader
**C:** `uint32_t Script_getLeader(uint32_t serial)`
**Wombat:** `obj getLeader(obj npc)`
**Notes:** Returns the serial of the NPC's current follow leader, or 0 if it is not following anyone or is not an NPC.

---

### Script_getLightTime
**C:** `int Script_getLightTime(uint32_t serial)`
**Wombat:** `int getLightTime(obj serial)`
**Notes:** Returns the mobile's remaining light duration. _(builtin [546])_

---

### Script_getLightVal
**C:** `int Script_getLightVal(uint32_t serial)`
**Wombat:** `int getLightVal(obj serial)`
**Notes:** Returns the mobile's light brightness value. _(builtin [545])_

---

### Script_getListItemType
**C:** `int Script_getListItemType(CList *list, int index)`
**Wombat:** `int getListItemType(list list, int index)`
**Notes:** Returns the WTYPE_* type tag of `list[index]`, or WTYPE_UNKNOWN (7) when index is out of range.

---

### Script_getLizardishSyllable
**C:** `CString *Script_getLizardishSyllable(CString *out, int index)`
**Wombat:** `string getLizardishSyllable(int index)` _(aliases: [406])_
**Notes:** Returns the (index % 73)-th syllable from the Lizardman language table.

---

### Script_getLocalizedDesc
**C:** `int Script_getLocalizedDesc(CString *outStr, CLocation *outLoc, CLocation *inLoc1, CLocation *inLoc2)`
**Wombat:** `int getLocalizedDesc(string &outStr, loc &outLoc, loc inLoc1, loc inLoc2)`
**Notes:** Returns the localized region description for the bounding box [inLoc1, inLoc2]; stores the region name in `outStr` and its centre in `outLoc`. _(builtin [576], typeSig `iSCcc`)_

---

### Script_getLocation
**C:** `CLocation *Script_getLocation(CLocation *retloc, uint32_t serial)`
**Wombat:** `loc getLocation(obj)` _(builtin 277)_
**Notes:** Returns the entity's effective world location, walking the parent chain for contained items; falls back to `(-1, -1, 0)` when the entity is missing.

---

### Script_getManaLevel
**C:** `int Script_getManaLevel(uint32_t serial)`
**Wombat:** `int getManaLevel(obj)` _(builtin 326)_
**Notes:** Returns the mobile's current mana as a percentage of its maximum (`curMana * 100 / maxMana`).

---

### Script_getMapPoint
**C:** `int Script_getMapPoint(CLocation *retloc, uint32_t serial, int index)`
**Wombat:** `int getMapPoint(loc result, obj entity, int index)`
**Notes:** Copies the world coordinates of the index-th map pin on a signpost entity into `result`; returns 1 on success, 0 when the index is out of range.

---

### Script_getMasterObjLoc
**C:** `CLocation *Script_getMasterObjLoc(CLocation *retloc, int index)`
**Wombat:** `loc getMasterObjLoc(int)` _(builtin 280)_
**Notes:** Returns the world location of the `index`-th master-object slot (`g_mapStartX + index`, `g_mapStartY`, 0); falls back to `(-1, -1, 0)` for indices outside [0, 127].

---

### Script_getMaxArmorClass
**C:** `int Script_getMaxArmorClass(uint32_t serial)`
**Wombat:** `int getMaxArmorClass(obj weapon)` _(index 588)_
**Notes:** Returns the weapon's maximum armor rating, or −1 when the weapon is invalid.

---

### Script_getMaxFatigue
**C:** `int Script_getMaxFatigue(uint32_t serial)`
**Wombat:** `int getMaxFatigue(obj)` _(builtin 317)_
**Notes:** Returns the mobile's maximum stamina via `CMobile_GetMaxStamina`.

---

### Script_getMaxHP
**C:** `int Script_getMaxHP(uint32_t serial)`
**Wombat:** `int getMaxHP(obj)` _(builtin 315)_
**Notes:** Returns the mobile's maximum HP via `CMobile_GetMaxHp`.

---

### Script_getMaxMana
**C:** `int Script_getMaxMana(uint32_t serial)`
**Wombat:** `int getMaxMana(obj)` _(builtin 319)_
**Notes:** Returns the mobile's maximum mana via `CMobile_GetMaxMana`.

---

### Script_getMinute
**C:** `int Script_getMinute(void)`
**Wombat:** `int getMinute()` _(index 364)_
**Notes:** Returns the in-game minute counter.

---

### Script_getMiscData
**C:** `int Script_getMiscData(uint32_t serial)`
**Wombat:** `int getMiscData(obj entity)`
**Notes:** Returns the low 16 bits of the entity's sort-key field (misc/data field).

---

### Script_getMobFlag
**C:** `int Script_getMobFlag(uint32_t serial, int flagId)`
**Wombat:** `int getMobFlag(obj mobile, int flagId)` _(index 401)_
**Notes:** Returns 1 when status flag `flagId` is set on `mobile`.

---

### Script_getMobsAt
**C:** `void Script_getMobsAt(CList *list, CLocation *loc)`
**Wombat:** `void getMobsAt(list out, loc position)`
**Notes:** Fills `out` with serials of all mobiles sharing the exact x/y/z of `position`.

---

### Script_getMobsInRange
**C:** `void Script_getMobsInRange(CList *list, CLocation *loc, int range)`
**Wombat:** `void getMobsInRange(list out, loc center, int range)`
**Notes:** Fills `out` with serials of all NPCs and players within `range` of `center` using the fast entity-map index.

---

### Script_getMobsInRangeOld
**C:** `void Script_getMobsInRangeOld(CList *list, CLocation *loc, int range)`
**Wombat:** `void getMobsInRangeOld(list out, loc center, int range)`
**Notes:** Fills `out` with serials of all mobiles within Chebyshev distance `range` of `center` using the slow spatial-grid block walk; superseded by `getMobsInRange`.

---

### Script_getMoney
**C:** `int Script_getMoney(uint32_t serial)`
**Wombat:** `int getMoney(obj)` _(builtin 293)_
**Notes:** Returns the total amount of gold (body type 0x0EED) carried by the mobile.

---

### Script_getMonth
**C:** `int Script_getMonth(void)`
**Wombat:** `int getMonth()` _(index 360)_
**Notes:** Returns the in-game month counter.

---

### Script_getMoonGateDest
**C:** `int Script_getMoonGateDest(int arg)`
**Wombat:** `int getMoonGateDest(int arg)`
**Notes:** Returns the moongate destination index calculated as `(arg + trammelPhase - feluccaPhase + 8) % 8`. _(builtin [582])_

---

### Script_getMoonPhaseStr
**C:** `CString *Script_getMoonPhaseStr(CString *out, int phase)`
**Wombat:** `string getMoonPhaseStr(int phase)`
**Notes:** Returns a one-character moon-phase glyph (char 0x80 + phase) for valid phases 0–7, or " invalid phase " for out-of-range values. _(builtin [581])_

---

### Script_getMovementType
**C:** `int Script_getMovementType(uint32_t serial)`
**Wombat:** `int getMovementType(obj)` _(builtin 290)_
**Notes:** Returns the mobile's current movement type (low byte of vtable slot 0x94 result).

---

### Script_getMultiComponentOffset
**C:** `CLocation *Script_getMultiComponentOffset(CLocation *outLoc, uint32_t serial)`
**Wombat:** `loc getMultiComponentOffset(obj entity)`
**Notes:** Returns the entity's XYZ offset relative to its multi master, or (-1,-1,-1) when the entity is not a multi component.

---

### Script_getMultiExtents
**C:** `int Script_getMultiExtents(int typeId, CLocation *minLoc, CLocation *maxLoc)`
**Wombat:** `int getMultiExtents(int typeId, loc minLoc, loc maxLoc)`
**Notes:** Fills `minLoc` and `maxLoc` with the bounding extents of the multi type definition; both `loc` parameters are out-parameters (uppercase `C` in typeSig).

---

### Script_getMultiSlaveId
**C:** `uint32_t Script_getMultiSlaveId(uint32_t serial)`
**Wombat:** `obj getMultiSlaveId(obj entity)`
**Notes:** Returns the master serial of the multi the entity belongs to, or 0 when the entity is not a multi component.

---

### Script_getMultiType
**C:** `int Script_getMultiType(uint32_t serial)`
**Wombat:** `int getMultiType(obj entity)`
**Notes:** Returns the multi-type ID for the entity when it is the owner of a multi, or 0 otherwise.

---

### Script_getMurderCount
**C:** `int Script_getMurderCount(uint32_t serial)`
**Wombat:** `int getMurderCount(obj entity)` _(aliases: [564])_
**Notes:** Returns the entity's murderCount ObjVar value.

---

### Script_getName
**C:** `CString *Script_getName(CString *out, uint32_t serial)`
**Wombat:** `string getName(obj entity)`
**Notes:** Returns the entity's display name, or an empty string when the entity is not found.

---

### Script_getNameByType
**C:** `CString *Script_getNameByType(CString *dest, int typeId)`
**Wombat:** `string getNameByType(int typeId)`
**Notes:** Returns the tiledata name string for `typeId`; returns "BUG!" for out-of-range values. _(builtin [500])_

---

### Script_getNaturalAC
**C:** `int Script_getNaturalAC(uint32_t serial)`
**Wombat:** `int getNaturalAC(obj)` _(builtin 323)_
**Notes:** Returns the mobile's bonus armor class via `CMobile_GetBonusAC`.

---

### Script_getNextObjectOfType
**C:** `uint32_t Script_getNextObjectOfType(CLocation *loc, int bodyType, uint32_t lastSerial)`
**Wombat:** `obj getNextObjectOfType(loc position, int body_type, obj last)`
**Notes:** Resumes the `getFirstObjectOfType` walk after `last`, returning the next matching serial near `position`, or 0 when none remain.

---

### Script_getNonHomeDecayRate
**C:** `int Script_getNonHomeDecayRate(void)`
**Wombat:** `int getNonHomeDecayRate()`
**Notes:** Returns the world's non-home decay rate (low byte).

---

### Script_getNotoriety
**C:** `int Script_getNotoriety(uint32_t serial)`
**Wombat:** `int getNotoriety(obj)` _(builtin 300)_
**Notes:** Returns the mobile's raw notoriety value via `CMobile_GetNotoriety`.

---

### Script_getNotorietyLevel
**C:** `int Script_getNotorietyLevel(uint32_t serial)`
**Wombat:** `int getNotorietyLevel(obj)` _(builtin 301)_
**Notes:** Returns the mobile's bucketed notoriety level via `CMobile_GetNotoLevel`.

---

### Script_getNotorietyLevelByNot
**C:** `int Script_getNotorietyLevelByNot(int value)`
**Wombat:** `int getNotorietyLevelByNot(int)` _(builtin 302)_
**Notes:** Converts a raw notoriety value to its bucketed notoriety level via `NotoValueToLevel`; takes no entity argument.

---

### Script_getNPCsAt
**C:** `void Script_getNPCsAt(CList *list, CLocation *loc)`
**Wombat:** `void getNPCsAt(list out, loc position)`
**Notes:** Fills `out` with serials of all NPCs sharing the exact x/y/z of `position`.

---

### Script_getNPCsInRange
**C:** `void Script_getNPCsInRange(CList *list, CLocation *loc, int range)`
**Wombat:** `void getNPCsInRange(list out, loc center, int range)`
**Notes:** Fills `out` with serials of all NPCs within `range` of `center` using the fast NPC entity-map index.

---

### Script_getNPCsInRangeOld
**C:** `void Script_getNPCsInRangeOld(CList *list, CLocation *loc, int range)`
**Wombat:** `void getNPCsInRangeOld(list out, loc center, int range)`
**Notes:** Fills `out` with serials of all NPCs within Chebyshev distance `range` of `center` using the slow spatial-grid walk; superseded by `getNPCsInRange`.

---

### Script_getNPCState
**C:** `int Script_getNPCState(uint32_t serial)`
**Wombat:** `int getNPCState(obj npc)`
**Notes:** Returns the NPC's current AI state integer, or -1 when the serial is not an NPC.

---

### Script_getNumAllObjectsInRangeWithFlags
**C:** `int Script_getNumAllObjectsInRangeWithFlags(CLocation *loc, int range, int flags)`
**Wombat:** `int getNumAllObjectsInRangeWithFlags(loc center, int range, int flags)`
**Notes:** Returns the count of both dynamic and static entities within Chebyshev distance `range` of `center` whose tiledata flags include all bits of `flags`.

---

### Script_getNumAttackers
**C:** `int Script_getNumAttackers(uint32_t serial)`
**Wombat:** `int getNumAttackers(obj)` _(builtin 622)_
**Notes:** Returns the number of entries in the mobile's attacker list; the validation string in the binary is `"getNumTargets"` (copy-paste bug in original code).

---

### Script_getNumInMultiType
**C:** `int Script_getNumInMultiType(int typeId)`
**Wombat:** `int getNumInMultiType(int typeId)`
**Notes:** Returns the number of component entries in the multi type definition for `typeId`.

---

### Script_getNumTargets
**C:** `int Script_getNumTargets(uint32_t serial)`
**Wombat:** `int getNumTargets(obj)` _(builtin 621)_
**Notes:** Returns the number of entries in the mobile's combat target list.

---

### Script_getObjectFlags
**C:** `int Script_getObjectFlags(uint32_t serial, int mask)`
**Wombat:** `int getObjectFlags(obj entity, int mask)`
**Notes:** Returns the entity's tiledata flags ANDed with `mask`; mobiles always return 0.

---

### Script_getObjectsAt
**C:** `void Script_getObjectsAt(CList *list, CLocation *loc)`
**Wombat:** `void getObjectsAt(list out, loc position)`
**Notes:** Fills `out` with serials of all non-mobile entities sharing the exact x/y/z of `position`.

---

### Script_getObjectsAtInZRange
**C:** `void Script_getObjectsAtInZRange(CList *list, CLocation *loc, int zMin, int zMax)`
**Wombat:** `void getObjectsAtInZRange(list out, loc position, int z_min, int z_max)`
**Notes:** Fills `out` with serials of non-mobile entities at `position`'s (x, y) whose z falls within `[z_min, z_max]`.

---

### Script_getObjectsInRange
**C:** `void Script_getObjectsInRange(CList *list, CLocation *loc, int range)`
**Wombat:** `void getObjectsInRange(list out, loc center, int range)`
**Notes:** Fills `out` with serials of all non-mobile entities within Chebyshev distance `range` of `center`.

---

### Script_getObjectsInRangeOfType
**C:** `void Script_getObjectsInRangeOfType(CList *list, CLocation *loc, int range, int bodyType)`
**Wombat:** `void getObjectsInRangeOfType(list out, loc center, int range, int body_type)`
**Notes:** Fills `out` with serials of all entities within Chebyshev distance `range` of `center` whose body type matches `body_type`.

---

### Script_getObjectsInRangeWithFlags
**C:** `void Script_getObjectsInRangeWithFlags(CList *list, CLocation *loc, int range, int flags)`
**Wombat:** `void getObjectsInRangeWithFlags(list out, loc center, int range, int flags)`
**Notes:** Fills `out` with serials of all entities in nearby spatial blocks whose tiledata flags include all bits of `flags`; uses block proximity only, no per-tile distance check.

---

### Script_getObjectsInSpecRange
**C:** `void Script_getObjectsInSpecRange(CList *list, CLocation *loc, int minRange, int maxRange)`
**Wombat:** `void getObjectsInSpecRange(list out, loc center, int min_range, int max_range)`
**Notes:** Fills `out` with serials of non-mobile entities whose Chebyshev distance from `center` is strictly between `min_range` and `max_range`.

---

### Script_getObjectsOfTypeIn
**C:** `void Script_getObjectsOfTypeIn(CList *list, uint32_t containerSerial, int typeId)`
**Wombat:** `void getObjectsOfTypeIn(list list, obj containerSerial, int typeId)`
**Notes:** Recursively finds all items of the given body type inside a container (including nested containers and mobile equipment) and appends their serials to `list`. _(builtin [515])_

---

### Script_getObjectsOnMulti
**C:** `void Script_getObjectsOnMulti(CList *list, uint32_t serial)`
**Wombat:** `void getObjectsOnMulti(list result, obj entity)`
**Notes:** Fills `result` with the serials of all entities (players and items) on the multi owned by `entity`; unlike `getPlayersOnMulti`, no player filter is applied.

---

### Script_getObjListVar
**C:** `void Script_getObjListVar(CList *list, uint32_t serial, CString *varname)`
**Wombat:** `void getObjListVar(list dest, obj entity, string varname)`
**Notes:** Replaces `dest` with the contents of the named list-typed ObjVar; aborts the current thread if the ObjVar is missing.

---

### Script_getObjType
**C:** `int Script_getObjType(uint32_t serial)`
**Wombat:** `int getObjType(obj entity)`
**Notes:** Returns the entity's body type (graphic/tile ID).

---

### Script_getObjVar
**C:** `int Script_getObjVar(uint32_t serial, CString *varname)`
**Wombat:** `any getObjVar(obj entity, string varname)` _(aliases: none — compile-time placeholder; the compiler rewrites this to a typed variant before execution)_
**Notes:** Compile-time placeholder; never executed directly — the script compiler rewrites calls to one of the typed `getObjVar` variants.

---

### Script_getObjVar_int
**C:** `int Script_getObjVar_int(uint32_t serial, CString *varname)`
**Wombat:** `int getObjVar(obj entity, string varname)` _(aliases: getobjvar_int)_
**Notes:** Returns the int-typed ObjVar named `varname` on the entity, or 0 when absent.

---

### Script_getObjVar_loc
**C:** `CLocation *Script_getObjVar_loc(CLocation *retbuf, uint32_t serial, CString *varname)`
**Wombat:** `loc getObjVar(obj entity, string varname)` _(aliases: getobjvar_loc)_
**Notes:** Returns the location-typed ObjVar named `varname`, falling back to `(-1, -1, 0)` when absent.

---

### Script_getObjVar_obj
**C:** `uint32_t Script_getObjVar_obj(uint32_t serial, CString *varname)`
**Wombat:** `obj getObjVar(obj entity, string varname)` _(aliases: getobjvar_obj)_
**Notes:** Returns the object-serial ObjVar named `varname`, or 0 when absent.

---

### Script_getObjVar_str
**C:** `CString *Script_getObjVar_str(CString *retbuf, uint32_t serial, CString *varname)`
**Wombat:** `string getObjVar(obj entity, string varname)` _(aliases: getobjvar_str)_
**Notes:** Returns the string-typed ObjVar named `varname`, or an empty string when absent.

---

### Script_getOrcishSyllable
**C:** `CString *Script_getOrcishSyllable(CString *out, int index)`
**Wombat:** `string getOrcishSyllable(int index)` _(aliases: [404])_
**Notes:** Returns the (index % 215)-th syllable from the Orcish language table.

---

### Script_getPlayAge
**C:** `int Script_getPlayAge(uint32_t serial)`
**Wombat:** `int getPlayAge(obj player)`
**Notes:** Returns the player's accumulated play-time counter, or 0 when the serial is not a valid player.

---

### Script_getPlayerBugStat
**C:** `int Script_getPlayerBugStat(CList *list, int threshold)`
**Wombat:** `int getPlayerBugStat(list out, int threshold)` _(aliases: [726])_
**Notes:** Fills list with serials of all online players whose stat total (str+dex+int) is >= threshold, sorted; returns 1.

---

### Script_getPlayersAt
**C:** `void Script_getPlayersAt(CList *list, CLocation *loc)`
**Wombat:** `void getPlayersAt(list out, loc position)`
**Notes:** Fills `out` with serials of all players sharing the exact x/y/z of `position`.

---

### Script_getPlayersInRange
**C:** `void Script_getPlayersInRange(CList *list, CLocation *loc, int range)`
**Wombat:** `void getPlayersInRange(list out, loc center, int range)`
**Notes:** Fills `out` with serials of all players within `range` of `center` using the fast player entity-map index.

---

### Script_getPlayersOnMulti
**C:** `void Script_getPlayersOnMulti(CList *list, uint32_t serial)`
**Wombat:** `void getPlayersOnMulti(list result, obj entity)`
**Notes:** Fills `result` with the serials of all player entities currently on the multi owned by `entity`.

---

### Script_getPulseNum
**C:** `int Script_getPulseNum(void)`
**Wombat:** `int getPulseNum()`
**Notes:** Returns the current game tick count.

---

### Script_getQuality
**C:** `int Script_getQuality(uint32_t serial)`
**Wombat:** `int getQuality(obj entity)`
**Notes:** Returns the tiledata layer (equipment-slot) byte for the entity's body type, despite the name.

---

### Script_getQuantity
**C:** `int Script_getQuantity(uint32_t serial)`
**Wombat:** `int getQuantity(obj entity)`
**Notes:** Returns the entity's stack amount: 1 for plain items or the effective resource quantity for resource-flagged items.

---

### Script_getRattishSyllable
**C:** `CString *Script_getRattishSyllable(CString *out, int index)`
**Wombat:** `string getRattishSyllable(int index)` _(aliases: [407])_
**Notes:** Returns the (index % 103)-th syllable from the Ratman language table.

---

### Script_getRealDexterity
**C:** `int Script_getRealDexterity(uint32_t serial)`
**Wombat:** `int getRealDexterity(obj mobile)` _(index 370)_
**Notes:** Returns the mobile's base (unmodified) dexterity stat.

---

### Script_getRealIntelligence
**C:** `int Script_getRealIntelligence(uint32_t serial)`
**Wombat:** `int getRealIntelligence(obj mobile)` _(index 371)_
**Notes:** Returns the mobile's base (unmodified) intelligence stat.

---

### Script_getRealName
**C:** `CString *Script_getRealName(CString *out, uint32_t serial)`
**Wombat:** `string getRealName(obj mobile)`
**Notes:** Returns the mobile's real (non-disguised) name, or an empty string when the mobile is not found.

---

### Script_getRealStat
**C:** `int Script_getRealStat(uint32_t serial, int statId)`
**Wombat:** `int getRealStat(obj mobile, int statId)` _(index 376)_
**Notes:** Returns the mobile's base (unmodified) value for stat index `statId`.

---

### Script_getRealStrength
**C:** `int Script_getRealStrength(uint32_t serial)`
**Wombat:** `int getRealStrength(obj mobile)` _(index 369)_
**Notes:** Returns the mobile's base (unmodified) strength stat.

---

### Script_getRelayLoc
**C:** `CLocation *Script_getRelayLoc(CLocation *retloc, uint32_t serial)`
**Wombat:** `loc getRelayLoc(obj)` _(builtin 278)_
**Notes:** Returns the map origin `(g_mapStartX, g_mapStartY, 0)`; the `serial` argument is ignored entirely.

---

### Script_getResource
**C:** `int Script_getResource(int *outAmount, uint32_t serial, CString *resName, int resType, int flags)`
**Wombat:** `int getResource(int &outAmount, obj serial, string resName, int resType, int flags)`
**Notes:** Stores the quantity of the named resource on the entity in `outAmount`; flags 0 = template slot, 2 = ObjVar table. Returns 1 on success. _(builtin [548], typeSig `iIosii`)_

---

### Script_getResourceName
**C:** `CString *Script_getResourceName(CString *outStr, CString *inStr, int resId)`
**Wombat:** `string getResourceName(string inStr, int resId)`
**Notes:** Looks up the resource type by internal name `inStr` and returns its localized name selected by `resId` (0=food, 1=name1, 2=name2, 3=name3). _(builtin [550])_

---

### Script_getResourcesOnObj
**C:** `int Script_getResourcesOnObj(uint32_t serial, int flags, CList *list)`
**Wombat:** `int getResourcesOnObj(obj serial, int flags, list list)`
**Notes:** Appends the internal names of all resource nodes on the entity whose type matches `flags` to `list`; returns 1. _(builtin [549])_

---

### Script_getResourceTypeIdByName
**C:** `int Script_getResourceTypeIdByName(int *retval, CString *name)`
**Wombat:** `int getResourceTypeIdByName(int &retval, string name)`
**Notes:** Looks up a resource type by name and stores its numeric id in the out-param `retval`; returns 1 on hit, 0 if not found. _(builtin [551], typeSig `iIs`)_

---

### Script_getROBookTitle
**C:** `CString *Script_getROBookTitle(CString *out, int bookNum)`
**Wombat:** `string getROBookTitle(int bookNum)`
**Notes:** Returns the title string for read-only book number `bookNum`. _(builtin [705])_

---

### Script_getSatiety
**C:** `int Script_getSatiety(uint32_t serial)`
**Wombat:** `int getSatiety(obj mobile)` _(index 368)_
**Notes:** Returns the mobile's hunger byte, or 0 when not a valid mobile.

---

### Script_getScripts
**C:** `void Script_getScripts(CList *list, uint32_t serial)`
**Wombat:** `void getScripts(list out, obj entity)` _(aliases: [141])_
**Notes:** Appends the names of every script attached to the entity to list (clears list first).

---

### Script_getSeconds
**C:** `int Script_getSeconds(void)`
**Wombat:** `int getSeconds()` _(index 365)_
**Notes:** Returns the in-game seconds counter.

---

### Script_getSex
**C:** `int Script_getSex(uint32_t serial)`
**Wombat:** `int getSex(obj mobile)`
**Notes:** Returns 0 for male (body 0x190), 1 for female (body 0x191), 2 for other body types.

---

### Script_getSkillLevel
**C:** `int Script_getSkillLevel(uint32_t serial, int skillId)`
**Wombat:** `int getSkillLevel(obj mobile, int skillId)` _(index 391)_
**Notes:** Returns the mobile's effective skill value for `skillId` divided by 10 (coarse tens-of-skill representation).

---

### Script_getSkillLevelNoStat
**C:** `int Script_getSkillLevelNoStat(uint32_t serial, int skillId)`
**Wombat:** `int getSkillLevelNoStat(obj mobile, int skillId)` _(index 394)_
**Notes:** Returns the mobile's total skill (base + bonus) for `skillId` without the stat-blending adjustment.

---

### Script_getSkillLevelNoStatNoMod
**C:** `int Script_getSkillLevelNoStatNoMod(uint32_t serial, int skillId)`
**Wombat:** `int getSkillLevelNoStatNoMod(obj mobile, int skillId)` _(index 395)_
**Notes:** Returns the mobile's raw base skill value for `skillId` with no bonuses or stat blending applied.

---

### Script_getSkillLevelReal
**C:** `int Script_getSkillLevelReal(uint32_t serial, int skillId)`
**Wombat:** `int getSkillLevelReal(obj mobile, int skillId)` _(index 392)_
**Notes:** Returns the mobile's effective skill value for `skillId` without dividing by 10.

---

### Script_getSkillLevelRealStat
**C:** `int Script_getSkillLevelRealStat(uint32_t serial, int skillId)`
**Wombat:** `int getSkillLevelRealStat(obj mobile, int skillId)` _(index 393)_
**Notes:** Identical to `getSkillLevelReal`; returns the mobile's effective skill value for `skillId` unscaled (binary deduplication of the same call).

---

### Script_getSkillMod
**C:** `int Script_getSkillMod(uint32_t serial, int skillId)`
**Wombat:** `int getSkillMod(obj mobile, int skillId)` _(index 384)_
**Notes:** Returns the mobile's bonus modifier for `skillId`.

---

### Script_getSkillName
**C:** `CString *Script_getSkillName(CString *out, int skillId)`
**Wombat:** `string getSkillName(int skillId)` _(index 403)_
**Notes:** Stores the display name of `skillId` in the output string and returns it.

---

### Script_getSkillNumber
**C:** `int Script_getSkillNumber(CString *skillName)`
**Wombat:** `int getSkillNumber(string skillName)` _(index 402)_
**Notes:** Looks up the skill index for `skillName`; returns −1 when no match is found.

---

### Script_getSkillSuccessChance
**C:** `int Script_getSkillSuccessChance(uint32_t serial, int skillId, int difficulty, int range)`
**Wombat:** `int getSkillSuccessChance(obj mobile, int skillId, int difficulty, int range)` _(index 410)_
**Notes:** Returns the computed success chance for `mobile` attempting `skillId` at the given `difficulty` (−1000 to 2000) and `range` (10–100); returns 0 or 1 outside those bounds.

---

### Script_getSkillTotal
**C:** `int Script_getSkillTotal(uint32_t serial)`
**Wombat:** `int getSkillTotal(obj)` _(builtin 321)_
**Notes:** Returns the sum of all base skills on the mobile by iterating over every skill index from `CSkillManager_GetMaxSkills`.

---

### Script_getSmallestArea
**C:** `int Script_getSmallestArea(uintptr_t outName_str, uint32_t *loc)`
**Wombat:** `int getSmallestArea(string &outName, loc loc)`
**Notes:** Stores the name of the smallest-area region containing `loc` in `outName`; returns 1 on hit, 0 if no region contains the location. _(builtin [577], typeSig `iSc`)_

---

### Script_getStat
**C:** `int Script_getStat(uint32_t serial, int statId)`
**Wombat:** `int getStat(obj mobile, int statId)` _(index 375)_
**Notes:** Returns the mobile's effective value (base + bonus) for the given stat index (0=STR, 1=DEX, 2=INT).

---

### Script_getStatAttributeMax
**C:** `int Script_getStatAttributeMax(uint32_t serial, int statId)`
**Wombat:** `int getStatAttributeMax(obj mobile, int statId)` _(index 377)_
**Notes:** Returns max HP (`statId`=0), max stamina (`statId`=1), or max mana (`statId`=2) for `mobile`; returns 0 for other stat IDs.

---

### Script_getStaticObjectsAt
**C:** `void Script_getStaticObjectsAt(CList *list, CLocation *loc)`
**Wombat:** `void getStaticObjectsAt(list list, loc loc)` _(aliases: getStaticObjectsAtXY)_
**Notes:** Fills `list` with the art ids of every static item at the (x, y) of `loc`, ignoring z. _(builtins [493], [494])_

---

### Script_getStaticObjectsAtXYZ
**C:** `void Script_getStaticObjectsAtXYZ(CList *list, CLocation *loc)`
**Wombat:** `void getStaticObjectsAtXYZ(list list, loc loc)`
**Notes:** Like `getStaticObjectsAt` but additionally matches z, so only statics at the exact (x, y, z) are appended. _(builtin [495])_

---

### Script_getStatMod
**C:** `int Script_getStatMod(uint32_t serial, int statId)`
**Wombat:** `int getStatMod(obj mobile, int statId)` _(index 382)_
**Notes:** Returns the mobile's bonus modifier for stat index `statId`.

---

### Script_getStatus
**C:** `int Script_getStatus(uint32_t serial, int bit)`
**Wombat:** `int getStatus(obj entity, int bit)` _(aliases: [721])_
**Notes:** Returns 1 if the item flag bit is set on the entity.

---

### Script_getStrength
**C:** `int Script_getStrength(uint32_t serial)`
**Wombat:** `int getStrength(obj mobile)` _(index 372)_
**Notes:** Returns the mobile's effective strength (base + bonus).

---

### Script_getSurfaceHeight
**C:** `int Script_getSurfaceHeight(uint32_t serial)`
**Wombat:** `int getSurfaceHeight(obj entity)`
**Notes:** Returns the entity's walkable surface height (the z-offset clients step onto when standing on the entity). Uses the `"getHeight"` context string internally (copy-paste artifact).

---

### Script_getTargets
**C:** `void Script_getTargets(CList *list, uint32_t serial)`
**Wombat:** `void getTargets(list out, obj mobile)` _(index 615)_
**Notes:** Clears `out` then appends the serial of every entity in the mobile's combat target list.

---

### Script_getTemplate
**C:** `int Script_getTemplate(uint32_t serial)`
**Wombat:** `int getTemplate(obj serial)`
**Notes:** Returns the entity's template index (lower 16 bits), or 0 if the serial is unknown. _(builtin [483])_

---

### Script_getTerrainFlags
**C:** `int Script_getTerrainFlags(int tileID, int mask)`
**Wombat:** `int getTerrainFlags(int tile_id, int mask)`
**Notes:** Returns the land-tile data flags for `tile_id` masked with `mask`, or 0 when `tile_id` is outside `[0, 0x3FFF]`.

---

### Script_getTile
**C:** `int Script_getTile(CLocation *loc)`
**Wombat:** `int getTile(loc location)` _(aliases: [758])_
**Notes:** Returns the land-tile art ID at loc.

---

### Script_getTileAt
**C:** `int Script_getTileAt(CLocation *loc)`
**Wombat:** `int getTileAt(loc position)`
**Notes:** Returns the land tile ID at `position`, or 0 when the coordinates fall outside the world bounds.

---

### Script_getTileHeight
**C:** `int Script_getTileHeight(int type)`
**Wombat:** `int getTileHeight(int type)`
**Notes:** Returns the tiledata quantity (height) byte for body type `type`, or 0 when `type` is out of range `[0, 0x4000]`.

---

### Script_getTimeSecs
**C:** `int Script_getTimeSecs(void)`
**Wombat:** `int getTimeSecs()` _(aliases: [710])_
**Notes:** Returns the current millisecond tick counter (GetTickCount_UO).

---

### Script_getTitledName
**C:** `CString *Script_getTitledName(CString *out, uint32_t serial)`
**Wombat:** `string getTitledName(obj player)`
**Notes:** Returns the player's paperdoll title string (e.g. "Lord John Smith"), or "Flobbitz" when the player is not found.

---

### Script_getTopmostContainer
**C:** `uint32_t Script_getTopmostContainer(uint32_t serial)`
**Wombat:** `obj getTopmostContainer(obj serial)`
**Notes:** Walks the parent chain of the entity and returns the serial of the topmost container, or 0 if the entity is not contained. _(builtin [259])_

---

### Script_getTrammelPhase
**C:** `int Script_getTrammelPhase(void)`
**Wombat:** `int getTrammelPhase()`
**Notes:** Returns the current Trammel moon phase (0–7). _(builtin [579])_

---

### Script_getValue
**C:** `int Script_getValue(uint32_t serial)`
**Wombat:** `int getValue(obj)` _(builtin 273)_
**Notes:** Returns the item's current value via `VT_GET_VALUE`; returns 0 for missing or invalid entities.

---

### Script_getVisableTargets
**C:** `void Script_getVisableTargets(CList *list, uint32_t serial)`
**Wombat:** `void getVisableTargets(list list, obj serial)`
**Notes:** Fills `list` with the serials of all visible (non-hidden) combat targets of the mobile. _(builtin [616])_

---

### Script_getWeapon
**C:** `uint32_t Script_getWeapon(uint32_t serial)`
**Wombat:** `obj getWeapon(obj mobile)` _(index 356)_
**Notes:** Returns the serial of the weapon currently wielded by `mobile`, or 0 when none.

---

### Script_getWeaponClass
**C:** `void Script_getWeaponClass(uint32_t serial, int *outNumDice, int *outDiceFaces, int *outBonus, int *outPad)`
**Wombat:** `void getWeaponClass(obj entity, int& numDice, int& diceFaces, int& bonus, int& pad)` _(index 598)_
**Notes:** Reads the damage dice (weapons) or armor-rating dice (mobiles) and unpacks them into four out-param integers; `pad` is always 0.

---

### Script_getWeaponCurHP
**C:** `int Script_getWeaponCurHP(uint32_t serial)`
**Wombat:** `int getWeaponCurHP(obj weapon)` _(index 600)_
**Notes:** Returns the weapon's current durability, or −1 when the weapon is invalid.

---

### Script_getWeaponHandedness
**C:** `int Script_getWeaponHandedness(uint32_t serial)`
**Wombat:** `int getWeaponHandedness(obj weapon)` _(index 595)_
**Notes:** Returns the weapon's handedness value via the weapon template.

---

### Script_getWeaponHitSfx
**C:** `int Script_getWeaponHitSfx(uint32_t serial)`
**Wombat:** `int getWeaponHitSfx(obj weapon)` _(index 606)_
**Notes:** Returns the weapon's hit sound effect ID, or 0 when invalid.

---

### Script_getWeaponMaxHP
**C:** `int Script_getWeaponMaxHP(uint32_t serial)`
**Wombat:** `int getWeaponMaxHP(obj weapon)` _(index 602)_
**Notes:** Returns the weapon's maximum durability, or −1 when the weapon is invalid.

---

### Script_getWeaponMinRange
**C:** `int Script_getWeaponMinRange(uint32_t serial)`
**Wombat:** `int getWeaponMinRange(obj weapon)` _(index 594)_
**Notes:** Returns the weapon's minimum range byte, or −1 when invalid.

---

### Script_getWeaponMinStr
**C:** `int Script_getWeaponMinStr(uint32_t serial)`
**Wombat:** `int getWeaponMinStr(obj weapon)` _(index 604)_
**Notes:** Returns the weapon's minimum strength requirement, or −1 when the weapon is invalid.

---

### Script_getWeaponMissSfx
**C:** `int Script_getWeaponMissSfx(uint32_t serial)`
**Wombat:** `int getWeaponMissSfx(obj weapon)` _(index 607)_
**Notes:** Returns the weapon's miss sound effect ID, or 0 when invalid.

---

### Script_getWeaponName
**C:** `CString *Script_getWeaponName(CString *out, uint32_t weaponSerial)`
**Wombat:** `string getWeaponName(obj weapon)` _(index 596)_
**Notes:** Stores the weapon's display name in `out`; returns an empty string when invalid.

---

### Script_getWeaponRange
**C:** `int Script_getWeaponRange(uint32_t serial)`
**Wombat:** `int getWeaponRange(obj weapon)` _(index 593)_
**Notes:** Returns the weapon's melee range byte, or −1 when invalid.

---

### Script_getWeaponSpeed
**C:** `int Script_getWeaponSpeed(uint32_t serial)`
**Wombat:** `int getWeaponSpeed(obj weapon)` _(index 605)_
**Notes:** Returns the weapon's speed byte from its definition, or −10 when invalid.

---

### Script_getWeek
**C:** `int Script_getWeek(void)`
**Wombat:** `int getWeek()` _(index 361)_
**Notes:** Returns the in-game week counter.

---

### Script_getWeight
**C:** `int Script_getWeight(uint32_t serial)`
**Wombat:** `int getWeight(obj)` _(builtin 276)_
**Notes:** Returns the entity's total weight (including contained items) via `VT_GET_WEIGHT`.

---

### Script_getWispishSyllable
**C:** `CString *Script_getWispishSyllable(CString *out, int index)`
**Wombat:** `string getWispishSyllable(int index)` _(aliases: [405])_
**Notes:** Returns the (index % 43)-th syllable from the Wisp language table.

---

### Script_getX
**C:** `int Script_getX(const CLocation *loc)`
**Wombat:** `int getX(loc loc)`
**Notes:** Returns the x component of a loc value. _(builtin [501])_

---

### Script_getY
**C:** `int Script_getY(const CLocation *loc)`
**Wombat:** `int getY(loc loc)`
**Notes:** Returns the y component of a loc value. _(builtin [502])_

---

### Script_getYear
**C:** `int Script_getYear(void)`
**Wombat:** `int getYear()` _(index 359)_
**Notes:** Returns the in-game year counter.

---

### Script_getZ
**C:** `int Script_getZ(const CLocation *loc)`
**Wombat:** `int getZ(loc loc)`
**Notes:** Returns the z component of a loc value. _(builtin [503])_

---

### Script_giveItem
**C:** `uint32_t Script_giveItem(uint32_t mobSerial, uint32_t itemSerial)`
**Wombat:** `obj giveItem(obj mobile, obj item)`
**Notes:** Places `item` into the first accessible container found in `mobile`'s equipment slots; returns the container's serial or 0 when no suitable container exists.

---

### Script_goLoiter
**C:** `void Script_goLoiter(uint32_t serial, CLocation *loc, int range)`
**Wombat:** `void goLoiter(obj npc, loc destination, int range)`
**Notes:** Tells the NPC to wander within `range` tiles of `destination` (rather than its current location).

---

### Script_goSleep
**C:** `int Script_goSleep(uint32_t serial, int steps, int returnState)`
**Wombat:** `int goSleep(obj npc, int steps, int returnState)`
**Notes:** Tells the NPC to wander for `steps` ticks, then transition to `returnState` (must be in [0, 13]); returns 1 on success, 0 on failure.

---

### Script_handleHealthGain
**C:** `void Script_handleHealthGain(uint32_t serial)`
**Wombat:** `void handleHealthGain(obj)` _(builtin 329)_
**Notes:** Sends a stat update to notify clients of the mobile's current HP via `VT_SEND_HP_UPDATE`; does not change the HP value.

---

### Script_handleWatchingSkill
**C:** `void Script_handleWatchingSkill(uint32_t serial, int skillId)`
**Wombat:** `void handleWatchingSkill(obj mobile, int skillId)` _(index 408)_
**Notes:** Awards a passive observation gain on `skillId` for `mobile` at 100% cap.

---

### Script_hasCallback
**C:** `int Script_hasCallback(uint32_t serial, int callbackId)`
**Wombat:** `int hasCallback(obj entity, int callbackId)`
**Notes:** Returns 1 when the entity has a scheduled type-5 callback with the given `callbackId`.

---

### Script_hasCallbackAdvanced
**C:** `int Script_hasCallbackAdvanced(uint32_t serial, int eventType, int callbackId)`
**Wombat:** `int hasCallbackAdvanced(obj entity, int eventType, int callbackId)`
**Notes:** Same as `hasCallback` but checks for the caller-specified `eventType`.

---

## Messaging

### Script_hasHome
**C:** `int Script_hasHome(uint32_t serial)`
**Wombat:** `int hasHome(obj serial)`
**Notes:** Returns 1 if the NPC has the home-location behavior flag set. _(builtin [489])_

---

### Script_hasObj
**C:** `int Script_hasObj(uint32_t mobSerial, uint32_t objSerial)`
**Wombat:** `int hasObj(obj mobSerial, obj objSerial)`
**Notes:** Returns 1 if the mobile has the specified item (by serial) in any equipment slot or nested container. _(builtin [553])_

---

### Script_hasObjEquipped
**C:** `int Script_hasObjEquipped(uint32_t mobSerial, uint32_t objSerial)`
**Wombat:** `int hasObjEquipped(obj mobile, obj item)` _(index 352)_
**Notes:** Returns 1 when `item` is currently equipped in any of the 26 equipment slots on `mobile`.

---

### Script_hasObjListVar
**C:** `int Script_hasObjListVar(uint32_t serial, CString *varname)`
**Wombat:** `int hasObjListVar(obj entity, string varname)`
**Notes:** Returns 1 if the entity has a list-typed ObjVar named `varname`, 0 otherwise.

---

### Script_hasObjType
**C:** `int Script_hasObjType(uint32_t mobSerial, int type)`
**Wombat:** `int hasObjType(obj mobSerial, int type)`
**Notes:** Returns 1 if the mobile has any item of the given body type in equipment slots or nested containers. _(builtin [554])_

---

### Script_hasObjTypeEquipped
**C:** `int Script_hasObjTypeEquipped(uint32_t serial, int type)`
**Wombat:** `int hasObjTypeEquipped(obj mobile, int type)` _(index 353)_
**Notes:** Returns 1 when any item whose body type equals `type` is equipped on `mobile`; rejects types above 0x4000.

---

### Script_hasObjTypeInBank
**C:** `int Script_hasObjTypeInBank(uint32_t mobSerial, int type)`
**Wombat:** `int hasObjTypeInBank(obj mobSerial, int type)`
**Notes:** Returns 1 if the mobile's bank box (equipment slot 29) contains an item of the given body type. _(builtin [555])_

---

### Script_hasObjVar
**C:** `int Script_hasObjVar(uint32_t serial, CString *varname)`
**Wombat:** `int hasObjVar(obj entity, string varname)`
**Notes:** Returns 1 when the entity has any ObjVar with the given name (type-agnostic check, WTYPE=7).

---

## Internal Helpers (not Wombat builtins)

### Script_hasResource
**C:** `int Script_hasResource(uint32_t serial, int resourceTypeId)`
**Wombat:** `int hasResource(obj serial, int resourceTypeId)`
**Notes:** Returns 1 if the entity carries any resource node of the given type id. _(builtin [552])_

---

### Script_hasScript
**C:** `int Script_hasScript(uint32_t serial, CString *scriptName)`
**Wombat:** `int hasscript(obj entity, string scriptName)` _(aliases: hasscript, hasScript)_
**Notes:** Returns 1 when the entity has the named script attached.

---

### Script_hasShopKeyword
**C:** `int Script_hasShopKeyword(CList *list)`
**Wombat:** `int hasShopKeyword(list list)`
**Notes:** Returns 1 if `list` contains any of the shop-related keywords (buy, trade, commerce, merchant, shop, purchase, business, open, shopkeeper, trader, tradesman, shopkeep), case-insensitive. _(builtin [498])_

---

### Script_initArray
**C:** `void Script_initArray(int id, int width, int height, CList *typeList)`
**Wombat:** `void initArray(int id, int width, int height, list typeList)`
**Notes:** Creates or retrieves the array by ID, then initializes it with the given dimensions and column type list.

---

### Script_initArrayFromFile
**C:** `void Script_initArrayFromFile(int id, int width, int height, CString *filename)`
**Wombat:** `void initArrayFromFile(int id, int width, int height, string filename)`
**Notes:** Opens a tab-delimited file, auto-detects dimensions if width/height <= 0, and fills the array from its contents (header row defines column types: int/str/ustr).

---

### Script_inJusticeRegion
**C:** `int Script_inJusticeRegion(CLocation *loc)`
**Wombat:** `int inJusticeRegion(loc position)`
**Notes:** Returns 1 when the specified location lies in a justice (criminal flag) region.

---

### Script_insert
**C:** `void Script_insert(CList *list, uintptr_t typeTag, uintptr_t value, int index)`
**Wombat:** `void insert(list list, any value, int index)` _(aliases: insert, insertInList)_
**Notes:** Inserts a typed element into `list` at `index`; aborts the thread when index is out of range.

---

### Script_interpose
**C:** `CLocation *Script_interpose(CLocation *outLoc, CLocation *loc1, const CLocation *loc2)`
**Wombat:** `loc interpose(loc a, loc b)`
**Notes:** Stores the midpoint between `a` and `b` (z taken from `a`) in the return location; also overwrites `a` with the midpoint as a side effect.

---

### Script_intRet
**C:** `void Script_intRet(int value)`
**Wombat:** `void intRet(int value)`
**Notes:** Stores `value` into the global script return value so combat code can read it as a damage override after event 0x22 returns.

---

### Script_isAnyMultiAt
**C:** `uint32_t Script_isAnyMultiAt(CLocation *loc)`
**Wombat:** `obj isAnyMultiAt(loc position)`
**Notes:** Returns the owning serial of any multi at the given XY location (Z ignored), or 0.

---

### Script_isAnyMultiBelow
**C:** `uint32_t Script_isAnyMultiBelow(CLocation *loc)`
**Wombat:** `obj isAnyMultiBelow(loc position)`
**Notes:** Returns the owning serial of any multi at or below the given location, or 0.

---

### Script_isArmed
**C:** `int Script_isArmed(uint32_t serial)`
**Wombat:** `int isArmed(obj mobile)` _(index 357)_
**Notes:** Returns 1 when `mobile` currently wields a weapon.

---

### Script_isArrayInit
**C:** `int Script_isArrayInit(int id)`
**Wombat:** `int isArrayInit(int id)`
**Notes:** Returns 1 if the array with the given ID exists and has been initialized (data != NULL), 0 otherwise.

---

### Script_isAtHome
**C:** `int Script_isAtHome(uint32_t serial)`
**Wombat:** `int isAtHome(obj serial)`
**Notes:** Returns 1 if the entity is at its home location according to the engine's home-location check. _(builtin [487])_

---

### Script_isBashing
**C:** `int Script_isBashing(uint32_t serial)`
**Wombat:** `int isBashing(obj weapon)` _(index 586)_
**Notes:** Returns 1 when the weapon's type flags include the bashing type.

---

### Script_isChaosGuard
**C:** `int Script_isChaosGuard(uint32_t serial)`
**Wombat:** `int isChaosGuard(obj mobile)` _(aliases: [286])_
**Notes:** Returns 1 if the mobile is using the Chaos shield or has the "chaos" ObjVar with an active Chaos timer (type 0x12).

---

### Script_isContainer
**C:** `int Script_isContainer(uint32_t serial)`
**Wombat:** `int isContainer(obj entity)`
**Notes:** Returns 1 if the entity is a container (including corpses and other container-derived types).

---

### Script_isCorpse
**C:** `int Script_isCorpse(uint32_t serial)`
**Wombat:** `int isCorpse(obj entity)`
**Notes:** Returns 1 when the entity is a valid corpse object, 0 otherwise.

---

### Script_isCounselor
**C:** `int Script_isCounselor(uint32_t serial)`
**Wombat:** `int isCounselor(obj player)` _(aliases: [724])_
**Notes:** Returns 1 if the player has the counselor flag set.

---

### Script_isCriminal
**C:** `int Script_isCriminal(uint32_t serial)`
**Wombat:** `int isCriminal(obj mobile)` _(aliases: [562])_
**Notes:** Returns 1 if the mobile has an active criminal flag.

---

### Script_isDead
**C:** `int Script_isDead(uint32_t serial)`
**Wombat:** `int isDead(obj entity)`
**Notes:** Returns 1 if the mobile is dead.

---

### Script_isEditing
**C:** `int Script_isEditing(uint32_t serial)`
**Wombat:** `int isEditing(obj player)` _(aliases: [723])_
**Notes:** Returns 1 if the player is in editing (god) mode.

---

### Script_isEquipped
**C:** `int Script_isEquipped(uint32_t serial)`
**Wombat:** `int isEquipped(obj entity)`
**Notes:** Returns 1 if the entity is currently equipped on a mobile.

---

### Script_isFacingPerson
**C:** `int Script_isFacingPerson(uint32_t serial, uint32_t targetSerial)`
**Wombat:** `int isFacingPerson(obj mobile, obj target)`
**Notes:** Returns 1 when the mobile's facing direction matches the bearing toward `target`.

---

### Script_isFacingPlace
**C:** `int Script_isFacingPlace(uint32_t serial, CLocation *loc)`
**Wombat:** `int isFacingPlace(obj mobile, loc position)`
**Notes:** Returns 1 when the mobile's facing direction matches the bearing from its position to `position`.

---

### Script_isFreelyUsable
**C:** `int Script_isFreelyUsable(uint32_t thingSerial, uint32_t playerSerial)`
**Wombat:** `int isFreelyUsable(obj thing, obj player)`
**Notes:** Returns 1 when `player` can use `thing` without additional permission checks.

---

### Script_isFreelyViewable
**C:** `int Script_isFreelyViewable(uint32_t thingSerial, uint32_t playerSerial)`
**Wombat:** `int isFreelyViewable(obj thing, obj player)`
**Notes:** Returns 1 when `player` can see/inspect `thing` without additional permission checks.

---

### Script_isGameMaster
**C:** `int Script_isGameMaster(uint32_t serial)`
**Wombat:** `int isGameMaster(obj player)` _(aliases: [725])_
**Notes:** Returns 1 if the player has the game master (GM) flag set.

---

### Script_isGeneric
**C:** `int Script_isGeneric(uint32_t serial)`
**Wombat:** `int isGeneric(obj entity)` _(aliases: [702])_
**Notes:** Returns 1 if the entity is currently a generic stackable resource item (HasResourceFlag is set).

---

### Script_isGoldAccount
**C:** `int Script_isGoldAccount(uint32_t serial)`
**Wombat:** `int isGoldAccount(obj player)`
**Notes:** Returns 1 when the player's account is flagged as gold-tier, 0 otherwise.

---

### Script_isGuard
**C:** `int Script_isGuard(uint32_t serial)`
**Wombat:** `int isGuard(obj entity)`
**Notes:** Returns 1 if the entity is a guard NPC.

---

### Script_isHair
**C:** `int Script_isHair(uint32_t serial)`
**Wombat:** `int isHair(obj entity)` _(aliases: [722])_
**Notes:** Returns 1 if the entity is a wearable item in the hair (layer 0xB) or facial-hair (layer 0x10) slot.

---

### Script_isHidden
**C:** `int Script_isHidden(uint32_t serial)`
**Wombat:** `int isHidden(obj entity)`
**Notes:** Returns 1 when the entity has its hidden flag set.

---

### Script_isHousingOkay
**C:** `int Script_isHousingOkay(CLocation *loc, int arg)`
**Wombat:** `int isHousingOkay(loc position, int arg)`
**Notes:** Returns 1 when the specified location lies in a region that permits housing placement.

---

### Script_isHuman
**C:** `int Script_isHuman(uint32_t serial)`
**Wombat:** `int isHuman(obj mobile)`
**Notes:** Returns 1 when the mobile uses a human or creature body type (as defined by `CMobile_IsCreatureBody`).

---

### Script_isHumanBodyType
**C:** `int Script_isHumanBodyType(uint32_t serial)`
**Wombat:** `int isHumanBodyType(obj mobile)`
**Notes:** Returns 1 when the mobile uses a human-shaped body type specifically.

---

### Script_isInArea
**C:** `int Script_isInArea(uintptr_t namePrefix_str, uint32_t *loc, int flag)`
**Wombat:** `int isInArea(string namePrefix, loc location, int flag)` _(aliases: [530])_
**Notes:** Returns 1 if loc falls within any region whose name begins with namePrefix; flag 0 = main region table, 1 = by-name table.

---

### Script_isInCamp
**C:** `int Script_isInCamp(uint32_t serial)`
**Wombat:** `int isInCamp(obj)` _(builtin 275)_
**Notes:** Returns 1 when the player is standing near a campfire.

---

### Script_isInCityRegion
**C:** `int Script_isInCityRegion(CLocation *loc)`
**Wombat:** `int isInCityRegion(loc position)`
**Notes:** Returns 1 when the specified location lies in a city region.

---

### Script_isInContainer
**C:** `int Script_isInContainer(uint32_t serial)`
**Wombat:** `int isInContainer(obj entity)`
**Notes:** Returns 1 if the entity is currently inside a container.

---

### Script_isinlist
**C:** `int Script_isinlist(CList *list, uintptr_t type, uintptr_t value)`
**Wombat:** `int isinlist(list list, any value)` _(aliases: isinlist, isInList)_
**Notes:** Returns 1 when the given typed value is present in `list`.

---

### Script_isInMap
**C:** `int Script_isInMap(CLocation *loc)`
**Wombat:** `int isInMap(loc position)`
**Notes:** Returns 1 when `position` lies inside the playable map bounds.

---

### Script_isInObjVarListSet
**C:** `int Script_isInObjVarListSet(uint32_t serial, CString *varname, int typeTag, uintptr_t value)`
**Wombat:** `int isInObjVarListSet(obj entity, string varname, any value)`
**Notes:** Returns 1 when `value` appears in the list-typed ObjVar `varname`.

---

### Script_isInRegionWithPrefix
**C:** `int Script_isInRegionWithPrefix(uintptr_t prefix_str, uint32_t *loc)`
**Wombat:** `int isInRegionWithPrefix(string prefix, loc loc)`
**Notes:** Returns 1 if `loc` lies within any region whose name starts with `prefix`. _(builtin [578], typeSig `iSc`)_

---

### Script_isInvisible
**C:** `int Script_isInvisible(uint32_t serial)`
**Wombat:** `int isInvisible(obj entity)`
**Notes:** Returns 1 when the entity has its hidden flag set; functionally identical to `isHidden` but accepts any entity (not just mobiles).

---

### Script_isInvulnerable
**C:** `int Script_isInvulnerable(uint32_t serial)`
**Wombat:** `int isInvulnerable(obj mobile)`
**Notes:** Returns 1 when the mobile has the invulnerable status flag set.

---

### Script_isInWorld
**C:** `int Script_isInWorld(CLocation *loc)`
**Wombat:** `int isInWorld(loc position)`
**Notes:** Returns 1 when `position` falls within the absolute world coordinate bounds (broader check than `isInMap`).

---

### Script_isManifesting
**C:** `int Script_isManifesting(uint32_t serial)`
**Wombat:** `int isManifesting(obj player)` _(aliases: [729])_
**Notes:** Returns 1 if the player's manifesting flag (pflags & 0x20) is set.

---

### Script_isMap
**C:** `int Script_isMap(uint32_t serial)`
**Wombat:** `int isMap(obj entity)` _(aliases: isMap [index 674 also maps here])_
**Notes:** Returns 1 if the entity is a map item.

---

### Script_isMobile
**C:** `int Script_isMobile(uint32_t serial)`
**Wombat:** `int isMobile(obj entity)`
**Notes:** Returns 1 if the entity is a mobile (NPC or player).

---

### Script_isMoveable
**C:** `int Script_isMoveable(uint32_t thingSerial, uint32_t playerSerial)`
**Wombat:** `int isMoveable(obj thing, obj player)`
**Notes:** Returns 1 when `player` is allowed to pick up and move `thing`.

---

### Script_isMultiComp
**C:** `int Script_isMultiComp(uint32_t serial)`
**Wombat:** `int isMultiComp(obj entity)`
**Notes:** Returns 1 when the entity is a component of a multi structure (has a non-null multi pointer).

---

### Script_isMultiSlave
**C:** `int Script_isMultiSlave(uint32_t serial)`
**Wombat:** `int isMultiSlave(obj entity)`
**Notes:** Returns 1 when the entity is a slave component of a multi (same check as `isMultiComp`).

---

### Script_isMurderer
**C:** `int Script_isMurderer(uint32_t serial)`
**Wombat:** `int isMurderer(obj entity)` _(aliases: [563])_
**Notes:** Returns 1 if the mobile is flagged as a murderer.

---

### Script_isNoDrawType
**C:** `int Script_isNoDrawType(int bodyType)`
**Wombat:** `int isNoDrawType(int bodyType)`
**Notes:** Returns 1 when `bodyType` refers to a tile flagged as non-rendered (NoDraw); returns 0 for out-of-range values.

---

### Script_isNPC
**C:** `int Script_isNPC(uint32_t serial)`
**Wombat:** `int isNPC(obj entity)`
**Notes:** Returns 1 if the entity is an NPC mobile.

---

### Script_isObscene
**C:** `int Script_isObscene(CString *text)`
**Wombat:** `int isObscene(string text)` _(aliases: [748])_
**Notes:** Returns 1 if text contains profanity or reserved words according to the server's three-list filter.

---

### Script_isOnAnyMulti
**C:** `uint32_t Script_isOnAnyMulti(uint32_t entitySerial)`
**Wombat:** `obj isOnAnyMulti(obj entity)`
**Notes:** Returns the owning serial of any multi that `entity` is standing on, or 0.

---

### Script_isOnline
**C:** `int Script_isOnline(uint32_t serial)`
**Wombat:** `int isOnline(obj entity)`
**Notes:** Returns 1 when the serial belongs to a currently logged-in player (pflags bit 2 set).

---

### Script_isOnMulti
**C:** `int Script_isOnMulti(uint32_t entitySerial, uint32_t multiSerial)`
**Wombat:** `int isOnMulti(obj entity, obj multi)`
**Notes:** Returns 1 when `entity`'s location is within the bounds of the multi owned by `multi`.

---

### Script_isOrderGuard
**C:** `int Script_isOrderGuard(uint32_t serial)`
**Wombat:** `int isOrderGuard(obj mobile)` _(aliases: [285])_
**Notes:** Returns 1 if the mobile is using the Order virtue shield or has the "order" ObjVar with an active Order timer (type 0x13).

---

### Script_isOwnedPet
**C:** `int Script_isOwnedPet(uint32_t serial)`
**Wombat:** `int isOwnedPet(obj mobile)`
**Notes:** Returns 1 when the mobile has at least one owner registered in its `myBoss` ObjVar list.

---

### Script_isPiercing
**C:** `int Script_isPiercing(uint32_t serial)`
**Wombat:** `int isPiercing(obj weapon)` _(index 585)_
**Notes:** Returns 1 when the weapon's type flags include the piercing bit (0x02).

---

### Script_isPlayer
**C:** `int Script_isPlayer(uint32_t serial)`
**Wombat:** `int isPlayer(obj entity)`
**Notes:** Returns 1 if the entity is a player character.

---

### Script_isRanged
**C:** `int Script_isRanged(uint32_t serial)`
**Wombat:** `int isRanged(obj weapon)` _(index 587)_
**Notes:** Returns 1 when the weapon is a ranged type (bow or crossbow).

---

### Script_isRealContainer
**C:** `int Script_isRealContainer(uint32_t serial)`
**Wombat:** `int isRealContainer(obj entity)`
**Notes:** Returns 1 only if the entity is a plain `CContainer`, not a subtype like corpse or spellbook.

---

### Script_isReallyWeapon
**C:** `int Script_isReallyWeapon(uint32_t serial)`
**Wombat:** `int isReallyWeapon(obj entity)` _(index 367)_
**Notes:** Returns 1 only when `entity` is a hand-slot weapon with melee or ranged damage flags (excludes shields).

---

### Script_isRidable
**C:** `int Script_isRidable(uint32_t serial)`
**Wombat:** `int isRidable(obj)` _(builtin 282)_
**Notes:** Returns 1 when the mobile can be mounted (`CMobile_IsRideable`).

---

### Script_isRiding
**C:** `int Script_isRiding(uint32_t serial)`
**Wombat:** `int isRiding(obj)` _(builtin 283)_
**Notes:** Returns 1 when the mobile is currently mounted (`CMobile_IsMounted`).

---

### Script_isShopkeeper
**C:** `int Script_isShopkeeper(uint32_t serial)`
**Wombat:** `int isShopkeeper(obj entity)`
**Notes:** Returns 1 if the entity is a shopkeeper NPC.

---

### Script_isSlashing
**C:** `int Script_isSlashing(uint32_t serial)`
**Wombat:** `int isSlashing(obj weapon)` _(index 584)_
**Notes:** Returns 1 when the weapon's type flags include the slashing bit (0x01).

---

### Script_isSpellbook
**C:** `int Script_isSpellbook(uint32_t serial)`
**Wombat:** `int isSpellbook(obj entity)`
**Notes:** Returns 1 if the entity is a spellbook.

---

### Script_isUsingVirtueShield
**C:** `int Script_isUsingVirtueShield(uint32_t serial)`
**Wombat:** `int isUsingVirtueShield(obj mobile)` _(aliases: [287])_
**Notes:** Returns 1 if the mobile is using either the Order or Chaos virtue shield.

---

### Script_isValid
**C:** `int Script_isValid(uint32_t serial)`
**Wombat:** `int isValid(obj serial)`
**Notes:** Returns 1 if `serial` resolves to a live entity in the world, 0 otherwise. _(builtin [482])_

---

### Script_isValidMap
**C:** `int Script_isValidMap(uint32_t serial)`
**Wombat:** `int isValidMap(obj entity)`
**Notes:** Returns 1 when the entity is a map item with nonzero width and height extents.

---

### Script_isVirtueGuard
**C:** `int Script_isVirtueGuard(uint32_t serial)`
**Wombat:** `int isVirtueGuard(obj mobile)` _(aliases: [284])_
**Notes:** Returns 1 if the mobile qualifies as either an Order guard or a Chaos guard.

---

### Script_isWeapon
**C:** `int Script_isWeapon(uint32_t serial)`
**Wombat:** `int isWeapon(obj entity)` _(index 366)_
**Notes:** Returns 1 when `entity` is a weapon item (vtable IsWeapon check).

---

### Script_logEntry
**C:** `void Script_logEntry(int type, int subtype, uint32_t serial, CString *str1, CString *str2, CString *str3, CString *str4)`
**Wombat:** `void logEntry(int type, int subtype, obj serial, string str1, string str2, string str3, string str4)` _(aliases: [749])_
**Notes:** Forwards an event record to the global event logger (no-op in the demo build).

---

### Script_logOut
**C:** `void Script_logOut(uint32_t serial)`
**Wombat:** `void logOut(obj player)`
**Notes:** Logs the player out immediately (`CPlayer_LogOut(player, 1)`).

---

### Script_loiter
**C:** `void Script_loiter(uint32_t serial, int range)`
**Wombat:** `void loiter(obj npc, int range)`
**Notes:** Tells the NPC to wander within `range` tiles of its current location.

---

### Script_loseFame
**C:** `void Script_loseFame(uint32_t serial, int amount)`
**Wombat:** `void loseFame(obj, int)` _(builtin 295)_
**Notes:** Subtracts `amount` from the mobile's notoriety (despite the name, routes through `CMobile_LoseNotoriety`); values above 255 are silently ignored.

---

### Script_loseFatigue
**C:** `void Script_loseFatigue(uint32_t serial, int amount)`
**Wombat:** `void loseFatigue(obj, int)` _(builtin 344)_
**Notes:** Subtracts `amount` from the mobile's current stamina via `VT_SET_STAMINA`.

---

### Script_loseHP
**C:** `void Script_loseHP(uint32_t serial, int amount)`
**Wombat:** `void loseHP(obj, int)` _(builtin 342)_
**Notes:** Inflicts `amount` of unattributed damage on the mobile via `Combat_DamageResolve(NULL, defender, amount, NULL, 0)`.

---

### Script_loseMana
**C:** `void Script_loseMana(uint32_t serial, int amount)`
**Wombat:** `void loseMana(obj, int)` _(builtin 343)_
**Notes:** Subtracts `amount` from the mobile's current mana via `VT_SET_MANA`.

---

### Script_loseSkillLevel
**C:** `void Script_loseSkillLevel(uint32_t serial, int skillId, int delta)`
**Wombat:** `void loseSkillLevel(obj mobile, int skillId, int delta)` _(index 398)_
**Notes:** Subtracts `delta` from the mobile's base skill value for `skillId`.

---

### Script_makeBeelineFailPathfind
**C:** `void Script_makeBeelineFailPathfind(uint32_t serial, int flag)`
**Wombat:** `void makeBeelineFailPathfind(obj mobile, int flag)` _(aliases: [716])_
**Notes:** Sets/clears the mobile's frozen status flag, forcing pathfinding failure and falling back to a beeline.

---

### Script_makeDice
**C:** `void Script_makeDice(CString *out, CString *base, int numDice, int faces, CString *sep, int bonus)`
**Wombat:** `void makeDice(string &out, string base, int numDice, int faces, string sep, int bonus)`
**Notes:** Builds a dice expression string from components into `out`; omits the dice term when `faces` is 0, and the bonus term when `sep` is empty or `bonus` is 0. _(builtin [609], typeSig `vSsiisi`)_

---

### Script_makeInvulnerable
**C:** `void Script_makeInvulnerable(uint32_t serial)`
**Wombat:** `void makeInvulnerable(obj mobile)`
**Notes:** Sets the mobile's invulnerable status flag via vtable dispatch.

---

### Script_makeMultiInst
**C:** `uint32_t Script_makeMultiInst(CLocation *loc, uint32_t bodyType, int flags)`
**Wombat:** `obj makeMultiInst(loc loc, obj bodyType, int flags)`
**Notes:** Creates a multi of `bodyType` anchored at `loc` and returns its serial; returns 0 on failure. `flags` is accepted but ignored. _(builtin [624])_

---

### Script_makeMultiInstCheck
**C:** `uint32_t Script_makeMultiInstCheck(CLocation *loc, uint32_t bodyType, int x, int y, intptr_t z, int checkNum, int artworkId, int validate, int flags)`
**Wombat:** `obj makeMultiInstCheck(loc loc, obj bodyType, int x, int y, int &result, int checkNum, int artworkId, int validate, int flags)`
**Notes:** Creates a multi instance with extended placement validation; the 5th argument is an int* output (typeSig `I`). Returns multi serial or 0. _(builtin [625], typeSig `ociiiIiii`)_

---

### Script_makeValueless
**C:** `int Script_makeValueless(uint32_t serial)`
**Wombat:** `int makeValueless(obj)` _(builtin 274)_
**Notes:** Marks the item as decayed (calls `CItem_DecayProcess`) so it no longer carries a value; returns 1 on success, 0 when entity is missing.

---

### Script_makeVulnerable
**C:** `void Script_makeVulnerable(uint32_t serial)`
**Wombat:** `void makeVulnerable(obj mobile)`
**Notes:** Clears the mobile's invulnerable status flag via vtable dispatch.

---

### Script_message
**C:** `void Script_message(uint32_t targetSerial, CString *msgName, intptr_t listArgs)`
**Wombat:** `void message(obj target, string msgName, list args)`
**Notes:** Fires script event 0x16 on `target` with the current thread entity as sender; the args list is passed as event data.

---

### Script_messageret
**C:** `int Script_messageret(uint32_t senderSerial, uint32_t targetSerial, CString *msgName, intptr_t listArgs)`
**Wombat:** `int messageret(obj sender, obj target, string msgName, list args)`
**Notes:** Fires script event 0x16 on `target` and returns the event handler's integer return value; returns 0 on failure.

---

### Script_messageToRange
**C:** `void Script_messageToRange(CLocation *loc, int range, CString *text, CString *args)`
**Wombat:** `void messageToRange(loc location, int range, string text, list args)`
**Notes:** Iterates map blocks near `location` and fires event 0x16 on every entity within `range` tiles; stops immediately if the sender entity is destroyed during an event dispatch.

---

### Script_mobileContainsObj
**C:** `int Script_mobileContainsObj(uint32_t mobSerial, uint32_t targetSerial)`
**Wombat:** `int mobileContainsObj(obj mobSerial, obj targetSerial)`
**Notes:** Returns 1 if the mobile has the target entity anywhere in its equipment slots or contents (recursive). _(builtin [514])_

---

### Script_mobileContainsObjType
**C:** `uint32_t Script_mobileContainsObjType(uint32_t mobSerial, int type)`
**Wombat:** `obj mobileContainsObjType(obj mobSerial, int type)`
**Notes:** Searches the mobile's equipment and contents recursively for an item of the given body type; returns its serial or 0. _(builtin [516])_

---

### Script_mobileHasObjWithListObjOfObj
**C:** `uint32_t Script_mobileHasObjWithListObjOfObj(uint32_t mobSerial, CString *name, uint32_t containerSerial)`
**Wombat:** `obj mobileHasObjWithListObjOfObj(obj mobile, string name, obj container)`
**Notes:** Searches the mobile's equipment for an item whose tag list contains `name` with `container`'s serial as value; returns the found item's serial, or 0.

---

### Script_mobileWillBuy
**C:** `int Script_mobileWillBuy(uint32_t npcSerial, uint32_t itemSerial)`
**Wombat:** `int mobileWillBuy(obj npcSerial, obj itemSerial)`
**Notes:** Returns 1 if the vendor NPC is willing to buy the specified item. _(builtin [499])_

---

### Script_modifyRealStat
**C:** `int Script_modifyRealStat(uint32_t serial, int statId, int value)`
**Wombat:** `int modifyRealStat(obj mobile, int statId, int value)` _(index 380)_
**Notes:** Adds `value` to the mobile's base stat for `statId`; returns the new base value.

---

### Script_modifySkillMod
**C:** `int Script_modifySkillMod(uint32_t serial, int skillId, int delta)`
**Wombat:** `int modifySkillMod(obj mobile, int skillId, int delta)` _(index 399)_
**Notes:** Adds `delta` to the mobile's bonus modifier for `skillId`; returns the new bonus.

---

### Script_modifyStat
**C:** `int Script_modifyStat(uint32_t serial, int statId, int value)`
**Wombat:** `int modifyStat(obj mobile, int statId, int value)` _(index 379)_
**Notes:** Adds `value` to the mobile's stat bonus for `statId`; returns the new bonus.

---

### Script_moveDir
**C:** `void Script_moveDir(CLocation *loc, int dir)`
**Wombat:** `void moveDir(loc loc, int dir)`
**Notes:** Steps `loc` one tile in compass direction `dir` (0=N, 1=NE, …, 7=NW). _(builtin [507])_

---

### Script_moveMulti
**C:** `int Script_moveMulti(uint32_t serial, CLocation *loc)`
**Wombat:** `int moveMulti(obj serial, loc loc)`
**Notes:** Moves a multi entity to the given location; returns result of the move or 0 if entity is invalid or not a multi. _(builtin [626])_

---

### Script_moveMultiCheck
**C:** `int Script_moveMultiCheck(uint32_t serial, CLocation *loc, int checkFlag)`
**Wombat:** `int moveMultiCheck(obj serial, loc loc, int checkFlag)`
**Notes:** Moves a multi with extended validation governed by `checkFlag`; returns 0 for invalid or non-multi entities. _(builtin [627])_

---

### Script_moveMultiMapSwitch
**C:** `int Script_moveMultiMapSwitch(uint32_t serial, CLocation *loc, int mapId)`
**Wombat:** `int moveMultiMapSwitch(obj serial, loc loc, int mapId)`
**Notes:** Moves a multi entity to a different map via CMultiSlave::MapSwitchMove; returns 0 for invalid or non-multi entities. _(builtin [631])_

---

### Script_multiCanExistAt
**C:** `int Script_multiCanExistAt(CLocation *loc, int typeId, int moveType)`
**Wombat:** `int multiCanExistAt(loc position, int typeId, int moveType)`
**Notes:** Returns 1 when a multi of `typeId` can be placed at `loc` with the given movement type.

---

### Script_multiCompSetSendSlave
**C:** `void Script_multiCompSetSendSlave(uint32_t serial, int value)`
**Wombat:** `void multiCompSetSendSlave(obj entity, int value)`
**Notes:** Sets or clears the `sendSlave` flag on the multi component the entity belongs to.

---

### Script_multimessage
**C:** `void Script_multimessage(uint32_t serial, CString *msgName, intptr_t listArgs)`
**Wombat:** `void multimessage(obj target, string msgName, list args)` _(aliases: multimessage, multiMessage)_
**Notes:** Sends a message to `target` if found, otherwise falls back to `SendMultiMessage` which broadcasts to nearby entities.

---

### Script_multiMessageToLoc
**C:** `void Script_multiMessageToLoc(CLocation *loc, CString *msgName, intptr_t listArgs)`
**Wombat:** `void multiMessageToLoc(loc location, string msgName, list args)`
**Notes:** Sends event 0x16 to entities at a specific map location via `SendMultiMessageToLoc`.

---

### Script_multiMessageToRange
**C:** `void Script_multiMessageToRange(CLocation *loc, int range, CString *msgName, intptr_t listArgs)`
**Wombat:** `void multiMessageToRange(loc location, int range, string msgName, list args)`
**Notes:** Sends event 0x16 to entities within Chebyshev `range` of `location` via `SendMultiMessageToRange`.

---

### Script_musicTo
**C:** `void Script_musicTo(uint32_t serial, int musicID)`
**Wombat:** `void musicTo(obj player, int musicID)`
**Notes:** Sends a MUSIC packet to the named player, changing their background music.

---

### Script_NotorietyCompare
**C:** `int Script_NotorietyCompare(uint32_t serial1, uint32_t serial2)`
**Wombat:** `int NotorietyCompare(obj mob1, obj mob2)` _(aliases: [296] `NotorietyCompare`, [297] `notorietyCompare`)_
**Notes:** Compares the notoriety levels of two mobiles; returns 0 if either is invalid.

---

### Script_nullHandler
**C:** `int Script_nullHandler(void)`
**Wombat:** `obj NULL()` _(index 184)_
**Notes:** Always returns 0 (null object serial); the no-op null object reference.

---

### Script_numInContainer
**C:** `int Script_numInContainer(uint32_t serial)`
**Wombat:** `int numInContainer(obj)` _(builtin 281)_
**Notes:** Returns the count of items directly inside the container entity; returns 0 when the entity is missing or not a container.

---

### Script_numinlist
**C:** `int Script_numinlist(CList *list)`
**Wombat:** `int numinlist(list list)` _(aliases: numinlist, numInList)_
**Notes:** Returns the number of elements in `list`.

---

### Script_objectsNearby
**C:** `int Script_objectsNearby(CList *list, CLocation *loc, int range, int filterType)`
**Wombat:** `int objectsNearby(list bodyTypes, loc position, int range, int filterType)`
**Notes:** Returns 1 when at least one entity of every body type in `bodyTypes` exists within `range` of `position`; when a matching entity's type equals `filterType`, `position` is updated to that entity's coordinates.

---

### Script_objIsInRange
**C:** `int Script_objIsInRange(CLocation *loc, int range)`
**Wombat:** `int objIsInRange(loc center, int range)`
**Notes:** Returns 1 when at least one non-mobile entity lies within Chebyshev distance `range` of `center`.

---

### Script_objToStr
**C:** `CString *Script_objToStr(CString *out, uint32_t serial)`
**Wombat:** `string objToStr(obj serial)`
**Notes:** Converts `serial` to its decimal string representation. _(builtin [521])_

---

### Script_openBank
**C:** `void Script_openBank(uint32_t serial)`
**Wombat:** `void openBank(obj player)`
**Notes:** Opens the bank gump for the player (self-open, no teller NPC required) and stamps the player's current location into the `bankOpenLoc` ObjVar.

---

### Script_openContainer
**C:** `int Script_openContainer(uint32_t playerSerial, uint32_t containerSerial)`
**Wombat:** `int openContainer(obj player, obj container)`
**Notes:** Sends the container's gump and current contents to the player; returns 1 on success, 0 when either serial is invalid.

---

### Script_openGenericGump
**C:** `void Script_openGenericGump(uint32_t entitySerial, uint32_t playerSerial, int gumpId, int x, int y, CList *cmdList, CList *textList)`
**Wombat:** `void openGenericGump(obj entity, obj player, int gumpId, int x, int y, list cmdList, list textList)` _(aliases: [756])_
**Notes:** Builds and sends a generic gump (packet 0xB0) to the player at the given position using cmdList for layout and textList for text lines.

---

### Script_openGump
**C:** `void Script_openGump(uint32_t serial, int gumpId)`
**Wombat:** `void openGump(obj player, int gump_id)`
**Notes:** Sends an OPEN_GUMP packet to the player; when `gump_id` is 0x1392, uses serial 1 as the gump serial.

---

### Script_overloadWeight
**C:** `void Script_overloadWeight(uint32_t serial, int weight)`
**Wombat:** `void overloadWeight(obj entity, int weight)` _(aliases: [717])_
**Notes:** Sets the entity's `overloadedWeight` ObjVar, overriding the tiledata weight, and refreshes the entity.

---

### Script_peace
**C:** `void Script_peace(uint32_t serial)`
**Wombat:** `void peace(obj)` _(builtin 612)_
**Notes:** Disengages every attacker from the mobile (`CMobile_DisengageAttackers`) and clears its own combat targets (`CMobile_StopCombat`), ending all combat it participates in.

---

### Script_prepend
**C:** `void Script_prepend(CList *list, uintptr_t typeTag, uintptr_t value)`
**Wombat:** `void prepend(list list, any value)` _(aliases: prepend, prependToList)_
**Notes:** Inserts a typed element at the head of `list`.

---

### Script_printList
**C:** `void Script_printList(CList *list)`
**Wombat:** `void printList(list list)`
**Notes:** No-op debug walker; traverses the list recursively but produces no output.

---

### Script_processTriggerCmds
**C:** `void Script_processTriggerCmds(uint32_t serial, CString *cmdStr)`
**Wombat:** `void processTriggerCmds(obj source, string cmdStr)`
**Notes:** Spatial trigger/event bus: iterates ObjVars named `cmd{type}0`–`cmd{type}9` on the source entity, finds nearby entities (Chebyshev < 15, radius 10 blocks) carrying the same linked name, then dispatches `activate`/`deactivate` events or copies/removes conditional ObjVars on each target; recursion depth capped at 32.

---

### Script_putMobContainer
**C:** `int Script_putMobContainer(uint32_t thingSerial, uint32_t containerSerial)`
**Wombat:** `int putMobContainer(obj thing, obj container)`
**Notes:** Moves a mobile into another mobile's container without the safety checks of `putObjContainer`. Returns 1 on success.

---

### Script_putObjBank
**C:** `int Script_putObjBank(uint32_t mobileSerial, uint32_t thingSerial)`
**Wombat:** `int putObjBank(obj mobile, obj thing)` _(aliases: [201])_
**Notes:** Places thingSerial into the mobile's bank box (creating the bank if needed); returns result of putObjContainer.

---

### Script_putObjContainer
**C:** `int Script_putObjContainer(uint32_t thingSerial, uint32_t containerSerial)`
**Wombat:** `int putObjContainer(obj thing, obj container)`
**Notes:** Moves `thing` into `container`; refuses mobiles, locked containers, and self-containment. Returns 1 on success.

---

### Script_random
**C:** `int Script_random(int min, int max)`
**Wombat:** `int random(int min, int max)`
**Notes:** Returns a random integer in `[min, max]` inclusive; returns 0 when `max < min`.

---

### Script_recalcWeight
**C:** `void Script_recalcWeight(uint32_t serial)`
**Wombat:** `void recalcWeight(obj entity)` _(aliases: [718])_
**Notes:** Recomputes the entity's stored weight (containers recurse through children; plain items use tiledata base weight).

---

### Script_receiveAggressionFrom
**C:** `void Script_receiveAggressionFrom(uint32_t victimSerial, uint32_t aggressorSerial)`
**Wombat:** `void receiveAggressionFrom(obj victim, obj aggressor)` _(aliases: [569])_
**Notes:** Records aggressor on victim's attacker list, propagating the aggression notification.

---

### Script_receiveHelpfulActionFrom
**C:** `void Script_receiveHelpfulActionFrom(uint32_t playerSerial, uint32_t helperSerial)`
**Wombat:** `void receiveHelpfulActionFrom(obj player, obj helper)` _(aliases: [571])_
**Notes:** Records helper aiding player; if player is criminal/murderer, helper is flagged for criminal punishment.

---

### Script_receiveUnhealthyActionFrom
**C:** `void Script_receiveUnhealthyActionFrom(uint32_t victimSerial, uint32_t attackerSerial)`
**Wombat:** `void receiveUnhealthyActionFrom(obj victim, obj attacker)` _(aliases: [570])_
**Notes:** Notifies victim that attacker performed a hostile (damaging) action against it.

---

### Script_recycleMulti
**C:** `int Script_recycleMulti(uint32_t serial, int bodyType)`
**Wombat:** `int recycleMulti(obj serial, int bodyType)`
**Notes:** Recycles a multi entity of `bodyType` back to the multi pool and updates its artwork; returns the recycle result or 0. _(builtin [628])_

---

### Script_recycleMultiCheck
**C:** `int Script_recycleMultiCheck(uint32_t serial, int bodyType, int checkFlag)`
**Wombat:** `int recycleMultiCheck(obj serial, int bodyType, int checkFlag)`
**Notes:** Recycles a multi with extended checks governed by `checkFlag`; returns 0 for invalid or non-multi entities. _(builtin [629])_

---

### Script_recycleMultiCheckRotate
**C:** `int Script_recycleMultiCheckRotate(uint32_t serial, int bodyType, int rotation, int checkFlag)`
**Wombat:** `int recycleMultiCheckRotate(obj serial, int bodyType, int rotation, int checkFlag)`
**Notes:** Recycles a multi with checks and rotation; returns 0 for invalid or non-multi entities. _(builtin [630])_

---

### Script_refreshAggression
**C:** `void Script_refreshAggression(uint32_t serial)`
**Wombat:** `void refreshAggression(obj entity)` _(aliases: [568])_
**Notes:** Re-evaluates the entity's aggression/notoriety state via its vtable.

---

### Script_removeCallback
**C:** `void Script_removeCallback(uint32_t serial, int callbackId)`
**Wombat:** `void removeCallback(obj entity, int callbackId)`
**Notes:** Cancels the entity's scheduled type-5 callback with the given `callbackId`.

---

### Script_removeCallbackAdvanced
**C:** `void Script_removeCallbackAdvanced(uint32_t serial, int eventType, int callbackId)`
**Wombat:** `void removeCallbackAdvanced(obj entity, int eventType, int callbackId)`
**Notes:** Cancels a scheduled event of the specified `eventType` and `callbackId` on the entity.

---

### Script_removeFragment
**C:** `void Script_removeFragment(uint32_t serial, CString *fragName)`
**Wombat:** `void removefragment(obj npc, string fragName)` _(aliases: removefragment, removeFragment)_
**Notes:** Removes the named AI fragment from an NPC.

---

### Script_removeitem
**C:** `void Script_removeitem(CList *list, int index)`
**Wombat:** `void removeitem(list list, int index)` _(aliases: removeitem, removeItem)_
**Notes:** Removes `list[index]`; aborts the thread when index is out of range.

---

### Script_removeLeadingWords
**C:** `void Script_removeLeadingWords(CString *str, int count)`
**Wombat:** `void removeLeadingWords(string str, int count)` _(aliases: [707] — typeSig `"vSi"`, str is modified in place)_
**Notes:** Strips the first count whitespace-delimited words from str in place.

---

### Script_removeNotoriety
**C:** `void Script_removeNotoriety(uint32_t serial, int amount)`
**Wombat:** `void removeNotoriety(obj, int)` _(builtin 299)_
**Notes:** Subtracts `amount` from the mobile's notoriety via `CMobile_ChangeNotorietyNeg`; values above 255 are silently ignored.

---

### Script_removeObjVar
**C:** `void Script_removeObjVar(uint32_t serial, CString *varname)`
**Wombat:** `void removeObjVar(obj entity, string varname)`
**Notes:** Removes the named ObjVar from the entity; no-op when the entity is missing or removed.

---

### Script_removePlayerFromGame
**C:** `int Script_removePlayerFromGame(uint32_t serial)`
**Wombat:** `int removePlayerFromGame(obj player)`
**Notes:** Disconnects an offline player slot; returns 1 when disconnected, 0 if player is online or not a player.

---

### Script_removePrefix
**C:** `void Script_removePrefix(CString *str, CString *prefix)`
**Wombat:** `void removePrefix(string* str, string prefix)`
**Notes:** Strips `prefix` from the beginning of `str` if present.

---

## Array Operations

### Script_removespecificitem
**C:** `void Script_removespecificitem(CList *list, uintptr_t typeTag, uintptr_t value)`
**Wombat:** `void removespecificitem(list list, any value)` _(aliases: removespecificitem, removeSpecificItem)_
**Notes:** Removes the first list entry that matches the given typed value.

---

### Script_replyTo
**C:** `void Script_replyTo(uint32_t npcSerial, uint32_t targetSerial, CString *speechStr)`
**Wombat:** `void replyTo(obj npcSerial, obj targetSerial, string speechStr)`
**Notes:** Looks up the NPC's conversation response to `speechStr` from `target` and schedules it as a speech event 5 ticks later. _(builtin [509])_

---

### Script_replyToMobAbout
**C:** `void Script_replyToMobAbout(uint32_t speakerSerial, uint32_t targetSerial, uint32_t aboutSerial, CString *speechStr)`
**Wombat:** `void replyToMobAbout(obj speakerSerial, obj targetSerial, obj aboutSerial, string speechStr)`
**Notes:** Like `replyTo` but includes a third-party mobile reference in the conversation lookup; schedules any reply 5 ticks later. _(builtin [510])_

---

### Script_requestAddQuantity
**C:** `int Script_requestAddQuantity(uint32_t serial, int quantity)`
**Wombat:** `int requestAddQuantity(obj entity, int quantity)`
**Notes:** Adds `quantity` to a resource entity, capped by the per-region resource bank limit; returns 1 on success, 0 when the budget is exhausted.

---

### Script_requestCreateNPCAt
**C:** `uint32_t Script_requestCreateNPCAt(int templateId, CLocation *loc, int noWander)`
**Wombat:** `obj requestCreateNPCAt(int templateId, loc location, int noWander)` _(aliases: [694])_
**Notes:** Spawns templateId at loc using the spawner "find a good spot" helper; noWander suppresses initial wandering.

---

### Script_requestCreateObjectAt
**C:** `uint32_t Script_requestCreateObjectAt(int artId, CLocation *loc)`
**Wombat:** `obj requestCreateObjectAt(int artId, loc position)`
**Notes:** Like `createGlobalObjectAt` but routes through the per-region resource bank cap; returns 0 when the region's budget is full.

---

### Script_requestCreateObjectIn
**C:** `uint32_t Script_requestCreateObjectIn(int artId, uint32_t containerSerial)`
**Wombat:** `obj requestCreateObjectIn(int artId, obj container)`
**Notes:** Like `createGlobalObjectIn` but routes through the per-region resource bank cap; returns 0 when the budget is full.

---

### Script_resetMultiCarriedDecay
**C:** `void Script_resetMultiCarriedDecay(uint32_t serial)`
**Wombat:** `void resetMultiCarriedDecay(obj entity)`
**Notes:** Resets the decay counter to zero on every item carried by the multi owned by the entity.

---

### Script_resourceTypeToId
**C:** `int Script_resourceTypeToId(CString *name)`
**Wombat:** `int resourceTypeToId(string name)` _(aliases: [701])_
**Notes:** Returns the integer typeId for the named resource type, or 0 if unknown.

---

### Script_restoreFatigue
**C:** `void Script_restoreFatigue(uint32_t serial)`
**Wombat:** `void restoreFatigue(obj)` _(builtin 346)_
**Notes:** Refills the mobile's stamina to its maximum via `VT_SET_STAMINA`; the validation string in the binary is `"walk"` (copy-paste bug in original code).

---

### Script_restoreHP
**C:** `void Script_restoreHP(uint32_t serial)`
**Wombat:** `void restoreHP(obj)` _(builtin 347)_
**Notes:** Refills the mobile's HP to its maximum via `VT_SET_HP`; the validation string in the binary is `"walk"` (copy-paste bug in original code).

---

### Script_restoreMana
**C:** `void Script_restoreMana(uint32_t serial)`
**Wombat:** `void restoreMana(obj)` _(builtin 348)_
**Notes:** Refills the mobile's mana to its maximum via `VT_SET_MANA`.

---

### Script_restoreMobile
**C:** `void Script_restoreMobile(uint32_t serial)`
**Wombat:** `void restoreMobile(obj)` _(builtin 345)_
**Notes:** Refills the mobile's HP, mana, and stamina to their respective maximums.

---

### Script_resurrect
**C:** `int Script_resurrect(uint32_t serial, int flag)`
**Wombat:** `int resurrect(obj player, int flag)` _(aliases: [735])_
**Notes:** Resurrects the player; returns the resurrection result, or 0 if serial is not a valid player.

---

### Script_returnAllResourcesToBank
**C:** `void Script_returnAllResourcesToBank(uint32_t serial)`
**Wombat:** `void returnAllResourcesToBank(obj entity)`
**Notes:** Strips every resource node off the entity and returns it to its tracked location.

---

### Script_returnObject
**C:** `void Script_returnObject(uint32_t serial)`
**Wombat:** `void returnObject(obj)` _(builtin 511)_
**Notes:** Removes the entity from the world (via `VT_HIDE` when present) then re-attaches it to its tracked origin via `VT_RETURN_TO_TRACKED`.

---

### Script_returnResourcesToBank
**C:** `void Script_returnResourcesToBank(uint32_t serial, int amount, CString *resName)`
**Wombat:** `void returnResourcesToBank(obj entity, int amount, string resName)`
**Notes:** Drains `amount` of the named resource type from the entity, suppressing spatial notifications during the operation.

---

### Script_run
**C:** `int Script_run(uint32_t serial, int dir)`
**Wombat:** `int run(obj mobile, int dir)`
**Notes:** Like `walk` but sets the run bit (0x80) on the direction; returns 1 on success, 0 on failure.

---

### Script_runAway
**C:** `void Script_runAway(uint32_t serial, uint32_t targetSerial)`
**Wombat:** `void runAway(obj npc, obj target)`
**Notes:** Puts the NPC into flee state, fleeing from `target`.

---

### Script_safeLogOut
**C:** `void Script_safeLogOut(uint32_t serial)`
**Wombat:** `void safeLogOut(obj player)` _(aliases: safeLogout)_
**Notes:** Logs the player out safely (`CPlayer_LogOut(player, 0)`), allowing a grace period before disconnect.

---

### Script_sameSex
**C:** `int Script_sameSex(uint32_t serial1, uint32_t serial2)`
**Wombat:** `int sameSex(obj mob1, obj mob2)`
**Notes:** Returns 1 when both mobiles report the same sex.

---

### Script_scoreToSpace
**C:** `void Script_scoreToSpace(CString *str)`
**Wombat:** `void scoreToSpace(string str)`
**Notes:** Replaces all underscore characters in `str` with spaces (in-place). _(builtin [522])_

---

### Script_scriptTrig
**C:** `void Script_scriptTrig(uint32_t serial, int trigType, uint32_t objArgSerial)`
**Wombat:** `void scriptTrig(obj serial, int trigType, obj objArgSerial)`
**Notes:** Fires a script trigger event of `trigType` on entity `serial` with `objArgSerial` as the argument; valid trigger types are 1, 2, 7, 11–13, 16–17, 23, 28, 39–42, 60. Invalid types immediately terminate the calling thread. _(builtin [523], typeSig `voio`)_

---

### Script_seance
**C:** `void Script_seance(uint32_t serial, int mode)`
**Wombat:** `void seance(obj player, int mode)`
**Notes:** Sets (mode != 0) or clears the player's SpiritSpeak flag (pflags bit 0x0400).

---

## ObjVar Access

### Script_selectHue
**C:** `void Script_selectHue(uint32_t playerSerial, uint32_t serial, uint32_t typeID, uint32_t hue)`
**Wombat:** `void selectHue(obj player, obj entity, int typeID, int hue)`
**Notes:** Sends a Hue Picker packet (0x95) to `player` for the given entity type and initial hue.

---

## NPC Fragment / Script Attachment

### Script_selectType
**C:** `void Script_selectType(uint32_t playerSerial, uint32_t serial, uint32_t dialogId, CString *title, CList *list)`
**Wombat:** `void selectType(obj player, obj entity, obj dialogId, string title, list entries)`
**Notes:** Sends an OBJPICKER dialog (packet 0x7C) to `player` listing type IDs from `entries` without hue data.

---

### Script_selectTypeAndHue
**C:** `void Script_selectTypeAndHue(uint32_t playerSerial, uint32_t serial, uint32_t dialogId, CString *title, CList *list)`
**Wombat:** `void selectTypeAndHue(obj player, obj entity, obj dialogId, string title, list entries)`
**Notes:** Same as `selectType` but reads alternating hue values from `entries` alongside each type ID.

---

### Script_sendPlayerZmoveStuff
**C:** `void Script_sendPlayerZmoveStuff(uint32_t serial)`
**Wombat:** `void sendPlayerZmoveStuff(obj player)`
**Notes:** Sends Z-move update packets to the player and to all nearby players within range 18, notifying them of the player's vertical position change.

---

### Script_sendToNearbyPlayers
**C:** `void Script_sendToNearbyPlayers(uint32_t serial, int flags)`
**Wombat:** `void sendToNearbyPlayers(obj entity, int flags)`
**Notes:** Collects online players within 18 tiles of `entity`, then calls the entity's vtable `VT_NOTIFY_NEARBY` with the player list and `flags`.

---

## NPC Behaviors

### Script_setAlignment
**C:** `void Script_setAlignment(uint32_t serial, int alignment)`
**Wombat:** `void setAlignment(obj serial, int alignment)`
**Notes:** Sets the mobile's alignment (0–3); values outside this range are silently ignored. _(builtin [485])_

---

### Script_setArrayElems
**C:** `void Script_setArrayElems(int id, int x, int y, CList *list)`
**Wombat:** `void setArrayElems(int id, int x, int y, list list)`
**Notes:** Fills a row of array `id` starting at column `x`, row `y`, advancing one column per list node; supports int, string, and ustring node types.

---

### Script_setArrayIntElem
**C:** `void Script_setArrayIntElem(int id, int x, int y, int val)`
**Wombat:** `void setArrayIntElem(int id, int x, int y, int val)`
**Notes:** Sets the integer element at column `x`, row `y` in array `id` to `val`.

---

### Script_setArrayStrElem
**C:** `void Script_setArrayStrElem(int id, int x, int y, CString *src)`
**Wombat:** `void setArrayStrElem(int id, int x, int y, string src)`
**Notes:** Sets the string element at column `x`, row `y` in array `id` from `src`.

---

### Script_setArrayUStrElem
**C:** `void Script_setArrayUStrElem(int id, int x, int y, CUString *src)`
**Wombat:** `void setArrayUStrElem(int id, int x, int y, ustring src)`
**Notes:** Sets the unicode string element at column `x`, row `y` in array `id` from `src`.

---

### Script_setBehavior
**C:** `void Script_setBehavior(uint32_t serial, int flags)`
**Wombat:** `void setBehavior(obj npc, int flags)`
**Notes:** Sets (OR-assigns) the given behavior flag bits on the NPC.

---

### Script_setConvoRet
**C:** `void Script_setConvoRet(CString *str)`
**Wombat:** `void setConvoRet(string str)`
**Notes:** Copies `str` into the global conversation return buffer (`g_ConvoReturnStr`).

---

### Script_setCriminal
**C:** `void Script_setCriminal(uint32_t serial, int duration)`
**Wombat:** `void setCriminal(obj mobile, int duration)` _(aliases: [561])_
**Notes:** Sets the criminal flag on the mobile for the given duration.

---

### Script_setCurFatigue
**C:** `void Script_setCurFatigue(uint32_t serial, int stamina)`
**Wombat:** `void setCurFatigue(obj, int)` _(builtin 330)_
**Notes:** Sets the mobile's current stamina via `VT_SET_STAMINA`; negative values are clamped to 0.

---

### Script_setCurHP
**C:** `void Script_setCurHP(uint32_t serial, int hp)`
**Wombat:** `void setCurHP(obj, int)` _(builtin 327)_
**Notes:** Sets the mobile's current HP via `VT_SET_HP` (with no broadcast flag).

---

### Script_setCurMana
**C:** `void Script_setCurMana(uint32_t serial, int mana)`
**Wombat:** `void setCurMana(obj, int)` _(builtin 332)_
**Notes:** Sets the mobile's current mana via `VT_SET_MANA`.

---

### Script_setCursed
**C:** `void Script_setCursed(uint32_t serial, int value)`
**Wombat:** `void setCursed(obj mobile, int value)`
**Notes:** Sets or clears the mobile's cursed flag (mobile flag bit 8) based on `value`.

---

### Script_setDecayCount
**C:** `int Script_setDecayCount(uint32_t serial, int decayCount)`
**Wombat:** `int setDecayCount(obj entity, int decayCount)`
**Notes:** Sets the entity's decay counter; negative values are stored as 0xFF; returns 1 on success, 0 when the serial is invalid.

---

### Script_setDecayTest
**C:** `void Script_setDecayTest(int mode)`
**Wombat:** `void setDecayTest(int mode)`
**Notes:** Reinitializes the world decay system in the given mode.

---

### Script_setDefaultReturn
**C:** `void Script_setDefaultReturn(int value)`
**Wombat:** `void setDefaultReturn(int value)`
**Notes:** Sets the current thread's implicit return value, used when the trigger or function exits without an explicit `return` statement.

---

### Script_setDefaultTextHue
**C:** `void Script_setDefaultTextHue(uint32_t serial, int hue)`
**Wombat:** `void setDefaultTextHue(obj mobile, int hue)`
**Notes:** Updates the mobile's default speech hue.

---

### Script_setDesireLevel
**C:** `void Script_setDesireLevel(uint32_t serial, int desireLevel)`
**Wombat:** `void setDesireLevel(obj npc, int desireLevel)`
**Notes:** Sets the NPC's desire level; the value is divided by 10 before storage.

---

### Script_setElevation
**C:** `void Script_setElevation(CLocation *loc, int elevation)`
**Wombat:** `void setElevation(loc location, int elevation)` _(aliases: [759])_
**Notes:** Sets the land Z height at loc; ignores out-of-map coords or elevations outside [-128, 128).

---

### Script_setFame
**C:** `void Script_setFame(uint32_t serial, int fame)`
**Wombat:** `void setFame(obj, int)` _(builtin 308)_
**Notes:** Sets the mobile's fame to `fame` via `CMobile_SetFame`; the validation string in the binary is `"getFame"` (copy-paste bug in original code).

---

### Script_setGMCallStatus
**C:** `void Script_setGMCallStatus(int value)`
**Wombat:** `void setGMCallStatus(int value)` _(aliases: [741])_
**Notes:** Sets the global GM call-queue status flag.

---

### Script_setHidden
**C:** `void Script_setHidden(uint32_t serial, int value)`
**Wombat:** `void setHidden(obj entity, int value)`
**Notes:** Sets or clears the entity's hidden flag based on `value`.

---

### Script_setHome
**C:** `void Script_setHome(uint32_t serial, CLocation *loc)`
**Wombat:** `void setHome(obj serial, loc loc)`
**Notes:** Sets the NPC's home location to `loc` and clears the auxiliary homeInfo3 field. _(builtin [491])_

---

### Script_setHue
**C:** `void Script_setHue(uint32_t serial, int hue)`
**Wombat:** `void setHue(obj entity, int hue)`
**Notes:** Sets the entity's color and refreshes nearby clients.

---

### Script_setInvisible
**C:** `void Script_setInvisible(uint32_t serial, int value)`
**Wombat:** `void setInvisible(obj entity, int value)`
**Notes:** Sets or clears the entity's hidden flag; functionally identical to `setHidden`.

---

### Script_setitem
**C:** `void Script_setitem(CList *list, uintptr_t typeTag, uintptr_t value, int index)`
**Wombat:** `void setitem(list list, any value, int index)` _(aliases: setitem, setItem)_
**Notes:** Replaces `list[index]` with the given typed value; aborts the thread when index is out of range.

---

### Script_setKarma
**C:** `void Script_setKarma(uint32_t serial, int karma)`
**Wombat:** `void setKarma(obj, int)` _(builtin 313)_
**Notes:** Sets the mobile's karma to `karma` via `CMobile_SetKarma`; the validation string in the binary is `"getKarma"` (copy-paste bug in original code).

---

### Script_setLastValidTerrainLoc
**C:** `void Script_setLastValidTerrainLoc(uint32_t serial, CLocation *loc)`
**Wombat:** `void setLastValidTerrainLoc(obj player, loc location)`
**Notes:** Updates the player's last valid terrain location; silently ignored if coordinates fall outside the map.

---

### Script_setLight
**C:** `void Script_setLight(uint32_t serial, int lightVal, int lightTime)`
**Wombat:** `void setLight(obj serial, int lightVal, int lightTime)`
**Notes:** Sets both the brightness and duration of the mobile's light effect. _(builtin [547])_

---

### Script_setLocItem
**C:** `void Script_setLocItem(CList *list, uintptr_t locPtr, int index)`
**Wombat:** `void setLocItem(list list, loc value, int index)`
**Notes:** Replaces `list[index]` with a location-typed entry; aborts the thread when index is out of range.

---

### Script_setLoiterMode
**C:** `void Script_setLoiterMode(uint32_t serial, int mode)`
**Wombat:** `void setLoiterMode(obj npc, int mode)`
**Notes:** Enables (`mode != 0`) or disables permanent loiter behavior on the NPC; when enabled, the NPC loiters at its current location with a large wander radius.

---

### Script_setLooksLikeTemplate
**C:** `void Script_setLooksLikeTemplate(uint32_t serial, int templateId)`
**Wombat:** `void setLooksLikeTemplate(obj mobile, int templateId)`
**Notes:** Sets the mobile's alternate body type so it visually displays as `templateId` without changing its real template.

---

### Script_setMapProperties
**C:** `void Script_setMapProperties(uint32_t serial, int unused, int x1, int y1, int x2, int y2, int width, int height)`
**Wombat:** `void setMapProperties(obj entity, int unused, int x1, int y1, int x2, int y2, int width, int height)`
**Notes:** Sets the six map-extent values (world corners and pixel dimensions) on a signpost/map entity; the second argument is unused.

---

### Script_setMaxArmorClass
**C:** `int Script_setMaxArmorClass(uint32_t serial, int maxAC)`
**Wombat:** `int setMaxArmorClass(obj weapon, int maxAC)` _(index 592)_
**Notes:** Sets the weapon's maximum armor rating; returns 1 on success, 0 when the weapon is invalid.

---

### Script_setMaxFatigue
**C:** `void Script_setMaxFatigue(uint32_t serial, int maxstam)`
**Wombat:** `void setMaxFatigue(obj, int)` _(builtin 331)_
**Notes:** Sets the mobile's maximum stamina via `VT_SET_MAX_STAMINA`.

---

### Script_setMaxHP
**C:** `void Script_setMaxHP(uint32_t serial, int maxhp)`
**Wombat:** `void setMaxHP(obj, int)` _(builtin 328)_
**Notes:** Sets the mobile's maximum HP via `VT_SET_MAX_HP` and immediately sends a stat update via `VT_SEND_HP_UPDATE`.

---

### Script_setMaxMana
**C:** `void Script_setMaxMana(uint32_t serial, int maxmana)`
**Wombat:** `void setMaxMana(obj, int)` _(builtin 333)_
**Notes:** Sets the mobile's maximum mana via `VT_SET_MAX_MANA`.

---

### Script_setMobFlag
**C:** `void Script_setMobFlag(uint32_t serial, int flagId, int value)`
**Wombat:** `void setMobFlag(obj mobile, int flagId, int value)` _(index 400)_
**Notes:** Sets or clears status flag `flagId` on `mobile` according to `value`.

---

### Script_setMovementType
**C:** `void Script_setMovementType(uint32_t serial, int moveType)`
**Wombat:** `void setMovementType(obj, int)` _(builtin 291)_
**Notes:** Sets the mobile's movement type; silently ignores values outside [0, 9].

---

### Script_setMurderCount
**C:** `void Script_setMurderCount(uint32_t serial, int count)`
**Wombat:** `void setMurderCount(obj mobile, int count)`
**Notes:** Sets the mobile's murder count and applies any karma threshold adjustments triggered by the change.

---

### Script_setNaturalAC
**C:** `void Script_setNaturalAC(uint32_t serial, int ac)`
**Wombat:** `void setNaturalAC(obj, int)` _(builtin 334)_
**Notes:** Sets the mobile's bonus armor class via `CMobile_SetBonusAC`; for players, also re-sends a status packet so the new AC reaches the client.

---

### Script_setNotoriety
**C:** `void Script_setNotoriety(uint32_t serial, int not_val)`
**Wombat:** `void setNotoriety(obj, int)` _(builtin 303)_
**Notes:** Sets the mobile's notoriety via `VT_SET_NOTORIETY`; silently ignores values outside [-127, 127].

---

### Script_setNPCState
**C:** `int Script_setNPCState(uint32_t serial, int state)`
**Wombat:** `int setNPCState(obj npc, int state)`
**Notes:** Sets the NPC's AI state (must be in [0, 13]); returns the new state on success, -1 on an invalid state or NPC.

---

### Script_setObjVar
**C:** `void Script_setObjVar(uint32_t serial, CString *varname, int typeTag, uintptr_t value)`
**Wombat:** `void setObjVar(obj entity, string varname, any value)`
**Notes:** Stores the value under `varname` on the entity; silently skipped when the entity is missing or removed from the world.

---

### Script_setPartialHue
**C:** `void Script_setPartialHue(uint32_t serial, int hue)`
**Wombat:** `void setPartialHue(obj entity, int hue)`
**Notes:** Like `setHue` but ORs in 0x8000 (the partial-hue flag) when the target is a mobile.

---

### Script_setPoisoned
**C:** `void Script_setPoisoned(uint32_t serial, int value)`
**Wombat:** `void setPoisoned(obj mobile, int value)`
**Notes:** Sets or clears the mobile's poisoned flag (mobile flag bit 4) based on `value`.

---

### Script_setPostTime
**C:** `void Script_setPostTime(uint32_t serial)`
**Wombat:** `void setPostTime(obj entity)` _(aliases: [709])_
**Notes:** Stamps the entity with the current in-game time as the `postTime` ObjVar (minutes since day 0) and the current tick as `msgTime`.

---

### Script_setRealName
**C:** `void Script_setRealName(uint32_t serial, CString *str)`
**Wombat:** `void setRealName(obj mobile, string name)`
**Notes:** Sets the mobile's real name to `name` via `CMobile_SetName`.

---

### Script_setRealNameFromTemplate
**C:** `void Script_setRealNameFromTemplate(uint32_t serial, int templateId)`
**Wombat:** `void setRealNameFromTemplate(obj mobile, int template_id)`
**Notes:** Sets the mobile's real name to the name associated with `template_id` in the template manager.

---

### Script_setRealStat
**C:** `int Script_setRealStat(uint32_t serial, int statId, int value)`
**Wombat:** `int setRealStat(obj mobile, int statId, int value)` _(index 381)_
**Notes:** Sets the mobile's base value for `statId` to `value`; returns the new base.

---

### Script_setResurrectionResources
**C:** `void Script_setResurrectionResources(uint32_t serial)`
**Wombat:** `void setResurrectionResources(obj player)`
**Notes:** Stamps the player with the post-resurrection state (Meat/Humans resource nodes, resist flags, and an incremented murder count).

---

### Script_setROBookNum
**C:** `void Script_setROBookNum(uint32_t serial, int bookNum)`
**Wombat:** `void setROBookNum(obj serial, int bookNum)`
**Notes:** Sets the entity's bookNum ObjVar to the lower 16 bits of `bookNum`. _(builtin [744])_

---

### Script_setSkillLevel
**C:** `void Script_setSkillLevel(uint32_t serial, int skillId, int value)`
**Wombat:** `void setSkillLevel(obj mobile, int skillId, int value)` _(index 396)_
**Notes:** Sets the mobile's base skill value for `skillId` to `value`.

---

### Script_setSkillMod
**C:** `int Script_setSkillMod(uint32_t serial, int skillId, int value)`
**Wombat:** `int setSkillMod(obj mobile, int skillId, int value)` _(index 385)_
**Notes:** Sets the mobile's bonus modifier for `skillId` to `value`; returns the new bonus.

---

### Script_setStatAttributeMax
**C:** `int Script_setStatAttributeMax(uint32_t serial, int statId, int value)`
**Wombat:** `int setStatAttributeMax(obj mobile, int statId, int value)` _(index 378)_
**Notes:** Sets max HP, stamina, or mana (by `statId` 0/1/2) on `mobile` via vtable; returns the stored value.

---

### Script_setStatMod
**C:** `int Script_setStatMod(uint32_t serial, int statId, int value)`
**Wombat:** `int setStatMod(obj mobile, int statId, int value)` _(index 383)_
**Notes:** Sets the mobile's bonus modifier for `statId` to `value`; returns the new bonus.

---

### Script_setStatus
**C:** `void Script_setStatus(uint32_t serial, int bit, int value)`
**Wombat:** `void setStatus(obj entity, int bit, int value)`
**Notes:** Sets or clears item flag bit `bit` on the entity (`value != 0` sets, `value == 0` clears).

---

### Script_setTile
**C:** `void Script_setTile(CLocation *loc, int tileID)`
**Wombat:** `void setTile(loc location, int tileID)` _(aliases: [757])_
**Notes:** Sets the land-tile art ID at loc; ignores out-of-range coordinates or tileIDs outside [0, 0x4000).

---

### Script_setType
**C:** `void Script_setType(uint32_t serial, int typeID)`
**Wombat:** `void setType(obj entity, int typeID)`
**Notes:** Changes the entity's body/graphic type; resurrects dead players first, handles resource-entity recipe changes. Refreshes nearby clients.

---

### Script_setWaitState
**C:** `void Script_setWaitState(uint32_t serial, int value)`
**Wombat:** `void setWaitState(obj mobile, int value)`
**Notes:** Sets the mobile's wait-state maximum to `value` and resets the wait-state tick counter to 0.

---

### Script_setWeaponClass
**C:** `void Script_setWeaponClass(uint32_t serial, int numDice, int diceFaces, int bonus, int pad)`
**Wombat:** `void setWeaponClass(obj entity, int numDice, int diceFaces, int bonus, int pad)` _(index 599)_
**Notes:** Builds a CDiceRoll from the given fields and stores it as the weapon's damage dice or the mobile's armor-rating dice; `pad` is ignored.

---

### Script_setWeaponCurHP
**C:** `int Script_setWeaponCurHP(uint32_t serial, int curHP)`
**Wombat:** `int setWeaponCurHP(obj weapon, int curHP)` _(index 601)_
**Notes:** Sets the weapon's current durability; returns 1 on success.

---

### Script_setWeaponMaxHP
**C:** `int Script_setWeaponMaxHP(uint32_t serial, int maxHP)`
**Wombat:** `int setWeaponMaxHP(obj weapon, int maxHP)` _(index 603)_
**Notes:** Sets the weapon's maximum durability; returns 1 on success.

---

### Script_setX
**C:** `void Script_setX(CLocation *loc, int value)`
**Wombat:** `void setX(loc loc, int value)`
**Notes:** Writes `value` into the x component of `loc` (in-place mutation via loc* out-param). _(builtin [504])_

---

### Script_setY
**C:** `void Script_setY(CLocation *loc, int value)`
**Wombat:** `void setY(loc loc, int value)`
**Notes:** Writes `value` into the y component of `loc`. _(builtin [505])_

---

### Script_setZ
**C:** `void Script_setZ(CLocation *loc, int value)`
**Wombat:** `void setZ(loc loc, int value)`
**Notes:** Writes `value` into the z component of `loc`. _(builtin [506])_

---

### Script_sfx
**C:** `void Script_sfx(CLocation *loc, int soundID, int volume)`
**Wombat:** `void sfx(loc position, int soundID, int volume)`
**Notes:** Plays `soundID` at `loc` for all nearby players; records into an active AnimSequence if one is open. Validates coordinates and sound ID range (≤ 0x24B).

---

### Script_sfxTo
**C:** `void Script_sfxTo(uint32_t serial, int soundID, int volume)`
**Wombat:** `void sfxTo(obj player, int soundID, int volume)`
**Notes:** Plays `soundID` for a single player only; records into an active AnimSequence if one is open.

---

### Script_shopKeeperOpenBusiness
**C:** `void Script_shopKeeperOpenBusiness(uint32_t npcSerial, uint32_t playerSerial)`
**Wombat:** `void shopKeeperOpenBusiness(obj npcSerial, obj playerSerial)`
**Notes:** Opens the vendor's buy window for the player. _(builtin [496])_

---

### Script_shopKeeperOpenBuying
**C:** `void Script_shopKeeperOpenBuying(uint32_t npcSerial, uint32_t playerSerial)`
**Wombat:** `void shopKeeperOpenBuying(obj npcSerial, obj playerSerial)`
**Notes:** Opens the vendor's sell window for the player. _(builtin [497])_

---

### Script_shortcallback
**C:** `void Script_shortcallback(uint32_t serial, int delay, int callbackId)`
**Wombat:** `void shortcallback(obj entity, int delay, int callbackId)` _(aliases: shortcallback, shortCallback)_
**Notes:** Same as `callback` but passes `delay` directly without multiplying by 4.

---

### Script_sortList
**C:** `void Script_sortList(CList *list, int flags)`
**Wombat:** `void sortList(list list, int flags)`
**Notes:** Bubble-sorts `list`; bit 0 of `flags` reverses order, remaining bits select comparator (0=int, 2=string, 4=object by sort key).

---

## String Operations

### Script_split
**C:** `void Script_split(CList *list, CString *str)`
**Wombat:** `void split(list list, string str)` _(aliases: split, split)_
**Notes:** Tokenises `str` on whitespace, filtering each token to alphanumeric characters, and appends each token as a string to `list` (clears list first).

---

### Script_splitCommaDelimitedString
**C:** `void Script_splitCommaDelimitedString(CList *list, CString *str)`
**Wombat:** `void splitCommaDelimitedString(list list, string str)` _(aliases: split, splitCommaDelimitedString)_
**Notes:** Splits `str` on commas (stripping leading whitespace per token) and appends each token as a string to `list` (clears list first).

---

### Script_splitDice
**C:** `void Script_splitDice(CString *diceStr, CString *prefixOut, int *numDiceOut, int *facesOut, CString *sepOut, int *bonusOut)`
**Wombat:** `void splitDice(string diceStr, string &prefixOut, int &numDiceOut, int &facesOut, string &sepOut, int &bonusOut)`
**Notes:** Parses a dice expression "[+/-/!]NdF[+/-/!]B" into its sign prefix, numDice, faces, separator, and bonus out-params. _(builtin [610], typeSig `vsSIISI`)_

---

### Script_stopAttack
**C:** `void Script_stopAttack(uint32_t serial)`
**Wombat:** `void stopAttack(obj)` _(builtin 613)_
**Notes:** Clears the mobile's combat target list via `CMobile_StopCombat`; other mobiles may still be attacking it.

---

### Script_stopFight
**C:** `void Script_stopFight(uint32_t serial1, uint32_t serial2)`
**Wombat:** `void stopFight(obj, obj)` _(builtin 614)_
**Notes:** Removes `mob2` from `mob1`'s combat target list via `CMobile_StopFightWith`; does not touch the attacker list.

---

### Script_stopFollowing
**C:** `void Script_stopFollowing(uint32_t serial)`
**Wombat:** `void stopFollowing(obj npc)`
**Notes:** Stops an NPC from following its leader and returns it to idle; `followObj2` (the remembered leader) is intentionally left set.

---

### Script_strContains
**C:** `int Script_strContains(CString *haystack, CString *needle)`
**Wombat:** `int strContains(string haystack, string needle)` _(aliases: [768] — custom addition)_
**Notes:** Case-insensitive substring search; returns 1 if needle is found anywhere in haystack.

### Script_stringQuery
**C:** `void Script_stringQuery(uint32_t playerSerial, uint32_t serial, int type, CString *question, int cancel, int style, int maxLen, CString *title)`
**Wombat:** `void stringQuery(obj player, obj entity, int type, string question, int cancel, int style, int maxLen, string title)` _(aliases: [714])_
**Notes:** Sends a STRINGQUERY packet to the player asking question with the given UI parameters.

---

### Script_strlen
**C:** `int Script_strlen(CString *str)`
**Wombat:** `int strlen(string str)`
**Notes:** Returns the character length of `str`.

---

### Script_strtoi
**C:** `int Script_strtoi(CString *str)`
**Wombat:** `int strtoi(string str)`
**Notes:** Parses and returns the integer value of `str` via `atoi`.

---

### Script_superBark
**C:** `int Script_superBark(uint32_t serial, CString *text, int hue, int type, int font)`
**Wombat:** `int superBark(obj entity, string text, int hue, int type, int font)`
**Notes:** Speaks text on behalf of any entity with explicit hue, speech type, and font; returns 1 on success.

---

### Script_superTargetLoc
**C:** `void Script_superTargetLoc(uint32_t serial, uint32_t cursorId, int cursorType, int multiId)`
**Wombat:** `void supertargetloc(obj entity, obj cursorId, int cursorType, int multiId)` _(aliases: supertargetloc, superTargetLoc)_
**Notes:** Same as superTargetObj but sends TARGET in location mode (type=1); `multiId` is declared but unused.

---

### Script_superTargetObj
**C:** `void Script_superTargetObj(uint32_t serial, uint32_t cursorId, int cursorType)`
**Wombat:** `void supertargetobj(obj entity, obj cursorId, int cursorType)` _(aliases: supertargetobj, superTargetObj)_
**Notes:** Sends a TARGET cursor in object mode with explicit cursor type; NPCs resolve their stored `targetObj`/`targetLoc` ObjVars and fire trigger 0x18 or 0x19.

---

### Script_systemMessage
**C:** `void Script_systemMessage(uint32_t serial, CString *str)`
**Wombat:** `void systemMessage(obj player, string message)`
**Notes:** Sends a default-coloured system message string to the named player.

---

### Script_systemMessageHued
**C:** `void Script_systemMessageHued(uint32_t serial, int hue, CString *str)`
**Wombat:** `void systemMessageHued(obj player, int hue, string message)`
**Notes:** Sends a system message (speech type 6, font 3) to the named player at the given hue.

---

### Script_targetLoc
**C:** `void Script_targetLoc(uint32_t serial, uint32_t cursorId)`
**Wombat:** `void targetloc(obj entity, obj cursorId)` _(aliases: targetloc, targetLoc)_
**Notes:** Sends a location-selection TARGET cursor to a player, or fires NPC target-resolution triggers (cursorType=0).

---

### Script_targetLocMulti
**C:** `void Script_targetLocMulti(uint32_t serial, uint32_t cursorId, int multiId, int xOff, int yOff, int facing)`
**Wombat:** `void targetlocmulti(obj entity, obj cursorId, int multiId, int xOff, int yOff, int facing)` _(aliases: targetlocmulti, targetLocMulti)_
**Notes:** Sends a TARGET_MULTI cursor (packet 0x99) for multi-placement; NPC path behaves identically to superTargetLoc.

---

### Script_targetLocObjList
**C:** `void Script_targetLocObjList(uint32_t serial, uint32_t cursorId, int multiId, int xOff, int yOff, CList *list)`
**Wombat:** `void targetLocObjList(obj entity, obj cursorId, int multiId, int xOff, int yOff, list typeList)`
**Notes:** Sends a TARGET_OBJLIST cursor (packet 0xB4) for multi-placement with an allowed object-type filter list.

---

### Script_targetObj
**C:** `void Script_targetObj(uint32_t serial, uint32_t cursorId)`
**Wombat:** `void targetobj(obj entity, obj cursorId)` _(aliases: targetobj, targetObj)_
**Notes:** Sends an object-selection TARGET cursor to a player, or fires NPC target-resolution triggers (cursorType=0).

---

### Script_teleport
**C:** `int Script_teleport(uint32_t serial, CLocation *loc)`
**Wombat:** `int teleport(obj entity, loc destination)`
**Notes:** Moves the entity (and any contained items) to `destination`; returns 0 on invalid destination, removed entity, or locked container. Clears the `bankOpenLoc` ObjVar on players.

---

### Script_teleportNoFall
**C:** `int Script_teleportNoFall(uint32_t serial, CLocation *loc)`
**Wombat:** `int teleportNoFall(obj entity, loc destination)`
**Notes:** Like `teleport` but skips post-move spatial notifications (no item-fall physics). Returns 0 on failure.

---

### Script_testAndLearnSkill
**C:** `int Script_testAndLearnSkill(uint32_t serial, int skillId, int difficulty, int range)`
**Wombat:** `int testAndLearnSkill(obj mobile, int skillId, int difficulty, int range)` _(index 409)_
**Notes:** Performs a learning skill check for `mobile`, awarding skill gain on success; returns 1 on success.

---

### Script_testSkill
**C:** `int Script_testSkill(uint32_t serial, int skillId)`
**Wombat:** `int testSkill(obj mobile, int skillId)` _(aliases: skillTest)_ _(indices 387, 388)_
**Notes:** Returns 1 when a default skill check on `skillId` succeeds for `mobile`, 0 otherwise.

---

### Script_testSkillReal
**C:** `int Script_testSkillReal(uint32_t serial, int skillId)`
**Wombat:** `int testSkillReal(obj mobile, int skillId)` _(aliases: skillTestReal)_ _(indices 389, 390)_
**Notes:** Returns the raw numeric result of a skill check on `skillId` for `mobile` without thresholding.

---

### Script_textEntry
**C:** `void Script_textEntry(uint32_t serial, uint32_t playerSerial, int gumpId, int parentId, CString *text)`
**Wombat:** `void textEntry(obj entity, obj player, int gumpId, int parentId, string text)` _(aliases: [713])_
**Notes:** Sends a TEXTENTRY packet to the player to populate the named gump field.

---

### Script_textMessage
**C:** `int Script_textMessage(uint32_t serial, CString *text, int hue, int font, int speechType)`
**Wombat:** `int textMessage(obj player, string text, int hue, int font, int speech_type)`
**Notes:** Sends a formatted speech packet to the player with explicit hue, font, and speech type; returns 1 on success.

---

### Script_textSubstitute
**C:** `int Script_textSubstitute(CString *dest, CString *src, CString *find, CString *replace)`
**Wombat:** `int textSubstitute(string* dest, string src, string find, string replace)`
**Notes:** Substitutes occurrences of `find` in `src` with `replace`, writing result into `dest`; returns 0 if src==dest or find is empty.

---

### Script_thinksItsAtHome
**C:** `int Script_thinksItsAtHome(uint32_t serial)`
**Wombat:** `int thinksItsAtHome(obj serial)`
**Notes:** Returns 1 if a non-mobile, non-contained item is physically sitting at the location stored in its "home" ObjVar. _(builtin [488])_

---

### Script_toMobile
**C:** `int Script_toMobile(uint32_t thingSerial, uint32_t mobileSerial)`
**Wombat:** `int toMobile(obj thing, obj mobile)`
**Notes:** Equips `thing` on `mobile`; applies the same checks as `putObjContainer`. Returns 1 on success.

---

### Script_toUpper
**C:** `void Script_toUpper(CString *str, int start, int end)`
**Wombat:** `void toUpper(string* str, int start, int end)`
**Notes:** Uppercases characters in `str` at positions `[start, end)`; stops early at a NUL byte or if `start` exceeds the string length.

---

### Script_trackingTypeSelected
**C:** `void Script_trackingTypeSelected(CList *list, uint32_t serial, int trackType, int categoryTypeId, CLocation *filter)`
**Wombat:** `void trackingTypeSelected(list out, obj player, int trackType, int categoryTypeId, loc filter)` _(index 732)_
**Notes:** Handles the OBJPICKER callback for the Tracking skill; queries NPC and item maps around `filter`, filters by creature class and player skill tier, then sends a creature-selection dialog or a system message if too crowded or none found.

### Script_transferAllResources
**C:** `void Script_transferAllResources(uint32_t dstSerial, uint32_t srcSerial)`
**Wombat:** `void transferAllResources(obj dst, obj src)`
**Notes:** Moves every resource node from `src` to `dst`; no-op when src and dst are the same entity or either is invalid.

---

### Script_transferGeneric
**C:** `void Script_transferGeneric(uint32_t srcSerial, uint32_t dstSerial, int bodyType)`
**Wombat:** `void transferGeneric(obj src, obj dst, int bodyType)`
**Notes:** Moves stackable items of body type `bodyType` from `src` into `dst`; no-op when src equals dst or `bodyType` is zero.

---

### Script_transferGenericToContainer
**C:** `uint32_t Script_transferGenericToContainer(uint32_t containerSerial, uint32_t mobileSerial, uint32_t itemType, uint32_t count)`
**Wombat:** `obj transferGenericToContainer(obj container, obj mobile, int itemType, int count)` _(index 412)_
**Notes:** Removes `count` units of stackable `itemType` from the mobile's equipment and places the resulting stack in `container`; vendors can fall back to gold subtraction for itemType 0xEED; returns the stack's serial or 0 on failure.

### Script_transferGenericToWorld
**C:** `uint32_t Script_transferGenericToWorld(CLocation *loc, uint32_t mobileSerial, uint32_t itemType, uint32_t count)`
**Wombat:** `obj transferGenericToWorld(loc location, obj mobile, int item_type, int count)`
**Notes:** Removes `count` units of the stackable type `item_type` from `mobile`'s equipment and drops the stack at `location`; returns the stack's serial or 0 on failure.

---

### Script_transferPlayer
**C:** `void Script_transferPlayer(uint32_t sourceSerial, uint32_t targetSerial, CString *serverStr)`
**Wombat:** `void transferPlayer(obj source, obj player, string server)` _(aliases: [738])_
**Notes:** Fires the Transfer event (0x41) on source to migrate player to another shard.

---

### Script_transferResources
**C:** `void Script_transferResources(uint32_t dstSerial, uint32_t srcSerial, int amount, CString *resName)`
**Wombat:** `void transferResources(obj dst, obj src, int amount, string resName)`
**Notes:** Moves up to `amount` of the named resource type from `src` to `dst`; depleted source resource nodes are cleaned up afterward.

---

### Script_truncateList
**C:** `void Script_truncateList(CList *list, int index)`
**Wombat:** `void truncateList(list list, int index)`
**Notes:** Drops every entry at `index` and beyond, keeping only the first `index` elements.

---

### Script_unRide
**C:** `int Script_unRide(uint32_t serial)`
**Wombat:** `int unRide(obj)` _(builtin 288)_
**Notes:** Dismounts the mobile from its current mount (`CMobile_Dismount`); returns the dismount result or 0 on failure.

---

### Script_updateHint
**C:** `void Script_updateHint(int hintId, uint32_t serial, int flags, CString *name1, CString *name2, CLocation *loc, uint32_t objSerial, CString *name3, int param)`
**Wombat:** `void updateHint(int hintId, obj serial, int flags, string name1, string name2, loc loc, obj objSerial, string name3, int param)`
**Notes:** Allocates a CHintItem populated from the arguments and registers it with the global hint manager. _(builtin [574], typeSig `vioisscosi`)_

---

### Script_updatesOff
**C:** `void Script_updatesOff(void)`
**Wombat:** `void updatesOff()`
**Notes:** Suppresses entity update broadcasts by incrementing the suppress counter and clearing the updates-enabled flag.

---

### Script_updatesOn
**C:** `void Script_updatesOn(void)`
**Wombat:** `void updatesOn()`
**Notes:** Restores entity update broadcasts; when the suppress counter reaches zero, deferred dirty block flags are processed and a global light packet is sent to all players.

---

### Script_useItem
**C:** `void Script_useItem(uint32_t playerSerial, uint32_t itemSerial)`
**Wombat:** `void useItem(obj playerSerial, obj itemSerial)`
**Notes:** Programmatically triggers a use-item action by `player` on `item`, firing UseObject/UseItem events with tile-flag fallback. _(builtin [518])_

---

### Script_waitState
**C:** `int Script_waitState(uint32_t serial)`
**Wombat:** `int waitState(obj mobile)`
**Notes:** Returns the mobile's current wait-state action value (`CMobile_GetWaitStateAction`).

---

### Script_walk
**C:** `int Script_walk(uint32_t serial, int dir)`
**Wombat:** `int walk(obj mobile, int dir)`
**Notes:** Steps the mobile one tile in direction `dir` (0–7); returns 1 on success, 0 if direction is invalid or WalkCheck refuses.

---

### Script_walkTo
**C:** `void Script_walkTo(uint32_t serial, CLocation *loc, int range)`
**Wombat:** `void walkTo(obj npc, loc destination, int range)`
**Notes:** Tells an NPC to pathfind toward `destination` stopping within `range` tiles; aborts the current script thread if the entity is not an NPC.

---

### Script_webBrowse
**C:** `void Script_webBrowse(uint32_t serial, CString *str)`
**Wombat:** `void webBrowse(obj player, string url)` _(aliases: [715])_
**Notes:** Sends a WEB_BROWSE packet instructing the player's client to open the given URL.

---

### Script_whereIs
**C:** `CLocation *Script_whereIs(CLocation *retloc, uint32_t serial)`
**Wombat:** `loc whereIs(obj)` _(builtin 279)_
**Notes:** Like `getLocation`: returns the root container's world location via `VT_GET_LOCATION`, falling back to `(-1, -1, 0)` when the entity is missing.

---

### Script_whoIsLargestConsumer
**C:** `int Script_whoIsLargestConsumer(CLocation *loc, int templateIndex)`
**Wombat:** `int whoIsLargestConsumer(loc location, int templateIndex)` _(aliases: [700])_
**Notes:** Returns the resource bank's respawn timer for templateIndex at loc.

---

### Script_withdrawAndDestroy
**C:** `int Script_withdrawAndDestroy(uint32_t serial, uint32_t amount)`
**Wombat:** `int withdrawAndDestroy(obj mobile, int amount)`
**Notes:** Same as `withdrawFromBank` but destroys the gold item instead of placing it in the backpack; returns 1 on success, 0 on failure.

---

### Script_withdrawFromBank
**C:** `int Script_withdrawFromBank(uint32_t serial, uint32_t amount)`
**Wombat:** `int withdrawFromBank(obj mobile, int amount)`
**Notes:** Subtracts `amount` gold from the mobile's bank and equips the resulting stack into the mobile's backpack; returns 1 on success, 0 on failure.

---

### Script_witnessCrime
**C:** `int Script_witnessCrime(CLocation *loc, uint32_t criminalSerial, uint32_t victimSerial, CString *str, int delay, int priority, int crimeType)`
**Wombat:** `int witnessCrime(loc location, obj criminal, obj victim, string desc, int delay, int priority, int crimeType)` _(aliases: [557])_
**Notes:** Processes a crime witness event at loc; crimeType must be [0,5). Returns 0 on invalid args.

---

### Script_wordWrap
**C:** `int Script_wordWrap(CList *list, CString *str, int wrapWidth)`
**Wombat:** `int wordWrap(list list, string str, int wrapWidth)`
**Notes:** Word-wraps `str` into lines of at most `wrapWidth` characters and appends each line to `list`; returns the number of lines produced.

---
