# ADR-001: Use the Browser as the Game Runtime

*Status: Accepted — 2026-08-13*

## Context

The first chapter is a single-player, interface-led horror investigation made by a first-time solo developer in 3–5 weeks. Its repeated actions are reading records, inspecting illustrated hotspots, choosing where to send the ghost shadow, and comparing evidence. Free movement, combat, physics, networking, and console deployment are explicitly outside the first release.

## Decision

Build the game as a static TypeScript, HTML, and CSS application with Vite. Keep deterministic game state and rules in framework-independent TypeScript modules. Render screens with semantic DOM elements and use versioned browser storage for local progress.

## Consequences

- The project can deploy directly to GitHub Pages and starts without an engine download screen.
- Text layout, accessibility, responsive terminal panels, and browser storage remain straightforward.
- The first release will not gain a scene editor, physics system, or engine animation timeline.
- If a later chapter requires free-moving 2D scenes, the team must create a new ADR comparing a Canvas layer, Godot Web export, and a full migration. The first chapter must not anticipate that migration with speculative abstractions.
