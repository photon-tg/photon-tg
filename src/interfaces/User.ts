import { User as SupabaseUser } from '@supabase/supabase-js';

export interface User extends SupabaseUser {
  telegram: {
    firstName: string;
    lastName: string;
  };
  referrerId: string;
  last_claimed_daily_reward_at: string;
  last_daily_reward: string | null;
  // TODO: make a separate type (auth and user)
  energy: number;
  coins: number;
}
