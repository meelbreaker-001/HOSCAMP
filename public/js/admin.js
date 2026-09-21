/* ==========================================================================
   CampusConnect - Supreme Admin Module (Chief Warden / Principal)
   Adhiyamaan College of Engineering (ACE)
   ========================================================================== */

let sampleAdminDeletionRequests = [
  {
    id: 'DEL-109',
    studentName: 'Rohan Sharma',
    rollNumber: '2026-CSE-045',
    block: 'Pennar Block B',
    room: '208',
    requestedBy: 'Prof. M. Arjunan (Deputy Warden)',
    reason: 'Student completed semester and moved off-campus',
    status: 'PENDING'
  }
];

let sampleHighSeverityComplaints = [
  {
    id: 'COMP-701',
    studentName: 'Alex Rivers',
    category: 'ELECTRICAL',
    severity: 'HIGH',
    title: 'Main power breaker burnout in Pennar Hostel Block B 3rd Floor',
    desc: 'Power socket sparked and tripped main corridor breaker. Electrician replaced fuse.',
    photoProof: null,
    solveProof: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%2310B981" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>',
    status: 'IN_PROGRESS'
  }
];

function renderAdminDashboard() {
  const area = document.getElementById('dashboardRenderArea');
  if (!area) return;

  const user = getCurrentUser();
  const auditLogs = window.sampleWardenAuditLogs || [];

  area.innerHTML = `
    <!-- Header Hero Banner -->
    <div style="background: linear-gradient(135deg, rgba(124, 58, 237, 0.25), rgba(76, 29, 149, 0.2)); border: 1px solid var(--border-glow); border-radius: var(--radius-lg); padding: 1.5rem 2rem; margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
      <div>
        <h2 style="font-size: 1.5rem; font-weight: 800;">Supreme Governance Portal 👑</h2>
        <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 0.25rem;">
          Authority: <b>${user.fullName}</b> • Jurisdiction: <b>All Campus Hostels (Pennar, Bhavani, Cauvery)</b>
        </p>
      </div>
      <div style="display: flex; gap: 0.75rem;">
        <button class="btn btn-secondary" onclick="extractAuditLogCSV()">
          📥 Export Audit Log (CSV)
        </button>
        <button class="btn btn-primary" onclick="toggleCreateOfficialForm()">
          + Create Official Account
        </button>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid-stats">
      <div class="stat-card">
        <div class="stat-info">
          <div class="stat-label">Total Campus Residents</div>
          <div class="stat-value">640</div>
        </div>
        <div class="stat-icon">🎓</div>
      </div>
      <div class="stat-card">
        <div class="stat-info">
          <div class="stat-label">Warden Audit Log Events</div>
          <div class="stat-value">${auditLogs.length} Actions</div>
        </div>
        <div class="stat-icon">📋</div>
      </div>
      <div class="stat-card">
        <div class="stat-info">
          <div class="stat-label">High-Severity Complaints</div>
          <div class="stat-value">${sampleHighSeverityComplaints.length}</div>
        </div>
        <div class="stat-icon">🚨</div>
      </div>
      <div class="stat-card">
        <div class="stat-info">
          <div class="stat-label">Central Hostels Under CW</div>
          <div class="stat-value">3 Hostels</div>
        </div>
        <div class="stat-icon">🏛️</div>
      </div>
    </div>

    <!-- SECTION 1: CENTRAL CHIEF WARDEN ALL HOSTELS OVERVIEW -->
    <div class="dashboard-section" id="sectionAdminHostels">
      <div class="section-header">
        <h3 class="section-title">🏛️ All Campus Hostels Central Overview (Chief Warden Jurisdiction)</h3>
      </div>
      <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.25rem;">
        The Chief Warden serves as the central administrative head for all residential student hostels across the ACE campus.
      </p>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.25rem;">
        <div class="stat-card" style="display: block; border-color: rgba(59, 130, 246, 0.4);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <b style="font-size: 1.05rem; color: #60A5FA;">🏛️ Pennar Hostel (Boys)</b>
            <span class="status-pill approved">420 Residents</span>
          </div>
          <div style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.8;">
            • Blocks: <b>Block A, Block B</b><br>
            • Deputy Warden: <b>Prof. M. Arjunan</b><br>
            • Medical Attendant: 24/7 Boys Dispensary
          </div>
        </div>

        <div class="stat-card" style="display: block; border-color: rgba(236, 72, 153, 0.4);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <b style="font-size: 1.05rem; color: #F472B6;">🏛️ Bhavani Hostel (Girls)</b>
            <span class="status-pill approved">180 Residents</span>
          </div>
          <div style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.8;">
            • Blocks: <b>Block A</b> (Secure Perimeter)<br>
            • Deputy Warden: <b>Prof. S. Aarthi</b><br>
            • Medical Attendant: Resident Nurse & Ambulance Access
          </div>
        </div>

        <div class="stat-card" style="display: block; border-color: rgba(245, 158, 11, 0.4);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <b style="font-size: 1.05rem; color: #FBBF24;">🏛️ Cauvery Scholar Hostel</b>
            <span class="status-pill approved">40 Residents</span>
          </div>
          <div style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.8;">
            • Focus: Postgrad & Senior Research Scholars<br>
            • Deputy Warden: <b>Prof. M. Arjunan</b><br>
            • High-Speed Academic LAN & Silent Study Halls
          </div>
        </div>
      </div>
    </div>

    <!-- SECTION 2: DEPUTY WARDEN AUDIT TRAIL & CSV EXTRACTION -->
    <div class="dashboard-section" id="sectionAdminAudit">
      <div class="section-header">
        <h3 class="section-title">📋 Deputy Warden Audit Trail & Activity Logs</h3>
        <button class="btn btn-secondary" onclick="extractAuditLogCSV()">
          📥 Export Audit Log (CSV)
        </button>
      </div>
      <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.25rem;">
        Every operational action performed by Deputy Wardens (first-approvals, validity extension approvals, grievance solve photos, student account creation, security incident reviews) is recorded with full auditability.
      </p>

      <div class="table-responsive">
        <table class="custom-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Warden Name</th>
              <th>Action Type</th>
              <th>Target ID / Roll</th>
              <th>Action Description</th>
              <th>Outcome</th>
            </tr>
          </thead>
          <tbody>
            ${auditLogs.map(l => `
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

    <!-- Create Official Form Box -->
    <div id="createOfficialFormBox" style="display: none; background: var(--surface-card); border: 1px solid var(--border-glass); border-radius: var(--radius-lg); padding: 1.5rem; margin-bottom: 2rem;">
      <h3 style="margin-bottom: 1rem;">Create Official Account (HoD / Deputy Warden / Security)</h3>
      <form onsubmit="handleCreateOfficialSubmit(event)">
        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label">Role Type</label>
            <select class="form-control" id="officialRole" required onchange="handleOfficialRoleChange(this.value)">
              <option value="HOD">Department HoD</option>
              <option value="WARDEN">Deputy Warden (Requires Hostel Assignment)</option>
              <option value="SECURITY">Master Security Login</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Full Name</label>
            <input type="text" class="form-control" id="officialName" placeholder="e.g. Dr. K. Suresh" required>
          </div>
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label">Username</label>
            <input type="text" class="form-control" id="officialUsername" placeholder="e.g. hod_cse" required>
          </div>
          <div class="form-group">
            <label class="form-label">Initial Password</label>
            <input type="password" class="form-control" id="officialPassword" placeholder="Set temporary password" required>
          </div>
        </div>

        <div id="wardenExtraFields" style="display: none;" class="form-grid-2">
          <div class="form-group">
            <label class="form-label">Assigned Hostel</label>
            <select class="form-control" id="officialHostelName">
              <option value="Pennar Hostel (Boys)">Pennar Hostel (Boys)</option>
              <option value="Bhavani Hostel (Girls)">Bhavani Hostel (Girls)</option>
              <option value="Cauvery Scholar Hostel">Cauvery Scholar Hostel</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Block ID</label>
            <input type="text" class="form-control" id="officialHostelBlock" placeholder="e.g. Block B">
          </div>
        </div>

        <button type="submit" class="btn btn-primary">Create & Register Official Role</button>
      </form>
    </div>

    <!-- SECTION 3: HIGH SEVERITY COMPLAINTS -->
    <div class="dashboard-section" id="sectionAdminComplaints">
      <div class="section-header">
        <h3 class="section-title">🚨 High-Severity Complaints Requiring Supreme Admin Closure</h3>
      </div>
      <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.25rem;">
        Statutory requirement: High and critical severity infrastructure tickets cannot be fully closed until inspected and signed off by the Principal / Chief Warden.
      </p>

      <div class="ticket-grid">
        ${sampleHighSeverityComplaints.map(t => `
          <div class="ticket-card" style="border-color: rgba(239, 68, 68, 0.4);">
            <div class="ticket-card-header">
              <div>
                <div class="ticket-title">${t.title}</div>
                <div class="ticket-meta">
                  Category: <b>${t.category}</b> • Severity: <b style="color: #F87171;">${t.severity}</b> • Resident: <b>${t.studentName}</b>
                </div>
              </div>
              <span class="status-pill pending">AWAITING ADMIN CLOSURE</span>
            </div>
            <div class="ticket-desc">${t.desc}</div>

            <div style="margin-top: 1rem; border-top: 1px solid var(--border-glass); padding-top: 0.75rem; display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.8rem; color: #34D399;">✓ Deputy Warden Uploaded Solve Proof</span>
              <button class="btn btn-success" style="padding: 0.45rem 0.9rem; font-size: 0.8rem;" onclick="adminSignOffComplaint('${t.id}')">
                👑 Principal Sign-off & Close
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Multi-Tier Role-Scoped Notice Board -->
    ${typeof renderNoticeBoardSection === 'function' ? renderNoticeBoardSection() : ''}
  `;
}

// Export Warden Audit Log to CSV
function extractAuditLogCSV() {
  const auditLogs = window.sampleWardenAuditLogs || [];
  if (auditLogs.length === 0) {
    alert('No audit log entries available to export.');
    return;
  }

  const headers = ['Timestamp', 'Warden Name', 'Action Type', 'Target Reference', 'Student Roll', 'Details', 'Outcome'];
  const rows = auditLogs.map(l => [
    `"${l.timestamp || ''}"`,
    `"${l.wardenName || 'Prof. M. Arjunan'}"`,
    `"${l.action || ''}"`,
    `"${l.targetId || '-'}"`,
    `"${l.studentRoll || '-'}"`,
    `"${(l.details || '').replace(/"/g, '""')}"`,
    `"${l.outcome || 'SUCCESS'}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `ace_warden_audit_trail_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  alert(`📥 AUDIT LOG EXPORTED!\n\nDownloaded CSV file with ${auditLogs.length} Deputy Warden action records.`);
}

function toggleCreateOfficialForm() {
  const box = document.getElementById('createOfficialFormBox');
  if (box) {
    box.style.display = box.style.display === 'none' ? 'block' : 'none';
  }
}

function handleOfficialRoleChange(role) {
  const extra = document.getElementById('wardenExtraFields');
  if (extra) {
    extra.style.display = role === 'WARDEN' ? 'grid' : 'none';
  }
}

function handleCreateOfficialSubmit(e) {
  e.preventDefault();
  const role = document.getElementById('officialRole').value;
  const name = document.getElementById('officialName').value;
  const username = document.getElementById('officialUsername').value;
  const pass = document.getElementById('officialPassword').value;

  toggleCreateOfficialForm();
  alert(`✅ OFFICIAL ACCOUNT CREATED!\n\nRole: ${role}\nName: ${name}\nUsername: ${username}\nCredentials saved to system database.`);
}

function adminSignOffComplaint(ticketId) {
  sampleHighSeverityComplaints = sampleHighSeverityComplaints.filter(t => t.id !== ticketId);
  renderAdminDashboard();
  alert(`👑 SUPREME ADMIN SIGN-OFF COMPLETE!\n\nTicket ${ticketId} has received official sign-off and is permanently archived.`);
}

window.renderAdminDashboard = renderAdminDashboard;
window.extractAuditLogCSV = extractAuditLogCSV;
window.toggleCreateOfficialForm = toggleCreateOfficialForm;
window.handleOfficialRoleChange = handleOfficialRoleChange;
window.handleCreateOfficialSubmit = handleCreateOfficialSubmit;
window.adminSignOffComplaint = adminSignOffComplaint;
