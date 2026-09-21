/* ==========================================================================
   CampusConnect - Student Module (Dual-Approval & Tutor Attendance Binding)
   Adhiyamaan College of Engineering (ACE)
   ========================================================================== */

let sampleOutInPasses = [
  {
    id: 'PASS-2026-X89B',
    type: 'OUT_IN_PASS',
    reason: 'Medical checkup at Apollo Specialty Hospital',
    startDate: '2026-09-21 09:00',
    endDate: '2026-09-21 18:00',
    destination: 'Apollo Hospital, Hosur',
    parentContact: '+91 9876543210',
    hostelStatus: 'APPROVED_BY_WARDEN',
    wardenApproval: 'APPROVED',
    academicStatus: 'PENDING_TUTOR_APPROVAL',
    tutorApproval: 'PENDING',
    finalStatus: 'PARTIAL (Warden Approved, Awaiting Tutor)',
    passCode: 'PASS-2026-X89B',
    extensionStatus: 'NONE'
  }
];

let sampleRoomStayPasses = [
  {
    id: 'STAY-2026-R402',
    type: 'ROOM_STAY_PASS',
    reason: '[Medical / Sickness] Viral fever - Bed rest in hostel room',
    startDate: '2026-09-18 08:00',
    endDate: '2026-09-19 20:00',
    destination: 'Hostel Room Stay (Room 304)',
    parentContact: '+91 9876543210',
    hostelStatus: 'APPROVED_BY_WARDEN',
    wardenApproval: 'APPROVED',
    academicStatus: 'APPROVED_BY_TUTOR',
    tutorApproval: 'APPROVED',
    finalStatus: 'EXPIRED',
    passCode: 'STAY-2026-R402'
  }
];

let sampleStudentGrievances = [
  {
    id: 'TICKET-104',
    category: 'PLUMBING',
    severity: 'MEDIUM',
    title: 'Water tap leaking continuously in Room 304 washroom',
    desc: 'The main basin tap is leaking and wasting water.',
    status: 'OPEN',
    photoProof: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%236366F1" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>',
    solveProof: null,
    createdAt: '2026-09-20 08:30'
  },
  {
    id: 'TICKET-092',
    category: 'WIFI_INTERNET',
    severity: 'LOW',
    title: 'Low Wi-Fi signal in Block B 3rd Floor corridor',
    desc: 'Signal drops frequently past 9 PM.',
    status: 'RESOLVED',
    photoProof: null,
    solveProof: null,
    createdAt: '2026-09-15 14:00'
  }
];

