# Architecture

## System Surfaces

- `apps/web`: wallet-connected user experience.
- `services/api`: read endpoints and unsigned transaction builders.
- `services/indexer`: Solana event consumer and Postgres writer.
- `services/resolver`: expiry scanner that calls settlement when markets are eligible.
- `packages/sdk`: typed client, instruction builders, and shared math helpers.
- `packages/types`: shared API and domain contracts.
- `contracts`: Anchor programs and protocol tests.

## Data Flow

1. A launch transaction creates launch, vault, token mint, market, and reflex state accounts.
2. Programs emit events for creation, trades, graduation, reflex updates, settlement, and claims.
3. The indexer stores raw events and updates read-model tables.
4. The API serves market lists, detail pages, profiles, and unsigned transactions.
5. The resolver scans expired markets and submits settlement transactions.
6. Anyone can still settle after expiry if the resolver is offline.

## Critical Invariants

- Vault custody stays in program-owned PDAs.
- Admin config authority cannot withdraw user funds.
- Market trades reject after launch expiry.
- Settlement result derives only from launch state and timestamps.
- Fee splits always sum to 10000 basis points.
- Probability affects routing, not custody ownership.

