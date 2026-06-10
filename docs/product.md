# Product Scope

## MVP Promise

A creator can launch a token and paired graduation market. Traders can buy the token, trade YES/NO exposure, see probability update, and claim after deterministic settlement.

## In Scope

- Solana-only launch and settlement.
- Fixed 85 SOL graduation threshold for V1.
- Fixed 72 hour deadline for V1.
- Binary YES/NO market.
- Bounded reflexive fee routing.
- Web-first creator and trader flows.
- Indexer-backed read models.
- Resolver worker, with permissionless fallback settlement.

## Out of Scope

- Polymarket integration.
- Cross-chain settlement.
- UMA or subjective oracle flows.
- Governance token.
- Leverage.
- Creator-defined thresholds.
- Mobile app.
- Referral or social graph features.

## UX Priorities

- Probability is more prominent than price.
- Countdown and bonded progress are always visible on market pages.
- Users can distinguish launch token exposure from YES/NO exposure.
- Settlement rules are visible before trading.

