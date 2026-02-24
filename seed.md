# Oregon Trail RPG — Game Design Document

### A D&D Skeleton with an Oregon Trail Skin

---

## Overview

**Premise:** A turn-based survival RPG set on the 1848 Oregon Trail. Players manage a wagon party of 4 characters from Independence, Missouri to Willamette Valley, Oregon — roughly 2,000 miles across plains, mountains, and desert. The D&D engine runs underneath: every meaningful action resolves with a skill check, inventory is tracked as a resource system, and character death is permanent.

**Session length:** Designed for a single extended session or a short campaign of 5–8 sessions (one per trail segment).

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

- **The Guide (Take 10):** When rolling a Wisdom check to navigate or read the trail with a DC of 15 or lower, the Guide can choose to "Take 10" instead of rolling the d20. They add their modifier to 10. If this meets the DC, they succeed automatically, preventing a wandering-in-circles failure.
- **The Teamster (Jury-Rig):** When failing a Strength check to repair the wagon, the Teamster can choose to permanently spend 1 maximum Wagon HP to automatically reroll the check. They must accept the new result.
- **The Hunter (Take Aim):** Instead of rolling Dexterity to hunt and risking starvation, the Hunter can spend a full turn (the party loses all travel progress for the day) to automatically yield a guaranteed minimum of 50 lbs of food.
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
| 6. The Snake River      | 1,100–1,400 | River hazards, raids      | Fort Boise        |
| 7. The Blue Mountains   | 1,400–2,000 | Cold, final attrition     | Willamette Valley |

### Trail Days

Each Trail Day follows this structure, unless the party engages a **Montage**.

**The Montage (Pushing Forward):** If the weather roll for the current 3-day span is "Clear & Mild", the party may elect to _Push Forward_. Instead of rolling for 3 individual days, they automatically make 3 days of Standard travel progress, deduct 3 days of standard food/ox health, and roll for a single Daily Event. This allows the table to fast-forward through quiet stretches of the plains and focus on the dangerous segments.

**1. Morning Check-In**

- GM describes conditions (weather, terrain, visible landmarks)
- Party decides on their **Travel Stance** for the day:
  - **Cautious:** Halve travel speed. Advantage on the daily Event Table roll (or GM rolls twice, party takes the milder event). Represents trading food/time for safety.
  - **Standard:** Normal travel speed. Normal Event Table roll.
  - **Reckless:** 1.5x travel speed. Disadvantage on the Event Table roll (take the worst of two events). Represents trading health/wagon HP for pure speed.
- Party decides: _travel, rest, hunt, repair, or trade_

**2. The Day's Action**

- Resolve the chosen action via skill check (see Skill Checks)
- GM rolls on the **Event Table** (see Events)

**3. Resource Consumption**

- Deduct food: 1 unit per person per day (2 if traveling hard, 0.5 if resting)
- Deduct oxen health if traveling (see Oxen)
- Apply any illness effects

**4. Camp**

