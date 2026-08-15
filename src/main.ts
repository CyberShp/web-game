import "./styles.css";
import corridorSceneUrl from "./assets/scenes/second-floor-corridor.jpg";

import { ACTIONS, EVIDENCE_LABELS } from "./content/actions";
import { DAY_BRIEFS } from "./content/day-reports";
import type { ArchiveState, HypothesisId, InvestigationAction, RunState } from "./game/model";
import {
  advanceDay,
  archiveRun,
  attemptControl,
  canPerformAction,
  createNewArchive,
  createNewRun,
  getShadowSymptom,
  performAction,
  testHypothesis,
} from "./game/rules";
import {
  clearAllProgress,
  clearRun,
  loadArchive,
  loadRun,
  saveArchive,
  saveRun,
} from "./game/storage";

type WorkspaceView = "desktop" | "files" | "search" | "comms" | "field" | "board" | "archive" | "journal";

const appElement = document.querySelector<HTMLDivElement>("#app");
if (!appElement) throw new Error("Missing #app root");
const app: HTMLDivElement = appElement;

let run: RunState = loadRun(localStorage) ?? createNewRun();
let archive: ArchiveState = loadArchive(localStorage) ?? createNewArchive();
let view: WorkspaceView = "desktop";
let selectedAction: InvestigationAction | null = null;
let actionResult: { label: string; message: string; evidence: string[]; symptom: string } | null = null;
let ghostOperation: InvestigationAction | null = null;
let pendingProgressAction: "restart" | "reset-all" | null = null;
let searchQuery = "";
let booting = true;
let dayTransition = false;
let audioOn = false;
let audioContext: AudioContext | null = null;
let ambientSources: AudioScheduledSourceNode[] = [];
let ambientMaster: GainNode | null = null;
let latestMessage = run.journal.at(-1) ?? "任务接收。";

const viewLabels: Record<WorkspaceView, string> = {
  desktop: "指挥桌面",
  files: "内部档案",
  search: "全域检索",
  comms: "加密通讯",
  field: "现场接入",
  board: "规律推演",
  archive: "永久档案",
  journal: "行动记录",
};

function persist(): void {
  saveRun(localStorage, run);
  saveArchive(localStorage, archive);
}

function availableActions(mode?: InvestigationAction["mode"]): InvestigationAction[] {
  return ACTIONS.filter((action) => canPerformAction(run, action) && (!mode || action.mode === mode));
}

function symptomLabel(): ReturnType<typeof getShadowSymptom> {
  return getShadowSymptom(run.shadowUses);
}

function endingTitle(): string | null {
  if (!run.ending) return null;
  return { controlled: "新的平衡", unregistered: "第八名住户", "shadow-taken": "影子先到一步" }[run.ending];
}

