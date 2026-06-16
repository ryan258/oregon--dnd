# Oregon Trail RPG — Quickstart

This quickstart is a condensed, table-ready version of the rules in [`seed.md`](../seed.md). For deeper tables and optional modules, jump to:

- Segment events: [`01_events_and_hazards.md`](../01_events_and_hazards.md)
- Background hooks: [`02_character_backgrounds.md`](../02_character_backgrounds.md)
- Forts & negotiation: [`03_settlements_and_trading.md`](../03_settlements_and_trading.md)
- Native encounters: [`04_native_encounters.md`](../04_native_encounters.md)
- Camp actions: [`05_camp_life.md`](../05_camp_life.md)
- Weather: [`06_weather_and_environment.md`](../06_weather_and_environment.md)
- Cutoffs / finales: [`07_route_variants.md`](../07_route_variants.md)

Printable templates live in [`docs/sheets/`](./sheets/).

Want to see a full day in motion before you start? Read the [`SAMPLE_DAY.md`](./SAMPLE_DAY.md) — a complete annotated walkthrough of one mid-game trail day.

New to tabletop RPGs? Start with the [`glossary.md`](./glossary.md).

---

## What You Need

- Dice: d20, d10, d6, d4 (or a roller)
- Paper/pencils (or print the sheets in [`docs/sheets/`](./sheets/))
- 1 GM + 1–4 players (or solo controlling all 4 roles)

Solo note: if one person controls all four roles, keep four separate sheets and let each role lead decisions in their specialty. Roll all four characters on group checks as usual.

---

## 10-Minute Setup (Character + Wagon)

### 1) Assign Roles (the party has all four)

- **Guide** (WIS primary, CON secondary)
- **Doctor** (INT primary, WIS secondary)
- **Hunter** (DEX primary, STR secondary)
- **Teamster** (STR primary, CON secondary)

### 2) Roll Stats (3d6 in order)

Roll 3d6 for each stat *in order*: STR, DEX, CON, INT, WIS, CHA. No rerolls.

Optional: **Background Bump** (recommended for first-time groups): after rolling, each role gets **+2** to their primary stat and **+1** to their secondary stat.

### 3) Pick a Background Hook

Each character chooses **one** hook for their role from [`02_character_backgrounds.md`](../02_character_backgrounds.md).

### 4) Set HP and Wound Track

- **Max HP:** `8 + CON modifier` (set once at creation)
- At **0 HP**, you don’t immediately die; you move onto the **Wound Track**:
  - **Wounded:** disadvantage on STR and DEX checks (no travel-speed penalty)
  - **Gravely Ill / Injured** (bedridden): cannot act; the party must make camp to care for you
  - **Dead**: no resurrection

Wound Track rules: 1st time at 0 HP → Wounded; hitting 0 again while Wounded → Gravely; hitting 0 while Gravely → Dead. Healing HP doesn’t automatically clear Wound Track states. At the end of a Rest Day: **CON DC 10** to move 1 step up the track (medical help can grant Advantage).

### 5) Party Starting State

- **Start date:** mid-to-late April, 1848 (pick an exact date as a group)
- **Mile marker:** 0 (Independence, Missouri)
- **Morale:** starts at **7** (scale 0–10)
- **Starting budget:** **$800** (party pool) to buy supplies before leaving

Base prices (Independence) are in [`03_settlements_and_trading.md`](../03_settlements_and_trading.md).

### 6) First-Time “Safe” Starter Loadout (recommendation)

This is intentionally conservative to help groups learn the system:

- Food: **700 lbs**
- Ox teams: **3**
- Medicine: **7 doses**
- Spare parts: **3 parts**
- Ammunition: **160 rounds**
- Extra water barrels: **2** (10 gal capacity each; optional but useful insurance)
- Warm Bedding: **1** (party bundle; strongly recommended)

**Budget note:** At Independence base prices, this loadout costs **$544**, leaving **$256** for resupply. It is comfortable enough for teaching the game but still forces the party to hunt, bargain, or resupply. As a quick gut-check, that remaining cash buys roughly this much food:

