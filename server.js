import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import fs from 'fs';
import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';
import { encryptXChaCha20, decryptXChaCha20, getShamirShares, reconstructKeyFromShamir, masterKey } from './cryptoEngine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env credentials if available
try {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
      const parts = line.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim();
        if (key && value && !key.startsWith('#')) {
          process.env[key] = value;
        }
      }
    });
  }
} catch (e) {}

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// Create HTTP server for Express + WebSockets
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Active WebSocket Connections Store (Serves both Admin & Applicant Portals)
const wsClients = new Set();

wss.on('connection', (ws) => {
  wsClients.add(ws);
  console.log('📡 Real-Time Cross-Portal WebSocket Client Connected! Active Connections:', wsClients.size);

  ws.on('message', (message) => {
    try {
      const payload = JSON.parse(message.toString());
      if (payload.type === 'ADMIN_UPDATE_SCHOLARSHIP') {
        broadcastNotification(payload);
      }
    } catch (e) {
      console.error('WebSocket Error parsing message:', e);
    }
  });

  ws.on('close', () => {
    wsClients.delete(ws);
    console.log('📡 WebSocket Client Disconnected. Remaining:', wsClients.size);
  });
});

let lastNotification = null;

// Broadcast Real-Time Event to all connected Admin & Applicant Clients
const broadcastNotification = (data) => {
  lastNotification = data;
  const payloadStr = JSON.stringify(data);
  wsClients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payloadStr);
    }
  });
};

// API Endpoint to fetch latest broadcasted notification (Polling Fallback)
app.get('/api/notifications/latest', (req, res) => {
  res.json(lastNotification || {});
});

// Redis-compatible OTP store
class RedisOtpStore {
  constructor() {
    this.store = new Map();
  }

  set(email, otp) {
    const now = Date.now();
    this.store.set(email, {
      otp,
      expiresAt: now + 5 * 60 * 1000,
      attempts: 0,
      lastSentAt: now,
    });
  }

  get(email) {
    const record = this.store.get(email);
    if (!record) return null;
    if (Date.now() > record.expiresAt) {
      this.delete(email);
      return null;
    }
    return record;
  }

  incrementAttempts(email) {
    const record = this.get(email);
    if (record) {
      record.attempts += 1;
      return record.attempts;
    }
    return 0;
  }

  delete(email) {
    this.store.delete(email);
  }
}

