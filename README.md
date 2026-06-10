# Reflexive Graduation Market

Solana-native launchpad where every token launch creates a paired market on whether the token graduates before a fixed deadline.

The MVP keeps one promise in focus: every launch has a visible, tradable probability of graduation, and that probability changes launch economics in bounded, deterministic ways.

## Product Shape

- Launches create an SPL token and a binary YES/NO graduation market.
- Graduation is objective: the launch succeeds if bonded SOL reaches the configured threshold before expiry.
- Settlement is deterministic from Solana state. There are no subjective oracles in V1.
- Probability drives fee routing through capped bands, but it never controls custody.
- The web app treats probability as the primary market signal.

## Repository Layout

```txt
apps/
  web/                 Next.js app for creators and traders
contracts/
  programs/            Anchor program workspace placeholders
  tests/               Protocol and invariant test home
docs/
  architecture.md      System boundaries and data flow
  engineering.md       Build rules, conventions, and sequencing
  product.md           MVP product scope
  runbook.md           Local, devnet, and operational notes
infra/
  docker/              Local service definitions
packages/
  sdk/                 Typed client and shared math helpers
  types/               API, chain, and domain types
  ui/                  Shared design primitives
services/
  api/                 Read API and unsigned transaction builders
  indexer/             Event ingestion and read-model writers
  resolver/            Expiry detection and settlement worker
```

## MVP Build Order

1. Protocol config, launch, vault, and events.
2. LMSR-style market math and YES/NO positions.
3. Reflexive fee routing with capped updates.
4. Settlement and claims.
5. SDK instruction builders.
6. API transaction builders and market reads.
7. Indexer event parsing.
8. Resolver worker.
9. Web launch, market, profile, and claim flows.

## Development

This scaffold uses pnpm workspaces. Install dependencies, then run the package scripts as each surface becomes active.

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
```

The first implementation target is a local simulation plus devnet wiring. Mainnet work should wait for protocol tests, invariant coverage, and a completed runbook.

## Non-Negotiables

- No floating point math onchain.
- No Polymarket, Wormhole, UMA, governance token, leverage, or subjective resolution in V1.
- No custody shortcuts. Vault accounting must be explicit and tested.
- No magic creator controls over thresholds, expiry, or fee routing.
- No generated-looking filler. Names, docs, comments, and abstractions should carry their weight.

