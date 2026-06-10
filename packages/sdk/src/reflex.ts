import type { ReflexFeeSplit } from "@reflexive/types";

export const REFLEX_FEE_BANDS: ReadonlyArray<{
  minProbabilityBps: number;
  maxProbabilityBps: number;
  split: ReflexFeeSplit;
}> = [
  {
    minProbabilityBps: 0,
    maxProbabilityBps: 3_000,
    split: { creatorFeeBps: 1_000, protocolFeeBps: 7_000, reserveFeeBps: 2_000 }
  },
  {
    minProbabilityBps: 3_000,
    maxProbabilityBps: 7_000,
    split: { creatorFeeBps: 2_500, protocolFeeBps: 5_000, reserveFeeBps: 2_500 }
  },
  {
    minProbabilityBps: 7_000,
    maxProbabilityBps: 10_000,
    split: { creatorFeeBps: 3_000, protocolFeeBps: 4_500, reserveFeeBps: 2_500 }
  }
];

export function feeSplitForProbability(probabilityBps: number): ReflexFeeSplit {
  const band = REFLEX_FEE_BANDS.find(
    (candidate) =>
      probabilityBps >= candidate.minProbabilityBps &&
      probabilityBps <= candidate.maxProbabilityBps
  );

  if (!band) {
    throw new Error("Probability outside reflex fee band range");
  }

  return band.split;
}

export function assertFeeSplit(split: ReflexFeeSplit): void {
  const total = split.creatorFeeBps + split.protocolFeeBps + split.reserveFeeBps;

  if (total !== 10_000) {
    throw new Error(`Fee split must sum to 10000 bps, received ${total}`);
  }
}

