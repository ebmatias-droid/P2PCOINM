import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Post {
  id: string
  title: string
  body: string
  crypto_amount: number | null
  contact_info: string | null
  author_id: string
  created_at: string
}

export interface Message {
  id: string
  post_id: string
  sender_id: string
  receiver_id: string
  content: string
  created_at: string
}
