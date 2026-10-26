# Hearthwild 1.0.0

An original, mobile-oriented single-player idle RPG. No account, server, Firebase, CDN, npm, or build step.

## Put it on GitHub Pages

1. Extract this ZIP.
2. Upload its files directly into your repository root. Keep the filenames unchanged. Do not upload the ZIP itself as the website.
3. In the repository's Settings → Pages, select Deploy from a branch → your main branch → / (root), then Save.
4. Open the GitHub Pages link once deployment finishes. A project URL with a repository name works; every file reference is relative.

Opening index.html directly as a local file can block ES-module imports. Use the GitHub Pages website. No terminal commands are needed for deployment.

## Files — all at the root

- index.html — app shell and metadata.
- style.css — responsive interface.
- content.js — original content, recipes, tier generators, dependency validation.
- engine.js — deterministic actions, combat, passive production, rewards, save validation.
- storage.js — IndexedDB, localStorage fallback, recovery, single-writer ownership, import/export.
- main.js — screens, navigation, catch-up, save controls.
- tests.js — executable, isolated test suite.
- README.md — this guide and validation report; optional for hosting.

## First session

Gather Ash logs under Woodcutting and ore under Mining. Smelt two ore into one ingot under Smithing; three ingots make a sabre. Equip the sabre from Equipment or the Bank. Fight Ash Moss rats, and claim quests when ready.

Fish and cook food for longer expeditions. Plant your starter seeds under Farming; they return at harvest. Hunting supplies hides and fangs. Crafting produces ranged armor; Fletching produces bows and arrows. Runecrafting creates runes and magic equipment. Ranching supplies fleece for magic gear and eggs for cooking. Use bones for Prayer points; request a Slayer assignment before hunting its target.

One foreground action OR combat encounter can run at a time. Farming, Ranching, and Township run in the background. Their finished outputs are collected automatically. Background jobs run once until you buy automatic husbandry in the Shop. Upgrade the granary for more farm slots, and the stable for another ranch slot. Starting another active action cancels unpaid partial progress in the previous action.

Inputs are charged at completion, including unsuccessful attempts, unless the input-preservation roll succeeds. An attempt always requires the full input stock. Astrology unlocks preservation. Compost is consumed when a farm cycle is planted and doubles that cycle's outputs. Stopping a planted cycle does not refund its compost.

## Systems included

- All 29 skills, levels 1–120; 21 noncombat skills have low, middle and high tiers. Eight combat skills train through their appropriate combat actions, bone offerings, prayers and Slayer contracts.
- 576 item definitions; 612 repeatable actions/recipes; 150 ordinary enemies plus 30 bosses; 15 ordered dungeons.
- 40 spells with rune costs and four spell effects; 34 prayers with point costs; melee/ranged/magic loadouts; consumable arrows, food, tonics and familiar tablets.
- 124 quests, 150 achievements, 29 guilds with three reward ranks each, 29 rare companions, six upgradable buildings, permanent astrology/agility/relic bonuses.
- Bank search, category/favorite filtering, sorting, locking, quantity-aware selling, equipment movement, and item sources/uses.
- Common event clock, deterministic persisted RNG, chronological passive production, resumable chunked offline simulation without a reward time cap, and an offline summary.
- Serialized local saves, recovery copies, imports validated before replacement, JSON exports, and read-only secondary tabs.

Damage, action formulas, balance, names, lore and content are original. This project is not official Melvor content and does not use proprietary assets or code.

## Saves

Use Settings → Export save regularly. To change devices, export on the first device and import on the second. Progress belongs to this browser and this website origin. Clearing browser data or changing browsers/domains can make the old save unavailable. GitHub Pages does not store or synchronize player progress.

IndexedDB is primary storage; localStorage is the fallback. Each backend keeps a recovery copy. When storage availability changes, loading checks both backends and uses the newest valid revision. Normal play has a single writer: other open tabs display a read-only notice. Close the other tab and reload if you want to transfer control.

The engine is independent of SaveAdapter, allowing a future cloud integration. There is no Firebase code or configuration in this version.

## Rules worth knowing

XP is cumulative, with the RuneScape-style exponential table documented in engine.js. Level and XP cap at 120. The bank has unlimited stack capacity. Modifiers add within a category: action speed caps at 65%, XP bonus at 200%, resource doubling at 80%, input preservation at 20%, and building mitigation at 65%.

