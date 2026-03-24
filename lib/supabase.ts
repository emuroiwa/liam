import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type PointsLog = {
  id: string
  created_at: string
  points: number
  label: string
  type: 'earn' | 'spend'
}

export type WeeklyReset = {
  id: string
  reset_at: string
}
