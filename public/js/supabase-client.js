/* ==========================================================================
   HostelConnect - Supabase Cloud Database Client
   Adhiyamaan College of Engineering (ACE)
   Silent Data Layer: Cloud Database with Zero-Crash LocalStorage Fallback
   ========================================================================== */

let _supabaseClient = null;

function initSupabase() {
  try {
    const config = window.SUPABASE_CONFIG || {};
    const url = config.url;
    const key = config.anonKey;

    if (url && key && window.supabase && typeof window.supabase.createClient === 'function') {
      _supabaseClient = window.supabase.createClient(url.trim(), key.trim());
      console.log('⚡ [Supabase] Connected to PostgreSQL cloud database:', url);
      // Run initial background sync
      setTimeout(syncCloudDataOnLoad, 500);
      return _supabaseClient;
    } else {
      _supabaseClient = null;
      console.log('ℹ️ [Supabase] Operating in local mode.');
      return null;
    }
  } catch (err) {
    console.warn('⚠️ [Supabase] Initialization error (falling back to LocalStorage):', err);
    _supabaseClient = null;
    return null;
  }
}

function getSupabase() {
  if (!_supabaseClient && window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.url) {
    return initSupabase();
  }
  return _supabaseClient;
}

function isSupabaseConnected() {
  return !!_supabaseClient;
}

// -----------------------------------------------------------------------------
// Silent Initial Sync from Supabase Cloud to In-Memory & Local Storage
// -----------------------------------------------------------------------------
async function syncCloudDataOnLoad() {
  const sb = _supabaseClient;
  if (!sb) return;

  try {
    // 1. Sync Profiles
    const { data: profiles, error: pErr } = await sb.from('profiles').select('*');
    if (!pErr && Array.isArray(profiles) && profiles.length > 0) {
      profiles.forEach(p => {
        const studentAcc = {
          id: p.id,
          username: p.roll_number,
          rollNumber: p.roll_number,
          registerNumber: p.register_number || '',
          fullName: p.full_name,
          role: p.role,
          department: p.department || 'Computer Science & Engineering',
          deptCode: p.dept_code || 'CSE',
          yearNumber: p.year_number || 2,
          classSection: p.class_section || 'Section A',
          hostelName: p.hostel_name || 'Pennar Hostel (Boys)',
          hostelBlock: p.hostel_block || 'Block B',
          roomNumber: p.room_number || '101',
          phone: p.phone || '',
          parentContact: p.parent_contact || '',
          password: p.password || 'pass123'
        };

        if (window.SYSTEM_ACCOUNTS) {
          window.SYSTEM_ACCOUNTS[p.roll_number] = studentAcc;
          window.SYSTEM_ACCOUNTS[p.roll_number.toLowerCase()] = studentAcc;
        }

        if (p.role === 'STUDENT' && window.STUDENT_REGISTRY) {
          const idx = window.STUDENT_REGISTRY.findIndex(
            s => s.rollNumber && s.rollNumber.toUpperCase() === p.roll_number.toUpperCase()
          );
          if (idx >= 0) {
            window.STUDENT_REGISTRY[idx] = { ...window.STUDENT_REGISTRY[idx], ...studentAcc };
          } else {
            window.STUDENT_REGISTRY.push(studentAcc);
          }
        }
      });
      console.log(`✅ [Supabase] Synced ${profiles.length} profiles from cloud.`);
    }

    // 2. Sync Passes
    const { data: cloudPasses, error: passErr } = await sb.from('passes').select('*');
    if (!passErr && Array.isArray(cloudPasses) && cloudPasses.length > 0) {
      cloudPasses.forEach(cp => {
        const mappedPass = {
          id: cp.id,
          studentRoll: cp.student_roll,
          studentName: cp.student_name,
          type: cp.pass_type,
          startDate: cp.start_date,
          endDate: cp.end_date,
          reason: cp.reason,
          destination: cp.destination || '',
          parentContact: cp.parent_contact || '',
          medicalProofUrl: cp.medical_proof_url || '',
          tutorApproval: cp.tutor_approval || 'PENDING',
          wardenApproval: cp.warden_approval || 'PENDING',
          status: cp.status || 'PENDING',
          isExtension: !!cp.is_extension,
          createdAt: cp.created_at
        };

        // Add to warden queues if appropriate
        if (mappedPass.status === 'PENDING' && window.sampleWardenPendingPasses) {
          if (!window.sampleWardenPendingPasses.some(p => p.id === mappedPass.id)) {
            window.sampleWardenPendingPasses.unshift(mappedPass);
          }
        }
        if (mappedPass.type === 'OUT_IN_PASS' && window.sampleOutInPasses) {
          if (!window.sampleOutInPasses.some(p => p.id === mappedPass.id)) {
            window.sampleOutInPasses.unshift(mappedPass);
          }
        }
        if (mappedPass.type === 'ROOM_STAY_PASS' && window.sampleRoomStayPasses) {
          if (!window.sampleRoomStayPasses.some(p => p.id === mappedPass.id)) {
            window.sampleRoomStayPasses.unshift(mappedPass);
          }
        }
      });
      console.log(`✅ [Supabase] Synced ${cloudPasses.length} leave passes from cloud.`);
    }

    // 3. Sync Grievances
    const { data: cloudGrievances, error: gErr } = await sb.from('grievances').select('*');
    if (!gErr && Array.isArray(cloudGrievances) && cloudGrievances.length > 0 && window.sampleStudentGrievances) {
      cloudGrievances.forEach(cg => {
        const mappedG = {
          id: cg.id,
          studentRoll: cg.student_roll,
          studentName: cg.student_name,
          category: cg.category,
          severity: cg.severity || 'MEDIUM',
          title: cg.title,
          description: cg.description || '',
          status: cg.status || 'PENDING',
          photoProofUrl: cg.photo_proof_url || '',
          solveProofUrl: cg.solve_proof_url || '',
          createdAt: cg.created_at
        };
        if (!window.sampleStudentGrievances.some(g => g.id === mappedG.id)) {
          window.sampleStudentGrievances.unshift(mappedG);
        }
      });
      console.log(`✅ [Supabase] Synced ${cloudGrievances.length} grievances from cloud.`);
    }

    // Update active view if logged in
    if (typeof window.renderStudentDashboard === 'function' && window.getCurrentUser && window.getCurrentUser()) {
      window.renderStudentDashboard();
    }
  } catch (syncErr) {
    console.warn('⚠️ [Supabase] Sync skipped (using local cache):', syncErr);
  }
}

