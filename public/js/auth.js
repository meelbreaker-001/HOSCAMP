/* ==========================================================================
   CampusConnect - Authentication & Role State Manager
   Adhiyamaan College of Engineering (ACE)
   ========================================================================== */

const ROLES = {
  ADMIN: { code: 'ADMIN', name: 'Principal / Supreme Head', badgeClass: 'admin', icon: '🏛️' },
  CHIEF_WARDEN: { code: 'ADMIN', name: 'Chief Warden (Central Authority)', badgeClass: 'admin', icon: '👑' },
  HOD: { code: 'HOD', name: 'Head of Department', badgeClass: 'hod', icon: '🎓' },
  TUTOR: { code: 'TUTOR', name: 'Class Tutor', badgeClass: 'tutor', icon: '📚' },
  WARDEN: { code: 'WARDEN', name: 'Deputy Warden', badgeClass: 'warden', icon: '🛡️' },
  SECURITY: { code: 'SECURITY', name: 'Master Security', badgeClass: 'security', icon: '👮' },
  STUDENT: { code: 'STUDENT', name: 'Hostel Student', badgeClass: 'student', icon: '🎒' }
};

// Developer-Managed System Database Accounts
const SYSTEM_ACCOUNTS = {
  'principal@adhiyamaan.ac.in': {
    id: 1,
    username: 'principal@adhiyamaan.ac.in',
    fullName: 'Dr. G. Ranganath (Principal)',
    role: 'ADMIN',
    email: 'principal@adhiyamaan.ac.in',
    hostelJurisdiction: 'All Campus Hostels (Pennar, Bhavani, Cauvery)'
  },
  'chiefwarden@adhiyamaan.ac.in': {
    id: 2,
    username: 'chiefwarden@adhiyamaan.ac.in',
    fullName: 'Prof. R. Sengottuvelu (Chief Warden)',
    role: 'ADMIN',
    email: 'chiefwarden@adhiyamaan.ac.in',
    hostelJurisdiction: 'All Campus Hostels (Pennar, Bhavani, Cauvery)'
  },
  'warden_block_b': {
    id: 3,
    username: 'warden_block_b',
    fullName: 'Prof. M. Arjunan (Deputy Warden)',
    role: 'WARDEN',
    hostelName: 'Pennar Hostel (Boys)',
    hostelBlock: 'Block B',
    assignedHostel: 'Pennar Hostel'
  },
  'warden_girls': {
    id: 4,
    username: 'warden_girls',
    fullName: 'Prof. S. Aarthi (Deputy Warden)',
    role: 'WARDEN',
    hostelName: 'Bhavani Hostel (Girls)',
    hostelBlock: 'Block A',
    assignedHostel: 'Bhavani Hostel'
  },
  'tutor_cse_a': {
    id: 5,
    username: 'tutor_cse_a',
    fullName: 'Prof. M. Priya (Class Tutor)',
    role: 'TUTOR',
    department: 'Computer Science & Engineering',
    classSection: 'Section A'
  },
  'hod_cse': {
    id: 6,
    username: 'hod_cse',
    fullName: 'Dr. K. Suresh (HoD CSE)',
    role: 'HOD',
    department: 'Computer Science & Engineering'
  },
  'main_security': {
    id: 7,
    username: 'main_security',
    fullName: 'Officer Vikram (Master Security)',
    role: 'SECURITY',
    checkpoint: 'Main Gate Checkpoint'
  },
  'alex_student': {
    id: 101,
    username: 'alex_student',
    fullName: 'Alex Rivers',
    rollNumber: '2026-CSE-104',
    registerNumber: '730323104104',
    role: 'STUDENT',
    department: 'Computer Science & Engineering',
    deptCode: 'CSE',
    year: 'II Year (3rd Sem)',
    yearNumber: 2,
    classSection: 'Section A',
    assignedTutor: 'Prof. M. Priya (tutor_cse_a)',
    hostelName: 'Pennar Hostel (Boys)',
    hostelBlock: 'Block B',
    roomNumber: '304',
    phone: '+91 9876543210',
    parentContact: '+91 9876500000'
  }
};

