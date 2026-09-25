import { VeriFlowDecisionType } from '../types';

export interface RecoveryDecisionResponse {
  success: boolean;
  unlockField: boolean;
  updatedValue?: string;
  message: string;
  auditLogId: string;
}

export const submitRecoveryDecision = async (
  _applicationId: string,
  _fieldKey: string,
  decision: VeriFlowDecisionType,
  shouldFail: boolean = false
): Promise<RecoveryDecisionResponse> => {
  // Simulated backend API latency
  await new Promise((res) => setTimeout(res, 600));

  if (shouldFail) {
    throw new Error('Backend server error: Failed to record VeriFlow recovery decision.');
  }

  const auditLogId = `audit-${Math.random().toString(36).substring(2, 8)}`;

  switch (decision) {
    case 'accept_new':
      return {
        success: true,
        unlockField: true,
        updatedValue: 'Bank Statement (Certified Copy Attached)',
        message: 'Rule update accepted. Field unlocked.',
        auditLogId,
      };

    case 'contest':
      return {
        success: true,
        unlockField: true,
        message: 'Your concern has been flagged for review.',
        auditLogId,
      };

    case 'request_grace_period':
      return {
        success: true,
        unlockField: true,
        message: 'Your grace period request has been recorded.',
        auditLogId,
      };

    default:
      throw new Error('Unknown recovery decision type');
  }
};
