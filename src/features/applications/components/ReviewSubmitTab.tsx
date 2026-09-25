import React, { useState } from 'react';
import { useApplicationStore } from '../stores/useApplicationStore';
import { AuditTimeline } from '../../veriflow/components/AuditTimeline';
import { VerifyIntegrityControl } from '../../veriflow/components/VerifyIntegrityControl';
import { validateApplicationDraft, submitApplicationBackend, SubmissionResponse } from '../services/submissionService';
import { CheckCircle2, Edit3, Send, Sparkles, AlertCircle, AlertTriangle, RefreshCw, X, ShieldCheck } from 'lucide-react';

interface ReviewSubmitTabProps {
  onEditTab: (tabIndex: number) => void;
}

export const ReviewSubmitTab: React.FC<ReviewSubmitTabProps> = ({ onEditTab }) => {
  const { currentApplication, lockedFields, submitApplication } = useApplicationStore();
  
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [submissionData, setSubmissionData] = useState<SubmissionResponse | null>(
    currentApplication?.status === 'submitted'
      ? {
          success: true,
          applicationId: currentApplication.applicationId,
          submissionDate: new Date(currentApplication.updatedAt).toLocaleString(),
          status: 'submitted',
          message: 'Application submitted successfully to backend.',
        }
      : null
  );

  if (!currentApplication) return null;

  const isSubmitted = currentApplication.status === 'submitted' || !!submissionData;
  const { personal, academic, financial, documents } = currentApplication;

  const handleInitiateSubmission = () => {
    setValidationErrors([]);
    // Perform pre-submission dual validation (Frontend + VeriFlow Locks check)
    const valResult = validateApplicationDraft(currentApplication, lockedFields);

    if (!valResult.valid) {
      setValidationErrors(valResult.errors);
      return;
    }

    setShowConfirmModal(true);
  };

  const handleConfirmSubmission = async () => {
    setSubmitting(true);
    try {
      const res = await submitApplicationBackend(currentApplication, lockedFields);
      submitApplication(); // Transitions Zustand & LocalStorage state to 'submitted'
      setSubmissionData(res);
      setShowConfirmModal(false);
    } catch (err: any) {
      setValidationErrors([err.message || 'Submission failed on server. Please try again.']);
      setShowConfirmModal(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="border-b border-border pb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" /> Step 5: Review & Submit Application
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Read-only summary of all sections. Final submission freezes application state.
          </p>
        </div>

        {isSubmitted && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold uppercase">
            <ShieldCheck className="h-4 w-4" /> Application Submitted
          </span>
        )}
      </div>

      {/* Submission Errors Alert Box */}
      {validationErrors.length > 0 && (
        <div className="p-4 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive text-xs space-y-1.5">
          <div className="flex items-center gap-2 font-bold">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>Pre-Submission Validation Failed:</span>
          </div>
          <ul className="list-disc list-inside space-y-0.5 text-[11px] pl-1">
            {validationErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* SUCCESS CONFIRMATION SCREEN */}
      {isSubmitted ? (
        <div className="p-8 bg-emerald-500/10 border-2 border-emerald-500/30 rounded-2xl text-center space-y-4 shadow-lg">
          <div className="bg-emerald-500 text-white p-3.5 rounded-full w-14 h-14 mx-auto flex items-center justify-center shadow-md animate-bounce">
            <Sparkles className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-extrabold text-foreground">Application Submitted Successfully</h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Your application has been locked and securely recorded on ScholarPath servers with VeriFlow fact verification.
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-4 max-w-md mx-auto grid grid-cols-2 gap-3 text-left text-xs font-mono">
            <div>
              <span className="text-[10px] text-muted-foreground block uppercase">Application ID:</span>
              <strong className="text-foreground">{submissionData?.applicationId || currentApplication.applicationId}</strong>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground block uppercase">Scholarship:</span>
              <strong className="text-foreground truncate block">{currentApplication.scholarshipTitle}</strong>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground block uppercase">Submission Date:</span>
              <strong className="text-foreground">{submissionData?.submissionDate || 'Just now'}</strong>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground block uppercase">Status:</span>
              <strong className="text-emerald-600 dark:text-emerald-400 uppercase font-bold">
                {submissionData?.status || 'Submitted'}
              </strong>
            </div>
          </div>
        </div>
      ) : (
        /* READ-ONLY SUMMARY SECTION */
        <div className="space-y-6">
          {/* Personal Summary */}
          <div className="bg-card border border-border rounded-xl p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h3 className="text-sm font-bold text-foreground">1. Personal Information</h3>
              <button
                type="button"
                onClick={() => onEditTab(0)}
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                <Edit3 className="h-3.5 w-3.5" /> Edit
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div><span className="text-muted-foreground block">Name:</span> <strong className="text-foreground">{personal.fullName}</strong></div>
              <div><span className="text-muted-foreground block">Email:</span> <strong className="text-foreground">{personal.email}</strong></div>
              <div><span className="text-muted-foreground block">Phone:</span> <strong className="text-foreground">{personal.phone}</strong></div>
              <div><span className="text-muted-foreground block">Institution:</span> <strong className="text-foreground">{personal.institution}</strong></div>
              <div><span className="text-muted-foreground block">Location:</span> <strong className="text-foreground">{personal.city}, {personal.state}</strong></div>
            </div>
          </div>

          {/* Academic Summary */}
          <div className="bg-card border border-border rounded-xl p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h3 className="text-sm font-bold text-foreground">2. Academic Information</h3>
              <button
                type="button"
                onClick={() => onEditTab(1)}
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                <Edit3 className="h-3.5 w-3.5" /> Edit
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div><span className="text-muted-foreground block">Role:</span> <strong className="text-foreground capitalize">{academic.role}</strong></div>
              {academic.role === 'college' && (
                <>
                  <div><span className="text-muted-foreground block">University:</span> <strong className="text-foreground">{academic.collegeName}</strong></div>
                  <div><span className="text-muted-foreground block">Degree:</span> <strong className="text-foreground">{academic.degree}</strong></div>
                  <div><span className="text-muted-foreground block">CGPA:</span> <strong className="text-foreground">{academic.cgpa}</strong></div>
                </>
              )}
              {academic.role === 'school' && (
                <>
                  <div><span className="text-muted-foreground block">School:</span> <strong className="text-foreground">{academic.schoolName}</strong></div>
                  <div><span className="text-muted-foreground block">Class:</span> <strong className="text-foreground">{academic.className}</strong></div>
                  <div><span className="text-muted-foreground block">Marks:</span> <strong className="text-foreground">{academic.schoolMarks}</strong></div>
                </>
              )}
            </div>
          </div>

          {/* Financial Summary */}
          <div className="bg-card border border-border rounded-xl p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h3 className="text-sm font-bold text-foreground">3. Financial Information</h3>
              <button
                type="button"
                onClick={() => onEditTab(2)}
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                <Edit3 className="h-3.5 w-3.5" /> Edit
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div><span className="text-muted-foreground block">Family Income:</span> <strong className="text-foreground">{financial.familyIncome}</strong></div>
              <div><span className="text-muted-foreground block">Income Source:</span> <strong className="text-foreground">{financial.incomeSource}</strong></div>
              <div><span className="text-muted-foreground block">Members:</span> <strong className="text-foreground">{financial.familyMemberCount}</strong></div>
            </div>
          </div>

          {/* Documents Summary */}
          <div className="bg-card border border-border rounded-xl p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h3 className="text-sm font-bold text-foreground">4. Uploaded Documents ({documents.length})</h3>
              <button
                type="button"
                onClick={() => onEditTab(3)}
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                <Edit3 className="h-3.5 w-3.5" /> Edit
              </button>
            </div>
            <div className="space-y-1 text-xs">
              {documents.map((d) => (
                <div key={d.id} className="text-muted-foreground">
                  • <strong className="text-foreground">{d.filename}</strong> ({(d.size / 1024).toFixed(1)} KB)
                </div>
              ))}
            </div>
          </div>

          {/* Audit Timeline Section */}
          <AuditTimeline applicationId={currentApplication.applicationId} />

          {/* Cryptographic Integrity Verification Control */}
          <VerifyIntegrityControl applicationId={currentApplication.applicationId} />

          {/* Submit Action Control Bar */}
          <div className="p-4 rounded-xl bg-accent/40 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <AlertCircle className="h-4 w-4 text-primary shrink-0" />
              <span>By submitting, you certify that all information provided is accurate and complete.</span>
            </div>

            <button
              type="button"
              onClick={handleInitiateSubmission}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition-all shrink-0"
            >
              <Send className="h-4 w-4" /> Submit Application
            </button>
          </div>
        </div>
      )}

      {/* FINAL SUBMISSION CONFIRMATION MODAL */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-5 relative">
            <button
              type="button"
              onClick={() => setShowConfirmModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Send className="h-5 w-5 text-emerald-600" /> Confirm Final Submission
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Are you sure you want to submit this application? Once submitted, your data will become read-only and recorded with VeriFlow audit integrity.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={submitting}
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-accent text-accent-foreground hover:bg-accent/80 transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={submitting}
                onClick={handleConfirmSubmission}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all disabled:opacity-50"
              >
                {submitting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {submitting ? 'Submitting to Backend...' : 'Yes, Submit Application'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
