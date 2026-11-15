import type { MarketSummary } from "@reflexive/types";
import type { Route } from "next";
import Link from "next/link";
import { formatSol, isEnded, stateLabel } from "../lib/format";
import { Countdown } from "./countdown";
import { ProbabilityMeter } from "./probability-meter";
import { TokenAvatar } from "./token-avatar";

export function MarketCard({ market }: { market: MarketSummary }) {
  const ended = isEnded(market.state);
  const bondedPct = Math.min(100, (market.bondedSol / market.targetSol) * 100);

  return (
    <Link
      className={`market-card glass${ended ? " ended" : ""}`}
      href={`/markets/${market.marketPubkey}` as Route}
    >
      <header>
        <TokenAvatar ticker={market.ticker} />
        <div className="market-card-title">
          <h3>{market.name}</h3>
          <p className="ticker">${market.ticker}</p>
        </div>
        {ended ? (
          <span className={`badge badge-${market.state}`}>{stateLabel(market.state)}</span>
        ) : (
          <Countdown className="countdown num" expiryTs={market.expiryTs} />
        )}
      </header>

      {ended ? (
        <div className="market-result">
          <span className={`num ${market.state === "graduated" ? "lens" : "rim"}`}>
            {market.state === "graduated" ? "YES" : "NO"}
          </span>
          <span className="muted">won</span>
        </div>
      ) : (
        <ProbabilityMeter probabilityBps={market.probabilityBps} />
      )}

      <div className="bond">
        <div className="bond-row">
          <span className="muted">Bonded</span>
          <span className="num">
            {formatSol(market.bondedSol)} <small>/ {market.targetSol} SOL</small>
          </span>
        </div>
        <div className="bond-track" aria-hidden="true">
          <i style={{ width: `${bondedPct}%` }} />
        </div>
      </div>

      <dl className="stats">
        <div>
          <dt>24h volume</dt>
          <dd className="num">
            {formatSol(market.volumeSol24h)} <small>SOL</small>
          </dd>
        </div>
        <div>
          <dt>{ended ? "Outcome" : "Needs"}</dt>
          <dd className="num">
            {ended ? (
              market.state === "graduated" ? "Graduated" : "Missed"
            ) : (
              <>
                {formatSol(Math.max(0, market.targetSol - market.bondedSol))} <small>SOL</small>
              </>
            )}
          </dd>
        </div>
      </dl>
    </Link>
  );
}
