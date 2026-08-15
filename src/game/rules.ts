import { DAY_END_REPORTS } from "../content/day-reports";
import type {
  ArchiveState,
  CommandResult,
  EndingId,
  HypothesisId,
  HypothesisResult,
  InvestigationAction,
  RunState,
} from "./model";

const ACTIONS_PER_DAY = 3;
const FINAL_DAY = 7;
const CONTROL_FLAGS = ["temporary-resident", "plate-anchor", "shadow-route"];
const RULE_EVIDENCE = [
  "ev-scratched-plates",
  "ev-false-resident",
  "ev-blackout-replacement",
];

/** Creates an untouched seven-day run. */
export function createNewRun(): RunState {
  return {
    day: 1,
    actionsLeft: ACTIONS_PER_DAY,
    shadowUses: 0,
    evidence: [],
    flags: [],
    completedActions: [],
    confirmedHypothesis: null,
    ending: null,
    journal: ["任务接收：调查槐荫里 7 栋持续发生的住户失踪事件。"],
  };
}

/** Creates empty progress that persists across seven-day runs. */
export function createNewArchive(): ArchiveState {
  return { runCount: 1, evidence: [], endings: [], abilities: [] };
}

/** Returns whether all requested IDs are present in a collection. */
function includesAll(values: readonly string[], requirements: readonly string[] = []): boolean {
  return requirements.every((requirement) => values.includes(requirement));
}

/** Determines whether an authored action can currently be performed. */
export function canPerformAction(state: RunState, action: InvestigationAction): boolean {
  return (
    state.ending === null &&
    state.actionsLeft > 0 &&
    state.day >= action.minDay &&
    (action.maxDay === undefined || state.day <= action.maxDay) &&
    !state.completedActions.includes(action.id) &&
    includesAll(state.evidence, action.requiresEvidence) &&
    includesAll(state.flags, action.requiresFlags)
  );
}

/** Applies one authored investigation action to immutable run state. */
export function performAction(
  state: RunState,
  actionId: string,
  actions: readonly InvestigationAction[],
): CommandResult {
  const action = actions.find((candidate) => candidate.id === actionId);
  if (!action) return { ok: false, state, message: "未知调查行动。" };
  if (!canPerformAction(state, action)) {
    return { ok: false, state, message: "行动尚未满足条件，已经完成，或今天没有余下时间。" };
  }

  const evidence = [...new Set([...state.evidence, ...(action.evidence ?? [])])];
  const flags = [...new Set([...state.flags, ...(action.flags ?? [])])];
  const shadowUses = Math.max(
    0,
    state.shadowUses + (action.shadowCost ?? 0) - (action.shadowRecovery ?? 0),
  );
  return {
    ok: true,
    message: action.result,
    state: {
      ...state,
      actionsLeft: state.actionsLeft - 1,
      shadowUses,
      evidence,
      flags,
      completedActions: [...state.completedActions, action.id],
      journal: [...state.journal, `第 ${state.day} 日｜${action.label}：${action.result}`],
    },
  };
}

/** Ends the current day and restores the next day's action allowance. */
export function advanceDay(state: RunState): CommandResult {
  if (state.ending !== null) return { ok: false, state, message: "本周目已经结束。" };
  if (state.day >= FINAL_DAY) return { ok: false, state, message: "第七日不能再拖延。" };
  const report = DAY_END_REPORTS[state.day] ?? "这一夜没有新的报告。";
  return {
    ok: true,
    message: report,
    state: {
      ...state,
      day: state.day + 1,
      actionsLeft: ACTIONS_PER_DAY,
      journal: [...state.journal, `第 ${state.day} 日结束：${report}`],
    },
  };
}

