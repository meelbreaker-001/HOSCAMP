/* ==========================================================================
   CampusConnect - Deputy Warden Module
   Adhiyamaan College of Engineering (ACE)
   ========================================================================== */

let activeWardenSolveTicketId = null;
let activeWardenSolveCategory = null;

// Pending First Approvals Queue
let sampleWardenPendingPasses = [
  {
    id: 'PASS-2026-X89B',
    studentName: 'Alex Rivers',
    rollNumber: '2026-CSE-104',
    block: 'Block B',
    room: '304',
    type: 'OUT_IN_PASS',
    reason: 'Medical checkup at Apollo Specialty Hospital',
    startDate: '2026-09-21 09:00',
    endDate: '2026-09-21 18:00',
    destination: 'Apollo Hospital',
    status: 'PENDING',
    isExtension: false
  },
  {
    id: 'EXT-2026-E120',
    originalPassId: 'PASS-2026-X89B',
    studentName: 'Alex Rivers',
    rollNumber: '2026-CSE-104',
    block: 'Block B',
    room: '304',
    type: 'OUT_IN_PASS',
    reason: '⏱️ EXTENSION REQUEST: Train delayed by 2.5 hours at Bangalore City Station',
    startDate: '2026-09-21 18:00',
    endDate: '2026-09-21 21:30',
    destination: 'Bangalore Return',
    status: 'EXTENSION_PENDING',
    isExtension: true
  }
];

// Separated Issued OUT / IN Passes List
let sampleWardenIssuedOutInPasses = [
  {
    id: 'PASS-2026-O771',
    passCode: 'PASS-2026-O771',
    studentName: 'Rohan Sharma',
    rollNumber: '2026-CSE-045',
    block: 'Block B',
    room: '208',
    type: 'OUT_IN_PASS',
    destination: 'Home (Salem)',
    startDate: '2026-09-19 14:00',
    endDate: '2026-09-22 19:00',
    gateStatus: 'CHECKED_OUT (Off-Campus)',
    academicStatus: 'VERIFIED_BY_HOD',
    extensionStatus: 'NONE'
  },
  {
    id: 'PASS-2026-X89B',
    passCode: 'PASS-2026-X89B',
    studentName: 'Alex Rivers',
    rollNumber: '2026-CSE-104',
    block: 'Block B',
    room: '304',
    type: 'OUT_IN_PASS',
    destination: 'Apollo Hospital, Hosur',
    startDate: '2026-09-21 09:00',
    endDate: '2026-09-21 18:00',
    gateStatus: 'IN_HOSTEL (Not Yet Departed)',
    academicStatus: 'PENDING_CLEARANCE',
    extensionStatus: 'PENDING_WARDEN_APPROVAL'
  }
];

// Separated Issued Room Stay Passes List
let sampleWardenIssuedRoomStayPasses = [
  {
    id: 'STAY-2026-R402',
    passCode: 'STAY-2026-R402',
    studentName: 'Alex Rivers',
    rollNumber: '2026-CSE-104',
    block: 'Block B',
    room: '304',
    type: 'ROOM_STAY_PASS',
    reasonCategory: 'Medical / Sickness',
    reason: '[Medical / Sickness] Viral fever - 2 days bed rest',
    startDate: '2026-09-18 08:00',
    endDate: '2026-09-19 20:00',
    academicStatus: 'APPROVED (Medical Exception Granted)',
    status: 'EXPIRED'
  },
  {
    id: 'STAY-2026-R905',
    passCode: 'STAY-2026-R905',
    studentName: 'Karan Patel',
    rollNumber: '2026-ECE-012',
    block: 'Block B',
    room: '115',
    type: 'ROOM_STAY_PASS',
    reasonCategory: 'Exam Study Preparation',
    reason: '[Exam Study Preparation] GATE Aerospace exam preparation',
    startDate: '2026-09-21 08:30',
    endDate: '2026-09-21 17:00',
    academicStatus: 'VERIFIED_BY_TUTOR',
    status: 'ACTIVE'
  }
];

// Security Violations Routed to this Deputy Warden (30-Day Disciplinary Log)
let sampleWardenSecurityViolations = [
  {
    id: 'VIOL-901',
    student: 'Alex Rivers',
    roll: '2026-CSE-104',
    room: '304',
    block: 'Block B',
    type: 'CURFEW_BREACH',
    checkpoint: 'Main Gate',
    severity: 'MEDIUM',
    desc: 'Reported late arrival at 21:45 PM (curfew is 21:00 PM) with heavy traffic delay justification.',
    time: '2026-09-20 21:50',
    status: 'REVIEWED',
    wardenResponse: 'Counseled student in warden office. Parent contacted and verified traffic delay. First warning recorded.',
    reviewedBy: 'Prof. M. Arjunan (Deputy Warden)',
    reviewedAt: '2026-09-21 08:30',
    retentionNotice: '30-Day Active Log (Purge in 29 days)'
  },
  {
    id: 'VIOL-902',
    student: 'Karan Patel',
    roll: '2026-ECE-012',
    room: '115',
    block: 'Block B',
    type: 'NO_VALID_PASS',
    checkpoint: 'Hostel Gate 2',
    severity: 'HIGH',
    desc: 'Attempted to exit boundary fence near basketball court without approved gate pass.',
    time: '2026-09-21 16:20',
    status: 'PENDING_REVIEW',
    wardenResponse: null,
    reviewedBy: null,
    reviewedAt: null,
    retentionNotice: '30-Day Active Log (Action Required)'
  }
];

// 30-Day Warden Audit Logs for Chief Warden & Principal
let sampleWardenAuditLogs = [
  { action: 'CREATE_STUDENT', details: 'Created student login for Alex Rivers (Room 304, Block B)', timestamp: '2026-09-20 08:00:15', wardenName: 'Prof. M. Arjunan', targetId: '2026-CSE-104', outcome: 'SUCCESS' },
  { action: 'PASS_FIRST_APPROVAL', details: 'Granted Warden First Approval for OUT_IN_PASS PASS-2026-X89B', timestamp: '2026-09-20 09:12:40', wardenName: 'Prof. M. Arjunan', targetId: 'PASS-2026-X89B', outcome: 'APPROVED' },
  { action: 'RESOLVE_GRIEVANCE', details: 'Uploaded Solve Proof Photo for TICKET-104 (PLUMBING)', timestamp: '2026-09-20 10:05:11', wardenName: 'Prof. M. Arjunan', targetId: 'TICKET-104', outcome: 'RESOLVED' },
  { action: 'SECURITY_REVIEW', details: 'Reviewed Security Curfew Breach for Alex Rivers (2026-CSE-104)', timestamp: '2026-09-21 08:30:00', wardenName: 'Prof. M. Arjunan', targetId: 'VIOL-901', outcome: 'DISCIPLINARY_WARNED' }
];

