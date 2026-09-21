/* ==========================================================================
   CampusConnect - Multi-Tier Role-Scoped Notice Board Module
   Adhiyamaan College of Engineering (ACE)
   ========================================================================== */

let sampleSystemNotices = [
  {
    id: 'NOTICE-HOD-101',
    scope: 'DEPT_CSE',
    targetDept: 'Computer Science & Engineering',
    authorRole: 'HOD',
    authorName: 'Dr. K. Suresh (HoD CSE)',
    title: 'Model Practical Examinations & Lab Special Clearance for Hostellers',
    body: 'All II, III, and IV year CSE hostel students must attend the mandatory pre-semester practical verification from 24th Sep to 27th Sep. Class Tutors will verify continuous lab internal attendance before approving weekend passes.',
    timestamp: '2026-09-21 11:30',
    priority: 'HIGH',
    badgeText: '🎓 CSE Dept Circular'
  },
  {
    id: 'NOTICE-HOD-102',
    scope: 'DEPT_CSE',
    targetDept: 'Computer Science & Engineering',
    authorRole: 'HOD',
    authorName: 'Dr. K. Suresh (HoD CSE)',
    title: 'National AI/ML Hackathon Attendance Concession',
    body: 'Hostel students participating in the upcoming State Hackathon at Anna University are granted special academic attendance waiver. Tutors are advised to clear room stay & out-station leave passes upon presentation of event entry ticket.',
    timestamp: '2026-09-20 16:45',
    priority: 'MEDIUM',
    badgeText: '🎓 CSE Dept Circular'
  },
  {
    id: 'NOTICE-WARDEN-201',
    scope: 'HOSTEL_PENNAR',
    targetHostel: 'Pennar Hostel (Boys)',
    authorRole: 'WARDEN',
    authorName: 'Prof. M. Arjunan (Deputy Warden)',
    title: 'Water Supply Maintenance & Study Hour Curfew Timing',
    body: 'Routine overhead tank cleaning in Pennar Hostel Block B will occur on Wednesday from 10:00 AM to 1:00 PM. Evening study hours will commence strictly from 8:30 PM. All students must remain in designated rooms during study periods.',
    timestamp: '2026-09-21 08:15',
    priority: 'HIGH',
    badgeText: '🛡️ Pennar Hostel Bulletin'
  },
  {
    id: 'NOTICE-ADMIN-301',
    scope: 'CAMPUS_ALL',
    targetDept: 'ALL',
    authorRole: 'ADMIN',
    authorName: 'Dr. G. Ranganath (Principal) & Chief Warden',
    title: 'AICTE Statutory Anti-Ragging Affidavit Submission Deadline',
    body: 'All 1st year to 4th year residential students across Pennar, Bhavani, and Cauvery hostels must upload and submit their online Anti-Ragging undertaking via the portal by 30th September. Severe disciplinary action will follow for non-compliance.',
    timestamp: '2026-09-19 10:00',
    priority: 'URGENT',
    badgeText: '🏛️ Campus-Wide Statutory Notice'
  }
];

// Determine if a notice should be visible to a specific user
function isNoticeVisibleToUser(notice, user) {
  if (!user) return false;
  const role = user.role;

  // 1. Campus-wide notices are visible to EVERY role
  if (notice.scope === 'CAMPUS_ALL') return true;

  // 2. Department Notices from HoD:
  // - Visible to Students of that department
  // - Visible to Tutors of that department
  // - Visible to HoD of that department
  // - Visible to ALL Deputy Wardens & Chief Warden (so wardens can see all department circulars!)
  if (notice.scope.startsWith('DEPT_')) {
    if (role === 'ADMIN' || role === 'CHIEF_WARDEN') return true;
    if (role === 'WARDEN') return true; // Warden gets all department circulars in one unified place!
    if (role === 'HOD' && (user.department === notice.targetDept || user.deptCode === 'CSE')) return true;
    if (role === 'TUTOR' && (user.department === notice.targetDept || user.department === 'Computer Science & Engineering')) return true;
    if (role === 'STUDENT' && (user.department === notice.targetDept || user.department === 'Computer Science & Engineering' || user.deptCode === 'CSE')) return true;
    return false;
  }

  // 3. Hostel Bulletins from Deputy Warden:
  // - Visible to hostel residents of that hostel
  // - Visible to Chief Warden / Principal
  // - Visible to Tutors of the department (to coordinate student residential affairs)
  // - Visible to Deputy Warden
  if (notice.scope.startsWith('HOSTEL_')) {
    if (role === 'ADMIN' || role === 'CHIEF_WARDEN') return true;
    if (role === 'WARDEN') return true;
    if (role === 'TUTOR') return true;
    if (role === 'STUDENT') {
      if (notice.targetHostel && user.hostelName && user.hostelName.includes(notice.targetHostel.split(' ')[0])) return true;
      return true;
    }
    return false;
  }

  return true;
}

