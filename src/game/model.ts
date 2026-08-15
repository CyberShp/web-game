/** Identifiers for the three rule hypotheses the player may test. */
export type HypothesisId = "knock-kills" | "identity-mismatch" | "shadow-marks";

/** Terminal outcomes for a seven-day run. */
export type EndingId = "controlled" | "unregistered" | "shadow-taken";

/** Broad interaction contexts used to present an investigation action. */
export type ActionMode = "archive" | "contact" | "field" | "recovery";

/** All mutable state that belongs to one seven-day attempt. */
export interface RunState {
  day: number;
  actionsLeft: number;
  shadowUses: number;
  evidence: string[];
  flags: string[];
  completedActions: string[];
  confirmedHypothesis: HypothesisId | null;
  ending: EndingId | null;
  journal: string[];
}

/** Progress that survives after a run is restarted. */
export interface ArchiveState {
  runCount: number;
  evidence: string[];
  endings: EndingId[];
  abilities: string[];
}

/** Authored content and deterministic rewards for one investigation action. */
export interface InvestigationAction {
  id: string;
  minDay: number;
  maxDay?: number;
  label: string;
  location: string;
  mode: ActionMode;
  teaser: string;
  result: string;
  evidence?: string[];
  flags?: string[];
  shadowCost?: number;
  shadowRecovery?: number;
  requiresEvidence?: string[];
  requiresFlags?: string[];
}

/** Result of a player command that can be accepted or rejected. */
export interface CommandResult {
  ok: boolean;
  state: RunState;
  message: string;
}

/** Result of comparing a proposed rule against the gathered evidence. */
export interface HypothesisResult extends CommandResult {
  outcome: "confirmed" | "incomplete" | "rejected";
}