function render(): void {
  const symptom = symptomLabel();
  const ending = endingTitle();
  document.body.dataset.shadowStage = symptom.stage;
  document.body.classList.toggle("audio-active", audioOn);

  app.innerHTML = `
    <div class="terminal-world">
      <div class="ambient-haze" aria-hidden="true"></div>
      <div class="terminal-chassis">
        <header class="hq-header">
          <button class="hq-brand" data-view="desktop" type="button" aria-label="返回指挥桌面">
            ${renderEmblem()}
            <span><b>灵异事件处理总部</b><small>SUPERNATURAL INCIDENT COMMAND · ASIA</small></span>
          </button>
          <div class="clearance">
            <span>OPERATOR / 临时城市负责人</span><span>CASE / HYL-07</span><strong>绝密 · 驭鬼者权限</strong>
          </div>
          <button class="audio-switch ${audioOn ? "on" : ""}" id="audio-toggle" type="button" aria-pressed="${audioOn}">
            <i></i>${audioOn ? "声场已接入" : "接入声场"}
          </button>
        </header>

        <div class="monitor-shell">
          <div class="scanlines" aria-hidden="true"></div>
          <div class="monitor-glare" aria-hidden="true"></div>
          <aside class="system-dock" aria-label="总部终端应用">
            ${renderDockButton("desktop", "⌂", "桌面")}
            ${renderDockButton("files", "档", "档案")}
            ${renderDockButton("search", "检", "检索")}
            ${renderDockButton("comms", "讯", "通讯")}
            ${renderDockButton("field", "场", "现场")}
            ${renderDockButton("board", "规", "推演")}
            ${renderDockButton("archive", "存", "永久")}
          </aside>

          <main class="workstation">
            <div class="window-bar">
              <span class="secure-light"></span><strong>${viewLabels[view]}</strong>
              <div><span>DAY ${String(run.day).padStart(2, "0")}/07</span><span>${run.actionsLeft} AP REMAIN</span><span>LINK SECURE</span></div>
            </div>
            <div class="workspace-view">${ending && view !== "archive" && view !== "journal" ? renderEnding(ending) : renderView()}</div>
          </main>

          <aside class="case-sidebar">
            <section class="countdown-module">
              <span>七日限期</span><strong>${String(run.day).padStart(2, "0")}</strong><small>DAYS / ACTIVE</small>
              <div class="day-track">${Array.from({ length: 7 }, (_, i) => `<i class="${i + 1 < run.day ? "past" : i + 1 === run.day ? "now" : ""}"></i>`).join("")}</div>
            </section>
            <section class="shadow-monitor symptom-${symptom.stage}">
              <span class="module-label">驭鬼者生命体征 / UNKNOWN</span>
              <div class="shadow-body" aria-hidden="true"><i></i><i></i><b></b></div>
              <h2>${symptom.title}</h2><p>${symptom.description}</p>
            </section>
            <section class="evidence-module">
              <span class="module-label">已确认线索</span><strong>${String(run.evidence.length).padStart(2, "0")}</strong>
              <div>${run.evidence.slice(-3).map((id) => `<p>${EVIDENCE_LABELS[id] ?? id}</p>`).join("") || "<p>等待现场回传。</p>"}</div>
            </section>
          </aside>
        </div>

        <footer class="terminal-footer">
          <span class="system-time">HYL-07 / ${String(run.day).padStart(2, "0")}:17</span>
          <p>${latestMessage}</p>
          <button id="journal-open" type="button">查看记录</button>
          <button id="end-day" type="button" ${run.day >= 7 || run.ending ? "disabled" : ""}>结束今日调查 →</button>
        </footer>
      </div>
    </div>

    ${booting ? renderBoot() : ""}
    ${selectedAction ? renderActionDrawer(selectedAction) : ""}
    ${ghostOperation ? renderGhostOperation(ghostOperation) : ""}
    ${actionResult ? renderActionResult(actionResult) : ""}
    ${pendingProgressAction ? renderProgressDialog(pendingProgressAction) : ""}
    ${dayTransition ? renderDayTransition() : ""}
  `;
  bindEvents();
}

function renderEmblem(): string {
  return `<span class="hq-emblem" aria-hidden="true"><i></i><i></i><i></i><b>异</b></span>`;
}

function renderDockButton(target: WorkspaceView, glyph: string, label: string): string {
  return `<button class="dock-app ${view === target ? "active" : ""}" data-view="${target}" type="button"><span>${glyph}</span><small>${label}</small></button>`;
}

function renderView(): string {
  switch (view) {
    case "files": return renderFileSystem();
    case "search": return renderSearch();
    case "comms": return renderComms();
    case "field": return renderField();
    case "board": return renderBoard();
    case "archive": return renderPermanentArchive();
    case "journal": return renderJournal();
    default: return renderDesktop();
  }
}

