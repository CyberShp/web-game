# Web Runtime — Version Reference

| Field | Value |
|-------|-------|
| **Runtime Target** | Modern evergreen desktop browsers |
| **Language** | TypeScript 5.9.3 |
| **Build Tool** | Vite 8.2.1 |
| **Test Runner** | Vitest 4.1.10 |
| **Project Pinned** | 2026-08-13 |
| **Risk Level** | MEDIUM — tool versions postdate the model knowledge cutoff |

## Compatibility Contract

- The production build must be deployable as static files to GitHub Pages.
- Gameplay must not require a server, account, network connection, WebGL, or WebAssembly.
- Persistent progress uses versioned browser storage with graceful recovery from invalid data.
- Required interaction must be usable by keyboard and mouse.
- Tool APIs that are uncertain or version-specific must be verified against current official documentation before use.

## Verified Package Versions

The pinned authoring versions were checked against the npm registry on 2026-08-13. TypeScript 7.0.2 was intentionally rejected after its macOS ARM platform package installed a truncated `lib.dom.d.ts` and could not type-check a DOM project. The project uses the mature 5.9.3 release until the 7.x packaging issue is resolved. Run the project's focused tests and production build after every dependency update.
