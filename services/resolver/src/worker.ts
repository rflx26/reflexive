export async function settleExpiredMarkets(now = new Date()): Promise<number> {
  console.info("resolver scan", { now: now.toISOString() });
  return 0;
}

const intervalMs = Number(process.env.RESOLVER_INTERVAL_MS ?? 15_000);

await settleExpiredMarkets();
setInterval(() => {
  void settleExpiredMarkets();
}, intervalMs);

