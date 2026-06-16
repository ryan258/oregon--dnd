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

_Note on Charisma:_ No role has Charisma as a primary or secondary stat. This is intentional — social skill on the frontier was not a specialization but a shared necessity. Any party member can attempt Charisma checks; players who invest in CHA through lucky rolls (or who roleplay well) naturally become the party's "face" without a dedicated role.

### Stat Generation

Use the **historical method**: Roll 3d6 in order for each stat. No rerolling. No point buy. The trail doesn't care about your preferences.

_Optional "Background Bump":_ Each role gets +2 to their Primary Stat and +1 to their Secondary Stat after rolling.

### Health

Characters have **Hit Points** equal to 8 + CON modifier, set once at character creation. No leveling up — this is not that kind of story.

**Wound Track:** When a character reaches 0 HP, they don't die immediately. They go on the Wound Track:

- **Wounded** — Disadvantage on STR and DEX checks (no travel-speed penalty)
- **Gravely Ill / Injured** — Bedridden, cannot act, party must make camp to care for them
- **Dead** — No resurrection. Mark their grave on the trail map.

**Wound Track rules:** The first time you hit 0 HP, mark **Wounded**. If you hit 0 HP again while Wounded, you become **Gravely Ill / Injured**. If you hit 0 HP while Gravely Ill / Injured, you die. Healing HP does not automatically clear a Wound Track state — it's a lingering condition.

**Recovering from the Wound Track:** At the end of a **Rest Day**, a character on the Wound Track may attempt a **CON check (DC 10)** to move one step up the track (Gravely → Wounded, Wounded → Healthy). Medical care can grant Advantage.

---

## The Trail

### Trail Segments

The journey is divided into **7 segments**, each representing a major geographic or logistical phase. Each segment takes approximately 2–3 in-game weeks and consists of a series of **Trail Days**.

| Segment                 | Miles       | Key Hazard                | Landmark          |
| ----------------------- | ----------- | ------------------------- | ----------------- |
| 1. The Plains           | 0–300       | Weather, exhaustion       | Fort Kearny       |
| 2. The River Crossings  | 300–500     | Drowning, wagon loss      | Fort Laramie      |
| 3. The Rockies Approach | 500–700     | Terrain, supply depletion | Independence Rock |
| 4. South Pass           | 700–900     | Altitude, cold            | South Pass summit / Fort Bridger |
| 5. Desert Crossing      | 900–1,100   | Heat, dehydration         | Fort Hall         |
| 6. The Snake River      | 1,100–1,600 | River hazards, theft      | Fort Boise        |
| 7. The Blue Mountains   | 1,600–2,000 | Cold, final attrition     | Willamette Valley |

**Fort mile markers (approx.):** Fort Kearny (300), Fort Laramie (500), Fort Bridger (850), Fort Hall (1,100), Fort Boise (1,600). When the party reaches or passes a fort’s mile marker, they arrive at that fort at the start of the next Trail Day.

### Travel Resolution

On a standard Travel day, the party covers miles based on their chosen **Travel Stance** (see below). No roll is required for basic travel — the party simply advances the indicated distance and deducts resources.

**When a roll is required:** Certain weather conditions, terrain events, or hazards impose a **Travel check** — a group WIS or CON check (the GM chooses based on the obstacle) at a DC set by the specific hazard. Success means the party covers full distance; failure means half distance and the GM applies the hazard's consequence (lost time, damage, exhaustion). Weather and event entries that reference "Travel DC +X" increase the DC of any Travel check triggered that day.

**Navigation checks:** Some rules call for a **Navigation check**. This is a WIS check (usually made by the Guide) to stay on the correct trail, pick the right fork, or find the safest route/crossing. The DC and consequences are set by the specific event/hazard.

**Hard Travel:** Reckless stance and any Forced March attempt count as **Hard Travel**. Hard Travel increases food consumption (see Food Consumption) and strains the oxen (see Oxen).