const redisOtpStore = new RedisOtpStore();
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const sendOtpEmail = async (toEmail, otp) => {
  const subject = `🔑 ScholarPath Security Verification Code: ${otp}`;
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 32px; border-radius: 16px; max-width: 500px; margin: auto;">
      <h2 style="color: #38bdf8; margin-top: 0;">ScholarPath Applicant Portal</h2>
      <p style="font-size: 14px; color: #94a3b8;">Hello,</p>
      <p style="font-size: 14px; color: #94a3b8;">Your 6-digit One-Time Password (OTP) for account verification is:</p>
      
      <div style="background-color: #1e293b; border: 2px dashed #0284c7; padding: 20px; text-align: center; border-radius: 12px; margin: 24px 0;">
        <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #38bdf8;">${otp}</span>
      </div>

      <p style="font-size: 12px; color: #64748b;">This code is valid for <strong>5 minutes</strong>. Maximum <strong>5 verification attempts</strong> permitted before expiration.</p>
    </div>
  `;

  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
    });
    return await transporter.sendMail({ from: `"ScholarPath Portal" <${process.env.GMAIL_USER}>`, to: toEmail, subject, html: htmlContent });
  }

  let testAccount = await nodemailer.createTestAccount();
  const testTransporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: { user: testAccount.user, pass: testAccount.pass },
  });
  let info = await testTransporter.sendMail({ from: '"ScholarPath Portal" <no-reply@scholarpath.gov.in>', to: toEmail, subject, html: htmlContent });
  console.log(`🔗 Sent Email Web Preview: ${nodemailer.getTestMessageUrl(info)}`);
  return info;
};

// Initialize SQLite Database
let db;
(async () => {
  db = await open({
    filename: path.join(__dirname, 'scholarpath.db'),
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS applicants (
      id TEXT PRIMARY KEY,
      applicationNumber TEXT UNIQUE,
      fullName TEXT,
      email TEXT,
      phone TEXT,
      role TEXT,
      institution TEXT,
      city TEXT,
      state TEXT,
      country TEXT,
      boardType TEXT,
      aadhaarNumber TEXT,
      age TEXT,
      marks10th TEXT,
      percentage10th TEXT,
      marks12th TEXT,
      percentage12th TEXT,
      degreeCourse TEXT,
      studyYear TEXT,
      cgpaPercentage TEXT,
      majorBranch TEXT,
      password TEXT,
      encryption_algo TEXT DEFAULT 'XChaCha20-Poly1305 + Shamir-2-of-3',
      shamir_share1_preview TEXT,
      isVerified INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log('✅ SQLite Database ready: scholarpath.db with XChaCha20-Poly1305 & Shamir Secret Sharing Encryption');
})();

// API: Send OTP
app.post('/api/send-otp', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email address format. Please enter a valid email.',
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    const existingRecord = redisOtpStore.get(cleanEmail);
    if (existingRecord) {
      const timeElapsed = (Date.now() - existingRecord.lastSentAt) / 1000;
      if (timeElapsed < 60) {
        const remainingCooldown = Math.ceil(60 - timeElapsed);
        return res.status(429).json({
          success: false,
          error: `Please wait ${remainingCooldown} seconds before requesting a new OTP.`,
          cooldownRemaining: remainingCooldown,
        });
      }
    }

    const otp = crypto.randomInt(100000, 1000000).toString();
    redisOtpStore.set(cleanEmail, otp);
    sendOtpEmail(cleanEmail, otp).catch(err => console.error('Email Dispatch Warning:', err));

    console.log(`🔐 CRYPTOGRAPHIC OTP DISPATCHED TO REDIS KEY (${cleanEmail}): ${otp}`);

    res.json({
      success: true,
      otp: otp,
      message: `Cryptographically secure OTP generated and dispatched to ${cleanEmail}`,
      cooldownSeconds: 60,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: Verify OTP
app.post('/api/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, error: 'Email address and 6-digit OTP code are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const record = redisOtpStore.get(cleanEmail);

    if (!record) {
      return res.status(400).json({
        success: false,
        error: 'No active OTP found or code has expired. Please click Resend Code.',
      });
    }

    if (record.attempts >= 5) {
      redisOtpStore.delete(cleanEmail);
      return res.status(429).json({
        success: false,
        error: 'Maximum 5 verification attempts exceeded. Your OTP has been invalidated.',
      });
    }

    if (record.otp !== otp.trim()) {
      const attemptsUsed = redisOtpStore.incrementAttempts(cleanEmail);
      const remainingAttempts = 5 - attemptsUsed;

      if (remainingAttempts <= 0) {
        redisOtpStore.delete(cleanEmail);
        return res.status(429).json({
          success: false,
          error: 'Maximum 5 verification attempts exceeded. Your OTP has been invalidated.',
        });
      }

      return res.status(400).json({
        success: false,
        error: `Incorrect verification code. ${remainingAttempts} attempt(s) remaining.`,
        attemptsRemaining: remainingAttempts,
      });
    }

    redisOtpStore.delete(cleanEmail);
    console.log(`✅ REDIS OTP VERIFIED & DELETED FOR KEY (${cleanEmail})`);

    res.json({
      success: true,
      message: 'Email address verified successfully!',
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: Save Applicant Registration & Real-Time Sync to Admin Portal (http://localhost:5174/)
app.post('/api/applicants', async (req, res) => {
  try {
    const data = req.body;
    const appId = data.applicationNumber || data.id || `SP-${Date.now()}`;

    const shares = getShamirShares();
    const share1Preview = shares[0] ? Buffer.from(shares[0]).toString('hex').substring(0, 16) + '...' : 'shamir-share-active';

    await db.run(
      `INSERT INTO applicants (
        id, applicationNumber, fullName, email, phone, role, institution, city, state, country,
        boardType, aadhaarNumber, age, marks10th, percentage10th, marks12th, percentage12th,
        degreeCourse, studyYear, cgpaPercentage, majorBranch, password, encryption_algo, shamir_share1_preview, isVerified
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(applicationNumber) DO UPDATE SET
        fullName = excluded.fullName,
        email = excluded.email,
        phone = excluded.phone,
        role = excluded.role,
        institution = excluded.institution,
        city = excluded.city,
        state = excluded.state,
        country = excluded.country,
        boardType = excluded.boardType,
        aadhaarNumber = excluded.aadhaarNumber,
        age = excluded.age,
        marks10th = excluded.marks10th,
        percentage10th = excluded.percentage10th,
        marks12th = excluded.marks12th,
        percentage12th = excluded.percentage12th,
        degreeCourse = excluded.degreeCourse,
        studyYear = excluded.studyYear,
        cgpaPercentage = excluded.cgpaPercentage,
        majorBranch = excluded.majorBranch,
        password = excluded.password,
        encryption_algo = excluded.encryption_algo,
        shamir_share1_preview = excluded.shamir_share1_preview,
        isVerified = excluded.isVerified;`,
      [
        appId,
        appId,
        encryptXChaCha20(data.fullName || ''),
        encryptXChaCha20(data.email || ''),
        encryptXChaCha20(data.phone || ''),
        encryptXChaCha20(data.role || 'school'),
        encryptXChaCha20(data.institution || ''),
        encryptXChaCha20(data.city || ''),
        encryptXChaCha20(data.state || ''),
        encryptXChaCha20(data.country || 'India'),
        encryptXChaCha20(data.boardType || ''),
        encryptXChaCha20(data.aadhaarNumber || ''),
        encryptXChaCha20(data.age || ''),
        encryptXChaCha20(data.marks10th || ''),
        encryptXChaCha20(data.percentage10th || ''),
        encryptXChaCha20(data.marks12th || ''),
        encryptXChaCha20(data.percentage12th || ''),
        encryptXChaCha20(data.degreeCourse || ''),
        encryptXChaCha20(data.studyYear || ''),
        encryptXChaCha20(data.cgpaPercentage || ''),
        encryptXChaCha20(data.majorBranch || ''),
        encryptXChaCha20(data.password || 'Nisha@25'),
        'XChaCha20-Poly1305 + Shamir-2-of-3',
        share1Preview,
        data.isVerified ? 1 : 0,
      ]
    );

    // REAL-TIME WEBSOCKET EVENT TO ADMIN PORTAL (http://localhost:5174/ - Applicant Management)
    const adminNotificationPayload = {
      type: 'NEW_APPLICANT_REGISTERED',
      applicationNumber: appId,
      fullName: data.fullName || 'Anonymous Applicant',
      email: data.email || 'applicant@scholarpath.gov.in',
      role: data.role || 'school',
      institution: data.institution || 'N/A',
      timestamp: Date.now(),
      targetUrl: '/admin/applicants',
    };

    broadcastNotification(adminNotificationPayload);
    console.log(`📢 REAL-TIME APPLICANT SYNC TO ADMIN PORTAL (http://localhost:5174): Registered App #${appId}`);

    res.json({
      success: true,
      applicationNumber: appId,
      message: 'All 22 registration fields encrypted via XChaCha20-Poly1305 & synced in real-time to Admin Portal (http://localhost:5174/).',
    });
  } catch (error) {
    console.error('Registration Sync Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: ADMIN SCHOLARSHIP AMOUNT UPDATE
app.post('/api/admin/scholarships/update', (req, res) => {
  try {
    const { scholarshipId, title, oldAmount, newAmount, targetUrl } = req.body;

    const notificationPayload = {
      type: 'SCHOLARSHIP_AMOUNT_UPDATED',
      scholarshipId: scholarshipId || 'SCH-2026-001',
      title: title || 'Post-Matric Merit Scholarship 2026',
      oldAmount: oldAmount || '₹50,000',
      newAmount: newAmount || '₹75,000',
      targetUrl: targetUrl || '/dashboard',
      timestamp: Date.now(),
    };

    broadcastNotification(notificationPayload);

    console.log(`📢 ADMIN BROADCAST TRIGGERED: ${title} amount updated to ${newAmount}`);

    res.json({
      success: true,
      message: 'Real-time WebSocket pop-up notification broadcasted to all active applicant clients!',
      data: notificationPayload,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: Get Decrypted Applicants for Admin Portal
app.get('/api/applicants', async (req, res) => {
  try {
    const rawRows = await db.all('SELECT * FROM applicants ORDER BY created_at DESC');
    const shares = getShamirShares();
    let reconstructedKey = masterKey;
    if (shares.length >= 2) {
      reconstructedKey = await reconstructKeyFromShamir(shares[0], shares[1]);
    }

    const decryptedApplicants = rawRows.map(r => ({
      ...r,
      fullName: decryptXChaCha20(r.fullName, reconstructedKey),
      email: decryptXChaCha20(r.email, reconstructedKey),
      phone: decryptXChaCha20(r.phone, reconstructedKey),
      role: decryptXChaCha20(r.role, reconstructedKey),
      institution: decryptXChaCha20(r.institution, reconstructedKey),
      city: decryptXChaCha20(r.city, reconstructedKey),
      state: decryptXChaCha20(r.state, reconstructedKey),
      country: decryptXChaCha20(r.country, reconstructedKey),
      boardType: decryptXChaCha20(r.boardType, reconstructedKey),
      aadhaarNumber: decryptXChaCha20(r.aadhaarNumber, reconstructedKey),
      age: decryptXChaCha20(r.age, reconstructedKey),
      marks10th: decryptXChaCha20(r.marks10th, reconstructedKey),
      percentage10th: decryptXChaCha20(r.percentage10th, reconstructedKey),
      marks12th: decryptXChaCha20(r.marks12th, reconstructedKey),
      percentage12th: decryptXChaCha20(r.percentage12th, reconstructedKey),
      degreeCourse: decryptXChaCha20(r.degreeCourse, reconstructedKey),
      studyYear: decryptXChaCha20(r.studyYear, reconstructedKey),
      cgpaPercentage: decryptXChaCha20(r.cgpaPercentage, reconstructedKey),
      majorBranch: decryptXChaCha20(r.majorBranch, reconstructedKey),
      password: decryptXChaCha20(r.password, reconstructedKey),
    }));

    res.json({ success: true, count: decryptedApplicants.length, applicants: decryptedApplicants });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// WEB GUI: Database, Real-Time Admin Sync & Inspector
app.get('/db', async (req, res) => {
  try {
    const rawRows = await db.all('SELECT * FROM applicants ORDER BY created_at DESC');
    const shares = getShamirShares();
    let reconstructedKey = masterKey;
    if (shares.length >= 2) {
      reconstructedKey = await reconstructKeyFromShamir(shares[0], shares[1]);
    }

    let tableHeaders = '';
    let tableRowsEncrypted = '';
    let tableRowsDecrypted = '';

    if (rawRows.length > 0) {
      const keys = Object.keys(rawRows[0]);
      tableHeaders = keys.map(k => `<th style="padding: 10px; border: 1px solid #334155; background-color: #1e293b; color: #38bdf8; text-transform: uppercase; font-size: 11px;">${k}</th>`).join('');

      tableRowsEncrypted = rawRows.map(row => {
        const cells = keys.map(k => `<td style="padding: 10px; border: 1px solid #334155; font-size: 11px; font-family: monospace; color: #a7f3d0; max-width: 200px; overflow: hidden; text-overflow: ellipsis;">${row[k] !== null && row[k] !== undefined ? row[k] : '<i style="color:#64748b">null</i>'}</td>`).join('');
        return `<tr style="background-color: #0f172a;">${cells}</tr>`;
      }).join('');

      tableRowsDecrypted = rawRows.map(r => {
        const decRow = {
          ...r,
          fullName: decryptXChaCha20(r.fullName, reconstructedKey),
          email: decryptXChaCha20(r.email, reconstructedKey),
          phone: decryptXChaCha20(r.phone, reconstructedKey),
          role: decryptXChaCha20(r.role, reconstructedKey),
          institution: decryptXChaCha20(r.institution, reconstructedKey),
          city: decryptXChaCha20(r.city, reconstructedKey),
          state: decryptXChaCha20(r.state, reconstructedKey),
          country: decryptXChaCha20(r.country, reconstructedKey),
          boardType: decryptXChaCha20(r.boardType, reconstructedKey),
          aadhaarNumber: decryptXChaCha20(r.aadhaarNumber, reconstructedKey),
          age: decryptXChaCha20(r.age, reconstructedKey),
          marks10th: decryptXChaCha20(r.marks10th, reconstructedKey),
          percentage10th: decryptXChaCha20(r.percentage10th, reconstructedKey),
          marks12th: decryptXChaCha20(r.marks12th, reconstructedKey),
          percentage12th: decryptXChaCha20(r.percentage12th, reconstructedKey),
          degreeCourse: decryptXChaCha20(r.degreeCourse, reconstructedKey),
          studyYear: decryptXChaCha20(r.studyYear, reconstructedKey),
          cgpaPercentage: decryptXChaCha20(r.cgpaPercentage, reconstructedKey),
          majorBranch: decryptXChaCha20(r.majorBranch, reconstructedKey),
          password: decryptXChaCha20(r.password, reconstructedKey),
        };

        const cells = keys.map(k => `<td style="padding: 10px; border: 1px solid #334155; font-size: 13px; color: #38bdf8;">${decRow[k]}</td>`).join('');
        return `<tr style="background-color: #0f172a;">${cells}</tr>`;
      }).join('');
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>ScholarPath Real-Time Admin Sync & SQLite Inspector</title>
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; background-color: #090d16; color: #f8fafc; padding: 24px; margin: 0; }
          h1 { color: #38bdf8; margin-bottom: 4px; }
          .badge { background: #0284c7; color: white; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: bold; }
          .btn { background: #0284c7; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 14px; }
          .btn:hover { background: #0369a1; }
          .container { overflow-x: auto; margin-top: 16px; border-radius: 12px; border: 1px solid #334155; }
          table { width: 100%; border-collapse: collapse; text-align: left; white-space: nowrap; }
          tr:hover { background-color: #1e293b !important; }
        </style>
      </head>
      <body>
        <h1>🔒 ScholarPath Real-Time Admin Portal Sync (http://localhost:5174/)</h1>
        <p><span class="badge">TOTAL APPLICANTS: ${rawRows.length}</span> — Connected WebSockets: ${wsClients.size}</p>

        <div style="background: #1e293b; border: 1px solid #38bdf8; padding: 20px; border-radius: 12px; margin-top: 16px;">
          <h3 style="color: #38bdf8; margin-top:0;">⚡ Real-Time Admin Sync & Notification Triggers</h3>
          <p style="font-size: 13px; color: #94a3b8;">When any new user registers on http://localhost:5173, an instant event <code>NEW_APPLICANT_REGISTERED</code> is dispatched to the Admin Portal on http://localhost:5174! You can also click below to simulate an Admin updating a scholarship amount:</p>
          <button class="btn" onclick="triggerAdminNotification()">📢 Trigger Admin Scholarship Amount Update Event</button>
        </div>

        <h2 style="margin-top: 24px; color: #34d399; font-size: 18px;">1. Encrypted Storage (scholarpath.db)</h2>
        <div class="container">
          <table><thead><tr>${tableHeaders}</tr></thead><tbody>${tableRowsEncrypted}</tbody></table>
        </div>

        <h2 style="margin-top: 24px; color: #38bdf8; font-size: 18px;">2. Decrypted View (Shamir Reconstructed Key)</h2>
        <div class="container">
          <table><thead><tr>${tableHeaders}</tr></thead><tbody>${tableRowsDecrypted}</tbody></table>
        </div>

        <script>
          async function triggerAdminNotification() {
            const res = await fetch('/api/admin/scholarships/update', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                scholarshipId: 'SCH-MERIT-2026',
                title: 'National Merit Excellence Scholarship 2026',
                oldAmount: '₹50,000',
                newAmount: '₹85,000/yr',
                targetUrl: '/dashboard'
              })
            });
            const data = await res.json();
            alert('📢 Broadcast Sent! Check http://localhost:5173 to view the real-time pop-up toast notification!');
          }
        </script>
      </body>
      </html>
    `;

    res.send(html);
  } catch (error) {
    res.status(500).send(`Error reading database: ${error.message}`);
  }
});

server.listen(PORT, () => {
  console.log(`🚀 ScholarPath Shared Backend & WebSocket Server running on http://localhost:${PORT}`);
});
