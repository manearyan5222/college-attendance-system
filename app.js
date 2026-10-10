/**
 * Apex College Attendance System - Enhanced Application Logic & State Management
 */

// Initialize Database State
const DB_VERSION = "2.5.0";
const STORAGE_KEYS = {
  USERS: "attendance_users",
  STUDENTS: "attendance_students",
  PROFESSORS: "attendance_professors",
  SUBJECTS: "attendance_subjects",
  RECORDS: "attendance_records",
  LEAVES: "attendance_leaves",
  CURRENT_USER: "attendance_current_user",
  DB_INITIALIZED: "attendance_db_initialized_v4"
};

// Seed Data & Storage Operations
class AttendanceDB {
  static init() {
    if (localStorage.getItem(STORAGE_KEYS.DB_INITIALIZED)) {
      return; // Already initialized
    }

    console.log("Initializing database with 7 Teachers and 70 Students seed data...");

    // 1. Create 7 Professors & User Accounts
    const profRawData = [
      { id: "prof_1", name: "Dr. Sarah Jenkins", dept: "Computer Engineering", email: "sarah.jenkins@college.edu" },
      { id: "prof_2", name: "Dr. David Miller", dept: "Information Technology", email: "david.miller@college.edu" },
      { id: "prof_3", name: "Prof. Robert Chen", dept: "AI & Data Science", email: "robert.chen@college.edu" },
      { id: "prof_4", name: "Dr. Ananya Rao", dept: "Computer Engineering", email: "ananya.rao@college.edu" },
      { id: "prof_5", name: "Prof. Marcus Vance", dept: "Cyber Security", email: "marcus.vance@college.edu" },
      { id: "prof_6", name: "Dr. Vikram Joshi", dept: "Electronics & Telecom", email: "vikram.joshi@college.edu" },
      { id: "prof_7", name: "Prof. Elena Rostova", dept: "Mechanical Engineering", email: "elena.rostova@college.edu" }
    ];

    const users = [];
    const professors = [];

    profRawData.forEach((p, idx) => {
      const uId = `u_p${idx + 1}`;
      users.push({ id: uId, email: p.email, password: "password123", role: "Professor" });
      professors.push({ id: p.id, user_id: uId, full_name: p.name, department: p.dept });
    });

    // 2. Create 14 Subjects assigned across the 7 Professors
    const subjects = [
      { id: "subj_1", name: "Computer Networks", professor_id: "prof_1" },
      { id: "subj_2", name: "Software Engineering", professor_id: "prof_1" },
      { id: "subj_3", name: "Database Systems", professor_id: "prof_2" },
      { id: "subj_4", name: "Web Development", professor_id: "prof_2" },
      { id: "subj_5", name: "Machine Learning", professor_id: "prof_3" },
      { id: "subj_6", name: "Artificial Intelligence", professor_id: "prof_3" },
      { id: "subj_7", name: "Data Structures & Algorithms", professor_id: "prof_4" },
      { id: "subj_8", name: "Operating Systems", professor_id: "prof_4" },
      { id: "subj_9", name: "Cybersecurity Fundamentals", professor_id: "prof_5" },
      { id: "subj_10", name: "Cloud Computing", professor_id: "prof_5" },
      { id: "subj_11", name: "Digital Signal Processing", professor_id: "prof_6" },
      { id: "subj_12", name: "Embedded Systems", professor_id: "prof_6" },
      { id: "subj_13", name: "Robotics & Automation", professor_id: "prof_7" },
      { id: "subj_14", name: "Fluid Mechanics", professor_id: "prof_7" }
    ];

    // 3. Create 70 Students & User Accounts (S001 to S070)
    const studentNames = [
      "Aryan Mane", "Jessica Taylor", "Rohan Sharma", "Priya Patel", "Liam Johnson",
      "Emma Watson", "Noah Al-Fayed", "Mia Chen", "Ethan Hunt", "Sophia Loren",
      "Aarav Verma", "Ananya Gupta", "Carlos Mendez", "Aisha Khan", "Rahul Deshmukh",
      "Chloe Bennett", "Devendra Singh", "Fatima Al-Zahra", "Gabriel Silva", "Hannah Abbott",
      "Ishaan Kapoor", "Julia Roberts", "Kavi Patel", "Leila Mansour", "Muhammad Ali",
      "Natasha Romanoff", "Omar Farooq", "Pooja Hegde", "Quentin Tarantino", "Rhea Chakraborty",
      "Siddharth Malhotra", "Tanvi Shah", "Umang Rathod", "Varun Dhawan", "Yash Vardhan",
      "Zoya Akhtar", "Alexander Great", "Bianca Censori", "Chirag Paswan", "Divya Agarwal",
      "Ekta Kapoor", "Felix Kjellberg", "Gayatri Devi", "Harsh Vardhan", "Inesh Roy",
      "Janhvi Kapoor", "Karan Johar", "Lavanya Tripathi", "Manish Malhotra", "Nidhi Agarwal",
      "Omkar Salunkhe", "Payal Rohatgi", "Qasim Khan", "Radhika Merchant", "Sahil Khan",
      "Tara Sutaria", "Utkarsh Sharma", "Vidya Balan", "William Shakespeare", "Xavier Hernandez",
      "Yamini Gautam", "Zaheer Khan", "Aditi Rao", "Bhavesh Joshi", "Charmi Kaur",
      "Deepak Dobriyal", "Eshaan Shanker", "Farhan Akhtar", "Gul Panag", "Himansh Kohli"
    ];

    const branches = ["Computer Engineering", "Information Technology", "AI & Data Science", "Electronics & Telecom", "Mechanical Engineering"];
    const divisions = ["A", "B"];

    const students = [];

    studentNames.forEach((name, idx) => {
      const numStr = String(idx + 1).padStart(2, "0");
      const uId = `u_s${idx + 1}`;
      const studId = `stud_${idx + 1}`;
      
      // Keep Aryan Mane as student01 / stud_1 with Roll 59
      const rollNo = (idx === 0) ? "59" : numStr;
      const email = (idx === 0) ? "aryan.mane@college.edu" : (idx === 1) ? "jessica.taylor@college.edu" : `student${numStr}@college.edu`;
      const branch = branches[idx % branches.length];
      const div = divisions[idx % divisions.length];

      users.push({
        id: uId,
        email: email,
        password: "password123",
        role: "Student"
      });

      students.push({
        id: studId,
        user_id: uId,
        full_name: name,
        roll_no: rollNo,
        division: div,
        branch: branch,
        profile_photo_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name.replace(/\s+/g, ''))}`
      });
    });

    // 4. Generate Historical Attendance for past 30 days for all 70 students
    const records = [];
    const statuses = ["Present", "Present", "Present", "Present", "Absent", "Late", "Present"];

    const isEnrolled = (student, subject) => {
      const map = {
        "Computer Engineering": ["subj_1", "subj_2", "subj_3", "subj_4", "subj_7", "subj_8"],
        "Information Technology": ["subj_1", "subj_3", "subj_4", "subj_9", "subj_10"],
        "AI & Data Science": ["subj_3", "subj_5", "subj_6", "subj_7"],
        "Electronics & Telecom": ["subj_1", "subj_4", "subj_11", "subj_12"],
        "Mechanical Engineering": ["subj_2", "subj_12", "subj_13", "subj_14"]
      };
      const allowed = map[student.branch] || ["subj_1", "subj_3"];
      return allowed.includes(subject.id);
    };

    const today = new Date();
    let recordCounter = 1;

    for (let i = 30; i >= 1; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split("T")[0];

      subjects.forEach(subject => {
        students.forEach(student => {
          if (isEnrolled(student, subject)) {
            const statusIndex = Math.floor(Math.random() * statuses.length);
            let status = statuses[statusIndex];

            // Controlled attendance variations for Aryan Mane and S002
            if (student.id === "stud_1" && (i === 3 || i === 8 || i === 12)) status = "Absent";
            if (student.id === "stud_2" && (i === 4 || i === 10)) status = "Absent";

            records.push({
              id: `rec_${recordCounter++}`,
              student_id: student.id,
              subject_id: subject.id,
              date: dateString,
              status: status
            });
          }
        });
      });
    }

    // 5. Seed Sample Leave Applications
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 2);
    const leaves = [
      {
        id: "leave_1",
        student_id: "stud_1", // Aryan Mane
        subject_id: "subj_1", // Computer Networks
        date: yesterday.toISOString().split("T")[0],
        reason: "High fever & viral infection. Doctor certificate attached.",
        status: "Pending",
        created_at: new Date().toISOString()
      },
      {
        id: "leave_2",
        student_id: "stud_2", // Jessica Taylor
        subject_id: "subj_4", // Database Systems
        date: yesterday.toISOString().split("T")[0],
        reason: "Inter-college Swimming Championship finals.",
        status: "Approved",
        created_at: new Date().toISOString()
      },
      {
        id: "leave_3",
        student_id: "stud_12", // Ananya Gupta
        subject_id: "subj_5", // Machine Learning
        date: yesterday.toISOString().split("T")[0],
        reason: "Attending National AI Hackathon.",
        status: "Pending",
        created_at: new Date().toISOString()
      }
    ];

    // Save to localStorage
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    localStorage.setItem(STORAGE_KEYS.PROFESSORS, JSON.stringify(professors));
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
    localStorage.setItem(STORAGE_KEYS.LEAVES, JSON.stringify(leaves));
    localStorage.setItem(STORAGE_KEYS.DB_INITIALIZED, "true");
  }

  static getData(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
  }

  static saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  static isStudentEnrolled(student, subjectId) {
    const map = {
      "Computer Engineering": ["subj_1", "subj_2", "subj_3", "subj_4", "subj_7", "subj_8"],
      "Information Technology": ["subj_1", "subj_3", "subj_4", "subj_9", "subj_10"],
      "AI & Data Science": ["subj_3", "subj_5", "subj_6", "subj_7"],
      "Electronics & Telecom": ["subj_1", "subj_4", "subj_11", "subj_12"],
      "Mechanical Engineering": ["subj_2", "subj_12", "subj_13", "subj_14"]
    };
    const allowed = map[student.branch] || ["subj_1", "subj_3"];
    return allowed.includes(subjectId);
  }

  static resetAttendanceRecords() {
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.LEAVES, JSON.stringify([]));
  }

  static exportDatabaseBackup() {
    return {
      version: DB_VERSION,
      timestamp: new Date().toISOString(),
      users: AttendanceDB.getData(STORAGE_KEYS.USERS),
      professors: AttendanceDB.getData(STORAGE_KEYS.PROFESSORS),
      subjects: AttendanceDB.getData(STORAGE_KEYS.SUBJECTS),
      students: AttendanceDB.getData(STORAGE_KEYS.STUDENTS),
      records: AttendanceDB.getData(STORAGE_KEYS.RECORDS),
      leaves: AttendanceDB.getData(STORAGE_KEYS.LEAVES)
    };
  }

  static importDatabaseBackup(backupObj) {
    if (!backupObj || !backupObj.users || !backupObj.students) {
      throw new Error("Invalid database backup JSON format.");
    }
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(backupObj.users));
    localStorage.setItem(STORAGE_KEYS.PROFESSORS, JSON.stringify(backupObj.professors));
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(backupObj.subjects));
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(backupObj.students));
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(backupObj.records || []));
    localStorage.setItem(STORAGE_KEYS.LEAVES, JSON.stringify(backupObj.leaves || []));
    localStorage.setItem(STORAGE_KEYS.DB_INITIALIZED, "true");
  }

  static reseedDatabase() {
    localStorage.removeItem(STORAGE_KEYS.DB_INITIALIZED);
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.PROFESSORS);
    localStorage.removeItem(STORAGE_KEYS.SUBJECTS);
    localStorage.removeItem(STORAGE_KEYS.STUDENTS);
    localStorage.removeItem(STORAGE_KEYS.RECORDS);
    localStorage.removeItem(STORAGE_KEYS.LEAVES);
    AttendanceDB.init();
  }
}

// Current Session State
let currentUser = null;
let selectedSubjectId = "";
let selectedDate = new Date().toISOString().split("T")[0];
let tempAttendance = {};
let activeStudentTab = "overview";
let currentCalendarMonth = new Date().getMonth();
let currentCalendarYear = new Date().getFullYear();

// Initialize DB on script load
AttendanceDB.init();

document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

function initApp() {
  const storedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  if (storedUser) {
    currentUser = JSON.parse(storedUser);
    showDashboard();
  } else {
    showView("login-view");
  }
  
  setupEventListeners();
  populateQuickSwitcher();
}

function showView(viewId) {
  const views = ["login-view", "professor-dashboard", "student-dashboard"];
  views.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      if (id === viewId) {
        el.classList.remove("hidden");
      } else {
        el.classList.add("hidden");
      }
    }
  });

  const navContainer = document.getElementById("nav-container");
  if (currentUser) {
    navContainer.classList.remove("hidden");
    document.getElementById("user-display-name").textContent = currentUser.name;
    document.getElementById("user-display-role").textContent = currentUser.role;
  } else {
    navContainer.classList.add("hidden");
  }
}

function populateQuickSwitcher() {
  const switcher = document.getElementById("quick-user-switcher");
  if (!switcher) return;

  switcher.innerHTML = `<option value="" disabled selected>Switch Account (Demo)</option>`;
  
  // Professors
  const profs = AttendanceDB.getData(STORAGE_KEYS.PROFESSORS);
  const users = AttendanceDB.getData(STORAGE_KEYS.USERS);
  
  const profGroup = document.createElement("optgroup");
  profGroup.label = "Professors";
  profs.forEach(p => {
    const u = users.find(usr => usr.id === p.user_id);
    const opt = document.createElement("option");
    opt.value = u.id;
    opt.textContent = `${p.full_name} (${p.department})`;
    profGroup.appendChild(opt);
  });
  switcher.appendChild(profGroup);

  // Students
  const studs = AttendanceDB.getData(STORAGE_KEYS.STUDENTS);
  const studGroup = document.createElement("optgroup");
  studGroup.label = "Students";
  studs.forEach(s => {
    const u = users.find(usr => usr.id === s.user_id);
    const opt = document.createElement("option");
    opt.value = u.id;
    opt.textContent = `${s.full_name} (Roll ${s.roll_no} - ${s.branch})`;
    studGroup.appendChild(opt);
  });
  switcher.appendChild(studGroup);

  switcher.addEventListener("change", (e) => {
    switchUserById(e.target.value);
  });
}

function switchUserById(userId) {
  const users = AttendanceDB.getData(STORAGE_KEYS.USERS);
  const user = users.find(u => u.id === userId);
  if (!user) return;

  currentUser = {
    id: user.id,
    email: user.email,
    role: user.role,
    profileId: "",
    name: ""
  };

  if (user.role === "Professor") {
    const profs = AttendanceDB.getData(STORAGE_KEYS.PROFESSORS);
    const prof = profs.find(p => p.user_id === user.id);
    if (prof) {
      currentUser.profileId = prof.id;
      currentUser.name = prof.full_name;
    }
  } else {
    const studs = AttendanceDB.getData(STORAGE_KEYS.STUDENTS);
    const stud = studs.find(s => s.user_id === user.id);
    if (stud) {
      currentUser.profileId = stud.id;
      currentUser.name = stud.full_name;
    }
  }

  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
  showDashboard();
  showToast(`Switched account to ${currentUser.name} (${currentUser.role})`);
}

function setupEventListeners() {
  // Login Form
  const loginForm = document.getElementById("login-form");
  if (loginForm) loginForm.addEventListener("submit", handleLogin);

  // Logout Button
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) logoutBtn.addEventListener("click", handleLogout);

  // Professor controls
  const subjSelect = document.getElementById("subject-select");
  if (subjSelect) {
    subjSelect.addEventListener("change", (e) => {
      selectedSubjectId = e.target.value;
      loadAttendanceGrid();
    });
  }

  const dateInput = document.getElementById("date-select");
  if (dateInput) {
    dateInput.value = selectedDate;
    dateInput.addEventListener("change", (e) => {
      selectedDate = e.target.value;
      loadAttendanceGrid();
    });
  }

  const searchStudentInput = document.getElementById("search-student-grid");
  if (searchStudentInput) {
    searchStudentInput.addEventListener("input", filterAttendanceGrid);
  }

  const markAllPresentBtn = document.getElementById("btn-mark-all-present");
  if (markAllPresentBtn) {
    markAllPresentBtn.addEventListener("click", () => bulkSetStatus("Present"));
  }

  const markAllAbsentBtn = document.getElementById("btn-mark-all-absent");
  if (markAllAbsentBtn) {
    markAllAbsentBtn.addEventListener("click", () => bulkSetStatus("Absent"));
  }

  const submitAttendanceBtn = document.getElementById("submit-attendance");
  if (submitAttendanceBtn) submitAttendanceBtn.addEventListener("click", submitAttendance);

  const exportExcelBtn = document.getElementById("export-excel");
  if (exportExcelBtn) exportExcelBtn.addEventListener("click", exportAttendanceHistory);

  const exportMonthlyBtn = document.getElementById("export-monthly-csv");
  if (exportMonthlyBtn) exportMonthlyBtn.addEventListener("click", exportMonthlyAttendanceHistory);

  // Leave application form submit
  const leaveForm = document.getElementById("student-leave-form");
  if (leaveForm) leaveForm.addEventListener("submit", handleLeaveSubmit);

  // History log filters
  const historySearch = document.getElementById("history-search-input");
  if (historySearch) historySearch.addEventListener("input", renderStudentHistoryTable);

  const historyStatus = document.getElementById("history-status-filter");
  if (historyStatus) historyStatus.addEventListener("change", renderStudentHistoryTable);

  // Calculator slider
  const calcSlider = document.getElementById("calc-target-slider");
  if (calcSlider) {
    calcSlider.addEventListener("input", (e) => {
      document.getElementById("calc-target-value").textContent = `${e.target.value}%`;
      calculateAttendanceGoal();
    });
  }

  // Admin Data Panel Controls
  const adminModalBtn = document.getElementById("admin-modal-btn");
  if (adminModalBtn) adminModalBtn.addEventListener("click", openAdminModal);

  const closeAdminModalBtn = document.getElementById("close-admin-modal-btn");
  if (closeAdminModalBtn) closeAdminModalBtn.addEventListener("click", closeAdminModal);

  const exportBackupBtn = document.getElementById("btn-export-db-json");
  if (exportBackupBtn) exportBackupBtn.addEventListener("click", handleExportBackup);

  const importBackupBtn = document.getElementById("btn-import-db-json");
  if (importBackupBtn) importBackupBtn.addEventListener("click", () => {
    document.getElementById("import-db-file").click();
  });

  const importFileInput = document.getElementById("import-db-file");
  if (importFileInput) importFileInput.addEventListener("change", handleImportBackup);

  const reseedBtn = document.getElementById("btn-reseed-db");
  if (reseedBtn) reseedBtn.addEventListener("click", handleReseedData);

  const clearLogsBtn = document.getElementById("btn-clear-attendance-logs");
  if (clearLogsBtn) clearLogsBtn.addEventListener("click", handleClearLogs);
}

// ADMIN & DATA MANAGEMENT HANDLERS
function openAdminModal() {
  const modal = document.getElementById("admin-data-modal");
  if (!modal) return;

  const profs = AttendanceDB.getData(STORAGE_KEYS.PROFESSORS);
  const studs = AttendanceDB.getData(STORAGE_KEYS.STUDENTS);
  const subjs = AttendanceDB.getData(STORAGE_KEYS.SUBJECTS);
  const recs = AttendanceDB.getData(STORAGE_KEYS.RECORDS);
  const leaves = AttendanceDB.getData(STORAGE_KEYS.LEAVES);

  if (document.getElementById("admin-stat-teachers")) document.getElementById("admin-stat-teachers").textContent = profs.length;
  if (document.getElementById("admin-stat-students")) document.getElementById("admin-stat-students").textContent = studs.length;
  if (document.getElementById("admin-stat-subjects")) document.getElementById("admin-stat-subjects").textContent = subjs.length;
  if (document.getElementById("admin-stat-records")) document.getElementById("admin-stat-records").textContent = recs.length;
  if (document.getElementById("admin-stat-leaves")) document.getElementById("admin-stat-leaves").textContent = leaves.length;

  modal.classList.remove("hidden");
}

function closeAdminModal() {
  const modal = document.getElementById("admin-data-modal");
  if (modal) modal.classList.add("hidden");
}

function handleExportBackup() {
  const backup = AttendanceDB.exportDatabaseBackup();
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup, null, 2));
  const link = document.createElement("a");
  link.setAttribute("href", dataStr);
  link.setAttribute("download", `apex_college_attendance_db_backup_${new Date().toISOString().split("T")[0]}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast("Database backup JSON downloaded!");
}

function handleImportBackup(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const backupObj = JSON.parse(event.target.result);
      AttendanceDB.importDatabaseBackup(backupObj);
      showToast("Database restored successfully!");
      closeAdminModal();
      location.reload();
    } catch (err) {
      showToast("Failed to import database: " + err.message, "error");
    }
  };
  reader.readAsText(file);
}

function handleReseedData() {
  if (confirm("Reset database to fresh seeded state (7 Teachers, 70 Students, 14 Subjects)?")) {
    AttendanceDB.reseedDatabase();
    showToast("Database re-seeded successfully!");
    closeAdminModal();
    location.reload();
  }
}

function handleClearLogs() {
  if (confirm("Clear all attendance logs and leave requests? Accounts will be preserved.")) {
    AttendanceDB.resetAttendanceRecords();
    showToast("Attendance logs cleared!");
    closeAdminModal();
    if (currentUser) showDashboard();
  }
}

// Authentication Handlers
function handleLogin(e) {
  e.preventDefault();
  
  const emailInput = document.getElementById("login-email").value.trim().toLowerCase();
  const passwordInput = document.getElementById("login-password").value;
  const loginError = document.getElementById("login-error");

  const users = AttendanceDB.getData(STORAGE_KEYS.USERS);
  const user = users.find(u => u.email === emailInput && u.password === passwordInput);

  if (!user) {
    loginError.textContent = "Invalid email or password.";
    loginError.classList.remove("hidden");
    return;
  }

  loginError.classList.add("hidden");
  switchUserById(user.id);
}

function handleLogout() {
  currentUser = null;
  selectedSubjectId = "";
  tempAttendance = {};
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  const mobileNav = document.getElementById("mobile-bottom-nav");
  if (mobileNav) mobileNav.classList.add("hidden");
  showView("login-view");
  
  document.getElementById("login-form").reset();
  document.getElementById("login-error").classList.add("hidden");
}

function showDashboard() {
  if (currentUser.role === "Professor") {
    showView("professor-dashboard");
    initProfessorDashboard();
    renderMobileBottomNav("Professor");
  } else {
    showView("student-dashboard");
    initStudentDashboard();
    renderMobileBottomNav("Student");
  }
}

function renderMobileBottomNav(role) {
  let navEl = document.getElementById("mobile-bottom-nav");
  if (!navEl) {
    navEl = document.createElement("nav");
    navEl.id = "mobile-bottom-nav";
    document.body.appendChild(navEl);
  }

  navEl.className = "fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-slate-950/90 backdrop-blur-lg border-t border-slate-800/80 px-2 py-1.5 flex items-center justify-around shadow-2xl transition-all";

  if (role === "Student") {
    navEl.innerHTML = `
      <button onclick="switchStudentTab('overview')" class="flex flex-col items-center p-1.5 text-slate-400 hover:text-indigo-400 focus:text-indigo-400 transition">
        <svg class="h-5 w-5 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
        <span class="text-[10px] font-semibold">Overview</span>
      </button>
      <button onclick="switchStudentTab('calculator')" class="flex flex-col items-center p-1.5 text-slate-400 hover:text-indigo-400 focus:text-indigo-400 transition">
        <svg class="h-5 w-5 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
        <span class="text-[10px] font-semibold">Calculator</span>
      </button>
      <button onclick="switchStudentTab('calendar')" class="flex flex-col items-center p-1.5 text-slate-400 hover:text-indigo-400 focus:text-indigo-400 transition">
        <svg class="h-5 w-5 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
        <span class="text-[10px] font-semibold">Calendar</span>
      </button>
      <button onclick="switchStudentTab('leave')" class="flex flex-col items-center p-1.5 text-slate-400 hover:text-indigo-400 focus:text-indigo-400 transition">
        <svg class="h-5 w-5 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
        <span class="text-[10px] font-semibold">Leaves</span>
      </button>
      <button onclick="switchStudentTab('history')" class="flex flex-col items-center p-1.5 text-slate-400 hover:text-indigo-400 focus:text-indigo-400 transition">
        <svg class="h-5 w-5 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        <span class="text-[10px] font-semibold">Logs</span>
      </button>
    `;
  } else {
    navEl.innerHTML = `
      <button onclick="scrollToProfSection('students-attendance-grid')" class="flex flex-col items-center p-1.5 text-slate-400 hover:text-indigo-400 transition">
        <svg class="h-5 w-5 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
        <span class="text-[10px] font-semibold">Grid</span>
      </button>
      <button onclick="scrollToProfSection('prof-leave-applications')" class="flex flex-col items-center p-1.5 text-slate-400 hover:text-indigo-400 transition">
        <svg class="h-5 w-5 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
        <span class="text-[10px] font-semibold">Leaves</span>
      </button>
      <button onclick="bulkSetStatus('Present')" class="flex flex-col items-center p-1.5 text-emerald-400 hover:text-emerald-300 transition">
        <svg class="h-5 w-5 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
        <span class="text-[10px] font-semibold">All Present</span>
      </button>
      <button onclick="exportMonthlyAttendanceHistory()" class="flex flex-col items-center p-1.5 text-indigo-400 hover:text-indigo-300 transition">
        <svg class="h-5 w-5 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
        <span class="text-[10px] font-semibold">Monthly CSV</span>
      </button>
    `;
  }
}

function scrollToProfSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// PROFESSOR DASHBOARD LOGIC
function initProfessorDashboard() {
  const subjSelect = document.getElementById("subject-select");
  subjSelect.innerHTML = '<option value="" disabled selected>Select Subject</option>';

  const subjects = AttendanceDB.getData(STORAGE_KEYS.SUBJECTS);
  const profSubjects = subjects.filter(s => s.professor_id === currentUser.profileId);

  profSubjects.forEach(s => {
    const option = document.createElement("option");
    option.value = s.id;
    option.textContent = s.name;
    subjSelect.appendChild(option);
  });

  // Clear grid
  document.getElementById("students-attendance-grid").innerHTML = `
    <div class="col-span-full py-12 text-center text-slate-400">
      <svg class="mx-auto h-12 w-12 text-slate-500 mb-3 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
      <span class="text-lg font-medium">Please select a subject and class date to load students.</span>
    </div>
  `;
  
  document.getElementById("submit-attendance").disabled = true;
  document.getElementById("export-excel").disabled = true;
  if (document.getElementById("export-monthly-csv")) document.getElementById("export-monthly-csv").disabled = true;
  document.getElementById("btn-mark-all-present").disabled = true;
  document.getElementById("btn-mark-all-absent").disabled = true;

  // Load Leave Applications for this Professor
  loadProfessorLeaveApplications();
}

function loadAttendanceGrid() {
  if (!selectedSubjectId) return;

  const students = AttendanceDB.getData(STORAGE_KEYS.STUDENTS);
  const enrolledStudents = students.filter(s => AttendanceDB.isStudentEnrolled(s, selectedSubjectId));
  
  const records = AttendanceDB.getData(STORAGE_KEYS.RECORDS);
  const existingRecords = records.filter(r => r.subject_id === selectedSubjectId && r.date === selectedDate);
  
  tempAttendance = {};
  enrolledStudents.forEach(s => {
    const existing = existingRecords.find(r => r.student_id === s.id);
    tempAttendance[s.id] = existing ? existing.status : "Present";
  });

  renderStudentCards(enrolledStudents);

  document.getElementById("submit-attendance").disabled = false;
  document.getElementById("export-excel").disabled = false;
  if (document.getElementById("export-monthly-csv")) document.getElementById("export-monthly-csv").disabled = false;
  document.getElementById("btn-mark-all-present").disabled = false;
  document.getElementById("btn-mark-all-absent").disabled = false;
  
  updateClassStatsBar(enrolledStudents.length);
}

function renderStudentCards(enrolledStudents) {
  const grid = document.getElementById("students-attendance-grid");
  grid.innerHTML = "";

  if (enrolledStudents.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full py-12 text-center text-slate-400">
        <p class="text-lg">No students enrolled matching search criteria.</p>
      </div>
    `;
    return;
  }

  enrolledStudents.forEach(s => {
    const card = document.createElement("div");
    card.className = "student-card-item bg-slate-800 border border-slate-700/60 rounded-2xl p-5 shadow-xl transition-all duration-300 hover:border-slate-600/80 hover:shadow-2xl flex flex-col justify-between";
    card.setAttribute("data-name", s.full_name.toLowerCase());
    card.setAttribute("data-roll", s.roll_no.toLowerCase());
    card.id = `student-card-${s.id}`;

    const cardHeader = `
      <div class="flex items-center space-x-4 mb-5">
        <div class="relative">
          <img src="${s.profile_photo_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + s.full_name}" 
               alt="${s.full_name}" 
               class="w-14 h-14 rounded-full border border-slate-600 bg-slate-900 shadow-md">
          <span id="badge-${s.id}" class="absolute -bottom-1 -right-1 flex h-4 w-4">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"></span>
            <span class="relative inline-flex rounded-full h-4 w-4"></span>
          </span>
        </div>
        <div class="min-w-0 flex-1">
          <h4 class="text-slate-100 font-semibold truncate text-base leading-snug">${s.full_name}</h4>
          <div class="flex flex-wrap gap-x-2 text-xs text-slate-400 mt-1">
            <span>Roll: <strong class="text-indigo-400 font-medium">${s.roll_no}</strong></span>
            <span>•</span>
            <span>Div: <strong class="text-indigo-400 font-medium">${s.division}</strong></span>
          </div>
        </div>
      </div>
    `;

    const buttons = `
      <div class="grid grid-cols-3 gap-2">
        <button onclick="setStudentStatus('${s.id}', 'Present')" id="btn-${s.id}-Present" class="status-btn font-medium py-2 px-1 rounded-xl text-xs transition-all duration-200 border flex items-center justify-center space-x-1">
          <span>Present</span>
        </button>
        <button onclick="setStudentStatus('${s.id}', 'Absent')" id="btn-${s.id}-Absent" class="status-btn font-medium py-2 px-1 rounded-xl text-xs transition-all duration-200 border flex items-center justify-center space-x-1">
          <span>Absent</span>
        </button>
        <button onclick="setStudentStatus('${s.id}', 'Late')" id="btn-${s.id}-Late" class="status-btn font-medium py-2 px-1 rounded-xl text-xs transition-all duration-200 border flex items-center justify-center space-x-1">
          <span>Late</span>
        </button>
      </div>
    `;

    card.innerHTML = cardHeader + buttons;
    grid.appendChild(card);
    updateButtonStyles(s.id);
  });
}

function filterAttendanceGrid() {
  const query = document.getElementById("search-student-grid").value.trim().toLowerCase();
  const cards = document.querySelectorAll(".student-card-item");
  cards.forEach(card => {
    const name = card.getAttribute("data-name");
    const roll = card.getAttribute("data-roll");
    if (name.includes(query) || roll.includes(query)) {
      card.classList.remove("hidden");
    } else {
      card.classList.add("hidden");
    }
  });
}

function bulkSetStatus(status) {
  Object.keys(tempAttendance).forEach(sId => {
    tempAttendance[sId] = status;
    updateButtonStyles(sId);
  });
  updateClassStatsBar(Object.keys(tempAttendance).length);
  showToast(`Marked all students as ${status}`);
}

function setStudentStatus(studentId, status) {
  tempAttendance[studentId] = status;
  updateButtonStyles(studentId);
  updateClassStatsBar(Object.keys(tempAttendance).length);
}

function updateButtonStyles(studentId) {
  const currentStatus = tempAttendance[studentId];
  const states = {
    Present: {
      btnClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20",
      activeClass: "bg-emerald-500 text-slate-900 border-emerald-500 shadow-lg shadow-emerald-500/20 font-bold",
      badgeColor: "bg-emerald-500"
    },
    Absent: {
      btnClass: "bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20",
      activeClass: "bg-rose-500 text-slate-900 border-rose-500 shadow-lg shadow-rose-500/20 font-bold",
      badgeColor: "bg-rose-500"
    },
    Late: {
      btnClass: "bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20",
      activeClass: "bg-amber-500 text-slate-900 border-amber-500 shadow-lg shadow-amber-500/20 font-bold",
      badgeColor: "bg-amber-500"
    }
  };

  ["Present", "Absent", "Late"].forEach(status => {
    const btn = document.getElementById(`btn-${studentId}-${status}`);
    if (btn) {
      btn.className = "status-btn font-medium py-2 px-1 rounded-xl text-xs transition-all duration-200 border flex items-center justify-center space-x-1";
      if (status === currentStatus) {
        btn.className += " " + states[status].activeClass;
      } else {
        btn.className += " " + states[status].btnClass;
      }
    }
  });

  const badge = document.getElementById(`badge-${studentId}`);
  if (badge) {
    const pingDot = badge.children[0];
    const solidDot = badge.children[1];
    pingDot.className = "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 " + states[currentStatus].badgeColor;
    solidDot.className = "relative inline-flex rounded-full h-4 w-4 " + states[currentStatus].badgeColor;
  }
}

function updateClassStatsBar(totalCount) {
  if (totalCount === 0) return;
  const values = Object.values(tempAttendance);
  const present = values.filter(v => v === "Present").length;
  const absent = values.filter(v => v === "Absent").length;
  const late = values.filter(v => v === "Late").length;

  const pPct = Math.round((present / totalCount) * 100);
  
  const statsEl = document.getElementById("class-attendance-summary");
  if (statsEl) {
    statsEl.innerHTML = `
      <span class="text-emerald-400 font-bold">${present} Present (${pPct}%)</span> • 
      <span class="text-rose-400 font-bold">${absent} Absent</span> • 
      <span class="text-amber-400 font-bold">${late} Late</span>
    `;
  }
}

function submitAttendance() {
  if (!selectedSubjectId) return;

  const records = AttendanceDB.getData(STORAGE_KEYS.RECORDS);
  let updatedRecords = records.filter(r => !(r.subject_id === selectedSubjectId && r.date === selectedDate));
  
  let newRecordCounter = records.length + 1;

  Object.keys(tempAttendance).forEach(studentId => {
    updatedRecords.push({
      id: `rec_${newRecordCounter++}`,
      student_id: studentId,
      subject_id: selectedSubjectId,
      date: selectedDate,
      status: tempAttendance[studentId]
    });
  });

  AttendanceDB.saveData(STORAGE_KEYS.RECORDS, updatedRecords);
  showToast("Attendance submitted successfully!");
  loadAttendanceGrid();
}

function exportAttendanceHistory() {
  if (!selectedSubjectId) return;

  const subjects = AttendanceDB.getData(STORAGE_KEYS.SUBJECTS);
  const subjectName = subjects.find(s => s.id === selectedSubjectId)?.name || "Subject";
  
  const records = AttendanceDB.getData(STORAGE_KEYS.RECORDS);
  const students = AttendanceDB.getData(STORAGE_KEYS.STUDENTS);
  
  const subjectRecords = records.filter(r => r.subject_id === selectedSubjectId);

  if (subjectRecords.length === 0) {
    showToast("No attendance data found to export.", "error");
    return;
  }

  subjectRecords.sort((a, b) => b.date.localeCompare(a.date));

  const csvHeaders = ["Date", "Student Name", "Roll No", "Status"];
  const csvRows = [csvHeaders.join(",")];

  subjectRecords.forEach(r => {
    const student = students.find(s => s.id === r.student_id);
    const row = [
      r.date,
      `"${student ? student.full_name : 'Unknown'}"`,
      student ? student.roll_no : "",
      r.status
    ];
    csvRows.push(row.join(","));
  });

  const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
  const encodedUri = encodeURI(csvContent);
  
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${subjectName.replace(/\s+/g, "_")}_Attendance_Report.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast("CSV report exported successfully!");
}

function exportMonthlyAttendanceHistory() {
  if (!selectedSubjectId) {
    showToast("Please select a subject first.", "error");
    return;
  }

  const monthSelect = document.getElementById("export-month-select");
  const yearSelect = document.getElementById("export-year-select");
  
  const selectedMonth = parseInt(monthSelect ? monthSelect.value : new Date().getMonth(), 10);
  const selectedYear = parseInt(yearSelect ? yearSelect.value : new Date().getFullYear(), 10);

  const subjects = AttendanceDB.getData(STORAGE_KEYS.SUBJECTS);
  const subject = subjects.find(s => s.id === selectedSubjectId);
  const subjectName = subject ? subject.name : "Subject";
  
  const records = AttendanceDB.getData(STORAGE_KEYS.RECORDS);
  const students = AttendanceDB.getData(STORAGE_KEYS.STUDENTS);

  const monthlyRecords = records.filter(r => {
    if (r.subject_id !== selectedSubjectId) return false;
    const parts = (r.date || "").split("-");
    if (parts.length !== 3) return false;
    const rYear = parseInt(parts[0], 10);
    const rMonth = parseInt(parts[1], 10) - 1; // 0-indexed: 0=Jan, 7=Aug
    return rMonth === selectedMonth && rYear === selectedYear;
  });

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  if (monthlyRecords.length === 0) {
    showToast(`No records found for ${monthNames[selectedMonth]} ${selectedYear}. Try another month!`, "error");
    return;
  }

  monthlyRecords.sort((a, b) => {
    if (a.date !== b.date) return b.date.localeCompare(a.date);
    const sA = students.find(s => s.id === a.student_id)?.full_name || "";
    const sB = students.find(s => s.id === b.student_id)?.full_name || "";
    return sA.localeCompare(sB);
  });

  const csvRows = [
    `"Monthly Attendance Report - ${subjectName}"`,
    `"Month: ${monthNames[selectedMonth]} ${selectedYear}"`,
    `""`,
    `"Date","Student Name","Roll No","Division","Status"`
  ];

  monthlyRecords.forEach(r => {
    const student = students.find(s => s.id === r.student_id);
    const row = [
      r.date,
      `"${student ? student.full_name : 'Unknown'}"`,
      student ? student.roll_no : "",
      student ? student.division : "",
      r.status
    ];
    csvRows.push(row.join(","));
  });

  csvRows.push(`""`);
  csvRows.push(`"--- MONTHLY STUDENT SUMMARY ---"`);
  csvRows.push(`"Student Name","Roll No","Division","Present Count","Absent Count","Late Count","Monthly Attendance %"`);

  const enrolledStudents = students.filter(s => AttendanceDB.isStudentEnrolled(s, selectedSubjectId));
  enrolledStudents.forEach(s => {
    const sRecs = monthlyRecords.filter(r => r.student_id === s.id);
    const pCount = sRecs.filter(r => r.status === "Present").length;
    const aCount = sRecs.filter(r => r.status === "Absent").length;
    const lCount = sRecs.filter(r => r.status === "Late").length;
    const total = sRecs.length;
    const pct = total > 0 ? Math.round(((pCount + lCount) / total) * 100) : 0;

    csvRows.push(`"${s.full_name}","${s.roll_no}","${s.division}",${pCount},${aCount},${lCount},"${pct}%"`);
  });

  const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
  const encodedUri = encodeURI(csvContent);
  
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${subjectName.replace(/\s+/g, "_")}_${monthNames[selectedMonth]}_${selectedYear}_Attendance_Report.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast(`Exported Monthly CSV for ${monthNames[selectedMonth]} ${selectedYear}!`);
}

function loadProfessorLeaveApplications() {
  const container = document.getElementById("prof-leave-applications");
  if (!container) return;

  const leaves = AttendanceDB.getData(STORAGE_KEYS.LEAVES);
  const subjects = AttendanceDB.getData(STORAGE_KEYS.SUBJECTS);
  const students = AttendanceDB.getData(STORAGE_KEYS.STUDENTS);

  const profSubjects = subjects.filter(s => s.professor_id === currentUser.profileId).map(s => s.id);
  const relevantLeaves = leaves.filter(l => profSubjects.includes(l.subject_id) || l.subject_id === "ALL");

  container.innerHTML = "";

  if (relevantLeaves.length === 0) {
    container.innerHTML = `<p class="text-sm text-slate-400 text-center py-4">No pending leave applications.</p>`;
    return;
  }

  relevantLeaves.forEach(l => {
    const student = students.find(s => s.id === l.student_id);
    const subject = subjects.find(s => s.id === l.subject_id);

    const card = document.createElement("div");
    card.className = "bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4";

    const badgeColor = l.status === "Pending" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                       l.status === "Approved" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                       "bg-rose-500/10 text-rose-400 border-rose-500/20";

    card.innerHTML = `
      <div class="space-y-1">
        <div class="flex items-center space-x-2">
          <span class="font-bold text-slate-100 text-sm">${student ? student.full_name : 'Student'}</span>
          <span class="text-xs text-indigo-400 font-mono">(Roll ${student ? student.roll_no : ''})</span>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold border ${badgeColor}">${l.status}</span>
        </div>
        <p class="text-xs text-slate-400">Date: <strong class="text-slate-200">${formatDateString(l.date)}</strong> | Subject: <strong class="text-slate-200">${subject ? subject.name : 'All Subjects'}</strong></p>
        <p class="text-xs text-slate-300 italic bg-slate-950/60 p-2.5 rounded-xl border border-slate-850">"${l.reason}"</p>
      </div>

      ${l.status === "Pending" ? `
        <div class="flex items-center space-x-2 w-full sm:w-auto">
          <button onclick="updateLeaveStatus('${l.id}', 'Approved')" class="flex-1 sm:flex-none px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 text-xs font-semibold">
            Approve
          </button>
          <button onclick="updateLeaveStatus('${l.id}', 'Rejected')" class="flex-1 sm:flex-none px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 text-xs font-semibold">
            Reject
          </button>
        </div>
      ` : ''}
    `;

    container.appendChild(card);
  });
}

function updateLeaveStatus(leaveId, newStatus) {
  const leaves = AttendanceDB.getData(STORAGE_KEYS.LEAVES);
  const leave = leaves.find(l => l.id === leaveId);
  if (!leave) return;

  leave.status = newStatus;
  AttendanceDB.saveData(STORAGE_KEYS.LEAVES, leaves);

  // If approved, update attendance record to "Present" (Excused)
  if (newStatus === "Approved") {
    const records = AttendanceDB.getData(STORAGE_KEYS.RECORDS);
    const existingRec = records.find(r => r.student_id === leave.student_id && r.date === leave.date && r.subject_id === leave.subject_id);
    if (existingRec) {
      existingRec.status = "Present";
    } else {
      records.push({
        id: `rec_${records.length + 1}`,
        student_id: leave.student_id,
        subject_id: leave.subject_id,
        date: leave.date,
        status: "Present"
      });
    }
    AttendanceDB.saveData(STORAGE_KEYS.RECORDS, records);
  }

  showToast(`Leave application ${newStatus.toLowerCase()}!`);
  loadProfessorLeaveApplications();
}

// STUDENT DASHBOARD LOGIC
let studentCharts = [];

function switchStudentTab(tabName) {
  activeStudentTab = tabName;
  const tabs = ["overview", "calculator", "calendar", "leave", "history"];
  
  tabs.forEach(t => {
    const btn = document.getElementById(`tab-btn-${t}`);
    const view = document.getElementById(`student-tab-${t}`);
    if (btn && view) {
      if (t === tabName) {
        btn.className = "px-4 py-2 rounded-xl text-xs font-extrabold btn-gradient text-white shadow-lg transition-all duration-200";
        view.classList.remove("hidden");
      } else {
        btn.className = "px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all duration-200";
        view.classList.add("hidden");
      }
    }
  });

  if (tabName === "calendar") renderStudentCalendar();
  if (tabName === "calculator") calculateAttendanceGoal();
  if (tabName === "history") renderStudentHistoryTable();
  if (tabName === "leave") loadStudentLeaveApplications();
}

function initStudentDashboard() {
  const students = AttendanceDB.getData(STORAGE_KEYS.STUDENTS);
  const student = students.find(s => s.id === currentUser.profileId);
  
  if (!student) return;

  studentCharts.forEach(chart => chart.destroy());
  studentCharts = [];

  // Update Profile Header
  document.getElementById("student-profile-photo").src = student.profile_photo_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + student.full_name;
  document.getElementById("student-profile-name").textContent = student.full_name;
  document.getElementById("student-roll-no").textContent = student.roll_no;
  document.getElementById("student-division").textContent = student.division;
  document.getElementById("student-branch").textContent = student.branch;

  const subjects = AttendanceDB.getData(STORAGE_KEYS.SUBJECTS);
  const enrolledSubjects = subjects.filter(s => AttendanceDB.isStudentEnrolled(student, s.id));
  
  const records = AttendanceDB.getData(STORAGE_KEYS.RECORDS);
  const studentRecords = records.filter(r => r.student_id === student.id);

  // Populate Subject Selectors for Calculator and Leave Form
  populateSubjectDropdowns(enrolledSubjects);

  // Load Overview Breakdown
  renderStudentOverview(student, enrolledSubjects, studentRecords);

  // Switch to Overview Tab by default
  switchStudentTab("overview");
}

function populateSubjectDropdowns(enrolledSubjects) {
  const calcSelect = document.getElementById("calc-subject-select");
  const leaveSelect = document.getElementById("leave-subject-select");

  if (calcSelect) {
    calcSelect.innerHTML = `<option value="ALL">All Enrolled Courses (Overall)</option>`;
    enrolledSubjects.forEach(s => {
      calcSelect.innerHTML += `<option value="${s.id}">${s.name}</option>`;
    });
  }

  if (leaveSelect) {
    leaveSelect.innerHTML = `<option value="" disabled selected>Select Subject</option>`;
    enrolledSubjects.forEach(s => {
      leaveSelect.innerHTML += `<option value="${s.id}">${s.name}</option>`;
    });
  }
}

function renderStudentOverview(student, enrolledSubjects, studentRecords) {
  const container = document.getElementById("student-subject-breakdown");
  container.innerHTML = "";

  let totalClasses = 0;
  let totalPresent = 0;
  let totalAbsent = 0;
  let totalLate = 0;

  const lowAttendanceSubjects = [];

  enrolledSubjects.forEach((subject, index) => {
    const subjRecords = studentRecords.filter(r => r.subject_id === subject.id);
    const presentCount = subjRecords.filter(r => r.status === "Present").length;
    const absentCount = subjRecords.filter(r => r.status === "Absent").length;
    const lateCount = subjRecords.filter(r => r.status === "Late").length;
    const count = subjRecords.length;

    totalClasses += count;
    totalPresent += presentCount;
    totalAbsent += absentCount;
    totalLate += lateCount;

    const attendancePercentage = count > 0 ? Math.round(((presentCount + lateCount) / count) * 100) : 100;
    
    if (attendancePercentage < 75) {
      lowAttendanceSubjects.push({ name: subject.name, pct: attendancePercentage });
    }

    let strokeColor = "#10b981";
    let textColorClass = "text-emerald-400";
    if (attendancePercentage < 75) {
      strokeColor = "#f43f5e";
      textColorClass = "text-rose-400";
    } else if (attendancePercentage < 85) {
      strokeColor = "#f59e0b";
      textColorClass = "text-amber-400";
    }

    const card = document.createElement("div");
    card.className = "bg-slate-800 border border-slate-700/60 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-300 hover:border-slate-600/80 hover:shadow-2xl";
    
    card.innerHTML = `
      <div class="flex-1 w-full text-center md:text-left">
        <div class="flex items-center justify-between mb-1">
          <h4 class="text-lg font-bold text-slate-100">${subject.name}</h4>
          ${attendancePercentage < 75 ? '<span class="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[10px] font-bold uppercase tracking-wider">Shortage</span>' : ''}
        </div>
        <p class="text-xs text-slate-400 mb-4">Subject Code: <span class="font-mono text-indigo-400">${subject.id.toUpperCase()}</span></p>
        
        <div class="grid grid-cols-3 gap-2 max-w-sm mx-auto md:mx-0">
          <div class="bg-slate-900/60 border border-slate-700/40 rounded-xl p-3 text-center">
            <span class="text-xs font-semibold text-emerald-400 block mb-1">Present</span>
            <span class="text-xl font-extrabold text-slate-100">${presentCount}</span>
          </div>
          <div class="bg-slate-900/60 border border-slate-700/40 rounded-xl p-3 text-center">
            <span class="text-xs font-semibold text-rose-400 block mb-1">Absent</span>
            <span class="text-xl font-extrabold text-slate-100">${absentCount}</span>
          </div>
          <div class="bg-slate-900/60 border border-slate-700/40 rounded-xl p-3 text-center">
            <span class="text-xs font-semibold text-amber-400 block mb-1">Late</span>
            <span class="text-xl font-extrabold text-slate-100">${lateCount}</span>
          </div>
        </div>
      </div>
      
      <div class="relative w-28 h-28 flex-shrink-0">
        <canvas id="chart-subject-${index}" class="w-full h-full"></canvas>
        <div class="absolute inset-0 flex flex-col items-center justify-center">
          <span class="text-2xl font-black ${textColorClass}">${attendancePercentage}%</span>
          <span class="text-[9px] font-bold text-slate-400 tracking-wider uppercase">Attendance</span>
        </div>
      </div>
    `;
    
    container.appendChild(card);

    setTimeout(() => {
      const canvasEl = document.getElementById(`chart-subject-${index}`);
      if (!canvasEl) return;
      const ctx = canvasEl.getContext('2d');
      const emptyColor = "#1e293b";
      
      const newChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          datasets: [{
            data: count > 0 ? [presentCount + lateCount, absentCount] : [1, 0],
            backgroundColor: count > 0 ? [strokeColor, emptyColor] : ['#334155', emptyColor],
            borderWidth: 0
          }]
        },
        options: {
          cutout: '80%',
          responsive: true,
          maintainAspectRatio: true,
          plugins: { legend: { display: false }, tooltip: { enabled: false } }
        }
      });
      studentCharts.push(newChart);
    }, 50);
  });

  // Calculate Overall Metrics
  const overallPercentage = totalClasses > 0 ? Math.round(((totalPresent + totalLate) / totalClasses) * 100) : 100;
  
  document.getElementById("student-overall-percentage").textContent = `${overallPercentage}%`;
  document.getElementById("student-overall-present").textContent = totalPresent;
  document.getElementById("student-overall-absent").textContent = totalAbsent;
  document.getElementById("student-overall-late").textContent = totalLate;
  document.getElementById("student-overall-total").textContent = totalClasses;

  const overallRing = document.getElementById("student-overall-ring");
  if (overallRing) {
    const strokeDash = 283;
    const offset = strokeDash - (overallPercentage / 100) * strokeDash;
    overallRing.style.strokeDasharray = strokeDash;
    overallRing.style.strokeDashoffset = offset;
    
    if (overallPercentage < 75) overallRing.style.stroke = "#f43f5e";
    else if (overallPercentage < 85) overallRing.style.stroke = "#f59e0b";
    else overallRing.style.stroke = "#10b981";
  }

  // Warning Banner
  const alertContainer = document.getElementById("student-shortage-alert-container");
  if (alertContainer) {
    if (lowAttendanceSubjects.length > 0) {
      alertContainer.classList.remove("hidden");
      alertContainer.innerHTML = `
        <div class="border border-rose-500/30 bg-rose-500/10 rounded-2xl p-4 flex items-center space-x-4">
          <div class="p-2 bg-rose-500/20 rounded-xl text-rose-400 flex-shrink-0">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <p class="text-xs font-bold text-rose-400">Attendance Shortage Alert (< 75%)</p>
            <p class="text-xs text-slate-300 mt-0.5">
              You are currently below 75% in: <strong>${lowAttendanceSubjects.map(s => `${s.name} (${s.pct}%)`).join(", ")}</strong>. Please use the Attendance Calculator to plan required classes.
            </p>
          </div>
        </div>
      `;
    } else {
      alertContainer.classList.add("hidden");
    }
  }
}

// ATTENDANCE CALCULATOR / GOAL PLANNER LOGIC
function calculateAttendanceGoal() {
  const targetPct = parseInt(document.getElementById("calc-target-slider").value, 10) || 75;
  const selectedSubjId = document.getElementById("calc-subject-select").value;

  const students = AttendanceDB.getData(STORAGE_KEYS.STUDENTS);
  const student = students.find(s => s.id === currentUser.profileId);
  const records = AttendanceDB.getData(STORAGE_KEYS.RECORDS);
  const studentRecords = records.filter(r => r.student_id === student.id);

  let present = 0;
  let total = 0;

  if (selectedSubjId === "ALL") {
    total = studentRecords.length;
    present = studentRecords.filter(r => r.status === "Present" || r.status === "Late").length;
  } else {
    const subjRecords = studentRecords.filter(r => r.subject_id === selectedSubjId);
    total = subjRecords.length;
    present = subjRecords.filter(r => r.status === "Present" || r.status === "Late").length;
  }

  const currentPct = total > 0 ? Math.round((present / total) * 100) : 100;
  const resultCard = document.getElementById("calc-result-card");
  
  if (!resultCard) return;

  if (total === 0) {
    resultCard.innerHTML = `<p class="text-slate-400 text-sm">No recorded classes yet for this selection.</p>`;
    return;
  }

  const reqRatio = targetPct / 100;

  if (currentPct >= targetPct) {
    // How many classes can be missed? (present / (total + x) >= reqRatio => x <= (present / reqRatio) - total)
    const maxMissable = Math.floor((present / reqRatio) - total);
    resultCard.innerHTML = `
      <div class="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 text-center space-y-2">
        <div class="inline-flex p-3 rounded-full bg-emerald-500/20 text-emerald-400 mb-1">
          <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h4 class="text-xl font-extrabold text-emerald-400">You are in the Safe Zone!</h4>
        <p class="text-sm text-slate-300">
          Your current attendance is <strong class="text-white">${currentPct}%</strong> (${present}/${total} classes).
        </p>
        <div class="bg-slate-950/60 p-4 rounded-xl border border-slate-850 mt-3 inline-block">
          <span class="text-xs text-slate-400 block uppercase font-bold tracking-wider mb-1">Safe Bunk Budget</span>
          <span class="text-3xl font-black text-emerald-400">${Math.max(0, maxMissable)}</span>
          <span class="text-xs text-slate-400 block mt-1">classes can be skipped while maintaining ≥ ${targetPct}%</span>
        </div>
      </div>
    `;
  } else {
    // How many consecutive classes must be attended? ((present + x) / (total + x) >= reqRatio => x >= (reqRatio * total - present) / (1 - reqRatio))
    const requiredConsec = Math.ceil((reqRatio * total - present) / (1 - reqRatio));
    resultCard.innerHTML = `
      <div class="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-6 text-center space-y-2">
        <div class="inline-flex p-3 rounded-full bg-rose-500/20 text-rose-400 mb-1">
          <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h4 class="text-xl font-extrabold text-rose-400">Shortage Action Required!</h4>
        <p class="text-sm text-slate-300">
          Your current attendance is <strong class="text-white">${currentPct}%</strong> (${present}/${total} classes).
        </p>
        <div class="bg-slate-950/60 p-4 rounded-xl border border-slate-850 mt-3 inline-block">
          <span class="text-xs text-slate-400 block uppercase font-bold tracking-wider mb-1">Required Attendance</span>
          <span class="text-3xl font-black text-rose-400">${requiredConsec}</span>
          <span class="text-xs text-slate-400 block mt-1">consecutive upcoming classes must be attended to hit ${targetPct}%</span>
        </div>
      </div>
    `;
  }
}

// MONTHLY CALENDAR VIEW LOGIC
function renderStudentCalendar() {
  const calendarContainer = document.getElementById("student-calendar-grid");
  const monthYearHeader = document.getElementById("calendar-month-year");
  if (!calendarContainer) return;

  const date = new Date(currentCalendarYear, currentCalendarMonth, 1);
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  monthYearHeader.textContent = `${monthNames[currentCalendarMonth]} ${currentCalendarYear}`;

  const firstDayIndex = date.getDay();
  const lastDay = new Date(currentCalendarYear, currentCalendarMonth + 1, 0).getDate();

  const students = AttendanceDB.getData(STORAGE_KEYS.STUDENTS);
  const student = students.find(s => s.id === currentUser.profileId);
  const records = AttendanceDB.getData(STORAGE_KEYS.RECORDS);
  const studentRecords = records.filter(r => r.student_id === student.id);

  calendarContainer.innerHTML = "";

  // Day Headers
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  dayNames.forEach(d => {
    const head = document.createElement("div");
    head.className = "text-center text-xs font-bold text-slate-500 uppercase py-2";
    head.textContent = d;
    calendarContainer.appendChild(head);
  });

  // Empty slots before 1st of month
  for (let x = 0; x < firstDayIndex; x++) {
    const empty = document.createElement("div");
    empty.className = "h-20 bg-slate-950/30 rounded-xl border border-slate-850/40 opacity-40";
    calendarContainer.appendChild(empty);
  }

  // Days of month
  for (let day = 1; day <= lastDay; day++) {
    const dayStr = `${currentCalendarYear}-${String(currentCalendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayRecs = studentRecords.filter(r => r.date === dayStr);

    const cell = document.createElement("div");
    cell.className = "h-20 bg-slate-900/60 border border-slate-800 rounded-xl p-2 flex flex-col justify-between hover:border-indigo-500/50 transition-all cursor-pointer";
    
    let statusDots = "";
    if (dayRecs.length > 0) {
      const pCount = dayRecs.filter(r => r.status === "Present").length;
      const aCount = dayRecs.filter(r => r.status === "Absent").length;
      const lCount = dayRecs.filter(r => r.status === "Late").length;

      statusDots = `
        <div class="flex items-center space-x-1 mt-1">
          ${pCount > 0 ? `<span class="h-2.5 w-2.5 rounded-full bg-emerald-500" title="${pCount} Present"></span>` : ''}
          ${aCount > 0 ? `<span class="h-2.5 w-2.5 rounded-full bg-rose-500" title="${aCount} Absent"></span>` : ''}
          ${lCount > 0 ? `<span class="h-2.5 w-2.5 rounded-full bg-amber-500" title="${lCount} Late"></span>` : ''}
        </div>
      `;
    }

    cell.innerHTML = `
      <span class="text-xs font-bold text-slate-300">${day}</span>
      ${statusDots}
    `;

    cell.addEventListener("click", () => {
      if (dayRecs.length > 0) {
        showToast(`${dayStr}: ${dayRecs.map(r => r.status).join(", ")}`);
      }
    });

    calendarContainer.appendChild(cell);
  }
}

function prevMonth() {
  currentCalendarMonth--;
  if (currentCalendarMonth < 0) {
    currentCalendarMonth = 11;
    currentCalendarYear--;
  }
  renderStudentCalendar();
}

function nextMonth() {
  currentCalendarMonth++;
  if (currentCalendarMonth > 11) {
    currentCalendarMonth = 0;
    currentCalendarYear++;
  }
  renderStudentCalendar();
}

// LEAVE APPLICATION SUBMISSION LOGIC
function handleLeaveSubmit(e) {
  e.preventDefault();

  const subjectId = document.getElementById("leave-subject-select").value;
  const dateVal = document.getElementById("leave-date-input").value;
  const reasonVal = document.getElementById("leave-reason-input").value.trim();

  if (!subjectId || !dateVal || !reasonVal) {
    showToast("Please fill all required fields.", "error");
    return;
  }

  const leaves = AttendanceDB.getData(STORAGE_KEYS.LEAVES);
  const newLeave = {
    id: `leave_${leaves.length + 1}`,
    student_id: currentUser.profileId,
    subject_id: subjectId,
    date: dateVal,
    reason: reasonVal,
    status: "Pending",
    created_at: new Date().toISOString()
  };

  leaves.push(newLeave);
  AttendanceDB.saveData(STORAGE_KEYS.LEAVES, leaves);

  showToast("Leave application submitted for approval!");
  document.getElementById("student-leave-form").reset();
  loadStudentLeaveApplications();
}

function loadStudentLeaveApplications() {
  const container = document.getElementById("student-leave-list");
  if (!container) return;

  const leaves = AttendanceDB.getData(STORAGE_KEYS.LEAVES);
  const subjects = AttendanceDB.getData(STORAGE_KEYS.SUBJECTS);
  const myLeaves = leaves.filter(l => l.student_id === currentUser.profileId);

  container.innerHTML = "";

  if (myLeaves.length === 0) {
    container.innerHTML = `<p class="text-sm text-slate-400 text-center py-6">No leave applications submitted yet.</p>`;
    return;
  }

  myLeaves.forEach(l => {
    const subject = subjects.find(s => s.id === l.subject_id);
    const badgeColor = l.status === "Pending" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                       l.status === "Approved" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                       "bg-rose-500/10 text-rose-400 border-rose-500/20";

    const card = document.createElement("div");
    card.className = "bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex justify-between items-center";
    card.innerHTML = `
      <div class="space-y-1">
        <div class="flex items-center space-x-2">
          <span class="font-bold text-slate-200 text-sm">${subject ? subject.name : 'Subject'}</span>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold border ${badgeColor}">${l.status}</span>
        </div>
        <p class="text-xs text-slate-400">Date: <strong class="text-slate-200">${formatDateString(l.date)}</strong></p>
        <p class="text-xs text-slate-400 italic">"${l.reason}"</p>
      </div>
    `;
    container.appendChild(card);
  });
}

// STUDENT HISTORY LOG TABLE WITH SEARCH & FILTER
function renderStudentHistoryTable() {
  const tbody = document.getElementById("student-history-tbody");
  if (!tbody) return;

  const query = (document.getElementById("history-search-input")?.value || "").trim().toLowerCase();
  const statusFilter = document.getElementById("history-status-filter")?.value || "ALL";

  const students = AttendanceDB.getData(STORAGE_KEYS.STUDENTS);
  const student = students.find(s => s.id === currentUser.profileId);
  const subjects = AttendanceDB.getData(STORAGE_KEYS.SUBJECTS);
  const records = AttendanceDB.getData(STORAGE_KEYS.RECORDS);

  let studentRecords = records.filter(r => r.student_id === student.id);

  if (statusFilter !== "ALL") {
    studentRecords = studentRecords.filter(r => r.status === statusFilter);
  }

  studentRecords.sort((a, b) => b.date.localeCompare(a.date));

  tbody.innerHTML = "";

  const filtered = studentRecords.filter(r => {
    const subj = subjects.find(s => s.id === r.subject_id);
    const subjName = subj ? subj.name.toLowerCase() : "";
    return subjName.includes(query) || r.date.includes(query);
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="3" class="px-6 py-8 text-center text-slate-400 text-sm">
          No matching records found.
        </td>
      </tr>
    `;
    return;
  }

  const badgeClasses = {
    Present: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    Absent: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
    Late: "bg-amber-500/10 text-amber-400 border border-amber-500/20"
  };

  filtered.forEach(r => {
    const subject = subjects.find(s => s.id === r.subject_id);
    const row = document.createElement("tr");
    row.className = "border-b border-slate-700/40 hover:bg-slate-750/30 transition-colors";
    
    row.innerHTML = `
      <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-300 font-medium">
        ${formatDateString(r.date)}
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-100 font-semibold">
        ${subject ? subject.name : 'Unknown Subject'}
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-right">
        <span class="px-3 py-1 rounded-full text-xs font-semibold ${badgeClasses[r.status] || 'bg-slate-800'}">
          ${r.status}
        </span>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// Utilities
function formatDateString(dateStr) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', options);
}

function showToast(message, type = "success") {
  let toast = document.getElementById("toast-notification");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast-notification";
    document.body.appendChild(toast);
  }

  toast.className = "fixed bottom-5 right-5 z-50 px-6 py-3.5 rounded-2xl shadow-2xl transition-all duration-350 transform translate-y-10 opacity-0 flex items-center space-x-3 border";
  
  if (type === "success") {
    toast.className += " bg-slate-900 border-emerald-500/30 text-slate-100";
    toast.innerHTML = `
      <div class="p-1 rounded-full bg-emerald-500/10 text-emerald-400">
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <span class="font-semibold text-sm">${message}</span>
    `;
  } else {
    toast.className += " bg-slate-900 border-rose-500/30 text-slate-100";
    toast.innerHTML = `
      <div class="p-1 rounded-full bg-rose-500/10 text-rose-400">
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <span class="font-semibold text-sm">${message}</span>
    `;
  }

  setTimeout(() => {
    toast.classList.remove("translate-y-10", "opacity-0");
  }, 10);

  setTimeout(() => {
    toast.classList.add("translate-y-10", "opacity-0");
  }, 3500);
}
