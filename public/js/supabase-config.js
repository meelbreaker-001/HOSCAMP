/* ==========================================================================
   HostelConnect - Supabase Cloud Database Configuration
   Adhiyamaan College of Engineering (ACE)
   ========================================================================== */

/**
 * Configure your Supabase Project credentials:
 * 1. Visit https://supabase.com/dashboard
 * 2. Open your Project -> Settings (gear icon) -> API
 * 3. Copy "Project URL" and the "anon public" API Key.
 * 4. Paste them here OR configure them via the "⚙️ Cloud DB Settings" modal in the portal.
 */
window.SUPABASE_CONFIG = {
  // Enter your Supabase Project URL (e.g. 'https://xyzcompany.supabase.co')
  url: localStorage.getItem('hoscamp_supabase_url') || '',

  // Enter your Supabase Project Public Anon Key (starts with 'eyJ...')
  anonKey: localStorage.getItem('hoscamp_supabase_anon_key') || '',

  // Automatically fall back to LocalStorage if offline or unconfigured
  fallbackToLocalStorage: true
};
