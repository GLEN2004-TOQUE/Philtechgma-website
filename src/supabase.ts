import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types (based on your existing structure)
export interface User {
  id: string
  email: string
  role: 'student' | 'teacher' | 'parent' | 'admin'
  full_name: string
  is_active: boolean
  created_at: string
}

export interface Student {
  id: string
  user_id: string
  student_id: string
  course: string
  year_level: string
  department: string
}

export interface Teacher {
  id: string
  user_id: string
  employee_id: string
  department: string
  position: string
}

export interface Parent {
  id: string
  user_id: string
  guardian_id: string
  student_dependent: string
}