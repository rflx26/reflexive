export const BASIS_POINTS = 10_000;
export const MIN_DISPLAY_PROBABILITY_BPS = 100;
export const MAX_DISPLAY_PROBABILITY_BPS = 9_900;

export type MarketMathState = {
  yesPool: bigint;
  noPool: bigint;
  liquidityB: bigint;
};

export type MarketQuote = {
  probabilityBeforeBps: number;
  probabilityAfterBps: number;
  estimatedShares: bigint;
  maxCostLamports: bigint;
};

export function clampProbabilityBps(probabilityBps: number): number {
  if (!Number.isFinite(probabilityBps)) {
    throw new Error("Probability must be finite");
  }

  return Math.min(
    MAX_DISPLAY_PROBABILITY_BPS,
    Math.max(MIN_DISPLAY_PROBABILITY_BPS, Math.round(probabilityBps))
  );
}

export function probabilityFromPoolsBps(state: MarketMathState): number {
  const total = state.yesPool + state.noPool;

  if (total <= 0n) {
    return 5_000;
  }

  return clampProbabilityBps(Number((state.yesPool * 10_000n) / total));
}

export function quoteMarketTrade(
  state: MarketMathState,
  side: "YES" | "NO",
  action: "BUY" | "SELL",
  amountLamports: bigint
): MarketQuote {
  if (amountLamports <= 0n) {
    throw new Error("Trade amount must be positive");
  }

  const probabilityBeforeBps = probabilityFromPoolsBps(state);
  const signedDelta = action === "BUY" ? amountLamports : -amountLamports;
  const yesPool = side === "YES" ? state.yesPool + signedDelta : state.yesPool;
  const noPool = side === "NO" ? state.noPool + signedDelta : state.noPool;

  if (yesPool < 0n || noPool < 0n) {
    throw new Error("Trade would overdraw market side");
  }

  return {
    probabilityBeforeBps,
    probabilityAfterBps: probabilityFromPoolsBps({ ...state, yesPool, noPool }),
    estimatedShares: amountLamports,
    maxCostLamports: amountLamports
  };
}

