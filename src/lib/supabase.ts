import { createClient } from '@supabase/supabase-js'

// Get the Supabase URL and anon key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Reservation {
  id: string
  created_at?: string
  date: string
  time: string
  table: string
  customer_name: string
  customer_email?: string
  customer_phone: string
  party_size: number
  notes?: string
  status: 'confirmed' | 'cancelled'
}

export interface TakeawayOrder {
  id: string
  created_at?: string
  customer_name: string
  customer_phone: string
  items: OrderItem[]
  total_items: number
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled'
  notes?: string
}

export interface OrderItem {
  name: string
  category: string
  quantity: number
  notes?: string
}