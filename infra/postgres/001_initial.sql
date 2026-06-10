create table if not exists launches (
  id bigserial primary key,
  launch_pubkey text not null unique,
  creator text not null,
  token_mint text not null,
  market_pubkey text not null unique,
  vault_pubkey text not null,
  metadata_uri text not null,
  target_lamports numeric not null,
  bonded_lamports numeric not null default 0,
  created_ts timestamptz not null,
  expiry_ts timestamptz not null,
  graduation_ts timestamptz,
  state text not null
);

create table if not exists markets (
  market_pubkey text primary key,
  launch_pubkey text not null references launches(launch_pubkey),
  probability_bps integer not null,
  yes_pool numeric not null,
  no_pool numeric not null,
  liquidity_b numeric not null,
  settled boolean not null default false,
  result text
);

create table if not exists positions (
  wallet text not null,
  market_pubkey text not null references markets(market_pubkey),
  yes_shares numeric not null default 0,
  no_shares numeric not null default 0,
  avg_yes_entry_bps integer,
  avg_no_entry_bps integer,
  claimed boolean not null default false,
  primary key (wallet, market_pubkey)
);

create table if not exists trades (
  tx_sig text primary key,
  wallet text not null,
  launch_pubkey text not null,
  market_pubkey text not null,
  trade_type text not null,
  amount_in numeric not null,
  amount_out numeric not null,
  probability_before_bps integer,
  probability_after_bps integer,
  created_ts timestamptz not null
);

create table if not exists events (
  id bigserial primary key,
  tx_sig text not null,
  event_type text not null,
  account text not null,
  payload jsonb not null,
  block_time timestamptz not null
);

