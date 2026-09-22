/* ==========================================================================
   CampusConnect - Academic Module (Class Tutor & HoD)
   Adhiyamaan College of Engineering (ACE)
   Strictly Hostel Students Clearance & Section-Scoped Tutor Authority
   ========================================================================== */

let sampleAcademicVerifications = [
  {
    id: 'PASS-2026-X89B',
    passCode: 'PASS-2026-X89B',
    studentName: 'Alex Rivers',
    rollNumber: '2026-CSE-104',
    registerNumber: '730323104104',
    department: 'Computer Science & Engineering',
    deptCode: 'CSE',
    year: 'II Year (3rd Sem)',
    classSection: 'Section A',
    assignedTutor: 'Prof. M. Priya (tutor_cse_a)',
    passType: 'OUT_IN_PASS',
    reason: 'Medical checkup at Apollo Specialty Hospital for acute migraine',
    destination: 'Apollo Specialty Hospital, Hosur',
    dates: '2026-09-21 09:00 to 18:00',
    wardenApproval: 'APPROVED',
    wardenStatus: 'APPROVED_BY_WARDEN (Awaiting Tutor Clearance)',
    tutorApproval: 'PENDING',
    isSick: true
  },
  {
    id: 'STAY-2026-R402',
    passCode: 'STAY-2026-R402',
    studentName: 'Alex Rivers',
    rollNumber: '2026-CSE-104',
    registerNumber: '730323104104',
    department: 'Computer Science & Engineering',
    deptCode: 'CSE',
    year: 'II Year (3rd Sem)',
    classSection: 'Section A',
    assignedTutor: 'Prof. M. Priya (tutor_cse_a)',
    passType: 'ROOM_STAY_PASS',
    reason: '[Medical / Sickness] High fever & viral fatigue - Bed rest in hostel room',
    destination: 'Pennar Hostel (Block B) Room 304',
    dates: '2026-09-22 08:30 to 17:30',
    wardenApproval: 'PENDING',
    wardenStatus: 'PENDING_WARDEN_APPROVAL',
    tutorApproval: 'PENDING',
    isSick: true
  },
  {
    id: 'PASS-2025-P310',
    passCode: 'PASS-2025-P310',
    studentName: 'Praveen Kumar S',
    rollNumber: '2025-CSE-052',
    registerNumber: '730322104052',
    department: 'Computer Science & Engineering',
    deptCode: 'CSE',
    year: 'III Year (5th Sem)',
    classSection: 'Section A',
    assignedTutor: 'Prof. M. Priya (tutor_cse_a)',
    passType: 'OUT_IN_PASS',
    reason: 'Dental surgery follow-up at Government Hospital',
    destination: 'Govt Headquarters Hospital, Hosur',
    dates: '2026-09-23 10:00 to 17:00',
    wardenApproval: 'PENDING',
    wardenStatus: 'PENDING_WARDEN_APPROVAL',
    tutorApproval: 'PENDING',
    isSick: true
  },
  {
    id: 'STAY-2027-V108',
    passCode: 'STAY-2027-V108',
    studentName: 'Vignesh Ram',
    rollNumber: '2027-CSE-015',
    registerNumber: '730324104015',
    department: 'Computer Science & Engineering',
    deptCode: 'CSE',
    year: 'I Year (1st Sem)',
    classSection: 'Section B',
    assignedTutor: 'Prof. K. Ramesh (tutor_cse_b)',
    passType: 'ROOM_STAY_PASS',
    reason: '[Exam Study Preparation] Preparing for Semester Model Practical Exam',
    destination: 'Pennar Hostel (Block B) Room 108',
    dates: '2026-09-22 09:00 to 16:30',
    wardenApproval: 'PENDING',
    wardenStatus: 'PENDING_WARDEN_APPROVAL',
    tutorApproval: 'PENDING',
    isSick: false
  }
];

let sampleOverdueAcademicQueue = [
  {
    id: 'PASS-2026-O771',
    studentName: 'Rohan Sharma',
    rollNumber: '2026-CSE-045',
    classSection: 'Section A',
    passType: 'OUT_IN_PASS',
    attendanceEntered: '91% (Uploaded by Class Tutor)',
    reason: 'Family Emergency Leave',
    dates: '2026-09-15 to 2026-09-17',
    clearanceStatus: 'CLEARED_BY_TUTOR',
    status: 'COMPLETED'
  }
];

// Active filter state for HoD 4-Year Hostel Directory
let activeHodYearFilter = 'ALL';
let activeHodSearchQuery = '';

function setHodYearFilter(year) {
  activeHodYearFilter = year;
  renderAcademicDashboard();
}

function handleHodSearch(query) {
  activeHodSearchQuery = (query || '').toLowerCase().trim();
  renderAcademicDashboard();
}

function renderAcademicDashboard() {
  const area = document.getElementById('dashboardRenderArea');
  if (!area) return;

  const user = getCurrentUser() || {};
  const isHoD = (user.role === 'HOD');

  if (isHoD) {
    renderHodDashboard(area, user);
  } else {
    renderTutorDashboard(area, user);
  }
}

