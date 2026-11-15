import type { GetMarketsQuery } from "@reflexive/types";
import type { Route } from "next";
import Link from "next/link";
import { api } from "./lib/api";
import { formatCount, formatSol } from "./lib/format";
import { MarketCard } from "./shared/market-card";

const SORTS: { value: NonNullable<GetMarketsQuery["sort"]>; label: string }[] = [
  { value: "trending", label: "Trending" },
  { value: "endingSoon", label: "Ending soon" },
  { value: "highestProbability", label: "Most likely" },
  { value: "newest", label: "New" }
];

export default async function HomePage({
  searchParams
}: {
  searchParams: Promise<{ sort?: string }>;
}) {
  const { sort: sortParam } = await searchParams;
  const sort = SORTS.find((option) => option.value === sortParam)?.value ?? "trending";

  const { markets } = await api.getMarkets({ sort, limit: 100 });
  const live = markets.filter((market) => market.state === "active");
  const ended = markets.filter((market) => market.state !== "active");
  const volume = markets.reduce((sum, market) => sum + market.volumeSol24h, 0);
  const graduated = ended.filter((market) => market.state === "graduated").length;

  return (
    <main className="page">
      <section className="hero">
        <div>
          <p className="eyebrow">Solana-native launch markets</p>
          <h1>
            Trade the probability a coin <em>graduates.</em>
          </h1>
          <p>
            Every launch has a token, a deadline, and a live YES/NO market on whether it reaches
            the graduation threshold. Settlement is read straight from chain state.
          </p>
          <dl className="hero-stats">
            <div>
              <dt>Live markets</dt>
              <dd className="num">{live.length}</dd>
            </div>
            <div>
              <dt>24h volume</dt>
              <dd className="num">
                {formatSol(volume, 0)} <small>SOL</small>
              </dd>
            </div>
            <div>
              <dt>Graduated</dt>
              <dd className="num">
                {formatCount(graduated)} <small>/ {ended.length} ended</small>
              </dd>
            </div>
          </dl>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="hero-mark" src="/logo.png" alt="" />
      </section>

      <div className="section-head">
        <h2>Live markets</h2>
        <nav className="tabs" aria-label="Sort markets">
          {SORTS.map((option) => (
            <Link
              key={option.value}
              href={(option.value === "trending" ? "/" : `/?sort=${option.value}`) as Route}
              aria-current={option.value === sort ? "page" : undefined}
              scroll={false}
            >
              {option.label}
            </Link>
          ))}
        </nav>
      </div>

      {live.length > 0 ? (
        <section className="market-grid" aria-label="Live markets">
          {live.map((market) => (
            <MarketCard key={market.marketPubkey} market={market} />
          ))}
        </section>
      ) : (
        <div className="empty glass">
          <p>No live markets right now.</p>
          <Link className="button" href="/launch">
            Launch a token
          </Link>
        </div>
      )}

      {ended.length > 0 && (
        <>
          <div className="section-head section-gap">
            <h2>Recently settled</h2>
          </div>
          <section className="market-grid" aria-label="Settled markets">
            {ended.map((market) => (
              <MarketCard key={market.marketPubkey} market={market} />
            ))}
          </section>
        </>
      )}

      <section className="how" aria-label="How it works">
        <div>
          <span className="how-step num">01</span>
          <h3>Launch</h3>
          <p>Creating a token opens a YES/NO market. Target and deadline are fixed at launch.</p>
        </div>
        <div>
          <span className="how-step num">02</span>
          <h3>Trade the line</h3>
          <p>Buy YES if you think it bonds 85 SOL in time, NO if it won&apos;t. The price is the probability.</p>
        </div>
        <div>
          <span className="how-step num">03</span>
          <h3>Fees follow conviction</h3>
          <p>Higher probability routes more trading fees to the creator, within capped bands.</p>
        </div>
        <div>
          <span className="how-step num">04</span>
          <h3>Settle from chain</h3>
          <p>At expiry anyone can settle. No oracle: bonded SOL on Solana decides.</p>
        </div>
      </section>
    </main>
  );
}
