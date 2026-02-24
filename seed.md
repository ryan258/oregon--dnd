# Oregon Trail RPG — Game Design Document

### A D&D Skeleton with an Oregon Trail Skin

---

## Overview

**Premise:** A turn-based survival RPG set on the 1848 Oregon Trail. Players manage a wagon party of 4 characters from Independence, Missouri to Willamette Valley, Oregon — roughly 2,000 miles across plains, mountains, and desert. The D&D engine runs underneath: every meaningful action resolves with a skill check, inventory is tracked as a resource system, and character death is permanent.

**Session length:** Designed for a single extended session or a short campaign of 5–7 sessions (one per trail segment). _Note: Segments 2 and 3 are shorter (~200 miles each, ~10 trail days) and combine naturally into a single session._

**Players:** 1 GM + 1–4 players (each player controls one wagon party member), or solo with all 4 party members.

---

## Core Philosophy

The Oregon Trail was fundamentally about **resource attrition and probabilistic death.** D&D is fundamentally about **skill checks and character identity.** The crossover: your character's stats determine how likely they are to survive the river crossing, find game while hunting, or resist the fever. You're not a hero in a dungeon — you're a person trying not to die of dysentery.

Three design commitments:

1. **Failure is expected, not exceptional.** The trail killed roughly 1 in 10 emigrants. Bad rolls have real consequences.
2. **Choices matter before the check.** Buying fewer oxen to save money is a decision that shapes every check that follows.
3. **Characters are people, not builds.** Stats reflect occupation and background, not combat optimization.

---

## Characters

### The Four Roles

Every wagon party has four roles. In multiplayer, each player takes one. In solo play, the GM controls all four.

| Role             | Real-World Equivalent                     | Primary Stat | Secondary Stat |
| ---------------- | ----------------------------------------- | ------------ | -------------- |
| **The Guide**    | Wagon train leader / frontiersman         | Wisdom       | Constitution   |
| **The Doctor**   | Camp physician or experienced homesteader | Intelligence | Wisdom         |
| **The Hunter**   | Family member responsible for food        | Dexterity    | Strength       |
| **The Teamster** | Ox driver, wagon mechanic                 | Strength     | Constitution   |

### Competence Floor (Role Mastery)

To ensure experts aren't undone entirely by a single bad d20 roll, each role has a specific resource-spend or mitigation mechanic:

- **The Guide (Take 10):** When rolling a Wisdom check to navigate or read the trail with a DC of 13 or lower, the Guide can choose to "Take 10" instead of rolling the d20. They add their modifier to 10. If this meets the DC, they succeed automatically, preventing a wandering-in-circles failure.
- **The Teamster (Jury-Rig):** When failing a Strength check to repair the wagon, the Teamster can choose to permanently spend 1 maximum Wagon HP to automatically reroll the check. They must accept the new result.
- **The Hunter (Take Aim):** Instead of rolling Dexterity to hunt and risking starvation, the Hunter can spend a full day hunting (zero travel progress) to automatically yield 50 lbs of food with no ammo cost. This is distinct from a normal hunt-while-traveling (which allows half-speed travel but requires a roll and ammo).
- **The Doctor (Triage):** When forced to roll an Intelligence check to diagnose or treat a severe illness, the Doctor can spend an additional dose of Medicine to gain Advantage on the roll.

### Stats

Six stats, same names as D&D, same modifier calculation (score of 10–11 = +0, 12–13 = +1, etc.), but recontextualized for the frontier:

- **Strength** — Lifting, repairing wagon wheels, crossing rivers on foot, physical labor
- **Dexterity** — Hunting accuracy, navigating treacherous terrain on foot, quick reactions
- **Constitution** — Resisting illness, enduring cold, surviving injuries, pushing through exhaustion
- **Intelligence** — Reading conditions, navigation, disease diagnosis, bartering
- **Wisdom** — Trail sense, weather reading, people reading, knowing when to rest
- **Charisma** — Negotiating at forts, managing party morale, trading with Native peoples

### Stat Generation

Use the **historical method**: Roll 3d6 in order for each stat. No rerolling. No point buy. The trail doesn't care about your preferences.

