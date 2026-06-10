export type Lamports = string;
export type PubkeyString = string;

export type LaunchState = "active" | "graduated" | "failed" | "settled";
export type MarketResult = "YES" | "NO";
export type MarketSide = "YES" | "NO";
export type TradeAction = "BUY" | "SELL";

export type ReflexFeeSplit = {
  creatorFeeBps: number;
  protocolFeeBps: number;
  reserveFeeBps: number;
};

export type MarketSummary = {
  launchPubkey: PubkeyString;
  marketPubkey: PubkeyString;
  name: string;
  ticker: string;
  imageUrl: string;
  probabilityBps: number;
  bondedSol: number;
  targetSol: number;
  expiryTs: string;
  state: LaunchState;
  volumeSol24h: number;
};

export type MarketListResponse = {
  markets: MarketSummary[];
  nextCursor: string | null;
};

export type MarketDetailResponse = {
  launch: {
    pubkey: PubkeyString;
    creator: PubkeyString;
    tokenMint: PubkeyString;
    name: string;
    ticker: string;
    description: string;
    imageUrl: string;
    bondedSol: number;
    targetSol: number;
    expiryTs: string;
    state: LaunchState;
  };
  market: {
    pubkey: PubkeyString;
    probabilityBps: number;
    yesPool: Lamports;
    noPool: Lamports;
    settled: boolean;
    result: MarketResult | null;
  };
  reflex: ReflexFeeSplit;
  stats: {
    volumeSol24h: number;
    holders: number;
    trades: number;
  };
};

export type GetMarketsQuery = {
  state?: LaunchState;
  sort?: "trending" | "endingSoon" | "highestProbability" | "newest";
  limit?: number;
  cursor?: string;
};

export type CreateLaunchRequest = {
  creator: PubkeyString;
  name: string;
  ticker: string;
  description: string;
  imageUrl: string;
};

export type CreateLaunchResponse = {
  transactionBase64: string;
  launchPubkey: PubkeyString;
  marketPubkey: PubkeyString;
};

export type TradeMarketRequest = {
  wallet: PubkeyString;
  marketPubkey: PubkeyString;
  side: MarketSide;
  action: TradeAction;
  amountLamports: Lamports;
  slippageBps: number;
};

export type TradeMarketResponse = {
  transactionBase64: string;
  quote: {
    probabilityBeforeBps: number;
    probabilityAfterBps: number;
    estimatedShares: Lamports;
    maxCostLamports: Lamports;
  };
};

export type SettleRequest = {
  wallet: PubkeyString;
  launchPubkey: PubkeyString;
};

export type SettleResponse = {
  transactionBase64: string;
};

export type ClaimRequest = {
  wallet: PubkeyString;
  marketPubkey: PubkeyString;
};

export type ClaimResponse = {
  transactionBase64: string;
  claimableLamports: Lamports;
};

