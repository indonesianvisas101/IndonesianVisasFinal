
import { createClient } from '@supabase/supabase-js'

export const createAdminClient = async () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error("❌ CRITICAL: Supabase Admin Config Missing!", { 
      hasUrl: !!url, 
      hasKey: !!key,
      keyPrefix: key ? key.substring(0, 5) + "..." : "NONE" 
    });
  }

  return createClient(
    url!,
    key!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}