function renderStudentDashboard() {
  const area = document.getElementById('dashboardRenderArea');
  if (!area) return;

  const user = getCurrentUser() || {};
  const fullName = user.fullName || 'Alex Rivers';
  const rollNumber = user.rollNumber || '2026-CSE-104';
  const registerNumber = user.registerNumber || '730323104104';
  const classSection = user.classSection || 'Section A';
  const year = user.year || 'II Year (3rd Sem)';
  const assignedTutor = user.assignedTutor || 'Prof. M. Priya (Class Tutor)';
  const hostelName = user.hostelName || 'Pennar Hostel (Boys)';
  const hostelBlock = user.hostelBlock || 'Block B';
  const roomNumber = user.roomNumber || '304';
  const department = user.department || 'Computer Science & Engineering';

  // Retrieve Academic Attendance strictly uploaded by Class Tutor
  const attData = window.getStudentAttendance ? window.getStudentAttendance(rollNumber) : { attendance: 82, uploadedBy: 'Prof. M. Priya (Class Tutor)' };
  const attPct = (attData.attendance !== null && attData.attendance !== undefined) ? attData.attendance : 82;

  area.innerHTML = `
    <!-- Header Hero Banner -->
    <div style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(16, 185, 129, 0.15)); border: 1px solid var(--border-glow); border-radius: var(--radius-lg); padding: 1.5rem 2rem; margin-bottom: 2rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
      <div>
        <h2 style="font-size: 1.5rem; font-weight: 800;">Welcome back, ${fullName}! 👋</h2>
        <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 0.25rem; line-height: 1.6;">
          Resident: <b>${hostelName} (${hostelBlock})</b> • Room <b>${roomNumber}</b><br>
          Academic: <b>${department}</b> • <b>${year}</b> • <b>${classSection}</b> (Roll: <code style="color: #38BDF8;">${rollNumber}</code> / Reg: <code>${registerNumber}</code>)<br>
          Assigned Tutor: <b style="color: #A5B4FC;">${assignedTutor}</b>
        </p>
      </div>
      <div style="display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;">
        <!-- Academic Attendance Badge Uploaded by Class Tutor -->
        <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid ${attPct >= 75 ? 'rgba(52, 211, 153, 0.4)' : 'rgba(239, 68, 68, 0.4)'}; padding: 0.6rem 1rem; border-radius: 8px; text-align: right;">
          <div style="font-size: 0.72rem; color: var(--text-muted);">Academic Attendance</div>
          <div style="font-size: 1.25rem; font-weight: 800; color: ${attPct >= 75 ? '#34D399' : '#EF4444'};">${attPct}%</div>
          <div style="font-size: 0.68rem; color: #818CF8;">Uploaded by Class Tutor</div>
        </div>
        <button class="btn btn-danger" style="box-shadow: 0 0 20px rgba(239, 68, 68, 0.4);" onclick="triggerSOS()">
          🚨 EMERGENCY SOS
        </button>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid-stats">
      <div class="stat-card">
        <div class="stat-info">
          <div class="stat-label">OUT / IN Passes</div>
          <div class="stat-value">${sampleOutInPasses.length}</div>
        </div>
        <div class="stat-icon">🚪</div>
      </div>
      <div class="stat-card">
        <div class="stat-info">
          <div class="stat-label">Room Stay Passes</div>
          <div class="stat-value">${sampleRoomStayPasses.length}</div>
        </div>
        <div class="stat-icon">🛏️</div>
      </div>
      <div class="stat-card">
        <div class="stat-info">
          <div class="stat-label">Open Grievances</div>
          <div class="stat-value">${sampleStudentGrievances.length}</div>
        </div>
        <div class="stat-icon">🔧</div>
      </div>
      <div class="stat-card">
        <div class="stat-info">
          <div class="stat-label">Verified Attendance</div>
          <div class="stat-value" style="color: ${attPct >= 75 ? '#34D399' : '#EF4444'};">${attPct}%</div>
        </div>
        <div class="stat-icon">📚</div>
      </div>
    </div>

    <!-- SECTION 1: DEDICATED OUT / IN CAMPUS LEAVE PASSES -->
    <div class="dashboard-section" id="sectionOutInPasses">
      <div class="section-header">
        <h3 class="section-title">🚪 OUT / IN Campus Leave Passes</h3>
        <button class="btn btn-primary" onclick="openApplyLeaveModal()">+ Apply OUT / IN Pass</button>
      </div>
      <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">
        Issued for leaving campus/hostel (Home visits, outings, hospital visits). Requires dual clearance from Deputy Warden & Class Tutor.
      </p>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 1.25rem;">
        ${sampleOutInPasses.length === 0 ? `<div style="color: var(--text-muted); font-size: 0.88rem;">No active OUT/IN passes.</div>` : sampleOutInPasses.map(pass => `
          <div class="pass-card">
            <div class="pass-header">
              <div>
                <span class="pass-type-tag outin">OUT / IN PASS</span>
                <div style="font-size: 0.82rem; color: var(--text-muted); margin-top: 0.4rem;">Code: <b>${pass.passCode}</b></div>
              </div>
              <span class="status-pill ${pass.finalStatus === 'APPROVED' ? 'approved' : 'pending'}">${pass.finalStatus}</span>
            </div>

            <div class="pass-body" style="margin-top: 1rem;">
              <div class="pass-details-list">
                <div class="pass-detail-item">
                  <span class="pass-detail-label">Destination:</span>
                  <span class="pass-detail-val">${pass.destination}</span>
                </div>
                <div class="pass-detail-item">
                  <span class="pass-detail-label">Reason:</span>
                  <span class="pass-detail-val">${pass.reason}</span>
                </div>
                <div class="pass-detail-item">
                  <span class="pass-detail-label">Valid Until:</span>
                  <span class="pass-detail-val">${pass.endDate}</span>
                </div>
                <div class="pass-detail-item">
                  <span class="pass-detail-label">Warden Clearance:</span>
                  <span style="color: ${pass.wardenApproval === 'APPROVED' ? '#34D399' : '#FBBF24'}; font-weight: 700;">
                    ${pass.wardenApproval === 'APPROVED' ? '✅ APPROVED' : '⏳ PENDING'}
                  </span>
                </div>
                <div class="pass-detail-item">
                  <span class="pass-detail-label">Tutor Clearance:</span>
                  <span style="color: ${pass.tutorApproval === 'APPROVED' ? '#34D399' : '#FBBF24'}; font-weight: 700;">
                    ${pass.tutorApproval === 'APPROVED' ? '✅ APPROVED' : '⏳ PENDING'}
                  </span>
                </div>
              </div>

              <div class="pass-qr-box">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#0F172A" stroke-width="2">
                  <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3h-3zM17 17h4v4h-4zM14 20h3v1h-3z"/>
                </svg>
                <div class="pass-qr-code">${pass.passCode}</div>
              </div>
            </div>
            ${pass.finalStatus === 'PENDING' || pass.finalStatus.includes('PARTIAL') ? `
              <div style="margin-top: 1rem; border-top: 1px solid var(--border-glass); padding-top: 0.75rem; text-align: right;">
                <button class="btn btn-danger" style="padding: 0.4rem 0.8rem; font-size: 0.78rem;" onclick="cancelOutInPass('${pass.id}')">Cancel Request</button>
              </div>
            ` : `
              <div style="margin-top: 1rem; border-top: 1px solid var(--border-glass); padding-top: 0.75rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
                <span style="font-size: 0.75rem; color: #FBBF24; font-weight: 600;">
                  ${pass.extensionStatus && pass.extensionStatus !== 'NONE' ? `⏱️ ${pass.extensionStatus}` : 'Active Departure Pass'}
                </span>
                <button class="btn btn-secondary" style="padding: 0.35rem 0.75rem; font-size: 0.78rem;" onclick="openExtendPassModal('${pass.id}', '${pass.endDate}')">
                  ⏱️ Extend Return Time
                </button>
              </div>
            `}
          </div>
        `).join('')}
      </div>
    </div>

    <!-- SECTION 2: DEDICATED ROOM STAY PASSES SECTION -->
    <div class="dashboard-section" id="sectionRoomStayPasses">
      <div class="section-header">
        <h3 class="section-title" style="color: #FBBF24;">🛏️ ROOM STAY PASS</h3>
        <button class="btn btn-warning" style="background: linear-gradient(135deg, #F59E0B, #D97706); color: #0F172A; font-weight: 800;" onclick="openApplyRoomStayModal()">+ Apply Room Stay Pass</button>
      </div>
      <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">
        Grants permission to stay inside assigned hostel room during college hours. Requires approval from both Deputy Warden & Class Tutor.
      </p>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 1.25rem;">
        ${sampleRoomStayPasses.length === 0 ? `<div style="color: var(--text-muted); font-size: 0.88rem;">No active room stay passes.</div>` : sampleRoomStayPasses.map(pass => `
          <div class="pass-card" style="border-color: rgba(245, 158, 11, 0.4);">
            <div class="pass-header">
              <div>
                <span class="pass-type-tag roomstay">ROOM STAY PASS</span>
                <div style="font-size: 0.82rem; color: var(--text-muted); margin-top: 0.4rem;">Pass ID: <b>${pass.passCode}</b></div>
              </div>
              <span class="status-pill ${pass.finalStatus === 'APPROVED' ? 'approved' : 'pending'}">${pass.finalStatus}</span>
            </div>

            <div class="pass-body" style="margin-top: 1rem;">
              <div class="pass-details-list">
                <div class="pass-detail-item">
                  <span class="pass-detail-label">Location:</span>
                  <span class="pass-detail-val" style="color: #FBBF24;">${pass.destination}</span>
                </div>
                <div class="pass-detail-item">
                  <span class="pass-detail-label">Reason / Notes:</span>
                  <span class="pass-detail-val">${pass.reason}</span>
                </div>
                <div class="pass-detail-item">
                  <span class="pass-detail-label">Stay Period:</span>
                  <span class="pass-detail-val">${pass.startDate} to ${pass.endDate}</span>
                </div>
                <div class="pass-detail-item">
                  <span class="pass-detail-label">Warden Clearance:</span>
                  <span style="color: ${pass.wardenApproval === 'APPROVED' ? '#34D399' : '#FBBF24'}; font-weight: 700;">
                    ${pass.wardenApproval === 'APPROVED' ? '✅ APPROVED' : '⏳ PENDING'}
                  </span>
                </div>
                <div class="pass-detail-item">
                  <span class="pass-detail-label">Tutor Clearance:</span>
                  <span style="color: ${pass.tutorApproval === 'APPROVED' ? '#34D399' : '#FBBF24'}; font-weight: 700;">
                    ${pass.tutorApproval === 'APPROVED' ? '✅ APPROVED' : '⏳ PENDING'}
                  </span>
                </div>
              </div>

              <div class="pass-qr-box" style="border: 2px solid #F59E0B;">
                <div style="font-size: 1.75rem;">🛏️</div>
                <div class="pass-qr-code" style="color: #D97706;">ROOM STAY</div>
              </div>
            </div>
            ${pass.finalStatus === 'PENDING' || pass.finalStatus.includes('PARTIAL') ? `
              <div style="margin-top: 1rem; border-top: 1px solid var(--border-glass); padding-top: 0.75rem; text-align: right;">
                <button class="btn btn-danger" style="padding: 0.4rem 0.8rem; font-size: 0.78rem;" onclick="cancelRoomStayPass('${pass.id}')">Cancel Request</button>
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Grievances Section -->
    <div class="dashboard-section">
      <div class="section-header">
        <h3 class="section-title">🔧 My Grievances & Complaints</h3>
        <button class="btn btn-secondary" onclick="openFileGrievanceModal()">+ File New Grievance</button>
      </div>

      <div class="ticket-grid">
        ${sampleStudentGrievances.map(ticket => `
          <div class="ticket-card">
            <div class="ticket-card-header">
              <div>
                <div class="ticket-title">${ticket.title}</div>
                <div class="ticket-meta">ID: ${ticket.id} • Category: <b>${ticket.category}</b> • Severity: <b style="color: #FBBF24;">${ticket.severity}</b></div>
              </div>
              <span class="status-pill ${ticket.status === 'RESOLVED' ? 'approved' : 'pending'}">${ticket.status}</span>
            </div>

            <div class="ticket-desc">${ticket.desc}</div>

            ${ticket.photoProof ? `
              <div>
                <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.3rem;">Problem Photo Proof:</div>
                <img src="${ticket.photoProof}" class="ticket-photo-thumb" title="Click to view problem proof">
              </div>
            ` : ''}

            ${ticket.solveProof ? `
              <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); padding: 0.75rem; border-radius: 8px;">
                <div style="font-size: 0.78rem; font-weight: 700; color: #34D399; margin-bottom: 0.3rem;">✅ Warden Solve Proof Photo:</div>
                <img src="${ticket.solveProof}" class="ticket-photo-thumb">
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Multi-Tier Role-Scoped Notice Board -->
    ${typeof renderNoticeBoardSection === 'function' ? renderNoticeBoardSection() : ''}
  `;
}

function triggerSOS() {
  const user = getCurrentUser() || {};
  const banner = document.getElementById('sosBannerContainer');
  const text = document.getElementById('sosBannerText');

  const fullName = user.fullName || 'Alex Rivers';
  const roomNumber = user.roomNumber || '304';
  const hostelBlock = user.hostelBlock || 'Block B';

  if (banner && text) {
    text.innerText = `Student ${fullName} (Room ${roomNumber}, ${hostelBlock}) triggered Medical Emergency SOS! Alert sent to Deputy Warden & Gate Security!`;
    banner.style.display = 'block';
    alert(`🚨 EMERGENCY SOS DISPATCHED!\n\nFlashing high-priority alarm dispatched to Deputy Warden (${hostelBlock}) and Master Security Gate Checkpoint.`);
  }
}

function cancelOutInPass(passId) {
  sampleOutInPasses = sampleOutInPasses.filter(p => p.id !== passId);
  renderStudentDashboard();
  alert('OUT/IN Pass request cancelled successfully.');
}

function cancelRoomStayPass(passId) {
  sampleRoomStayPasses = sampleRoomStayPasses.filter(p => p.id !== passId);
  renderStudentDashboard();
  alert('Room Stay Pass request cancelled successfully.');
}

// Window bindings
window.renderStudentDashboard = renderStudentDashboard;
window.triggerSOS = triggerSOS;
window.cancelOutInPass = cancelOutInPass;
window.cancelRoomStayPass = cancelRoomStayPass;
window.sampleOutInPasses = sampleOutInPasses;
window.sampleRoomStayPasses = sampleRoomStayPasses;
window.sampleStudentGrievances = sampleStudentGrievances;
