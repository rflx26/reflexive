# Protocol Tests

Test coverage should grow around the highest-risk invariants first:

- Vault balance is always greater than or equal to total claimable funds.
- Late trades reject from chain time, not indexer state.
- Quote and execution use the same math path.
- Settlement cannot be duplicated.
- Claims are idempotent and losing positions cannot claim.
- Graduation at `block_time <= expiry_ts` counts as success.

