import http.server
import socketserver
import os
import sys
import json
import sqlite3
from datetime import datetime

PORT = 3000
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PUBLIC_DIR = os.path.join(BASE_DIR, 'public')
DB_PATH = os.path.join(BASE_DIR, 'database', 'security_audit.db')

def init_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS security_access_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            client_ip TEXT NOT NULL,
            route TEXT,
            action TEXT,
            username TEXT,
            user_agent TEXT,
            details TEXT
        )
    ''')
    conn.commit()
    conn.close()

def log_security_event(client_ip, route, action, username, user_agent, details=''):
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO security_access_logs (client_ip, route, action, username, user_agent, details)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (client_ip, route, action, username, user_agent, details))
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"[SECURITY DB ERROR] {e}", file=sys.stderr)

class SecurePortalHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=PUBLIC_DIR, **kwargs)

    def get_client_ip(self):
        # Check X-Forwarded-For header if behind a proxy
        forwarded = self.headers.get('X-Forwarded-For')
        if forwarded:
            return forwarded.split(',')[0].strip()
        return self.client_address[0]

    def do_POST(self):
        if self.path == '/api/security/log-access':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length).decode('utf-8')
            
            action = 'PAGE_VISIT'
            username = 'ANONYMOUS'
            details = ''
            
            if post_data:
                try:
                    payload = json.loads(post_data)
                    action = payload.get('action', action)
                    username = payload.get('username', username)
                    details = payload.get('details', '')
                except Exception:
                    pass

            client_ip = self.get_client_ip()
            user_agent = self.headers.get('User-Agent', 'Unknown')

            # Securely insert into database
            log_security_event(client_ip, self.path, action, username, user_agent, details)

            # Return 204 No Content - strictly zero log data exposed to browser
            self.send_response(204)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            return
        
        # Default response for other POST requests
        self.send_response(404)
        self.end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

def view_logs():
    if not os.path.exists(DB_PATH):
        print("Database not created yet.")
        return
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT id, timestamp, client_ip, action, username, route, details FROM security_access_logs ORDER BY id DESC LIMIT 50")
    rows = cursor.fetchall()
    conn.close()
    
    print("=" * 95)
    print(f"{'ID':<4} | {'TIMESTAMP':<19} | {'CLIENT IP':<15} | {'ACTION':<18} | {'USER':<16} | {'DETAILS'}")
    print("=" * 95)
    for r in rows:
        print(f"{r[0]:<4} | {str(r[1]):<19} | {str(r[2]):<15} | {str(r[3]):<18} | {str(r[4]):<16} | {str(r[6] or '-')}")
    print("=" * 95)
    print(f"Total records displayed: {len(rows)}")

if __name__ == '__main__':
    init_db()
    if len(sys.argv) > 1 and sys.argv[1] in ('--view-logs', '-v', 'logs'):
        view_logs()
        sys.exit(0)

    # Enable socket reuse
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), SecurePortalHTTPRequestHandler) as httpd:
        print("================================================================")
        print("[*] HostelConnect Server running with Secure SQLite Database")
        print(f"[*] Serving http://localhost:{PORT}")
        print(f"[*] Security Audit DB: {DB_PATH}")
        print("[*] Run 'python server.py --view-logs' to inspect database logs")
        print("================================================================")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")
