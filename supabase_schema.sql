-- Apex College Attendance System - Supabase Production Database Schema
-- SQL Migration script for multi-device testing & persistent cloud database

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL DEFAULT 'password123',
    role TEXT NOT NULL CHECK (role IN ('Professor', 'Student')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PROFESSORS TABLE
CREATE TABLE IF NOT EXISTS public.professors (
    id TEXT PRIMARY KEY,
    user_id TEXT UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    department TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. STUDENTS TABLE
CREATE TABLE IF NOT EXISTS public.students (
    id TEXT PRIMARY KEY,
    user_id TEXT UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    roll_no TEXT NOT NULL,
    division TEXT NOT NULL,
    branch TEXT NOT NULL,
    profile_photo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SUBJECTS TABLE
CREATE TABLE IF NOT EXISTS public.subjects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    professor_id TEXT REFERENCES public.professors(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ATTENDANCE RECORDS TABLE (With Unique Constraint to Prevent Duplicates)
CREATE TABLE IF NOT EXISTS public.attendance_records (
    id TEXT PRIMARY KEY,
    student_id TEXT REFERENCES public.students(id) ON DELETE CASCADE,
    subject_id TEXT REFERENCES public.subjects(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Present', 'Absent', 'Late')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_student_subject_date UNIQUE (student_id, subject_id, date)
);

-- 6. LEAVE REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.leave_requests (
    id TEXT PRIMARY KEY,
    student_id TEXT REFERENCES public.students(id) ON DELETE CASCADE,
    subject_id TEXT NOT NULL,
    date DATE NOT NULL,
    reason TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Pending', 'Approved', 'Rejected')) DEFAULT 'Pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_attendance_records_subject_date ON public.attendance_records(subject_id, date);
CREATE INDEX IF NOT EXISTS idx_attendance_records_student ON public.attendance_records(student_id);
CREATE INDEX IF NOT EXISTS idx_leave_requests_student ON public.leave_requests(student_id);

-- ENABLE ROW LEVEL SECURITY (RLS) ON ALL TABLES
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;

-- ROW LEVEL SECURITY (RLS) POLICIES
-- Allow Read/Select for authenticated & anon client requests (For Portal dashboards)
CREATE POLICY "Allow public read users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update users" ON public.users FOR ALL USING (true);

CREATE POLICY "Allow public read professors" ON public.professors FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update professors" ON public.professors FOR ALL USING (true);

CREATE POLICY "Allow public read students" ON public.students FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update students" ON public.students FOR ALL USING (true);

CREATE POLICY "Allow public read subjects" ON public.subjects FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update subjects" ON public.subjects FOR ALL USING (true);

CREATE POLICY "Allow public read attendance" ON public.attendance_records FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update attendance" ON public.attendance_records FOR ALL USING (true);

CREATE POLICY "Allow public read leaves" ON public.leave_requests FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update leaves" ON public.leave_requests FOR ALL USING (true);
