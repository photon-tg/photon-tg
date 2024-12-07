import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export const photosBucketURL =
	'https://hnvngbrjzbcenxwmzzrk.supabase.co/storage/v1/object/public/photos';

export const bucketURL =
	'https://hnvngbrjzbcenxwmzzrk.supabase.co/storage/v1/object/public';
