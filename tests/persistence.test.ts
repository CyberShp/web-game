import { describe, expect, it } from "vitest";

import { createNewArchive, createNewRun } from "../src/game/rules";
import { parseArchive, parseRun, SAVE_VERSION } from "../src/game/storage";

describe("versioned persistence", () => {
  it("round-trips valid run data", () => {
    const run = { ...createNewRun(), day: 3 as const, actionsLeft: 1 };
    const parsed = parseRun(JSON.stringify({ version: SAVE_VERSION, value: run }));

    expect(parsed).toEqual(run);
  });

  it("rejects malformed run data instead of leaking it into gameplay", () => {
    expect(parseRun("not-json")).toBeNull();
    expect(parseRun(JSON.stringify({ version: 999, value: {} }))).toBeNull();
  });

  it("keeps permanent archive separate from current run", () => {
    const archive = { ...createNewArchive(), runCount: 2, evidence: ["ev-a"] };
    const parsed = parseArchive(
      JSON.stringify({ version: SAVE_VERSION, value: archive }),
    );

    expect(parsed?.runCount).toBe(2);
    expect(createNewRun().evidence).toEqual([]);
  });

  it("migrates version one archives with an empty ability list", () => {
    const legacy = { runCount: 3, evidence: ["ev-a"], endings: ["controlled"] };
    const parsed = parseArchive(JSON.stringify({ version: 1, value: legacy }));

    expect(parsed).toEqual({ ...legacy, abilities: [] });
  });
});
