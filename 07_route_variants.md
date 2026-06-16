# 7. Route Variants & Cutoffs

The Oregon Trail was not a single set track. It was a braided network of trails, cutoffs, and alternate routes. Emigrants constantly faced the dilemma: take the established, longer, safer route, or risk a "cutoff" that promised to shave weeks off the journey but plunged them into unknown wilderness.

When the party reaches a junction point, the GM presents the options. The party must vote.

---

### 1. Sublette Cutoff (Segment 4, After the South Pass Summit, ~Mile 790)

This cutoff bypasses Fort Bridger entirely, driving straight across a harsh, waterless desert to rejoin the main trail near Fort Hall. The junction appears roughly 10–20 miles past the Continental Divide crossing, **before** Fort Bridger (mile 850); parties taking this route never reach Fort Bridger.

- **The Promise:** Saves 70 miles (roughly 5-7 days of travel).
- **The Cost:** You skip a major resupply point (Fort Bridger).
- **The Danger: The Fifty-Mile Desert.**
  - The wagon must cross 50 miles without water. This takes **3 days** of hard pushing (≈17 miles/day).
- **Requirement:** Start the crossing with **full water (20 gal)**. Water is actively tracked during this stretch (see Water rules in `seed.md`). At normal consumption (2 gal/day), the party needs 6 gallons for 3 days; in Hot & Dry weather (4 gal/day), they need 12. Extra barrels are recommended as insurance against lost days or heat.
  - **Mechanic:** Each day of the crossing, deduct water normally. Additionally, the party makes a **Group CON check (DC 13)** at the end of each day.
    - _Success:_ The party endures. One ox team loses **1 HP** from strain.
    - _Failure:_ Each character who failed gains **1 level of Exhaustion**, and one ox team loses **2 HP**.
  - If the party runs out of water during the crossing, apply the standard 0-water penalties (1d4 damage/day and 1 Exhaustion to all characters; ox teams also take 1d4 damage/day but have no Exhaustion track) in addition to the daily CON check. The 0-water Exhaustion and the daily CON check Exhaustion share the daily Exhaustion cap — a character gains at most 1 involuntary Exhaustion per day from these two sources combined.

### 2. Hastings Cutoff (Trap Route / Challenge Scenario)

Historically, this is the cutoff that doomed the Donner Party in 1846. Though the game is set in 1848, the temptation of this cursed route remains in the folklore of the trail.

- **The Promise:** Billed by lying guidebooks to save 300 miles.
- **The Reality:** It involves crossing the Great Salt Lake Desert and hacking a road through the Wasatch Mountains.
- **How to present it:** Do not frame this as a balanced route choice. For a standard campaign, telegraph it as a disastrous rumor and let cautious parties reject it. For a grim challenge scenario, present the false promise first and reveal the true costs only after the party commits.
- **The Mechanic:** If the party takes this route, they enter a "Lost" state.
  - Add +14 days to the journey automatically.
  - For the next 10 days, roll **one event per day** (do not use the Universal table):
    - 5 days: use **Segment 5 (Desert Crossing)** events from `01_events_and_hazards.md`
    - 5 days: use **Segment 4 (South Pass)** events from `01_events_and_hazards.md`
  - The remaining 4 days are treated as Time Loss (consume resources, weather still shifts) with no additional Daily Event rolls.
  - All travel and survival checks act as if the party's Morale is at 2 (Disadvantage on all checks).
- _GM Advice: In a normal campaign, the correct play is usually to avoid this route. Use it when the group explicitly wants a historical disaster scenario or when they knowingly ignore repeated warnings._

### 3. The Barlow Road vs. The Columbia River (Segment 7 Finale)

The final test before reaching the Willamette Valley. The trail splits at The Dalles. You cannot drive a wagon entirely around Mount Hood on the riverbanks.

**Option A: The Columbia River Route (Rafting)**

- **Description:** Break down the wagon, build a massive raft, and float down the treacherous river rapids to Fort Vancouver.
- **The Danger:** Smashing against the rocks.
- **Mechanics:**
  - Takes 1 week. The Teamster must first make a **STR check (DC 12)** to construct the raft from the wagon frame. Failure means a poorly built raft: all subsequent DEX checks to navigate the rapids have Disadvantage.
  - Requires three consecutive **DEX checks (DC 12, 14, and 13)** to navigate the rapids.
  - _Failure on any check:_ The raft flips off course. Lose 50% of all remaining supplies and money. Failing by 5 or more results in a character drowning.
  - _On success:_ You reach Fort Vancouver (this counts as reaching the Willamette Valley for victory). The wagon is not recoverable — it was dismantled for the raft, and any remaining ox teams are left behind at The Dalles.

**Option B: The Barlow Road (Overland)**

- **Description:** A brutal, steep toll road carved directly over the flanks of Mount Hood. By 1848, the operators know you are desperate.
- **The Danger:** Extremely steep grades, fallen timber, early snows. The toll is financially devastating to a broke party.
- **Mechanics:**
  - Costs **$50 per wagon** and **$25 per ox team**. If the party cannot pay, they cannot take this route.
  - Takes 2 weeks.
  - Requires a **Group STR Check (DC 15)** to lower wagons down the "Laurel Hill" sheer drop using ropes wrapped around trees.
  - _Failure:_ The ropes snap. The wagon crashes and takes 2d10 damage, likely destroying it completely just miles from the finish line. If the wagon reaches 0 HP here, the party caches what they can carry and proceeds on foot — the Willamette Valley is roughly 2–3 days' walk away. They arrive alive but with only what they can shoulder.