/** Compares one proposed killing rule with the evidence gathered this run. */
export function testHypothesis(state: RunState, hypothesis: HypothesisId): HypothesisResult {
  if (hypothesis !== "identity-mismatch") {
    return {
      ok: true,
      outcome: "rejected",
      state,
      message: "这个假设无法同时解释门牌变化、住户记忆与熄灯后的替换。",
    };
  }
  if (!includesAll(state.evidence, RULE_EVIDENCE)) {
    return {
      ok: true,
      outcome: "incomplete",
      state,
      message: "方向接近，但证据链不完整。现在进入现场仍可能把表象当成规律。",
    };
  }
  return {
    ok: true,
    outcome: "confirmed",
    message:
      "规律确认：敲门完成登记，午夜门牌重新分配；身份与房间不匹配者会在熄灯后被替换。",
    state: {
      ...state,
      confirmedHypothesis: hypothesis,
      flags: [...new Set([...state.flags, "rule-confirmed"])],
      journal: [...state.journal, "规律确认：住户身份与门牌不匹配会触发替换。"],
    },
  };
}

/** Resolves the final attempt to control the Doorplate Ghost. */
export function attemptControl(state: RunState): CommandResult {
  if (state.day < FINAL_DAY) {
    return { ok: false, state, message: "驾驭窗口尚未出现。" };
  }

  let ending: EndingId;
  let message: string;
  if (state.shadowUses >= 7) {
    ending = "shadow-taken";
    message =
      "你沿影路抵达源头，却发现鬼影已经先一步站在空白门牌前。它报出你的姓名。门牌鬼没有进入身体——你的影子替你成为了新的住户。";
  } else if (
    state.confirmedHypothesis !== "identity-mismatch" ||
    !includesAll(state.flags, CONTROL_FLAGS)
  ) {
    ending = "unregistered";
    message =
      "零点后，居民楼开始重新分配身份。你没有同时准备住户身份、旧门牌锚点与影路，空白门牌最终写下了你的名字。封锁记录将你列为第八名失踪者。";
  } else {
    ending = "controlled";
    message =
      "你让鬼影穿过旧门牌，把自己错误登记进源头房间。两种灵异在身体里争夺同一个身份：鬼影无法离开，门牌鬼无法完成分配。天亮时，你从不存在的 204 走出，体内形成了新的脆弱平衡。";
  }
  return {
    ok: true,
    message,
    state: {
      ...state,
      ending,
      journal: [...state.journal, `结局：${message}`],
    },
  };
}

/** Produces qualitative body signs without exposing the hidden instability value. */
export function getShadowSymptom(shadowUses: number): {
  stage: "quiet" | "cold" | "detached" | "critical" | "lost";
  title: string;
  description: string;
} {
  if (shadowUses === 0) {
    return { stage: "quiet", title: "暂未发现异常", description: "影子与动作完全重合，掌心仍有温度。" };
  }
  if (shadowUses <= 2) {
    return { stage: "cold", title: "末梢失温", description: "指尖温度下降。收回的鬼影比你的动作慢了半拍。" };
  }
  if (shadowUses <= 4) {
    return { stage: "detached", title: "动作分离", description: "左臂出现淡灰尸斑。你已经停下，影子仍保持窥视姿势。" };
  }
  if (shadowUses <= 6) {
    return { stage: "critical", title: "出现第二影像", description: "灯下出现两个你的影子。较远的那个总会先一步转向。" };
  }
  return { stage: "lost", title: "影子拒绝归位", description: "不论光源在哪，影子都面朝槐荫里 7 栋。它开始替你回应姓名。" };
}

/** Merges a finished run into permanent archive progress. */
export function archiveRun(archive: ArchiveState, run: RunState): ArchiveState {
  const abilities =
    run.ending === "controlled"
      ? [...new Set([...archive.abilities, "doorplate-mark"])]
      : archive.abilities;
  return {
    runCount: archive.runCount,
    evidence: [...new Set([...archive.evidence, ...run.evidence])],
    endings: run.ending ? [...new Set([...archive.endings, run.ending])] : archive.endings,
    abilities,
  };
}
