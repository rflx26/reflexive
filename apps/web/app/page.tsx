import type { MarketSummary } from "@reflexive/types";
import { ProbabilityMeter } from "./shared/probability-meter";

const markets: MarketSummary[] = [
  {
    launchPubkey: "launch_demo_1",
    marketPubkey: "market_demo_1",
    name: "Deadline Cat",
    ticker: "DLINE",
    imageUrl: "/placeholder-token.svg",
    probabilityBps: 6_180,
    bondedSol: 38.2,
    targetSol: 85,
    expiryTs: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
    state: "active",
    volumeSol24h: 126.4
  },
  {
    launchPubkey: "launch_demo_2",
    marketPubkey: "market_demo_2",
    name: "Eighty Five",
    ticker: "EIGHTY",
    imageUrl: "/placeholder-token.svg",
    probabilityBps: 8_240,
    bondedSol: 71.6,
    targetSol: 85,
    expiryTs: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
    state: "active",
    volumeSol24h: 208.9
  }
];

export default function HomePage() {
  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">Solana-native launch markets</p>
        <h1>Trade the probability a coin graduates.</h1>
        <p>
          Every launch has a token, a deadline, and a live YES/NO market on
          whether it reaches the graduation threshold.
        </p>
      </section>

      <section className="market-grid" aria-label="Active markets">
        {markets.map((market) => (
          <a className="market-card" href={`/markets/${market.marketPubkey}`} key={market.marketPubkey}>
            <div>
              <p className="ticker">{market.ticker}</p>
              <h2>{market.name}</h2>
            </div>
            <ProbabilityMeter probabilityBps={market.probabilityBps} />
            <dl className="stats">
              <div>
                <dt>Bonded</dt>
                <dd>
                  {market.bondedSol} / {market.targetSol} SOL
                </dd>
              </div>
              <div>
                <dt>24h Volume</dt>
                <dd>{market.volumeSol24h} SOL</dd>
              </div>
            </dl>
          </a>
        ))}
      </section>
    </main>
  );
}

