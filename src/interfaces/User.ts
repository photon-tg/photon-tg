import { User as SupabaseUser } from '@supabase/supabase-js';

export interface User extends SupabaseUser {
  telegram: {
    firstName: string;
    lastName: string;
  };
  referrerId: string;
}