function renderDesktop(): string {
  const fieldCount = availableActions("field").length;
  const archiveCount = availableActions("archive").length;
  const contactCount = availableActions("contact").length;
  return `<section class="desktop-view">
    <div class="briefing-hero">
      <div><span class="eyebrow">总部第 07 号灵异事件 · 正在封锁</span><h1>${run.day === 7 ? "零点前，完成重新分配。" : DAY_BRIEFS[run.day]}</h1></div>
      <p>不要相信灵异空间里的门。不要让任何人替你回答姓名。</p>
      <div class="briefing-stamp">档案状态<br><strong>${run.confirmedHypothesis ? "规律已确认" : "规律未确认"}</strong></div>
    </div>
    <div class="desktop-apps">
      ${renderDesktopApp("files", "内部档案库", `${archiveCount} 份可查阅文件`, "打开扫描档案、物业记录与城建旧卷。")}
      ${renderDesktopApp("search", "全域检索", "需要手动输入关键词", "从档案标题、地址与人物身份中交叉搜索。")}
      ${renderDesktopApp("comms", "加密通讯", `${contactCount} 条可接入线路`, "联系幸存者、总部与封锁区人员。")}
      ${renderDesktopApp("field", "槐荫里现场", `${fieldCount} 个可调查区域`, "远程接入执法记录仪，直接检查现场异常。")}
      ${renderDesktopApp("board", "规律推演台", run.confirmedHypothesis ? "规律已锁定" : "等待人工组合", "组合登记、门牌与替换条件，而非选择现成答案。")}
    </div>
    ${run.day === 7 ? `<section class="final-directive"><span>FINAL DIRECTIVE / 00:17</span><div><h2>进入墙后夹层，驾驭门牌鬼</h2><p>你必须同时拥有临时住户身份、旧门牌锚点和跨房间影路。总部不会替你承担失败结果。</p></div><button class="terminal-primary" id="attempt-control" type="button">执行最终驾驭方案</button></section>` : ""}
    <div class="incoming-strip"><span>INCOMING / HQ</span><p>亚洲分部提示：鬼域中的地址、姓名和门牌均可能成为灵异媒介。</p><button data-view="comms" type="button">接收通讯</button></div>
  </section>`;
}

function renderDesktopApp(target: WorkspaceView, title: string, meta: string, copy: string): string {
  return `<button class="desktop-app" data-view="${target}" type="button"><span>${title.slice(0, 1)}</span><div><small>${meta}</small><h2>${title}</h2><p>${copy}</p></div><b>打开 ↗</b></button>`;
}

function actionRows(actions: InvestigationAction[], empty: string): string {
  if (!actions.length) return `<div class="terminal-empty"><span>NO RECORD</span><p>${empty}</p></div>`;
  return actions.map((action, index) => `<button class="record-row" data-open-action="${action.id}" type="button"><span>${String(index + 1).padStart(3, "0")}</span><div><small>${action.location}</small><strong>${action.label}</strong><p>${action.teaser}</p></div><b>${action.shadowCost ? "灵异权限" : "可调阅"}</b></button>`).join("");
}

function renderFileSystem(): string {
  return `<section class="terminal-page files-view"><header><span>ARCHIVE / INTERNAL ONLY</span><h1>总部内部档案库</h1><p>所有文件均可能被灵异力量改写。以打开时内容为准。</p></header><div class="folder-path">总部盘符：/cases/HYL-07/day-${run.day}/</div><div class="record-list">${actionRows(availableActions("archive"), "当前权限下没有新的档案。")}</div></section>`;
}

function searchableText(action: InvestigationAction): string {
  return `${action.label} ${action.location} ${action.teaser} ${action.result}`.toLowerCase();
}

function searchResultsMarkup(): string {
  const query = searchQuery.trim().toLowerCase();
  if (query.length < 2) return `<div class="search-idle"><span>⌁</span><p>输入姓名、地址、房号或异常关键词。<br>示例：失踪、门牌、徐蓉、登记册。</p></div>`;
  const results = availableActions().filter((action) => searchableText(action).includes(query));
  return `<div class="search-summary">检索 “${escapeHtml(searchQuery)}” · ${results.length} 条匹配</div><div class="record-list">${actionRows(results, "未找到匹配记录。尝试使用文件中出现过的原词。")}</div>`;
}

function renderSearch(): string {
  return `<section class="terminal-page search-view"><header><span>GLOBAL INDEX / MANUAL QUERY</span><h1>全域档案检索</h1><p>检索不会自动替你判断相关性。记录出现异常时，请保留原始词汇。</p></header><label class="terminal-search"><span>QUERY://</span><input id="search-input" value="${escapeHtml(searchQuery)}" autocomplete="off" placeholder="输入关键词……" autofocus><i></i></label><div id="search-results">${searchResultsMarkup()}</div></section>`;
}

