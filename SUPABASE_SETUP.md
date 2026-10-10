# 🌐 Supabase Multi-Device Setup & Integration Guide

**Apex College Attendance Portal** supports real-time multi-device database synchronization via **Supabase**. Authorized attendance marked by a professor on one device (e.g. laptop) immediately syncs across cloud tables to student phones and separate browsers!

---

## 🚀 5-Step Quick Setup Guide

### Step 1: Create a Free Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and log in or create a free account.
2. Click **"New Project"**, name it `college-attendance-system`, and set a database password.

---

### Step 2: Run Database Migrations
1. In your Supabase Dashboard, click on **SQL Editor** in the left navigation menu.
2. Click **"New Query"**.
3. Copy and paste the entire contents of [`supabase_schema.sql`](supabase_schema.sql) into the query editor.
4. Click **"Run"** (or press Ctrl+Enter).  
   *(This creates all 6 tables: `users`, `professors`, `students`, `subjects`, `attendance_records`, `leave_requests`, adds the unique constraint `(student_id, subject_id, date)`, and configures Row Level Security policies).*

---

### Step 3: Get API Credentials
1. In Supabase Dashboard, go to **Project Settings (⚙️)** -> **API**.
2. Copy your **Project URL** (e.g. `https://xyzcompany.supabase.co`).
3. Copy your **public `anon` key** (`eyJh...`).

---

### Step 4: Connect Apex Portal to Supabase
1. Open your live app: [https://manearyan5222.github.io/college-attendance-system/](https://manearyan5222.github.io/college-attendance-system/) (or local `index.html`).
2. Log in and click the **`Admin / Data`** button in the top navigation bar.
3. Paste your **Supabase URL** and **Public Anon Key**.
4. Click **`Connect Supabase`**.  
   *(The badge will turn green: 🟢 **Connected to Supabase Cloud DB**).*

---

### Step 5: Seed 70 Students & 7 Teachers to Cloud
1. In the **Admin / Data** panel, click **`Push 70 Students to Cloud`**.
2. All 7 Professors, 70 Students, 14 Subjects, and 30 Days of Attendance Logs will be pushed into your Supabase database!

---

## 📱 Multi-Device Testing Walkthrough

1. **Device 1 (Laptop / Desktop Browser)**:
   - Log in as **Dr. Sarah Jenkins** (`sarah.jenkins@college.edu` / `password123`).
   - Select **Computer Networks** and mark attendance for today.
   - Click **`Submit`**.

2. **Device 2 (Smartphone / Separate Browser)**:
   - Log in as **Aryan Mane** (`aryan.mane@college.edu` / `password123`).
   - Observe the real-time attendance percentage ring, subject breakdown, and history logs update instantly across devices!

---

## 🔒 Security & Row Level Security (RLS)

- **Public Anon Key Usage**: The frontend only uses Supabase's public `anon` key, never exposing `service_role` secret keys.
- **Duplicate Protection**: The database table `attendance_records` enforces `UNIQUE(student_id, subject_id, date)`. Any duplicate submission performs an `upsert` (updating the record) rather than duplicating rows.
- **Offline Fallback**: If Supabase is disconnected or the user is offline, the system defaults to local storage state management without crashing.