_Optional "Background Bump":_ Each role gets +2 to their Primary Stat and +1 to their Secondary Stat after rolling.

### Health

Characters have **Hit Points** equal to 8 + CON modifier, rolled once at character creation. No leveling up — this is not that kind of story.

**Wound Track:** When a character reaches 0 HP, they don't die immediately. They go on the Wound Track:

- **Wounded** — Half movement, disadvantage on physical checks
- **Gravely Ill / Injured** — Bedridden, cannot act, party must make camp to care for them
- **Dead** — No resurrection. Mark their grave on the trail map.

---

## The Trail

### Trail Segments

The journey is divided into **7 segments**, each representing a major geographic or logistical phase. Each segment takes approximately 2–3 in-game weeks and consists of a series of **Trail Days**.

| Segment                 | Miles       | Key Hazard                | Landmark          |
| ----------------------- | ----------- | ------------------------- | ----------------- |
| 1. The Plains           | 0–300       | Weather, exhaustion       | Fort Kearny       |
| 2. The River Crossings  | 300–500     | Drowning, wagon loss      | Fort Laramie      |
| 3. The Rockies Approach | 500–700     | Terrain, supply depletion | Independence Rock |
| 4. South Pass           | 700–900     | Altitude, cold            | South Pass summit |
| 5. Desert Crossing      | 900–1,100   | Heat, dehydration         | Fort Hall         |
| 6. The Snake River      | 1,100–1,600 | River hazards, theft      | Fort Boise        |
| 7. The Blue Mountains   | 1,600–2,000 | Cold, final attrition     | Willamette Valley |

### Travel Resolution

On a standard Travel day, the party covers miles based on their chosen **Travel Stance** (see below). No roll is required for basic travel — the party simply advances the indicated distance and deducts resources.

**When a roll is required:** Certain weather conditions, terrain events, or hazards impose a **Travel check** — a group WIS or CON check (the GM chooses based on the obstacle) at a DC set by the specific hazard. Success means the party covers full distance; failure means half distance and the GM applies the hazard's consequence (lost time, damage, exhaustion). Weather and event entries that reference "Travel DC +X" increase the DC of any Travel check triggered that day.

**Hard Travel:** Reckless stance and Forced March count as **Hard Travel**. Hard Travel increases food consumption (see Food Consumption) and strains the oxen (see Oxen).

**Forced March:** The party may attempt to push beyond their stance's normal distance by 50%. This requires a **group CON check (DC 11)**. Failure: every character who failed gains 1 level of Exhaustion. A Forced March cannot be combined with Reckless stance.

**Miles per day by stance:**
- **Cautious:** 8–10 miles/day
- **Standard:** 15–20 miles/day
- **Reckless:** 22–30 miles/day

These are modified by terrain (mountain segments tend toward the low end), weather, and ox team losses (–25% per lost team).

### Trail Days

Each Trail Day follows this structure, unless the party engages a **Montage**.

**The Montage (Pushing Forward):** If the weather roll for the current 3-day span produces any **non-hazardous** weather condition (anything other than Blizzard, Heatwave, Heavy Thunderstorms, or Freezing Winds), the party may elect to _Push Forward_. Instead of rolling for 3 individual days, they automatically make 3 days of Standard travel progress, deduct 3 days of standard food consumption (and water, if tracked), and roll for a single Daily Event. This allows the table to fast-forward through quiet stretches and relieve pacing pressure during the mid-to-late game.

_Note: "Hot & Dry" weather does **not** qualify for montage — it doubles water consumption and makes forced march impossible, which is incompatible with the montage's narrative of easy travel._

**1. Morning Check-In**

- GM describes conditions (weather, terrain, visible landmarks)
- Party decides on their **Travel Stance** for the day (see Travel Resolution above for speeds):
  - **Cautious:** Once per 3-day stretch, the party gains Advantage on one daily Event Table roll (GM rolls twice, party takes the milder event). Represents trading food/time for safety.
  - **Standard:** Normal Event Table roll.
  - **Reckless:** Disadvantage on the Event Table roll (take the worst of two events). Represents trading health/wagon HP for pure speed.
