# Concept Prototype Report: 鬼影试探

> **Date**: 2026-08-13
> **Prototype Path**: HTML
> **Concept File**: `design/gdd/game-concept.md`

---

## Hypothesis

如果玩家能选择不同目标派出鬼影，并只通过征兆判断代价，那么在发现规律前，至少会主动进行第二次试探；完成三次试探后，能够用证据选出正确规律。

---

## Riskiest Assumption Tested

最大风险是鬼影试探在没有自由移动和战斗时退化成“点按钮换文本”。原型证明了三个目标可以产生不同证据、身体代价和规律判断条件，但尚未通过真人试玩证明玩家会在不知道内部数值时自愿承担第二次代价。

---

## Approach

构建了一个可直接在浏览器打开的单文件 HTML 原型，包含三个试探目标、三阶段复苏征兆、证据列表和一次三选一规律判断。

**Path chosen:** HTML
**Reason for path:** 被验证的是回合式风险判断与证据逻辑，不是动作延迟或物理手感。

**Shortcuts taken (intentional):**

- 所有文本、规则和样式内嵌在单个文件中。
- 无正式菜单、存档、插画、音频、七日进度和失败结局。
- 使用简单文字反馈代替正式演出。

---

## Result

自动化浏览器走查确认：三个试探目标分别产生独立线索；第一次和第二次使用鬼影后，身体与影子征兆明确递进；第二次试探后开放规律判断；证据不足时，即便方向正确也只得到“证据链不完整”的结果；三条证据齐全后，正确假设才会解释门牌、身份和熄灯替换的完整链条。页面加载与核心交互期间没有浏览器控制台错误。

没有真人试玩数据，因此不能声称情绪目标或“主动第二次试探”已经确认。

---

## Metrics

| Metric | Value |
|--------|-------|
| Path used | HTML |
| Iterations to playable | N/A |
| Prototype duration | 单次实现与自动走查 |
| Playtesters | 0 external；1 automated interaction pass |
| Feel assessment | 未验证；规则反馈和交互闭环可操作 |
| Hypothesis verdict | PARTIALLY CONFIRMED |

---

## Recommendation: PROCEED

规则和界面层面的核心闭环成立，足以进入正式系统设计与首章实现。推进条件是保留“模糊但可比较”的征兆，并让不同试探目标改变可形成的假设，而不是只增加文本收藏。真人试玩必须在 Vertical Slice 阶段验证玩家是否会自愿承担第二次能力代价；若多数玩家第一次后直接停止或无差别点完所有目标，应调整信息价值和撤退奖励，而不是继续堆剧情。

---

## If Proceeding

- **Core tuning values discovered:** 2 次试探后允许提出早期假设；3 条互补证据才允许形成可行动的完整结论。
- **Assumptions confirmed:** 模糊征兆可以用文字和局部视觉递进表达，不需要展示复苏数值。
- **Assumptions disproved:** 尚无足够试玩数据推翻体验假设。
- **Emergent mechanics:** “方向正确但证据不足”比简单对错更适合作为调查反馈。

**Next steps:**

1. `/design-review design/gdd/game-concept.md`
2. `/gate-check`
3. `/map-systems`
4. `/design-system shadow-probe`

---

## Lessons Learned

- **What assumptions were broken by actually building this?** 三次试探全部完成时，代价已经确定发生；正式版必须给玩家撤退、换取别的线索或在证据不足时冒险行动的真实分支，否则风险只是固定剧情。
- **What surprised us that didn't show up in the brainstorm?** 正确方向也需要“证据充分度”，这能把规则推理从一次猜题变成调查过程。
- **What would we test differently next time?** 记录玩家在每次试探后是否停留、撤退或继续，并比较有无已知安全退出奖励时的行为。

---

> *Prototype code location: `prototypes/shadow-probe-concept/`*
> *This code is throwaway. Never refactor into production.*
