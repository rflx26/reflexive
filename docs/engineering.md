# Engineering Notes

## Code Style

Write code that reads like a person had to maintain it next week:

- Use precise names from the product domain.
- Keep modules small and boring.
- Prefer explicit state transitions over hidden side effects.
- Do not leave placeholder logic in code paths that touch funds.
- Keep comments rare, but useful when they explain a domain rule or invariant.

## Testing Strategy

Protocol tests carry the highest responsibility:

- Account relationship validation.
- Arithmetic overflow behavior.
- Quote and execution parity.
- Settlement edge cases.
- Claim idempotency.
- Fuzz or simulation coverage for vault accounting.

Backend tests should cover event parsing, idempotent writes, resolver retries, and stale indexer states.

Frontend tests should cover launch creation, trade review, settlement display, and claim states.

## Documentation Standard

Public-facing docs should explain what exists, what is intentionally deferred, and how to run or extend the code. Avoid marketing filler inside engineering docs.

## V1 Constraints

- No subjective market types.
- No custom creator thresholds.
- No governance controls.
- No floating point onchain math.
- No external oracle dependency.