- Party decides: _travel, rest, hunt, repair, or trade_

**2. The Day's Action**

- First, the GM rolls on the **Event Table** (see Events) and resolves it.
- Then, the party resolves their chosen action via skill check (see Skill Checks).
  - _Note on Action Economy:_ The wagon moves as a single unit. During a travel day, if the party chooses to hunt or repair, they are not traveling. However, one character may break off to hunt (at half travel speed for the party) while the rest continue, if the Guide makes a WIS check (DC 9) to keep the party on track without the full group. Repairs always require stopping.

**3. Resource Consumption**

- Deduct food: 1 lb per person per day (2 lbs if the party engaged in Hard Travel, 0.5 lbs if resting)
- Apply any oxen HP loss from travel (see Oxen)
- Apply any illness effects

**4. Camp**

- Party can treat wounds (Doctor's action)
- Party can discuss plans, roleplay, trade watch duties
- GM notes any incoming hazards for next day

---

## Skill Checks

### Rules Foundation

This game borrows its core resolution mechanic from the d20/5e SRD: d20 + modifier vs. DC, Advantage/Disadvantage, Exhaustion levels, and the six ability scores. It does **not** use classes, levels, proficiency bonus, AC, or combat rounds. Any 5e-adjacent term used in this document (like "saving throw") simply means "a check made to resist or avoid something" — there is no mechanical distinction between a "check" and a "save" in this system.

All checks use **d20 + relevant modifier vs. Difficulty Class (DC).**

### The Check Types

**Simple Check:** One character rolls. Success or fail, move on. Used for routine actions.

**Extended Check:** Requires multiple successes before a set number of failures. Used for complex tasks like repairing a broken axle (3 successes before 2 failures, DC 12 Strength each).

**Group Check:** All party members roll. If more than half succeed, the group succeeds. Used for river crossings, mountain passes, navigating in a blizzard.

**Contested Check:** Character rolls vs. GM roll. Used for trading (INT vs. INT), being ambushed (Perception vs. Stealth).

### Difficulty Classes

| DC  | Difficulty      | Example                                         |
| --- | --------------- | ----------------------------------------------- |
| 6   | Easy            | Walking a flat trail in good weather            |
| 9   | Moderate        | Fording a shallow river                         |
| 12  | Hard            | Hunting in poor conditions                      |
| 15  | Very Hard       | Crossing a flooded river with the wagon         |
| 18  | Brutal          | Surviving a blizzard without shelter            |
| 23  | Near Impossible | Saving a gravely ill character without medicine |

### Advantage and Disadvantage

Same as D&D: roll 2d20, take higher (advantage) or lower (disadvantage). If a roll has both Advantage and Disadvantage, they cancel and you roll normally.

**Advantage sources:** Resting an extra day before a hard check, having proper tools, another character assisting.

**Disadvantage sources:** Exhaustion (more than 3 days traveling without rest), missing equipment, illness, low morale.

### Key Skill Uses by Stat

**Strength**

- Repairing a broken wagon wheel (DC 12, extended)
- Helping push the wagon up a steep grade (DC 10, group)
- Carrying an injured party member (DC 11)

**Dexterity**

- Hunting: base DC 10, modified by terrain and season
- Navigating narrow mountain trails without slipping (DC 13)
- Catching a runaway ox (DC 12)

**Constitution**

- Resisting illness after exposure (DC varies by disease)
- Enduring forced march (DC 11, or gain a level of exhaustion)
- Surviving cold without adequate clothing (DC 13)

**Intelligence**

- Diagnosing illness (DC 11 — success means treatment is possible)
- Navigating by landmarks (DC 10, failure means wrong fork taken)
- Bartering at a fort (DC 9 — success gets fair price, failure gets gouged)

**Wisdom**

- Reading weather before it hits (DC 11 — success gives one day warning)
- Sensing an ambush before it happens (DC 13)
- Knowing when the oxen are about to give out (DC 9)

**Charisma**

- Convincing a fort trader to extend credit (DC 14)
- Keeping party morale from breaking during hardship (DC 11)
- Peaceful encounter resolution with hostile party (DC 16)

---

## Inventory & Resources

Resources are tracked as abstract units, not individual items. This keeps play moving without turning every session into a spreadsheet audit.

### Resource Categories

| Resource             | Starting Amount | Notes                                            |
| -------------------- | --------------- | ------------------------------------------------ |
| **Food** (lbs)       | 400–1,200 lbs   | Based on starting budget                         |
| **Water** (gallons)  | 20 gal          | Carried in barrels; refills at rivers and springs |
| **Oxen**             | 2–4 teams       | Each team has 10 HP                              |
| **Wagon HP**         | 30              | Repairs possible at forts or with parts          |
| **Medicine** (doses) | 0–10            | Purchased; required for serious illness          |
| **Ammunition**       | 50–200 rounds   | Expended by hunting                              |
| **Spare Parts**      | 0–3 sets        | Wagon wheels, axles, tongues                     |
| **Money** (dollars)  | Remainder       | Whatever is left after purchases at Independence |

### Starting Budget

The party collectively has **$800** to spend before leaving Independence. This is the first major decision of the game and shapes every subsequent resource check.

_GM Guidance: A minimum viable loadout (600 lbs food, 2 ox teams, 5 medicine, 2 spare parts, 100 rounds ammo) costs roughly $400. The remaining $400 is the party's buffer for fort resupply, where prices are 1.5x–4x higher. First-time players should be warned that under-buying food or oxen at Independence is the single most common cause of party wipes._

**Fort prices** escalate the further West you go (1.5x at Fort Kearny up to 4x at Fort Boise). See [03. Settlements & Trading](./03_settlements_and_trading.md) for the full pricing table. The trail does not have a return policy.

### Food Consumption

- Normal travel day (Cautious/Standard): 1 lb per person per day
- Hard travel day (Reckless or Forced March): 2 lbs per person per day
- Non-travel day (hunt/repair/trade): 1 lb per person per day
- Rest day (layover): 0.5 lbs per person per day
- Each hunting attempt expends **10 rounds of ammunition** (reduced by applicable background abilities). Failed hunts still expend ammunition. A successful hunt yields: **3d10 × 5 lbs** (good conditions) or **2d6 × 5 lbs** (poor conditions)

When food drops below **50 lbs**, the party is **foraging** — each day without a successful hunt, everyone makes a DC 11 Constitution check or gains one level of exhaustion.

### Oxen

Oxen are the party's engine. Without them, the wagon doesn't move.

- Each ox team has **10 HP**
- Hard Travel strains the oxen: on any day the party travels Recklessly or attempts a Forced March, one ox team loses 1 HP (GM chooses or roll randomly)
- Lose 2 HP crossing rivers (Dexterity check DC 11 to reduce to 1)
- Recover 1 HP per full rest day (requires extra food)
- At 0 HP, an ox team collapses. Reduce travel speed by 25% per lost team. At 0 teams: stranded.

### Wagon HP

The wagon absorbs punishment from terrain, river crossings, and accidents.

- Starts at 30 HP
- Loses HP from events (see Event Table)
- Repairs cost spare parts and a Strength check (DC 12, restores 1d6+2 HP)
- **Teamster's Upkeep:** During any rest day, the Teamster automatically restores 1 Wagon HP (no check, no parts) by tightening bolts, re-greasing axles, and patching minor wear.
- At 0 HP: wagon is unusable. Party must cache supplies and proceed on foot at half speed.

### Water

Water is only tracked as a resource in **arid or waterless stretches** (Segment 5: Desert Crossing, the Sublette Cutoff, and any event that specifies a dried-up water source). In river and plains segments, the party refills automatically at the end of each day.

- The wagon carries **20 gallons** of water in barrels (included at no extra cost; every wagon has them).
- Normal consumption: **2 gallons per day** (people + oxen).
- "Hot & Dry" or "Oppressive Heatwave" weather: consumption **doubles** to 4 gallons/day.
- At 0 gallons: every character and ox team takes **1d4 damage per day** and gains 1 level of Exhaustion.
- Refill: Automatic at any river, spring, or fort. Some events (Oasis, Clear Mountain Spring) also refill.
- Additional barrels can be purchased at forts for $3 each (Independence price), adding 10 gallons of capacity per barrel.

### Wagon Capacity

The wagon can carry a maximum of **2,500 lbs** of total cargo (food, water barrels, spare parts, personal effects, and passengers who are bedridden). Under normal conditions, the party won't approach this limit. It matters when:

- Events demand the party **drop weight** (e.g., "Supply Drop" in Segment 4 requires leaving behind 200 lbs).
- The party accumulates large amounts of food through successful hunts or trading.
- Bedridden characters (Gravely Ill/Injured on the Wound Track) count as ~150 lbs of cargo each.

The Pack-Master background's hidden rations "don't count against wagon capacity" — this is the exception that proves the rule.

### Exhaustion

Adapted from D&D 5e:

| Level | Effect                                         |
| ----- | ---------------------------------------------- |
| 1     | Disadvantage on all checks                     |
| 2     | Travel speed halved                            |
| 3     | Exhaustion disadvantage cannot be canceled by Advantage (you always roll with Disadvantage) |
| 4     | HP maximum halved                              |
| 5     | Cannot travel; bedridden                       |
| 6     | Death                                          |

Exhaustion is removed by: full rest days (removes 1 level), food (required to remove any level), or Intensive Care from the Doctor (removes 1 level, see [05. Camp Life](./05_camp_life.md)).

**Exhaustion Cap:** A character can gain at most 1 level of Exhaustion per day from involuntary sources (failed checks, environmental hazards). Voluntary sources (choosing a double watch shift) can still add beyond this cap.

**Desperate Forage:** When food is depleted and hunting is impossible, any character may attempt a **WIS or CON check (DC 9)** to scavenge 1d6 lbs of edible plants, insects, or bark. This yields barely enough to stave off starvation but not enough to thrive. No ammunition is required.

---

## Events

At the start of each Trail Day, the GM rolls **1d20** and consults the Event Table for the current segment. Events are not all bad — some are neutral or positive.

### Universal Event Table (d20)

| Roll | Event                                                                                                          |
| ---- | -------------------------------------------------------------------------------------------------------------- |
| 1    | **Disease strikes.** Random party member makes CON check (DC 13) or gets ill.                                  |
| 2    | **Wagon breakdown.** Wagon loses 1d6 HP. Repair check or lose a travel day.                                    |
| 3    | **Ox injury.** One ox team loses 2 HP.                                                                         |
| 4    | **Bad weather.** Travel DC increases by 2 for next 2 days.                                                     |
| 5    | **River crossing.** Group check (CON/STR DC varies by segment).                                                |
| 6    | **Thief in camp.** Lose 1d6 × 10 lbs food or 1d4 medicine unless Wisdom check DC 12.                           |
| 7    | **Trail fork.** Wisdom check DC 11 (Guide) — wrong fork costs 3 days.                                          |
| 8    | **Rough terrain.** Wagon loses 1d4 HP. No check.                                                               |
| 9    | **Party conflict.** Morale event — Charisma check DC 10 or all checks next day at disadvantage.                |
| 10   | **Nothing notable.** Uneventful travel day.                                                                    |
| 11   | **Nothing notable.** Uneventful travel day.                                                                    |
| 12   | **Good hunting sign.** Next hunt check has advantage.                                                          |
| 13   | **Travelers met.** Trade opportunity or information about trail ahead.                                         |
| 14   | **Fair weather.** Travel DC decreases by 2 for next day.                                                       |
| 15   | **Found provisions.** 1d4 × 20 lbs food, or 1d3 medicine doses.                                                |
| 16   | **Abandoned wagon.** Possibly spare parts — Investigation DC 10.                                               |
| 17   | **Rest opportunity.** Party can take a free half-rest (0.5 food consumption) without losing a full travel day. |
| 18   | **Scenic landmark.** Morale boost — advantage on next Charisma check.                                          |
| 19   | **Helpful locals.** Guidance on the trail ahead; advantage on next navigation check.                           |
| 20   | **Exceptional day.** Travel progress counts double AND a free hunt roll.                                       |

**Using the Segment Tables:** Roll 1d20 on the Universal table above. On results **1–9**, the GM may substitute the corresponding segment-specific 1d10 event (see [01. Events & Hazards](./01_events_and_hazards.md)) for local flavor. On results **10–20**, use the Universal result as written. This ensures each segment feels distinct while maintaining a baseline of neutral and positive events.

### Disease

When disease strikes, roll **1d6** to determine which:

| Roll | Disease            | DC  | Effect if Failed                                  |
| ---- | ------------------ | --- | ------------------------------------------------- |
| 1    | Dysentery          | 11  | Lose 1d4 HP/day, disadvantage on physical checks  |
| 2    | Typhoid            | 13  | Bedridden, gravely ill immediately                |
| 3    | Cholera            | 15  | Lose 2d4 HP immediately; CON save daily or worsen |
| 4    | Measles            | 10  | Disadvantage on all checks for 1 week             |
| 5    | Exhaustion illness | 9   | Gain 1 exhaustion level                           |
| 6    | Snakebite          | 12  | Lose 1d6 HP; disadvantage on STR/DEX for 3 days   |

**Disease Progression:** Each disease has a **duration** and a **daily effect** while active:

- **Dysentery:** Lasts 5 days. Lose 1d4 HP each morning; disadvantage on physical checks. Untreated: duration extends by 1d4 days.
- **Typhoid:** Lasts 7 days. Character is bedridden (Gravely Ill on Wound Track) for the full duration.
- **Cholera:** Lasts 3 days. Lose 2d4 HP on day 1; each subsequent day, CON save at the disease's DC or lose another 1d4 HP. Untreated: 50% chance of death on day 3.
- **Measles:** Lasts 7 days. Disadvantage on all checks for the duration.
- **Exhaustion Illness:** Immediate. Gain 1 Exhaustion level; no ongoing duration.
- **Snakebite:** Lasts 3 days. Lose 1d6 HP immediately; disadvantage on STR/DEX for the duration.

**Recovery:** At the end of each day, a diseased character makes a **CON save** at the disease's original DC. Success removes 1 day from the remaining duration. A character who reaches 0 remaining days is cured.

**Treatment:** Requires medicine (1 dose) + Doctor making INT check (DC 11). Success: the patient's recovery rate **doubles** (each successful CON save removes 2 days instead of 1, and the daily damage/effects are halved). Failure: condition stable — medicine is consumed, but no benefit. No medicine available: the disease cannot be treated, and any daily "worsen" effects apply at full force.

---

## Death & Morale

### Death

When a character dies, mark their grave with the current date and mile marker. To maintain narrative continuity and emotional weight, the replacement character should ideally be a **Secondary Survivor**—a spouse, older child, or cousin who was previously a background NPC in the wagon, now forced to step up into a primary role.

If the party must recruit a complete stranger at a fort or on the trail, that stranger comes with an **Inherited Burden**. The dying character extracts a promise (e.g., "Deliver this letter to my sister in the Valley"). The new character's morale is tethered to fulfilling this goal; abandoning the deceased's wagon drops the stranger's Morale to 0.

To ensure death remains a severe mechanical penalty and to prevent "farming" fresh characters, the following **Ghost Tax** applies to any new character joining mid-journey:

- **Integration Cost:** The new character is either untrained (as a secondary survivor) or demands proof of stability (as a stranger). The party must immediately expend **one** of the following: 50 lbs of food, 2 doses of medicine, or $20. If the party cannot afford any of these, they operate down a character until they can.
- **Shared Burden:** The new character immediately gains 1 level of Exhaustion (representing the disruption and stress of transition — not the full accumulated toll of the journey).
- **Loss of Institutional Knowledge (Role Lockout):** The new character cannot immediately use the deceased character's **Competence Floor ability** (e.g., if the Guide dies, the new character cannot use Take 10). This lockout lasts **3 trail days** (not a full segment) as the newcomer learns the ropes. The new character can still fill the Role and make normal checks during the lockout — they just lack the safety net.

Dead characters stay dead. There is no magic on the Oregon Trail.

### Morale

The party has a collective **Morale score** from 1–10 (starts at 7).

**Morale drops by 1 when:**

- A party member dies
- Food drops below 100 lbs
- The wagon takes critical damage (below 5 HP)
- A Charisma check to manage conflict fails

**Morale rises by 1 when:**

- A major landmark is reached (Fort Kearny, South Pass, etc.)
- A successful hunt produces 100+ lbs
- A party member is saved from death (Doctor's dramatic save)
- The party finds unexpected provisions

**Morale effects:**

| Morale | Effect                                        |
| ------ | --------------------------------------------- |
| 8–10   | Advantage on group checks                     |
| 5–7    | No modifier                                   |
| 3–4    | Disadvantage on Charisma and Wisdom checks    |
| 1–2    | Disadvantage on all checks; risk of desertion |
| 0      | Party disbands. The trail wins.               |

---

## Forts & Trading Posts

Forts represent the only reliable resupply points. They are expensive and their stock is limited.

**Fort stops follow this sequence:**

1. GM describes what's available and at what prices
2. Party deliberates — this is a roleplaying moment
3. The party may attempt to negotiate using the full bargaining system in [03. Settlements & Trading](./03_settlements_and_trading.md) (CHA or INT check vs. escalating DC by fort, with bonuses for meeting the Sutler's specific demand)
4. Purchases are made at the negotiated price

**Independence base prices:**

- Food: $0.50/lb
- Medicine: $4/dose
- Spare parts: $6/set
- Ammunition: $2/20 rounds
- Ox team: $32
- Extra water barrel (10 gal capacity): $3

_Fort prices use the escalating multiplier (1.5x–4x). For example, at Fort Hall (3x): Food = $1.50/lb, Medicine = $12/dose._

---

## Winning & Losing

### Victory Conditions

**Full Victory:** Reach Willamette Valley with all four party members alive. Rare. Worth celebrating.

**Partial Victory:** Reach Willamette Valley with at least one party member alive. This is what most real emigrants experienced — success at a cost.

**Failure:** All party members die, or the party is stranded (no oxen, no wagon, no food) more than 200 miles from a fort.

### Epilogues

At the end of each surviving character's story, the GM reads a brief epilogue — what they did in Oregon, how many years they lived, whether they found what they were looking for. This is adapted from the original game's tradition of telling you what happened after you arrived.

---

## Designer Notes

### What This Isn't

This framework isn't trying to simulate the Oregon Trail with historical accuracy. It's using the D&D skeleton — skill checks, stats, HP, resource tracking — as a mechanical language to tell stories about ordinary people in extraordinary circumstances. The numbers are tuned for drama, not simulation.

### Difficulty Tuning

As written, this is hard. Characters will die. Oxen will collapse. Wagons will break. This is intentional — the Oregon Trail was hard. GMs should communicate this upfront. Players who understand the stakes make better decisions and feel the losses more meaningfully.

If the group wants a softer experience, add +2 to all Constitution checks and give the party 200 extra starting dollars. That's the "banker from Boston" difficulty mode.

### Expanded Modules

This document serves as the core rulebook. The full game system is expanded across detailed modules:

- [01. Events & Hazards](./01_events_and_hazards.md) (Segment-specific 1d10 tables)
- [02. Character Backgrounds](./02_character_backgrounds.md) (Mechanical backgrounds by role)
- [03. Settlements & Trading](./03_settlements_and_trading.md) (Fort prices, bargaining)
- [04. Native Encounters](./04_native_encounters.md) (Diplomacy, tolls, assistance)
- [05. Camp Life & Rest Days](./05_camp_life.md) (Activities, morale, repair)
- [06. Weather & Environment](./06_weather_and_environment.md) (Seasonal weather tables)
- [07. Route Variants & Cutoffs](./07_route_variants.md) (High-risk shortcuts)

---

_"You have died of dysentery." — The Trail, indifferently._
