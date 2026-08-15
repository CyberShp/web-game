# Technical Preferences

<!-- Populated by /setup-engine. Updated as the user makes decisions throughout development. -->
<!-- All agents reference this file for project-specific standards and conventions. -->

## Engine & Language

- **Engine**: Web Runtime (modern evergreen browsers)
- **Language**: TypeScript 5.9 in strict mode, semantic HTML, CSS
- **Rendering**: DOM and CSS; Canvas only when a scene effect cannot be expressed accessibly in the DOM
- **Physics**: None

## Input & Platform

<!-- Written by /setup-engine. Read by /ux-design, /ux-review, /test-setup, /team-ui, and /dev-story -->
<!-- to scope interaction specs, test helpers, and implementation to the correct input methods. -->

- **Target Platforms**: Desktop Web browsers
- **Input Methods**: Keyboard and mouse
- **Primary Input**: Mouse, with complete keyboard navigation for interactive UI
- **Gamepad Support**: None for the first chapter
- **Touch Support**: Responsive layout only; touch gameplay is not a release requirement
- **Platform Notes**: Must work from a static host such as GitHub Pages. Never make hover the only way to reveal required information.

## Naming Conventions

- **Classes and types**: PascalCase
- **Variables and functions**: camelCase
- **DOM events and game event IDs**: kebab-case strings
- **Files**: kebab-case; TypeScript modules use `.ts`
- **Scenes/content IDs**: kebab-case with a domain prefix, e.g. `scene-corridor-01`
- **Constants**: UPPER_SNAKE_CASE

## Performance Budgets

- **Target Framerate**: 60 fps for transitions and ambient effects
- **Frame Budget**: 16.6 ms; no continuous JavaScript animation loop for static screens
- **Initial Load**: Under 2 MB compressed for the prototype; chapter assets loaded by scene
- **Memory Ceiling**: 256 MB on a typical desktop tab

## Testing

- **Framework**: Vitest for deterministic game rules; browser smoke tests for the critical loop
- **Minimum Coverage**: No percentage target during prototype; every rule branch and save migration must have focused tests
- **Required Tests**: Action spending, shadow-cost stages, evidence unlocks, hypothesis resolution, save/load/reset, keyboard interaction

## Forbidden Patterns

<!-- Add patterns that should never appear in this project's codebase -->
- Hidden numeric resurrection meter in the player UI
- Random deaths without a previously observable cause
- Gameplay state stored directly in DOM elements
- Inline story text inside rule functions

## Allowed Libraries / Addons

<!-- Add approved third-party dependencies here -->
- Vite 8 (build and local development)
- TypeScript 5.9 (type checking and authoring)
- Vitest 4 (unit tests)

## Architecture Decisions Log

<!-- Quick reference linking to full ADRs in docs/architecture/ -->
- [No ADRs yet — use /architecture-decision to create one]

## Engine Specialists

<!-- Written by /setup-engine when engine is configured. -->
<!-- Read by /code-review, /architecture-decision, /architecture-review, and team skills -->
<!-- to know which specialist to spawn for engine-specific validation. -->

- **Primary**: Web/TypeScript implementation
- **Language/Code Specialist**: TypeScript implementation and review
- **Shader Specialist**: Not used; prefer CSS effects for the first chapter
- **UI Specialist**: Accessible DOM/CSS interaction design
- **Additional Specialists**: None configured
- **Routing Notes**: Keep deterministic game rules separate from rendering. Use UI review for HTML/CSS and TypeScript review for state transitions and persistence.

### File Extension Routing

<!-- Skills use this table to select the right specialist per file type. -->
<!-- If a row says [TO BE CONFIGURED], fall back to Primary for that file type. -->

| File Extension / Type | Specialist to Spawn |
|-----------------------|---------------------|
| Game code (`.ts`) | TypeScript implementation and review |
| Shader / material files | Not used in the first chapter |
| UI / screen files (`.html`, `.css`, UI `.ts`) | Accessible DOM/CSS interaction design |
| Scene/content files (`.ts` data modules) | TypeScript implementation and narrative consistency review |
| Native extension / plugin files | Not permitted for the first chapter |
| General architecture review | Web/TypeScript implementation |
