import React from 'react';
import { Check, Lock, User, GraduationCap, DollarSign, FileText, CheckCircle2 } from 'lucide-react';

interface WizardStepperProps {
  currentTab: number;
  onSelectTab: (index: number) => void;
  veriflowLocked?: boolean;
}

const TABS = [
  { id: 0, title: 'Personal Details', icon: User },
  { id: 1, title: 'Academic Details', icon: GraduationCap },
  { id: 2, title: 'Financial & Family', icon: DollarSign },
  { id: 3, title: 'Documents', icon: FileText },
  { id: 4, title: 'Review & Submit', icon: CheckCircle2 },
];

export const WizardStepper: React.FC<WizardStepperProps> = ({
  currentTab,
  onSelectTab,
  veriflowLocked = false,
}) => {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 shadow-sm overflow-x-auto">
      <div className="flex items-center justify-between min-w-[640px] md:min-w-0">
        {TABS.map((tab, idx) => {
          const Icon = tab.icon;
          const isCompleted = currentTab > idx;
          const isCurrent = currentTab === idx;
          const isLocked = veriflowLocked && idx === 3; // Example: VeriFlow locking Tab 4

          let stateColor = 'border-border text-muted-foreground bg-accent/40';
          if (isCompleted) {
            stateColor = 'bg-emerald-500 text-white border-emerald-500';
          } else if (isCurrent) {
            stateColor = 'bg-primary text-primary-foreground border-primary ring-4 ring-primary/20';
          } else if (isLocked) {
            stateColor = 'bg-amberNotice-500 text-white border-amberNotice-500 shadow-md';
          }

          return (
            <React.Fragment key={tab.id}>
              <button
                type="button"
                onClick={() => onSelectTab(idx)}
                className="flex items-center gap-2.5 text-left group focus:outline-none"
              >
                {/* Stepper Circle Icon */}
                <div className={`h-9 w-9 rounded-full border-2 flex items-center justify-center transition-all shrink-0 font-bold text-xs ${stateColor}`}>
                  {isLocked ? (
                    <Lock className="h-4 w-4 animate-pulse" />
                  ) : isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Step {idx + 1}
                  </span>
                  <span
                    className={`text-xs font-semibold block whitespace-nowrap ${
                      isCurrent
                        ? 'text-primary font-bold'
                        : isLocked
                        ? 'text-amberNotice-600 dark:text-amberNotice-400 font-bold'
                        : 'text-foreground group-hover:text-primary transition-colors'
                    }`}
                  >
                    {tab.title}
                    {isLocked && <span className="ml-1 text-[10px] bg-amberNotice-500/20 text-amberNotice-600 px-1.5 py-0.2 rounded">Locked</span>}
                  </span>
                </div>
              </button>

              {/* Connecting Bar */}
              {idx < TABS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-3 transition-colors ${
                    currentTab > idx ? 'bg-emerald-500' : 'bg-border'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
