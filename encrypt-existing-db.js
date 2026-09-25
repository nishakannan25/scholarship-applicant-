import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import { encryptXChaCha20, getShamirShares } from './cryptoEngine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
  const db = await open({
    filename: path.join(__dirname, 'scholarpath.db'),
    driver: sqlite3.Database,
  });

  // Ensure table exists
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
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Safely add missing columns if upgrading schema
  const tryAddCol = async (sql) => {
    try { await db.exec(sql); } catch (e) {}
  };

  await tryAddCol('ALTER TABLE applicants ADD COLUMN password TEXT;');
  await tryAddCol("ALTER TABLE applicants ADD COLUMN encryption_algo TEXT DEFAULT 'XChaCha20-Poly1305 + Shamir-2-of-3';");
  await tryAddCol('ALTER TABLE applicants ADD COLUMN shamir_share1_preview TEXT;');
  await tryAddCol('ALTER TABLE applicants ADD COLUMN isVerified INTEGER DEFAULT 1;');

  console.log('🔄 STARTING MIGRATION: Encrypting all existing plaintext rows in scholarpath.db...');

  const rows = await db.all('SELECT * FROM applicants');

  const shares = getShamirShares();
  const share1Preview = shares[0] ? Buffer.from(shares[0]).toString('hex').substring(0, 16) + '...' : 'shamir-share-active';

  for (const r of rows) {
    const encryptField = (val) => {
      if (!val || String(val).startsWith('xchacha20:')) return val;
      return encryptXChaCha20(String(val));
    };

    await db.run(
      `UPDATE applicants SET
        fullName = ?,
        email = ?,
        phone = ?,
        role = ?,
        institution = ?,
        city = ?,
        state = ?,
        country = ?,
        boardType = ?,
        aadhaarNumber = ?,
        age = ?,
        marks10th = ?,
        percentage10th = ?,
        marks12th = ?,
        percentage12th = ?,
        degreeCourse = ?,
        studyYear = ?,
        cgpaPercentage = ?,
        majorBranch = ?,
        password = ?,
        encryption_algo = 'XChaCha20-Poly1305 + Shamir-2-of-3',
        shamir_share1_preview = ?
      WHERE applicationNumber = ?`,
      [
        encryptField(r.fullName),
        encryptField(r.email),
        encryptField(r.phone),
        encryptField(r.role),
        encryptField(r.institution),
        encryptField(r.city),
        encryptField(r.state),
        encryptField(r.country),
        encryptField(r.boardType),
        encryptField(r.aadhaarNumber),
        encryptField(r.age),
        encryptField(r.marks10th),
        encryptField(r.percentage10th),
        encryptField(r.marks12th),
        encryptField(r.percentage12th),
        encryptField(r.degreeCourse),
        encryptField(r.studyYear),
        encryptField(r.cgpaPercentage),
        encryptField(r.majorBranch),
        encryptField(r.password || 'Nisha@25'),
        share1Preview,
        r.applicationNumber,
      ]
    );
  }

  console.log(`✅ SUCCESS: Encrypted ${rows.length} record(s) in scholarpath.db with XChaCha20-Poly1305 & Shamir Key Sharing!`);
})();