function renderComms(): string {
  return `<section class="terminal-page comms-view"><header><span>ENCRYPTED LINE / RECORDED</span><h1>加密通讯中心</h1><p>封锁区来电可能并非由登记本人发起。接通前核对线路位置。</p></header><div class="signal-wave" aria-hidden="true">${Array.from({ length: 40 }, (_, i) => `<i style="--h:${18 + ((i * 17) % 64)}%"></i>`).join("")}</div><div class="record-list">${actionRows(availableActions("contact"), "当前没有新的可接入线路。")}</div></section>`;
}

function renderField(): string {
  const field = availableActions("field");
  const recovery = availableActions("recovery");
  return `<section class="field-view">
    <div class="scene-feed" style="--scene-image:url('${corridorSceneUrl}')">
      <div class="feed-overlay"><span>REC ● HYL-07 / FLOOR 02</span><b>00:${17 + run.day}:0${run.day}</b></div>
      <div class="focus-brackets" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
      ${field.map((action, i) => `<button class="world-hotspot hotspot-${(i % 3) + 1}" data-open-action="${action.id}" type="button"><i></i><span>${action.label}</span><small>${action.shadowCost ? "鬼影可进入" : "现场操作"}</small></button>`).join("")}
      ${field.length ? "" : `<div class="scene-clear">当前画面没有新的可调查目标。</div>`}
      <div class="scene-distortion" aria-hidden="true"></div>
    </div>
    ${recovery.length ? `<aside class="recovery-console"><span>紧急处置</span>${actionRows(recovery, "")}</aside>` : ""}
  </section>`;
}

function renderBoard(): string {
  if (run.confirmedHypothesis) return `<section class="terminal-page board-view confirmed"><header><span>RULE MODEL / LOCKED</span><h1>规律已经确认</h1></header><div class="rule-chain"><article><span>01 / 登记</span><strong>三次敲门</strong><p>让居民楼注意并记录目标。</p></article><i>→</i><article><span>02 / 分配</span><strong>午夜调换门牌</strong><p>重新定义住户属于哪一间房。</p></article><i>→</i><article><span>03 / 替换</span><strong>身份与房间不匹配</strong><p>熄灯后，错误住户被对应身份替换。</p></article></div></section>`;
  return `<section class="terminal-page board-view"><header><span>RULE MODEL / HUMAN JUDGEMENT REQUIRED</span><h1>建立灵异规律模型</h1><p>把三个观察结果组合成一条因果链。系统不会提供候选答案。</p></header><form id="rule-form" class="rule-builder"><label><span>第一步：什么完成目标登记？</span><select id="rule-trigger" required><option value="">选择观察结果</option><option value="knock">三次敲门</option><option value="shadow">鬼影进入房间</option><option value="call">拨打物业电话</option></select></label><b>→</b><label><span>第二步：午夜发生什么？</span><select id="rule-change" required><option value="">选择观察结果</option><option value="plate">门牌重新分配</option><option value="power">断电杀人</option><option value="memory">住户交换记忆</option></select></label><b>→</b><label><span>第三步：谁会被替换？</span><select id="rule-target" required><option value="">选择观察结果</option><option value="mismatch">身份与房间不匹配者</option><option value="answer">回应敲门者</option><option value="shadowed">被鬼影接触者</option></select></label><button class="terminal-primary" type="submit">提交总部规则模型</button></form><div class="evidence-ticker">${run.evidence.map((id) => `<span>${EVIDENCE_LABELS[id] ?? id}</span>`).join("") || "尚无证据可以用于推演。"}</div></section>`;
}