// ==========================================================================
// Central Master Database: Hostel Students from All 4 Years (CSE Department)
// (Strictly hostel students only - No day scholars in this portal)
// ==========================================================================
let STUDENT_REGISTRY = [
  // 1st Year (I Year)
  {
    rollNumber: '2027-CSE-008',
    registerNumber: '730324104008',
    fullName: 'Kavitha Sundar',
    department: 'Computer Science & Engineering',
    deptCode: 'CSE',
    year: 'I Year (1st Sem)',
    yearNumber: 1,
    classSection: 'Section A',
    assignedTutor: 'Prof. M. Priya (tutor_cse_a)',
    hostelName: 'Bhavani Hostel (Girls)',
    hostelBlock: 'Block A',
    roomNumber: '102',
    phone: '+91 9876501001',
    parentContact: '+91 9876502001'
  },
  {
    rollNumber: '2027-CSE-015',
    registerNumber: '730324104015',
    fullName: 'Vignesh Ram',
    department: 'Computer Science & Engineering',
    deptCode: 'CSE',
    year: 'I Year (1st Sem)',
    yearNumber: 1,
    classSection: 'Section B',
    assignedTutor: 'Prof. K. Ramesh (tutor_cse_b)',
    hostelName: 'Pennar Hostel (Boys)',
    hostelBlock: 'Block B',
    roomNumber: '108',
    phone: '+91 9876501002',
    parentContact: '+91 9876502002'
  },

  // 2nd Year (II Year)
  {
    rollNumber: '2026-CSE-104',
    registerNumber: '730323104104',
    fullName: 'Alex Rivers',
    department: 'Computer Science & Engineering',
    deptCode: 'CSE',
    year: 'II Year (3rd Sem)',
    yearNumber: 2,
    classSection: 'Section A',
    assignedTutor: 'Prof. M. Priya (tutor_cse_a)',
    hostelName: 'Pennar Hostel (Boys)',
    hostelBlock: 'Block B',
    roomNumber: '304',
    phone: '+91 9876543210',
    parentContact: '+91 9876500000'
  },
  {
    rollNumber: '2026-CSE-045',
    registerNumber: '730323104045',
    fullName: 'Rohan Sharma',
    department: 'Computer Science & Engineering',
    deptCode: 'CSE',
    year: 'II Year (3rd Sem)',
    yearNumber: 2,
    classSection: 'Section A',
    assignedTutor: 'Prof. M. Priya (tutor_cse_a)',
    hostelName: 'Pennar Hostel (Boys)',
    hostelBlock: 'Block B',
    roomNumber: '208',
    phone: '+91 9876543211',
    parentContact: '+91 9876500001'
  },
  {
    rollNumber: '2026-CSE-072',
    registerNumber: '730323104072',
    fullName: 'Karthik Manian',
    department: 'Computer Science & Engineering',
    deptCode: 'CSE',
    year: 'II Year (3rd Sem)',
    yearNumber: 2,
    classSection: 'Section B',
    assignedTutor: 'Prof. K. Ramesh (tutor_cse_b)',
    hostelName: 'Pennar Hostel (Boys)',
    hostelBlock: 'Block B',
    roomNumber: '215',
    phone: '+91 9876543217',
    parentContact: '+91 9876500007'
  },

  // 3rd Year (III Year)
  {
    rollNumber: '2025-CSE-052',
    registerNumber: '730322104052',
    fullName: 'Praveen Kumar S',
    department: 'Computer Science & Engineering',
    deptCode: 'CSE',
    year: 'III Year (5th Sem)',
    yearNumber: 3,
    classSection: 'Section A',
    assignedTutor: 'Prof. M. Priya (tutor_cse_a)',
    hostelName: 'Pennar Hostel (Boys)',
    hostelBlock: 'Block B',
    roomNumber: '310',
    phone: '+91 9876501003',
    parentContact: '+91 9876502003'
  },
  {
    rollNumber: '2025-CSE-091',
    registerNumber: '730322104091',
    fullName: 'Sneha Mohan',
    department: 'Computer Science & Engineering',
    deptCode: 'CSE',
    year: 'III Year (5th Sem)',
    yearNumber: 3,
    classSection: 'Section B',
    assignedTutor: 'Prof. K. Ramesh (tutor_cse_b)',
    hostelName: 'Bhavani Hostel (Girls)',
    hostelBlock: 'Block A',
    roomNumber: '204',
    phone: '+91 9876501004',
    parentContact: '+91 9876502004'
  },

  // 4th Year (IV Year - Final Year)
  {
    rollNumber: '2024-CSE-018',
    registerNumber: '730321104018',
    fullName: 'Aravind Swamy N',
    department: 'Computer Science & Engineering',
    deptCode: 'CSE',
    year: 'IV Year (7th Sem)',
    yearNumber: 4,
    classSection: 'Section A',
    assignedTutor: 'Prof. M. Priya (tutor_cse_a)',
    hostelName: 'Cauvery Scholar Hostel',
    hostelBlock: 'Block C',
    roomNumber: '402',
    phone: '+91 9876501005',
    parentContact: '+91 9876502005'
  },
  {
    rollNumber: '2024-CSE-084',
    registerNumber: '730321104084',
    fullName: 'Meena Sundaram',
    department: 'Computer Science & Engineering',
    deptCode: 'CSE',
    year: 'IV Year (7th Sem)',
    yearNumber: 4,
    classSection: 'Section B',
    assignedTutor: 'Prof. K. Ramesh (tutor_cse_b)',
    hostelName: 'Bhavani Hostel (Girls)',
    hostelBlock: 'Block A',
    roomNumber: '301',
    phone: '+91 9876501006',
    parentContact: '+91 9876502006'
  }
];

