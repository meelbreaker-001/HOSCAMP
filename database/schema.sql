-- ==========================================================================
-- HostelConnect - Supabase PostgreSQL Cloud Database Schema
-- Adhiyamaan College of Engineering (ACE), Hosur
--
-- ARCHITECTURE: Pure Supreme Hierarchy
-- Only the Supreme Administration (Principal & Chief Warden) is seeded here.
-- All other roles (HoDs, Class Tutors, Deputy Wardens, Gate Security, and Students)
-- are created and assigned from the portal by the Principal / Chief Warden.
-- ==========================================================================

-- 1. Profiles Table (Master System Registry)
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

-- 3. Academic Attendance Ledger (Managed by Class Tutors)
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

-- 5. Gate & Security Access Audit Ledger
CREATE TABLE IF NOT EXISTS security_access_logs (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  client_ip TEXT NOT NULL DEFAULT 'CLIENT_BROWSER',
  action TEXT NOT NULL,
  username TEXT DEFAULT 'ANONYMOUS',
  user_agent TEXT,
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS) - Permissive for Web Client Access (No DROP statements)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE passes ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE grievances ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_access_logs ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Allow All Profiles') THEN
    CREATE POLICY "Allow All Profiles" ON profiles FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'passes' AND policyname = 'Allow All Passes') THEN
    CREATE POLICY "Allow All Passes" ON passes FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'attendance' AND policyname = 'Allow All Attendance') THEN
    CREATE POLICY "Allow All Attendance" ON attendance FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'grievances' AND policyname = 'Allow All Grievances') THEN
    CREATE POLICY "Allow All Grievances" ON grievances FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'security_access_logs' AND policyname = 'Allow All Security Logs') THEN
    CREATE POLICY "Allow All Security Logs" ON security_access_logs FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- ==========================================================================
-- Supreme Administration Accounts ONLY (Chief Warden & Principal)
-- You can change the usernames & passwords below to whatever you prefer!
-- ==========================================================================
INSERT INTO profiles (roll_number, full_name, role, password)
VALUES 
  ('chiefwarden@adhiyamaan.ac.in', 'Prof. R. Sengottuvelu (Chief Warden)', 'ADMIN', 'Chief@123'),
  ('principal@adhiyamaan.ac.in', 'Dr. G. Ranganath (Principal)', 'ADMIN', 'Admin@123')
ON CONFLICT (roll_number) DO UPDATE
SET password = EXCLUDED.password;
