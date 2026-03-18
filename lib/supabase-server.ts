import 'server-only'

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Supabase server env vars are missing')
}

const resolvedSupabaseUrl = supabaseUrl
const resolvedSupabaseServiceRoleKey = supabaseServiceRoleKey

export function createServerSupabaseClient() {
  return createClient(resolvedSupabaseUrl, resolvedSupabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