- Fort Kearny (1.5×): ~341 lbs
- Fort Laramie (2×): ~256 lbs
- Fort Bridger (2.5×): ~205 lbs
- Fort Hall (3×): ~171 lbs
- Fort Boise (4×): ~128 lbs

---

## The Trail Day (Core Loop)

Each in-game day follows this structure:

1. **Weather** (every 3 days, or when entering a new segment): roll 1d6 on the seasonal table in [`06_weather_and_environment.md`](../06_weather_and_environment.md) (use the current **month**; segment notes are typical, not strict)
2. **Choose stance + action**
3. **Event**: GM rolls **1d20** on the Universal Event Table (see [`seed.md`](../seed.md))
   - If using segment events, on **1–9** roll a **separate d10** on the segment table for local flavor (see [`01_events_and_hazards.md`](../01_events_and_hazards.md))
4. **Resolve action** (travel/hunt/repair/trade/rest)
5. **Resource consumption** (food, water if tracked, oxen strain, illness effects)
6. **Camp** (care, morale, watch)

Use the [`trail_log.md`](./sheets/trail_log.md) sheet if you want tight pacing and clear consequences.

### First Session Teaching Run

For a first table, use this fixed Segment 1 event sequence before returning to random rolls: Friendly Emigrant Pass, Heavy Spring Mud, Buffalo Sign, First Signs of Illness, then Sudden Thunderstorm. This teaches trade, travel loss, hunting, disease, and weather/ox strain without front-loading the deadliest events.

### Montage (Pushing Forward)

If the current 3-day weather condition imposes no mandatory checks, travel modifiers, or direct damage, the party may elect to _Push Forward_:

- Instead of playing 3 individual Trail Days, make **45 miles** of Standard travel progress before ox-team losses or other active speed modifiers
- Deduct **3 days** of standard food consumption (and water, if tracked)
- Roll for **one** Daily Event total

If the prevailing weather has a 3-day-span effect (like Dust / High Winds lowering Morale), apply that effect **once** at the end of the montage.

_Montage events:_ If the single Daily Event is hazardous, resolve it normally (it happens on one day of the 3-day span). If it costs a travel day, the Montage yields 2 days of progress instead of 3 (**30 miles** before active speed modifiers).

**Time Loss (Lost Days):** When an effect says you lose/wait **X days**, advance the calendar by X days and gain no net miles. Deduct resources for each day based on what happened (backtracking travel vs. waiting/repairs vs. rest). Don’t roll extra Daily Events for lost days. Weather still shifts every 3 days.

---

## Travel (Miles, Checks, and Speed)

### Travel stance (choose each day you travel)

You pick a stance, then choose a mileage value in that range (terrain/weather usually pushes you to the low end):

- **Cautious:** 8–10 miles/day. On any Cautious day, the GM rolls twice on the Event Table and applies the milder result.
- **Standard:** 15–20 miles/day
- **Reckless:** 22–30 miles/day (dangerous; Disadvantage on the Event roll)

### Hard Travel

**Hard Travel** is any day you:

- Travel **Recklessly**, or
- Attempt a **Forced March**

Hard Travel affects food consumption and oxen strain.

### Travel checks (only when a hazard demands it)

Basic travel does **not** require a roll. A **Travel check** happens only when a weather condition, terrain hazard, or event imposes one.

- **Travel check:** group **WIS or CON** check (GM chooses based on obstacle) vs. the hazard’s DC
  - **Success:** full distance
  - **Partial success** (at least 1 success, but not a majority): goal achieved at a cost; halve numeric damage (round down); non-numeric consequences (Wound Track steps, lost time) apply as written.
  - **Failure:** half distance + the hazard’s consequence (damage, exhaustion, lost time, etc.)
  - If an entry says “Travel DC +X,” apply it to that day’s Travel check.

- **Navigation check:** a **WIS** check (usually the Guide) to stay on the right trail / find the safest route. DC and consequences are set by the event/hazard.

### Forced March (+50% miles)

Declare before travel distance is finalized. After setting your stance miles, you may push for +50% distance.

- **Group CON check (DC 11)**
- Success: apply the +50% distance bonus
- Failure: no extra miles; each character who fails gains **1 Exhaustion**
- The attempt counts as **Hard Travel** whether it succeeds or fails
- Cannot combine with **Reckless** stance

