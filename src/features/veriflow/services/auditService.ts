export interface AuditTimelineEntry {
  id: string;
  timestamp: string;
  whatChanged: string;
  oldValue: string;
  newValue: string;
  classification: 'blocking' | 'informational' | 'cosmetic';
  affectedField: string;
  recoveryDecision: 'accept_new' | 'contest' | 'request_grace_period' | 'pending';
  status: 'accepted' | 'contested' | 'grace_period' | 'locked';
}

export interface IntegrityVerificationResult {
  valid: boolean;
  blockCount: number;
  latestHash: string;
  verifiedAt: string;
  message: string;
}

export const fetchApplicationAuditTimeline = async (
  _applicationId: string
): Promise<AuditTimelineEntry[]> => {
  await new Promise((res) => setTimeout(res, 200));

  return [
    {
      id: 'audit-001',
      timestamp: 'Today, 02:14 PM',
      whatChanged: 'Published Rule Fact v4.0.2: Mandatory Income Verification Document',
      oldValue: 'Income Certificate Only',
      newValue: 'Income Certificate + Bank Statement (Certified)',
      classification: 'blocking',
      affectedField: 'bank_statement',
      recoveryDecision: 'accept_new',
      status: 'accepted',
    },
    {
      id: 'audit-002',
      timestamp: 'Today, 01:45 PM',
      whatChanged: 'Updated Academic Detail Criteria for STEM Faculty Grants',
      oldValue: 'Department: Computer Science',
      newValue: 'Department: Computer Science / AI Research',
      classification: 'informational',
      affectedField: 'department',
      recoveryDecision: 'pending',
      status: 'accepted',
    },
  ];
};

export const verifyAuditIntegrity = async (
  _applicationId: string,
  simulateCorruptedChain: boolean = false
): Promise<IntegrityVerificationResult> => {
  await new Promise((res) => setTimeout(res, 700));

  if (simulateCorruptedChain) {
    return {
      valid: false,
      blockCount: 2,
      latestHash: '0x8f3c...INVALID_HASH',
      verifiedAt: new Date().toLocaleTimeString(),
      message: 'Cryptographic hash mismatch detected at Block #2.',
    };
  }

  return {
    valid: true,
    blockCount: 4,
    latestHash: '0x7e2a9b4c1f8d3e5a0b9c8d7e6f5a4b3c2d1e0f9a',
    verifiedAt: new Date().toLocaleTimeString(),
    message: 'The recorded history has not been altered.',
  };
};