**Forced March:** Declare a Forced March before travel distance is finalized. The party attempts to push beyond their stance's normal distance by 50%, requiring a **group CON check (DC 11)**. Success: apply the +50% distance bonus. Failure: the party gains no extra miles, and every character who failed gains 1 level of Exhaustion. The attempt counts as Hard Travel whether it succeeds or fails. A Forced March cannot be combined with Reckless stance.

**Miles per day by stance:**
- **Cautious:** 8–10 miles/day
- **Standard:** 15–20 miles/day
- **Reckless:** 22–30 miles/day

These are modified by terrain (mountain segments tend toward the low end), weather, and ox team losses (multiply by 0.75 once for each lost team).

**Multipliers & rounding:** Some events modify the day with multipliers (e.g., "double time", "1.5× travel", "half rations"). Apply mileage multipliers after choosing stance miles (and after Forced March, if the check succeeds), then **round up to the nearest mile**. If a rule halves/doubles food or water consumption, apply it to the day's total and **round up to the nearest 0.5**.

**Stacking speed modifiers:** If multiple rules modify travel speed, multiply them together. Recommended order:

1. Choose stance miles.
2. Apply Forced March (+50%), if the Forced March check succeeds.
3. Apply all speed modifiers (weather/events and ox team losses). Ox team losses are multiplicative: multiply miles by 0.75 once for each lost team (one lost team = 75% speed; two lost teams = 56% speed).
4. If a Travel check fails and the consequence is “half distance,” apply ×0.5.
5. Round up.

### Trail Days

Each Trail Day follows this structure, unless the party engages a **Montage**.

**The Montage (Pushing Forward):** If the weather roll for the current 3-day span produces any **non-hazardous** weather condition (anything other than Hot & Dry, Clear / High Altitude, Heavy Thunderstorms, Late Frost, Summer Hail, Oppressive Heatwave, Cold Rains, Freezing Winds, or Early Blizzard), the party may elect to _Push Forward_. Instead of rolling for 3 individual days, they automatically make 3 days of Standard travel progress (**45 miles total before ox-team losses or other active speed modifiers**), deduct 3 days of standard food consumption (and water, if tracked), and roll for a single Daily Event. This allows the table to fast-forward through quiet stretches and relieve pacing pressure during the mid-to-late game.

If the prevailing weather has a 3-day-span effect (like Dust / High Winds lowering Morale), apply that effect **once** at the end of the montage.

_Montage events:_ If the single Daily Event rolled during a Montage is hazardous (disease, wagon breakdown, etc.), resolve it normally — it happens on one day of the 3-day span. The remaining 2 days of travel still count. If the event costs a full travel day (e.g., wagon breakdown), the Montage yields 2 days of progress instead of 3 (**30 miles total before active speed modifiers**).

**Time Loss (Lost Days):** Some events or hazards cause the party to lose time (e.g., "wrong fork costs 3 days", "a 3-day wait"). When this happens:

- Advance the calendar by the indicated number of days; gain **no net miles** during those days.
- Deduct food and water for each lost day based on what the delay represents (e.g., wrong forks/backtracking are travel days; repairs and waits are non-travel days; a deliberate layover is a Rest Day).
- Apply disease progression normally for each lost day (daily effects + end-of-day recovery checks).
- Do **not** roll additional Daily Events for lost days — the time loss is already the consequence.
- Weather still shifts every 3 days; if a lost-time span crosses a weather boundary, reroll weather as normal and apply its effects.

**1. Morning Check-In**

- GM describes conditions (weather, terrain, visible landmarks)
- Party decides on their **Travel Stance** for the day (see Travel Resolution above for speeds):
  - **Cautious:** At the start of each 3-day weather span, if the party's first travel day in that span is Cautious, they gain one Cautious safety use. Spend it before one daily Event Table roll on a Cautious day in that same span (GM rolls twice, party takes the milder event). If the party switches away from Cautious before spending it, the use is lost; switching to Cautious mid-span does not create a use until the next 3-day weather span. Represents trading food/time for safety.
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

