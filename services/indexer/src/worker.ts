type IndexedEvent =
  | "LaunchCreated"
  | "TokenTradeExecuted"
  | "MarketTradeExecuted"
  | "ReflexUpdated"
  | "LaunchGraduated"
  | "MarketSettled"
  | "Claimed";

const indexedEvents: IndexedEvent[] = [
  "LaunchCreated",
  "TokenTradeExecuted",
  "MarketTradeExecuted",
  "ReflexUpdated",
  "LaunchGraduated",
  "MarketSettled",
  "Claimed"
];

export async function startIndexer(): Promise<void> {
  console.info("indexer starting", { indexedEvents });
}

await startIndexer();

