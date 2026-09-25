import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, FileText, Lock } from 'lucide-react';
import { useApplicationStore } from '../features/applications/stores/useApplicationStore';
import { AuditTimeline } from '../features/veriflow/components/AuditTimeline';
import { VerifyIntegrityControl } from '../features/veriflow/components/VerifyIntegrityControl';

export const ApplicationDetailsPage: React.FC = () => {
  const { applicationId = 'APP-2026-8841' } = useParams<{ applicationId: string }>();
  const { currentApplication } = useApplicationStore();

  const app = currentApplication || {
    applicationId,
    scholarshipTitle: 'National STEM Future Leaders Grant 2026',
    status: 'submitted',
    updatedAt: new Date().toISOString(),
    personal: {
      fullName: 'Aarav Patel',
      email: 'aarav.patel@example.com',
      phone: '+91 98765 43210',
      institution: 'IIT Madras',
      city: 'Chennai',
      state: 'Tamil Nadu',
    },
    academic: {
      role: 'college',
      collegeName: 'IIT Madras',
      degree: 'B.Tech Computer Science',
      cgpa: '9.4',
    },
    financial: {
      familyIncome: '< ₹2.5 Lakhs',
      incomeSource: 'Agriculture',
      familyMemberCount: 4,
    },
    documents: [
      { id: 'doc-1', filename: 'Aadhar_Card.pdf', type: 'id_proof', size: 1024 * 450, uploadedAt: '2026-09-21' },
      { id: 'doc-2', filename: 'Income_Certificate.pdf', type: 'income_proof', size: 1024 * 720, uploadedAt: '2026-09-22' },
      { id: 'doc-3', filename: 'Certified_Bank_Statement.pdf', type: 'bank_statement', size: 1024 * 910, uploadedAt: '2026-09-25' },
    ],
  };

  const isSubmitted = app.status === 'submitted';
  const acad = app.academic as any;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <Link to="/applications" className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-foreground">{app.scholarshipTitle}</h1>
              {isSubmitted && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase">
                  <ShieldCheck className="h-3.5 w-3.5" /> Read-Only
                </span>
              )}
            </div>
            <p className="text-xs font-mono text-muted-foreground mt-0.5">
              Application ID: <span className="font-bold text-foreground">{app.applicationId}</span>
            </p>
          </div>
        </div>

        {isSubmitted && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent border border-border text-xs text-muted-foreground font-medium">
            <Lock className="h-4 w-4 text-primary" /> Application Submitted & Locked
          </div>
        )}
      </div>

      {/* Read-Only Application Summary */}
      <div className="bg-card border border-border rounded-2xl p-6 space-y-6 shadow-sm">
        {/* Personal Details */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Personal Details</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-accent/30 p-4 rounded-xl border border-border">
            <div><span className="text-muted-foreground block">Full Name:</span> <strong className="text-foreground">{app.personal.fullName}</strong></div>
            <div><span className="text-muted-foreground block">Email:</span> <strong className="text-foreground">{app.personal.email}</strong></div>
            <div><span className="text-muted-foreground block">Phone:</span> <strong className="text-foreground">{app.personal.phone}</strong></div>
            <div><span className="text-muted-foreground block">Institution:</span> <strong className="text-foreground">{app.personal.institution}</strong></div>
            <div><span className="text-muted-foreground block">Location:</span> <strong className="text-foreground">{app.personal.city}, {app.personal.state}</strong></div>
          </div>
        </div>

        {/* Academic & Financial */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Academic Information</h3>
            <div className="space-y-1 text-xs bg-accent/30 p-4 rounded-xl border border-border">
              <div><span className="text-muted-foreground">University/School:</span> <strong className="text-foreground">{acad.collegeName || acad.schoolName}</strong></div>
              <div><span className="text-muted-foreground">Degree / Class:</span> <strong className="text-foreground">{acad.degree || acad.className}</strong></div>
              <div><span className="text-muted-foreground">Score / CGPA:</span> <strong className="text-foreground">{acad.cgpa || acad.schoolMarks}</strong></div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Financial Information</h3>
            <div className="space-y-1 text-xs bg-accent/30 p-4 rounded-xl border border-border">
              <div><span className="text-muted-foreground">Family Income:</span> <strong className="text-foreground">{app.financial.familyIncome}</strong></div>
              <div><span className="text-muted-foreground">Income Source:</span> <strong className="text-foreground">{app.financial.incomeSource}</strong></div>
              <div><span className="text-muted-foreground">Family Members:</span> <strong className="text-foreground">{app.financial.familyMemberCount}</strong></div>
            </div>
          </div>
        </div>

        {/* Uploaded Documents */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Verified Documents ({app.documents.length})</h3>
          <div className="space-y-1 text-xs bg-accent/30 p-4 rounded-xl border border-border">
            {app.documents.map((d) => (
              <div key={d.id} className="flex items-center justify-between text-muted-foreground py-1 border-b border-border/40 last:border-0">
                <span className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <strong className="text-foreground">{d.filename}</strong>
                </span>
                <span className="font-mono text-[11px]">{(d.size / 1024).toFixed(1)} KB • Uploaded {d.uploadedAt}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Timeline Component */}
        <AuditTimeline applicationId={app.applicationId} />

        {/* Cryptographic Integrity Control */}
        <VerifyIntegrityControl applicationId={app.applicationId} />
      </div>
    </div>
  );
};