- Party can treat wounds (Doctor's action)
- Party can discuss plans, roleplay, trade watch duties
- GM notes any incoming hazards for next day

---

## Skill Checks

All checks use **d20 + relevant modifier vs. Difficulty Class (DC).**

### The Check Types

**Simple Check:** One character rolls. Success or fail, move on. Used for routine actions.

**Extended Check:** Requires multiple successes before a set number of failures. Used for complex tasks like repairing a broken axle (3 successes before 2 failures, DC 14 Strength each).

**Group Check:** All party members roll. If more than half succeed, the group succeeds. Used for river crossings, mountain passes, navigating in a blizzard.

**Contested Check:** Character rolls vs. GM roll. Used for trading (INT vs. INT), being ambushed (Perception vs. Stealth).

### Difficulty Classes

| DC  | Difficulty      | Example                                         |
| --- | --------------- | ----------------------------------------------- |
| 8   | Easy            | Walking a flat trail in good weather            |
| 11  | Moderate        | Fording a shallow river                         |
| 14  | Hard            | Hunting in poor conditions                      |
| 17  | Very Hard       | Crossing a flooded river with the wagon         |
| 20  | Brutal          | Surviving a blizzard without shelter            |
| 25  | Near Impossible | Saving a gravely ill character without medicine |

### Advantage and Disadvantage

Same as D&D: roll 2d20, take higher (advantage) or lower (disadvantage).

**Advantage sources:** Resting an extra day before a hard check, having proper tools, another character assisting.

**Disadvantage sources:** Exhaustion (more than 3 days traveling without rest), missing equipment, illness, low morale.

### Key Skill Uses by Stat

**Strength**

- Repairing a broken wagon wheel (DC 14, extended)
- Helping push the wagon up a steep grade (DC 12, group)
- Carrying an injured party member (DC 13)

**Dexterity**

- Hunting: base DC 12, modified by terrain and season
- Navigating narrow mountain trails without slipping (DC 15)
- Catching a runaway ox (DC 14)

**Constitution**

- Resisting illness after exposure (DC varies by disease)
- Enduring forced march (DC 13, or gain a level of exhaustion)
- Surviving cold without adequate clothing (DC 15)

**Intelligence**

- Diagnosing illness (DC 13 — success means treatment is possible)
- Navigating by landmarks (DC 12, failure means wrong fork taken)
- Bartering at a fort (DC 11 — success gets fair price, failure gets gouged)

**Wisdom**

- Reading weather before it hits (DC 13 — success gives one day warning)
- Sensing an ambush before it happens (DC 15)
- Knowing when the oxen are about to give out (DC 11)

**Charisma**

- Convincing a fort trader to extend credit (DC 16)
- Keeping party morale from breaking during hardship (DC 13)
- Peaceful encounter resolution with hostile party (DC 18)

---

## Inventory & Resources

Resources are tracked as abstract units, not individual items. This keeps play moving without turning every session into a spreadsheet audit.

### Resource Categories

| Resource             | Starting Amount | Notes                                       |
| -------------------- | --------------- | ------------------------------------------- |
| **Food** (lbs)       | 400–1,200 lbs   | Based on starting budget                    |
| **Oxen**             | 2–4 teams       | Each team has 10 HP                         |
| **Wagon HP**         | 20              | Repairs possible at forts or with parts     |
| **Medicine** (doses) | 0–10            | Purchased; required for serious illness     |
| **Ammunition**       | 50–200 rounds   | Expended by hunting                         |
| **Spare Parts**      | 0–3 sets        | Wagon wheels, axles, tongues                |
| **Money** (dollars)  | $0–200          | Starting budget determines all of the above |

### Starting Budget

The party collectively has **$800** to spend before leaving Independence. This is the first major decision of the game and shapes every subsequent resource check.

**Fort prices** are 2–3x Independence prices. The trail does not have a return policy.

### Food Consumption

- Normal travel: 1 lb per person per day
- Hard push: 2 lbs per person per day
- Rest day: 0.5 lbs per person per day
- A successful hunt yields: **3d10 × 5 lbs** (good conditions) or **2d6 × 5 lbs** (poor conditions)

When food drops below **50 lbs**, the party is **foraging** — each day without a successful hunt, everyone makes a DC 13 Constitution check or gains one level of exhaustion.

### Oxen

Oxen are the party's engine. Without them, the wagon doesn't move.

- Each ox team has **10 HP**
- Lose 1 HP per segment of hard travel
- Lose 2 HP crossing rivers (Dexterity check DC 13 to reduce to 1)
- Recover 1 HP per full rest day (requires extra food)
- At 0 HP, an ox team collapses. Reduce travel speed by 25% per lost team. At 0 teams: stranded.

### Wagon HP

The wagon absorbs punishment from terrain, river crossings, and accidents.

- Starts at 20 HP
- Loses HP from events (see Event Table)
- Repairs cost spare parts and a Strength check (DC 14, restores 1d6+2 HP)
- At 0 HP: wagon is unusable. Party must cache supplies and proceed on foot at half speed.

### Exhaustion

Borrowed directly from D&D 5e:

| Level | Effect                                         |
| ----- | ---------------------------------------------- |
| 1     | Disadvantage on all skill checks               |
| 2     | Speed halved                                   |
| 3     | Disadvantage on attack rolls and saving throws |
| 4     | HP maximum halved                              |
| 5     | Speed reduced to 0                             |
| 6     | Death                                          |

Exhaustion is removed by: full rest days (removes 1 level) and food (required to remove any level).

---

## Events

At the start of each Trail Day, the GM rolls **1d20** and consults the Event Table for the current segment. Events are not all bad — some are neutral or positive.

### Universal Event Table (d20)

| Roll | Event                                                                                                          |
| ---- | -------------------------------------------------------------------------------------------------------------- |
| 1    | **Disease strikes.** Random party member makes CON check (DC 15) or gets ill.                                  |
| 2    | **Wagon breakdown.** Wagon loses 1d6 HP. Repair check or lose a travel day.                                    |
| 3    | **Ox injury.** One ox team loses 2 HP.                                                                         |
| 4    | **Bad weather.** Travel DC increases by 2 for next 2 days.                                                     |
| 5    | **River crossing.** Group check (CON/STR DC varies by segment).                                                |
| 6    | **Thief in camp.** Lose 1d6 × 10 lbs food or 1d4 medicine unless Wisdom check DC 14.                           |
| 7    | **Trail fork.** Wisdom check DC 13 (Guide) — wrong fork costs 3 days.                                          |
| 8    | **Rough terrain.** Wagon loses 1d4 HP. No check.                                                               |
| 9    | **Party conflict.** Morale event — Charisma check DC 12 or all checks next day at disadvantage.                |
| 10   | **Nothing notable.** Uneventful travel day.                                                                    |
| 11   | **Nothing notable.** Uneventful travel day.                                                                    |
| 12   | **Good hunting sign.** Next hunt check has advantage.                                                          |
| 13   | **Travelers met.** Trade opportunity or information about trail ahead.                                         |
| 14   | **Fair weather.** Travel DC decreases by 2 for next day.                                                       |
| 15   | **Found provisions.** 1d4 × 20 lbs food, or 1d3 medicine doses.                                                |
| 16   | **Abandoned wagon.** Possibly spare parts — Investigation DC 12.                                               |
| 17   | **Rest opportunity.** Party can take a free half-rest (0.5 food consumption) without losing a full travel day. |
| 18   | **Scenic landmark.** Morale boost — advantage on next Charisma check.                                          |
| 19   | **Helpful locals.** Guidance on the trail ahead; advantage on next navigation check.                           |
| 20   | **Exceptional day.** Travel progress counts double AND a free hunt roll.                                       |

_Each trail segment has a supplemental table with 1d10 segment-specific events (river hazards for Segment 2, altitude events for Segment 4, etc.). GMs should develop these for their run._

### Disease

When disease strikes, roll **1d6** to determine which:

| Roll | Disease            | DC  | Effect if Failed                                  |
| ---- | ------------------ | --- | ------------------------------------------------- |
| 1    | Dysentery          | 13  | Lose 1d4 HP/day, disadvantage on physical checks  |
| 2    | Typhoid            | 15  | Bedridden, gravely ill immediately                |
| 3    | Cholera            | 17  | Lose 2d4 HP immediately; CON save daily or worsen |
| 4    | Measles            | 12  | Disadvantage on all checks for 1 week             |
| 5    | Exhaustion illness | 11  | Gain 1 exhaustion level                           |
| 6    | Snakebite          | 14  | Lose 1d6 HP; disadvantage on STR/DEX for 3 days   |

**Treatment:** Requires medicine (1 dose) + Doctor making INT check (DC 13). Success: patient recovers at double rate. Failure: condition stable but unchanged. No medicine: condition worsens each day.

---

## Death & Morale

### Death

When a character dies, mark their grave with the current date and mile marker. To maintain narrative continuity and emotional weight, the replacement character should ideally be a **Secondary Survivor**—a spouse, older child, or cousin who was previously a background NPC in the wagon, now forced to step up into a primary role.

If the party must recruit a complete stranger at a fort or on the trail, that stranger comes with an **Inherited Burden**. The dying character extracts a promise (e.g., "Deliver this letter to my sister in the Valley"). The new character's morale is tethered to fulfilling this goal; abandoning the deceased's wagon drops the stranger's Morale to 0.

To ensure death remains a severe mechanical penalty and to prevent "farming" fresh characters, the following **Ghost Tax** applies to any new character joining mid-journey:

- **Integration Cost:** The new character is either untrained (as a secondary survivor) or demands proof of stability (as a stranger). The party must immediately expend 50 lbs of food, 2 doses of medicine, or $20 to integrate them. If the party cannot afford this, they operate down a character until they can.
- **Shared Burden:** The new character immediately gains the average Exhaustion level of the surviving party members (rounded up). They did not spawn from nowhere; they are already tired.
- **Loss of Institutional Knowledge (Role Lockout):** The new character cannot immediately take the Role of the deceased character (e.g., if the Guide dies, the new character cannot be the Guide). The party must operate without that Role's specific class bonuses and Competence abilities for one full Trail Segment.

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
- A successful hunt produces 200+ lbs
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
3. Purchases are made; prices are non-negotiable without a Charisma check (DC 16)
4. A successful Charisma check gets 10–20% off one purchase

**Typical fort prices (×2.5 Independence prices):**

- Food: $1.25/lb (Independence: $0.50/lb)
- Medicine: $10/dose (Independence: $4/dose)
- Spare parts: $15/set (Independence: $6/set)
- Ox team: $80 (Independence: $32)

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

- [01. Events & Hazards](file:///Users/ryanjohnson/Projects/oregon%20%20dnd/01_events_and_hazards.md) (Segment-specific 1d10 tables)
- [02. Character Backgrounds](file:///Users/ryanjohnson/Projects/oregon%20%20dnd/02_character_backgrounds.md) (Mechanical backgrounds by role)
- [03. Settlements & Trading](file:///Users/ryanjohnson/Projects/oregon%20%20dnd/03_settlements_and_trading.md) (Fort prices, bargaining)
- [04. Native Encounters](file:///Users/ryanjohnson/Projects/oregon%20%20dnd/04_native_encounters.md) (Diplomacy, tolls, assistance)
- [05. Camp Life & Rest Days](file:///Users/ryanjohnson/Projects/oregon%20%20dnd/05_camp_life.md) (Activities, morale, repair)
- [06. Weather & Environment](file:///Users/ryanjohnson/Projects/oregon%20%20dnd/06_weather_and_environment.md) (Seasonal weather tables)
- [07. Route Variants & Cutoffs](file:///Users/ryanjohnson/Projects/oregon%20%20dnd/07_route_variants.md) (High-risk shortcuts)

---

_"You have died of dysentery." — The Trail, indifferently._