Equipment requires its listed combat/crafting skill, and most armor additionally requires Defence. Two-handed weapons exclude an offhand. An item exists either in the bank or in a loadout; inactive loadouts retain their actual equipped items.

Melee beats ranged, ranged beats magic, magic beats melee (+20% / −20% damage). Melee training is selectable; all hits award Hitpoints XP. Ranged consumes arrows; magic consumes the selected spell's runes. Stronger arrows add damage. Prayers train Prayer and consume points per attack. Auto-eat checks immediately before incoming strikes below 55% health, with a 2.5-second food cooldown. It does not guarantee survival. Death stops the activity, restores health to 1, awards no kill rewards, and loses no gear or gold.

Bosses strike harder every fourth attack. Fury grows below half health, venom stacks poison, and siphon restores enemy health. Dungeons have four ordered waves, prerequisite completions, unique seals and optional repeat. Their wave, enemy health and attack schedules persist.

Quest objectives use lifetime totals or current skill levels, as labeled. Selling a resource does not erase lifetime progress. Quest, achievement and guild claims are one-time. Potions and familiars consume charges per completed activity or player attack. Only one companion bonus is active.

## Executed validation — 26 October 2026

**52 / 52 browser tests passed**, Chrome 155 on Linux. **44 / 44 simulation tests passed**, Node 24.22.1. All delivered JavaScript modules also passed syntax checks. No application-origin warnings or errors appeared in the inspected browser console.

The in-game test suite runs from Settings → Run test suite, or by appending ?test=1 to the website URL. It uses separate game states and isolated test-storage namespaces; it does not reset the real adventure. Layout fixtures are explicitly read-only.

Coverage:

- Exact XP boundaries at levels 1, 2, 60, 119 and 120; cap behavior.
- Action completion, starvation, switching, input preservation, whole-item inputs/outputs, atomic rejected crafts and purchases.
- Equipment quantity conservation and two-handed gear constraints; deterministic RNG and valid drop definitions.
- Catch-up equivalence across chunk sizes for 1 minute, 1 hour, 24 hours, 7 days and 30 days.
- Passive/foreground chronological equivalence; mid-action save/reload without duplicate rewards; backward-clock handling.
- Background slot restrictions, compost use, one-cycle harvesting and upgrades.
- Combat XP including Hitpoints; death; food cooldown/depletion; rune/ammo exhaustion; prayer-point use; boss fury/venom/siphon.
- Dungeon prerequisite/wave/reward logic; Slayer contracts; claim-once quests, achievements and guild bonuses.
- Construction, astrology, familiar/tonic charges, companion modifiers.
- Invalid import rejection and optional-field defaults; IndexedDB read/write/export/import; corrupt-primary recovery; writer exclusion; localStorage/lease fallback; rejected imports preserving current data.
- All 12 main screens at widths 320, 375 and 430 pixels; all 29 skill screens at 320 pixels with a late-game fixture; main screens at levels 60 and 120 at 375 pixels. Checks reject document overflow and clipped form controls. Two actual simultaneous game tabs were also observed: the second showed READ-ONLY TAB.
- Level-1/60/120 gathering → smelting → forging → equipping → combat smoke scenarios and serialization; content-reference validation and item-source/recipe reachability.

The phone checks used real browser iframe viewport widths, not physical devices. Safari/iOS, physical Android devices, the GitHub deployment itself, download/file-picker behavior on those devices, and months of actual balancing/playtesting were not executed. Simulation tests are deterministic correctness checks, not evidence that every long-term balance choice has been proven.

## Scope and remaining limitations

The aspirational 1,000-item target was not reached: this release has 576 valid items, with explicit sources and uses. Other numerical content targets are met or exceeded. Much of the equipment and action roster follows a generated 12-tier ladder; it should not be mistaken for hundreds of handcrafted unique mechanics.

Guild objectives currently combine level and training-event milestones. Farming uses an herb ladder rather than separate orchard/flower systems, Township uses production contracts and permanent buildings rather than a population simulation, and Agility retains your best completed course bonus rather than managing obstacle slots. These are functional but streamlined implementations of the broader handoff ideas.

There is no installable-PWA/service-worker cache, cloud sync, audio, server clock verification, multiplayer or anti-cheat. A loaded page can play without network access; reloading the website still needs its static files to be available. Long-gap computation is uncapped but takes time proportional to actual events; the browser stays responsive by yielding between chunks and saving checkpoints.