// ==========================================================================
// 1. HoD DASHBOARD: 4-Year Hostel Student Clearance Directory & Department Hub
// ==========================================================================
function renderHodDashboard(area, user) {
  const students = window.STUDENT_REGISTRY || [];
  
  // Filter students based on year filter and search query
  let filteredStudents = students.filter(s => {
    // 1. Year Filter
    if (activeHodYearFilter !== 'ALL') {
      if (activeHodYearFilter === 'YEAR_1' && s.yearNumber !== 1) return false;
      if (activeHodYearFilter === 'YEAR_2' && s.yearNumber !== 2) return false;
      if (activeHodYearFilter === 'YEAR_3' && s.yearNumber !== 3) return false;
      if (activeHodYearFilter === 'YEAR_4' && s.yearNumber !== 4) return false;
    }

    // 2. Search Query
    if (activeHodSearchQuery) {
      const matchRoll = s.rollNumber.toLowerCase().includes(activeHodSearchQuery);
      const matchReg = (s.registerNumber || '').toLowerCase().includes(activeHodSearchQuery);
      const matchName = s.fullName.toLowerCase().includes(activeHodSearchQuery);
      const matchSec = s.classSection.toLowerCase().includes(activeHodSearchQuery);
      if (!matchRoll && !matchReg && !matchName && !matchSec) return false;
    }

    return true;
  });

  const pendingPassesCount = sampleAcademicVerifications.length;
  const tutors = window.tutorSectionAllocations || [];

  area.innerHTML = `
    <!-- Header Hero Banner -->
    <div style="background: linear-gradient(135deg, rgba(37, 99, 235, 0.25), rgba(79, 70, 229, 0.2)); border: 1px solid var(--border-glow); border-radius: var(--radius-lg); padding: 1.5rem 2rem; margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
      <div>
        <h2 style="font-size: 1.5rem; font-weight: 800;">Head of Department Portal 🎓</h2>
        <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 0.25rem;">
          Department: <b>${user.department || 'Computer Science & Engineering'}</b> • Head: <b>${user.fullName || 'Dr. K. Suresh'}</b>
        </p>
      </div>
      <div style="display: flex; gap: 0.75rem;">
        <button class="btn btn-primary" onclick="openPostNoticeModal()">
          📢 Issue Department Circular
        </button>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid-stats">
      <div class="stat-card" style="border-color: rgba(59, 130, 246, 0.4);">
        <div class="stat-info">
          <div class="stat-label">4-Year Hostel Residents</div>
          <div class="stat-value">${students.length} Students</div>
          <span style="font-size: 0.72rem; color: #60A5FA; font-weight: 600;">Exclusively Hostellers (Years 1 to 4)</span>
        </div>
        <div class="stat-icon">🏛️</div>
      </div>
      <div class="stat-card" style="border-color: rgba(16, 185, 129, 0.4);">
        <div class="stat-info">
          <div class="stat-label">Section Class Tutors</div>
          <div class="stat-value">${tutors.length} Tutors</div>
          <span style="font-size: 0.72rem; color: #34D399; font-weight: 600;">Sections A & B Managed</span>
        </div>
        <div class="stat-icon">📚</div>
      </div>
      <div class="stat-card" style="border-color: rgba(245, 158, 11, 0.4);">
        <div class="stat-info">
          <div class="stat-label">Pending Clearances</div>
          <div class="stat-value">${pendingPassesCount}</div>
          <span style="font-size: 0.72rem; color: #FBBF24; font-weight: 600;">OUT/IN & Room Stay Passes</span>
        </div>
        <div class="stat-icon">⏳</div>
      </div>
      <div class="stat-card" style="border-color: rgba(139, 92, 246, 0.4);">
        <div class="stat-info">
          <div class="stat-label">Department Notices</div>
          <div class="stat-value">Active Circulars</div>
          <span style="font-size: 0.72rem; color: #A78BFA; font-weight: 600;">Auto-routes to Wardens & Tutors</span>
        </div>
        <div class="stat-icon">📢</div>
      </div>
    </div>

    <!-- SECTION 1: CENTRAL 4-YEAR HOSTEL STUDENT CLEARANCE DIRECTORY -->
    <div class="dashboard-section" id="sectionHodHostelRegistry">
      <div class="section-header" style="flex-wrap: wrap; gap: 0.75rem;">
        <div>
          <h3 class="section-title">🏛️ 4-Year Hostel Student Clearance Directory (Hostel Residents Only)</h3>
          <p style="font-size: 0.82rem; color: var(--text-muted); margin-top: 0.2rem;">
            Exclusively lists residential hostel students across all four academic years (I, II, III, IV Year). Day scholars are excluded from this hostel portal.
          </p>
        </div>
        <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
          <input type="text" class="form-control" placeholder="Search Roll, Reg No or Name..." value="${activeHodSearchQuery}" oninput="handleHodSearch(this.value)" style="width: 240px; padding: 0.4rem 0.75rem; font-size: 0.82rem;">
        </div>
      </div>

      <!-- Year Filter Tabs -->
      <div style="display: flex; gap: 0.4rem; margin-bottom: 1.25rem; flex-wrap: wrap;">
        <button class="btn ${activeHodYearFilter === 'ALL' ? 'btn-primary' : 'btn-secondary'}" style="padding: 0.35rem 0.8rem; font-size: 0.78rem;" onclick="setHodYearFilter('ALL')">
          All 4 Years (${students.length})
        </button>
        <button class="btn ${activeHodYearFilter === 'YEAR_1' ? 'btn-primary' : 'btn-secondary'}" style="padding: 0.35rem 0.8rem; font-size: 0.78rem;" onclick="setHodYearFilter('YEAR_1')">
          1st Year (${students.filter(s => s.yearNumber === 1).length})
        </button>
        <button class="btn ${activeHodYearFilter === 'YEAR_2' ? 'btn-primary' : 'btn-secondary'}" style="padding: 0.35rem 0.8rem; font-size: 0.78rem;" onclick="setHodYearFilter('YEAR_2')">
          2nd Year (${students.filter(s => s.yearNumber === 2).length})
        </button>
        <button class="btn ${activeHodYearFilter === 'YEAR_3' ? 'btn-primary' : 'btn-secondary'}" style="padding: 0.35rem 0.8rem; font-size: 0.78rem;" onclick="setHodYearFilter('YEAR_3')">
          3rd Year (${students.filter(s => s.yearNumber === 3).length})
        </button>
        <button class="btn ${activeHodYearFilter === 'YEAR_4' ? 'btn-primary' : 'btn-secondary'}" style="padding: 0.35rem 0.8rem; font-size: 0.78rem;" onclick="setHodYearFilter('YEAR_4')">
          4th Year (${students.filter(s => s.yearNumber === 4).length})
        </button>
      </div>

      <div class="table-responsive">
        <table class="custom-table">
          <thead>
            <tr>
              <th>Academic Year</th>
              <th>Roll Number & Reg No</th>
              <th>Student Name</th>
              <th>Section & Tutor</th>
              <th>Hostel & Room</th>
              <th>Academic Attendance (Uploaded by Tutor)</th>
              <th>Clearance Eligibility</th>
            </tr>
          </thead>
          <tbody>
            ${filteredStudents.length === 0 ? `
              <tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 2rem;">No hostel students found matching this criteria.</td></tr>
            ` : filteredStudents.map(s => {
              const attData = window.getStudentAttendance ? window.getStudentAttendance(s.rollNumber) : { attendance: 80 };
              const attPct = attData.attendance !== null && attData.attendance !== undefined ? attData.attendance : null;
              const isEligible = attPct !== null && attPct >= 75;
              const isWarning = attPct !== null && attPct < 75;

              return `
                <tr>
                  <td>
                    <span class="status-pill" style="font-size: 0.72rem; background: rgba(99, 102, 241, 0.15); color: #A5B4FC;">
                      ${s.year}
                    </span>
                  </td>
                  <td>
                    <b style="color: #38BDF8;">${s.rollNumber}</b><br>
                    <span style="font-size: 0.75rem; color: var(--text-muted);">Reg: ${s.registerNumber || '730323104XXX'}</span>
                  </td>
                  <td>
                    <b>${s.fullName}</b><br>
                    <span style="font-size: 0.75rem; color: var(--text-muted);">${s.phone}</span>
                  </td>
                  <td>
                    <b>${s.classSection}</b><br>
                    <span style="font-size: 0.75rem; color: var(--text-muted);">${s.assignedTutor}</span>
                  </td>
                  <td>
                    <span class="pass-type-tag roomstay" style="font-size: 0.72rem;">Room ${s.roomNumber}</span><br>
                    <span style="font-size: 0.75rem; color: var(--text-muted);">${s.hostelName} (${s.hostelBlock})</span>
                  </td>
                  <td>
                    ${attPct !== null ? `
                      <b style="font-size: 1.05rem; color: ${isEligible ? '#34D399' : '#EF4444'};">${attPct}%</b><br>
                      <span style="font-size: 0.72rem; color: var(--text-muted);">Uploaded by ${attData.uploadedBy || 'Class Tutor'}</span>
                    ` : `
                      <span class="status-pill pending" style="font-size: 0.72rem;">Pending Tutor Upload</span>
                    `}
                  </td>
                  <td>
                    ${isEligible ? `
                      <span class="status-pill approved" style="font-size: 0.72rem;">✓ Clearance Eligible (≥75%)</span>
                    ` : isWarning ? `
                      <span class="status-pill pending" style="font-size: 0.72rem; background: rgba(239, 68, 68, 0.15); color: #F87171; border: 1px solid rgba(239, 68, 68, 0.3);">
                        ⚠️ Under 75% (Medical Only)
                      </span>
                    ` : `
                      <span class="status-pill pending" style="font-size: 0.72rem;">Awaiting Tutor Roster</span>
                    `}
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- SECTION 2: CLASS TUTOR SECTION ALLOCATIONS (MANAGED BY HOD) -->
    <div class="dashboard-section" id="sectionHodTutors">
      <div class="section-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
        <div>
          <h3 class="section-title">📚 Department Class Tutor Section Allocations (HoD Authority)</h3>
          <p style="font-size: 0.82rem; color: var(--text-muted); margin-top: 0.2rem;">
            Class Tutors organize separate sections. Each Tutor handles academic clearances and attendance uploads for hostel students in their assigned section across all 4 years.
          </p>
        </div>
        <button class="btn btn-primary" style="padding: 0.45rem 0.9rem; font-size: 0.82rem;" onclick="openAddTutorModal()">
          + Assign New Class Tutor
        </button>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.25rem;">
        ${tutors.map(t => `
          <div class="stat-card" style="display: block; border-color: rgba(99, 102, 241, 0.3);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
              <div>
                <b style="font-size: 1.1rem; color: var(--text-main);">${t.section}</b>
                <div style="font-size: 0.85rem; color: #818CF8; margin-top: 0.2rem;">Class Tutor: <b>${t.tutorName}</b></div>
                <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.15rem;">Login Username: <code>${t.tutorId || 'tutor'}</code></div>
              </div>
              <span class="status-pill approved">${students.filter(s => s.classSection === t.section).length} Hostellers</span>
            </div>
            <div style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.7; margin-top: 0.75rem; border-top: 1px solid var(--border-glass); padding-top: 0.5rem;">
              • Jurisdiction: <b>${t.yearScope}</b><br>
              • Responsibility: <b>Uploads Academic Attendance & Issues Pass Clearances</b><br>
              • Authority: <b>Flexible first or second pass approval</b>
            </div>
            <div style="margin-top: 0.75rem; border-top: 1px solid var(--border-glass); padding-top: 0.6rem; display: flex; justify-content: flex-end; gap: 0.5rem;">
              <button class="btn btn-secondary" style="padding: 0.3rem 0.65rem; font-size: 0.78rem;" onclick="openEditTutorModal('${t.tutorId}')">✏️ Edit</button>
              <button class="btn btn-danger" style="padding: 0.3rem 0.65rem; font-size: 0.78rem;" onclick="deleteTutorAllocation('${t.tutorId}')">🗑️ Remove</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- SECTION 3: DEPARTMENT CLEARANCES QUEUE (OUT/IN & ROOM STAY PASSES) -->
    <div class="dashboard-section" id="sectionHodClearances">
      <div class="section-header">
        <h3 class="section-title">🎓 Department Pass Clearances Queue (HoD Overview)</h3>
        <span class="status-pill pending">${sampleAcademicVerifications.length} Pending</span>
      </div>

      <div class="table-responsive">
        <table class="custom-table">
          <thead>
            <tr>
              <th>Student Details</th>
              <th>Pass Type</th>
              <th>Reason & Dates</th>
              <th>Deputy Warden Approval</th>
              <th>Tutor Clearance Status</th>
              <th>Academic Action</th>
            </tr>
          </thead>
          <tbody>
            ${sampleAcademicVerifications.length === 0 ? `
              <tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">All department pass clearances have been signed off.</td></tr>
            ` : sampleAcademicVerifications.map(item => `
              <tr>
                <td>
                  <b>${item.studentName}</b><br>
                  <span style="font-size: 0.78rem; color: var(--text-muted);">${item.rollNumber} • ${item.classSection}</span>
                </td>
                <td>
                  <span class="pass-type-tag ${item.passType === 'OUT_IN_PASS' ? 'outin' : 'roomstay'}">
                    ${item.passType === 'OUT_IN_PASS' ? 'OUT / IN PASS' : 'ROOM STAY PASS'}
                  </span>
                </td>
                <td>
                  <b>${item.reason}</b><br>
                  <span style="font-size: 0.78rem; color: var(--text-muted);">${item.dates}</span>
                  ${item.isSick ? `<br><span class="status-pill approved" style="font-size: 0.7rem;">Medical / Sick Ground</span>` : ''}
                </td>
                <td>
                  <span class="status-pill ${item.wardenApproval === 'APPROVED' ? 'approved' : 'pending'}" style="font-size: 0.74rem;">
                    ${item.wardenApproval === 'APPROVED' ? '✓ Warden Approved' : '⏳ Warden Pending'}
                  </span>
                </td>
                <td>
                  <span class="status-pill ${item.tutorApproval === 'APPROVED' ? 'approved' : 'pending'}" style="font-size: 0.74rem;">
                    ${item.tutorApproval === 'APPROVED' ? '✓ Tutor Approved' : '⏳ Tutor Pending'}
                  </span>
                </td>
                <td>
                  <div style="display: flex; gap: 0.4rem;">
                    <button class="btn btn-primary" style="padding: 0.4rem 0.8rem; font-size: 0.76rem;" onclick="approveAcademicPass('${item.id}')">
                      🎓 HoD Signoff
                    </button>
                    <button class="btn btn-danger" style="padding: 0.4rem 0.6rem; font-size: 0.76rem;" onclick="rejectAcademicPass('${item.id}')">
                      ✕ Reject
                    </button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Multi-Tier Role-Scoped Notice Board -->
    ${typeof renderNoticeBoardSection === 'function' ? renderNoticeBoardSection() : ''}
  `;
}

// ==========================================================================
// 2. TUTOR DASHBOARD: Section-Scoped Clearance & Academic Attendance Roster
// ==========================================================================
function renderTutorDashboard(area, user) {
  const tutorSection = user.classSection || 'Section A';
  const allStudents = window.STUDENT_REGISTRY || [];
  
  // Scoped strictly to this Tutor's assigned section!
  const myStudents = allStudents.filter(s => s.classSection === tutorSection);

  // Scoped clearances queue
  const myQueue = sampleAcademicVerifications.filter(item => item.classSection === tutorSection);

  area.innerHTML = `
    <!-- Header Hero Banner -->
    <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(59, 130, 246, 0.15)); border: 1px solid var(--border-glow); border-radius: var(--radius-lg); padding: 1.5rem 2rem; margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
      <div>
        <h2 style="font-size: 1.5rem; font-weight: 800;">Class Tutor Administration Portal 📚</h2>
        <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 0.25rem;">
          Tutor: <b>${user.fullName || 'Prof. M. Priya'}</b> • Assigned Jurisdiction: <b style="color: #34D399;">${tutorSection}</b> (Hostellers across All Years)
        </p>
      </div>
      <div style="display: flex; gap: 0.75rem;">
        <button class="btn btn-secondary" onclick="document.getElementById('sectionTutorAttendance').scrollIntoView({ behavior: 'smooth' })">
          📝 Upload Section Attendance
        </button>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid-stats">
      <div class="stat-card" style="border-color: rgba(52, 211, 153, 0.4);">
        <div class="stat-info">
          <div class="stat-label">My Section Hostel Residents</div>
          <div class="stat-value">${myStudents.length} Students</div>
          <span style="font-size: 0.72rem; color: #34D399; font-weight: 600;">Scoped to ${tutorSection} (All 4 Years)</span>
        </div>
        <div class="stat-icon">👥</div>
      </div>
      <div class="stat-card" style="border-color: rgba(245, 158, 11, 0.4);">
        <div class="stat-info">
          <div class="stat-label">Pending Clearances</div>
          <div class="stat-value">${myQueue.length} Requests</div>
          <span style="font-size: 0.72rem; color: #FBBF24; font-weight: 600;">OUT/IN & Room Stay Passes</span>
        </div>
        <div class="stat-icon">⏳</div>
      </div>
      <div class="stat-card" style="border-color: rgba(59, 130, 246, 0.4);">
        <div class="stat-info">
          <div class="stat-label">Completed Clearances</div>
          <div class="stat-value">${sampleOverdueAcademicQueue.length}</div>
          <span style="font-size: 0.72rem; color: #60A5FA; font-weight: 600;">Academic signoffs recorded</span>
        </div>
        <div class="stat-icon">✅</div>
      </div>
    </div>

    <!-- SECTION 1: PENDING PASS CLEARANCES QUEUE (OUT/IN AND ROOM STAY) -->
    <div class="dashboard-section" id="sectionTutorClearances">
      <div class="section-header">
        <h3 class="section-title">🎓 Leave & Room Stay Pass Clearances (${tutorSection})</h3>
        <span class="status-pill pending">${myQueue.length} Pending Approval</span>
      </div>
      <div style="background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3); padding: 0.85rem; border-radius: 8px; margin-bottom: 1.25rem; font-size: 0.85rem; color: #93C5FD;">
        ℹ️ <b>Flexible Dual-Approval:</b> Either you or the Deputy Warden can approve passes first. Both OUT/IN passes and Room Stay passes require your academic clearance. Academic attendance displayed is strictly from your uploaded section roster below.
      </div>

      <div class="table-responsive">
        <table class="custom-table">
          <thead>
            <tr>
              <th>Student Details</th>
              <th>Pass Type</th>
              <th>Reason & Destination</th>
              <th>Schedule</th>
              <th>Deputy Warden State</th>
              <th>Academic Attendance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${myQueue.length === 0 ? `
              <tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 2rem;">No pending leave or room stay passes for ${tutorSection}.</td></tr>
            ` : myQueue.map(item => {
              const attData = window.getStudentAttendance ? window.getStudentAttendance(item.rollNumber) : { attendance: 82 };
              const attPct = attData.attendance;

              return `
                <tr>
                  <td>
                    <b>${item.studentName}</b><br>
                    <span style="font-size: 0.78rem; color: var(--text-muted);">${item.rollNumber} • ${item.classSection}</span>
                  </td>
                  <td>
                    <span class="pass-type-tag ${item.passType === 'OUT_IN_PASS' ? 'outin' : 'roomstay'}">
                      ${item.passType === 'OUT_IN_PASS' ? 'OUT / IN PASS' : 'ROOM STAY'}
                    </span>
                  </td>
                  <td>
                    <b>${item.reason}</b><br>
                    <span style="font-size: 0.78rem; color: var(--text-muted);">${item.destination || 'Campus'}</span>
                    ${item.isSick ? `<br><span class="status-pill approved" style="font-size: 0.7rem;">Medical / Sick Ground</span>` : ''}
                  </td>
                  <td>${item.dates}</td>
                  <td>
                    <span class="status-pill ${item.wardenApproval === 'APPROVED' ? 'approved' : 'pending'}" style="font-size: 0.72rem;">
                      ${item.wardenApproval === 'APPROVED' ? '✓ Warden Approved' : '⏳ Warden Pending'}
                    </span>
                  </td>
                  <td>
                    <b style="font-size: 1.05rem; color: ${attPct >= 75 ? '#34D399' : '#EF4444'};">${attPct}%</b><br>
                    <span style="font-size: 0.7rem; color: var(--text-muted);">Uploaded by You</span>
                  </td>
                  <td>
                    <div style="display: flex; gap: 0.4rem;">
                      <button class="btn btn-success" style="padding: 0.4rem 0.8rem; font-size: 0.76rem;" onclick="approveAcademicPass('${item.id}')">
                        ✅ Approve Pass
                      </button>
                      <button class="btn btn-danger" style="padding: 0.4rem 0.6rem; font-size: 0.76rem;" onclick="rejectAcademicPass('${item.id}')">
                        ✕ Reject
                      </button>
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- SECTION 2: CLASS SECTION ACADEMIC ATTENDANCE ROSTER (UPLOAD / UPDATE) -->
    <div class="dashboard-section" id="sectionTutorAttendance">
      <div class="section-header">
        <h3 class="section-title">📝 Class Section Academic Attendance Roster (${tutorSection})</h3>
      </div>
      <p style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 1.25rem;">
        <b>Tutor Attendance Authority:</b> The academic attendance percentage displayed everywhere across the entire hostel portal is strictly entered and uploaded here by you. Update any student's percentage below and click Save.
      </p>

      <div class="table-responsive">
        <table class="custom-table">
          <thead>
            <tr>
              <th>Roll Number & Reg No</th>
              <th>Student Name</th>
              <th>Academic Year</th>
              <th>Hostel & Room</th>
              <th>Current Academic Attendance %</th>
              <th>Save / Upload Attendance</th>
            </tr>
          </thead>
          <tbody>
            ${myStudents.length === 0 ? `
              <tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">No students assigned to ${tutorSection}.</td></tr>
            ` : myStudents.map(s => {
              const attData = window.getStudentAttendance ? window.getStudentAttendance(s.rollNumber) : { attendance: 80 };
              const currentPct = attData.attendance !== null ? attData.attendance : 80;

              return `
                <tr>
                  <td>
                    <b style="color: #38BDF8;">${s.rollNumber}</b><br>
                    <span style="font-size: 0.75rem; color: var(--text-muted);">Reg: ${s.registerNumber}</span>
                  </td>
                  <td>
                    <b>${s.fullName}</b><br>
                    <span style="font-size: 0.75rem; color: var(--text-muted);">${s.phone}</span>
                  </td>
                  <td>
                    <span class="status-pill" style="font-size: 0.72rem; background: rgba(99, 102, 241, 0.15); color: #A5B4FC;">
                      ${s.year}
                    </span>
                  </td>
                  <td>
                    <span class="pass-type-tag roomstay" style="font-size: 0.72rem;">Room ${s.roomNumber}</span><br>
                    <span style="font-size: 0.75rem; color: var(--text-muted);">${s.hostelName}</span>
                  </td>
                  <td>
                    <div style="display: flex; align-items: center; gap: 0.4rem;">
                      <input type="number" class="form-control" id="tutorRosterAtt_${s.rollNumber}" min="0" max="100" value="${currentPct}" style="width: 85px; font-weight: 700; text-align: center;">
                      <b style="color: var(--text-main);">%</b>
                    </div>
                    <span style="font-size: 0.72rem; color: var(--text-muted);">Last updated: ${attData.updatedAt || 'Recent'}</span>
                  </td>
                  <td>
                    <button class="btn btn-primary" style="padding: 0.35rem 0.8rem; font-size: 0.76rem;" onclick="saveTutorAttendanceRoster('${s.rollNumber}', '${s.fullName}')">
                      💾 Save & Upload
                    </button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- SECTION 3: COMPLETED ACADEMIC CLEARANCES HISTORY -->
    <div class="dashboard-section" id="sectionAcademicOverdue">
      <div class="section-header">
        <h3 class="section-title">⏳ Academic Leave History & Clearance Records</h3>
      </div>

      <div class="table-responsive">
        <table class="custom-table">
          <thead>
            <tr>
              <th>Student Details</th>
              <th>Pass Type</th>
              <th>Attendance Recorded</th>
              <th>Leave Schedule</th>
              <th>Reason</th>
              <th>Clearance Outcome</th>
            </tr>
          </thead>
          <tbody>
            ${sampleOverdueAcademicQueue.map(item => `
              <tr>
                <td>
                  <b>${item.studentName}</b><br>
                  <span style="font-size: 0.78rem; color: var(--text-muted);">${item.rollNumber} • ${item.classSection}</span>
                </td>
                <td>
                  <span class="pass-type-tag ${item.passType === 'OUT_IN_PASS' ? 'outin' : 'roomstay'}">
                    ${item.passType || 'OUT_IN_PASS'}
                  </span>
                </td>
                <td>
                  <b style="color: #34D399; font-size: 1.05rem;">${item.attendanceEntered}</b>
                </td>
                <td>${item.dates}</td>
                <td>${item.reason}</td>
                <td><span class="status-pill approved">${item.clearanceStatus}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Multi-Tier Role-Scoped Notice Board -->
    ${typeof renderNoticeBoardSection === 'function' ? renderNoticeBoardSection() : ''}
  `;
}

// ==========================================================================
// Pass Clearance Actions (Flexible Dual Approval)
// ==========================================================================
function approveAcademicPass(passId) {
  const user = getCurrentUser() || {};
  const item = sampleAcademicVerifications.find(p => p.id === passId);
  if (!item) return;

  const attData = window.getStudentAttendance ? window.getStudentAttendance(item.rollNumber) : { attendance: 82 };
  const attPct = attData.attendance;

  // Under 75% Check
  if (attPct < 75) {
    const isSick = item.isSick || 
                   item.reason.toLowerCase().includes('sick') || 
                   item.reason.toLowerCase().includes('medical') || 
                   item.reason.toLowerCase().includes('fever') || 
                   item.reason.toLowerCase().includes('hospital') || 
                   item.reason.toLowerCase().includes('doctor');

    if (isSick) {
      const confirmException = confirm(
        `⚠️ ATTENDANCE BELOW STATUTORY 75% (${attPct}%)\n\n` +
        `Student: ${item.studentName} (${item.rollNumber})\n` +
        `Uploaded Attendance: ${attPct}%\n` +
        `Reason: "${item.reason}"\n\n` +
        `✅ EXCEPTION APPLIES: Medical/Sick ground confirmed.\n\n` +
        `Grant Academic Clearance under the Medical Attendance Exception?`
      );
      if (!confirmException) return;
    } else {
      alert(
        `❌ INSUFFICIENT ATTENDANCE (< 75%)!\n\n` +
        `Student ${item.studentName} has ${attPct}% attendance (uploaded by Class Tutor).\n\n` +
        `Statutory Anna University & ACE rules require ≥ 75% attendance for regular leaves. Exceptions are strictly limited to Medical/Sick leaves.`
      );
      return;
    }
  }

  item.tutorApproval = 'APPROVED';
  item.tutorApprovedBy = user.fullName || 'Class Tutor';
  item.tutorApprovedAt = new Date().toISOString().replace('T', ' ').slice(0, 19);

  const isWardenApproved = (item.wardenApproval === 'APPROVED');
  const finalStatus = isWardenApproved ? 'APPROVED' : 'PARTIAL_TUTOR_APPROVED';

  // 1. Update Student active pass
  if (window.sampleOutInPasses && item.passType === 'OUT_IN_PASS') {
    const sp = window.sampleOutInPasses.find(p => p.id === item.id || p.passCode === item.id);
    if (sp) {
      sp.academicStatus = 'APPROVED_BY_TUTOR';
      sp.tutorApproval = 'APPROVED';
      if (sp.wardenApproval === 'APPROVED' || sp.hostelStatus === 'APPROVED_BY_WARDEN') {
        sp.finalStatus = 'APPROVED';
      } else {
        sp.finalStatus = 'TUTOR_APPROVED (Awaiting Warden)';
      }
    }
  }

  if (window.sampleRoomStayPasses && item.passType === 'ROOM_STAY_PASS') {
    const rp = window.sampleRoomStayPasses.find(p => p.id === item.id || p.passCode === item.id);
    if (rp) {
      rp.academicStatus = 'APPROVED_BY_TUTOR';
      rp.tutorApproval = 'APPROVED';
      if (rp.wardenApproval === 'APPROVED' || rp.hostelStatus === 'APPROVED_BY_WARDEN') {
        rp.finalStatus = 'APPROVED';
      } else {
        rp.finalStatus = 'TUTOR_APPROVED (Awaiting Warden)';
      }
    }
  }

  // 2. Update Warden queues
  if (window.sampleWardenPendingPasses) {
    const wp = window.sampleWardenPendingPasses.find(p => p.id === item.id);
    if (wp) {
      wp.tutorApproval = 'APPROVED';
    }
  }

  if (window.sampleWardenIssuedOutInPasses) {
    const wi = window.sampleWardenIssuedOutInPasses.find(p => p.id === item.id);
    if (wi) {
      wi.academicStatus = 'APPROVED_BY_TUTOR';
      wi.tutorApproval = 'APPROVED';
    }
  }

  if (window.sampleWardenIssuedRoomStayPasses) {
    const wr = window.sampleWardenIssuedRoomStayPasses.find(p => p.id === item.id);
    if (wr) {
      wr.academicStatus = 'APPROVED_BY_TUTOR';
      wr.tutorApproval = 'APPROVED';
      wr.status = 'ACTIVE';
    }
  }

  // 3. Move to completed history
  sampleOverdueAcademicQueue.unshift({
    id: item.id,
    studentName: item.studentName,
    rollNumber: item.rollNumber,
    classSection: item.classSection,
    passType: item.passType,
    attendanceEntered: `${attPct}% (Uploaded by ${attData.uploadedBy || 'Tutor'})`,
    dates: item.dates,
    reason: item.reason,
    clearanceStatus: isWardenApproved ? 'FULLY_CLEARED (Tutor + Warden)' : 'CLEARED_BY_TUTOR (Awaiting Warden)',
    status: 'COMPLETED'
  });

  sampleAcademicVerifications = sampleAcademicVerifications.filter(p => p.id !== passId);
  if (window.saveAppState) window.saveAppState();
  renderAcademicDashboard();

  alert(`✅ ACADEMIC CLEARANCE GRANTED!\n\n` +
        `Student: ${item.studentName} (${item.rollNumber})\n` +
        `Pass Type: ${item.passType}\n` +
        `Attendance Verified: ${attPct}%\n\n` +
        `Dual-Approval State: ${isWardenApproved ? 'FULLY ACTIVE (Both Tutor & Warden Approved)' : 'Tutor Cleared (Awaiting Deputy Warden Approval)'}`);
}

function rejectAcademicPass(passId) {
  const item = sampleAcademicVerifications.find(p => p.id === passId);
  sampleAcademicVerifications = sampleAcademicVerifications.filter(p => p.id !== passId);

  if (item) {
    // 1. Sync student pass status
    if (window.sampleOutInPasses) {
      const sp = window.sampleOutInPasses.find(p => p.id === passId || p.passCode === passId);
      if (sp) {
        sp.finalStatus = 'REJECTED_BY_ACADEMIC';
        sp.tutorApproval = 'REJECTED';
      }
    }

    if (window.sampleRoomStayPasses) {
      const rp = window.sampleRoomStayPasses.find(p => p.id === passId || p.passCode === passId);
      if (rp) {
        rp.finalStatus = 'REJECTED_BY_ACADEMIC';
        rp.tutorApproval = 'REJECTED';
      }
    }

    // 2. Remove from warden pending queue
    if (window.sampleWardenPendingPasses) {
      window.sampleWardenPendingPasses = window.sampleWardenPendingPasses.filter(p => p.id !== passId);
    }

    sampleOverdueAcademicQueue.unshift({
      id: item.id,
      studentName: item.studentName,
      rollNumber: item.rollNumber,
      classSection: item.classSection,
      passType: item.passType,
      attendanceEntered: 'Rejected',
      dates: item.dates,
      reason: item.reason,
      clearanceStatus: 'REJECTED_BY_ACADEMIC',
      status: 'REJECTED'
    });
  }

  if (window.saveAppState) window.saveAppState();
  renderAcademicDashboard();
  alert(`Academic clearance rejected for ${item ? item.studentName : passId}. Synchronized across student & warden queues.`);
}

function saveTutorAttendanceRoster(rollNumber, studentName) {
  const inputEl = document.getElementById(`tutorRosterAtt_${rollNumber}`);
  if (!inputEl) return;

  const user = getCurrentUser() || {};
  const enteredVal = inputEl.value.trim();
  const pct = parseFloat(enteredVal);

  if (isNaN(pct) || pct < 0 || pct > 100) {
    alert('⚠️ Invalid Percentage! Please enter a value between 0% and 100%.');
    return;
  }

  if (window.updateStudentAttendance) {
    window.updateStudentAttendance(rollNumber, pct, user.fullName || 'Class Tutor');
  }

  if (window.saveAppState) window.saveAppState();
  renderAcademicDashboard();
  alert(`✅ ATTENDANCE UPLOADED SUCCESSFULLY!\n\n` +
        `Student: ${studentName} (${rollNumber})\n` +
        `Academic Attendance: ${pct}%\n` +
        `Uploaded By: ${user.fullName || 'Class Tutor'}\n\n` +
        `This verified attendance will now reflect everywhere across the entire hostel portal.`);
}

// ==========================================================================
// HoD Class Tutor Management Handlers
// ==========================================================================
function openAddTutorModal() {
  const modal = document.getElementById('manageTutorModal');
  if (!modal) return;
  document.getElementById('manageTutorModalTitle').innerText = '📚 Assign Class Tutor (HoD Authority)';
  document.getElementById('tutorEditId').value = '';
  document.getElementById('tutorSectionInput').value = '';
  document.getElementById('tutorNameInput').value = '';
  document.getElementById('tutorUsernameInput').value = '';
  document.getElementById('tutorPasswordInput').value = 'pass123';
  document.getElementById('tutorScopeInput').value = 'Years 1, 2, 3, 4 (Section Hostellers)';
  modal.classList.add('active');
}

function openEditTutorModal(tutorId) {
  const modal = document.getElementById('manageTutorModal');
  if (!modal) return;
  const tutors = window.tutorSectionAllocations || [];
  const t = tutors.find(item => item.tutorId === tutorId);
  if (!t) return;
  document.getElementById('manageTutorModalTitle').innerText = '✏️ Edit Class Tutor Allocation';
  document.getElementById('tutorEditId').value = t.tutorId;
  document.getElementById('tutorSectionInput').value = t.section || '';
  document.getElementById('tutorNameInput').value = t.tutorName || '';
  document.getElementById('tutorUsernameInput').value = t.tutorId || '';
  document.getElementById('tutorPasswordInput').value = 'pass123';
  document.getElementById('tutorScopeInput').value = t.yearScope || 'Years 1, 2, 3, 4';
  modal.classList.add('active');
}

function closeTutorModal() {
  const modal = document.getElementById('manageTutorModal');
  if (modal) modal.classList.remove('active');
}

function handleSaveTutorSubmit(e) {
  e.preventDefault();
  const editId = document.getElementById('tutorEditId').value;
  const section = document.getElementById('tutorSectionInput').value.trim();
  const name = document.getElementById('tutorNameInput').value.trim();
  const username = document.getElementById('tutorUsernameInput').value.trim();
  const password = document.getElementById('tutorPasswordInput').value.trim();
  const scope = document.getElementById('tutorScopeInput').value.trim();

  if (!section || !name || !username) {
    alert('Please fill out all required fields.');
    return;
  }

  if (!window.tutorSectionAllocations) window.tutorSectionAllocations = [];
  if (!window.SYSTEM_ACCOUNTS) window.SYSTEM_ACCOUNTS = {};

  if (editId) {
    const idx = window.tutorSectionAllocations.findIndex(item => item.tutorId === editId);
    if (idx !== -1) {
      window.tutorSectionAllocations[idx].section = section;
      window.tutorSectionAllocations[idx].tutorName = name;
      window.tutorSectionAllocations[idx].yearScope = scope;
    }
  } else {
    const existing = window.tutorSectionAllocations.find(item => item.tutorId === username);
    if (existing) {
      alert(`⚠️ A tutor with username "${username}" already exists!`);
      return;
    }
    window.tutorSectionAllocations.push({
      tutorId: username,
      tutorName: name,
      department: 'Computer Science & Engineering',
      section: section,
      yearScope: scope,
      studentsCount: 0
    });
  }

  window.SYSTEM_ACCOUNTS[username] = {
    id: Date.now(),
    username: username,
    password: password,
    fullName: `${name} (Class Tutor)`,
    role: 'TUTOR',
    department: 'Computer Science & Engineering',
    classSection: section
  };

  if (window.saveAppState) window.saveAppState();
  closeTutorModal();
  renderAcademicDashboard();
  alert(`✅ CLASS TUTOR ALLOCATION SAVED!\n\nTutor: ${name}\nSection: ${section}\nUsername: ${username}\nCredentials registered for instant login.`);
}

function deleteTutorAllocation(tutorId) {
  if (!confirm(`⚠️ Are you sure you want to remove Class Tutor allocation "${tutorId}"?\n\nThis will unassign the tutor from their section.`)) {
    return;
  }
  if (!window.tutorSectionAllocations) window.tutorSectionAllocations = [];
  window.tutorSectionAllocations = window.tutorSectionAllocations.filter(t => t.tutorId !== tutorId);
  
  if (window.saveAppState) window.saveAppState();
  renderAcademicDashboard();
  alert(`🗑️ CLASS TUTOR ALLOCATION REMOVED!\n\nTutor ${tutorId} has been successfully unassigned.`);
}

// Window bindings
window.renderAcademicDashboard = renderAcademicDashboard;
window.approveAcademicPass = approveAcademicPass;
window.rejectAcademicPass = rejectAcademicPass;
window.setHodYearFilter = setHodYearFilter;
window.handleHodSearch = handleHodSearch;
window.saveTutorAttendanceRoster = saveTutorAttendanceRoster;
window.openAddTutorModal = openAddTutorModal;
window.openEditTutorModal = openEditTutorModal;
window.closeTutorModal = closeTutorModal;
window.handleSaveTutorSubmit = handleSaveTutorSubmit;
window.deleteTutorAllocation = deleteTutorAllocation;
window.sampleAcademicVerifications = sampleAcademicVerifications;
window.sampleOverdueAcademicQueue = sampleOverdueAcademicQueue;