Some rules include a parenthetical tag (e.g., **WIS (Survival)**, **CHA (Persuasion)**). These tags are descriptive and may be referenced by background hooks, but they are not a separate skill system.

### The Check Types

**Simple Check:** One character rolls. Success or fail, move on. Used for routine actions.

**Extended Check:** Requires multiple successes before a set number of failures. Used for complex tasks like lowering the wagon down a ravine (3 successes before 2 failures, DC 14 Strength each).

**Group Check:** All party members roll. If more than half succeed, the group succeeds. Used for river crossings, mountain passes, navigating in a blizzard.

**Contested Check:** Character rolls vs. GM roll. Used for trading (INT vs. INT), being ambushed (Perception vs. Stealth).

### Difficulty Classes

| DC  | Difficulty      | Example                                         |
| --- | --------------- | ----------------------------------------------- |
| 6   | Easy            | Walking a flat trail in good weather            |
| 9   | Moderate        | Fording a shallow river                         |
| 10  | Challenging     | Finding shelter on the open plains              |
| 12  | Hard            | Hunting in poor conditions                      |
| 15  | Very Hard       | Crossing a flooded river with the wagon         |
| 18  | Brutal          | Surviving a blizzard without shelter            |
| 23  | Near Impossible | Saving a gravely ill character without medicine |

### Advantage and Disadvantage

Same as D&D: roll 2d20, take higher (advantage) or lower (disadvantage). If a roll has both Advantage and Disadvantage, they cancel and you roll normally.

**Advantage sources:** Resting an extra day before a hard check, having proper tools, another character assisting.

**Disadvantage sources:** Exhaustion level 1+, missing equipment, illness, low morale.

**Inspiration:** A character with Inspiration may spend it to gain Advantage on one check (declare before rolling). You can only hold 1 Inspiration at a time.

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
| **Spare Parts**      | 0–3 parts       | Major wagon components (wheels, axles, tongues)  |
| **Money** (dollars)  | Remainder       | Whatever is left after purchases at Independence |

### Starting Budget

The party collectively has **$800** to spend before leaving Independence. This is the first major decision of the game and shapes every subsequent resource check.

_GM Guidance: A minimum viable loadout (600 lbs food, 2 ox teams, 5 medicine, 2 spare parts, 100 rounds ammo) costs **$406**, leaving **$394** as the party's buffer for fort resupply, where prices are 1.5x–4x higher. First-time players should be warned that under-buying food or oxen at Independence is the single most common cause of party wipes._

**Fort prices** escalate the further West you go (1.5x at Fort Kearny up to 4x at Fort Boise). See [03. Settlements & Trading](./03_settlements_and_trading.md) for the full pricing table. The trail does not have a return policy.

### Food Consumption

- Normal travel day (Cautious/Standard): 1 lb per person per day
- Hard travel day (Reckless or Forced March): 2 lbs per person per day
- Non-travel day (hunt/repair/trade): 1 lb per person per day
- Rest day (layover): 0.5 lbs per person per day
- Each hunting attempt expends **10 rounds of ammunition** (reduced by applicable background abilities). Failed hunts still expend ammunition. A successful hunt yields: **3d10 × 5 lbs** (good conditions) or **2d6 × 5 lbs** (poor conditions).
  - _Good vs. poor conditions:_ If the final Hunting DC is **12 or lower**, treat it as good conditions. If it is **13+**, treat it as poor conditions.

When food drops below **50 lbs**, the party is **foraging** — each day without a successful hunt, everyone makes a DC 11 Constitution check or gains one level of exhaustion.

When food is **0 lbs**, replace the foraging check with **Starvation**. Each day without a successful hunt or successful forage attempt, every character makes a **CON check (DC 11)** or gains 1 level of Exhaustion. On a failed starvation check, a character already at Exhaustion 3+ also takes **1d4 damage**. Morale drops by 1 for every 2 consecutive starving days. This is the standard Starvation rule in every segment; events that say starvation sets in invoke this rule and do not add a second, stacking starvation check.

