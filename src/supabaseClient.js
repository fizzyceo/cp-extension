import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://sjegnqevpqzeynnkecdq.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqZWducWV2cHF6ZXlubmtlY2RxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMzAzNjksImV4cCI6MjA2OTgwNjM2OX0.Vz9UOAOtxUXJw_3jNIK5wo2WBVYdrVUcrLoWzFUol-I";
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
