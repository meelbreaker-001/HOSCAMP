-- ==========================================================================
-- HostelConnect - Supabase PostgreSQL Cloud Database Schema
-- Adhiyamaan College of Engineering (ACE), Hosur
-- Copy and paste this script directly into Supabase SQL Editor -> Run!
-- ==========================================================================

-- 1. Profiles Table (Students, Tutors, Wardens, HoD, Security, Chief Warden, Principal)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  roll_number TEXT UNIQUE NOT NULL,
  register_number TEXT,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('STUDENT', 'TUTOR', 'HOD', 'WARDEN', 'SECURITY', 'ADMIN', 'CHIEF_WARDEN')),
  department TEXT DEFAULT 'Computer Science & Engineering',
  dept_code TEXT DEFAULT 'CSE',
  year_number INT DEFAULT 2,
  class_section TEXT DEFAULT 'Section A',
  hostel_name TEXT DEFAULT 'Pennar Hostel (Boys)',
  hostel_block TEXT DEFAULT 'Block B',
  room_number TEXT DEFAULT '101',
  phone TEXT,
  parent_contact TEXT,
  password TEXT DEFAULT 'pass123',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Leave Passes Table (Dual Clearances: Class Tutor + Deputy Warden)
CREATE TABLE IF NOT EXISTS passes (
  id TEXT PRIMARY KEY,
  student_roll TEXT NOT NULL,
  student_name TEXT NOT NULL,
  pass_type TEXT NOT NULL DEFAULT 'OUT_IN_PASS',
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  reason TEXT NOT NULL,
  destination TEXT,
  parent_contact TEXT,
  medical_proof_url TEXT,
  tutor_approval TEXT DEFAULT 'PENDING',
  warden_approval TEXT DEFAULT 'PENDING',
  status TEXT DEFAULT 'PENDING',
  is_extension BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Academic Attendance Ledger (Uploaded by Class Tutors across 4 Years)
CREATE TABLE IF NOT EXISTS attendance (
  roll_number TEXT PRIMARY KEY,
  student_name TEXT NOT NULL,
  department TEXT DEFAULT 'Computer Science & Engineering',
  class_section TEXT DEFAULT 'Section A',
  year_number INT DEFAULT 2,
  percentage NUMERIC(5,2) NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
  updated_by TEXT DEFAULT 'Class Tutor',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Maintenance & Grievance Tickets
CREATE TABLE IF NOT EXISTS grievances (
  id TEXT PRIMARY KEY,
  student_roll TEXT NOT NULL,
  student_name TEXT NOT NULL,
  category TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'MEDIUM',
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'PENDING',
  photo_proof_url TEXT,
  solve_proof_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Private Security & IP Access Ledger
CREATE TABLE IF NOT EXISTS security_access_logs (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  client_ip TEXT NOT NULL DEFAULT 'CLIENT_BROWSER',
  action TEXT NOT NULL,
  username TEXT DEFAULT 'ANONYMOUS',
  user_agent TEXT,
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS) Configuration - Permissive for Campus Web Access
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE passes ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE grievances ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_access_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow All Profiles" ON profiles;
CREATE POLICY "Allow All Profiles" ON profiles FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow All Passes" ON passes;
CREATE POLICY "Allow All Passes" ON passes FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow All Attendance" ON attendance;
CREATE POLICY "Allow All Attendance" ON attendance FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow All Grievances" ON grievances;
CREATE POLICY "Allow All Grievances" ON grievances FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow All Security Logs" ON security_access_logs;
CREATE POLICY "Allow All Security Logs" ON security_access_logs FOR ALL USING (true) WITH CHECK (true);

-- Institutional Seed Accounts (Official Adhiyamaan College of Engineering)
INSERT INTO profiles (roll_number, register_number, full_name, role, department, year_number, class_section, hostel_name, hostel_block, room_number, phone, password)
VALUES 
  ('2026-CSE-104', '730323104104', 'Alex Rivers', 'STUDENT', 'Computer Science & Engineering', 2, 'Section A', 'Pennar Hostel (Boys)', 'Block B', '304', '+91 98765 43210', 'pass123'),
  ('2024-CSE-001', '730324104001', 'Adhiyamaan Hosteller', 'STUDENT', 'Computer Science & Engineering', 2, 'Section A', 'Pennar Hostel (Boys)', 'Block B', '304', '+91 94421 00001', 'pass123'),
  ('tutor_cse_a', NULL, 'Prof. M. Priya', 'TUTOR', 'Computer Science & Engineering', NULL, 'Section A', NULL, NULL, NULL, '+91 94421 88101', 'pass123'),
  ('tutor_cse_b', NULL, 'Prof. K. Ramesh', 'TUTOR', 'Computer Science & Engineering', NULL, 'Section B', NULL, NULL, NULL, '+91 94421 88102', 'pass123'),
  ('hod_cse', NULL, 'Dr. K. Suresh', 'HOD', 'Computer Science & Engineering', NULL, NULL, NULL, NULL, NULL, '+91 94421 88100', 'pass123'),
  ('warden_block_b', NULL, 'Prof. M. Arjunan', 'WARDEN', NULL, NULL, NULL, 'Pennar Hostel (Boys)', 'Block B', NULL, '+91 94421 88201', 'pass123'),
  ('warden_girls', NULL, 'Prof. S. Aarthi', 'WARDEN', NULL, NULL, NULL, 'Bhavani Hostel (Girls)', 'Block A', NULL, '+91 98422 11902', 'pass123'),
  ('chiefwarden@adhiyamaan.ac.in', NULL, 'Prof. R. Sengottuvelu', 'ADMIN', NULL, NULL, NULL, 'All Campus Hostels', 'All Blocks', NULL, '+91 94421 88001', 'Chief@123'),
  ('principal@adhiyamaan.ac.in', NULL, 'Dr. G. Ranganath', 'ADMIN', NULL, NULL, NULL, 'Campus Supreme Head', 'Main Admin', NULL, '+91 94421 88000', 'Admin@123'),
  ('main_security', NULL, 'Officer Vikram', 'SECURITY', NULL, NULL, NULL, 'Main Gate Checkpoint', 'Gate 1', NULL, '+91 94421 88999', 'pass123')
ON CONFLICT (roll_number) DO NOTHING;