// -----------------------------------------------------------------------------
// Cloud & Local Hybrid Pass Sync
// -----------------------------------------------------------------------------
async function syncPassToCloud(passObj) {
  const sb = getSupabase();
  if (!sb || !passObj) return;

  try {
    const { error } = await sb
      .from('passes')
      .upsert({
        id: passObj.id || ('PASS_' + Date.now()),
        student_roll: passObj.studentRoll || passObj.rollNumber || 'UNKNOWN',
        student_name: passObj.studentName || 'Student',
        pass_type: passObj.type || passObj.pass_type || 'OUT_IN_PASS',
        start_date: passObj.startDate || passObj.start_date || new Date().toISOString(),
        end_date: passObj.endDate || passObj.end_date || new Date().toISOString(),
        reason: passObj.reason || 'General Leave',
        destination: passObj.destination || '',
        parent_contact: passObj.parentContact || '',
        medical_proof_url: passObj.medicalProofUrl || passObj.proofData || '',
        tutor_approval: passObj.tutorApproval || 'PENDING',
        warden_approval: passObj.wardenApproval || 'PENDING',
        status: passObj.status || 'PENDING',
        is_extension: !!passObj.isExtension
      }, { onConflict: 'id' });

    if (error) {
      console.warn('Supabase pass sync error:', error.message);
    } else {
      console.log('✅ Pass synced to Supabase Cloud:', passObj.id);
    }
  } catch (err) {
    console.warn('Supabase pass sync error:', err);
  }
}

// -----------------------------------------------------------------------------
// Cloud & Local Hybrid Grievance Sync
// -----------------------------------------------------------------------------
async function syncGrievanceToCloud(gObj) {
  const sb = getSupabase();
  if (!sb || !gObj) return;

  try {
    const { error } = await sb
      .from('grievances')
      .upsert({
        id: gObj.id || ('GRV_' + Date.now()),
        student_roll: gObj.studentRoll || 'UNKNOWN',
        student_name: gObj.studentName || 'Student',
        category: gObj.category || 'Maintenance',
        severity: gObj.severity || 'MEDIUM',
        title: gObj.title || 'Grievance',
        description: gObj.description || '',
        status: gObj.status || 'PENDING',
        photo_proof_url: gObj.photoProofUrl || '',
        solve_proof_url: gObj.solveProofUrl || ''
      }, { onConflict: 'id' });

    if (error) {
      console.warn('Supabase grievance sync error:', error.message);
    } else {
      console.log('✅ Grievance synced to Supabase Cloud:', gObj.id);
    }
  } catch (err) {
    console.warn('Supabase grievance sync error:', err);
  }
}

// -----------------------------------------------------------------------------
// Cloud Security Audit Ping
// -----------------------------------------------------------------------------
async function logSecurityEventToCloud(action, username, details) {
  const sb = getSupabase();
  if (!sb) return;

  try {
    await sb
      .from('security_access_logs')
      .insert({
        client_ip: 'CLIENT_BROWSER',
        action: action || 'EVENT',
        username: username || 'ANONYMOUS',
        user_agent: navigator.userAgent || 'UNKNOWN',
        details: typeof details === 'object' ? JSON.stringify(details) : (details || '')
      });
  } catch (e) {
    // Non-blocking silent fail
  }
}

// Auto-initialize when script loads
document.addEventListener('DOMContentLoaded', () => {
  initSupabase();
});

// Export globally
window.initSupabase = initSupabase;
window.getSupabase = getSupabase;
window.isSupabaseConnected = isSupabaseConnected;
window.syncPassToCloud = syncPassToCloud;
window.syncGrievanceToCloud = syncGrievanceToCloud;
window.logSecurityEventToCloud = logSecurityEventToCloud;
window.syncCloudDataOnLoad = syncCloudDataOnLoad;
