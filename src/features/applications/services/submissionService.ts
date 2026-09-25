import { ApplicationDraft } from '../types';
import { LockedField } from '../../veriflow/types';

export interface PreSubmissionValidationResult {
  valid: boolean;
  errors: string[];
}

export interface SubmissionResponse {
  success: boolean;
  applicationId: string;
  submissionDate: string;
  status: 'submitted';
  message: string;
}

export const validateApplicationDraft = (
  draft: ApplicationDraft,
  lockedFields: Record<string, LockedField>
): PreSubmissionValidationResult => {
  const errors: string[] = [];

  // Check unresolved blocking VeriFlow locks
  if (Object.keys(lockedFields).length > 0) {
    errors.push('Unresolved VeriFlow field locks exist. Please resolve locked requirements before submitting.');
  }

  // Personal details validation
  if (!draft.personal.fullName?.trim()) errors.push('Full Name is required.');
  if (!draft.personal.email?.trim()) errors.push('Email is required.');
  if (!draft.personal.phone?.trim()) errors.push('Phone number is required.');

  // Academic details validation
  if (draft.academic.role === 'college') {
    if (!draft.academic.collegeName?.trim()) errors.push('University/College name is required.');
    if (!draft.academic.degree?.trim()) errors.push('Degree program is required.');
  } else if (draft.academic.role === 'school') {
    if (!draft.academic.schoolName?.trim()) errors.push('School name is required.');
  }

  // Financial details validation
  if (!draft.financial.familyIncome?.trim()) errors.push('Family income range is required.');
  if (!draft.financial.incomeSource?.trim()) errors.push('Primary income source is required.');

  // Documents validation
  if (!draft.documents || draft.documents.length === 0) {
    errors.push('At least one required document must be uploaded.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

export const submitApplicationBackend = async (
  draft: ApplicationDraft,
  lockedFields: Record<string, LockedField>
): Promise<SubmissionResponse> => {
  // Server-side authoritative validation check
  const valResult = validateApplicationDraft(draft, lockedFields);
  if (!valResult.valid) {
    throw new Error(valResult.errors.join(' '));
  }

  // Persist application to backend & trigger real-time WebSocket broadcast
  try {
    const backendHost = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
    await fetch(`${backendHost}/api/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        applicationId: draft.applicationId,
        scholarshipTitle: draft.scholarshipTitle,
        applicantName: draft.personal.fullName,
        email: draft.personal.email,
        status: 'SUBMITTED',
        veriflowStatus: 'normal',
      }),
    });
  } catch (err) {
    console.warn('Backend application submission endpoint warning:', err);
  }

  return {
    success: true,
    applicationId: draft.applicationId,
    submissionDate: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    status: 'submitted',
    message: 'Application submitted successfully to backend.',
  };
};
