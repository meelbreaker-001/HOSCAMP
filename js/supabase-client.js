/* ==========================================================================
   HostelConnect - Supabase PostgreSQL Cloud Database Client
   Adhiyamaan College of Engineering (ACE)
   Hybrid Client: Cloud Database with Zero-Crash LocalStorage Fallback
   ========================================================================== */

let _supabaseClient = null;

function initSupabase() {
  try {
    const config = window.SUPABASE_CONFIG || {};
    const url = config.url || localStorage.getItem('hoscamp_supabase_url');
    const key = config.anonKey || localStorage.getItem('hoscamp_supabase_anon_key');

    if (url && key && window.supabase && typeof window.supabase.createClient === 'function') {
      _supabaseClient = window.supabase.createClient(url.trim(), key.trim());
      console.log('⚡ [Supabase] Cloud PostgreSQL Database initialized successfully.');
      updateDbConnectionIndicator(true);
      return _supabaseClient;
    } else {
      _supabaseClient = null;
      console.log('ℹ️ [Supabase] Operating in Offline / LocalStorage Mode (Supabase URL/Key not set).');
      updateDbConnectionIndicator(false);
      return null;
    }
  } catch (err) {
    console.warn('⚠️ [Supabase] Initialization error (falling back to LocalStorage):', err);
    _supabaseClient = null;
    updateDbConnectionIndicator(false);
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

function updateDbConnectionIndicator(isConnected) {
  const badge = document.getElementById('cloudDbStatusBadge');
  if (badge) {
    if (isConnected) {
      badge.innerHTML = '🟢 Cloud DB (Supabase)';
      badge.className = 'role-badge warden';
      badge.title = 'Connected to Supabase PostgreSQL Database';
    } else {
      badge.innerHTML = '⚡ Local Mode (Supabase Ready)';
      badge.className = 'role-badge tutor';
      badge.title = 'Click to connect your Supabase PostgreSQL Project';
    }
  }
}

// -----------------------------------------------------------------------------
// Cloud & Local Hybrid Student Registration
// -----------------------------------------------------------------------------
async function registerStudentAccount(studentData) {
  // Always register in local memory & storage first
  const newAccount = {
    id: 'STD_' + Date.now(),
    username: studentData.rollNumber,
    rollNumber: studentData.rollNumber,
    registerNumber: studentData.registerNumber || '',
    fullName: studentData.fullName,
    role: 'STUDENT',
    department: studentData.department || 'Computer Science & Engineering',
    deptCode: studentData.deptCode || 'CSE',
    year: studentData.year || 'I Year (1st Sem)',
    yearNumber: parseInt(studentData.yearNumber, 10) || 1,
    classSection: studentData.classSection || 'Section A',
    assignedTutor: studentData.classSection === 'Section B' ? 'Prof. K. Ramesh (tutor_cse_b)' : 'Prof. M. Priya (tutor_cse_a)',
    hostelName: studentData.hostelName || 'Pennar Hostel (Boys)',
    hostelBlock: studentData.hostelBlock || 'Block B',
    roomNumber: studentData.roomNumber || '101',
    phone: studentData.phone || '',
    parentContact: studentData.parentContact || '',
    password: studentData.password || 'pass123'
  };

  // Update in-memory registry
  if (window.STUDENT_REGISTRY) {
    const existingIdx = window.STUDENT_REGISTRY.findIndex(
      s => s.rollNumber.toUpperCase() === newAccount.rollNumber.toUpperCase()
    );
    if (existingIdx >= 0) {
      window.STUDENT_REGISTRY[existingIdx] = newAccount;
    } else {
      window.STUDENT_REGISTRY.push(newAccount);
    }
  }

  // Update in-memory system accounts
  if (window.SYSTEM_ACCOUNTS) {
    window.SYSTEM_ACCOUNTS[newAccount.username] = newAccount;
    window.SYSTEM_ACCOUNTS[newAccount.username.toLowerCase()] = newAccount;
  }

  // Save to LocalStorage
  try {
    const customResidents = JSON.parse(localStorage.getItem('hoscamp_custom_students') || '[]');
    const filtered = customResidents.filter(s => s.rollNumber !== newAccount.rollNumber);
    filtered.push(newAccount);
    localStorage.setItem('hoscamp_custom_students', JSON.stringify(filtered));
  } catch (e) {
    console.warn('LocalStorage save warning:', e);
  }

  // Sync to Supabase Cloud if connected
  const sb = getSupabase();
  if (sb) {
    try {
      const { data, error } = await sb
        .from('profiles')
        .upsert({
          roll_number: newAccount.rollNumber,
          register_number: newAccount.registerNumber,
          full_name: newAccount.fullName,
          role: 'STUDENT',
          department: newAccount.department,
          dept_code: newAccount.deptCode,
          year_number: newAccount.yearNumber,
          class_section: newAccount.classSection,
          hostel_name: newAccount.hostelName,
          hostel_block: newAccount.hostelBlock,
          room_number: newAccount.roomNumber,
          phone: newAccount.phone,
          parent_contact: newAccount.parentContact,
          password: newAccount.password
        }, { onConflict: 'roll_number' });

      if (error) {
        console.warn('Supabase profile upsert warning:', error.message);
      } else {
        console.log('✅ Student profile saved to Supabase Cloud:', newAccount.rollNumber);
      }
    } catch (sbErr) {
      console.warn('Supabase sync skipped:', sbErr);
    }
  }

  return newAccount;
}

// -----------------------------------------------------------------------------
// Cloud & Local Hybrid Pass Management
// -----------------------------------------------------------------------------
async function syncPassToCloud(passObj) {
  const sb = getSupabase();
  if (!sb) return;

  try {
    const { error } = await sb
      .from('passes')
      .upsert({
        id: passObj.id,
        student_roll: passObj.studentRoll || passObj.rollNumber,
        student_name: passObj.studentName,
        pass_type: passObj.type || passObj.pass_type,
        start_date: passObj.startDate || passObj.start_date,
        end_date: passObj.endDate || passObj.end_date,
        reason: passObj.reason,
        destination: passObj.destination || '',
        parent_contact: passObj.parentContact || '',
        medical_proof_url: passObj.medicalProofUrl || passObj.proofData || '',
        tutor_approval: passObj.tutorApproval || 'PENDING',
        warden_approval: passObj.wardenApproval || 'PENDING',
        status: passObj.status || 'PENDING',
        is_extension: !!passObj.isExtension
      }, { onConflict: 'id' });

    if (error) {
      console.warn('Supabase pass upsert warning:', error.message);
    } else {
      console.log('✅ Pass synced to Supabase Cloud:', passObj.id);
    }
  } catch (err) {
    console.warn('Supabase pass sync error:', err);
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
        details: details || ''
      });
  } catch (e) {
    // Non-blocking silent fail
  }
}