function getNoticesForCurrentUser() {
  const user = getCurrentUser();
  if (!user) return [];
  return sampleSystemNotices.filter(n => isNoticeVisibleToUser(n, user));
}

// Render the Notice Board HTML Component for any dashboard
function renderNoticeBoardSection(filterScope = 'ALL') {
  const user = getCurrentUser() || {};
  let list = getNoticesForCurrentUser();

  if (filterScope !== 'ALL') {
    list = list.filter(n => {
      if (filterScope === 'DEPT') return n.scope.startsWith('DEPT_');
      if (filterScope === 'HOSTEL') return n.scope.startsWith('HOSTEL_');
      if (filterScope === 'CAMPUS') return n.scope === 'CAMPUS_ALL';
      return true;
    });
  }

  const canPost = (user.role === 'HOD' || user.role === 'WARDEN' || user.role === 'ADMIN' || user.role === 'CHIEF_WARDEN');

  return `
    <div class="dashboard-section" id="sectionNoticeBoard">
      <div class="section-header" style="flex-wrap: wrap; gap: 0.75rem;">
        <div>
          <h3 class="section-title">📢 Digital Notice Board & Circulars</h3>
          <p style="font-size: 0.82rem; color: var(--text-muted); margin-top: 0.2rem;">
            ${user.role === 'WARDEN' 
              ? 'Unified Notice Feed: Deputy Wardens receive all departmental circulars + hostel bulletins.' 
              : user.role === 'HOD' 
              ? 'HoD Notice Hub: Department announcements automatically route to all department students, tutors & wardens.'
              : user.role === 'TUTOR'
              ? 'Academic Bulletins: Showing circulars from HoD, Hostel Wardens, and Campus Administration.'
              : 'Official hostel, departmental, and statutory notices.'}
          </p>
        </div>
        <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
          <div style="display: flex; gap: 0.35rem;">
            <button class="btn btn-secondary" style="padding: 0.3rem 0.65rem; font-size: 0.75rem;" onclick="filterNoticeBoard('ALL')">All (${getNoticesForCurrentUser().length})</button>
            <button class="btn btn-secondary" style="padding: 0.3rem 0.65rem; font-size: 0.75rem;" onclick="filterNoticeBoard('DEPT')">🎓 Dept Circulars</button>
            <button class="btn btn-secondary" style="padding: 0.3rem 0.65rem; font-size: 0.75rem;" onclick="filterNoticeBoard('HOSTEL')">🛡️ Hostel Bulletins</button>
            <button class="btn btn-secondary" style="padding: 0.3rem 0.65rem; font-size: 0.75rem;" onclick="filterNoticeBoard('CAMPUS')">🏛️ Campus Alerts</button>
          </div>
          ${canPost ? `
            <button class="btn btn-primary" style="padding: 0.4rem 0.85rem; font-size: 0.8rem;" onclick="openPostNoticeModal()">
              + Post New Notice
            </button>
          ` : ''}
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.25rem;">
        ${list.length === 0 ? `
          <div style="grid-column: 1 / -1; text-align: center; padding: 2.5rem; color: var(--text-muted);">
            No announcements found under this filter.
          </div>
        ` : list.map(n => `
          <div class="pass-card" style="border-left: 4px solid ${n.priority === 'URGENT' ? '#EF4444' : n.priority === 'HIGH' ? '#F59E0B' : '#3B82F6'}; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem; gap: 0.5rem;">
                <span class="status-pill" style="font-size: 0.72rem; background: rgba(255,255,255,0.08);">
                  ${n.badgeText}
                </span>
                <span style="font-size: 0.72rem; color: var(--text-muted);">${n.timestamp}</span>
              </div>
              <h4 style="font-size: 1.05rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.4rem; line-height: 1.4;">
                ${n.title}
              </h4>
              <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 1rem;">
                ${n.body}
              </p>
            </div>
            <div style="border-top: 1px solid var(--border-glass); padding-top: 0.6rem; display: flex; justify-content: space-between; align-items: center; font-size: 0.76rem; color: var(--text-muted);">
              <span>Posted by: <b style="color: var(--text-main);">${n.authorName}</b></span>
              <span class="status-pill ${n.priority === 'URGENT' ? 'rejected' : n.priority === 'HIGH' ? 'pending' : 'approved'}" style="font-size: 0.68rem;">
                ${n.priority}
              </span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function filterNoticeBoard(filterType) {
  const container = document.getElementById('sectionNoticeBoard');
  if (container) {
    const parent = container.parentElement;
    container.outerHTML = renderNoticeBoardSection(filterType);
  }
}

function openPostNoticeModal() {
  const modal = document.getElementById('postNoticeModal');
  if (modal) modal.classList.add('active');
}

function closePostNoticeModal() {
  const modal = document.getElementById('postNoticeModal');
  if (modal) modal.classList.remove('active');
}

function handlePostNoticeSubmit(e) {
  if (e && e.preventDefault) e.preventDefault();
  const user = getCurrentUser() || {};
  const title = (document.getElementById('noticeTitleInput') || {}).value || '';
  const body = (document.getElementById('noticeBodyInput') || {}).value || '';
  const priority = (document.getElementById('noticePriorityInput') || {}).value || 'HIGH';
  const scopeSelect = (document.getElementById('noticeScopeSelect') || {}).value || 'AUTO';

  let scope = 'DEPT_CSE';
  let badgeText = '🎓 CSE Dept Circular';

  if (user.role === 'HOD') {
    scope = 'DEPT_CSE';
    badgeText = '🎓 CSE Dept Circular';
  } else if (user.role === 'WARDEN') {
    scope = 'HOSTEL_PENNAR';
    badgeText = '🛡️ Pennar Hostel Bulletin';
  } else if (user.role === 'ADMIN' || user.role === 'CHIEF_WARDEN') {
    scope = 'CAMPUS_ALL';
    badgeText = '🏛️ Campus-Wide Statutory Notice';
  }

  sampleSystemNotices.unshift({
    id: `NOTICE-${Date.now().toString().slice(-4)}`,
    scope: scope,
    targetDept: user.department || 'Computer Science & Engineering',
    targetHostel: user.hostelName || 'Pennar Hostel (Boys)',
    authorRole: user.role,
    authorName: `${user.fullName} (${user.role})`,
    title: title,
    body: body,
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
    priority: priority,
    badgeText: badgeText
  });

  closePostNoticeModal();
  if (window.saveAppState) window.saveAppState();
  renderDashboard();
  alert(`📢 NOTICE PUBLISHED SUCCESSFULLY!\n\nTitle: "${title}"\nTarget Audience: ${scope === 'DEPT_CSE' ? 'CSE Students, Tutors & All Deputy Wardens' : scope === 'HOSTEL_PENNAR' ? 'Hostel Residents, Chief Warden & Tutors' : 'Campus-Wide (All Roles)'}`);
}

window.sampleSystemNotices = sampleSystemNotices;
window.getNoticesForCurrentUser = getNoticesForCurrentUser;
window.renderNoticeBoardSection = renderNoticeBoardSection;
window.filterNoticeBoard = filterNoticeBoard;
window.openPostNoticeModal = openPostNoticeModal;
window.closePostNoticeModal = closePostNoticeModal;
window.handlePostNoticeSubmit = handlePostNoticeSubmit;
