# Target Project Layout — Campaign / Prototype Split

*Status: DESIGN TARGET, not an immediate migration order.*

当前根 `src/` 是已验证可运行的槐荫里 Prototype。正式 Campaign 第一章设计完成并通过 gate 前，不为“目录整洁”破坏它。

## 目标结构

```text
/
├─ AGENTS.md
├─ README.md
├─ HANDOFF.md
├─ design/
│  ├─ campaign/
│  │  ├─ canon/
│  │  ├─ chapters/
│  │  ├─ narrative/
│  │  ├─ supernatural/
│  │  ├─ decisions/
│  │  └─ systems/
│  ├─ gdd/
│  └─ art/
├─ prototypes/
│  └─ huaiyinli/
├─ src/
│  ├─ campaign/
│  ├─ incidents/
│  ├─ shared/
│  └─ prototype/huaiyinli/
└─ tests/
   ├─ campaign/
   ├─ shared/
   └─ prototype/
```

## 迁移前提

正式迁移代码前必须先决定：

1. GitHub Pages 根路径最终是 landing page 还是正式 Campaign；
2. 槐荫里旧试玩 URL 如何永久保留或重定向；
3. 现有 localStorage 存档是否继续支持、命名空间如何隔离；
4. Campaign save schema 如何支持章节迁移；
5. 共享 UI/规则代码哪些是真复用，哪些只是 Prototype 偶然实现。

## 现在该做什么

现在只重构**知识/设计目录**。代码保持稳定，直到 opening slice 设计被确认。
