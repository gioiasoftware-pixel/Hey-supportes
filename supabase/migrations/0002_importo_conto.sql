-- Importo del conto (pre-sconto) registrato dal maitre alla conferma presenza,
-- per poter calcolare incasso netto e costo degli sconti sui referral.
alter table reservations add column importo_conto numeric(10,2);
