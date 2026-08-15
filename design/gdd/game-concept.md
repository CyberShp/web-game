# Legacy Prototype Concept: 复苏档案：槐荫里事件

*Created: 2026-08-13*
*Status: Superseded as full-game concept; preserved as Prototype design evidence*

> **Important:** This document describes the Huaiyinli seven-day incident prototype, not the full game. The full project is now titled 《复苏档案》 / *Revival Archives* and has returned to Concept Rebaseline. Read the repository root `HANDOFF.md` before using this document.

---

## Elevator Pitch

> 一款单人 Web 规则推理与生存恐怖游戏。玩家扮演《神秘复苏》世界中的原创驭鬼者，在七天内调查一栋会重新分配住户身份的封闭居民楼，并在自身鬼影复苏前驾驭“门牌鬼”，建立新的危险平衡。

---

## Core Identity

| Aspect | Detail |
| ---- | ---- |
| **Genre** | 规则推理 / 生存恐怖 / 叙事养成 |
| **Platform** | 桌面 Web 浏览器，可部署至 GitHub Pages |
| **Target Audience** | 喜欢《神秘复苏》、规则怪谈、剧情探索与多周目解谜的中文玩家 |
| **Player Count** | 单人 |
| **Session Length** | 单周目 60–90 分钟；每天约 10 分钟，可在日结处暂停 |
| **Monetization** | 无；个人学习与免费发布的非商业同人作品 |
| **Estimated Scope** | 小型（首个完整章节 3–5 周，单人开发） |
| **Comparable Titles** | 《隐形守护者》的分支叙事、《World of Horror》的调查压力、《神秘复苏》的规则型灵异世界观 |

---

## Core Fantasy

玩家不是靠武器或数值击败厉鬼，而是主动放出体内鬼影，在自身逐步异变的压力下试探未知规则。每次使用力量都可能换来关键情报或一条生路，也可能让鬼影更接近失控。最终的成长不是无代价升级，而是在必死局里驾驭第二只鬼，以两个危险存在之间的冲突换取短暂平衡。

---

## Unique Hook

它像一款灵异调查文字冒险，但玩家获取线索的主要工具本身就是正在复苏的鬼：越依赖能力接近真相，主角越可能先于事件失控。

---

## Player Experience Analysis (MDA Framework)

### Target Aesthetics (What the player FEELS)

| Aesthetic | Priority | How We Deliver It |
| ---- | ---- | ---- |
| **Discovery** | 1 | 证词、现场、登记册三方交叉验证；多周目档案补全 |
| **Fantasy** | 2 | 扮演原创驭鬼者，以鬼制鬼并承受复苏代价 |
| **Challenge** | 3 | 有限行动点、模糊身体征兆、可验证的三段式杀人规律 |
| **Narrative** | 4 | 七日倒计时、住户命运、多个失败结局与驾驭结局 |
| **Sensation** | 5 | 冷白终端、中式旧楼、环境声和少量暗红异常 |
| **Expression** | 6 | 调查路线、风险承担和规律假设的选择 |
| **Fellowship** | N/A | 第一版无联机或社交系统 |
| **Submission** | N/A | 游戏保持持续但可暂停的心理压力 |

### Key Dynamics (Emergent player behaviors)

- 玩家会在“再试一次能力就能确认规律”和“鬼影可能失控”之间犹豫。
- 玩家会把住户证词、死亡现场与物业登记册相互对照，而不是相信单一信息源。
- 玩家会利用死亡后保留的档案知识规划新周目的行动顺序。
- 玩家会故意触发部分规则，以临时住户身份进入原本不可达的房间。

### Core Mechanics (Systems we build)

1. 七日行动点与日结存档系统。
2. 档案、证词、现场三类线索及规律假设系统。
3. 鬼影能力试探与模糊复苏征兆系统。
4. 居民楼地点、房间状态和门牌变化系统。
5. 多周目永久档案与结局解锁系统。

---

## Player Motivation Profile

### Primary Psychological Needs Served

| Need | How This Game Satisfies It | Strength |
| ---- | ---- | ---- |
| **Autonomy** | 自主安排 21 次主要行动、选择试探对象与承担的风险 | Core |
| **Competence** | 从误判死亡到准确复盘并利用完整规则破局 | Core |
| **Relatedness** | 通过住户证词、通讯与救援结果建立有限的人物牵挂 | Supporting |

### Player Type Appeal (Bartle Taxonomy)

- [x] **Achievers** — 补全档案、解锁驾驭结局与未来能力路线。
- [x] **Explorers** — 理解居民楼规则、发现隐藏房间与事件全貌。
- [ ] **Socializers** — 第一版仅通过叙事人物关系提供轻量吸引力。
- [ ] **Killers/Competitors** — 无 PvP、排行榜或战斗碾压。

### Flow State Design

