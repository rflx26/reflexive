export default function LaunchPage() {
  return (
    <main className="page narrow">
      <section className="panel">
        <p className="eyebrow">Create launch</p>
        <h1>Launch token and graduation market</h1>
        <form className="form">
          <label>
            Name
            <input name="name" placeholder="Token name" required />
          </label>
          <label>
            Ticker
            <input name="ticker" placeholder="TICKER" required />
          </label>
          <label>
            Image URL
            <input name="imageUrl" placeholder="https://..." required />
          </label>
          <label>
            Description
            <textarea name="description" placeholder="What is this launch?" required />
          </label>
          <div className="rule-row">
            <span>Graduation target</span>
            <strong>85 SOL</strong>
          </div>
          <div className="rule-row">
            <span>Deadline</span>
            <strong>72 hours</strong>
          </div>
          <button type="submit">Create launch</button>
        </form>
      </section>
    </main>
  );
}

