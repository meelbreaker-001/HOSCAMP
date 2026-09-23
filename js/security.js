/* ==========================================================================
   CampusConnect - Master Security Module (Gate Scanner & Violation Reporting)
   Adhiyamaan College of Engineering (ACE)
   ========================================================================== */

let sampleGateLogs = [
  { student: 'Alex Rivers', roll: '2026-CSE-104', passCode: 'PASS-2026-X89B', action: 'CHECK_OUT', checkpoint: 'Main Gate', time: '2026-09-21 09:15' },
  { student: 'Rohan Sharma', roll: '2026-CSE-045', passCode: 'PASS-2026-O771', action: 'CHECK_IN', checkpoint: 'Main Gate', time: '2026-09-20 19:15' }
];

let sampleSecurityViolations = [
  { id: 'VIOL-901', student: 'Alex Rivers', roll: '2026-CSE-104', room: '304', block: 'Block B', hostel: 'Pennar Hostel (Boys)', type: 'CURFEW_BREACH', checkpoint: 'Main Gate', severity: 'MEDIUM', desc: 'Reported late arrival at 21:45 PM (curfew 21:00 PM).', time: '2026-09-20 21:50', status: 'REVIEWED' },
  { id: 'VIOL-902', student: 'Karan Patel', roll: '2026-ECE-012', room: '115', block: 'Block B', hostel: 'Pennar Hostel (Boys)', type: 'NO_VALID_PASS', checkpoint: 'Hostel Gate 2', severity: 'HIGH', desc: 'Attempted to exit boundary fence near basketball court without approved gate pass.', time: '2026-09-21 16:20', status: 'PENDING_REVIEW' }
];

