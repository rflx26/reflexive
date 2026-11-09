export async function settleExpiredMarkets(now = new Date()): Promise<number> {
  console.info("resolver scan", { now: now.toISOString() });
  return 0;
}

// A non-numeric value would make setInterval fire almost continuously, so fall back to the default.
const configuredIntervalMs = Number(process.env.RESOLVER_INTERVAL_MS ?? 15_000);
const intervalMs =
  Number.isFinite(configuredIntervalMs) && configuredIntervalMs > 0 ? configuredIntervalMs : 15_000;

let scanInFlight = false;

// Skip a tick if the previous scan is still running, and log failures instead of
// letting a rejected promise become an unhandled rejection that crashes the worker.
async function runScan(): Promise<void> {
  if (scanInFlight) {
    return;
  }

  scanInFlight = true;
  try {
    await settleExpiredMarkets();
  } catch (error) {
    console.error("resolver scan failed", error);
  } finally {
    scanInFlight = false;
  }
}

await runScan();
setInterval(() => {
  void runScan();
}, intervalMs);