function renderPermanentArchive(): string {
  const endingNames: Record<string, string> = { controlled: "新的平衡", unregistered: "第八名住户", "shadow-taken": "影子先到一步" };
  return `<section class="terminal-page permanent-view"><header><span>CROSS-RUN MEMORY / LOCAL</span><h1>永久档案</h1><p>第 ${archive.runCount} 次调查 · 死亡不会带走已经确认的事实。</p></header><div class="archive-columns"><article><h2>跨周目证据 / ${archive.evidence.length}</h2>${archive.evidence.map((id) => `<p>${EVIDENCE_LABELS[id] ?? id}</p>`).join("") || "<p>尚无永久记录。</p>"}</article><article><h2>已见结局 / ${archive.endings.length}</h2>${archive.endings.map((id) => `<p>${endingNames[id]}</p>`).join("") || "<p>尚未抵达结局。</p>"}<h2>驾驭能力</h2><p class="ability-line">${archive.abilities.includes("doorplate-mark") ? "门牌标记 · 已解锁" : "████ · 未解锁"}</p></article></div><div class="progress-controls"><button id="restart-run" type="button">重新开始本周目</button><button id="reset-all" type="button">清除全部本地档案</button></div></section>`;
}

function renderJournal(): string {
  return `<section class="terminal-page journal-view"><header><span>OPERATOR LOG / AUTO-SAVED</span><h1>行动记录</h1></header><ol>${run.journal.map((entry, i) => `<li><span>${String(i + 1).padStart(3, "0")}</span><p>${entry}</p></li>`).join("")}</ol></section>`;
}

function renderEnding(title: string): string {
  return `<section class="ending-screen"><span>CASE HYL-07 / TERMINAL OUTCOME</span><h1>${title}</h1><p>${latestMessage}</p><button class="terminal-primary" id="new-cycle" type="button">封存本次调查，开始新的七日</button><button data-view="archive" type="button">查看永久档案</button></section>`;
}

function renderActionDrawer(action: InvestigationAction): string {
  const noun = action.mode === "archive" ? "打开档案" : action.mode === "contact" ? "接通线路" : action.mode === "recovery" ? "执行压制" : "进入调查点";
  return `<div class="drawer-backdrop"><section class="action-drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title"><button class="drawer-close" id="close-drawer" type="button" aria-label="关闭">×</button><span class="security-code">HYL-07 / ${action.mode.toUpperCase()} / AUTHORIZED</span><h2 id="drawer-title">${action.label}</h2><p class="drawer-location">${action.location}</p><div class="redacted-preview"><span>调查前摘要</span><p>${action.teaser}</p><i>████ ███████ ████</i></div>${action.shadowCost ? `<div class="ghost-warning"><b>驭鬼权限操作</b><p>该行动会放出鬼影。生命体征不会显示安全次数。</p></div>` : ""}<button class="terminal-primary" id="execute-action" type="button">${noun} · 消耗 1 AP</button></section></div>`;
}

function renderGhostOperation(action: InvestigationAction): string {
  return `<div class="ghost-operation" role="dialog" aria-modal="true"><div class="ghost-corridor" style="--scene-image:url('${corridorSceneUrl}')"><div class="shadow-spill"></div><div class="ghost-target"><i></i><span>${action.location}</span></div><div class="operation-copy"><span>能力释放 / DO NOT INTERRUPT</span><h2>鬼影正在越过门槛</h2><p>光源失效。目标区域的影子开始朝同一方向移动。</p><div class="operation-progress"><i></i></div></div></div></div>`;
}

function renderActionResult(result: NonNullable<typeof actionResult>): string {
  return `<div class="result-backdrop"><section class="result-terminal" role="dialog" aria-modal="true" aria-labelledby="result-title"><span>FIELD RETURN / ARCHIVED</span><h2 id="result-title">${result.label}</h2><p class="typed-result">${result.message}</p>${result.evidence.length ? `<div class="new-evidence"><b>新证据已写入</b>${result.evidence.map((id) => `<p>${EVIDENCE_LABELS[id] ?? id}</p>`).join("")}</div>` : ""}<div class="body-return"><b>驭鬼者观察</b><p>${result.symptom}</p></div><button class="terminal-primary" id="close-result" type="button">确认归档</button></section></div>`;
}