### Rest Days (Layovers)

A **Rest Day** consumes 24 hours. The party makes zero miles of progress.

- **Consumption:** 0.5 lbs food per person
- **Recovery (end of day):** Each character heals **1d4+1 HP** and removes **1 level of Exhaustion** if they ate their full Rest Day ration (0.5 lbs) during the day. If food is short, choose which characters are fed before recovery; unfed characters still heal HP but do not remove Exhaustion from rest.
- **Wound Track:** Characters on the Wound Track may attempt their Wound Track recovery check (see Health)
- **Oxen:** Each ox team recovers **1 HP**
- **Camp actions:** Each character may take **one** Camp Action (see [05. Camp Life](./05_camp_life.md))

### Oxen

Oxen are the party's engine. Without them, the wagon doesn't move.

- Each ox team has **10 HP**
- Hard Travel strains the oxen: on any day the party travels Recklessly or attempts a Forced March, one ox team loses 1 HP (GM chooses or roll randomly)
- Lose 2 HP crossing rivers (Dexterity check DC 11 to reduce to 1)
- Recover 1 HP per full Rest Day (grazing/feeding is abstracted — no extra tracked food cost)
- At 0 HP, an ox team **collapses and dies** — it is permanently lost and cannot be recovered through rest or healing. Lost-team speed penalties are multiplicative: multiply miles traveled by 0.75 once for each lost team. At 0 teams: **stranded** — the wagon cannot move. The party may cache supplies and proceed on foot at half Standard speed (7–10 mi/day), attempt to purchase a replacement team at the nearest fort, or work for wages at a fort to fund new oxen. If no fort is reachable on foot, the party's journey is over.

### Wagon HP

The wagon absorbs punishment from terrain, river crossings, and accidents.

- Starts at 30 HP
- Loses HP from events (see Event Table)
- **Standard repair (field):** Stop for a day (no travel). Requires **1 spare part** available. STR check (DC 12). Success: spend 1 spare part and restore 1d6+2 Wagon HP. Failure: no HP restored; the spare part is **not** consumed.
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

Exhaustion is removed by: full rest days (removes 1 level), Intensive Care from the Doctor (removes 1 level, see [05. Camp Life](./05_camp_life.md)), and other effects that explicitly remove Exhaustion. A character must have eaten their full required ration that day to remove any Exhaustion level (0.5 lbs on a Rest Day). If food is short, decide who was fed before applying Exhaustion recovery.

**Exhaustion Cap:** A character can gain at most 1 level of Exhaustion per day from involuntary sources (failed checks, environmental hazards). Voluntary sources (choosing a double watch shift) can still add beyond this cap.

**Desperate Forage:** When food is depleted and hunting is impossible, any character may attempt a **WIS or CON check (DC 9)** to scavenge 1d6 lbs of edible plants, insects, or bark. This yields barely enough to stave off starvation but not enough to thrive. No ammunition is required.

---

## Events

At the start of each Trail Day, the GM rolls **1d20** and consults the Event Table for the current segment. Events are not all bad — some are neutral or positive.

### Universal Event Table (d20)

| Roll | Event                                                                                                          |
| ---- | -------------------------------------------------------------------------------------------------------------- |
| 1    | **Disease exposure.** Random party member is exposed. Roll on the Disease table, then make a disease resistance check (CON DC 13). Failure: apply the disease result. |
| 2    | **Wagon breakdown.** Wagon loses 1d6 HP. Lose a travel day dealing with it; attempt a standard repair if able. |
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
| 17   | **Rest opportunity.** The party may take a half-rest: halve miles traveled today (round up) and set food consumption to 0.5 lbs/person. Cannot be combined with Hard Travel. (This does not grant Rest Day healing/Exhaustion removal.) |
| 18   | **Scenic landmark.** Morale boost — advantage on next Charisma check.                                          |
| 19   | **Helpful locals.** Guidance on the trail ahead; advantage on next Navigation check.                           |
| 20   | **Exceptional day.** Multiply miles traveled today by 2 (round up). Additionally, the party may make one hunting attempt today with no ammo cost and no travel-speed penalty. |

