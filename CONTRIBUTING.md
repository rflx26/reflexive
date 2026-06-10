# Contributing

This project is intentionally structured so protocol, backend, frontend, and SDK work can move in parallel without losing the product invariant.

## Working Principles

- Keep changes small enough to review carefully.
- Prefer explicit domain names over clever abstractions.
- Add tests when behavior crosses money, state transitions, pricing, settlement, or claims.
- Document tradeoffs in the place a future contributor will look first.
- Do not add V2 features while V1 custody and settlement are unfinished.

## Before Opening a PR

Run the relevant checks for the area you touched.

```bash
pnpm lint
pnpm typecheck
pnpm test
```

Protocol changes should also include focused Anchor tests and, where useful, simulation coverage for accounting invariants.

## Review Focus

Reviews should prioritize:

- Vault accounting and claim safety.
- Deterministic settlement.
- State transition correctness.
- Quote and execution parity.
- Clear UI treatment of probability, expiry, and settlement risk.

