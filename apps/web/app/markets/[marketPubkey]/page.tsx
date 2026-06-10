import { ProbabilityMeter } from "../../shared/probability-meter";

export default async function MarketPage({ params }: { params: Promise<{ marketPubkey: string }> }) {
  const { marketPubkey } = await params;

  return (
    <main className="page">
      <section className="market-hero">
        <div>
          <p className="eyebrow">{marketPubkey}</p>
          <h1>61.8% chance to graduate</h1>
          <p>38.2 / 85 SOL bonded. 8h 12m remaining.</p>
        </div>
        <ProbabilityMeter probabilityBps={6_180} size="large" />
      </section>

      <section className="two-column">
        <div className="panel">
          <h2>Trade probability</h2>
          <div className="segmented">
            <button type="button">YES</button>
            <button type="button">NO</button>
          </div>
          <label className="form-field">
            Amount
            <input inputMode="decimal" placeholder="0.0 SOL" />
          </label>
          <button type="button">Review trade</button>
        </div>
        <div className="panel">
          <h2>Launch token</h2>
          <label className="form-field">
            Buy amount
            <input inputMode="decimal" placeholder="0.0 SOL" />
          </label>
          <button type="button">Review buy</button>
        </div>
      </section>
    </main>
  );
}