function renderBoot(): string {
  return `<div class="boot-screen" id="boot-screen"><div class="boot-emblem">${renderEmblem()}</div><span>SUPERNATURAL INCIDENT COMMAND</span><h1>灵异事件处理总部</h1><p>正在验证驭鬼者权限……</p><div class="boot-line"><i></i></div><small>检测到本地档案 / CASE HYL-07</small><button id="skip-boot" type="button">点击接入终端</button></div>`;
}

function renderDayTransition(): string {
  return `<div class="day-transition"><span>封锁仍在继续</span><strong>DAY ${String(run.day).padStart(2, "0")}</strong><p>${latestMessage}</p></div>`;
}

function renderProgressDialog(kind: "restart" | "reset-all"): string {
  const all = kind === "reset-all";
  return `<div class="drawer-backdrop"><section class="confirm-terminal" role="alertdialog" aria-modal="true"><span>LOCAL ARCHIVE CONTROL</span><h2>${all ? "清除全部档案？" : "重新开始本周目？"}</h2><p>${all ? "当前调查、永久证据和已见结局都会被移除。" : "当前七日进度会被放弃，永久档案仍然保留。"}</p><div><button id="cancel-progress" type="button">取消</button><button id="confirm-progress" class="terminal-primary" type="button">确认</button></div></section></div>`;
}

function bindEvents(): void {
  document.querySelectorAll<HTMLElement>("[data-view]").forEach((button) => button.addEventListener("click", () => {
    playTerminalClick();
    view = button.dataset.view as WorkspaceView;
    selectedAction = null;
    render();
  }));
  bindActionLaunchers(document);
  document.querySelector("#close-drawer")?.addEventListener("click", () => { playTerminalClick(); selectedAction = null; render(); });
  document.querySelector("#execute-action")?.addEventListener("click", executeSelectedAction);
  document.querySelector("#close-result")?.addEventListener("click", () => { playTerminalClick(); actionResult = null; render(); });
  document.querySelector("#audio-toggle")?.addEventListener("click", toggleAudio);
  document.querySelector("#journal-open")?.addEventListener("click", () => { playTerminalClick(); view = "journal"; render(); });
  document.querySelector("#end-day")?.addEventListener("click", endDay);
  document.querySelector("#rule-form")?.addEventListener("submit", submitRuleModel);
  document.querySelector("#attempt-control")?.addEventListener("click", executeFinalControl);
  document.querySelector("#search-input")?.addEventListener("input", updateSearch);
  document.querySelector("#restart-run")?.addEventListener("click", () => { pendingProgressAction = "restart"; render(); });
  document.querySelector("#reset-all")?.addEventListener("click", () => { pendingProgressAction = "reset-all"; render(); });
  document.querySelector("#cancel-progress")?.addEventListener("click", () => { pendingProgressAction = null; render(); });
  document.querySelector("#confirm-progress")?.addEventListener("click", confirmProgress);
  document.querySelector("#new-cycle")?.addEventListener("click", startNewCycle);
  document.querySelector("#skip-boot")?.addEventListener("click", () => { booting = false; render(); });
  document.onkeydown = (event) => {
    if (event.key !== "Escape") return;
    selectedAction = null; actionResult = null; pendingProgressAction = null; render();
  };
}

function executeFinalControl(): void {
  const result = attemptControl(run);
  if (!result.ok) return;
  run = result.state;
  latestMessage = result.message;
  archive = archiveRun(archive, run);
  playGhostCue();
  persist();
  render();
}

function bindActionLaunchers(root: ParentNode): void {
  root.querySelectorAll<HTMLElement>("[data-open-action]").forEach((button) => button.addEventListener("click", () => {
    playArchiveOpen();
    selectedAction = ACTIONS.find((action) => action.id === button.dataset.openAction) ?? null;
    render();
  }));
}

function updateSearch(event: Event): void {
  searchQuery = (event.target as HTMLInputElement).value;
  const results = document.querySelector("#search-results");
  if (!results) return;
  results.innerHTML = searchResultsMarkup();
  bindActionLaunchers(results);
}

