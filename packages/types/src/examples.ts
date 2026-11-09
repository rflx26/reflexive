import type { MarketDetailResponse } from "./index.js";

/**
 * Example launch object backed by a real pump.fun contract address.
 * Only `tokenMint` is real; the remaining fields are illustrative.
 */
export const exampleLaunch: MarketDetailResponse["launch"] = {
  pubkey: "launch_example_7hWRhP",
  creator: "creator_example",
  tokenMint: "7hWRhPABAy2mBaJiLaRgxdF5kDTVMt3XC3iK3Nowpump",
  name: "REFLEXIVE",
  ticker: "RFLX",
  description: "launchpad with visible, tradable graduation probabilities that change each token's economics in bounded, deterministic ways. may lose everything.",
  imageUrl: "/placeholder-token.svg",
  bondedSol: 42.5,
  targetSol: 85,
  expiryTs: "2026-11-10T00:00:00.000Z",
  state: "active"
};
