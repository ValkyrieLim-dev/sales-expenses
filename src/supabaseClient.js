import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://lrbkxovfhvmlaohqrlow.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxyYmt4b3ZmaHZtbGFvaHFybG93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3OTU0MDYsImV4cCI6MjA3NDM3MTQwNn0.dkxGZEHGERgDIZu1bsGUfzVjm05DJY36ocw1hzi6Upc";

export const supabase = createClient(supabaseUrl, supabaseKey);
