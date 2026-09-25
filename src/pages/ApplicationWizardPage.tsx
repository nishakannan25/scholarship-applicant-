import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApplicationStore } from '../features/applications/stores/useApplicationStore';
import { useAuthStore } from '../stores/useAuthStore';
import { useVeriFlowSocket } from '../features/veriflow/hooks/useVeriFlowSocket';
import { VeriFlowModal } from '../features/veriflow/components/VeriFlowModal';
import { WizardStepper } from '../features/applications/components/WizardStepper';
import { PersonalDetailsTab } from '../features/applications/components/PersonalDetailsTab';
import { AcademicDetailsTab } from '../features/applications/components/AcademicDetailsTab';
import { FinancialDetailsTab } from '../features/applications/components/FinancialDetailsTab';
import { DocumentsTab } from '../features/applications/components/DocumentsTab';
import { ReviewSubmitTab } from '../features/applications/components/ReviewSubmitTab';
import { ArrowLeft, CheckCircle2, RefreshCw, Zap } from 'lucide-react';

export const ApplicationWizardPage: React.FC = () => {
  const { applicationId = 'app-demo' } = useParams<{ applicationId: string }>();
  const { user } = useAuthStore();
  const { currentApplication, saveStatus, loadApplication, setTab } = useApplicationStore();
  const { publishDemoEvent } = useVeriFlowSocket(applicationId);

  useEffect(() => {
    loadApplication(applicationId, (user?.role as 'school' | 'college' | 'other') || 'college');
  }, [applicationId, user?.role, loadApplication]);

  if (!currentApplication) {
    return (
      <div className="p-12 text-center text-muted-foreground">
        Loading application draft...
      </div>
    );
  }

  const currentTab = currentApplication.currentTab;

  return (
    <div className="space-y-6 max-w-5xl mx-auto relative">
      {/* VeriFlow Automatic Modal Popup */}
      <VeriFlowModal />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <Link to="/scholarships" className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-foreground">{currentApplication.scholarshipTitle}</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Application ID: <span className="font-mono font-semibold text-foreground">{currentApplication.applicationId}</span>
            </p>
          </div>
        </div>

        {/* Header Action Controls */}
        <div className="flex items-center gap-2">
          {/* Live Admin VeriFlow Demo Event Simulator Button */}
          <button
            type="button"
            onClick={() =>
              publishDemoEvent({
                type: 'field_locked',
                fieldKey: 'bank_statement',
                fieldName: 'Bank Statement (Certified)',
                tabIndex: 3,
                reason: 'Admin published updated Fact v4.0.2 requiring certified bank statement.',
                aiExplanation:
                  'The scholarship board updated compliance rules to verify family income. Submitting a certified bank statement ensures your application satisfies the new requirement without restarting.',
              })
            }
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amberNotice-500/10 border border-amberNotice-500/30 text-amberNotice-600 dark:text-amberNotice-400 text-xs font-bold hover:bg-amberNotice-500/20 transition-colors shadow-sm"
            title="Simulate Admin publishing rule change via WebSocket"
          >
            <Zap className="h-3.5 w-3.5 animate-pulse text-amberNotice-500" />
            Simulate Admin VeriFlow Change
          </button>

          {/* Autosave status indicator */}
          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-accent/60 border border-border">
            {saveStatus === 'saving' && (
              <span className="text-amberNotice-500 flex items-center gap-1.5">
                <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Saving...
              </span>
            )}
            {saveStatus === 'saved' && (
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" /> Saved
              </span>
            )}
            {saveStatus === 'error' && <span className="text-destructive">Unable to save</span>}
          </div>
        </div>
      </div>

      {/* Persistent Stepper */}
      <WizardStepper
        currentTab={currentTab}
        onSelectTab={(idx) => setTab(idx)}
        veriflowLocked={currentApplication.veriflowLocked}
      />

      {/* Active Tab View */}
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
        {currentTab === 0 && <PersonalDetailsTab />}
        {currentTab === 1 && <AcademicDetailsTab />}
        {currentTab === 2 && <FinancialDetailsTab />}
        {currentTab === 3 && <DocumentsTab />}
        {currentTab === 4 && <ReviewSubmitTab onEditTab={(idx) => setTab(idx)} />}

        {/* Navigation Next/Prev buttons */}
        <div className="pt-6 mt-6 border-t border-border flex items-center justify-between">
          <button
            type="button"
            disabled={currentTab === 0}
            onClick={() => setTab(currentTab - 1)}
            className="px-4 py-2 bg-accent text-accent-foreground text-xs font-semibold rounded-lg hover:bg-accent/80 disabled:opacity-40 transition-colors"
          >
            Previous
          </button>

          {currentTab < 4 && (
            <button
              type="button"
              onClick={() => setTab(currentTab + 1)}
              className="px-5 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:bg-primary/90 transition-colors"
            >
              Next Step
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