// ==========================================================================
// Central Academic Attendance Database (Strictly uploaded/entered by Tutors)
// ==========================================================================
let studentAttendanceDatabase = {
  '2026-CSE-104': { attendance: 82, uploadedBy: 'Prof. M. Priya (Class Tutor)', updatedAt: '2026-09-20' },
  '2026-CSE-045': { attendance: 91, uploadedBy: 'Prof. M. Priya (Class Tutor)', updatedAt: '2026-09-18' },
  '2026-CSE-072': { attendance: 79, uploadedBy: 'Prof. K. Ramesh (Class Tutor)', updatedAt: '2026-09-19' },
  '2027-CSE-008': { attendance: 78, uploadedBy: 'Prof. M. Priya (Class Tutor)', updatedAt: '2026-09-19' },
  '2027-CSE-015': { attendance: 85, uploadedBy: 'Prof. K. Ramesh (Class Tutor)', updatedAt: '2026-09-19' },
  '2025-CSE-052': { attendance: 73, uploadedBy: 'Prof. M. Priya (Class Tutor)', updatedAt: '2026-09-20' }, // Under 75% for sick exception!
  '2025-CSE-091': { attendance: 88, uploadedBy: 'Prof. K. Ramesh (Class Tutor)', updatedAt: '2026-09-20' },
  '2024-CSE-018': { attendance: 80, uploadedBy: 'Prof. M. Priya (Class Tutor)', updatedAt: '2026-09-17' },
  '2024-CSE-084': { attendance: 86, uploadedBy: 'Prof. K. Ramesh (Class Tutor)', updatedAt: '2026-09-17' }
};

function getStudentAttendance(roll) {
  if (studentAttendanceDatabase[roll]) {
    return studentAttendanceDatabase[roll];
  }
  return { attendance: null, uploadedBy: null, text: 'Pending Tutor Upload' };
}

function updateStudentAttendance(roll, pct, tutorName) {
  studentAttendanceDatabase[roll] = {
    attendance: parseFloat(pct),
    uploadedBy: tutorName || 'Class Tutor',
    updatedAt: new Date().toISOString().slice(0, 10)
  };
}

// Section Allocations Managed by HoD
let tutorSectionAllocations = [
  { tutorId: 'tutor_cse_a', tutorName: 'Prof. M. Priya', department: 'Computer Science & Engineering', section: 'Section A', yearScope: 'Years 1, 2, 3, 4 (Section A Hostellers)', studentsCount: 4 },
  { tutorId: 'tutor_cse_b', tutorName: 'Prof. K. Ramesh', department: 'Computer Science & Engineering', section: 'Section B', yearScope: 'Years 1, 2, 3, 4 (Section B Hostellers)', studentsCount: 4 }
];

