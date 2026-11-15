import { feeSplitForProbability } from "@reflexive/sdk";
import type {
  LaunchState,
  MarketDetailResponse,
  MarketSide,
  MarketSummary,
  MarketTrade,
  ProbabilityPoint
} from "@reflexive/types";

/**
 * Demo read model served until the indexer writes real launches.
 * Times are stored as offsets from "now" so the set never goes stale while the API runs.
 * Every value is deterministic per market so pages render identically across reloads.
 */

const HOUR_MS = 3_600_000;
const LAUNCH_WINDOW_HOURS = 72;
const TARGET_SOL = 85;
const HISTORY_POINTS = 64;

type DemoSeed = {
  slug: string;
  name: string;
  ticker: string;
  description: string;
  probabilityBps: number;
  bondedSol: number;
  ageHours: number;
  state: LaunchState;
  volumeSol24h: number;
  holders: number;
  trades: number;
};

const SEEDS: DemoSeed[] = [
  {
    slug: "eighty",
    name: "Eighty Five",
    ticker: "EIGHTY",
    description: "Named after the graduation line. Either a prophecy or a punchline.",
    probabilityBps: 8_240,
    bondedSol: 71.6,
    ageHours: 69,
    state: "active",
    volumeSol24h: 208.9,
    holders: 1_412,
    trades: 6_204
  },
  {
    slug: "dline",
    name: "Deadline Cat",
    ticker: "DLINE",
    description: "A cat that only moves when the clock is about to run out.",
    probabilityBps: 6_180,
    bondedSol: 38.2,
    ageHours: 64,
    state: "active",
    volumeSol24h: 126.4,
    holders: 903,
    trades: 3_871
  },
  {
    slug: "lens",
    name: "Lens",
    ticker: "LENS",
    description: "Two outcomes, one overlap. The overlap is where the price lives.",
    probabilityBps: 4_710,
    bondedSol: 29.4,
    ageHours: 31,
    state: "active",
    volumeSol24h: 94.2,
    holders: 618,
    trades: 2_140
  },
  {
    slug: "tide",
    name: "Low Tide",
    ticker: "TIDE",
    description: "Slow accumulation, no influencers, no roadmap. Just bonding.",
    probabilityBps: 3_350,
    bondedSol: 18.9,
    ageHours: 40,
    state: "active",
    volumeSol24h: 41.7,
    holders: 377,
    trades: 1_092
  },
  {
    slug: "orbit",
    name: "Second Orbit",
    ticker: "ORBIT",
    description: "Relaunch of a token that missed by two SOL. Revenge arc.",
    probabilityBps: 5_520,
    bondedSol: 12.1,
    ageHours: 6,
    state: "active",
    volumeSol24h: 63.8,
    holders: 241,
    trades: 806
  },
  {
    slug: "moth",
    name: "Moth",
    ticker: "MOTH",
    description: "Attracted to anything glowing. Currently: this market.",
    probabilityBps: 1_840,
    bondedSol: 9.6,
    ageHours: 58,
    state: "active",
    volumeSol24h: 22.3,
    holders: 164,
    trades: 517
  },
  {
    slug: "glass",
    name: "Glasshouse",
    ticker: "GLASS",
    description: "Graduated with nine hours to spare. YES holders claimed.",
    probabilityBps: 10_000,
    bondedSol: 85,
    ageHours: 80,
    state: "graduated",
    volumeSol24h: 12.4,
    holders: 2_087,
    trades: 9_311
  },
  {
    slug: "fog",
    name: "Morning Fog",
    ticker: "FOG",
    description: "Burned off before noon. Expired at 51 SOL; NO settled.",
    probabilityBps: 0,
    bondedSol: 51.3,
    ageHours: 90,
    state: "failed",
    volumeSol24h: 3.1,
    holders: 702,
    trades: 2_455
  }
];

function seededRandom(seedText: string): () => number {
  let seed = 2_166_136_261;
  for (const char of seedText) {
    seed = Math.imul(seed ^ char.charCodeAt(0), 16_777_619);
  }

  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296;
  };
}

const BASE58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

function fakeAddress(random: () => number, length = 44): string {
  let out = "";
  for (let i = 0; i < length; i += 1) {
    out += BASE58[Math.floor(random() * BASE58.length)];
  }
  return out;
}

const logit = (p: number) => Math.log(p / (1 - p));
const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));
const clampUnit = (p: number) => Math.min(0.995, Math.max(0.005, p));