**Using the Segment Tables:** Roll 1d20 on the Universal table above. On results **1–9**, the GM may substitute the corresponding segment-specific 1d10 event (see [01. Events & Hazards](./01_events_and_hazards.md)) for local flavor. On results **10–20**, use the Universal result as written. This ensures each segment feels distinct while maintaining a baseline of neutral and positive events.

### Disease

When disease exposure occurs:

1. Determine the exposed character(s). If the event does not say, choose one random party member.
2. Determine the disease. If the event names a disease, use that disease and do not roll. Otherwise, roll **1d6** on the Disease table.
3. Make the resistance check. Use the event's listed DC if it provides one; otherwise use the disease's DC. This is normally a CON check. If an event gives an avoidance check instead (such as DEX to dodge a snake), that check replaces the CON resistance check.
4. On failure, the character contracts the disease and immediately suffers the listed "Effect if Failed." Ongoing duration and recovery use the disease's normal DC unless the event says otherwise.

Roll **1d6** to determine an unnamed disease:

| Roll | Disease            | DC  | Effect if Failed                                  |
| ---- | ------------------ | --- | ------------------------------------------------- |
| 1    | Dysentery          | 11  | Lose 1d4 HP/day, disadvantage on STR/DEX checks   |
| 2    | Typhoid            | 13  | Bedridden, gravely ill immediately                |
| 3    | Cholera            | 15  | Lose 2d4 HP immediately; CON check daily or worsen |
| 4    | Measles            | 10  | Disadvantage on all checks for 1 week             |
| 5    | Exhaustion illness | 9   | Gain 1 exhaustion level                           |
| 6    | Snakebite          | 12  | Lose 1d6 HP; disadvantage on STR/DEX for 3 days   |

**Disease Progression:** Each disease has a **duration** and a **daily effect** while active:

- **Dysentery:** Lasts 5 days. Lose 1d4 HP each morning; disadvantage on STR/DEX checks. Untreated: duration extends by 1d4 days.
- **Typhoid:** Lasts 7 days. Character is bedridden (Gravely Ill on Wound Track) for the full duration.
- **Cholera:** Lasts 3 days. Lose 2d4 HP on day 1; each subsequent day, CON check at the disease's DC or lose another 1d4 HP. Untreated: on day 3, after daily damage, make a final **CON check (DC 11)**. Failure means death; success means the character survives and the disease duration can end normally.
- **Measles:** Lasts 7 days. Disadvantage on all checks for the duration.
- **Exhaustion Illness:** Immediate. Gain 1 Exhaustion level; no ongoing duration.
- **Snakebite:** Lasts 3 days. Lose 1d6 HP immediately; disadvantage on STR/DEX for the duration.

**Recovery:** At the end of each day, a diseased character makes a **CON check** at the disease's original DC. Success removes 1 day from the remaining duration. A character who reaches 0 remaining days is cured.

**Treatment:** The Doctor may attempt treatment **once per day** (during any phase of the Trail Day). Requires medicine (1 dose) + Doctor making INT check (DC 11). Success: the patient's recovery rate **doubles** (each successful CON check removes 2 days instead of 1, and the daily damage/effects are halved). Failure: condition stable — medicine is consumed, but no benefit. No medicine available: the disease cannot be treated, and any daily "worsen" effects apply at full force.

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

The party has a collective **Morale score** from 0–10 (starts at 7).

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
- Spare parts: $6/part
- Ammunition: $2/20 rounds
- Ox team: $32
- Extra water barrel (10 gal capacity): $3
- Warm Bedding (blankets/robes): $30 (party bundle)

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