// Deputy Warden Allocations Managed by Chief Warden
let deputyWardenAllocations = [
  { wardenId: 'warden_block_b', wardenName: 'Prof. M. Arjunan', hostelName: 'Pennar Hostel (Boys)', hostelBlock: 'Block B', phone: '+91 94421 88201', residentsCount: 420 },
  { wardenId: 'warden_girls', wardenName: 'Prof. S. Aarthi', hostelName: 'Bhavani Hostel (Girls)', hostelBlock: 'Block A', phone: '+91 98422 11902', residentsCount: 180 },
  { wardenId: 'warden_cauvery', wardenName: 'Prof. M. Arjunan (Addl)', hostelName: 'Cauvery Scholar Hostel', hostelBlock: 'Scholars Wing', phone: '+91 94421 88201', residentsCount: 40 }
];

function getStudentByRoll(roll) {
  if (!roll) return null;
  const clean = roll.trim().toUpperCase();
  return STUDENT_REGISTRY.find(s => s.rollNumber.toUpperCase() === clean || s.registerNumber === clean);
}

function getStudentByRegister(reg) {
  if (!reg) return null;
  const clean = reg.trim();
  return STUDENT_REGISTRY.find(s => s.registerNumber === clean || s.rollNumber.toUpperCase() === clean.toUpperCase());
}

window.STUDENT_REGISTRY = STUDENT_REGISTRY;
window.studentAttendanceDatabase = studentAttendanceDatabase;
window.getStudentAttendance = getStudentAttendance;
window.updateStudentAttendance = updateStudentAttendance;
window.tutorSectionAllocations = tutorSectionAllocations;
window.deputyWardenAllocations = deputyWardenAllocations;
window.getStudentByRoll = getStudentByRoll;
window.getStudentByRegister = getStudentByRegister;

// Aliases for user convenience
SYSTEM_ACCOUNTS['chiefwarden'] = SYSTEM_ACCOUNTS['chiefwarden@adhiyamaan.ac.in'];
SYSTEM_ACCOUNTS['chief warden'] = SYSTEM_ACCOUNTS['chiefwarden@adhiyamaan.ac.in'];
SYSTEM_ACCOUNTS['chief_warden'] = SYSTEM_ACCOUNTS['chiefwarden@adhiyamaan.ac.in'];
SYSTEM_ACCOUNTS['chief'] = SYSTEM_ACCOUNTS['chiefwarden@adhiyamaan.ac.in'];
SYSTEM_ACCOUNTS['cw'] = SYSTEM_ACCOUNTS['chiefwarden@adhiyamaan.ac.in'];
SYSTEM_ACCOUNTS['principal'] = SYSTEM_ACCOUNTS['principal@adhiyamaan.ac.in'];
SYSTEM_ACCOUNTS['admin'] = SYSTEM_ACCOUNTS['principal@adhiyamaan.ac.in'];
SYSTEM_ACCOUNTS['warden'] = SYSTEM_ACCOUNTS['warden_block_b'];
SYSTEM_ACCOUNTS['student'] = SYSTEM_ACCOUNTS['alex_student'];
SYSTEM_ACCOUNTS['tutor'] = SYSTEM_ACCOUNTS['tutor_cse_a'];
SYSTEM_ACCOUNTS['hod'] = SYSTEM_ACCOUNTS['hod_cse'];
SYSTEM_ACCOUNTS['security'] = SYSTEM_ACCOUNTS['main_security'];

// Default fallback user
const DEFAULT_STUDENT_USER = SYSTEM_ACCOUNTS['alex_student'];

let loggedInUser = null;

function getCurrentUser() {
  return loggedInUser;
}

function openLoginModal() {
  const modal = document.getElementById('loginModal');
  if (modal) modal.classList.add('active');
}

function closeLoginModal() {
  const modal = document.getElementById('loginModal');
  if (modal) modal.classList.remove('active');
}

