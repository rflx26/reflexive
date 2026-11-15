import cors from "@fastify/cors";
import Fastify from "fastify";
import { quoteMarketTrade } from "@reflexive/sdk";
import type {
  CreateLaunchRequest,
  GetMarketsQuery,
  MarketListResponse,
  MarketSummary,
  TradeMarketRequest
} from "@reflexive/types";
import { getDemoMarket, listDemoMarkets } from "./demo-markets.js";

const app = Fastify({ logger: true });

await app.register(cors, {
  origin: true
});

app.get("/health", async () => ({ ok: true }));

const MARKET_SORTS = ["trending", "endingSoon", "highestProbability", "newest"] as const;
const LAUNCH_STATES = ["active", "graduated", "failed", "settled"] as const;

app.get<{ Querystring: Record<string, string | undefined> }>("/markets", async (request, reply) => {
  const { state, sort = "trending", limit = "24" } = request.query;

  if (state !== undefined && !(LAUNCH_STATES as readonly string[]).includes(state)) {
    return reply.code(400).send({ error: `state must be one of ${LAUNCH_STATES.join(", ")}` });
  }
  if (!(MARKET_SORTS as readonly string[]).includes(sort)) {
    return reply.code(400).send({ error: `sort must be one of ${MARKET_SORTS.join(", ")}` });
  }
  const parsedLimit = Number(limit);
  if (!Number.isInteger(parsedLimit) || parsedLimit < 1 || parsedLimit > 100) {
    return reply.code(400).send({ error: "limit must be an integer between 1 and 100" });
  }

  const nowMs = Date.now();
  let markets = listDemoMarkets(nowMs);
  if (state) {
    markets = markets.filter((market) => market.state === state);
  }

  const expiry = (ts: string) => new Date(ts).getTime();
  const byActiveFirst = (a: MarketSummary, b: MarketSummary) =>
    Number(b.state === "active") - Number(a.state === "active");
  const comparators: Record<NonNullable<GetMarketsQuery["sort"]>, (a: MarketSummary, b: MarketSummary) => number> = {
    trending: (a, b) => byActiveFirst(a, b) || b.volumeSol24h - a.volumeSol24h,
    endingSoon: (a, b) => byActiveFirst(a, b) || expiry(a.expiryTs) - expiry(b.expiryTs),
    highestProbability: (a, b) => byActiveFirst(a, b) || b.probabilityBps - a.probabilityBps,
    newest: (a, b) => expiry(b.expiryTs) - expiry(a.expiryTs)
  };
  markets.sort(comparators[sort as NonNullable<GetMarketsQuery["sort"]>]);

  const response: MarketListResponse = {
    markets: markets.slice(0, parsedLimit),
    nextCursor: null
  };

  return response;
});

app.get<{ Params: { marketPubkey: string } }>("/markets/:marketPubkey", async (request, reply) => {
  const market = getDemoMarket(request.params.marketPubkey);

  if (!market) {
    return reply.code(404).send({ error: "market not found" });
  }

  return market;
});

app.post<{ Body: CreateLaunchRequest }>("/tx/create-launch", async (request, reply) => {
  const ticker = request.body?.ticker;

  if (typeof ticker !== "string" || ticker.trim() === "") {
    return reply.code(400).send({ error: "ticker is required" });
  }

  const slug = ticker.trim().toLowerCase();
  return {
    transactionBase64: "",
    launchPubkey: `launch_${slug}`,
    marketPubkey: `market_${slug}`
  };
});

app.post<{ Body: TradeMarketRequest }>("/tx/trade-market", async (request, reply) => {
  const { side, action, amountLamports } = request.body ?? {};

  if ((side !== "YES" && side !== "NO") || (action !== "BUY" && action !== "SELL")) {
    return reply.code(400).send({ error: "side must be YES|NO and action must be BUY|SELL" });
  }

  if (typeof amountLamports !== "string" || !/^\d+$/.test(amountLamports)) {
    return reply.code(400).send({ error: "amountLamports must be a non-negative integer string" });
  }

  let quote: ReturnType<typeof quoteMarketTrade>;
  try {
    quote = quoteMarketTrade(
      {
        yesPool: 1_000_000_000n,
        noPool: 1_000_000_000n,
        liquidityB: 100_000_000n
      },
      side,
      action,
      BigInt(amountLamports)
    );
  } catch (error) {
    return reply.code(400).send({ error: (error as Error).message });
  }

  return {
    transactionBase64: "",
    quote: {
      probabilityBeforeBps: quote.probabilityBeforeBps,
      probabilityAfterBps: quote.probabilityAfterBps,
      estimatedShares: quote.estimatedShares.toString(),
      maxCostLamports: quote.maxCostLamports.toString()
    }
  };
});

app.post("/tx/settle", async () => ({ transactionBase64: "" }));

app.post("/tx/claim", async () => ({
  transactionBase64: "",
  claimableLamports: "0"
}));

const port = Number(process.env.PORT ?? 4000);
await app.listen({ host: "0.0.0.0", port });

