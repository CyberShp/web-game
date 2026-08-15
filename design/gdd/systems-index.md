# Legacy Prototype Systems Index: 复苏档案：槐荫里事件

*Created: 2026-08-13*
*Review mode: Lean — per-skill director gates skipped*

> This index covers the Huaiyinli incident prototype only. It is not the approved system map for the full *Revival Archives* game. See `HANDOFF.md`.

## System Enumeration

| Order | System | Category | Source | Priority | Depends On | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Run State & Seven-Day Clock | Foundation | Explicit | MVP | — | Complete |
| 2 | Data-Driven Investigation Content | Foundation | Implicit | MVP | Run State | Complete |
| 3 | Ghost Shadow & Resurrection Signs | Core | Explicit | MVP | Run State, Content | Complete |
| 4 | Evidence & Hypothesis Board | Core | Explicit | MVP | Run State, Content | Complete |
| 5 | Resident & Building State | Feature | Implicit | Vertical Slice | Run State, Content, Evidence | Complete |
| 6 | Consequence & Ending Resolution | Feature | Explicit | Vertical Slice | All gameplay systems | Complete |
| 7 | Versioned Local Persistence | Foundation | Implicit | MVP | Run State | Complete |
| 8 | Terminal / Field UI & Accessibility | Presentation | Explicit | MVP | All exposed gameplay contracts | Complete |

## Boundaries

### 1. Run State & Seven-Day Clock

Owns the current day, three actions per day, one-shot action history, active screen and day advancement. It does not own story prose or DOM elements.

### 2. Data-Driven Investigation Content

Owns action definitions, requirements, text, evidence rewards and day events. Gameplay values and prose live in content data rather than rule functions.

### 3. Ghost Shadow & Resurrection Signs

Owns hidden instability, ability-use consequences and qualitative symptom stages. It never exposes a percentage or progress bar to the player.

### 4. Evidence & Hypothesis Board

Owns discovered evidence, evidence sufficiency and hypothesis outcomes. A direction can be plausible but still unusable when evidence is incomplete.

### 5. Resident & Building State

Owns who is alive, missing, replaced or rescued, plus door-plate and room states. It does not decide presentation or ending prose.

### 6. Consequence & Ending Resolution

Evaluates day-end consequences and the final ghost-control attempt from the accumulated state. Deaths must cite observable causes.

### 7. Versioned Local Persistence

Separates the current run from permanent archive progress, validates stored data, and provides safe reset behavior.

### 8. Terminal / Field UI & Accessibility

Renders all systems through semantic HTML. Required information is available without hover, all actions are keyboard reachable, and motion respects reduced-motion settings.

## Dependency Layers

1. **Foundation** — Run State, Content, Persistence
2. **Core** — Ghost Shadow, Evidence & Hypotheses
3. **Feature** — Resident & Building State, Consequences & Endings
4. **Presentation** — Terminal / Field UI & Accessibility

No circular dependency is permitted: gameplay systems return state and events; the UI only renders and dispatches commands.

## Milestone Scope

| Tier | Systems | Why |
| --- | --- | --- |
| MVP | 1, 2, 3, 4, 7, 8 | Directly tests ability-use risk, readable symptoms, evidence sufficiency and a browser-safe loop |
| Vertical Slice | 5, 6 plus all MVP systems | Adds one complete resident consequence and a meaningful success/failure ending |
| Alpha | Complete seven-day content across the same 8 systems | Content expansion without inventing new feature systems |
| Full First Chapter | Polished content, sound, accessibility and release hardening | Finishes the approved 3–5 week chapter without widening mechanics |

## High-Risk Items

- Hidden resurrection state must remain legible without revealing a number.
- Content requirements must not create unwinnable states without a readable warning and restart path.
- Permanent archive data must not leak run-specific flags into a new cycle.
- The 60–90 minute target depends on authored content quality, not additional systems.

## Explicitly Excluded

Inventory, equipment, combat damage, free movement, procedural generation, multiplayer, accounts, cloud saves, mobile-specific controls, and Yang Jian crossover content.

## Review Notes

- TD-SYSTEM-BOUNDARY skipped — Lean mode.
- PR-SCOPE skipped — Lean mode.
- CD-SYSTEMS skipped — Lean mode.
- Implemented and verified in the first-chapter Web build on 2026-08-13.
