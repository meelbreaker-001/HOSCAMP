# 🏛️ HostelConnect — Adhiyamaan College of Engineering (ACE)
> **Unified Digital Connectivity Platform for Hostel Residents, Wardens, Academic Departments & Gate Security**
> *Adhiyamaan College of Engineering (Autonomous), Hosur, Tamil Nadu*

---

## 📌 Project Overview
**HostelConnect** is a specialized institutional web portal designed to modernize and digitize residential hostel and academic administration at Adhiyamaan College of Engineering. It establishes a secure digital bridge between **Hostel Students**, **Deputy Wardens**, **Class Tutors**, **Heads of Departments (HoD)**, **Chief Warden / Principal**, and **Master Gate Security**.

---

## ⚡ Key Highlights & Core Features

### 1. 🔄 Flexible Dual-Approval Leave System
* **Order-Independent Approval**: Either the **Class Tutor** or the **Deputy Warden** can grant first clearance.
* **Covers Both Leave Types**:
  * **OUT / IN Passes**: For leaving campus (Home visits, outings, medical visits). Activates a scannable Gate Pass QR code upon full dual-approval.
  * **Room Stay Passes**: Grants permission to stay inside assigned hostel rooms during academic/college hours.
* **Real-Time Dual Badges**: Pass cards display live clearance indicators (`Warden: Approved / Pending` | `Tutor: Approved / Pending`).

### 2. 📚 Class Tutor-Governed Academic Attendance Authority
* **Sole Authority**: Academic attendance is **strictly maintained, entered, and uploaded by Class Tutors** via an interactive Section Attendance Roster.
* **Propagated Everywhere**: Displayed transparently across HoD clearance directories, Warden pass queues, and Student dashboards as: `XX% (Uploaded by Class Tutor)`.
* **75% Statutory Rule**: Enforces the Anna University / ACE mandatory 75% attendance rule; exceptions are strictly reserved for certified medical/sickness grounds.

### 3. 🎓 HoD 4-Year Hostel Directory & Class Tutor Allocations
* **Strictly Hostel Students Only**: Filters out day scholars and displays residential students across all 4 academic years (**I Year, II Year, III Year, IV Year**).
* **Fast Year Tabs**: Interactive 1-click filtering (`All 4 Years`, `1st Year`, `2nd Year`, `3rd Year`, `4th Year`) plus real-time search by Roll Number, Anna Univ Register Number, or Student Name.
* **Active Tutor Allocations Management (HoD Authority)**:
  * HoD can assign new Class Tutors to specific sections (e.g. *Section A*, *Section B*, *Section C*).
  * Edit and reassign jurisdiction and scopes.
  * Remove/unassign tutors.
  * Newly created tutors are instantly registered with credentials in `SYSTEM_ACCOUNTS` and can log in immediately.

### 4. 🛡️ Deputy Warden Operations & Student Onboarding
* **Student Registration Form**: Registers hostel residents with full institutional data binding:
  * Full Name, Roll Number, Anna Univ Register Number, Academic Department.
  * **Academic Year** (I, II, III, IV) and **Class Section** (Section A, B, C) mapped directly to their assigned Class Tutor.
  * Hostel Block, Room Number, Student Mobile, Parent Emergency Contact, and Login Credentials.
* **Pass Extensions**: Students can request valid return time extensions; Deputy Wardens review, approve, and log them into the audit trail.
* **Photo Proof Grievance Redressal**: Mandatory physical photo evidence verification before tickets (plumbing, electrical, hygiene) can be marked closed.

### 5. 👮 Master Gate Security Scanner & Automated Curfew Flagging
* **Dynamic QR & Code Scanner**: Validates official leave passes in real time at campus checkpoints.
* **Automated Late Return Detection**: The scanner compares actual return time against pass validity; overdue returns are **automatically flagged as Curfew Violations** directly into the Deputy Warden's disciplinary review log.

### 6. 📢 Multi-Tier Role-Targeted Digital Notice Board
* **Smart Scope Routing**:
  * **HoD Circulars**: Automatically route to department students, department tutors, and **all Deputy Wardens** across campus (ensuring wardens are informed about lab exams, hackathons, and tests).
  * **Hostel Bulletins**: Route to hostel residents, tutors, and the Chief Warden.
  * **Campus-Wide Alerts**: Published by the Chief Warden/Principal, reaching all campus roles.

