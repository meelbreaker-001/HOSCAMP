/* ==========================================================================
   CampusConnect - Connected Roles Chat Box Pipeline
   ========================================================================== */

let activeChatChannel = null;

let sampleChatStore = {
  WARDEN_CHIEF: [
    { sender: 'Deputy Warden Selvam', role: 'WARDEN', text: 'Respected Sir, student deletion request submitted for Roll No 2026-CSE-098.', time: '10:15 AM' },
    { sender: 'Dr. R. Raman (Principal)', role: 'ADMIN', text: 'Received. I have reviewed the disciplinary report and approved the deletion.', time: '10:30 AM' }
  ],
  STUDENT_WARDEN: [
    { sender: 'Alex Rivers', role: 'STUDENT', text: 'Good morning Sir, I have applied for an OUT/IN pass for my hospital checkup.', time: '09:00 AM' },
    { sender: 'Deputy Warden Selvam', role: 'WARDEN', text: 'Verified. Pass approved. Please show the QR code at the main gate.', time: '09:12 AM' }
  ],
  ACADEMIC_WARDEN: [
    { sender: 'Prof. M. Priya (Tutor)', role: 'TUTOR', text: 'Warden Sir, student Alex has 88% attendance and is eligible for leave.', time: '08:45 AM' },
    { sender: 'Deputy Warden Selvam', role: 'WARDEN', text: 'Thank you Ma\'am. Leave approved from hostel side.', time: '09:05 AM' }
  ]
};

function toggleChatDrawer() {
  const drawer = document.getElementById('chatDrawer');
  if (drawer) {
    drawer.classList.toggle('active');
    if (drawer.classList.contains('active')) {
      setupRoleConnectedChannels();
    }
  }
}

// Enforce Connected Roles Filter on Chat Channels
function setupRoleConnectedChannels() {
  const user = getCurrentUser();
  if (!user) return;

  const btnAdmin = document.getElementById('tabChannelWardenChief');
  const btnStudent = document.getElementById('tabChannelStudentWarden');
  const btnAcademic = document.getElementById('tabChannelAcademicWarden');

  // Hide all tabs first
  btnAdmin.style.display = 'none';
  btnStudent.style.display = 'none';
  btnAcademic.style.display = 'none';

  let defaultChannel = null;

  if (user.role === 'STUDENT') {
    // Students only connect with Warden
    btnStudent.style.display = 'block';
    defaultChannel = 'STUDENT_WARDEN';
  } else if (user.role === 'HOD' || user.role === 'TUTOR') {
    // Academics only connect with Warden
    btnAcademic.style.display = 'block';
    defaultChannel = 'ACADEMIC_WARDEN';
  } else if (user.role === 'ADMIN') {
    // Chief Warden only connects with Deputy Wardens
    btnAdmin.style.display = 'block';
    defaultChannel = 'WARDEN_CHIEF';
  } else if (user.role === 'WARDEN') {
    // Deputy Warden connects with all 3 roles
    btnAdmin.style.display = 'block';
    btnStudent.style.display = 'block';
    btnAcademic.style.display = 'block';
    defaultChannel = 'STUDENT_WARDEN';
  }

  switchChatChannel(defaultChannel);
}

function switchChatChannel(channelName) {
  if (!channelName) return;
  activeChatChannel = channelName;
  
  // Highlight active tab
  const btnAdmin = document.getElementById('tabChannelWardenChief');
  const btnStudent = document.getElementById('tabChannelStudentWarden');
  const btnAcademic = document.getElementById('tabChannelAcademicWarden');

  if (btnAdmin) btnAdmin.classList.toggle('active', channelName === 'WARDEN_CHIEF');
  if (btnStudent) btnStudent.classList.toggle('active', channelName === 'STUDENT_WARDEN');
  if (btnAcademic) btnAcademic.classList.toggle('active', channelName === 'ACADEMIC_WARDEN');

  renderChatMessages();
}

function renderChatMessages() {
  const area = document.getElementById('chatMessagesArea');
  if (!area) return;

  const messages = sampleChatStore[activeChatChannel] || [];
  const user = getCurrentUser();

  if (messages.length === 0) {
    area.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 2rem; font-size: 0.85rem;">No messages in this channel yet.</div>`;
    return;
  }

  area.innerHTML = messages.map(msg => {
    const isSent = (user && (msg.sender === user.fullName || msg.role === user.role));
    return `
      <div class="chat-bubble ${isSent ? 'sent' : 'received'}">
        <div class="chat-sender-name">${msg.sender}</div>
        <div>${msg.text}</div>
        <div class="chat-timestamp">${msg.time}</div>
      </div>
    `;
  }).join('');

  area.scrollTop = area.scrollHeight;
}

function sendChatMessage() {
  const input = document.getElementById('chatInputField');
  if (!input || !input.value.trim() || !activeChatChannel) return;

  const user = getCurrentUser();
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (!sampleChatStore[activeChatChannel]) {
    sampleChatStore[activeChatChannel] = [];
  }

  sampleChatStore[activeChatChannel].push({
    sender: user ? user.fullName : 'User',
    role: user ? user.role : 'STUDENT',
    text: input.value.trim(),
    time: timeStr
  });

  input.value = '';
  renderChatMessages();
}

function handleChatKeyPress(e) {
  if (e.key === 'Enter') {
    sendChatMessage();
  }
}
