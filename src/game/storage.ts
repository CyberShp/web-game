import type { ArchiveState, EndingId, HypothesisId, RunState } from "./model";

/** Current on-disk schema version for both run and permanent archive data. */
export const SAVE_VERSION = 2;

const RUN_KEY = "revival-archive.current-run.v1";
const ARCHIVE_KEY = "revival-archive.permanent.v1";
const ENDINGS: readonly EndingId[] = ["controlled", "unregistered", "shadow-taken"];
const HYPOTHESES: readonly HypothesisId[] = ["knock-kills", "identity-mismatch", "shadow-marks"];

interface SaveEnvelope<T> {
  version: number;
  value: T;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === "string");
}

function isRunState(value: unknown): value is RunState {
  if (!value || typeof value !== "object") return false;
  const run = value as Partial<RunState>;
  return (
    typeof run.day === "number" &&
    run.day >= 1 &&
    run.day <= 7 &&
    typeof run.actionsLeft === "number" &&
    run.actionsLeft >= 0 &&
    run.actionsLeft <= 3 &&
    typeof run.shadowUses === "number" &&
    isStringArray(run.evidence) &&
    isStringArray(run.flags) &&
    isStringArray(run.completedActions) &&
    isStringArray(run.journal) &&
    (run.confirmedHypothesis === null ||
      (typeof run.confirmedHypothesis === "string" &&
        HYPOTHESES.includes(run.confirmedHypothesis as HypothesisId))) &&
    (run.ending === null ||
      (typeof run.ending === "string" && ENDINGS.includes(run.ending as EndingId)))
  );
}

function isArchiveState(value: unknown): value is ArchiveState {
  if (!value || typeof value !== "object") return false;
  const archive = value as Partial<ArchiveState>;
  return (
    typeof archive.runCount === "number" &&
    archive.runCount >= 1 &&
    isStringArray(archive.evidence) &&
    isStringArray(archive.abilities) &&
    Array.isArray(archive.endings) &&
    archive.endings.every((ending) => ENDINGS.includes(ending))
  );
}

function parseEnvelope(raw: string): SaveEnvelope<unknown> | null {
  try {
    const parsed = JSON.parse(raw) as Partial<SaveEnvelope<unknown>>;
    if ((parsed.version !== 1 && parsed.version !== SAVE_VERSION) || !("value" in parsed)) return null;
    return parsed as SaveEnvelope<unknown>;
  } catch {
    return null;
  }
}

/** Parses and validates current-run data without throwing. */
export function parseRun(raw: string): RunState | null {
  const envelope = parseEnvelope(raw);
  return envelope && isRunState(envelope.value) ? envelope.value : null;
}

/** Parses and validates permanent archive data without throwing. */
export function parseArchive(raw: string): ArchiveState | null {
  const envelope = parseEnvelope(raw);
  if (!envelope) return null;
  if (envelope.version === 1 && envelope.value && typeof envelope.value === "object") {
    const legacy = envelope.value as Omit<ArchiveState, "abilities">;
    const migrated = { ...legacy, abilities: [] };
    return isArchiveState(migrated) ? migrated : null;
  }
  return isArchiveState(envelope.value) ? envelope.value : null;
}

/** Loads the current run from browser storage. */
export function loadRun(storage: Storage): RunState | null {
  const raw = storage.getItem(RUN_KEY);
  return raw ? parseRun(raw) : null;
}

/** Loads the permanent archive from browser storage. */
export function loadArchive(storage: Storage): ArchiveState | null {
  const raw = storage.getItem(ARCHIVE_KEY);
  return raw ? parseArchive(raw) : null;
}

/** Writes validated current-run state to browser storage. */
export function saveRun(storage: Storage, run: RunState): void {
  storage.setItem(RUN_KEY, JSON.stringify({ version: SAVE_VERSION, value: run }));
}

/** Writes permanent archive state to browser storage. */
export function saveArchive(storage: Storage, archive: ArchiveState): void {
  storage.setItem(ARCHIVE_KEY, JSON.stringify({ version: SAVE_VERSION, value: archive }));
}

/** Removes only the current attempt while preserving permanent discoveries. */
export function clearRun(storage: Storage): void {
  storage.removeItem(RUN_KEY);
}

/** Removes all local game progress. */
export function clearAllProgress(storage: Storage): void {
  storage.removeItem(RUN_KEY);
  storage.removeItem(ARCHIVE_KEY);
}