// -----------------------------------------------------------------------------
// Settings Modal Helpers: Save / Test Credentials directly in Browser
// -----------------------------------------------------------------------------
function saveSupabaseSettings(url, key) {
  const cleanUrl = (url || '').trim();
  const cleanKey = (key || '').trim();

  localStorage.setItem('hoscamp_supabase_url', cleanUrl);
  localStorage.setItem('hoscamp_supabase_anon_key', cleanKey);

  if (window.SUPABASE_CONFIG) {
    window.SUPABASE_CONFIG.url = cleanUrl;
    window.SUPABASE_CONFIG.anonKey = cleanKey;
  }

  const client = initSupabase();
  return !!client;
}

function openSupabaseSettingsModal() {
  let modal = document.getElementById('supabaseSettingsModal');
  if (!modal) {
    createSupabaseSettingsModalElement();
    modal = document.getElementById('supabaseSettingsModal');
  }

  const urlInput = document.getElementById('sbProjectUrlInput');
  const keyInput = document.getElementById('sbAnonKeyInput');

  if (urlInput) {
    urlInput.value = localStorage.getItem('hoscamp_supabase_url') || (window.SUPABASE_CONFIG ? window.SUPABASE_CONFIG.url : '');
  }
  if (keyInput) {
    keyInput.value = localStorage.getItem('hoscamp_supabase_anon_key') || (window.SUPABASE_CONFIG ? window.SUPABASE_CONFIG.anonKey : '');
  }

  if (modal) modal.classList.add('active');
}

function closeSupabaseSettingsModal() {
  const modal = document.getElementById('supabaseSettingsModal');
  if (modal) modal.classList.remove('active');
}