// Registered Block Residents Directory
let sampleBlockResidents = [
  { rollNumber: '2026-CSE-104', studentName: 'Alex Rivers', room: '304', dept: 'CSE (II Year)', phone: '+91 9876543210', parentPhone: '+91 9876500000', status: 'IN_HOSTEL' },
  { rollNumber: '2026-CSE-045', studentName: 'Rohan Sharma', room: '208', dept: 'CSE (II Year)', phone: '+91 9876543211', parentPhone: '+91 9876500001', status: 'ON_OUT_PASS' },
  { rollNumber: '2026-ECE-012', studentName: 'Karan Patel', room: '115', dept: 'ECE (II Year)', phone: '+91 9876543212', parentPhone: '+91 9876500002', status: 'IN_HOSTEL' },
  { rollNumber: '2026-MECH-088', studentName: 'Vikas Kumar', room: '210', dept: 'Mech (II Year)', phone: '+91 9876543213', parentPhone: '+91 9876500003', status: 'IN_HOSTEL' },
  { rollNumber: '2026-IT-023', studentName: 'Sanjay Nair', room: '312', dept: 'IT (II Year)', phone: '+91 9876543214', parentPhone: '+91 9876500004', status: 'IN_HOSTEL' },
  { rollNumber: '2026-CIVIL-041', studentName: 'Manoj Raj', room: '105', dept: 'Civil (II Year)', phone: '+91 9876543215', parentPhone: '+91 9876500005', status: 'IN_HOSTEL' }
];

window.sampleBlockResidents = sampleBlockResidents;
window.sampleWardenPendingPasses = sampleWardenPendingPasses;
window.sampleWardenIssuedOutInPasses = sampleWardenIssuedOutInPasses;
window.sampleWardenIssuedRoomStayPasses = sampleWardenIssuedRoomStayPasses;
window.sampleWardenAuditLogs = sampleWardenAuditLogs;
window.sampleWardenSecurityViolations = sampleWardenSecurityViolations;

