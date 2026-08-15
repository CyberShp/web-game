# Revival Archives — Claude Code Entry

本仓库使用 Claude-Code-Game-Studios，但项目事实优先于框架默认模板。

## Required read order

1. `AGENTS.md`
2. `design/campaign/README.md`
3. `design/campaign/concept-baseline.md`
4. 当前正在工作的 chapter / character / supernatural 文档
5. `design/campaign/decisions/decision-log.md`
6. `HANDOFF.md`

如果旧 `design/gdd/` 与 `design/campaign/` 冲突，以后者为准；旧 GDD 是槐荫里 Prototype 证据。

## Technology Stack

- Engine/runtime: modern Web browser
- Language: TypeScript
- Build: Vite
- Current playable implementation: Huaiyinli Prototype
- Current product stage: Concept
- Review mode: lean

## Collaboration

坚持用户驱动的协作：Question → Options/Discussion → Decision → Draft → Approval/Write。

但“协作”不意味着无条件同意用户：发现原著冲突、能力撞车、逻辑不成立或未来扩展风险时必须指出并讨论。

重要设计批准后要落盘到 `design/campaign/` 与 decision log，避免跨设备、跨模型上下文漂移。

## Framework references

- `.claude/docs/directory-structure.md`
- `.claude/docs/coordination-rules.md`
- `.claude/docs/coding-standards.md`
- `.claude/docs/context-management.md`

正式 Campaign 进入实现前，不要因框架模板要求而提前重构当前可玩的 `src/`。