### 7. 👑 Supreme Administration & Chief Warden Governance
* **Campus-Wide Jurisdiction**: Central authority over all campus hostels (Pennar, Bhavani, Cauvery).
* **Deputy Warden Appointments & Administration (Chief Warden Authority)**:
  * Appoint new Deputy Wardens with designated hostel blocks (Pennar, Bhavani, Cauvery).
  * Edit and reassign hostel block jurisdictions and official contact phones.
  * Relieve wardens from active service.
  * Create official accounts (HoD, Deputy Warden, Master Security) with instant password and credential activation.
* **30-Day Warden Audit Trail**: Detailed chronological ledger of every operational action taken by wardens.
* **CSV Export Engine**: 1-click download of the complete audit log for statutory governance.

### 8. 💾 Persistent Data Engine (Zero Data Loss)
* Automatically caches all registered students, updated attendance percentages, approved passes, notices, tutor allocations, deputy warden appointments, and tickets into browser `localStorage`.
* Prevents data loss on browser refresh during live presentations.
* Prevents data loss on browser refresh during live presentations.

---

## 🔑 Demo Login Credentials

You can use the quick-fill chips on the login modal or enter the credentials below:

| Role | Username | Password | Jurisdiction / Scope |
| :--- | :--- | :--- | :--- |
| **Hostel Student** | `alex_student` | `Alex@123` | Pennar Hostel Block B, Rm 304 (CSE II Year, Sec A) |
| **Class Tutor** | `tutor_cse_a` | `Tutor@123` | Class Tutor (CSE Section A) |
| **Class Tutor** | `tutor_cse_b` | `Tutor@123` | Class Tutor (CSE Section B) |
| **Head of Dept (HoD)** | `hod_cse` | `Hod@123` | Head of Computer Science & Engineering |
| **Deputy Warden (Boys)** | `warden_block_b` | `Warden@123` | Pennar Hostel (Boys), Block B |
| **Deputy Warden (Girls)**| `warden_girls` | `Warden@123` | Bhavani Hostel (Girls), Block A |
| **Master Security** | `main_security` | `Security@123` | Main Campus Gate Checkpoint |
| **Chief Warden** | `chiefwarden@adhiyamaan.ac.in` | `Chief@123` | All Campus Hostels (Pennar, Bhavani, Cauvery) |
| **Principal / Admin** | `principal@adhiyamaan.ac.in` | `Admin@123` | Campus Supreme Head |

---

## 🚀 How to Run Locally

### Option 1: Python (Built-in Web Server)
```bash
# From project root directory
python -m http.server 3000 --directory public
```
Then open your browser at **`http://localhost:3000`**.

### Option 2: Node.js / Express
```bash
npm install
npm start
```
Then open your browser at **`http://localhost:3000`**.

---

## 📁 Project File Structure

```text
hostel-connect/
├── public/
│   ├── css/
│   │   ├── style.css          # Core CSS variables, typography, and glassmorphic base
│   │   ├── components.css     # Buttons, modal dialogs, status badges, form inputs
│   │   ├── dashboard.css      # Stat cards, custom responsive tables, layout grids
│   │   └── chat.css           # Floating campus support chatbot styling
│   ├── js/
│   │   ├── auth.js            # User accounts, student master registry, tutor attendance DB
│   │   ├── storage.js         # LocalStorage persistence engine
│   │   ├── noticeboard.js     # Multi-tier role-targeted notice board engine
│   │   ├── student.js         # Student leave passes, room stay, grievances & SOS
│   │   ├── academic.js        # HoD 4-year clearance directory & Tutor section roster
│   │   ├── warden.js          # Deputy Warden approvals, registration, extensions, solve proofs
│   │   ├── admin.js           # Chief Warden / Principal portal & CSV audit trail export
│   │   ├── security.js        # Gate scanner & automatic curfew breach generator
│   │   ├── chat.js            # Floating support assistant
│   │   └── app.js             # Main router, modal triggers, and pass submission handlers
│   └── index.html             # Single-Page Application entry point
├── package.json               # Node.js configuration
├── server.js                  # Express static server fallback
├── vercel.json                # Cloud deployment configuration
├── .gitignore                 # Git ignore rules
└── README.md                  # Complete institutional documentation
```

---

## 🏫 Institutional Details
* **Institution**: Adhiyamaan College of Engineering (Autonomous)
* **Affiliation**: Anna University, Chennai
* **Accreditation**: AICTE, NBA, NAAC 'A' Grade
* **Campus Location**: Hosur, Krishnagiri District, Tamil Nadu, India
