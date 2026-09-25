import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
  const db = await open({
    filename: path.join(__dirname, 'scholarpath.db'),
    driver: sqlite3.Database,
  });

  console.log('================================================================================');
  console.log('📁 SCHOLARPATH SQLITE DATABASE — COMPLETE FIELD INSPECTOR (scholarpath.db)');
  console.log('================================================================================');

  const rows = await db.all('SELECT * FROM applicants ORDER BY created_at DESC');

  if (rows.length === 0) {
    console.log('ℹ️ No applicant records currently found in scholarpath.db');
  } else {
    console.log(`FOUND ${rows.length} RECORD(S) IN SQLITE DATABASE:\n`);

    rows.forEach((r, idx) => {
      console.log(`--- APPLICANT #${idx + 1} [Application ID: ${r.applicationNumber}] ---`);
      console.log(`📌 Full Name:        ${r.fullName}`);
      console.log(`📌 Email Address:    ${r.email}`);
      console.log(`📌 Phone Number:     ${r.phone}`);
      console.log(`📌 Applicant Role:   ${r.role}`);
      console.log(`📌 Institution:      ${r.institution}`);
      console.log(`📌 Location:         ${r.city}, ${r.state}, ${r.country}`);
      console.log(`📌 Board Type:       ${r.boardType || 'N/A'}`);
      console.log(`📌 Aadhaar Number:   ${r.aadhaarNumber || 'N/A'}`);
      console.log(`📌 Age / DOB:        ${r.age || 'N/A'}`);
      console.log(`📌 10th Marks:       ${r.marks10th || 'N/A'} (${r.percentage10th || 'N/A'}%)`);
      console.log(`📌 12th Marks:       ${r.marks12th || 'N/A'} (${r.percentage12th || 'N/A'}%)`);
      console.log(`📌 Degree / Course:  ${r.degreeCourse || 'N/A'}`);
      console.log(`📌 Year of Study:    ${r.studyYear || 'N/A'}`);
      console.log(`📌 Major / Branch:   ${r.majorBranch || 'N/A'}`);
      console.log(`📌 CGPA / %:         ${r.cgpaPercentage || 'N/A'}`);
      console.log(`📌 Date Registered:  ${r.created_at}`);
      console.log('--------------------------------------------------------------------------------\n');
    });
  }

  console.log('================================================================================');
})();
