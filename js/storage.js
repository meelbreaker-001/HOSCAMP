/* ==========================================================================
   CampusConnect - State Persistence Engine (localStorage Sync)
   Adhiyamaan College of Engineering (ACE)
   Ensures newly registered students, uploaded attendance, passes, notices,
   and audit logs permanently persist across browser reloads.
   ========================================================================== */

const STORAGE_KEY = 'HOSTELCONNECT_STATE_V2';

function saveAppState() {
  try {
    const stateToSave = {
      timestamp: new Date().toISOString(),
      studentRegistry: window.STUDENT_REGISTRY || [],
      attendanceDb: window.studentAttendanceDatabase || {},
      systemAccounts: window.SYSTEM_ACCOUNTS || {},
      wardenPendingPasses: window.sampleWardenPendingPasses || [],
      wardenIssuedOutIn: window.sampleWardenIssuedOutInPasses || [],
      wardenIssuedRoomStay: window.sampleWardenIssuedRoomStayPasses || [],
      wardenSecurityViolations: window.sampleWardenSecurityViolations || [],
      wardenAuditLogs: window.sampleWardenAuditLogs || [],
      academicVerifications: window.sampleAcademicVerifications || [],
      academicOverdueQueue: window.sampleOverdueAcademicQueue || [],
      outInPasses: window.sampleOutInPasses || [],
      roomStayPasses: window.sampleRoomStayPasses || [],
      studentGrievances: window.sampleStudentGrievances || [],
      systemNotices: window.sampleSystemNotices || [],
      tutorAllocations: window.tutorSectionAllocations || [],
      wardenAllocations: window.deputyWardenAllocations || []
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  } catch (e) {
    console.warn('localStorage save warning (quota or disabled):', e);
  }
}

function loadAppState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;

    const saved = JSON.parse(raw);
    if (!saved) return false;

    if (saved.studentRegistry && saved.studentRegistry.length > 0) {
      window.STUDENT_REGISTRY = saved.studentRegistry;
    }
    if (saved.attendanceDb && Object.keys(saved.attendanceDb).length > 0) {
      window.studentAttendanceDatabase = saved.attendanceDb;
    }
    if (saved.systemAccounts && Object.keys(saved.systemAccounts).length > 0) {
      window.SYSTEM_ACCOUNTS = Object.assign(window.SYSTEM_ACCOUNTS || {}, saved.systemAccounts);
    }
    if (saved.tutorAllocations && saved.tutorAllocations.length > 0) {
      window.tutorSectionAllocations = saved.tutorAllocations;
    }
    if (saved.wardenAllocations && saved.wardenAllocations.length > 0) {
      window.deputyWardenAllocations = saved.wardenAllocations;
    }
    if (saved.wardenPendingPasses) {
      window.sampleWardenPendingPasses = saved.wardenPendingPasses;
    }
    if (saved.wardenIssuedOutIn) {
      window.sampleWardenIssuedOutInPasses = saved.wardenIssuedOutIn;
    }
    if (saved.wardenIssuedRoomStay) {
      window.sampleWardenIssuedRoomStayPasses = saved.wardenIssuedRoomStay;
    }
    if (saved.wardenSecurityViolations) {
      window.sampleWardenSecurityViolations = saved.wardenSecurityViolations;
    }
    if (saved.wardenAuditLogs) {
      window.sampleWardenAuditLogs = saved.wardenAuditLogs;
    }
    if (saved.academicVerifications) {
      window.sampleAcademicVerifications = saved.academicVerifications;
    }
    if (saved.academicOverdueQueue) {
      window.sampleOverdueAcademicQueue = saved.academicOverdueQueue;
    }
    if (saved.outInPasses) {
      window.sampleOutInPasses = saved.outInPasses;
    }
    if (saved.roomStayPasses) {
      window.sampleRoomStayPasses = saved.roomStayPasses;
    }
    if (saved.studentGrievances) {
      window.sampleStudentGrievances = saved.studentGrievances;
    }
    if (saved.systemNotices && saved.systemNotices.length > 0) {
      window.sampleSystemNotices = saved.systemNotices;
    }

    return true;
  } catch (e) {
    console.warn('Could not restore from localStorage:', e);
    return false;
  }
}

function resetAppStateToDefault() {
  if (confirm('🔄 RESET ALL DATA TO DEMO DEFAULTS?\n\nThis will clear locally registered accounts, passes, and notices, restoring default presentation state.')) {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  }
}

// Auto-run load on script evaluation
loadAppState();

// Window bindings
window.saveAppState = saveAppState;
window.loadAppState = loadAppState;
window.resetAppStateToDefault = resetAppStateToDefault;