**Multipliers & rounding:** If an effect says “double time” / “1.5× miles,” apply it after stance miles (and Forced March, if the check succeeds), then round up to the nearest mile. If an effect halves/doubles food or water consumption, round up to the nearest 0.5. Speed modifiers stack multiplicatively (ox teams, weather, events, then any “half distance” result).

### Ox teams and speed

- Each ox team has **10 HP**
- Lost-team speed penalties are multiplicative: multiply miles traveled by **0.75 once for each lost team** (Note: While walking on foot at 7–10 mi/day is faster than travel with only 1 remaining ox team (which yields 6–8 mi/day), foot travel requires caching all wagon supplies; the comparison only makes logical sense if the wagon is already effectively useless due to low HP or empty cargo.)
- **Hard Travel ox strain:** on any day the party travels Recklessly or attempts a Forced March, one ox team loses **1 HP** (GM chooses or roll randomly)
- River crossings are punishing: crossing costs **2 HP** to one ox team (DEX check DC 11 reduces to 1)
- Rest day recovery: each ox team recovers **1 HP**

---

## Actions (Travel / Hunt / Repair / Trade / Rest)

### Hunting (DEX)

- **Cost:** 10 rounds of ammunition per attempt (even on failure)
- **Check:** DEX vs. a GM-set DC (base DC **10**; raise/lower with terrain/season)
- **Yield on success:**
  - Good conditions: `3d10 × 5 lbs`
  - Poor conditions: `2d6 × 5 lbs`
  - _Good vs. poor conditions:_ If the final Hunting DC is **12 or lower**, treat it as good conditions. If it is **13+**, treat it as poor conditions.

**Hunt while traveling:** One character may break off to hunt while the rest travel at **half speed**, if the Guide makes a **WIS check (DC 9)** to keep the party on track.

**Hunter safety valve (Take Aim):** The Hunter can spend a full day hunting (no travel) to gain **50 lbs food** with **no ammo cost**. This requires a dedicated Hunt Day and cannot be taken as a Camp Action on a Rest Day (no Rest Day recovery is gained on a Hunt Day).

### Repairing the wagon (STR)

- **Field Repair** (stop for the day): **STR check**; outcome depends on whether spare parts are available:
  - Without spare parts (**DC 11**): restore `1d4` Wagon HP, but cannot raise the wagon above half max HP (15)
  - With a spare part (**DC 12**): spend the part and restore `1d6+2` Wagon HP with no HP cap
  - Failure on either: no HP restored; parts are not consumed
