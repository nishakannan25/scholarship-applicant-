import { create } from 'zustand';
import { ApplicationDraft, PersonalDetails, AcademicDetails, FinancialDetails, DocumentMeta } from '../types';
import { VeriFlowEvent, LockedField, VeriFlowDecisionType } from '../../veriflow/types';
import { submitRecoveryDecision } from '../../veriflow/services/veriflowService';

interface ApplicationStoreState {
  currentApplication: ApplicationDraft | null;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  lockedFields: Record<string, LockedField>;
  activeVeriFlowEvent: VeriFlowEvent | null;
  
  loadApplication: (applicationId: string, initialRole?: 'school' | 'college' | 'other') => void;
  updatePersonal: (data: Partial<PersonalDetails>) => void;
  updateAcademic: (data: Partial<AcademicDetails>) => void;
  updateFinancial: (data: Partial<FinancialDetails>) => void;
  addDocument: (doc: DocumentMeta) => void;
  removeDocument: (id: string) => void;
  setTab: (tabIndex: number) => void;
  triggerAutosave: () => Promise<void>;
  submitApplication: () => void;
  
  // VeriFlow Realtime Handlers
  handleVeriFlowEvent: (event: VeriFlowEvent) => void;
  clearActiveVeriFlowEvent: () => void;
  submitVeriFlowDecision: (decision: VeriFlowDecisionType, simulateFailure?: boolean) => Promise<{ success: boolean; message: string }>;
}

const STORAGE_PREFIX = 'scholarpath_app_draft_';

export const useApplicationStore = create<ApplicationStoreState>((set, get) => ({
  currentApplication: null,
  saveStatus: 'idle',
  lockedFields: {},
  activeVeriFlowEvent: null,

  loadApplication: (applicationId, initialRole = 'college') => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}${applicationId}`);
    if (saved) {
      try {
        set({ currentApplication: JSON.parse(saved), saveStatus: 'saved' });
        return;
      } catch {
        // Fallback
      }
    }

    const newDraft: ApplicationDraft = {
      applicationId,
      scholarshipId: 'sch-001',
      scholarshipTitle: 'National STEM Excellence Leadership Grant',
      currentTab: 0,
      status: 'draft',
      updatedAt: new Date().toISOString(),
      personal: {
        fullName: 'Verified Applicant',
        email: 'applicant@scholarpath.org',
        phone: '+1 (555) 234-5678',
        institution: 'Stanford University',
        city: 'Palo Alto',
        state: 'California',
        country: 'United States',
      },
      academic: {
        role: initialRole,
        collegeName: 'Stanford University',
        degree: 'Bachelor of Science',
        department: 'Computer Science',
        collegeYear: 'Junior (3rd Year)',
        cgpa: '3.85',
      },
      financial: {
        familyIncome: '$60,000 - $80,000',
        incomeSource: 'Salaried Employment',
        familyMemberCount: '4',
        financialCategory: 'General / Moderate Income',
      },
      documents: [
        {
          id: 'doc-01',
          filename: 'Academic_Transcript_2026.pdf',
          type: 'application/pdf',
          size: 1428570,
          uploadedAt: new Date().toLocaleString(),
        },
      ],
      veriflowLocked: false,
    };

    localStorage.setItem(`${STORAGE_PREFIX}${applicationId}`, JSON.stringify(newDraft));
    set({ currentApplication: newDraft, saveStatus: 'saved' });
  },

  updatePersonal: (data) => {
    const app = get().currentApplication;
    if (!app) return;
    const updated = { ...app, personal: { ...app.personal, ...data }, updatedAt: new Date().toISOString() };
    set({ currentApplication: updated });
    get().triggerAutosave();
  },

  updateAcademic: (data) => {
    const app = get().currentApplication;
    if (!app) return;
    const updated = { ...app, academic: { ...app.academic, ...data }, updatedAt: new Date().toISOString() };
    set({ currentApplication: updated });
    get().triggerAutosave();
  },

  updateFinancial: (data) => {
    const app = get().currentApplication;
    if (!app) return;
    const updated = { ...app, financial: { ...app.financial, ...data }, updatedAt: new Date().toISOString() };
    set({ currentApplication: updated });
    get().triggerAutosave();
  },

  addDocument: (doc) => {
    const app = get().currentApplication;
    if (!app) return;
    const updated = { ...app, documents: [...app.documents, doc], updatedAt: new Date().toISOString() };
    set({ currentApplication: updated });
    get().triggerAutosave();
  },

  removeDocument: (id) => {
    const app = get().currentApplication;
    if (!app) return;
    const updated = {
      ...app,
      documents: app.documents.filter((d) => d.id !== id),
      updatedAt: new Date().toISOString(),
    };
    set({ currentApplication: updated });
    get().triggerAutosave();
  },

  setTab: (tabIndex) => {
    const app = get().currentApplication;
    if (!app) return;
    const updated = { ...app, currentTab: tabIndex };
    set({ currentApplication: updated });
    get().triggerAutosave();
  },

  triggerAutosave: async () => {
    const app = get().currentApplication;
    if (!app) return;
    set({ saveStatus: 'saving' });
    await new Promise((res) => setTimeout(res, 300));
    localStorage.setItem(`${STORAGE_PREFIX}${app.applicationId}`, JSON.stringify(app));
    set({ saveStatus: 'saved' });
  },

  submitApplication: () => {
    const app = get().currentApplication;
    if (!app) return;
    const updated: ApplicationDraft = { ...app, status: 'submitted', updatedAt: new Date().toISOString() };
    localStorage.setItem(`${STORAGE_PREFIX}${app.applicationId}`, JSON.stringify(updated));
    set({ currentApplication: updated, saveStatus: 'saved' });
  },

  handleVeriFlowEvent: (event) => {
    // CRITICAL: DO NOT refresh page, navigate away, reset wizard, reset current tab, or erase data.
    if (event.type === 'field_locked') {
      const lockedMap = { ...get().lockedFields };
      lockedMap[event.fieldKey] = {
        fieldKey: event.fieldKey,
        fieldName: event.fieldName,
        tabIndex: event.tabIndex,
        reason: event.reason,
        aiExplanation: event.aiExplanation,
        timestamp: event.timestamp,
      };

      set({
        lockedFields: lockedMap,
        activeVeriFlowEvent: event,
      });
    } else {
      set({ activeVeriFlowEvent: event });
    }
  },

  clearActiveVeriFlowEvent: () => {
    set({ activeVeriFlowEvent: null });
  },

  submitVeriFlowDecision: async (decision, simulateFailure = false) => {
    const activeEvt = get().activeVeriFlowEvent;
    const appId = get().currentApplication?.applicationId || 'app-demo';
    const targetKey = activeEvt?.fieldKey || 'bank_statement';

    try {
      // Call backend API service endpoint
      const res = await submitRecoveryDecision(appId, targetKey, decision, simulateFailure);

      // On successful backend response:
      if (res.unlockField) {
        const updatedLocked = { ...get().lockedFields };
        delete updatedLocked[targetKey]; // Unlock affected field & remove amber animation
        set({ lockedFields: updatedLocked });
      }

      return { success: true, message: res.message };
    } catch (err: any) {
      // FAILURE HANDLING: Do NOT unlock field. Keep current state.
      return { success: false, message: err.message || 'API request failed. Field remains locked.' };
    }
  },
}));
