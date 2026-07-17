-- Schema iniziale gestionale referral ristorante

create table customers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  nome text not null,
  telefono text not null,
  referral_code text not null unique default substr(md5(random()::text), 1, 8),
  referred_by uuid references customers(id),
  sconto_percentuale integer not null default 10 check (sconto_percentuale in (0, 10, 15)),
  sconto_scade_il timestamptz,
  privacy_accepted_at timestamptz not null default now(),
  marketing_opt_in boolean not null default false,
  created_at timestamptz not null default now()
);

create table referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid not null references customers(id),
  referred_id uuid not null references customers(id) unique,
  stato text not null default 'pending' check (stato in ('pending', 'confirmed', 'failed')),
  confirmed_at timestamptz,
  confirmed_by uuid,
  created_at timestamptz not null default now()
);

create table reservations (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers(id),
  data date not null,
  orario time not null,
  numero_persone integer not null check (numero_persone > 0),
  stato text not null default 'confirmed' check (stato in ('confirmed', 'completed', 'no_show', 'cancelled')),
  sconto_applicato integer not null default 0,
  created_at timestamptz not null default now()
);

create table blocked_dates (
  id uuid primary key default gen_random_uuid(),
  data date not null unique,
  motivo text,
  created_by uuid,
  created_at timestamptz not null default now()
);

create table settings (
  key text primary key,
  value text not null
);

insert into settings (key, value) values ('sconto_validita_giorni', '30');

alter table customers enable row level security;
alter table referrals enable row level security;
alter table reservations enable row level security;
alter table blocked_dates enable row level security;
alter table settings enable row level security;

-- Politiche minime per far funzionare l'impalcatura: la registrazione/prenotazione
-- pubblica passa dal client anon, la gestione admin passa da server actions con
-- la service role key (che bypassa RLS). Da irrobustire quando si definisce
-- l'auth lato customer (magic link).
create policy "anon can insert customers" on customers for insert to anon with check (true);
create policy "anon can read own customer by id" on customers for select to anon using (true);

create policy "anon can insert reservations" on reservations for insert to anon with check (true);
create policy "anon can read reservations" on reservations for select to anon using (true);

create policy "anon can read blocked_dates" on blocked_dates for select to anon using (true);
create policy "anon can read settings" on settings for select to anon using (true);
