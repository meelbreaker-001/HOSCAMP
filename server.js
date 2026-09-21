const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'Hostel-Warden-College Connectivity Portal',
    timestamp: new Date().toISOString()
  });
});

// Demo Data Endpoint
app.get('/api/roles', (req, res) => {
  res.json({
    roles: [
      { code: 'ADMIN', name: 'Chief Warden / Principal', icon: '👑' },
      { code: 'HOD', name: 'Head of Department', icon: '🎓' },
      { code: 'TUTOR', name: 'Class Tutor', icon: '📚' },
      { code: 'WARDEN', name: 'Deputy Warden', icon: '🛡️' },
      { code: 'SECURITY', name: 'Master Security', icon: '👮' },
      { code: 'STUDENT', name: 'Hostel Student', icon: '🎒' }
    ]
  });
});

// Fallback route to serve single page app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Export app for Vercel Serverless Functions
module.exports = app;

// Listen locally if executed directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 Hostel Connect App running at http://localhost:${PORT}`);
    console.log(`====================================================`);
  });
}
