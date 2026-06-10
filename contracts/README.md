# Contracts

The MVP target is an Anchor workspace with separate program boundaries for launch lifecycle, market pricing, vault custody, reflex fee routing, and protocol config.

The current scaffold keeps the program directories explicit so protocol work can start without reshaping the repository.

## Program Boundaries

| Program | Owns | Does Not Own |
|---|---|---|
| `launch_program` | Launch lifecycle, graduation state | Market pricing |
| `market_program` | YES/NO pricing and positions | Token bonding |
| `vault_program` | Collateral, fees, claims | Probability |
| `reflex_program` | Fee split calculation | Custody |
| `config_program` | Global params | User funds |

## First Protocol Milestone

- Initialize protocol config.
- Create launch account.
- Create vault PDA and lock creator stake.
- Emit `LaunchCreated`.
- Add tests for account relationships and invalid state transitions.

