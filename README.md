# Apex College Attendance System

A comprehensive, role-based College Attendance System web application. It runs as a client-side Single Page Application (SPA) using HTML, Tailwind CSS, Chart.js, and local storage state management.

## Setup & Launch Instructions

To launch and run the application:

1. **Locate the files**:
   Go to the directory:
   `C:\Users\91809\.gemini\antigravity\scratch\college-attendance-system\`

2. **Open the Application**:
   Simply double-click the `index.html` file or open it directly in any modern web browser:
   * Google Chrome
   * Microsoft Edge
   * Mozilla Firefox

3. **Log in with Demo Credentials**:
   Use the credential helper box displayed on the left side of the Login Screen to sign in:

   * **Professor Dashboard (Sarah Jenkins)**:
     * **Email**: `sarah.jenkins@college.edu`
     * **Password**: `password123`
     * **Subjects**: Computer Networks, Software Engineering, Web Development.
     
   * **Professor Dashboard (David Miller)**:
     * **Email**: `david.miller@college.edu`
     * **Password**: `password123`
     * **Subjects**: Database Systems, Artificial Intelligence.

   * **Student Dashboard (Aryan Mane)**:
     * **Email**: `aryan.mane@college.edu`
     * **Password**: `password123`
     * **Details**: Roll No. 59, Div A, Computer Engineering.

## Features Included

1. **Role-Based Routing**: 
   Authenticates users and dynamically mounts either the **Professor Dashboard** or **Student Dashboard** state based on their accounts.

2. **Database Engine (Client-Side)**:
   Maintains standard relational structures (Users, Students, Professors, Subjects, AttendanceRecords) inside `localStorage`. Seeded with historical data for the past 7 days.

3. **Professor Interface**:
   * Dropdown selector for subjects assigned to the logged-in professor.
   * Date calendar selector.
   * Responsive student grids showing profiles, roll numbers, divisions, and active ping color badges.
   * Triple-toggle button controls: Present (Green), Absent (Red), and Late (Yellow) with dynamic temporary state.
   * CSV exporter compiling historic reports.

4. **Student Interface**:
   * Profile card displaying roll number, division, branch, and picture.
   * SVG circular overall attendance rate percentage gauges.
   * Subject card breakdowns featuring dynamic Chart.js radial charts.
   * Interactive historical logs list sorted by date.