function renderSecurityDashboard() {
  const area = document.getElementById('dashboardRenderArea');
  if (!area) return;

  area.innerHTML = `
    <!-- Header Hero Banner -->
    <div style="background: linear-gradient(135deg, rgba(217, 119, 6, 0.2), rgba(120, 53, 15, 0.15)); border: 1px solid var(--border-glow); border-radius: var(--radius-lg); padding: 1.5rem 2rem; margin-bottom: 2rem;">
      <h2 style="font-size: 1.5rem; font-weight: 800;">Master Security Gate Portal 👮</h2>
      <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 0.25rem;">
        Unified Campus Security • Gate QR Verification, Real-Time Check-In/Out & Disciplinary Incident Routing
      </p>
    </div>

    <!-- Pass Scanner Panel -->
    <div class="scanner-card" id="sectionSecurityScanner">
      <h3 style="font-size: 1.25rem; font-weight: 700;">🔍 Pass Scanner & Verification Checkpoint</h3>
      <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.25rem;">Scan QR payload code or enter Pass Code (e.g. <code>PASS-2026-X89B</code>)</p>

      <div class="scanner-input-group">
        <input type="text" class="form-control" id="scanPassInput" placeholder="Enter Pass Code (e.g. PASS-2026-X89B)" style="font-family: monospace; font-size: 1rem; font-weight: 700;">
        <button class="btn btn-primary" onclick="searchPassForSecurity()">Scan / Verify Pass</button>
      </div>

      <div id="securityScanResultArea">
        <!-- Rendered dynamically -->
      </div>
    </div>

    <!-- Security Violation Incident Reporting Section -->
    <div class="dashboard-section" id="sectionSecurityViolations">
      <div class="section-header">
        <h3 class="section-title">🚨 File Disciplinary Security Violation Incident</h3>
        <button class="btn btn-danger" onclick="toggleSecurityViolationForm()">+ Report Violation</button>
      </div>
      <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">
        Incidents reported here are automatically mapped by student roll number to the <b>respected Deputy Warden</b> for disciplinary review and parent notification (retained in log for 30 days).
      </p>

      <div id="securityViolationFormBox" style="display: none; background: var(--surface-card); border: 1px solid var(--border-glass); border-radius: var(--radius-lg); padding: 1.5rem; margin-bottom: 1.5rem;">
        <h4 style="margin-bottom: 1rem;">New Security Incident Report</h4>
        <form onsubmit="handleSecurityViolationSubmit(event)">
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">Student Roll Number</label>
              <input type="text" class="form-control" id="violatorRoll" placeholder="e.g. 2026-CSE-104" required>
            </div>
            <div class="form-group">
              <label class="form-label">Student Name</label>
              <input type="text" class="form-control" id="violatorName" placeholder="e.g. Alex Rivers" required>
            </div>
          </div>

          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">Hostel Block & Room</label>
              <select class="form-control" id="violatorHostel" required>
                <option value="Pennar Hostel (Boys) - Block B">Pennar Hostel (Boys) - Block B (Warden: Prof. M. Arjunan)</option>
                <option value="Pennar Hostel (Boys) - Block A">Pennar Hostel (Boys) - Block A (Warden: Prof. M. Arjunan)</option>
                <option value="Bhavani Hostel (Girls) - Block A">Bhavani Hostel (Girls) - Block A (Warden: Prof. S. Aarthi)</option>
                <option value="Cauvery Scholar Hostel">Cauvery Scholar Hostel (Warden: Prof. M. Arjunan)</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Checkpoint Location</label>
              <select class="form-control" id="violatorCheckpoint" required>
                <option value="Main Gate">Main Gate</option>
                <option value="Hostel Gate 1">Hostel Gate 1</option>
                <option value="Hostel Gate 2">Hostel Gate 2</option>
                <option value="North Campus Boundary">North Campus Boundary</option>
              </select>
            </div>
          </div>

          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">Violation Type</label>
              <select class="form-control" id="violatorType" required>
                <option value="CURFEW_BREACH">Curfew Breach / Late Night Entry</option>
                <option value="NO_VALID_PASS">No Valid Pass / Unauthorized Exit</option>
                <option value="OVERDUE_RETURN">Overdue Return (> 3 Hours Overstay)</option>
                <option value="BOUNDARY_CLIMBING">Boundary Wall Trespassing</option>
                <option value="DISCIPLINARY">Disciplinary / Misbehavior with Guard</option>
                <option value="OTHER">Other Security Incident</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Severity Level</label>
              <select class="form-control" id="violatorSeverity" required>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High (Mandatory Warden Notice)</option>
                <option value="CRITICAL">Critical (Immediate Chief Warden / Principal Escalation)</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Incident Notes & Evidence Description</label>
            <textarea class="form-control" id="violatorDesc" rows="3" placeholder="Describe the incident details, student explanation, or belongings confiscated..." required></textarea>
          </div>

          <button type="submit" class="btn btn-danger" style="width: 100%;">
            🚨 Dispatch Security Incident to Respected Deputy Warden
          </button>
        </form>
      </div>

      <!-- Recent Security Violations Table -->
      <div class="table-responsive">
        <table class="custom-table">
          <thead>
            <tr>
              <th>Student Details</th>
              <th>Hostel & Checkpoint</th>
              <th>Violation Type</th>
              <th>Severity</th>
              <th>Incident Details</th>
              <th>Warden Review</th>
            </tr>
          </thead>
          <tbody>
            ${sampleSecurityViolations.map(v => `
              <tr>
                <td>
                  <b>${v.student}</b><br>
                  <span style="font-size: 0.78rem; color: var(--text-muted);">${v.roll} • Room ${v.room || '304'}</span>
                </td>
                <td>
                  <b>${v.hostel || 'Pennar Hostel'}</b><br>
                  <span style="font-size: 0.78rem; color: var(--text-muted);">${v.checkpoint} • ${v.time}</span>
                </td>
                <td><span class="status-pill rejected">${v.type}</span></td>
                <td><b style="color: #F87171;">${v.severity}</b></td>
                <td>${v.desc}</td>
                <td>
                  <span class="status-pill ${v.status === 'REVIEWED' ? 'approved' : 'pending'}">
                    ${v.status === 'REVIEWED' ? '✅ Reviewed by Warden' : '⏳ Routed to Warden'}
                  </span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Gate Entry & Exit Logs Section -->
    <div class="dashboard-section" id="sectionSecurityLogs">
      <div class="section-header">
        <h3 class="section-title">📋 Live Gate Entry / Exit Registry</h3>
      </div>

      <div class="table-responsive">
        <table class="custom-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Roll Number</th>
              <th>Pass Code</th>
              <th>Action</th>
              <th>Checkpoint</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            ${sampleGateLogs.map(g => `
              <tr>
                <td><b>${g.student}</b></td>
                <td><code>${g.roll}</code></td>
                <td><b style="color: #38BDF8;">${g.passCode}</b></td>
                <td>
                  <span class="status-pill ${g.action === 'CHECK_OUT' ? 'rejected' : 'approved'}">
                    ${g.action === 'CHECK_OUT' ? '🛫 CHECKED OUT' : '🛬 CHECKED IN'}
                  </span>
                </td>
                <td>${g.checkpoint}</td>
                <td>${g.time}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function searchPassForSecurity() {
  const code = (document.getElementById('scanPassInput').value || '').trim().toUpperCase();
  const area = document.getElementById('securityScanResultArea');
  if (!code || !area) return;

  // Search in Warden Issued list or Student active passes
  let foundPass = null;
  if (window.sampleWardenIssuedOutInPasses) {
    foundPass = window.sampleWardenIssuedOutInPasses.find(p => 
      (p.passCode && p.passCode.toUpperCase() === code) || 
      (p.id && p.id.toUpperCase() === code) ||
      (p.rollNumber && p.rollNumber.toUpperCase() === code)
    );
  }

  if (!foundPass && window.sampleOutInPasses) {
    foundPass = window.sampleOutInPasses.find(p => 
      (p.passCode && p.passCode.toUpperCase() === code) || 
      (p.id && p.id.toUpperCase() === code)
    );
  }

  // Also check default fallback for demo code
  if (!foundPass && (code.includes('X89B') || code.includes('PASS-2026-X89B'))) {
    foundPass = {
      passCode: 'PASS-2026-X89B',
      studentName: 'Alex Rivers',
      rollNumber: '2026-CSE-104',
      block: 'Block B',
      room: '304',
      destination: 'Apollo Specialty Hospital, Hosur',
      startDate: '2026-09-21 09:00',
      endDate: '2026-09-21 18:00',
      parentContact: '+91 9876543210',
      wardenApproval: 'APPROVED'
    };
  }

  if (foundPass) {
    const isApproved = (foundPass.wardenApproval === 'APPROVED' || foundPass.finalStatus === 'APPROVED' || foundPass.hostelStatus === 'APPROVED_BY_WARDEN');

    if (isApproved) {
      area.innerHTML = `
        <div style="background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); border-radius: var(--radius-md); padding: 1.25rem; margin-top: 1.25rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
            <span class="status-pill approved" style="font-size: 0.85rem;">✅ VALID OFFICIAL LEAVE PASS</span>
            <span style="font-size: 0.85rem; color: var(--text-muted);">Pass Code: <b>${foundPass.passCode || foundPass.id}</b></span>
          </div>
          <div class="form-grid-2" style="font-size: 0.88rem; line-height: 1.8;">
            <div>
              <b>Student:</b> ${foundPass.studentName || 'Student'} (<code>${foundPass.rollNumber || ''}</code>)<br>
              <b>Hostel:</b> ${foundPass.hostel || 'Pennar Hostel'}, ${foundPass.block || 'Block B'}, Room ${foundPass.room || '304'}<br>
              <b>Destination:</b> ${foundPass.destination || 'Off-Campus'}
            </div>
            <div>
              <b>Departure Date:</b> ${foundPass.startDate || 'Today'}<br>
              <b>Expected Return:</b> <b style="color: #FBBF24;">${foundPass.endDate || 'Today'}</b><br>
              <b>Emergency Parent Contact:</b> ${foundPass.parentContact || '+91 9876543210'}
            </div>
          </div>
          <div style="margin-top: 1rem; display: flex; gap: 0.75rem; flex-wrap: wrap;">
            <button class="btn btn-danger" onclick="recordGateAction('${foundPass.studentName}', '${foundPass.rollNumber}', '${foundPass.passCode || foundPass.id}', 'CHECK_OUT', '${foundPass.endDate}')">
              🛫 Confirm Gate Check-Out (Exit Campus)
            </button>
            <button class="btn btn-success" onclick="recordGateAction('${foundPass.studentName}', '${foundPass.rollNumber}', '${foundPass.passCode || foundPass.id}', 'CHECK_IN', '${foundPass.endDate}')">
              🛬 Confirm Gate Check-In (Return to Campus)
            </button>
          </div>
        </div>
      `;
    } else {
      area.innerHTML = `
        <div style="background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.4); border-radius: var(--radius-md); padding: 1.25rem; margin-top: 1.25rem;">
          <span class="status-pill pending" style="color: #FBBF24;">⚠️ PASS FOUND BUT PENDING APPROVAL</span>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.5rem;">
            Pass <code>${code}</code> for ${foundPass.studentName} is awaiting Deputy Warden or Class Tutor clearance. Do not allow student exit until fully approved.
          </p>
        </div>
      `;
    }
  } else {
    area.innerHTML = `
      <div style="background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.4); border-radius: var(--radius-md); padding: 1.25rem; margin-top: 1.25rem;">
        <span class="status-pill rejected">❌ INVALID OR UNAPPROVED PASS CODE</span>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.5rem;">
          No active leave pass found matching code <code>${code}</code>. Student exit is strictly prohibited without official gate clearance.
        </p>
      </div>
    `;
  }
}

function recordGateAction(student, roll, passCode, action, endDate) {
  const time = new Date().toISOString().replace('T', ' ').slice(0, 16);
  sampleGateLogs.unshift({
    student,
    roll,
    passCode,
    action,
    checkpoint: 'Main Gate Checkpoint',
    time
  });

  // If in issued list, update status
  if (window.sampleWardenIssuedOutInPasses) {
    const p = window.sampleWardenIssuedOutInPasses.find(item => item.passCode === passCode || item.id === passCode);
    if (p) {
      p.gateStatus = action === 'CHECK_OUT' ? 'CHECKED_OUT (Off-Campus)' : 'RETURNED_IN_HOSTEL';
    }
  }

  // Automatic Overdue Return Check on Check-In
  let isLate = false;
  if (action === 'CHECK_IN' && endDate) {
    try {
      const returnTime = new Date(endDate.replace(' ', 'T'));
      const now = new Date();
      if (now > returnTime) {
        isLate = true;
        const autoViolId = `VIOL-${Date.now().toString().slice(-4)}`;
        const autoIncident = {
          id: autoViolId,
          student: student,
          roll: roll,
          room: '304',
          block: 'Block B',
          hostel: 'Pennar Hostel (Boys)',
          type: 'OVERDUE_RETURN',
          checkpoint: 'Main Gate Checkpoint',
          severity: 'HIGH',
          desc: `Automated gate scan: Student returned past scheduled validity (${endDate}). Logged at ${time}.`,
          time: time,
          status: 'PENDING_REVIEW',
          wardenResponse: null,
          retentionNotice: '30-Day Disciplinary Log (Auto-Flagged by Gate Scanner)'
        };

        sampleSecurityViolations.unshift(autoIncident);
        if (window.sampleWardenSecurityViolations) {
          window.sampleWardenSecurityViolations.unshift(autoIncident);
        }
      }
    } catch (e) {
      console.warn('Date comparison note:', e);
    }
  }

  renderSecurityDashboard();

  if (isLate) {
    alert(`⚠️ LATE RETURN DETECTED!\n\nStudent: ${student} (${roll})\nAction: RETURN CHECK-IN\n\n🚨 Curfew Violation automatically dispatched to Deputy Warden for 30-day disciplinary review.`);
  } else {
    alert(`✅ GATE SCAN RECORDED!\n\nStudent: ${student}\nAction: ${action}\nTime: ${time}`);
  }
}

function toggleSecurityViolationForm() {
  const box = document.getElementById('securityViolationFormBox');
  if (box) {
    box.style.display = box.style.display === 'none' ? 'block' : 'none';
  }
}

function handleSecurityViolationSubmit(e) {
  e.preventDefault();
  const roll = document.getElementById('violatorRoll').value.trim();
  const name = document.getElementById('violatorName').value.trim();
  const hostel = document.getElementById('violatorHostel').value;
  const checkpoint = document.getElementById('violatorCheckpoint').value;
  const type = document.getElementById('violatorType').value;
  const severity = document.getElementById('violatorSeverity').value;
  const desc = document.getElementById('violatorDesc').value.trim();
  const time = new Date().toISOString().replace('T', ' ').slice(0, 16);
  const violId = `VIOL-${Math.floor(1000 + Math.random() * 9000)}`;

  const newViol = {
    id: violId,
    student: name,
    roll: roll,
    room: '304',
    block: hostel.includes('Block B') ? 'Block B' : 'Block A',
    hostel: hostel,
    type: type,
    checkpoint: checkpoint,
    severity: severity,
    desc: desc,
    time: time,
    status: 'PENDING_REVIEW',
    wardenResponse: null,
    reviewedBy: null,
    reviewedAt: null,
    retentionNotice: '30-Day Active Log (Dispatched to Warden)'
  };

  sampleSecurityViolations.unshift(newViol);

  // Automatically route to Deputy Warden's queue
  if (window.sampleWardenSecurityViolations) {
    window.sampleWardenSecurityViolations.unshift(newViol);
  }

  toggleSecurityViolationForm();
  renderSecurityDashboard();
  alert(`🚨 SECURITY VIOLATION REPORTED!\n\nIncident filed for ${name} (${roll}) and dispatched to ${hostel} Deputy Warden.\n\n30-Day Disciplinary Log active.`);
}

window.renderSecurityDashboard = renderSecurityDashboard;
window.searchPassForSecurity = searchPassForSecurity;
window.recordGateAction = recordGateAction;
window.toggleSecurityViolationForm = toggleSecurityViolationForm;
window.handleSecurityViolationSubmit = handleSecurityViolationSubmit;
