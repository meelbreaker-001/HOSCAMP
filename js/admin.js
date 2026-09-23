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

    <!-- SECTION 1B: DEPUTY WARDEN APPOINTMENTS & ALLOCATIONS -->
    <div class="dashboard-section" id="sectionAdminWardens">
      <div class="section-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
        <div>
          <h3 class="section-title">🛡️ Deputy Warden Allocations & Administration (Chief Warden Authority)</h3>
          <p style="font-size: 0.82rem; color: var(--text-muted); margin-top: 0.2rem;">
            The Chief Warden appoints, reassigns, and oversees Deputy Wardens across each residential hostel block.
          </p>
        </div>
        <button class="btn btn-primary" style="padding: 0.45rem 0.9rem; font-size: 0.82rem;" onclick="openAddWardenModal()">
          + Appoint Deputy Warden
        </button>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.25rem;">
        ${(window.deputyWardenAllocations || []).map(w => `
          <div class="stat-card" style="display: block; border-color: rgba(16, 185, 129, 0.35);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
              <div>
                <b style="font-size: 1.1rem; color: var(--text-main);">${w.wardenName}</b>
                <div style="font-size: 0.85rem; color: #34D399; margin-top: 0.2rem;">${w.hostelName} • <b>${w.hostelBlock}</b></div>
                <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.15rem;">Login: <code>${w.wardenId}</code> | Tel: <b>${w.phone || '-'}</b></div>
              </div>
              <span class="status-pill approved">${w.residentsCount || 'Active'} Residents</span>
            </div>
            <div style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.7; margin-top: 0.75rem; border-top: 1px solid var(--border-glass); padding-top: 0.5rem;">
              • Authority: <b>First/Second Pass Clearance & Night Curfew Enforcement</b><br>
              • Disciplinary Log: <b>30-Day Gate Security Incident Review Active</b>
            </div>
            <div style="margin-top: 0.75rem; border-top: 1px solid var(--border-glass); padding-top: 0.6rem; display: flex; justify-content: flex-end; gap: 0.5rem;">
              <button class="btn btn-secondary" style="padding: 0.3rem 0.65rem; font-size: 0.78rem;" onclick="openEditWardenModal('${w.wardenId}')">✏️ Edit / Reassign</button>
              <button class="btn btn-danger" style="padding: 0.3rem 0.65rem; font-size: 0.78rem;" onclick="deleteDeputyWardenAllocation('${w.wardenId}')">🗑️ Relieve</button>
            </div>
          </div>
        `).join('')}
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
  const name = document.getElementById('officialName').value.trim();
  const username = document.getElementById('officialUsername').value.trim();
  const pass = document.getElementById('officialPassword').value.trim();

  if (!name || !username || !pass) {
    alert('Please fill out all required fields.');
    return;
  }

  if (!window.SYSTEM_ACCOUNTS) window.SYSTEM_ACCOUNTS = {};

  const newAccount = {
    id: Date.now(),
    username: username,
    password: pass,
    fullName: name,
    role: role
  };

  if (role === 'WARDEN') {
    const hostel = document.getElementById('officialHostelName').value;
    const block = document.getElementById('officialHostelBlock').value || 'Block B';
    newAccount.hostelName = hostel;
    newAccount.hostelBlock = block;
    newAccount.assignedHostel = hostel;

    if (!window.deputyWardenAllocations) window.deputyWardenAllocations = [];
    window.deputyWardenAllocations.push({
      wardenId: username,
      wardenName: name,
      hostelName: hostel,
      hostelBlock: block,
      phone: '+91 94421 88200',
      residentsCount: 150
    });
  } else if (role === 'HOD') {
    newAccount.department = 'Computer Science & Engineering';
  } else if (role === 'SECURITY') {
    newAccount.checkpoint = 'Main Gate Checkpoint';
  }

  window.SYSTEM_ACCOUNTS[username] = newAccount;

  if (window.saveAppState) window.saveAppState();
  if (typeof window.syncProfileToCloud === 'function') window.syncProfileToCloud(newAccount);

  toggleCreateOfficialForm();
  renderAdminDashboard();
  alert(`✅ OFFICIAL ACCOUNT REGISTERED!\n\nRole: ${role}\nName: ${name}\nUsername: ${username}\nCredentials saved to system database and ready for instant login.`);
}

// ==========================================================================
// Chief Warden Deputy Warden Management Handlers
// ==========================================================================
function openAddWardenModal() {
  const modal = document.getElementById('manageWardenModal');
  if (!modal) return;
  document.getElementById('manageWardenModalTitle').innerText = '🛡️ Appoint Deputy Warden (Chief Warden Authority)';
  document.getElementById('wardenEditId').value = '';
  document.getElementById('wardenHostelInput').value = 'Pennar Hostel (Boys)';
  document.getElementById('wardenBlockInput').value = '';
  document.getElementById('wardenNameInput').value = '';
  document.getElementById('wardenPhoneInput').value = '+91 ';
  document.getElementById('wardenUsernameInput').value = '';
  document.getElementById('wardenPasswordInput').value = 'pass123';
  modal.classList.add('active');
}

