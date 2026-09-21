/* ==========================================================================
   CampusConnect - Main Application Router & Interactions
   Adhiyamaan College of Engineering (ACE)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  renderHeaderNav();
  updateSidebarVisibility();
  renderDashboard();
});

function renderDashboard() {
  const user = getCurrentUser();
  if (!user) return;

  const role = user.role;
  if (role === 'ADMIN' || role === 'CHIEF_WARDEN') {
    if (window.renderAdminDashboard) window.renderAdminDashboard();
    else if (typeof renderAdminDashboard === 'function') renderAdminDashboard();
  } else if (role === 'WARDEN') {
    if (window.renderWardenDashboard) window.renderWardenDashboard();
    else if (typeof renderWardenDashboard === 'function') renderWardenDashboard();
  } else if (role === 'TUTOR' || role === 'HOD') {
    if (window.renderAcademicDashboard) window.renderAcademicDashboard();
    else if (typeof renderAcademicDashboard === 'function') renderAcademicDashboard();
  } else if (role === 'SECURITY') {
    if (window.renderSecurityDashboard) window.renderSecurityDashboard();
    else if (typeof renderSecurityDashboard === 'function') renderSecurityDashboard();
  } else {
    if (window.renderStudentDashboard) window.renderStudentDashboard();
    else if (typeof renderStudentDashboard === 'function') renderStudentDashboard();
  }
}

function switchTab(tabName) {
  document.querySelectorAll('.sidebar .nav-item').forEach(item => item.classList.remove('active'));

  const user = getCurrentUser();

  // Scroll or render based on tab
  if (tabName === 'dashboard') {
    renderDashboard();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else if (tabName === 'outinpasses') {
    renderDashboard();
    scrollToSection('sectionOutInPasses');
  } else if (tabName === 'roomstaypasses') {
    renderDashboard();
    scrollToSection('sectionRoomStayPasses');
  } else if (tabName === 'grievances') {
    renderDashboard();
    scrollToSection('sectionGrievances');
  } else if (tabName === 'warden_approvals') {
    renderDashboard();
    scrollToSection('sectionWardenApprovals');
  } else if (tabName === 'warden_outin_issued') {
    renderDashboard();
    scrollToSection('sectionWardenOutInIssued');
  } else if (tabName === 'warden_roomstay_issued') {
    renderDashboard();
    scrollToSection('sectionWardenRoomStayIssued');
  } else if (tabName === 'warden_security') {
    renderDashboard();
    scrollToSection('sectionWardenSecurity');
  } else if (tabName === 'warden_grievances') {
    renderDashboard();
    scrollToSection('sectionWardenGrievances');
  } else if (tabName === 'warden_students') {
    renderDashboard();
    scrollToSection('sectionWardenStudents');
  } else if (tabName === 'academic_clearance') {
    renderDashboard();
    scrollToSection('sectionAcademicClearances');
  } else if (tabName === 'academic_overdue') {
    renderDashboard();
    scrollToSection('sectionAcademicOverdue');
  } else if (tabName === 'academic_students') {
    renderDashboard();
    scrollToSection('sectionAcademicOverdue');
  } else if (tabName === 'security_scanner') {
    renderDashboard();
    scrollToSection('sectionSecurityScanner');
  } else if (tabName === 'security_violations') {
    renderDashboard();
    scrollToSection('sectionSecurityViolations');
  } else if (tabName === 'security_logs') {
    renderDashboard();
    scrollToSection('sectionSecurityLogs');
  } else if (tabName === 'admin_hostels') {
    renderDashboard();
    scrollToSection('sectionAdminHostels');
  } else if (tabName === 'admin_complaints') {
    renderDashboard();
    scrollToSection('sectionAdminComplaints');
  } else if (tabName === 'admin_officials') {
    renderDashboard();
    const box = document.getElementById('createOfficialFormBox');
    if (box) {
      box.style.display = 'block';
      box.scrollIntoView({ behavior: 'smooth' });
    }
  } else if (tabName === 'audit') {
    renderAuditLogsView();
  }
}

function scrollToSection(id) {
  setTimeout(() => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, 100);
}

function renderAuditLogsView() {
  const area = document.getElementById('dashboardRenderArea');
  if (!area) return;

  const logs = window.sampleWardenAuditLogs || [
    { action: 'CREATE_STUDENT', details: 'Created student login for Alex Rivers (Room 304, Block B)', timestamp: '2026-09-20 08:00:15', wardenName: 'Prof. M. Arjunan', targetId: '2026-CSE-104', outcome: 'SUCCESS' },
    { action: 'PASS_FIRST_APPROVAL', details: 'Granted Warden First Approval for OUT_IN_PASS PASS-2026-X89B', timestamp: '2026-09-20 09:12:40', wardenName: 'Prof. M. Arjunan', targetId: 'PASS-2026-X89B', outcome: 'APPROVED' },
    { action: 'RESOLVE_GRIEVANCE', details: 'Uploaded Solve Proof Photo for TICKET-104 (PLUMBING)', timestamp: '2026-09-20 10:05:11', wardenName: 'Prof. M. Arjunan', targetId: 'TICKET-104', outcome: 'RESOLVED' }
  ];

  area.innerHTML = `
    <div class="dashboard-section" id="sectionAdminAudit">
      <div class="section-header">
        <h3 class="section-title">📋 Deputy Warden Audit Trail & Action Logs (30-Day Retention)</h3>
        <button class="btn btn-secondary" onclick="extractAuditLogCSV()">
          📥 Export Audit Log (CSV)
        </button>
      </div>
      <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 1.25rem;">
        Complete chronological ledger of all actions taken by Deputy Wardens across campus hostels. Chief Warden & Principal can monitor approvals, extension grants, and security reviews.
      </p>

      <div class="table-responsive">
        <table class="custom-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Warden Name</th>
              <th>Action Type</th>
              <th>Target ID / Roll</th>
              <th>Details</th>
              <th>Outcome</th>
            </tr>
          </thead>
          <tbody>
            ${logs.map(l => `
              <tr>
                <td><b>${l.timestamp}</b></td>
                <td><b>${l.wardenName || 'Prof. M. Arjunan'}</b></td>
                <td><span class="status-pill pending">${l.action}</span></td>
                <td><code>${l.targetId || '-'}</code></td>
                <td>${l.details}</td>
                <td><span class="status-pill approved">${l.outcome || 'SUCCESS'}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// 1. OUT / IN Pass Modal Handlers
function openApplyLeaveModal() {
  document.getElementById('applyLeaveModal').classList.add('active');
}
function closeApplyLeaveModal() {
  document.getElementById('applyLeaveModal').classList.remove('active');
}

function handleLeaveSubmit(e) {
  e.preventDefault();
  const user = getCurrentUser() || {};
  const startDate = document.getElementById('leaveStartDate').value;
  const endDate = document.getElementById('leaveEndDate').value;
  const reason = document.getElementById('leaveReason').value;
  const dest = document.getElementById('leaveDestination').value;
  const parent = document.getElementById('leaveParentContact').value;

  const newPass = {
    id: `PASS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    type: 'OUT_IN_PASS',
    reason: reason,
    startDate: startDate,
    endDate: endDate,
    destination: dest,
    parentContact: parent,
    hostelStatus: 'PENDING',
    wardenApproval: 'PENDING',
    academicStatus: 'PENDING',
    tutorApproval: 'PENDING',
    finalStatus: 'PENDING (Awaiting Dual Approval)',
    passCode: `PASS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    extensionStatus: 'NONE'
  };

  if (window.sampleOutInPasses) {
    window.sampleOutInPasses.unshift(newPass);
  }

  // 1. Push to Warden Pending queue
  if (window.sampleWardenPendingPasses) {
    window.sampleWardenPendingPasses.unshift({
      id: newPass.id,
      studentName: user.fullName || 'Alex Rivers',
      rollNumber: user.rollNumber || '2026-CSE-104',
      block: user.hostelBlock || 'Block B',
      room: user.roomNumber || '304',
      type: 'OUT_IN_PASS',
      reason: reason,
      startDate: startDate,
      endDate: endDate,
      destination: dest,
      status: 'PENDING',
      wardenApproval: 'PENDING',
      tutorApproval: 'PENDING',
      isExtension: false
    });
  }

  // 2. Push to Class Tutor Academic Queue
  if (window.sampleAcademicVerifications) {
    window.sampleAcademicVerifications.unshift({
      id: newPass.id,
      passCode: newPass.id,
      studentName: user.fullName || 'Alex Rivers',
      rollNumber: user.rollNumber || '2026-CSE-104',
      registerNumber: user.registerNumber || '730323104104',
      department: user.department || 'Computer Science & Engineering',
      deptCode: user.deptCode || 'CSE',
      year: user.year || 'II Year (3rd Sem)',
      classSection: user.classSection || 'Section A',
      assignedTutor: user.assignedTutor || 'Prof. M. Priya (tutor_cse_a)',
      passType: 'OUT_IN_PASS',
      reason: reason,
      destination: dest,
      dates: `${startDate} to ${endDate}`,
      wardenApproval: 'PENDING',
      wardenStatus: 'PENDING_WARDEN_APPROVAL',
      tutorApproval: 'PENDING',
      isSick: reason.toLowerCase().includes('sick') || reason.toLowerCase().includes('hospital') || reason.toLowerCase().includes('medical')
    });
  }

  closeApplyLeaveModal();
  if (window.saveAppState) window.saveAppState();
  renderDashboard();
  alert(`🎫 OUT / IN PASS APPLICATION SUBMITTED!\n\nYour campus departure pass request has been routed to both Deputy Warden and Class Tutor (${user.classSection || 'Section A'}).\nEither authority can approve first.`);
}

// 2. Room Stay Pass Modal Handlers
function openApplyRoomStayModal() {
  document.getElementById('applyRoomStayModal').classList.add('active');
}

function closeApplyRoomStayModal() {
  document.getElementById('applyRoomStayModal').classList.remove('active');
}

function handleRoomStaySubmit(e) {
  e.preventDefault();
  const user = getCurrentUser() || {};
  const startDate = document.getElementById('roomStayStartDate').value;
  const endDate = document.getElementById('roomStayEndDate').value;
  const reasonTypeSelect = document.getElementById('roomStayReasonType');
  const reasonType = reasonTypeSelect ? reasonTypeSelect.value : 'Room Stay';
  const details = document.getElementById('roomStayIllness').value;
  const parent = document.getElementById('roomStayParentContact').value;
  const notes = document.getElementById('roomStayDoctorNotes').value;

  const fullReason = notes ? `[${reasonType}] ${details} (Note: ${notes})` : `[${reasonType}] ${details}`;

  const newPass = {
    id: `STAY-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    type: 'ROOM_STAY_PASS',
    reason: fullReason,
    startDate: startDate,
    endDate: endDate,
    destination: `Hostel Room Stay (${user.roomNumber || 'Room 304'})`,
    parentContact: parent,
    hostelStatus: 'PENDING',
    wardenApproval: 'PENDING',
    academicStatus: 'PENDING',
    tutorApproval: 'PENDING',
    finalStatus: 'PENDING (Awaiting Dual Approval)',
    passCode: `STAY-2026-${Math.floor(1000 + Math.random() * 9000)}`
  };

  if (window.sampleRoomStayPasses) {
    window.sampleRoomStayPasses.unshift(newPass);
  }

  // 1. Push to Warden Pending queue
  if (window.sampleWardenPendingPasses) {
    window.sampleWardenPendingPasses.unshift({
      id: newPass.id,
      studentName: user.fullName || 'Alex Rivers',
      rollNumber: user.rollNumber || '2026-CSE-104',
      block: user.hostelBlock || 'Block B',
      room: user.roomNumber || '304',
      type: 'ROOM_STAY_PASS',
      reason: fullReason,
      startDate: startDate,
      endDate: endDate,
      destination: `Hostel Room (${user.roomNumber || '304'})`,
      status: 'PENDING',
      wardenApproval: 'PENDING',
      tutorApproval: 'PENDING',
      isExtension: false
    });
  }

  // 2. Push to Class Tutor Academic Queue
  if (window.sampleAcademicVerifications) {
    window.sampleAcademicVerifications.unshift({
      id: newPass.id,
      passCode: newPass.id,
      studentName: user.fullName || 'Alex Rivers',
      rollNumber: user.rollNumber || '2026-CSE-104',
      registerNumber: user.registerNumber || '730323104104',
      department: user.department || 'Computer Science & Engineering',
      deptCode: user.deptCode || 'CSE',
      year: user.year || 'II Year (3rd Sem)',
      classSection: user.classSection || 'Section A',
      assignedTutor: user.assignedTutor || 'Prof. M. Priya (tutor_cse_a)',
      passType: 'ROOM_STAY_PASS',
      reason: fullReason,
      destination: `Hostel Room (${user.roomNumber || '304'})`,
      dates: `${startDate} to ${endDate}`,
      wardenApproval: 'PENDING',
      wardenStatus: 'PENDING_WARDEN_APPROVAL',
      tutorApproval: 'PENDING',
      isSick: reasonType.includes('Medical') || reasonType.includes('Sickness') || fullReason.toLowerCase().includes('sick')
    });
  }

  closeApplyRoomStayModal();
  if (window.saveAppState) window.saveAppState();
  renderDashboard();
  alert(`🛏️ ROOM STAY PASS SUBMITTED!\n\nYour room stay request has been routed to both Deputy Warden and Class Tutor (${user.classSection || 'Section A'}).\nEither authority can approve first.`);
}

// 3. Extend Pass Validity Modal Handlers
function openExtendPassModal(passId, currentEndDate) {
  document.getElementById('extendPassId').value = passId;
  document.getElementById('extendCurrentEndDate').value = currentEndDate;
  document.getElementById('extendPassModal').classList.add('active');
}

function closeExtendPassModal() {
  document.getElementById('extendPassModal').classList.remove('active');
}

function handleExtendPassSubmit(e) {
  e.preventDefault();
  const user = getCurrentUser();
  const passId = document.getElementById('extendPassId').value;
  const newDate = document.getElementById('extendNewEndDate').value;
  const reason = document.getElementById('extendReason').value.trim();

  // Find in student passes
  if (window.sampleOutInPasses) {
    const pass = window.sampleOutInPasses.find(p => p.id === passId);
    if (pass) {
      pass.extensionStatus = `EXTENSION REQUESTED (Until ${newDate})`;
    }
  }

  // Push extension item to Warden pending queue
  if (window.sampleWardenPendingPasses) {
    window.sampleWardenPendingPasses.unshift({
      id: `EXT-${Math.floor(1000 + Math.random() * 9000)}`,
      originalPassId: passId,
      studentName: user.fullName || 'Alex Rivers',
      rollNumber: user.rollNumber || '2026-CSE-104',
      block: user.hostelBlock || 'Block B',
      room: user.roomNumber || '304',
      type: 'OUT_IN_PASS',
      reason: `⏱️ RETURN EXTENSION: ${reason}`,
      startDate: 'Current Leave',
      endDate: newDate,
      destination: 'Campus Return Extension',
      status: 'EXTENSION_PENDING',
      isExtension: true
    });
  }

  closeExtendPassModal();
  if (window.saveAppState) window.saveAppState();
  renderDashboard();
  alert(`⏱️ EXTENSION REQUEST DISPATCHED!\n\nYour request to extend return time to ${newDate} has been routed to Deputy Warden for approval.`);
}

function openFileGrievanceModal() {
  document.getElementById('fileGrievanceModal').classList.add('active');
}
function closeFileGrievanceModal() {
  document.getElementById('fileGrievanceModal').classList.remove('active');
}

function handleGrievanceSubmit(e) {
  e.preventDefault();
  const cat = document.getElementById('grievanceCategory').value;
  const sev = document.getElementById('grievanceSeverity').value;
  const title = document.getElementById('grievanceTitle').value;
  const desc = document.getElementById('grievanceDesc').value;
  const preview = document.getElementById('problemPhotoPreview');

  const newTicket = {
    id: `TICKET-${Math.floor(100 + Math.random() * 900)}`,
    category: cat,
    severity: sev,
    title: title,
    desc: desc,
    status: 'OPEN',
    photoProof: preview.style.display !== 'none' ? preview.src : null,
    solveProof: null,
    createdAt: new Date().toLocaleString()
  };

  if (window.sampleStudentGrievances) {
    window.sampleStudentGrievances.unshift(newTicket);
  }

  closeFileGrievanceModal();
  renderDashboard();
  alert(`🔧 GRIEVANCE TICKET CREATED!\n\nTicket ${newTicket.id} filed under ${cat} (${sev} Severity). Deputy Warden notified.`);
}

function previewImage(event, previewImgId) {
  const file = event.target.files[0];
  const preview = document.getElementById(previewImgId);
  if (file && preview) {
    const reader = new FileReader();
    reader.onload = function(e) {
      preview.src = e.target.result;
      preview.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
}

// Window bindings
window.renderDashboard = renderDashboard;
window.switchTab = switchTab;
window.openApplyLeaveModal = openApplyLeaveModal;
window.closeApplyLeaveModal = closeApplyLeaveModal;
window.handleLeaveSubmit = handleLeaveSubmit;
window.openApplyRoomStayModal = openApplyRoomStayModal;
window.closeApplyRoomStayModal = closeApplyRoomStayModal;
window.handleRoomStaySubmit = handleRoomStaySubmit;
window.openExtendPassModal = openExtendPassModal;
window.closeExtendPassModal = closeExtendPassModal;
window.handleExtendPassSubmit = handleExtendPassSubmit;
window.openFileGrievanceModal = openFileGrievanceModal;
window.closeFileGrievanceModal = closeFileGrievanceModal;
window.handleGrievanceSubmit = handleGrievanceSubmit;
window.previewImage = previewImage;
window.renderAuditLogsView = renderAuditLogsView;