- Rest day actions are in [`05_camp_life.md`](../05_camp_life.md) (including Teamster's Upkeep, Field Repair, and Preventative Maintenance)

### Rest day (Layover)

Rest days are the “reset lever” that keeps the party alive:

- Food: **0.5 lbs per person**
- End of day: each character heals **1d4+1 HP** and removes **1 Exhaustion** if they ate their full Rest Day ration (0.5 lbs)
- Ox teams recover **1 HP**
- Each character takes **one** Camp Action (below)

#### Camp actions (choose 1 per character)

| Action | Stat | Effect |
| :-- | :-- | :-- |
| Teamster's Upkeep | Automatic | If the party has a Teamster, restore 1 Wagon HP (no check, no parts). Does not consume a Camp Action. |
| Field Repair | STR | Stop for the day to repair the wagon. Without spare parts (DC 11): restore `1d4` Wagon HP, capped at half max HP (15). With a spare part (DC 12): spend the part and restore `1d6+2` Wagon HP with no HP cap. Failure on either: no HP restored; parts not consumed. |
| Preventative Maint. | STR (DC 10) | Next “Wagon Breakdown” or rough terrain event is nullified or damage halved. |
| Foraging/Fishing | WIS or DEX (DC 10) | Gain `2d10` lbs of food (berries, roots, fish). |
| Intensive Care | INT (DC 12) | Choose one: advantage on next disease recovery check (end of day), advantage on Wound Track recovery check (end of this Rest Day), additional +`1d6` HP on top of Rest Day healing, or remove 1 Exhaustion. |
| Brew Tonics | INT (DC 11) | Create `1d4` tonics; drinking one gives advantage on next CON check vs. disease. |
| Scouting Ahead | WIS (DC 11) | Advantage on next day’s Travel or Navigation check. |
| Mend & Wash | DEX (DC 9) | Auto-succeed next minor CON check (DC 10 or lower, such as cold exposure, mild illness, or insect bites). |

#### Evening activity (once per layover)

- Campfire stories/music: CHA (DC 10) → Morale +1
- Diaries/scripture: WIS (DC 9) → one character gains Inspiration (Advantage on one check next day)
- Proper hot meal: spend **2×** normal rations → everyone removes **1 extra Exhaustion** and Morale +1

#### Watch duty

- Night has 3 shifts
- No watch = automatic failure to prevent night events (thieves, wolves, stolen stock, etc.)
- Double shift: CON (DC 11) or gain 1 Exhaustion

### Trading at forts

A day spent trading at a fort is a **non-travel day** (1 lb food/person). The party may also take a separate **Rest Day** at the fort for full healing/recovery benefits (0.5 lbs food/person). Trading and rest are separate days.

Use the fort multipliers + bargaining rules in [`03_settlements_and_trading.md`](../03_settlements_and_trading.md).

Quick reference:

| Fort | Mile | Multiplier | Negotiation DC |
| :-- | :-: | :-- | :-- |
| Fort Kearny | 300 | 1.5× | 12 |
| Fort Laramie | 500 | 2× | 14 |
| Fort Bridger | 850 | 2.5× | 15 |
| Fort Hall | 1,100 | 3× | 16 |
| Fort Boise | 1,600 | 4× | 18 |

- Negotiation roll: CHA (Persuasion) or INT (Appraisal)
- If the party can meet the Sutler’s **demand**, DC drops by **5**
- Outcomes:
  - Exceed DC by 5+: **25% discount** (or sells surplus at 1.5× value)
  - Meet/exceed DC: **15% discount**
  - Miss by 1–4: no discount
  - Miss by 5+ (or natural 1): trade at full price, Morale –1

---

## Resources (Food, Water, Wagon, Oxen)

### Food (lbs)

- Normal travel day (Cautious/Standard): **1 lb/person/day**
- Hard travel day (Reckless or Forced March): **2 lbs/person/day**
- Non-travel day (hunt/repair/trade): **1 lb/person/day**
- Rest day (layover): **0.5 lb/person/day**

When food drops below **50 lbs**, the party is **foraging**: each day without a successful hunt, everyone makes a **CON check (DC 11)** or gains 1 Exhaustion.

At **0 lbs**, replace the foraging check with **Starvation**: each day without a successful hunt or successful forage attempt, everyone makes a **CON check (DC 11)** or gains 1 Exhaustion. On a failed starvation check, a character already at Exhaustion 3+ also takes `1d4` damage. Morale drops by 1 for every 2 consecutive starving days.

**Desperate Forage (last resort):** When food is depleted and hunting is impossible, any character may attempt a **WIS or CON check (DC 9)** to scavenge `1d6` lbs of edible plants/insects/bark (no ammo required).

### Water (gallons) — only tracked in arid/waterless stretches

Track water in:

- Segment 5 (Desert Crossing)
- Sublette Cutoff (if taken)
- Any event that specifies a dried-up water source

Experienced option: track water for the full journey. Outside arid/waterless stretches, refill for free at rivers, springs, forts, or settled creeks; on dry camp days, deduct water normally.

Quick rules:

- Starting water: **20 gallons** (included)
- Normal consumption: **2 gal/day** (party + oxen)
- “Hot & Dry” or “Oppressive Heatwave”: consumption **doubles** to **4 gal/day**
- At **0 gallons**: each character takes **1d4 damage/day** and gains **1 Exhaustion**; ox teams also take **1d4 damage/day** (no Exhaustion track)
- Additional water barrels: **$3 each** (10 gal capacity each; Independence price)

### Wagon HP

- Starts at **30 HP**
- Repairs restore wagon HP; events and terrain reduce it
- Teamster’s Upkeep (rest day): +1 Wagon HP automatically, no action required
- At **0 HP**, the wagon is unusable; the party must cache supplies and proceed on foot at half Standard speed (7–10 mi/day)

## Exhaustion (0–6)

Exhaustion is the main “slow death” clock. Effects:

- 1: Disadvantage on all checks
- 2: Travel speed halved
- 3: Disadvantage on all checks; Advantage cannot cancel it
- 4: HP maximum halved
- 5: Cannot travel; bedridden
- 6: Death

**Exhaustion cap:** A character can gain at most **1** level of Exhaustion per day from involuntary sources (failed checks, environmental hazards). Voluntary sources (like taking a double watch shift) can still add beyond this cap. Named events that explicitly state a multi-Exhaustion consequence (e.g., Altitude Sickness: 2 Exhaustion on failure) are exceptions to this cap.

Removal:

- A full **Rest Day** removes 1 level
- To remove any Exhaustion level, the character must have eaten their full required ration that day (0.5 lbs on a Rest Day)
- Doctor’s **Intensive Care** can remove 1 level (see [`05_camp_life.md`](../05_camp_life.md))

---

## Disease (How It Works at the Table)

When disease exposure occurs, the event tells you who is exposed. If it does not, choose one random party member. If the event names a disease, use that disease; otherwise roll **1d6**:

1. Dysentery (DC 11)
2. Typhoid (DC 13)
3. Cholera (DC 15)
4. Measles (DC 10)
5. Exhaustion illness (DC 9)
6. Snakebite (DC 12)

The exposed character makes a resistance check: normally **CON** vs. the event's DC, or vs. the disease DC if the event gives no DC. If the event gives an avoidance check (like DEX to dodge a snake), use that check instead. On failure, apply the disease's immediate effect.

Then follow this daily cadence (see the full rules in [`seed.md`](../seed.md)):

1. Apply the disease’s daily effect (Note: Typhoid makes the character Gravely Ill/Bedridden for its full 7-day duration. While active, the character cannot attempt Wound Track recovery checks. If they drop to 0 HP during active Typhoid, they die under the normal Wound Track rules. Once cured, they remain Gravely Ill on the Wound Track and must recover normally.)
2. End of day: the patient makes a **CON check** vs. the disease DC
   - Success reduces remaining duration
3. Treatment (if available): spend **1 medicine** + Doctor makes **INT (DC 11)**
   - Success doubles recovery speed and halves daily effects

Untreated Cholera on day 3 requires a final **CON check at the disease's DC (DC 15)** after daily damage (a character is considered treated, bypassing this check entirely, if they received at least one successful Doctor's treatment during the disease's duration). Failure means death.

---

## Morale (0–10)

Morale is party-wide and affects how often “bad days” spiral.

- Starts at **7**
- At **8–10**: Advantage on group checks
- At **3–4**: Disadvantage on CHA and WIS checks
- At **1–2**: Disadvantage on all checks; risk of desertion
- At **0**: the party disbands (game over)

See [`seed.md`](../seed.md) for triggers that raise/lower Morale.

Common triggers:

- Morale –1: party member dies; food drops below 100 lbs; wagon below 5 HP; failed conflict management
- Morale +1: major landmark or fort reached (awarded once on arrival; not re-awarded at segment end); hunt yields 100+ lbs; dramatic save; unexpected provisions; successful Evening Activity on a Rest Day

At the end of each segment, pause for a quick audit: resources, HP, disease timers, Morale, Exhaustion, and one relationship prompt before the next terrain profile begins.

---

## Death and Replacement Characters

When someone dies, mark their grave with the current date and mile marker.

Replacement characters use the “Ghost Tax” (see [`seed.md`](../seed.md)):

- Pay **one**: 50 lbs food *or* 2 medicine *or* $20. If unpaid, the replacement character is bedridden (cargo) and cannot make checks, participate in group checks, or take watch shifts until paid.
- New character gains **1 Exhaustion**
- New character can’t use the deceased role’s **Competence Floor** ability for **3 trail days**

---

## Recommended Modules

- **Native encounters:** 1 per segment (see [`04_native_encounters.md`](../04_native_encounters.md))
- **Route variants/cutoffs:** big, late-game decisions (see [`07_route_variants.md`](../07_route_variants.md))