function openEditWardenModal(wardenId) {
  const modal = document.getElementById('manageWardenModal');
  if (!modal) return;
  const wardens = window.deputyWardenAllocations || [];
  const w = wardens.find(item => item.wardenId === wardenId);
  if (!w) return;
  document.getElementById('manageWardenModalTitle').innerText = '✏️ Edit / Reassign Deputy Warden';
  document.getElementById('wardenEditId').value = w.wardenId;
  document.getElementById('wardenHostelInput').value = w.hostelName || 'Pennar Hostel (Boys)';
  document.getElementById('wardenBlockInput').value = w.hostelBlock || '';
  document.getElementById('wardenNameInput').value = w.wardenName || '';
  document.getElementById('wardenPhoneInput').value = w.phone || '';
  document.getElementById('wardenUsernameInput').value = w.wardenId || '';
  document.getElementById('wardenPasswordInput').value = 'pass123';
  modal.classList.add('active');
}

function closeWardenModal() {
  const modal = document.getElementById('manageWardenModal');
  if (modal) modal.classList.remove('active');
}

function handleSaveDeputyWardenSubmit(e) {
  e.preventDefault();
  const editId = document.getElementById('wardenEditId').value;
  const hostel = document.getElementById('wardenHostelInput').value;
  const block = document.getElementById('wardenBlockInput').value.trim();
  const name = document.getElementById('wardenNameInput').value.trim();
  const phone = document.getElementById('wardenPhoneInput').value.trim();
  const username = document.getElementById('wardenUsernameInput').value.trim();
  const password = document.getElementById('wardenPasswordInput').value.trim();

  if (!hostel || !block || !name || !username) {
    alert('Please fill out all required fields.');
    return;
  }

  if (!window.deputyWardenAllocations) window.deputyWardenAllocations = [];
  if (!window.SYSTEM_ACCOUNTS) window.SYSTEM_ACCOUNTS = {};

  if (editId) {
    const idx = window.deputyWardenAllocations.findIndex(item => item.wardenId === editId);
    if (idx !== -1) {
      window.deputyWardenAllocations[idx].hostelName = hostel;
      window.deputyWardenAllocations[idx].hostelBlock = block;
      window.deputyWardenAllocations[idx].wardenName = name;
      window.deputyWardenAllocations[idx].phone = phone;
    }
  } else {
    const existing = window.deputyWardenAllocations.find(item => item.wardenId === username);
    if (existing) {
      alert(`⚠️ A warden with username "${username}" already exists!`);
      return;
    }
    window.deputyWardenAllocations.push({
      wardenId: username,
      wardenName: name,
      hostelName: hostel,
      hostelBlock: block,
      phone: phone,
      residentsCount: 150
    });
  }

  // Register in SYSTEM_ACCOUNTS
  const wardenAccount = {
    id: Date.now(),
    username: username,
    password: password,
    fullName: `${name} (Deputy Warden)`,
    role: 'WARDEN',
    hostelName: hostel,
    hostelBlock: block,
    assignedHostel: hostel
  };
  window.SYSTEM_ACCOUNTS[username] = wardenAccount;

  if (window.saveAppState) window.saveAppState();
  if (typeof window.syncProfileToCloud === 'function') window.syncProfileToCloud(wardenAccount);

  closeWardenModal();
  renderAdminDashboard();
  alert(`✅ DEPUTY WARDEN APPOINTMENT SAVED!\n\nWarden: ${name}\nJurisdiction: ${hostel} (${block})\nUsername: ${username}\nCredentials saved and ready for instant login.`);
}

function deleteDeputyWardenAllocation(wardenId) {
  if (!confirm(`⚠️ Are you sure you want to relieve Deputy Warden "${wardenId}"?\n\nThis will remove their active jurisdiction allocation.`)) {
    return;
  }
  if (!window.deputyWardenAllocations) window.deputyWardenAllocations = [];
  window.deputyWardenAllocations = window.deputyWardenAllocations.filter(w => w.wardenId !== wardenId);

  if (window.saveAppState) window.saveAppState();
  if (typeof window.deleteProfileFromCloud === 'function') window.deleteProfileFromCloud(wardenId);

  renderAdminDashboard();
  alert(`🗑️ DEPUTY WARDEN RELIEVED!\n\nWarden ${wardenId} has been successfully relieved of duty.`);
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
window.openAddWardenModal = openAddWardenModal;
window.openEditWardenModal = openEditWardenModal;
window.closeWardenModal = closeWardenModal;
window.handleSaveDeputyWardenSubmit = handleSaveDeputyWardenSubmit;
window.deleteDeputyWardenAllocation = deleteDeputyWardenAllocation;
window.adminSignOffComplaint = adminSignOffComplaint;