- **Onboarding curve**: 第一天用低风险的门外影子侦察，演示“使用能力—观察征兆—记录线索”的完整闭环。
- **Difficulty scaling**: 从孤立异常逐步升级为门牌重排、身份登记和限时归位的组合规则。
- **Feedback clarity**: 不显示复苏数值，但所有危险变化都有持续、可比较的文字、图像或声音征兆。
- **Recovery from failure**: 死亡页解释可观察到的直接原因；永久档案保留，新周目可跳过已读内容并尝试新路线。

---

## Core Loop

### Moment-to-Moment (30 seconds)

阅读现场细节或档案，选择一个调查点，决定是否放出鬼影试探；观察影子带回的画面和身体异常，再将新证据归入规律假设。

### Short-Term (5-15 minutes)

消耗当天 3 个行动点，完成“查资料—提出假设—进入现场—能力试探—遭遇求生—更新档案”的小循环，在继续深入和安全结束当天之间取舍。

### Session-Level (30-120 minutes)

一个完整周目跨越七天、约 60–90 分钟。每天结束自动保存；第七天进入驾驭或死亡结局。失败会揭示一部分规则并为下一周目提供新路线。

### Long-Term Progression

永久档案保留发现过的异常、人物关系、房间信息和规律结论。完成章节后解锁新的厉鬼能力或驾驭路线，但所有能力继续携带复苏代价。后续章节可通过总部消息、支援任务和共同事件与杨间产生有意义的交集，同时保留原创主角的独立作用。

### Retention Hooks

- **Curiosity**: 谁已被替换、登记册为何变化、门牌鬼与鬼影能否形成拼图。
- **Investment**: 永久档案、已救住户、已发现房间和驾驭路线。
- **Social**: 第一版无社交留存。
- **Mastery**: 更少浪费行动、更少使用鬼影、更准确地利用三段式规则。

---

## Game Pillars

### Pillar 1: 力量必有代价

使用鬼能力一定留下身体或环境征兆，不能成为无代价技能。

*Design test*: 爽快连续施法与克制使用发生冲突时，选择克制使用。

### Pillar 2: 规律大于战斗

厉鬼不能靠伤害数值击败，玩家必须观察、试探并利用规律。

*Design test*: 正面攻击与寻找生路发生冲突时，选择规律推理。

### Pillar 3: 未知必须可推理

游戏可以隐瞒数值和真相，但必须留下足够线索，让死亡能够被复盘。

*Design test*: 纯随机惊吓与可复盘恐怖发生冲突时，选择可复盘。

### Pillar 4: 成长就是危险的新选择

驾驭第二只鬼不是普通升级，而是增加破局手段并引入新的失控方式。

*Design test*: 单纯提高数值与改变决策空间发生冲突时，选择改变决策空间。

### Anti-Pillars (What This Game Is NOT)

- **NOT 刷怪升级**: 它会削弱厉鬼不可常规对抗的恐怖感。
- **NOT 无代价能力连招**: 它会破坏复苏压力和每次使用能力的分量。
- **NOT 大型开放世界或 MMO**: 第一版只有 3–5 周，必须完成一个小而完整的事件。
- **NOT 完全随机的杀人规律**: 玩家必须能够调查、验证和复盘。
- **NOT 原作角色展览**: 原作人物只在能推动原创主角与事件时出现；第一版不制作杨间联动内容。

---

## Visual Identity Anchor

**Direction name**: 冷档案 / 旧楼异变

**One-line visual rule**: 正常信息越冷静可信，发生细微异常时越令人不安。

**Supporting principles**:

1. **终端保持克制** — 冷白、灰蓝、规整网格；如果装饰影响阅读或像普通科幻 HUD，就删除。
2. **现场必须生活化** — 潮湿墙面、褪色门联、旧电表和住户杂物建立真实旧楼感；如果只剩抽象黑暗，就补回日常细节。
3. **灵异只破坏局部秩序** — 门牌、影子、文字对齐或人物姿态出现微小错误；如果必须用满屏血红才能表达危险，就重做。

**Color philosophy**: 冷白与灰蓝用于总部档案，昏黄、霉绿与水泥灰用于居民楼，暗红只用于已确认的危险征兆和不可逆选择。

---

## Inspiration and References

| Reference | What We Take From It | What We Do Differently | Why It Matters |
| ---- | ---- | ---- | ---- |
| 《神秘复苏》 | 以鬼制鬼、厉鬼规律、复苏代价、总部体系 | 原创主角、原创居民楼事件；首章不改写原作主线 | 保证同人核心气质 |
| 《World of Horror》 | 调查压力、地点选择、有限资源 | 固定手工事件与三方证据链，不做随机事件拼盘 | 证明轻量界面也能承载恐怖调查 |
| 《隐形守护者》 | 分支叙事和关键选择 | 更强调系统化规律试探与多周目档案 | 证明浏览器式交互可以承载长篇沉浸体验 |

**Non-game inspirations**: 中国旧式拆迁居民楼、物业纸质登记册、监控画面、深夜楼道声场。

---

## Target Player Profile

