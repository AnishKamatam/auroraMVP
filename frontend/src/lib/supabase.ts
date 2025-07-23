import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nrnaybrtbjifkinfiycu.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ybmF5YnJ0YmppZmtpbmZpeWN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMDQ4MjQsImV4cCI6MjA2ODg4MDgyNH0.1v06mKBJQfWz7z_7tpDeXGtGpbsRces92nwRyYWxnGk'

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 