// Quick-fill login credentials helper
function quickFillLogin(roleKey) {
  const roleSelect = document.getElementById('loginRoleSelect');
  const userField = document.getElementById('loginUsername');
  const passField = document.getElementById('loginPassword');

  if (roleKey === 'CHIEF_WARDEN') {
    if (roleSelect) roleSelect.value = 'CHIEF_WARDEN';
    if (userField) userField.value = 'chiefwarden@adhiyamaan.ac.in';
    if (passField) passField.value = 'ace_cw_2026';
  } else if (roleKey === 'PRINCIPAL') {
    if (roleSelect) roleSelect.value = 'ADMIN';
    if (userField) userField.value = 'principal@adhiyamaan.ac.in';
    if (passField) passField.value = 'ace_principal_2026';
  } else if (roleKey === 'WARDEN') {
    if (roleSelect) roleSelect.value = 'WARDEN';
    if (userField) userField.value = 'warden_block_b';
    if (passField) passField.value = 'pass123';
  } else if (roleKey === 'STUDENT') {
    if (roleSelect) roleSelect.value = 'STUDENT';
    if (userField) userField.value = 'alex_student';
    if (passField) passField.value = 'pass123';
  } else if (roleKey === 'TUTOR') {
    if (roleSelect) roleSelect.value = 'TUTOR';
    if (userField) userField.value = 'tutor_cse_a';
    if (passField) passField.value = 'pass123';
  } else if (roleKey === 'HOD') {
    if (roleSelect) roleSelect.value = 'HOD';
    if (userField) userField.value = 'hod_cse';
    if (passField) passField.value = 'pass123';
  } else if (roleKey === 'SECURITY') {
    if (roleSelect) roleSelect.value = 'SECURITY';
    if (userField) userField.value = 'main_security';
    if (passField) passField.value = 'pass123';
  }
}

// Real User Login Handler with ultra-robust fuzzy resolver
function handleRealLogin(e) {
  if (e && e.preventDefault) e.preventDefault();
  const roleSelect = document.getElementById('loginRoleSelect');
  const usernameInput = document.getElementById('loginUsername');
  const role = roleSelect ? roleSelect.value : 'STUDENT';
  const username = usernameInput ? usernameInput.value.trim() : '';
  const normUser = username.toLowerCase().replace(/[\s\-_@.]/g, '');

  // Direct lookup
  let foundUser = SYSTEM_ACCOUNTS[username] || SYSTEM_ACCOUNTS[username.toLowerCase()] || SYSTEM_ACCOUNTS[normUser];

  if (!foundUser) {
    // Fuzzy matching
    if (role === 'CHIEF_WARDEN' || normUser.includes('chief') || (normUser.includes('warden') && !normUser.includes('deputy') && !normUser.includes('block')) || normUser === 'cw') {
      foundUser = SYSTEM_ACCOUNTS['chiefwarden@adhiyamaan.ac.in'];
    } else if (role === 'ADMIN' || normUser.includes('principal') || normUser.includes('ranganath') || normUser === 'admin') {
      foundUser = SYSTEM_ACCOUNTS['principal@adhiyamaan.ac.in'];
    } else if (role === 'WARDEN' || normUser.includes('warden') || normUser.includes('arjunan')) {
      foundUser = SYSTEM_ACCOUNTS['warden_block_b'];
    } else if (role === 'TUTOR' || normUser.includes('tutor') || normUser.includes('priya')) {
      foundUser = SYSTEM_ACCOUNTS['tutor_cse_a'];
    } else if (role === 'HOD' || normUser.includes('hod') || normUser.includes('suresh')) {
      foundUser = SYSTEM_ACCOUNTS['hod_cse'];
    } else if (role === 'SECURITY' || normUser.includes('security') || normUser.includes('guard') || normUser.includes('vikram')) {
      foundUser = SYSTEM_ACCOUNTS['main_security'];
    } else if (role === 'STUDENT' || normUser.includes('student') || normUser.includes('alex') || normUser.includes('104')) {
      foundUser = SYSTEM_ACCOUNTS['alex_student'];
    } else {
      // Fallback explicitly to role selected in dropdown
      if (role === 'CHIEF_WARDEN') foundUser = SYSTEM_ACCOUNTS['chiefwarden@adhiyamaan.ac.in'];
      else if (role === 'ADMIN') foundUser = SYSTEM_ACCOUNTS['principal@adhiyamaan.ac.in'];
      else if (role === 'WARDEN') foundUser = SYSTEM_ACCOUNTS['warden_block_b'];
      else if (role === 'TUTOR') foundUser = SYSTEM_ACCOUNTS['tutor_cse_a'];
      else if (role === 'HOD') foundUser = SYSTEM_ACCOUNTS['hod_cse'];
      else if (role === 'SECURITY') foundUser = SYSTEM_ACCOUNTS['main_security'];
      else foundUser = SYSTEM_ACCOUNTS['alex_student'];
    }
  }

  loggedInUser = { ...foundUser };

  closeLoginModal();
  onUserLoginSuccess();
}

