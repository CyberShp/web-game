# Revival Archives / 复苏档案

《神秘复苏》世界观下的非商业单人 Web 同人游戏项目。

> 本项目不是官方作品，也不代表获得原作者、出版方或改编作品权利方授权。项目不复制小说原文，不使用官方或商业美术、Logo 和音频素材。

## 当前状态

项目当前处于 **Concept / 正式游戏设计重基线**。

仓库已有可玩的《复苏档案：槐荫里事件》Prototype，用于验证规则调查、总部终端、有限行动、失败结局和存档等玩法。它不是正式游戏开场；其中“鬼影”等叙事/能力设定也不再视为正式 Campaign 设定，只保留为玩法验证资产。

正式 Campaign 已重新从 0→1 设计：原创主角是大昌市第七中学学生，与杨间同校但不同班。第一章与原作七中敲门鬼事件并行发生，杨间走自己的原作传奇，原创主角走独立成长路线。

## 所有 AI / 开发者先读

1. [`AGENTS.md`](AGENTS.md) — 全仓库共同的 AI 协作规则与事实优先级。
2. [`design/campaign/README.md`](design/campaign/README.md) — 正式 Campaign 设计入口与当前进度。
3. [`design/campaign/concept-baseline.md`](design/campaign/concept-baseline.md) — 已锁定的产品方向。
4. [`design/campaign/chapters/ch01-seven-high-school.md`](design/campaign/chapters/ch01-seven-high-school.md) — 第一章当前打磨结果。
5. [`design/campaign/supernatural/deadlock.md`](design/campaign/supernatural/deadlock.md) — 主角第一只鬼“死锁”。
6. [`design/campaign/decisions/decision-log.md`](design/campaign/decisions/decision-log.md) — 为什么这么设计，以及哪些方案被否决。

不要只读旧的 `design/gdd/game-concept.md`：它描述的是槐荫里 Prototype，不是完整游戏。

## 当前试玩

GitHub Pages 根路径仍发布现有槐荫里 Prototype。正式 Campaign 尚未进入实现阶段，暂不移动现有 `src/`，避免破坏已验证试玩和存档。

```bash
npm ci
npm test
npm run build
npm run dev
```

## 框架

项目基于 `Donchitos/Claude-Code-Game-Studios` 工作流建立。当前阶段为 `Concept`，评审模式为 `lean`。