function executeSelectedAction(): void {
  if (!selectedAction) return;
  const action = selectedAction;
  selectedAction = null;
  if (action.shadowCost) {
    ghostOperation = action;
    playGhostCue();
    render();
    window.setTimeout(() => completeAction(action), 1500);
    return;
  }
  completeAction(action);
}

function completeAction(action: InvestigationAction): void {
  const previousEvidence = new Set(run.evidence);
  const result = performAction(run, action.id, ACTIONS);
  run = result.state;
  latestMessage = result.message;
  const symptom = symptomLabel();
  ghostOperation = null;
  actionResult = {
    label: action.label,
    message: result.message,
    evidence: run.evidence.filter((id) => !previousEvidence.has(id)),
    symptom: `${symptom.title}：${symptom.description}`,
  };
  persist();
  render();
}

function submitRuleModel(event: Event): void {
  event.preventDefault();
  const trigger = (document.querySelector("#rule-trigger") as HTMLSelectElement).value;
  const change = (document.querySelector("#rule-change") as HTMLSelectElement).value;
  const target = (document.querySelector("#rule-target") as HTMLSelectElement).value;
  let hypothesis: HypothesisId = "knock-kills";
  if (trigger === "knock" && change === "plate" && target === "mismatch") hypothesis = "identity-mismatch";
  else if (trigger === "shadow" || target === "shadowed") hypothesis = "shadow-marks";
  const result = testHypothesis(run, hypothesis);
  run = result.state;
  latestMessage = result.message;
  actionResult = { label: "规律模型审查", message: result.message, evidence: [], symptom: `审查结果：${result.outcome}` };
  persist();
  render();
}

function endDay(): void {
  const result = advanceDay(run);
  if (!result.ok) return;
  run = result.state;
  latestMessage = result.message;
  view = "desktop";
  dayTransition = true;
  playKnock();
  persist();
  render();
  window.setTimeout(() => { dayTransition = false; render(); }, 1800);
}

function startNewCycle(): void {
  archive = { ...archiveRun(archive, run), runCount: archive.runCount + 1 };
  clearRun(localStorage);
  run = createNewRun();
  latestMessage = `第 ${archive.runCount} 次调查开始。永久档案已保留。`;
  view = "desktop";
  persist();
  render();
}

function confirmProgress(): void {
  if (pendingProgressAction === "restart") { pendingProgressAction = null; startNewCycle(); return; }
  if (pendingProgressAction === "reset-all") {
    clearAllProgress(localStorage);
    run = createNewRun(); archive = createNewArchive(); latestMessage = "全部本地档案已清除。任务重新开始。";
    pendingProgressAction = null; view = "desktop"; render();
  }
}

async function toggleAudio(): Promise<void> {
  audioOn = !audioOn;
  if (audioOn) {
    await startAmbient();
    playAccessGranted();
  } else {
    stopAmbient();
  }
  render();
}

async function startAmbient(): Promise<void> {
  audioContext ??= new AudioContext();
  if (audioContext.state === "suspended") await audioContext.resume();
  if (ambientSources.length) return;

  const master = audioContext.createGain();
  master.gain.value = 0.13;
  master.connect(audioContext.destination);
  ambientMaster = master;

  const humGain = audioContext.createGain();
  humGain.gain.value = 0.08;
  humGain.connect(master);
  [92, 138].forEach((frequency, index) => {
    const oscillator = audioContext!.createOscillator();
    oscillator.type = index === 0 ? "sine" : "triangle";
    oscillator.frequency.value = frequency;
    oscillator.detune.value = index ? -7 : 0;
    oscillator.connect(humGain);
    oscillator.start();
    ambientSources.push(oscillator);
  });

  const pulse = audioContext.createOscillator();
  const pulseDepth = audioContext.createGain();
  pulse.type = "sine";
  pulse.frequency.value = 0.11;
  pulseDepth.gain.value = 0.045;
  pulse.connect(pulseDepth).connect(humGain.gain);
  pulse.start();
  ambientSources.push(pulse);

  const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 2, audioContext.sampleRate);
  const noiseData = noiseBuffer.getChannelData(0);
  for (let index = 0; index < noiseData.length; index += 1) noiseData[index] = Math.random() * 2 - 1;
  const noise = audioContext.createBufferSource();
  const noiseFilter = audioContext.createBiquadFilter();
  const noiseGain = audioContext.createGain();
  noise.buffer = noiseBuffer;
  noise.loop = true;
  noiseFilter.type = "bandpass";
  noiseFilter.frequency.value = 480;
  noiseFilter.Q.value = 0.65;
  noiseGain.gain.value = 0.022;
  noise.connect(noiseFilter).connect(noiseGain).connect(master);
  noise.start();
  ambientSources.push(noise);
}