function renderWardenDashboard() {
  const area = document.getElementById('dashboardRenderArea');
  if (!area) return;

  const user = getCurrentUser() || {};

  area.innerHTML = `
    <!-- Header Hero Banner -->
    <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(99, 102, 241, 0.15)); border: 1px solid var(--border-glow); border-radius: var(--radius-lg); padding: 1.5rem 2rem; margin-bottom: 2rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
      <div>
        <h2 style="font-size: 1.5rem; font-weight: 800;">Deputy Warden Portal 🛡️</h2>
        <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 0.25rem;">
          Hostel: <b>${user.hostelName || 'Pennar Hostel (Boys)'} (${user.hostelBlock || 'Block B'})</b> • Warden: <b>${user.fullName || 'Prof. M. Arjunan'}</b>
        </p>
      </div>
      <div style="display: flex; gap: 0.75rem;">
        <button class="btn btn-primary" onclick="openRegisterStudentModal()">
          + Register New Student
        </button>
      </div>
    </div>

    <!-- Quick Stats (Clickable Count Cards with Interactive Popups) -->
    <div class="grid-stats">
      <div class="stat-card" onclick="openWardenCountModal('residents')" title="Click to view full list of block residents" style="cursor: pointer; position: relative; transition: transform 0.2s, box-shadow 0.2s; border: 1px solid rgba(56, 189, 248, 0.3);">
        <div class="stat-info">
          <div class="stat-label">Block Residents ↗</div>
          <div class="stat-value">128</div>
          <span style="font-size: 0.72rem; color: #38BDF8; font-weight: 600; margin-top: 0.35rem; display: block;">🔍 Click to view list popup</span>
        </div>
        <div class="stat-icon">👥</div>
      </div>
      <div class="stat-card" onclick="openWardenCountModal('pending')" title="Click to view pending passes & return extensions popup" style="cursor: pointer; position: relative; transition: transform 0.2s, box-shadow 0.2s; border: 1px solid rgba(245, 158, 11, 0.3);">
        <div class="stat-info">
          <div class="stat-label">Pending First Approvals ↗</div>
          <div class="stat-value">${sampleWardenPendingPasses.length}</div>
          <span style="font-size: 0.72rem; color: #FBBF24; font-weight: 600; margin-top: 0.35rem; display: block;">🔍 Click to view list popup</span>
        </div>
        <div class="stat-icon">⏳</div>
      </div>
      <div class="stat-card" onclick="openWardenCountModal('outin')" title="Click to view issued OUT/IN passes popup" style="cursor: pointer; position: relative; transition: transform 0.2s, box-shadow 0.2s; border: 1px solid rgba(52, 211, 153, 0.3);">
        <div class="stat-info">
          <div class="stat-label">Issued OUT / IN Passes ↗</div>
          <div class="stat-value">${sampleWardenIssuedOutInPasses.length}</div>
          <span style="font-size: 0.72rem; color: #34D399; font-weight: 600; margin-top: 0.35rem; display: block;">🔍 Click to view list popup</span>
        </div>
        <div class="stat-icon">🚪</div>
      </div>
      <div class="stat-card" onclick="openWardenCountModal('roomstay')" title="Click to view issued room stay passes popup" style="cursor: pointer; position: relative; transition: transform 0.2s, box-shadow 0.2s; border: 1px solid rgba(245, 158, 11, 0.3);">
        <div class="stat-info">
          <div class="stat-label">Issued Room Stay Passes ↗</div>
          <div class="stat-value">${sampleWardenIssuedRoomStayPasses.length}</div>
          <span style="font-size: 0.72rem; color: #F59E0B; font-weight: 600; margin-top: 0.35rem; display: block;">🔍 Click to view list popup</span>
        </div>
        <div class="stat-icon">🛏️</div>
      </div>
      <div class="stat-card" onclick="openWardenCountModal('security')" title="Click to view security incidents popup" style="cursor: pointer; position: relative; transition: transform 0.2s, box-shadow 0.2s; border: 1px solid rgba(239, 68, 68, 0.3);">
        <div class="stat-info">
          <div class="stat-label">Security Incidents (30d) ↗</div>
          <div class="stat-value">${sampleWardenSecurityViolations.filter(v => v.status === 'PENDING_REVIEW').length} Pending</div>
          <span style="font-size: 0.72rem; color: #EF4444; font-weight: 600; margin-top: 0.35rem; display: block;">🔍 Click to view list popup</span>
        </div>
        <div class="stat-icon">🚨</div>
      </div>
    </div>

    <!-- SECTION 1: PENDING PASS & EXTENSION APPROVALS -->
    <div class="dashboard-section" id="sectionWardenApprovals">
      <div class="section-header">
        <h3 class="section-title">⏳ Pending Leave & Extension Approvals (Deputy Warden Decision Queue)</h3>
      </div>
      <p style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 1rem;">
        Flexible Dual-Approval: Either the Deputy Warden or Class Tutor can approve first. Full clearance is granted when both authorities approve.
      </p>

      <div class="table-responsive">
        <table class="custom-table">
          <thead>
            <tr>
              <th>Student Details</th>
              <th>Application Type</th>
              <th>Reason & Destination</th>
              <th>Dual Approval Status</th>
              <th>Requested Schedule</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${sampleWardenPendingPasses.length === 0 ? `
              <tr><td colspan="6" style="text-align: center; color: var(--text-muted);">No pending pass or extension requests in queue.</td></tr>
            ` : sampleWardenPendingPasses.map(pass => `
              <tr>
                <td>
                  <b>${pass.studentName}</b><br>
                  <span style="font-size: 0.78rem; color: var(--text-muted);">${pass.rollNumber} • Room ${pass.room}, ${pass.block}</span>
                </td>
                <td>
                  ${pass.isExtension ? `
                    <span class="status-pill pending" style="background: rgba(245, 158, 11, 0.2); color: #FBBF24; border: 1px solid rgba(245, 158, 11, 0.4);">
                      ⏱️ RETURN EXTENSION
                    </span>
                  ` : `
                    <span class="pass-type-tag ${pass.type === 'OUT_IN_PASS' ? 'outin' : 'roomstay'}">
                      ${pass.type === 'OUT_IN_PASS' ? 'OUT / IN PASS' : 'ROOM STAY'}
                    </span>
                  `}
                </td>
                <td>
                  <b>${pass.reason}</b><br>
                  <span style="font-size: 0.78rem; color: var(--text-muted);">${pass.destination}</span>
                </td>
                <td>
                  <div style="display: flex; flex-direction: column; gap: 0.25rem;">
                    <span class="status-pill pending" style="font-size: 0.7rem;">🛡️ Warden: Pending</span>
                    <span class="status-pill ${pass.tutorApproval === 'APPROVED' ? 'approved' : 'pending'}" style="font-size: 0.7rem;">
                      ${pass.tutorApproval === 'APPROVED' ? '✓ Tutor: Approved' : '⏳ Tutor: Pending'}
                    </span>
                  </div>
                </td>
                <td>${pass.startDate}<br><span style="font-size: 0.78rem; color: var(--text-muted);">to ${pass.endDate}</span></td>
                <td>
                  <div style="display: flex; gap: 0.5rem;">
                    ${pass.isExtension ? `
                      <button class="btn btn-success" style="padding: 0.4rem 0.8rem; font-size: 0.78rem;" onclick="approvePassExtension('${pass.id}')">
                        ✅ Approve Extension
                      </button>
                      <button class="btn btn-danger" style="padding: 0.4rem 0.8rem; font-size: 0.78rem;" onclick="rejectWardenPass('${pass.id}')">
                        ✕ Reject
                      </button>
                    ` : `
                      <button class="btn btn-success" style="padding: 0.4rem 0.8rem; font-size: 0.78rem;" onclick="approveWardenPass('${pass.id}')">
                        ✅ Approve
                      </button>
                      <button class="btn btn-danger" style="padding: 0.4rem 0.8rem; font-size: 0.78rem;" onclick="rejectWardenPass('${pass.id}')">
                        ✕ Reject
                      </button>
                    `}
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- SECTION 2: SEPARATED ISSUED OUT / IN PASSES LIST -->
    <div class="dashboard-section" id="sectionWardenOutInIssued">
      <div class="section-header">
        <h3 class="section-title">🚪 Issued OUT / IN Passes (Campus Leaves)</h3>
        <span class="status-pill approved">${sampleWardenIssuedOutInPasses.length} Passes Active</span>
      </div>
      <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">
        Complete registry of approved OUT / IN passes for campus exits with real-time gate scanner departure status and return validity tracking.
      </p>

      <div class="table-responsive">
        <table class="custom-table">
          <thead>
            <tr>
              <th>Pass ID</th>
              <th>Student Details</th>
              <th>Destination</th>
              <th>Valid Duration</th>
              <th>Gate Status</th>
              <th>Academic Status</th>
            </tr>
          </thead>
          <tbody>
            ${sampleWardenIssuedOutInPasses.map(p => `
              <tr>
                <td><code style="color: #34D399; font-weight: 700;">${p.passCode}</code></td>
                <td>
                  <b>${p.studentName}</b><br>
                  <span style="font-size: 0.78rem; color: var(--text-muted);">${p.rollNumber} • Room ${p.room}, ${p.block}</span>
                </td>
                <td><b>${p.destination}</b></td>
                <td>${p.startDate}<br><span style="font-size: 0.78rem; color: var(--text-muted);">to ${p.endDate}</span></td>
                <td>
                  <span class="status-pill ${p.gateStatus.includes('CHECKED_OUT') ? 'rejected' : 'approved'}">
                    ${p.gateStatus}
                  </span>
                </td>
                <td><span class="status-pill pending">${p.academicStatus}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- SECTION 3: SEPARATED ISSUED ROOM STAY PASSES LIST -->
    <div class="dashboard-section" id="sectionWardenRoomStayIssued">
      <div class="section-header">
        <h3 class="section-title" style="color: #FBBF24;">🛏️ Issued Room Stay Passes</h3>
        <span class="status-pill approved" style="background: rgba(245, 158, 11, 0.2); color: #FBBF24; border-color: rgba(245, 158, 11, 0.4);">${sampleWardenIssuedRoomStayPasses.length} Passes Issued</span>
      </div>
      <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">
        Hostel room stay permissions issued to students resting inside assigned rooms during college hours.
      </p>

      <div class="table-responsive">
        <table class="custom-table">
          <thead>
            <tr>
              <th>Stay Pass ID</th>
              <th>Student Details</th>
              <th>Reason Category & Notes</th>
              <th>Stay Period</th>
              <th>Academic Clearance</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${sampleWardenIssuedRoomStayPasses.map(p => `
              <tr>
                <td><code style="color: #FBBF24; font-weight: 700;">${p.passCode}</code></td>
                <td>
                  <b>${p.studentName}</b><br>
                  <span style="font-size: 0.78rem; color: var(--text-muted);">${p.rollNumber} • Room ${p.room}, ${p.block}</span>
                </td>
                <td>
                  <span class="pass-type-tag roomstay" style="font-size: 0.72rem;">${p.reasonCategory}</span><br>
                  <span style="font-size: 0.82rem; color: var(--text-muted);">${p.reason}</span>
                </td>
                <td>${p.startDate}<br><span style="font-size: 0.78rem; color: var(--text-muted);">to ${p.endDate}</span></td>
                <td><span class="status-pill approved" style="font-size: 0.75rem;">${p.academicStatus}</span></td>
                <td><span class="status-pill ${p.status === 'ACTIVE' ? 'approved' : 'rejected'}">${p.status}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- SECTION 4: SECURITY VIOLATION REPORTS (30-DAY LOG) -->
    <div class="dashboard-section" id="sectionWardenSecurity">
      <div class="section-header">
        <h3 class="section-title">🚨 Security Incident Reports (From Master Gate Security)</h3>
        <span class="status-pill approved">30-Day Mandatory Retention</span>
      </div>
      <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">
        Incidents reported by Master Security involving students of this hostel block. Deputy Warden must review and log official disciplinary action notes. Maintained for 30 days.
      </p>

      <div class="table-responsive">
        <table class="custom-table">
          <thead>
            <tr>
              <th>Student & Room</th>
              <th>Incident Details</th>
              <th>Checkpoint & Time</th>
              <th>Warden Review Status</th>
              <th>Disciplinary Action Recorded</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${sampleWardenSecurityViolations.map(v => `
              <tr>
                <td>
                  <b>${v.student}</b><br>
                  <span style="font-size: 0.78rem; color: var(--text-muted);">${v.roll} • Room ${v.room}, ${v.block}</span>
                </td>
                <td>
                  <span class="status-pill rejected" style="font-size: 0.75rem;">${v.type} (${v.severity})</span><br>
                  <span style="font-size: 0.82rem;">${v.desc}</span>
                </td>
                <td>
                  <b>${v.checkpoint}</b><br>
                  <span style="font-size: 0.78rem; color: var(--text-muted);">${v.time}</span>
                </td>
                <td>
                  <span class="status-pill ${v.status === 'REVIEWED' ? 'approved' : 'pending'}">
                    ${v.status === 'REVIEWED' ? '✅ REVIEWED' : '⏳ PENDING REVIEW'}
                  </span><br>
                  <span style="font-size: 0.72rem; color: var(--text-muted);">${v.retentionNotice}</span>
                </td>
                <td>
                  ${v.wardenResponse ? `
                    <div style="font-size: 0.82rem; color: #34D399; font-weight: 600;">
                      "${v.wardenResponse}"
                    </div>
                    <div style="font-size: 0.72rem; color: var(--text-muted);">
                      By ${v.reviewedBy} at ${v.reviewedAt}
                    </div>
                  ` : `
                    <span style="color: #F87171; font-size: 0.82rem; font-style: italic;">No warden response recorded yet</span>
                  `}
                </td>
                <td>
                  <button class="btn btn-warning" style="padding: 0.4rem 0.8rem; font-size: 0.78rem;" onclick="openReviewSecurityModal('${v.id}')">
                    ${v.status === 'REVIEWED' ? '✏️ Edit Action' : '🚨 Mark Reviewed'}
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- SECTION 5: GRIEVANCES ACTION QUEUE -->
    <div class="dashboard-section" id="sectionWardenGrievances">
      <div class="section-header">
        <h3 class="section-title">🔧 Hostel Grievance Action Queue</h3>
      </div>

      <div class="ticket-grid">
        <div class="ticket-card">
          <div class="ticket-card-header">
            <div>
              <div class="ticket-title">Water tap leaking continuously in Room 304</div>
              <div class="ticket-meta">Category: <b style="color: var(--emerald-500);">PLUMBING (Solve Photo Required)</b> • Severity: <b>MEDIUM</b></div>
            </div>
            <span class="status-pill pending">OPEN</span>
          </div>
          <div class="ticket-desc">Main washroom tap seal broken. Water wastage occurring.</div>
          <div style="margin-top: 1rem; border-top: 1px solid var(--border-glass); padding-top: 0.75rem; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.8rem; color: var(--text-muted);">Reported by Alex Rivers</span>
            <button class="btn btn-primary" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;" onclick="openSolveProofModal('TICKET-104', 'PLUMBING')">
              📷 Resolve & Upload Proof Photo
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- SECTION 6: BLOCK RESIDENTS & PASSWORD RESET -->
    <div class="dashboard-section" id="sectionWardenStudents">
      <div class="section-header">
        <h3 class="section-title">👥 Block Students & Password Reset</h3>
      </div>

      <div class="table-responsive">
        <table class="custom-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Roll Number</th>
              <th>Room & Block</th>
              <th>Department</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><b>Alex Rivers</b></td>
              <td>2026-CSE-104</td>
              <td>Room 304, Block B</td>
              <td>Computer Science (Section A)</td>
              <td>
                <button class="btn btn-secondary" style="padding: 0.35rem 0.75rem; font-size: 0.78rem;" onclick="openResetPasswordModal('2026-CSE-104', 'Alex Rivers')">
                  🔑 Reset Password
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Multi-Tier Role-Scoped Notice Board -->
    ${typeof renderNoticeBoardSection === 'function' ? renderNoticeBoardSection() : ''}
  `;
}

// Pass Approval for Deputy Warden (Flexible Dual Approval)
function approveWardenPass(passId) {
  const user = getCurrentUser() || {};
  const pass = sampleWardenPendingPasses.find(p => p.id === passId);
  if (!pass) return;

  pass.wardenApproval = 'APPROVED';
  pass.wardenApprovedBy = user.fullName || 'Prof. M. Arjunan (Deputy Warden)';
  pass.wardenApprovedAt = new Date().toISOString().replace('T', ' ').slice(0, 19);

  // Check if Tutor has already approved
  const isTutorApproved = (pass.tutorApproval === 'APPROVED');
  const finalStatus = isTutorApproved ? 'APPROVED' : 'PARTIAL_WARDEN_APPROVED';

  // Move to warden issued list
  if (pass.type === 'OUT_IN_PASS') {
    sampleWardenIssuedOutInPasses.unshift({
      id: pass.id,
      passCode: pass.id,
      studentName: pass.studentName,
      rollNumber: pass.rollNumber,
      block: pass.block,
      room: pass.room,
      type: 'OUT_IN_PASS',
      destination: pass.destination,
      startDate: pass.startDate,
      endDate: pass.endDate,
      gateStatus: 'IN_HOSTEL (Not Yet Departed)',
      academicStatus: isTutorApproved ? 'CLEARED_BY_TUTOR' : 'PENDING_TUTOR_APPROVAL',
      wardenApproval: 'APPROVED',
      tutorApproval: pass.tutorApproval || 'PENDING',
      extensionStatus: 'NONE'
    });
  } else {
    sampleWardenIssuedRoomStayPasses.unshift({
      id: pass.id,
      passCode: pass.id,
      studentName: pass.studentName,
      rollNumber: pass.rollNumber,
      block: pass.block,
      room: pass.room,
      type: 'ROOM_STAY_PASS',
      reasonCategory: 'Hostel Room Stay',
      reason: pass.reason,
      startDate: pass.startDate,
      endDate: pass.endDate,
      academicStatus: isTutorApproved ? 'CLEARED_BY_TUTOR' : 'PENDING_TUTOR_APPROVAL',
      wardenApproval: 'APPROVED',
      tutorApproval: pass.tutorApproval || 'PENDING',
      status: isTutorApproved ? 'ACTIVE' : 'PENDING_TUTOR'
    });
  }

  // Sync with student dashboard active passes
  if (window.sampleOutInPasses) {
    const sPass = window.sampleOutInPasses.find(p => p.id === pass.id || p.passCode === pass.id);
    if (sPass) {
      sPass.hostelStatus = 'APPROVED_BY_WARDEN';
      sPass.wardenApproval = 'APPROVED';
      if (sPass.tutorApproval === 'APPROVED') {
        sPass.finalStatus = 'APPROVED';
      } else {
        sPass.finalStatus = 'WARDEN_APPROVED (Awaiting Tutor)';
      }
    }
  }

  if (window.sampleRoomStayPasses) {
    const rPass = window.sampleRoomStayPasses.find(p => p.id === pass.id || p.passCode === pass.id);
    if (rPass) {
      rPass.hostelStatus = 'APPROVED_BY_WARDEN';
      rPass.wardenApproval = 'APPROVED';
      if (rPass.tutorApproval === 'APPROVED') {
        rPass.finalStatus = 'APPROVED';
      } else {
        rPass.finalStatus = 'WARDEN_APPROVED (Awaiting Tutor)';
      }
    }
  }

  // Sync with academic queue
  if (window.sampleAcademicVerifications) {
    const aPass = window.sampleAcademicVerifications.find(p => p.id === pass.id);
    if (aPass) {
      aPass.wardenStatus = 'APPROVED_BY_WARDEN';
      aPass.wardenApproval = 'APPROVED';
    }
  }

  sampleWardenPendingPasses = sampleWardenPendingPasses.filter(p => p.id !== passId);

  // Record in audit log
  sampleWardenAuditLogs.unshift({
    action: 'PASS_WARDEN_APPROVAL',
    details: `Deputy Warden approved ${pass.type} (${pass.id}) for ${pass.studentName} (${pass.rollNumber})`,
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    wardenName: user.fullName || 'Prof. M. Arjunan',
    targetId: pass.id,
    studentRoll: pass.rollNumber,
    outcome: 'APPROVED'
  });

  if (window.saveAppState) window.saveAppState();
  renderWardenDashboard();
  alert(`✅ WARDEN APPROVAL GRANTED!\n\nPass: ${passId}\nStudent: ${pass.studentName} (${pass.rollNumber})\n\nDual Approval State: ${isTutorApproved ? 'FULLY CLEARED (Both Warden & Tutor Approved)' : 'Warden Approved (Awaiting Class Tutor Approval)'}`);
}

function approveWardenFirstPass(passId) {
  approveWardenPass(passId);
}

// Pass Validity Extension Approval (Student requests, Deputy Warden reviews & approves)
function approvePassExtension(extId) {
  const user = getCurrentUser() || {};
  const ext = sampleWardenPendingPasses.find(p => p.id === extId);
  if (!ext) return;

  // Update in warden issued list
  const issued = sampleWardenIssuedOutInPasses.find(p => p.id === ext.originalPassId || p.rollNumber === ext.rollNumber);
  if (issued) {
    issued.endDate = ext.endDate;
    issued.extensionStatus = `EXTENDED (Approved to ${ext.endDate})`;
  }

  // Update in student's own active pass registry
  if (window.sampleOutInPasses) {
    const studentPass = window.sampleOutInPasses.find(p => p.id === ext.originalPassId || p.passCode === ext.originalPassId || p.id === ext.id);
    if (studentPass) {
      studentPass.endDate = ext.endDate;
      studentPass.extensionStatus = `EXTENDED (Approved by Deputy Warden until ${ext.endDate})`;
    }
  }

  sampleWardenPendingPasses = sampleWardenPendingPasses.filter(p => p.id !== extId);

  // Record in audit log
  sampleWardenAuditLogs.unshift({
    action: 'PASS_EXTENSION_APPROVED',
    details: `Approved Return Time Extension for ${ext.studentName} (${ext.rollNumber}) to ${ext.endDate}. Reason: ${ext.reason}`,
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    wardenName: user.fullName || 'Prof. M. Arjunan',
    targetId: extId,
    studentRoll: ext.rollNumber,
    outcome: 'EXTENSION_GRANTED'
  });

  if (window.saveAppState) window.saveAppState();
  renderWardenDashboard();
  alert(`⏱️ PASS VALIDITY EXTENSION APPROVED!\n\nExtended return time to ${ext.endDate} for ${ext.studentName}. Details logged in Audit Trail.`);
}

function rejectWardenPass(passId) {
  const user = getCurrentUser() || {};
  const pass = sampleWardenPendingPasses.find(p => p.id === passId);
  sampleWardenPendingPasses = sampleWardenPendingPasses.filter(p => p.id !== passId);

  if (pass) {
    if (window.sampleOutInPasses) {
      const sp = window.sampleOutInPasses.find(p => p.id === passId || p.passCode === passId || p.id === pass.originalPassId);
      if (sp) {
        sp.finalStatus = pass.isExtension ? 'EXTENSION REJECTED BY WARDEN' : 'REJECTED_BY_WARDEN';
        sp.wardenApproval = 'REJECTED';
      }
    }

    if (window.sampleRoomStayPasses) {
      const rp = window.sampleRoomStayPasses.find(p => p.id === passId || p.passCode === passId);
      if (rp) {
        rp.finalStatus = 'REJECTED_BY_WARDEN';
        rp.wardenApproval = 'REJECTED';
      }
    }

    if (window.sampleAcademicVerifications) {
      window.sampleAcademicVerifications = window.sampleAcademicVerifications.filter(p => p.id !== passId);
    }

    sampleWardenAuditLogs.unshift({
      action: pass.isExtension ? 'PASS_EXTENSION_REJECTED' : 'PASS_REJECTED',
      details: `Deputy Warden rejected ${pass.isExtension ? 'Return Extension' : pass.type} for ${pass.studentName} (${pass.rollNumber})`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      wardenName: user.fullName || 'Prof. M. Arjunan',
      targetId: passId,
      studentRoll: pass.rollNumber,
      outcome: 'REJECTED'
    });
  }

  if (window.saveAppState) window.saveAppState();
  renderWardenDashboard();
  alert(`✕ REQUEST REJECTED\n\nRequest ${passId} has been marked rejected and synchronized across student & tutor records.`);
}

// Security Violation Review Handlers
function openReviewSecurityModal(violId) {
  const viol = sampleWardenSecurityViolations.find(v => v.id === violId);
  if (!viol) return;

  document.getElementById('reviewViolationId').value = viol.id;
  const box = document.getElementById('reviewViolationDetailsBox');
  if (box) {
    box.innerHTML = `
      <div><b>Student:</b> ${viol.student} (Roll: <code>${viol.roll}</code>, Room: ${viol.room}, ${viol.block})</div>
      <div><b>Incident:</b> <span class="status-pill rejected">${viol.type}</span> at <b>${viol.checkpoint}</b> (${viol.time})</div>
      <div><b>Severity:</b> <b style="color: #F87171;">${viol.severity}</b></div>
      <div style="margin-top: 0.4rem;"><b>Security Officer Report:</b> "${viol.desc}"</div>
    `;
  }

  document.getElementById('reviewWardenResponse').value = viol.wardenResponse || '';
  document.getElementById('reviewSecurityViolationModal').classList.add('active');
}

function closeReviewSecurityModal() {
  document.getElementById('reviewSecurityViolationModal').classList.remove('active');
}

function handleSaveSecurityReview(e) {
  e.preventDefault();
  const user = getCurrentUser();
  const violId = document.getElementById('reviewViolationId').value;
  const responseText = document.getElementById('reviewWardenResponse').value.trim();

  const viol = sampleWardenSecurityViolations.find(v => v.id === violId);
  if (viol) {
    viol.status = 'REVIEWED';
    viol.wardenResponse = responseText;
    viol.reviewedBy = user.fullName;
    viol.reviewedAt = new Date().toISOString().replace('T', ' ').slice(0, 16);

    sampleWardenAuditLogs.unshift({
      action: 'SECURITY_INCIDENT_REVIEWED',
      details: `Warden reviewed security violation (${viol.type}) for ${viol.student} (${viol.roll}). Action: ${responseText}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      wardenName: user.fullName,
      targetId: viol.id,
      studentRoll: viol.roll,
      outcome: 'DISCIPLINARY_ACTION_LOGGED'
    });
  }

  closeReviewSecurityModal();
  renderWardenDashboard();
  alert(`🚨 SECURITY VIOLATION REVIEW RECORDED!\n\nDisciplinary action notes saved. Maintained in 30-day disciplinary log.`);
}

// Student Registration & Password Reset
function openRegisterStudentModal() {
  document.getElementById('registerStudentModal').classList.add('active');
}
function closeRegisterStudentModal() {
  document.getElementById('registerStudentModal').classList.remove('active');
}

function handleRegisterStudentSubmit(e) {
  e.preventDefault();
  const user = getCurrentUser() || {};
  const name = (document.getElementById('regStudentName') || {}).value || '';
  const roll = (document.getElementById('regStudentRoll') || {}).value || '';
  const regNo = (document.getElementById('regStudentRegNo') || {}).value || `730323104${Math.floor(100 + Math.random() * 900)}`;
  const dept = (document.getElementById('regStudentDept') || {}).value || 'Computer Science & Engineering';
  const year = (document.getElementById('regStudentYear') || {}).value || 'II Year (3rd Sem)';
  const section = (document.getElementById('regStudentSection') || {}).value || 'Section A';
  const hostel = (document.getElementById('regStudentHostel') || {}).value || 'Pennar Hostel (Block B)';
  const room = (document.getElementById('regStudentRoom') || {}).value || 'Room 304';
  const phone = (document.getElementById('regStudentPhone') || {}).value || '+91 9876543210';
  const parent = (document.getElementById('regStudentParent') || {}).value || '+91 9876500000';
  const username = (document.getElementById('regStudentUsername') || {}).value || roll.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const pass = (document.getElementById('regStudentPassword') || {}).value || 'Pass@123';

  // Compute Year Number
  let yearNum = 2;
  if (year.includes('I Year') || year.includes('1st')) yearNum = 1;
  else if (year.includes('II Year') || year.includes('3rd')) yearNum = 2;
  else if (year.includes('III Year') || year.includes('5th')) yearNum = 3;
  else if (year.includes('IV Year') || year.includes('7th')) yearNum = 4;

  // Department Code
  let deptCode = 'CSE';
  if (dept.includes('ECE') || dept.includes('Communication')) deptCode = 'ECE';
  else if (dept.includes('MECH') || dept.includes('Mechanical')) deptCode = 'MECH';
  else if (dept.includes('CIVIL') || dept.includes('Civil')) deptCode = 'CIVIL';
  else if (dept.includes('IT') || dept.includes('Information')) deptCode = 'IT';

  // Assigned Class Tutor based on Department and Section
  let assignedTutor = 'Prof. M. Priya (tutor_cse_a)';
  if (section === 'Section B') assignedTutor = 'Prof. K. Ramesh (tutor_cse_b)';
  else if (section === 'Section C') assignedTutor = 'Department Faculty Advisor';

  // 1. Central Student Master Record (Strictly Hostel Student Registry)
  const studentEntry = {
    rollNumber: roll,
    registerNumber: regNo,
    fullName: name,
    department: dept,
    deptCode: deptCode,
    year: year,
    yearNumber: yearNum,
    classSection: section,
    assignedTutor: assignedTutor,
    hostelName: hostel,
    hostelBlock: hostel.includes('Block') ? hostel.split('(')[1].replace(')', '') : 'Main Block',
    roomNumber: room.replace('Room', '').trim(),
    phone: phone,
    parentContact: parent
  };

  if (window.STUDENT_REGISTRY) {
    const existingIndex = window.STUDENT_REGISTRY.findIndex(s => s.rollNumber.toUpperCase() === roll.toUpperCase());
    if (existingIndex >= 0) {
      window.STUDENT_REGISTRY[existingIndex] = studentEntry;
    } else {
      window.STUDENT_REGISTRY.unshift(studentEntry);
    }
  }

  // 2. Block Residents List
  if (window.sampleBlockResidents) {
    window.sampleBlockResidents.unshift({
      rollNumber: roll,
      studentName: name,
      room: room.replace('Room', '').trim(),
      dept: `${deptCode} (${year.split(' ')[0]} ${section})`,
      phone: phone,
      parentPhone: parent,
      status: 'IN_HOSTEL'
    });
  }

  // 3. Central Academic Attendance Database (Uploaded by Assigned Tutor)
  if (window.updateStudentAttendance) {
    window.updateStudentAttendance(roll, 85, assignedTutor);
  }

  // 4. Register login credentials in SYSTEM_ACCOUNTS
  if (window.SYSTEM_ACCOUNTS) {
    window.SYSTEM_ACCOUNTS[username] = {
      id: Date.now(),
      username: username,
      fullName: name,
      rollNumber: roll,
      registerNumber: regNo,
      role: 'STUDENT',
      department: dept,
      deptCode: deptCode,
      year: year,
      yearNumber: yearNum,
      classSection: section,
      assignedTutor: assignedTutor,
      hostelName: hostel,
      hostelBlock: studentEntry.hostelBlock,
      roomNumber: studentEntry.roomNumber,
      phone: phone,
      parentContact: parent
    };
  }

  // 5. Audit Log
  sampleWardenAuditLogs.unshift({
    action: 'CREATE_STUDENT',
    details: `Registered resident ${name} (${roll} / ${regNo}) in ${hostel} ${room} [${year}, ${section}, Tutor: ${assignedTutor}]`,
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    wardenName: user.fullName || 'Deputy Warden',
    targetId: roll,
    studentRoll: roll,
    outcome: 'CREATED'
  });

  closeRegisterStudentModal();
  if (window.saveAppState) window.saveAppState();
  renderWardenDashboard();
  alert(`✅ STUDENT REGISTERED SUCCESSFULLY!\n\n` +
        `Student: ${name}\n` +
        `Roll No: ${roll}\n` +
        `Reg No: ${regNo}\n` +
        `Year & Section: ${year} • ${section}\n` +
        `Assigned Tutor: ${assignedTutor}\n` +
        `Hostel & Room: ${hostel} • ${room}\n` +
        `Login Username: ${username}\n` +
        `Password: ${pass}`);
}

function openResetPasswordModal(roll, name) {
  const rollInput = document.getElementById('resetStudentRoll');
  if (rollInput) rollInput.value = roll;
  const nameInput = document.getElementById('resetStudentName');
  if (nameInput) nameInput.value = name;
  const modal = document.getElementById('resetPasswordModal');
  if (modal) modal.classList.add('active');
}

function closeResetPasswordModal() {
  const modal = document.getElementById('resetPasswordModal');
  if (modal) modal.classList.remove('active');
}

function handleResetPasswordSubmit(e) {
  e.preventDefault();
  const user = getCurrentUser();
  const roll = (document.getElementById('resetStudentRoll') || {}).value || '2026-CSE-104';
  const name = (document.getElementById('resetStudentName') || {}).value || 'Alex Rivers';
  const newPass = (document.getElementById('resetNewPassword') || {}).value || '';

  sampleWardenAuditLogs.unshift({
    action: 'PASSWORD_RESET',
    details: `Reset password for student ${name} (${roll})`,
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    wardenName: user.fullName,
    targetId: roll,
    studentRoll: roll,
    outcome: 'PASSWORD_CHANGED'
  });

  closeResetPasswordModal();
  alert(`🔑 PASSWORD RESET SUCCESSFUL!\n\nStudent: ${name} (${roll})\nNew Password: ${newPass}`);
}

function openSolveProofModal(ticketId, category) {
  activeWardenSolveTicketId = ticketId;
  activeWardenSolveCategory = category;
  const display = document.getElementById('solveTicketIdDisplay');
  if (display) display.innerText = ticketId;
  const modal = document.getElementById('solveProofModal');
  if (modal) modal.classList.add('active');
}

function closeSolveProofModal() {
  const modal = document.getElementById('solveProofModal');
  if (modal) modal.classList.remove('active');
}

function handleSolveProofSubmit(e) {
  e.preventDefault();
  const user = getCurrentUser();
  const photo = (document.getElementById('solvePhotoInput') || document.getElementById('solveProofPhotoInput') || {}).value;

  if (['PLUMBING', 'ELECTRICAL', 'MESS_FOOD', 'CLEANLINESS_HYGIENE'].includes(activeWardenSolveCategory) && !photo) {
    alert('❌ PHYSICAL PHOTO PROOF MANDATORY!\n\nThis complaint category requires photo evidence of the completed repair.');
    return;
  }

  sampleWardenAuditLogs.unshift({
    action: 'RESOLVE_GRIEVANCE',
    details: `Uploaded solve photo and marked resolved for ${activeWardenSolveTicketId} (${activeWardenSolveCategory})`,
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    wardenName: user.fullName,
    targetId: activeWardenSolveTicketId,
    outcome: 'RESOLVED'
  });

  closeSolveProofModal();
  renderWardenDashboard();
  alert(`🎉 TICKET RESOLVED!\n\nPhoto proof attached. Ticket closed successfully.`);
}

// ==========================================================================
// Deputy Warden Count Card Item List Popup Modal Handlers
// ==========================================================================

function openWardenCountModal(type) {
  const modal = document.getElementById('wardenCountModal');
  const titleEl = document.getElementById('wardenCountModalTitle');
  const bodyEl = document.getElementById('wardenCountModalBody');
  const footerCount = document.getElementById('wardenCountModalFooterCount');
  if (!modal || !bodyEl) return;

  if (type === 'pending') {
    titleEl.innerHTML = `⏳ Pending Leave Passes & Return Extension Requests (${sampleWardenPendingPasses.length})`;
    if (footerCount) footerCount.innerText = `Total ${sampleWardenPendingPasses.length} pending request(s) requiring warden decision`;

    if (sampleWardenPendingPasses.length === 0) {
      bodyEl.innerHTML = `
        <div style="text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🎉</div>
          <b>All Caught Up!</b><br>
          No pending pass applications or return extension requests waiting for approval.
        </div>
      `;
    } else {
      bodyEl.innerHTML = `
        <div class="table-responsive">
          <table class="custom-table">
            <thead>
              <tr>
                <th>Student Details</th>
                <th>Request Type</th>
                <th>Reason / Justification</th>
                <th>Requested Schedule</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${sampleWardenPendingPasses.map(p => `
                <tr>
                  <td>
                    <b>${p.studentName}</b><br>
                    <span style="font-size: 0.78rem; color: var(--text-muted);">${p.rollNumber} • Room ${p.room}, ${p.block}</span>
                  </td>
                  <td>
                    ${p.isExtension ? `
                      <span class="status-pill pending" style="background: rgba(245, 158, 11, 0.2); color: #FBBF24; border: 1px solid rgba(245, 158, 11, 0.4); font-size: 0.72rem;">
                        ⏱️ RETURN EXTENSION (From Student)
                      </span>
                    ` : `
                      <span class="pass-type-tag ${p.type === 'OUT_IN_PASS' ? 'outin' : 'roomstay'}">
                        ${p.type === 'OUT_IN_PASS' ? 'OUT / IN PASS' : 'ROOM STAY'}
                      </span>
                    `}
                  </td>
                  <td>
                    <b>${p.reason}</b><br>
                    <span style="font-size: 0.78rem; color: var(--text-muted);">${p.destination || 'Campus'}</span>
                  </td>
                  <td>
                    ${p.startDate}<br>
                    <span style="font-size: 0.78rem; color: #FBBF24; font-weight: 600;">to ${p.endDate}</span>
                  </td>
                  <td>
                    <div style="display: flex; gap: 0.4rem;">
                      ${p.isExtension ? `
                        <button class="btn btn-success" style="padding: 0.35rem 0.7rem; font-size: 0.75rem;" onclick="approvePassExtensionFromModal('${p.id}')">
                          ✅ Approve
                        </button>
                        <button class="btn btn-danger" style="padding: 0.35rem 0.7rem; font-size: 0.75rem;" onclick="rejectWardenPassFromModal('${p.id}')">
                          ✕ Reject
                        </button>
                      ` : `
                        <button class="btn btn-success" style="padding: 0.35rem 0.7rem; font-size: 0.75rem;" onclick="approveWardenFirstPassFromModal('${p.id}')">
                          ✅ Approve
                        </button>
                        <button class="btn btn-danger" style="padding: 0.35rem 0.7rem; font-size: 0.75rem;" onclick="rejectWardenPassFromModal('${p.id}')">
                          ✕ Reject
                        </button>
                      `}
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    }
  } else if (type === 'outin') {
    titleEl.innerHTML = `🚪 Issued OUT / IN Passes Registry (${sampleWardenIssuedOutInPasses.length})`;
    if (footerCount) footerCount.innerText = `Total ${sampleWardenIssuedOutInPasses.length} active/issued OUT/IN pass(es)`;

    bodyEl.innerHTML = `
      <div class="table-responsive">
        <table class="custom-table">
          <thead>
            <tr>
              <th>Pass ID</th>
              <th>Student Details</th>
              <th>Destination</th>
              <th>Valid Duration</th>
              <th>Gate Departure Status</th>
              <th>Extension Status</th>
            </tr>
          </thead>
          <tbody>
            ${sampleWardenIssuedOutInPasses.map(p => `
              <tr>
                <td><code style="color: #34D399; font-weight: 700;">${p.passCode}</code></td>
                <td>
                  <b>${p.studentName}</b><br>
                  <span style="font-size: 0.78rem; color: var(--text-muted);">${p.rollNumber} • Room ${p.room}, ${p.block}</span>
                </td>
                <td><b>${p.destination}</b></td>
                <td>${p.startDate}<br><span style="font-size: 0.78rem; color: var(--text-muted);">to ${p.endDate}</span></td>
                <td>
                  <span class="status-pill ${p.gateStatus && p.gateStatus.includes('CHECKED_OUT') ? 'rejected' : 'approved'}">
                    ${p.gateStatus || 'IN_HOSTEL'}
                  </span>
                </td>
                <td>
                  <span class="status-pill ${p.extensionStatus && p.extensionStatus.includes('EXTENDED') ? 'approved' : 'pending'}" style="font-size: 0.72rem;">
                    ${p.extensionStatus || 'NONE'}
                  </span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  } else if (type === 'roomstay') {
    titleEl.innerHTML = `🛏️ Issued Room Stay Passes Registry (${sampleWardenIssuedRoomStayPasses.length})`;
    if (footerCount) footerCount.innerText = `Total ${sampleWardenIssuedRoomStayPasses.length} active/issued Room Stay pass(es)`;

    bodyEl.innerHTML = `
      <div class="table-responsive">
        <table class="custom-table">
          <thead>
            <tr>
              <th>Stay Pass ID</th>
              <th>Student Details</th>
              <th>Reason Category & Notes</th>
              <th>Stay Period</th>
              <th>Academic Clearance</th>
              <th>Pass Status</th>
            </tr>
          </thead>
          <tbody>
            ${sampleWardenIssuedRoomStayPasses.map(p => `
              <tr>
                <td><code style="color: #FBBF24; font-weight: 700;">${p.passCode}</code></td>
                <td>
                  <b>${p.studentName}</b><br>
                  <span style="font-size: 0.78rem; color: var(--text-muted);">${p.rollNumber} • Room ${p.room}, ${p.block}</span>
                </td>
                <td>
                  <span class="pass-type-tag roomstay" style="font-size: 0.72rem;">${p.reasonCategory}</span><br>
                  <span style="font-size: 0.8rem; color: var(--text-muted);">${p.reason}</span>
                </td>
                <td>${p.startDate}<br><span style="font-size: 0.78rem; color: var(--text-muted);">to ${p.endDate}</span></td>
                <td><span class="status-pill approved" style="font-size: 0.74rem;">${p.academicStatus}</span></td>
                <td><span class="status-pill ${p.status === 'ACTIVE' ? 'approved' : 'rejected'}">${p.status}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  } else if (type === 'security') {
    titleEl.innerHTML = `🚨 Master Security Incidents (30-Day Disciplinary Log)`;
    if (footerCount) footerCount.innerText = `Total ${sampleWardenSecurityViolations.length} violation report(s) from Gate Security`;

    bodyEl.innerHTML = `
      <div class="table-responsive">
        <table class="custom-table">
          <thead>
            <tr>
              <th>Incident</th>
              <th>Student</th>
              <th>Checkpoint</th>
              <th>Description</th>
              <th>Warden Review Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${sampleWardenSecurityViolations.map(v => `
              <tr>
                <td>
                  <code style="color: #EF4444; font-weight: 700;">${v.id}</code><br>
                  <span class="status-pill rejected" style="font-size: 0.7rem;">${v.severity}</span>
                </td>
                <td>
                  <b>${v.student}</b><br>
                  <span style="font-size: 0.78rem; color: var(--text-muted);">${v.roll} • Room ${v.room}</span>
                </td>
                <td><b>${v.checkpoint}</b><br><span style="font-size: 0.75rem; color: var(--text-muted);">${v.time}</span></td>
                <td style="max-width: 240px; font-size: 0.82rem;">${v.desc}</td>
                <td>
                  ${v.status === 'REVIEWED' ? `
                    <span class="status-pill approved" style="font-size: 0.72rem;">REVIEWED</span><br>
                    <span style="font-size: 0.75rem; color: #34D399;">${v.wardenResponse}</span>
                  ` : `
                    <span class="status-pill pending" style="font-size: 0.72rem;">PENDING REVIEW</span>
                  `}
                </td>
                <td>
                  ${v.status === 'PENDING_REVIEW' ? `
                    <button class="btn btn-warning" style="padding: 0.35rem 0.7rem; font-size: 0.75rem; color: #0F172A;" onclick="closeWardenCountModal(); openReviewSecurityModal('${v.id}')">
                      Review
                    </button>
                  ` : `
                    <span style="font-size: 0.75rem; color: var(--text-muted);">✓ Resolved</span>
                  `}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  } else if (type === 'residents') {
    titleEl.innerHTML = `👥 Block Residents Directory (Pennar Hostel Block B)`;
    if (footerCount) footerCount.innerText = `Showing registered residents in Block B (Total 128)`;

    bodyEl.innerHTML = `
      <div class="table-responsive">
        <table class="custom-table">
          <thead>
            <tr>
              <th>Roll Number</th>
              <th>Student Name</th>
              <th>Room</th>
              <th>Department</th>
              <th>Student Mobile</th>
              <th>Parent Mobile</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${sampleBlockResidents.map(r => `
              <tr>
                <td><code style="color: #38BDF8; font-weight: 700;">${r.rollNumber}</code></td>
                <td><b>${r.studentName}</b></td>
                <td><span class="pass-type-tag roomstay">Room ${r.room}</span></td>
                <td>${r.dept}</td>
                <td>${r.phone}</td>
                <td>${r.parentPhone}</td>
                <td>
                  <span class="status-pill ${r.status === 'IN_HOSTEL' ? 'approved' : 'pending'}" style="font-size: 0.72rem;">
                    ${r.status === 'IN_HOSTEL' ? '🏠 IN HOSTEL' : '🚪 ON OUT PASS'}
                  </span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  modal.classList.add('active');
}

function closeWardenCountModal() {
  const modal = document.getElementById('wardenCountModal');
  if (modal) modal.classList.remove('active');
}

function approvePassExtensionFromModal(extId) {
  approvePassExtension(extId);
  openWardenCountModal('pending');
}

function approveWardenFirstPassFromModal(passId) {
  approveWardenFirstPass(passId);
  openWardenCountModal('pending');
}

function rejectWardenPassFromModal(passId) {
  rejectWardenPass(passId);
  openWardenCountModal('pending');
}

// Window bindings
window.renderWardenDashboard = renderWardenDashboard;
window.approveWardenPass = approveWardenPass;
window.approveWardenFirstPass = approveWardenFirstPass;
window.approvePassExtension = approvePassExtension;
window.rejectWardenPass = rejectWardenPass;
window.openWardenCountModal = openWardenCountModal;
window.closeWardenCountModal = closeWardenCountModal;
window.approvePassExtensionFromModal = approvePassExtensionFromModal;
window.approveWardenFirstPassFromModal = approveWardenFirstPassFromModal;
window.rejectWardenPassFromModal = rejectWardenPassFromModal;
window.openReviewSecurityModal = openReviewSecurityModal;
window.closeReviewSecurityModal = closeReviewSecurityModal;
window.handleSaveSecurityReview = handleSaveSecurityReview;
window.openRegisterStudentModal = openRegisterStudentModal;
window.closeRegisterStudentModal = closeRegisterStudentModal;
window.handleRegisterStudentSubmit = handleRegisterStudentSubmit;
window.openResetPasswordModal = openResetPasswordModal;
window.closeResetPasswordModal = closeResetPasswordModal;
window.handleResetPasswordSubmit = handleResetPasswordSubmit;
window.openSolveProofModal = openSolveProofModal;
window.closeSolveProofModal = closeSolveProofModal;
window.handleSolveProofSubmit = handleSolveProofSubmit;