function createSupabaseSettingsModalElement() {
  const div = document.createElement('div');
  div.className = 'modal-overlay';
  div.id = 'supabaseSettingsModal';
  div.innerHTML = `
    <div class="modal-card" style="max-width: 580px;">
      <div class="modal-header">
        <h3 class="modal-title">⚡ Connect Supabase Cloud Database</h3>
        <button class="btn-close-modal" onclick="closeSupabaseSettingsModal()">✕</button>
      </div>

      <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); padding: 1rem; border-radius: 8px; margin-bottom: 1.25rem; font-size: 0.85rem; line-height: 1.6; color: #E2E8F0;">
        <div style="font-weight: 700; color: #10B981; margin-bottom: 0.35rem;">🚀 Supabase PostgreSQL Connection</div>
        Connect your real Supabase account for multi-device sync, permanent pass storage, and audit logs.
        <br>
        <span style="color: #94A3B8;">Leave blank to run in <b>Offline / Evaluator Demo Mode</b> (100% functional with LocalStorage).</span>
      </div>

      <form onsubmit="handleSaveSupabaseConfig(event)">
        <div class="form-group">
          <label class="form-label">Supabase Project URL</label>
          <input type="url" class="form-control" id="sbProjectUrlInput" placeholder="https://your-project-id.supabase.co">
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem;">Found in Supabase: Project Settings -> API -> Project URL</div>
        </div>

        <div class="form-group">
          <label class="form-label">Supabase Anon Public API Key</label>
          <input type="password" class="form-control" id="sbAnonKeyInput" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...">
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem;">Found in Supabase: Project Settings -> API -> Project API Keys -> anon public</div>
        </div>

        <div style="display: flex; gap: 0.75rem; margin-top: 1.5rem;">
          <button type="submit" class="btn btn-primary" style="flex: 1;">
            💾 Save &amp; Connect Cloud DB
          </button>
          <button type="button" class="btn btn-secondary" onclick="handleClearSupabaseConfig()">
            🔄 Reset to Local Mode
          </button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(div);
}

function handleSaveSupabaseConfig(e) {
  if (e && e.preventDefault) e.preventDefault();
  const url = document.getElementById('sbProjectUrlInput')?.value;
  const key = document.getElementById('sbAnonKeyInput')?.value;

  const success = saveSupabaseSettings(url, key);
  closeSupabaseSettingsModal();

  if (success) {
    alert('🎉 Supabase Cloud Database Connected! Passes, registrations, and logs will now sync to PostgreSQL.');
  } else {
    alert('⚡ Running in Offline / LocalStorage Mode.');
  }
}

function handleClearSupabaseConfig() {
  saveSupabaseSettings('', '');
  closeSupabaseSettingsModal();
  alert('🔄 Supabase disconnected. Restored to LocalStorage mode.');
}

// Load custom students from LocalStorage on startup
function loadCustomSavedStudents() {
  try {
    const raw = localStorage.getItem('hoscamp_custom_students');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && window.STUDENT_REGISTRY && window.SYSTEM_ACCOUNTS) {
        parsed.forEach(student => {
          // Register in student registry
          if (!window.STUDENT_REGISTRY.some(s => s.rollNumber.toUpperCase() === student.rollNumber.toUpperCase())) {
            window.STUDENT_REGISTRY.push(student);
          }
          // Register in system accounts for instant login
          window.SYSTEM_ACCOUNTS[student.rollNumber] = student;
          window.SYSTEM_ACCOUNTS[student.rollNumber.toLowerCase()] = student;
        });
      }
    }
  } catch (err) {
    console.warn('Error loading custom students:', err);
  }
}

// Auto-initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initSupabase();
  loadCustomSavedStudents();
});

// Export globally
window.initSupabase = initSupabase;
window.getSupabase = getSupabase;
window.isSupabaseConnected = isSupabaseConnected;
window.registerStudentAccount = registerStudentAccount;
window.syncPassToCloud = syncPassToCloud;
window.logSecurityEventToCloud = logSecurityEventToCloud;
window.saveSupabaseSettings = saveSupabaseSettings;
window.openSupabaseSettingsModal = openSupabaseSettingsModal;
window.closeSupabaseSettingsModal = closeSupabaseSettingsModal;
window.handleSaveSupabaseConfig = handleSaveSupabaseConfig;
window.handleClearSupabaseConfig = handleClearSupabaseConfig;