function stopAmbient(): void {
  ambientSources.forEach((source) => {
    try { source.stop(); } catch { /* source already stopped */ }
  });
  ambientSources = [];
  ambientMaster?.disconnect();
  ambientMaster = null;
}

function playKnock(): void {
  if (!audioOn || !audioContext) return;
  [0, .24, .5].forEach((delay) => {
    const osc = audioContext!.createOscillator(); const gain = audioContext!.createGain(); const at = audioContext!.currentTime + delay;
    osc.type = "triangle"; osc.frequency.setValueAtTime(165, at); osc.frequency.exponentialRampToValueAtTime(82, at + .14);
    gain.gain.setValueAtTime(.0001, at); gain.gain.exponentialRampToValueAtTime(.24, at + .008); gain.gain.exponentialRampToValueAtTime(.0001, at + .17);
    osc.connect(gain).connect(audioContext!.destination); osc.start(at); osc.stop(at + .18);
  });
}

function playTerminalClick(): void {
  if (!audioOn || !audioContext) return;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const now = audioContext.currentTime;
  oscillator.type = "square";
  oscillator.frequency.setValueAtTime(620, now);
  oscillator.frequency.exponentialRampToValueAtTime(390, now + .045);
  gain.gain.setValueAtTime(.035, now);
  gain.gain.exponentialRampToValueAtTime(.0001, now + .055);
  oscillator.connect(gain).connect(audioContext.destination);
  oscillator.start(now); oscillator.stop(now + .06);
}

function playArchiveOpen(): void {
  if (!audioOn || !audioContext) return;
  [210, 315].forEach((frequency, index) => {
    const oscillator = audioContext!.createOscillator();
    const gain = audioContext!.createGain();
    const at = audioContext!.currentTime + index * .055;
    oscillator.type = "sine"; oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(.045, at); gain.gain.exponentialRampToValueAtTime(.0001, at + .12);
    oscillator.connect(gain).connect(audioContext!.destination); oscillator.start(at); oscillator.stop(at + .13);
  });
}

function playAccessGranted(): void {
  if (!audioOn || !audioContext) return;
  [440, 554, 659].forEach((frequency, index) => {
    const oscillator = audioContext!.createOscillator();
    const gain = audioContext!.createGain();
    const at = audioContext!.currentTime + index * .075;
    oscillator.type = "sine"; oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(.0001, at); gain.gain.exponentialRampToValueAtTime(.07, at + .015); gain.gain.exponentialRampToValueAtTime(.0001, at + .13);
    oscillator.connect(gain).connect(audioContext!.destination); oscillator.start(at); oscillator.stop(at + .14);
  });
}

function playGhostCue(): void {
  playKnock();
  if (audioOn && audioContext) {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const now = audioContext.currentTime;
    oscillator.type = "sawtooth";
    oscillator.frequency.setValueAtTime(126, now);
    oscillator.frequency.exponentialRampToValueAtTime(38, now + 1.25);
    gain.gain.setValueAtTime(.0001, now);
    gain.gain.exponentialRampToValueAtTime(.085, now + .08);
    gain.gain.exponentialRampToValueAtTime(.0001, now + 1.3);
    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start(now); oscillator.stop(now + 1.32);
  }
  document.body.animate([{ filter: "brightness(1)" }, { filter: "brightness(.35)" }, { filter: "brightness(1)" }], { duration: 420 });
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] ?? character);
}

window.setTimeout(() => { if (booting) { booting = false; render(); } }, 2200);
persist();
render();
