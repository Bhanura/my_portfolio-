-- ─────────────────────────────────────────────────────────────────
-- migration_contact.sql  — Create "contact_messages" table
--
-- HOW TO RUN THIS:
--   1. Go to your Supabase Dashboard -> SQL Editor
--   2. Copy this entire script and click "Run"
-- ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  is_read boolean DEFAULT false
);

-- Row Level Security (RLS) Policies
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow public to insert messages
CREATE POLICY "Allow public insert to contact_messages" 
ON contact_messages FOR INSERT 
WITH CHECK (true);

-- Allow authenticated users (Admins) to read, update, delete
CREATE POLICY "Allow authenticated users to read contact_messages" 
ON contact_messages FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update contact_messages" 
ON contact_messages FOR UPDATE 
USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete contact_messages" 
ON contact_messages FOR DELETE 
USING (auth.role() = 'authenticated');
