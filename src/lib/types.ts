export type ReservationStatus = "confirmed" | "completed" | "no_show" | "cancelled";
export type ReferralStatus = "pending" | "confirmed" | "failed";

export interface Customer {
  id: string;
  email: string;
  nome: string;
  telefono: string;
  referral_code: string;
  referred_by: string | null;
  sconto_percentuale: number;
  sconto_scade_il: string | null;
  privacy_accepted_at: string;
  marketing_opt_in: boolean;
  created_at: string;
}

export interface Referral {
  id: string;
  referrer_id: string;
  referred_id: string;
  stato: ReferralStatus;
  confirmed_at: string | null;
  confirmed_by: string | null;
  created_at: string;
}

export interface Reservation {
  id: string;
  customer_id: string;
  data: string;
  orario: string;
  numero_persone: number;
  stato: ReservationStatus;
  sconto_applicato: number;
  importo_conto: number | null;
  note: string | null;
  created_at: string;
}

export interface BlockedDate {
  id: string;
  data: string;
  motivo: string | null;
  created_by: string | null;
  created_at: string;
}

export interface Setting {
  key: string;
  value: string;
}

// Hand-written to mirror the Supabase schema in supabase/migrations.
// Once the project is connected, regenerate with:
// npx supabase gen types typescript --project-id <id> > src/lib/database.types.ts
export interface Database {
  public: {
    Tables: {
      customers: { Row: Customer; Insert: Partial<Customer>; Update: Partial<Customer> };
      referrals: { Row: Referral; Insert: Partial<Referral>; Update: Partial<Referral> };
      reservations: { Row: Reservation; Insert: Partial<Reservation>; Update: Partial<Reservation> };
      blocked_dates: { Row: BlockedDate; Insert: Partial<BlockedDate>; Update: Partial<BlockedDate> };
      settings: { Row: Setting; Insert: Partial<Setting>; Update: Partial<Setting> };
    };
  };
}
