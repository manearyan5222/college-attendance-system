/**
 * College Attendance System - Core Application Logic & State Management
 */

// Initialize Database State
const DB_VERSION = "1.0.0";
const STORAGE_KEYS = {
  USERS: "attendance_users",
  STUDENTS: "attendance_students",
  PROFESSORS: "attendance_professors",
  SUBJECTS: "attendance_subjects",
  RECORDS: "attendance_records",
  CURRENT_USER: "attendance_current_user",
  DB_INITIALIZED: "attendance_db_initialized"
};

// Seed Data & Storage Operations
class AttendanceDB {
  static init() {
    if (localStorage.getItem(STORAGE_KEYS.DB_INITIALIZED)) {
      return; // Already initialized
    }

    console.log("Initializing database with seed data...");

    // 1. Create Users (2 Professors, 10 Students)
    const users = [
      // Professors
      { id: "u_p1", email: "sarah.jenkins@college.edu", password: "password123", role: "Professor" },
      { id: "u_p2", email: "david.miller@college.edu", password: "password123", role: "Professor" },
      
      // Students
      { id: "u_s1", email: "aryan.mane@college.edu", password: "password123", role: "Student" },
      { id: "u_s2", email: "jessica.taylor@college.edu", password: "password123", role: "Student" },
      { id: "u_s3", email: "rohan.sharma@college.edu", password: "password123", role: "Student" },
      { id: "u_s4", email: "priya.patel@college.edu", password: "password123", role: "Student" },
      { id: "u_s5", email: "liam.johnson@college.edu", password: "password123", role: "Student" },
      { id: "u_s6", email: "emma.watson@college.edu", password: "password123", role: "Student" },
      { id: "u_s7", email: "noah.alfayed@college.edu", password: "password123", role: "Student" },
      { id: "u_s8", email: "mia.chen@college.edu", password: "password123", role: "Student" },
      { id: "u_s9", email: "ethan.hunt@college.edu", password: "password123", role: "Student" },
      { id: "u_s10", email: "sophia.loren@college.edu", password: "password123", role: "Student" }
    ];

    // 2. Create Professors
    const professors = [
      { id: "prof_1", user_id: "u_p1", full_name: "Dr. Sarah Jenkins", department: "Computer Engineering" },
      { id: "prof_2", user_id: "u_p2", full_name: "Dr. David Miller", department: "Information Technology" }
    ];

    // 3. Create Subjects (5 dummy subjects assigned to the professors)
    const subjects = [
      { id: "subj_1", name: "Computer Networks", professor_id: "prof_1" },
      { id: "subj_2", name: "Software Engineering", professor_id: "prof_1" },
      { id: "subj_3", name: "Web Development", professor_id: "prof_1" },
      { id: "subj_4", name: "Database Systems", professor_id: "prof_2" },
      { id: "subj_5", name: "Artificial Intelligence", professor_id: "prof_2" }
    ];

    // 4. Create Students
    const students = [
      { id: "stud_1", user_id: "u_s1", full_name: "Aryan Mane", roll_no: "59", division: "A", branch: "Computer Engineering", profile_photo_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aryan" },
      { id: "stud_2", user_id: "u_s2", full_name: "Jessica Taylor", roll_no: "01", division: "A", branch: "Computer Engineering", profile_photo_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica" },
      { id: "stud_3", user_id: "u_s3", full_name: "Rohan Sharma", roll_no: "45", division: "A", branch: "Computer Engineering", profile_photo_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan" },
      { id: "stud_4", user_id: "u_s4", full_name: "Priya Patel", roll_no: "32", division: "B", branch: "Information Technology", profile_photo_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya" },
      { id: "stud_5", user_id: "u_s5", full_name: "Liam Johnson", roll_no: "21", division: "A", branch: "Computer Engineering", profile_photo_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Liam" },
      { id: "stud_6", user_id: "u_s6", full_name: "Emma Watson", roll_no: "15", division: "B", branch: "Computer Engineering", profile_photo_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma" },
      { id: "stud_7", user_id: "u_s7", full_name: "Noah Al-Fayed", roll_no: "41", division: "B", branch: "Information Technology", profile_photo_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Noah" },
      { id: "stud_8", user_id: "u_s8", full_name: "Mia Chen", roll_no: "29", division: "A", branch: "Computer Engineering", profile_photo_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mia" },
      { id: "stud_9", user_id: "u_s9", full_name: "Ethan Hunt", roll_no: "18", division: "B", branch: "Information Technology", profile_photo_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ethan" },
      { id: "stud_10", user_id: "u_s10", full_name: "Sophia Loren", roll_no: "52", division: "A", branch: "Information Technology", profile_photo_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia" }
    ];

    // 5. Generate Historical Attendance for the past 7 days (excluding today)
    const records = [];
    const statuses = ["Present", "Present", "Present", "Present", "Absent", "Late", "Present"]; // Weighted towards present
    
    // Enrollment helper: returns true if student is enrolled in subject
    const isEnrolled = (student, subject) => {
      // computer engineering students study: Networks, Software Eng, Web Dev, Database
      // IT students study: Database, AI, Web Dev, Networks
      if (student.branch === "Computer Engineering") {
        return ["subj_1", "subj_2", "subj_3", "subj_4"].includes(subject.id);
      } else {
        return ["subj_1", "subj_3", "subj_4", "subj_5"].includes(subject.id);
      }
    };

    const today = new Date();
    let recordCounter = 1;

    for (let i = 7; i >= 1; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split("T")[0];

      subjects.forEach(subject => {
        students.forEach(student => {
          if (isEnrolled(student, subject)) {
            // Pick a status randomly but semi-consistently per student/day
            const statusIndex = Math.floor(Math.random() * statuses.length);
            const status = statuses[statusIndex];
            
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

    // Save all to localStorage
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    localStorage.setItem(STORAGE_KEYS.PROFESSORS, JSON.stringify(professors));
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
    localStorage.setItem(STORAGE_KEYS.DB_INITIALIZED, "true");
  }

  // Getters
  static getData(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
  }

  static saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // Check enrollment matching current logic
  static isStudentEnrolled(student, subjectId) {
    if (student.branch === "Computer Engineering") {
      return ["subj_1", "subj_2", "subj_3", "subj_4"].includes(subjectId);
    } else {
      return ["subj_1", "subj_3", "subj_4", "subj_5"].includes(subjectId);
    }
  }
}

// Current Session State
let currentUser = null;
// Active professor state
let selectedSubjectId = "";
let selectedDate = new Date().toISOString().split("T")[0];
let tempAttendance = {}; // Maps studentId -> status ('Present' | 'Absent' | 'Late')

// Initialize DB on script load
AttendanceDB.init();

// Setup DOM elements reference & load application
document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

function initApp() {
  // Check if session exists
  const storedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  if (storedUser) {
    currentUser = JSON.parse(storedUser);
    showDashboard();
  } else {
    showView("login-view");
  }
  
  setupEventListeners();
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

  // Nav-bar controls
  const navContainer = document.getElementById("nav-container");
  if (currentUser) {
    navContainer.classList.remove("hidden");
    document.getElementById("user-display-name").textContent = currentUser.name;
    document.getElementById("user-display-role").textContent = currentUser.role;
  } else {
    navContainer.classList.add("hidden");
  }
}

function setupEventListeners() {
  // Login Form
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }

  // Logout Button
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleLogout);
  }

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
    // Default to today
    dateInput.value = selectedDate;
    dateInput.addEventListener("change", (e) => {
      selectedDate = e.target.value;
      loadAttendanceGrid();
    });
  }

  const submitAttendanceBtn = document.getElementById("submit-attendance");
  if (submitAttendanceBtn) {
    submitAttendanceBtn.addEventListener("click", submitAttendance);
  }

  const exportExcelBtn = document.getElementById("export-excel");
  if (exportExcelBtn) {
    exportExcelBtn.addEventListener("click", exportAttendanceHistory);
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
  
  // Set up Current Session Object
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
}

function handleLogout() {
  currentUser = null;
  selectedSubjectId = "";
  tempAttendance = {};
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  showView("login-view");
  
  // Reset Form
  document.getElementById("login-form").reset();
  document.getElementById("login-error").classList.add("hidden");
}

function showDashboard() {
  if (currentUser.role === "Professor") {
    showView("professor-dashboard");
    initProfessorDashboard();
  } else {
    showView("student-dashboard");
    initStudentDashboard();
  }
}

// PROFESSOR DASHBOARD LOGIC
function initProfessorDashboard() {
  // Reset fields
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

  // Clear student grid and disable submit until subject is selected
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
}

function loadAttendanceGrid() {
  if (!selectedSubjectId) return;

  const students = AttendanceDB.getData(STORAGE_KEYS.STUDENTS);
  const enrolledStudents = students.filter(s => AttendanceDB.isStudentEnrolled(s, selectedSubjectId));
  
  // Fetch existing attendance for this date & subject
  const records = AttendanceDB.getData(STORAGE_KEYS.RECORDS);
  const existingRecords = records.filter(r => r.subject_id === selectedSubjectId && r.date === selectedDate);
  
  // Set temporary attendance status
  tempAttendance = {};
  enrolledStudents.forEach(s => {
    const existing = existingRecords.find(r => r.student_id === s.id);
    tempAttendance[s.id] = existing ? existing.status : "Present"; // Default to Present if new
  });

  // Render Grid
  const grid = document.getElementById("students-attendance-grid");
  grid.innerHTML = "";

  if (enrolledStudents.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full py-12 text-center text-slate-400">
        <p class="text-lg">No students enrolled in this subject's department.</p>
      </div>
    `;
    document.getElementById("submit-attendance").disabled = true;
    document.getElementById("export-excel").disabled = true;
    return;
  }

  enrolledStudents.forEach(s => {
    const card = document.createElement("div");
    card.className = "bg-slate-800 border border-slate-700/60 rounded-2xl p-5 shadow-xl transition-all duration-300 hover:border-slate-600/80 hover:shadow-2xl flex flex-col justify-between";
    card.id = `student-card-${s.id}`;

    // Header with Profile & Info
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

    // Action toggles
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
    
    // Set active status styling
    updateButtonStyles(s.id);
  });

  document.getElementById("submit-attendance").disabled = false;
  document.getElementById("export-excel").disabled = false;
}

function setStudentStatus(studentId, status) {
  tempAttendance[studentId] = status;
  updateButtonStyles(studentId);
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

  // Reset & update buttons
  ["Present", "Absent", "Late"].forEach(status => {
    const btn = document.getElementById(`btn-${studentId}-${status}`);
    if (btn) {
      // Clear previous classes
      btn.className = "status-btn font-medium py-2 px-1 rounded-xl text-xs transition-all duration-200 border flex items-center justify-center space-x-1";
      if (status === currentStatus) {
        btn.className += " " + states[status].activeClass;
      } else {
        btn.className += " " + states[status].btnClass;
      }
    }
  });

  // Update ping status badge on card avatar
  const badge = document.getElementById(`badge-${studentId}`);
  if (badge) {
    const pingDot = badge.children[0];
    const solidDot = badge.children[1];
    
    // Clear colors
    pingDot.className = "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75";
    solidDot.className = "relative inline-flex rounded-full h-4 w-4";
    
    // Add new colors
    pingDot.className += " " + states[currentStatus].badgeColor;
    solidDot.className += " " + states[currentStatus].badgeColor;
  }
}

function submitAttendance() {
  if (!selectedSubjectId) return;

  const records = AttendanceDB.getData(STORAGE_KEYS.RECORDS);
  
  // Filter out existing records for this subject/date to avoid duplicates
  let updatedRecords = records.filter(r => !(r.subject_id === selectedSubjectId && r.date === selectedDate));
  
  let newRecordCounter = records.length + 1;

  // Append new statuses from temporary state
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
  
  // Visual Success Toast
  showToast("Attendance submitted successfully!");
  loadAttendanceGrid();
}

function exportAttendanceHistory() {
  if (!selectedSubjectId) return;

  const subjects = AttendanceDB.getData(STORAGE_KEYS.SUBJECTS);
  const subjectName = subjects.find(s => s.id === selectedSubjectId)?.name || "Subject";
  
  const records = AttendanceDB.getData(STORAGE_KEYS.RECORDS);
  const students = AttendanceDB.getData(STORAGE_KEYS.STUDENTS);
  
  // Get all historic records for this subject
  const subjectRecords = records.filter(r => r.subject_id === selectedSubjectId);

  if (subjectRecords.length === 0) {
    showToast("No attendance data found to export.", "error");
    return;
  }

  // Sort by date desc, student name asc
  subjectRecords.sort((a, b) => {
    if (a.date !== b.date) {
      return b.date.localeCompare(a.date);
    }
    const studentA = students.find(s => s.id === a.student_id)?.full_name || "";
    const studentB = students.find(s => s.id === b.student_id)?.full_name || "";
    return studentA.localeCompare(studentB);
  });

  // Generate CSV Content
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
  
  // Create virtual download element
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${subjectName.replace(/\s+/g, "_")}_Attendance_Report.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast("CSV report exported successfully!");
}

// STUDENT DASHBOARD LOGIC
let studentCharts = [];

function initStudentDashboard() {
  const students = AttendanceDB.getData(STORAGE_KEYS.STUDENTS);
  const student = students.find(s => s.id === currentUser.profileId);
  
  if (!student) return;

  // Clear previous chart instances
  studentCharts.forEach(chart => chart.destroy());
  studentCharts = [];

  // Update Profile Header
  document.getElementById("student-profile-photo").src = student.profile_photo_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + student.full_name;
  document.getElementById("student-profile-name").textContent = student.full_name;
  document.getElementById("student-roll-no").textContent = student.roll_no;
  document.getElementById("student-division").textContent = student.division;
  document.getElementById("student-branch").textContent = student.branch;

  // Load subject breakdown & metrics
  const subjects = AttendanceDB.getData(STORAGE_KEYS.SUBJECTS);
  const enrolledSubjects = subjects.filter(s => AttendanceDB.isStudentEnrolled(student, s.id));
  
  const records = AttendanceDB.getData(STORAGE_KEYS.RECORDS);
  const studentRecords = records.filter(r => r.student_id === student.id);

  const container = document.getElementById("student-subject-breakdown");
  container.innerHTML = "";

  if (enrolledSubjects.length === 0) {
    container.innerHTML = `<div class="col-span-full text-center text-slate-400 py-8">Not enrolled in any classes.</div>`;
    return;
  }

  // Calculate Overall Metrics
  let totalClasses = 0;
  let totalPresent = 0;
  let totalAbsent = 0;
  let totalLate = 0;

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

    // Attendance % = (Present + Late) / Total * 100
    const attendancePercentage = count > 0 ? Math.round(((presentCount + lateCount) / count) * 100) : 100;
    
    // Create card element
    const card = document.createElement("div");
    card.className = "bg-slate-800 border border-slate-700/60 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-300 hover:border-slate-600/80 hover:shadow-2xl";
    
    // Progress Ring color depending on %
    let strokeColor = "#10b981"; // Emerald
    let textColorClass = "text-emerald-400";
    if (attendancePercentage < 75) {
      strokeColor = "#f43f5e"; // Rose
      textColorClass = "text-rose-400";
    } else if (attendancePercentage < 85) {
      strokeColor = "#f59e0b"; // Amber
      textColorClass = "text-amber-400";
    }

    const cardContent = `
      <div class="flex-1 w-full text-center md:text-left">
        <h4 class="text-lg font-bold text-slate-100 mb-1">${subject.name}</h4>
        <p class="text-xs text-slate-400 mb-4">Subject ID: <span class="font-mono text-indigo-400">${subject.id.toUpperCase()}</span></p>
        
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
    
    card.innerHTML = cardContent;
    container.appendChild(card);

    // Render Doughnut Chart for this subject
    setTimeout(() => {
      const canvasEl = document.getElementById(`chart-subject-${index}`);
      if (!canvasEl) return;
      const ctx = canvasEl.getContext('2d');
      const emptyColor = "#1e293b"; // Slate-800
      
      const newChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          datasets: [{
            data: count > 0 ? [presentCount + lateCount, absentCount] : [1, 0],
            backgroundColor: count > 0 ? [strokeColor, emptyColor] : ['#334155', emptyColor],
            borderWidth: 0,
            hoverOffset: 0
          }]
        },
        options: {
          cutout: '80%',
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: { display: false },
            tooltip: { enabled: false }
          }
        }
      });
      studentCharts.push(newChart);
    }, 50);
  });

  // Calculate Overall Metrics
  const overallPercentage = totalClasses > 0 ? Math.round(((totalPresent + totalLate) / totalClasses) * 100) : 100;
  
  // Render overall numbers
  document.getElementById("student-overall-percentage").textContent = `${overallPercentage}%`;
  document.getElementById("student-overall-present").textContent = totalPresent;
  document.getElementById("student-overall-absent").textContent = totalAbsent;
  document.getElementById("student-overall-late").textContent = totalLate;
  document.getElementById("student-overall-total").textContent = totalClasses;

  // Render Overall Ring progress
  const overallRing = document.getElementById("student-overall-ring");
  if (overallRing) {
    const strokeDash = 283; // Circumference of radius 45 circle (2 * PI * r)
    const offset = strokeDash - (overallPercentage / 100) * strokeDash;
    overallRing.style.strokeDasharray = strokeDash;
    overallRing.style.strokeDashoffset = offset;
    
    if (overallPercentage < 75) {
      overallRing.style.stroke = "#f43f5e"; // Rose
    } else if (overallPercentage < 85) {
      overallRing.style.stroke = "#f59e0b"; // Amber
    } else {
      overallRing.style.stroke = "#10b981"; // Emerald
    }
  }

  // Load detailed logs
  loadStudentHistoryTable(studentRecords, subjects);
}

function loadStudentHistoryTable(studentRecords, subjects) {
  const tbody = document.getElementById("student-history-tbody");
  tbody.innerHTML = "";

  // Sort logs by date desc
  studentRecords.sort((a, b) => b.date.localeCompare(a.date));

  if (studentRecords.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="3" class="px-6 py-8 text-center text-slate-400 text-sm">
          No historical records found.
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

  studentRecords.forEach(r => {
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
  // Check if toast already exists
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

  // Animate in
  setTimeout(() => {
    toast.classList.remove("translate-y-10", "opacity-0");
  }, 10);

  // Animate out
  setTimeout(() => {
    toast.classList.add("translate-y-10", "opacity-0");
  }, 3500);
}