/** Brownian bridge in logit space from 50% at launch to the seed's current probability. */
function buildHistory(seed: DemoSeed, launchMs: number, endMs: number): ProbabilityPoint[] {
  const random = seededRandom(`${seed.slug}:history`);
  const start = logit(0.5);
  const end = logit(clampUnit(seed.probabilityBps / 10_000));
  const steps = HISTORY_POINTS - 1;

  const walk = [0];
  for (let i = 1; i <= steps; i += 1) {
    walk.push((walk[i - 1] ?? 0) + (random() - 0.5) * 0.55);
  }
  const walkEnd = walk[steps] ?? 0;

  return walk.map((w, i) => {
    const t = i / steps;
    const x = start + (end - start) * t + (w - t * walkEnd);
    const probabilityBps = i === steps ? seed.probabilityBps : Math.round(clampUnit(sigmoid(x)) * 10_000);
    return {
      ts: new Date(launchMs + (endMs - launchMs) * t).toISOString(),
      probabilityBps
    };
  });
}

function buildTrades(seed: DemoSeed, history: ProbabilityPoint[]): MarketTrade[] {
  const random = seededRandom(`${seed.slug}:trades`);
  const trades: MarketTrade[] = [];

  for (let i = 0; i < 14; i += 1) {
    const point = history[history.length - 1 - i];
    const previous = history[history.length - 2 - i];
    if (!point || !previous) break;

    const rising = point.probabilityBps >= previous.probabilityBps;
    const side: MarketSide = rising === random() > 0.2 ? "YES" : "NO";
    const action = random() > 0.82 ? "SELL" : "BUY";

    trades.push({
      signature: fakeAddress(random, 88),
      wallet: fakeAddress(random),
      side,
      action,
      amountSol: Math.round((0.1 + random() ** 2 * 14) * 100) / 100,
      probabilityAfterBps: point.probabilityBps,
      ts: point.ts
    });
  }

  return trades;
}

function timing(seed: DemoSeed, nowMs: number) {
  const launchMs = nowMs - seed.ageHours * HOUR_MS;
  const expiryMs = launchMs + LAUNCH_WINDOW_HOURS * HOUR_MS;
  // Ended markets stop moving at settlement; graduation can happen before expiry.
  const endMs =
    seed.state === "graduated" ? expiryMs - 9 * HOUR_MS : Math.min(nowMs, expiryMs);
  return { launchMs, expiryMs, endMs };
}

function toSummary(seed: DemoSeed, nowMs: number): MarketSummary {
  const { expiryMs } = timing(seed, nowMs);
  return {
    launchPubkey: `launch_${seed.slug}`,
    marketPubkey: `market_${seed.slug}`,
    name: seed.name,
    ticker: seed.ticker,
    imageUrl: "",
    probabilityBps: seed.probabilityBps,
    bondedSol: seed.bondedSol,
    targetSol: TARGET_SOL,
    expiryTs: new Date(expiryMs).toISOString(),
    state: seed.state,
    volumeSol24h: seed.volumeSol24h
  };
}

export function listDemoMarkets(nowMs = Date.now()): MarketSummary[] {
  return SEEDS.map((seed) => toSummary(seed, nowMs));
}

export function getDemoMarket(marketPubkey: string, nowMs = Date.now()): MarketDetailResponse | null {
  const seed = SEEDS.find((candidate) => `market_${candidate.slug}` === marketPubkey);
  if (!seed) return null;

  const random = seededRandom(`${seed.slug}:accounts`);
  const { launchMs, expiryMs, endMs } = timing(seed, nowMs);
  const history = buildHistory(seed, launchMs, endMs);
  const settled = seed.state === "graduated" || seed.state === "failed";

  // Pool depth scales with activity; the split reproduces the displayed probability.
  const totalPoolLamports = BigInt(Math.round(seed.volumeSol24h * 4 + 40)) * 1_000_000_000n;
  const yesPool = (totalPoolLamports * BigInt(seed.probabilityBps)) / 10_000n;

  return {
    launch: {
      pubkey: `launch_${seed.slug}`,
      creator: fakeAddress(random),
      tokenMint: fakeAddress(random),
      name: seed.name,
      ticker: seed.ticker,
      description: seed.description,
      imageUrl: "",
      bondedSol: seed.bondedSol,
      targetSol: TARGET_SOL,
      expiryTs: new Date(expiryMs).toISOString(),
      state: seed.state
    },
    market: {
      pubkey: `market_${seed.slug}`,
      probabilityBps: seed.probabilityBps,
      yesPool: yesPool.toString(),
      noPool: (totalPoolLamports - yesPool).toString(),
      settled,
      result: seed.state === "graduated" ? "YES" : seed.state === "failed" ? "NO" : null
    },
    reflex: feeSplitForProbability(seed.probabilityBps),
    stats: {
      volumeSol24h: seed.volumeSol24h,
      holders: seed.holders,
      trades: seed.trades
    },
    history,
    recentTrades: buildTrades(seed, history)
  };
}
