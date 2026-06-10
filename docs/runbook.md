# Runbook

## Local Services

```bash
docker compose -f infra/docker/docker-compose.yml up
pnpm dev
```

## Health Checks

- API: `GET /health`
- Indexer: logs active event parser list on startup.
- Resolver: logs each expiry scan.

## Settlement Recovery

If the resolver is down, any wallet can call settlement after expiry. The program must reject early settlement and duplicate settlement.

## Stale Indexer State

The UI should mark markets as potentially stale when the indexer lags behind the latest observed slot. Users should rely on transaction simulation and onchain checks before signing.

## Incident Priorities

1. Pause new launches and trades if custody or settlement safety is uncertain.
2. Preserve raw events and transaction signatures.
3. Identify affected markets.
4. Resume unaffected markets only after invariant checks pass.

