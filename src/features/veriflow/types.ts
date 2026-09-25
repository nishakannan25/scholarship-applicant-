export type VeriFlowDecisionType = 'accept_new' | 'contest' | 'request_grace_period';
export type VeriFlowEventType = 'field_locked' | 'informational_change' | 'cosmetic_change' | 'application_change';

export interface VeriFlowEvent {
  id: string;
  type: VeriFlowEventType;
  fieldKey: string;
  fieldName: string;
  tabIndex: number;
  reason: string;
  aiExplanation: string;
  timestamp: string;
  factVersion: string;
}

export interface LockedField {
  fieldKey: string;
  fieldName: string;
  tabIndex: number;
  reason: string;
  aiExplanation: string;
  timestamp: string;
}
