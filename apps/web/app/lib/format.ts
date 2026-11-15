import type { LaunchState, MarketResult } from "@reflexive/types";

export function formatSol(value: number, digits = 1): string {
  return value.toLocaleString("en-US", {
    maximumFractionDigits: digits,
    minimumFractionDigits: value >= 1000 ? 0 : Math.min(digits, 1)
  });
}

export function formatCount(value: number): string {
  return value.toLocaleString("en-US");
}

export function formatPercent(bps: number, digits = 0): string {
  return `${(bps / 100).toFixed(digits)}%`;
}

export function timeRemaining(expiryTs: string, nowMs = Date.now()): string {
  const ms = new Date(expiryTs).getTime() - nowMs;
  if (ms <= 0) return "Expired";

  const totalMinutes = Math.floor(ms / 60_000);
  const days = Math.floor(totalMinutes / 1_440);
  const hours = Math.floor((totalMinutes % 1_440) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export function timeAgo(ts: string, nowMs = Date.now()): string {
  const seconds = Math.max(0, Math.floor((nowMs - new Date(ts).getTime()) / 1000));
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3_600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86_400) return `${Math.floor(seconds / 3_600)}h ago`;
  return `${Math.floor(seconds / 86_400)}d ago`;
}

export function shortAddress(address: string): string {
  return address.length > 10 ? `${address.slice(0, 4)}…${address.slice(-4)}` : address;
}

export function isEnded(state: LaunchState): boolean {
  return state !== "active";
}

export function stateLabel(state: LaunchState, result: MarketResult | null = null): string {
  switch (state) {
    case "active":
      return "Live";
    case "graduated":
      return "Graduated";
    case "failed":
      return "Expired";
    case "settled":
      return result ? `Settled ${result}` : "Settled";
  }
}