function onUserLoginSuccess() {
  try {
    const landing = document.getElementById('publicLandingView');
    if (landing) landing.style.display = 'none';

    const appView = document.getElementById('authenticatedAppView');
    if (appView) {
      appView.style.display = 'flex';
    }

    const chatBtn = document.getElementById('floatingChatBtn');
    if (chatBtn) {
      chatBtn.style.display = 'flex';
    }

    renderHeaderNav();
    updateSidebarVisibility();

    if (window.renderDashboard) {
      window.renderDashboard();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (err) {
    console.error('Error during onUserLoginSuccess:', err);
  }
}

function renderHeaderNav() {
  const container = document.getElementById('headerNavRight');
  if (!container) return;

  const user = getCurrentUser();
  if (!user) {
    container.innerHTML = `
      <button class="btn btn-primary" onclick="openLoginModal()">
        🔑 Portal Login
      </button>
    `;
    return;
  }

  const roleObj = ROLES[user.role] || ROLES.STUDENT;
  container.innerHTML = `
    <span class="role-badge ${roleObj.badgeClass}">${roleObj.icon} ${roleObj.name}</span>
    <button class="btn btn-secondary" style="padding: 0.45rem 0.85rem; font-size: 0.82rem;" onclick="handleUserLogout()">
      🚪 Sign Out
    </button>
  `;
}

function handleUserLogout() {
  loggedInUser = null;
  const landing = document.getElementById('publicLandingView');
  if (landing) landing.style.display = 'block';

  const appView = document.getElementById('authenticatedAppView');
  if (appView) appView.style.display = 'none';

  const chatBtn = document.getElementById('floatingChatBtn');
  if (chatBtn) chatBtn.style.display = 'none';

  const chatDrawer = document.getElementById('chatDrawer');
  if (chatDrawer) chatDrawer.classList.remove('active');

  renderHeaderNav();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Dynamic Role-Based Sidebar Navigation
function updateSidebarVisibility() {
  const user = getCurrentUser();
  const sidebar = document.getElementById('appSidebar');
  if (!sidebar) return;

  if (user.role === 'STUDENT') {
    sidebar.innerHTML = `
      <a href="#" class="nav-item active" onclick="switchTab('dashboard')">
        <span class="nav-icon">📊</span>
        <span>Dashboard</span>
      </a>
      <a href="#" class="nav-item" onclick="switchTab('outinpasses')">
        <span class="nav-icon">🚪</span>
        <span>OUT / IN Passes</span>
      </a>
      <a href="#" class="nav-item" onclick="switchTab('roomstaypasses')">
        <span class="nav-icon">🛏️</span>
        <span>Room Stay Passes</span>
      </a>
      <a href="#" class="nav-item" onclick="switchTab('grievances')">
        <span class="nav-icon">🔧</span>
        <span>Grievances & Tickets</span>
      </a>
    `;
  } else if (user.role === 'WARDEN') {
    sidebar.innerHTML = `
      <a href="#" class="nav-item active" onclick="switchTab('dashboard')">
        <span class="nav-icon">📊</span>
        <span>Dashboard Overview</span>
      </a>
      <a href="#" class="nav-item" onclick="switchTab('warden_approvals')">
        <span class="nav-icon">⏳</span>
        <span>Pending Approvals</span>
      </a>
      <a href="#" class="nav-item" onclick="switchTab('warden_outin_issued')">
        <span class="nav-icon">🚪</span>
        <span>Issued OUT/IN Passes</span>
      </a>
      <a href="#" class="nav-item" onclick="switchTab('warden_roomstay_issued')">
        <span class="nav-icon">🛏️</span>
        <span>Issued Room Stays</span>
      </a>
      <a href="#" class="nav-item" onclick="switchTab('warden_security')">
        <span class="nav-icon">🚨</span>
        <span>Security Reports</span>
      </a>
      <a href="#" class="nav-item" onclick="switchTab('warden_grievances')">
        <span class="nav-icon">🔧</span>
        <span>Hostel Grievances</span>
      </a>
      <a href="#" class="nav-item" onclick="switchTab('warden_students')">
        <span class="nav-icon">👥</span>
        <span>Students & Passwords</span>
      </a>
      <a href="#" class="nav-item" onclick="switchTab('audit')">
        <span class="nav-icon">📋</span>
        <span>30-Day Audit Trail</span>
      </a>
    `;
  } else if (user.role === 'TUTOR' || user.role === 'HOD') {
    sidebar.innerHTML = `
      <a href="#" class="nav-item active" onclick="switchTab('dashboard')">
        <span class="nav-icon">📊</span>
        <span>Academic Dashboard</span>
      </a>
      <a href="#" class="nav-item" onclick="switchTab('academic_clearance')">
        <span class="nav-icon">📚</span>
        <span>Leave Clearances</span>
      </a>
      <a href="#" class="nav-item" onclick="switchTab('academic_overdue')">
        <span class="nav-icon">⏳</span>
        <span>Overdue Queue</span>
      </a>
      <a href="#" class="nav-item" onclick="switchTab('academic_students')">
        <span class="nav-icon">🎓</span>
        <span>Department Students</span>
      </a>
    `;
  } else if (user.role === 'SECURITY') {
    sidebar.innerHTML = `
      <a href="#" class="nav-item active" onclick="switchTab('dashboard')">
        <span class="nav-icon">📊</span>
        <span>Security Overview</span>
      </a>
      <a href="#" class="nav-item" onclick="switchTab('security_scanner')">
        <span class="nav-icon">🔍</span>
        <span>Gate Pass Scanner</span>
      </a>
      <a href="#" class="nav-item" onclick="switchTab('security_violations')">
        <span class="nav-icon">🚨</span>
        <span>Report Security Violation</span>
      </a>
      <a href="#" class="nav-item" onclick="switchTab('security_logs')">
        <span class="nav-icon">📋</span>
        <span>Gate Entry/Exit Logs</span>
      </a>
    `;
  } else if (user.role === 'ADMIN' || user.role === 'CHIEF_WARDEN') {
    const isCW = (user.username && user.username.includes('chiefwarden')) || user.role === 'CHIEF_WARDEN';
    sidebar.innerHTML = `
      <a href="#" class="nav-item active" onclick="switchTab('dashboard')">
        <span class="nav-icon">${isCW ? '👑' : '🏛️'}</span>
        <span>${isCW ? 'Chief Warden Portal' : 'Principal / Supreme'}</span>
      </a>
      <a href="#" class="nav-item" onclick="switchTab('admin_hostels')">
        <span class="nav-icon">🏛️</span>
        <span>All Campus Hostels</span>
      </a>
      <a href="#" class="nav-item" onclick="switchTab('audit')">
        <span class="nav-icon">📋</span>
        <span>Warden Audit Trail (CSV)</span>
      </a>
      <a href="#" class="nav-item" onclick="switchTab('admin_complaints')">
        <span class="nav-icon">🚨</span>
        <span>High-Severity Issues</span>
      </a>
      <a href="#" class="nav-item" onclick="switchTab('admin_officials')">
        <span class="nav-icon">🔑</span>
        <span>Official Accounts</span>
      </a>
    `;
  }
}

window.ROLES = ROLES;
window.getCurrentUser = getCurrentUser;
window.openLoginModal = openLoginModal;
window.closeLoginModal = closeLoginModal;
window.quickFillLogin = quickFillLogin;
window.handleRealLogin = handleRealLogin;
window.handleUserLogout = handleUserLogout;
window.updateSidebarVisibility = updateSidebarVisibility;
