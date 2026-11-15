import { REFLEX_FEE_BANDS } from "@reflexive/sdk";
import type { MarketDetailResponse } from "@reflexive/types";
import Link from "next/link";
import { notFound } from "next/navigation";
import { api } from "../../lib/api";
import {
  formatCount,
  formatPercent,
  formatSol,
  isEnded,
  shortAddress,
  stateLabel,
  timeAgo
} from "../../lib/format";
import { Countdown } from "../../shared/countdown";
import { ProbabilityChart } from "../../shared/probability-chart";
import { TokenAvatar } from "../../shared/token-avatar";
import { TradePanel } from "./trade-panel";

async function loadMarket(marketPubkey: string): Promise<MarketDetailResponse> {
  try {
    return await api.getMarket(marketPubkey);
  } catch (error) {
    if (error instanceof Error && error.message.includes("404")) notFound();
    throw error;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ marketPubkey: string }> }) {
  const { marketPubkey } = await params;
  try {
    const { launch, market } = await api.getMarket(marketPubkey);
    return { title: `${launch.name} · ${formatPercent(market.probabilityBps)} · Reflexive` };
  } catch {
    return { title: "Market · Reflexive" };
  }
}

export default async function MarketPage({ params }: { params: Promise<{ marketPubkey: string }> }) {
  const { marketPubkey } = await params;
  const { launch, market, reflex, stats, history, recentTrades } = await loadMarket(marketPubkey);

  const ended = isEnded(launch.state);
  const bondedPct = Math.min(100, (launch.bondedSol / launch.targetSol) * 100);
  const first = history[0]?.probabilityBps ?? market.probabilityBps;
  const change = market.probabilityBps - first;
  const activeBand = REFLEX_FEE_BANDS.findIndex(
    (band) =>
      band.split.creatorFeeBps === reflex.creatorFeeBps &&
      band.split.protocolFeeBps === reflex.protocolFeeBps &&
      band.split.reserveFeeBps === reflex.reserveFeeBps
  );

  return (
    <main className="page">
      <Link className="back" href="/">
        ← Markets
      </Link>

      <header className="market-head">
        <TokenAvatar ticker={launch.ticker} size={64} />
        <div>
          <div className="market-head-title">
            <h1>{launch.name}</h1>
            <span className={`badge badge-${launch.state}`}>{stateLabel(launch.state, market.result)}</span>
          </div>
          <p className="muted">
            <span className="ticker-inline">${launch.ticker}</span> · {launch.description}
          </p>
        </div>
      </header>

      <div className="market-layout">
        <div className="market-main">
          <section className="panel glass">
            <div className="chart-head">
              <div>
                <p className="eyebrow">Will it bond {launch.targetSol} SOL before the deadline?</p>
                <div className="chart-value">
                  {ended ? (
                    <strong className={`num ${market.result === "YES" ? "lens" : "rim"}`}>
                      {market.result}
                    </strong>
                  ) : (
                    <strong className="num">{formatPercent(market.probabilityBps, 1)}</strong>
                  )}
                  <span className="muted">{ended ? "settled" : "chance to graduate"}</span>
                  {!ended && (
                    <span className={`delta num ${change >= 0 ? "up" : "down"}`}>
                      {change >= 0 ? "▲" : "▼"} {formatPercent(Math.abs(change), 1)} since launch
                    </span>
                  )}
                </div>
              </div>
              <div className="chart-meta">
                <span className="muted">{ended ? "Ended" : "Ends in"}</span>
                {ended ? (
                  <span className="num">{new Date(launch.expiryTs).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                ) : (
                  <Countdown className="num" expiryTs={launch.expiryTs} />
                )}
              </div>
            </div>
            <ProbabilityChart points={history} ended={ended} />
          </section>

          <section className="stat-strip">
            <div className="glass">
              <span className="muted">24h volume</span>
              <strong className="num">{formatSol(stats.volumeSol24h)} SOL</strong>
            </div>
            <div className="glass">
              <span className="muted">Trades</span>
              <strong className="num">{formatCount(stats.trades)}</strong>
            </div>
            <div className="glass">
              <span className="muted">Holders</span>
              <strong className="num">{formatCount(stats.holders)}</strong>
            </div>
            <div className="glass">
              <span className="muted">Pool</span>
              <strong className="num">
                {formatSol(Number(BigInt(market.yesPool) + BigInt(market.noPool)) / 1e9, 0)} SOL
              </strong>
            </div>
          </section>

          <section className="panel glass">
            <h2>Recent trades</h2>
            {recentTrades.length === 0 ? (
              <p className="muted">No trades yet.</p>
            ) : (
              <div className="table-scroll">
                <table className="trades">
                  <thead>
                    <tr>
                      <th>Wallet</th>
                      <th>Side</th>
                      <th className="right">Amount</th>
                      <th className="right">Prob. after</th>
                      <th className="right">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTrades.map((trade) => (
                      <tr key={trade.signature}>
                        <td className="num">{shortAddress(trade.wallet)}</td>
                        <td>
                          <span className={`side side-${trade.side.toLowerCase()}`}>
                            {trade.action === "BUY" ? "Buy" : "Sell"} {trade.side}
                          </span>
                        </td>
                        <td className="num right">{formatSol(trade.amountSol, 2)} SOL</td>
                        <td className="num right">{formatPercent(trade.probabilityAfterBps, 1)}</td>
                        <td className="muted right">{timeAgo(trade.ts)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>

        <aside className="market-side">
          <TradePanel
            yesPool={market.yesPool}
            noPool={market.noPool}
            settled={market.settled}
            result={market.result}
          />

          <section className="panel glass panel-stack">
            <h2>Graduation</h2>
            <div className="bond">
              <div className="bond-row">
                <span className="num big">
                  {formatSol(launch.bondedSol)} <small>/ {launch.targetSol} SOL</small>
                </span>
                <span className="muted num">{bondedPct.toFixed(0)}%</span>
              </div>
              <div className="bond-track large" aria-hidden="true">
                <i style={{ width: `${bondedPct}%` }} />
              </div>
            </div>
            <div className="rule-row">
              <span>Target</span>
              <strong className="num">{launch.targetSol} SOL bonded</strong>
            </div>
            <div className="rule-row">
              <span>Deadline</span>
              <strong className="num">
                {new Date(launch.expiryTs).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit"
                })}
              </strong>
            </div>
            <div className="rule-row">
              <span>Resolution</span>
              <strong>Onchain, no oracle</strong>
            </div>
          </section>

          <section className="panel glass panel-stack">
            <h2>Reflex fees</h2>
            <p className="muted small">
              The current probability band sets where trading fees go. Bands are fixed at launch.
            </p>
            <div className="fee-split" aria-label="Current fee split">
              <i className="fee-creator" style={{ flexGrow: reflex.creatorFeeBps }} />
              <i className="fee-protocol" style={{ flexGrow: reflex.protocolFeeBps }} />
              <i className="fee-reserve" style={{ flexGrow: reflex.reserveFeeBps }} />
            </div>
            <dl className="fee-legend">
              <div>
                <dt><i className="fee-creator" />Creator</dt>
                <dd className="num">{formatPercent(reflex.creatorFeeBps)}</dd>
              </div>
              <div>
                <dt><i className="fee-protocol" />Protocol</dt>
                <dd className="num">{formatPercent(reflex.protocolFeeBps)}</dd>
              </div>
              <div>
                <dt><i className="fee-reserve" />Reserve</dt>
                <dd className="num">{formatPercent(reflex.reserveFeeBps)}</dd>
              </div>
            </dl>
            <ol className="bands">
              {REFLEX_FEE_BANDS.map((band, index) => (
                <li key={band.minProbabilityBps} aria-current={index === activeBand ? "true" : undefined}>
                  <span className="num">
                    {formatPercent(band.minProbabilityBps)}–{formatPercent(band.maxProbabilityBps)}
                  </span>
                  <span className="num muted">creator {formatPercent(band.split.creatorFeeBps)}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="panel glass panel-stack">
            <h2>Token</h2>
            <div className="rule-row">
              <span>Mint</span>
              <strong className="num" title={launch.tokenMint}>{shortAddress(launch.tokenMint)}</strong>
            </div>
            <div className="rule-row">
              <span>Creator</span>
              <strong className="num" title={launch.creator}>{shortAddress(launch.creator)}</strong>
            </div>
            <div className="rule-row">
              <span>Market</span>
              <strong className="num" title={market.pubkey}>{shortAddress(market.pubkey)}</strong>
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}
