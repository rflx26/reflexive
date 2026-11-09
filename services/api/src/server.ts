import cors from "@fastify/cors";
import Fastify from "fastify";
import { quoteMarketTrade } from "@reflexive/sdk";
import type {
  CreateLaunchRequest,
  GetMarketsQuery,
  MarketDetailResponse,
  MarketListResponse,
  TradeMarketRequest
} from "@reflexive/types";

const app = Fastify({ logger: true });

await app.register(cors, {
  origin: true
});

app.get("/health", async () => ({ ok: true }));

app.get<{ Querystring: GetMarketsQuery }>("/markets", async () => {
  const response: MarketListResponse = {
    markets: [],
    nextCursor: null
  };

  return response;
});

app.get<{ Params: { marketPubkey: string } }>("/markets/:marketPubkey", async (request) => {
  const response: MarketDetailResponse = {
    launch: {
      pubkey: "launch_pending",
      creator: "creator_pending",
      tokenMint: "mint_pending",
      name: "Pending Launch",
      ticker: "PEND",
      description: "Indexed market detail will replace this placeholder.",
      imageUrl: "/placeholder-token.svg",
      bondedSol: 0,
      targetSol: 85,
      expiryTs: new Date().toISOString(),
      state: "active"
    },
    market: {
      pubkey: request.params.marketPubkey,
      probabilityBps: 5_000,
      yesPool: "0",
      noPool: "0",
      settled: false,
      result: null
    },
    reflex: {
      creatorFeeBps: 2_500,
      protocolFeeBps: 5_000,
      reserveFeeBps: 2_500
    },
    stats: {
      volumeSol24h: 0,
      holders: 0,
      trades: 0
    }
  };

  return response;
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

