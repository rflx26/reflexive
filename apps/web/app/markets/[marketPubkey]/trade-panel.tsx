"use client";

import { quoteMarketTrade } from "@reflexive/sdk";
import type { MarketResult, MarketSide } from "@reflexive/types";
import { useMemo, useState } from "react";
import { formatPercent } from "../../lib/format";

const LAMPORTS_PER_SOL = 1_000_000_000n;
const QUICK_AMOUNTS = ["0.5", "1", "5", "10"];

function solToLamports(input: string): bigint | null {
  if (!/^\d*\.?\d{0,9}$/.test(input) || input === "" || input === ".") return null;
  const [whole = "0", fraction = ""] = input.split(".");
  return BigInt(whole || "0") * LAMPORTS_PER_SOL + BigInt(fraction.padEnd(9, "0"));
}

function lamportsToSol(lamports: bigint): string {
  const sol = Number(lamports) / Number(LAMPORTS_PER_SOL);
  return sol.toLocaleString("en-US", { maximumFractionDigits: 3 });
}

export function TradePanel({
  yesPool,
  noPool,
  settled,
  result
}: {
  yesPool: string;
  noPool: string;
  settled: boolean;
  result: MarketResult | null;
}) {
  const [side, setSide] = useState<MarketSide>("YES");
  const [amount, setAmount] = useState("");
  const [notice, setNotice] = useState<string | null>(null);

  const pools = useMemo(
    () => ({ yesPool: BigInt(yesPool), noPool: BigInt(noPool), liquidityB: 0n }),
    [yesPool, noPool]
  );
  const lamports = solToLamports(amount);

  const quote = useMemo(() => {
    if (lamports === null || lamports <= 0n) return null;
    try {
      const q = quoteMarketTrade(pools, side, "BUY", lamports);
      const yesAfter = pools.yesPool + (side === "YES" ? lamports : 0n);
      const noAfter = pools.noPool + (side === "NO" ? lamports : 0n);
      const sideAfter = side === "YES" ? yesAfter : noAfter;
      // Pool-share payout: winners split the whole pot pro rata to their stake.
      const payout = (lamports * (yesAfter + noAfter)) / sideAfter;
      return { ...q, payout };
    } catch {
      return null;
    }
  }, [pools, side, lamports]);

  if (settled) {
    return (
      <div className="panel glass panel-stack">
        <h2>Market settled</h2>
        <div className={`settled-result ${result === "YES" ? "yes" : "no"}`}>
          <span className="num">{result}</span>
          <span>won</span>
        </div>
        <p className="muted small">
          {result === "YES" ? "YES" : "NO"} holders can claim their share of the pool from their
          profile.
        </p>
      </div>
    );
  }

  return (
    <div className="panel glass panel-stack">
      <h2>Trade probability</h2>
      <div className="segmented" role="group" aria-label="Outcome">
        {(["YES", "NO"] as const).map((option) => (
          <button
            key={option}
            type="button"
            className={option.toLowerCase()}
            aria-pressed={side === option}
            onClick={() => setSide(option)}
          >
            {option === "YES" ? "YES · graduates" : "NO · misses"}
          </button>
        ))}
      </div>

      <label className="form-field">
        Amount
        <div className="input-affix">
          <input
            inputMode="decimal"
            placeholder="0.0"
            value={amount}
            onChange={(event) => {
              const next = event.target.value.replace(",", ".");
              if (next === "" || /^\d*\.?\d{0,9}$/.test(next)) setAmount(next);
            }}
          />
          <span>SOL</span>
        </div>
      </label>
      <div className="chips">
        {QUICK_AMOUNTS.map((value) => (
          <button key={value} type="button" className="chip" onClick={() => setAmount(value)}>
            {value}
          </button>
        ))}
      </div>

      <dl className="quote">
        <div>
          <dt>Shares</dt>
          <dd className="num">{quote ? lamportsToSol(quote.estimatedShares) : "—"}</dd>
        </div>
        <div>
          <dt>Probability after</dt>
          <dd className="num">
            {quote ? (
              <>
                {formatPercent(quote.probabilityBeforeBps)} → <b>{formatPercent(quote.probabilityAfterBps)}</b>
              </>
            ) : (
              "—"
            )}
          </dd>
        </div>
        <div>
          <dt>Payout if {side}</dt>
          <dd className={`num ${side === "YES" ? "lens" : "rim"}`}>
            {quote ? `${lamportsToSol(quote.payout)} SOL` : "—"}
          </dd>
        </div>
      </dl>

      <button
        type="button"
        onClick={() => setNotice("Wallet signing arrives with the launch program. Quotes above use live pool state.")}
      >
        Connect wallet to trade
      </button>
      {notice && <p className="muted small">{notice}</p>}
    </div>
  );
}
