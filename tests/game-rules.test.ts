import { describe, expect, it } from "vitest";

import { ACTIONS } from "../src/content/actions";
import {
  advanceDay,
  archiveRun,
  attemptControl,
  createNewArchive,
  createNewRun,
  performAction,
  testHypothesis,
} from "../src/game/rules";

describe("seven-day run rules", () => {
  it("starts on day one with three actions and no exposed resurrection number", () => {
    const run = createNewRun();

    expect(run.day).toBe(1);
    expect(run.actionsLeft).toBe(3);
    expect(run.shadowUses).toBe(0);
    expect(JSON.stringify(run)).not.toContain("percent");
  });

  it("spends one action, grants evidence once, and applies shadow cost", () => {
    const run = createNewRun();
    const result = performAction(run, "inspect-lobby", ACTIONS);
    const repeated = performAction(result.state, "inspect-lobby", ACTIONS);

    expect(result.ok).toBe(true);
    expect(result.state.actionsLeft).toBe(2);
    expect(result.state.evidence).toContain("ev-scratched-plates");
    expect(result.state.shadowUses).toBe(1);
    expect(repeated.ok).toBe(false);
    expect(repeated.state).toEqual(result.state);
  });

  it("does not reveal actions before their day or requirements", () => {
    const run = createNewRun();
    const result = performAction(run, "probe-room-201", ACTIONS);

    expect(result.ok).toBe(false);
    expect(result.message).toContain("尚未满足");
  });

  it("advances the day and restores three actions", () => {
    const run = { ...createNewRun(), actionsLeft: 0 };
    const result = advanceDay(run);

    expect(result.ok).toBe(true);
    expect(result.state.day).toBe(2);
    expect(result.state.actionsLeft).toBe(3);
  });

  it("treats a correct direction as incomplete until all key evidence exists", () => {
    const run = {
      ...createNewRun(),
      evidence: ["ev-scratched-plates", "ev-false-resident"],
    };
    const result = testHypothesis(run, "identity-mismatch");

    expect(result.outcome).toBe("incomplete");
    expect(result.state.confirmedHypothesis).toBeNull();
  });

  it("confirms the rule only from the complete evidence chain", () => {
    const run = {
      ...createNewRun(),
      evidence: [
        "ev-scratched-plates",
        "ev-false-resident",
        "ev-blackout-replacement",
      ],
    };
    const result = testHypothesis(run, "identity-mismatch");

    expect(result.outcome).toBe("confirmed");
    expect(result.state.confirmedHypothesis).toBe("identity-mismatch");
  });

  it("requires the confirmed rule and ritual preparations for the control ending", () => {
    const unprepared = { ...createNewRun(), day: 7 as const };
    const failed = attemptControl(unprepared);
    const prepared = {
      ...unprepared,
      confirmedHypothesis: "identity-mismatch" as const,
      flags: ["temporary-resident", "plate-anchor", "shadow-route"],
      evidence: [
        "ev-scratched-plates",
        "ev-false-resident",
        "ev-blackout-replacement",
      ],
      shadowUses: 5,
    };
    const succeeded = attemptControl(prepared);

    expect(failed.state.ending).toBe("unregistered");
    expect(succeeded.state.ending).toBe("controlled");
  });

  it("lets excessive shadow use override an otherwise valid plan", () => {
    const run = {
      ...createNewRun(),
      day: 7 as const,
      confirmedHypothesis: "identity-mismatch" as const,
      flags: ["temporary-resident", "plate-anchor", "shadow-route"],
      evidence: [
        "ev-scratched-plates",
        "ev-false-resident",
        "ev-blackout-replacement",
      ],
      shadowUses: 8,
    };

    expect(attemptControl(run).state.ending).toBe("shadow-taken");
  });

  it("unlocks the Doorplate Mark only after the successful control ending", () => {
    const archive = createNewArchive();
    const failed = archiveRun(archive, { ...createNewRun(), ending: "unregistered" });
    const succeeded = archiveRun(archive, { ...createNewRun(), ending: "controlled" });

    expect(failed.abilities).toEqual([]);
    expect(succeeded.abilities).toContain("doorplate-mark");
  });

  it("keeps the authored success route reachable from day one through day seven", () => {
    const routeByDay = [
      ["read-case-file", "inspect-lobby", "question-caretaker"],
      ["compare-register", "probe-room-201", "call-resident-xu"],
      ["inspect-room-202", "watch-blackout", "reconstruct-nail-marks"],
      ["answer-third-knock", "recover-old-plate", "map-shadow-route"],
      ["rescue-xu", "trace-building-origin", "stabilize-shadow"],
      ["seal-stairwell", "brief-headquarters"],
    ];

    let state = createNewRun();
    for (const [dayIndex, route] of routeByDay.entries()) {
      if (dayIndex === 3) {
        const hypothesis = testHypothesis(state, "identity-mismatch");
        expect(hypothesis.outcome).toBe("confirmed");
        state = hypothesis.state;
      }
      for (const actionId of route ?? []) {
        const action = performAction(state, actionId, ACTIONS);
        expect(action.ok, `day ${dayIndex + 1}: ${actionId}`).toBe(true);
        state = action.state;
      }
      const nextDay = advanceDay(state);
      expect(nextDay.ok).toBe(true);
      state = nextDay.state;
    }

    expect(state.day).toBe(7);
    expect(state.shadowUses).toBe(5);
    expect(attemptControl(state).state.ending).toBe("controlled");
  });
});