| Attribute | Detail |
| ---- | ---- |
| **Age range** | 16+；能接受死亡、身体异变和心理恐怖题材 |
| **Gaming experience** | 中度玩家；愿意阅读、推理和重复尝试 |
| **Time availability** | 单次 10–30 分钟，或 60–90 分钟完成一周目 |
| **Platform preference** | 桌面浏览器，键盘和鼠标 |
| **Current games they play** | 剧情冒险、规则推理、恐怖生存、轻量养成游戏 |
| **What they're looking for** | 《神秘复苏》式“能力越强越危险”的可交互体验 |
| **What would turn them away** | 纯文字堆砌、不可解释的随机死亡、重复刷取、廉价跳脸惊吓 |

---

## Technical Considerations

| Consideration | Assessment |
| ---- | ---- |
| **Recommended Engine** | 原生 Web 应用：TypeScript + HTML/CSS；具体构建框架由 `/setup-engine` 固化 |
| **Key Technical Challenges** | 可维护的分支状态、跨周目档案、本地存档迁移、事件条件一致性 |
| **Art Style** | 2D 档案终端 + 中式旧楼场景插画 + 局部动态异常 |
| **Art Pipeline Complexity** | 中等：少量定制场景与状态变体，不制作自由移动角色动画 |
| **Audio Needs** | 中等：楼道环境声、敲门、灯管、电流与低频灵异提示；不依赖大量配音 |
| **Networking** | 无 |
| **Content Volume** | 1 栋楼、2 只鬼、3 名关键住户、约 12 个主要调查场景、1 个驾驭结局和多个失败结局 |
| **Procedural Systems** | 无；所有核心规律和线索手工设计以保证可推理性 |

---

## Risks and Open Questions

### Design Risks

- 60–90 分钟内容可能因重复阅读显得拖沓；需要已读跳过和短文本验证。
- 模糊复苏征兆若过于含糊会让死亡显得不公平；每一阶段必须有可比较的多通道提示。
- 鬼影试探若只是“点按钮看文本”，可能缺乏主动感；原型必须验证选择目标、结果差异和代价反馈。

### Technical Risks

- 分支条件与永久档案可能互相污染；需要把“本周目状态”和“跨周目状态”明确分开。
- 浏览器本地存档可能被清除或损坏；第一版需提供重置与导入导出之外的最小故障保护，导入导出可延后。

### Release / IP Risks

- 免费、非商业不等于获得原作授权；公开发布时不得宣称官方或已授权。
- 原作角色、专有名词和素材的使用范围需要在发布前单独复核；第一版不直接复制小说文本或商业美术素材。

### Scope Risks

- 12 个场景若都需要独立高精插画会超过 3–5 周；首版采用复用背景加状态变体。
- 杨间联动、更多城市、自由移动、配音和战斗均不进入首章范围。

### Open Questions

- 鬼影试探在没有自由移动和战斗的情况下是否足够有趣？通过 1–3 天可丢弃原型验证。
- 模糊征兆能否既恐怖又公平？通过三阶段征兆和固定测试场景验证玩家是否能正确排序危险程度。

---

## MVP Definition

**Core hypothesis**: 玩家愿意冒着鬼影复苏的风险，主动使用能力试探未知规律，并能从结果与征兆中形成下一步决策。

**Required for MVP**:

1. 一个包含证词、现场与登记册的微型调查场景。
2. 至少三个可派出鬼影的目标，每个目标提供不同线索和复苏后果。
3. 无精确数值的三阶段复苏征兆。
4. 一次规律假设选择，以及由证据决定的成功或失败结果。
5. 基本浏览器存档与重新开始功能。

**Explicitly NOT in MVP**:

- 完整七天、12 个场景和全部结局。
- 第二只鬼的完整驾驭演出。
- 杨间或其他原作角色联动。
- 自由移动、战斗、联网、账号和云存档。

### Scope Tiers (if budget/time shrinks)

| Tier | Content | Features | Timeline |
| ---- | ---- | ---- | ---- |
| **MVP** | 1 个微型调查、3 个试探点 | 鬼影试探、征兆、假设、存档 | 2–3 天 |
| **Vertical Slice** | 第一天至第二天、1 名关键住户 | 档案终端、现场切换、日结、多周目档案 | 1–2 周 |
| **Alpha** | 完整七天、约 12 个场景、占位美术 | 全部核心系统与主要结局 | 3–4 周 |
| **Full Vision** | 完整首章、正式视觉音频、驾驭结局 | 内容润色、可访问性、发布构建 | 3–5 周，单人开发 |

---

## Next Steps

- [x] 概念与设计支柱确认
- [ ] 使用 `/setup-engine` 固化 Web 技术栈与目录约定
- [ ] 使用 `/prototype 鬼影试探` 验证核心假设
- [ ] 若原型通过，使用 `/art-bible` 固化视觉规范
- [ ] 使用 `/map-systems` 拆分首章系统并控制范围
- [ ] 为 MVP 系统编写必要 GDD
- [ ] 建立技术架构与关键决策记录
- [ ] 在阶段门禁检查后制作完整首章

---

> **Review mode**: Lean — CD-PILLARS、AD-CONCEPT-VISUAL、TD-FEASIBILITY 与 PR-SCOPE 按流程跳过，阶段门禁时统一审查。
