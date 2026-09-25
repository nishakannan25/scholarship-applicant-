import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowRight, Clock, AlertCircle, HelpCircle, CheckCircle2 } from 'lucide-react';
import { useApplicationStore } from '../features/applications/stores/useApplicationStore';

export type ApplicationStatus =
  | 'Draft'
  | 'In Progress'
  | 'Submitted'
  | 'Under Review'
  | 'Contested'
  | 'Grace Period Requested';

interface ApplicationItem {
  applicationId: string;
  scholarshipTitle: string;
  status: ApplicationStatus;
  createdAt: string;
  submittedAt?: string;
  updatedAt: string;
}

export const ApplicationsListPage: React.FC = () => {
  const { currentApplication } = useApplicationStore();

  const applicationsList: ApplicationItem[] = [
    {
      applicationId: currentApplication?.applicationId || 'APP-2026-8841',
      scholarshipTitle: currentApplication?.scholarshipTitle || 'National STEM Future Leaders Grant 2026',
      status: (currentApplication?.status === 'submitted' ? 'Submitted' : 'In Progress') as ApplicationStatus,
      createdAt: 'Sept 20, 2026',
      submittedAt: currentApplication?.status === 'submitted' ? 'Sept 25, 2026' : undefined,
      updatedAt: 'Just now',
    },
    {
      applicationId: 'APP-2026-4192',
      scholarshipTitle: 'Undergraduate Merit Excellence Fellowship',
      status: 'Under Review',
      createdAt: 'Sept 10, 2026',
      submittedAt: 'Sept 15, 2026',
      updatedAt: 'Sept 18, 2026',
    },
    {
      applicationId: 'APP-2026-9021',
      scholarshipTitle: 'State Higher Education Access Grant',
      status: 'Contested',
      createdAt: 'Sept 01, 2026',
      submittedAt: 'Sept 08, 2026',
      updatedAt: 'Sept 24, 2026',
    },
    {
      applicationId: 'APP-2026-1184',
      scholarshipTitle: 'Women in AI & Innovation Research Fund',
      status: 'Grace Period Requested',
      createdAt: 'Aug 28, 2026',
      submittedAt: 'Sept 02, 2026',
      updatedAt: 'Sept 22, 2026',
    },
    {
      applicationId: 'APP-2026-3301',
      scholarshipTitle: 'Regional Rural Student Financial Aid',
      status: 'Draft',
      createdAt: 'Sept 22, 2026',
      updatedAt: 'Sept 23, 2026',
    },
  ];

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'Submitted':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase">
            <CheckCircle2 className="h-3.5 w-3.5" /> Submitted
          </span>
        );
      case 'Under Review':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase">
            <Clock className="h-3.5 w-3.5" /> Under Review
          </span>
        );
      case 'Contested':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-destructive/10 border border-destructive/30 text-destructive text-xs font-bold uppercase">
            <AlertCircle className="h-3.5 w-3.5" /> Contested
          </span>
        );
      case 'Grace Period Requested':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amberNotice-500/10 border border-amberNotice-500/30 text-amberNotice-600 dark:text-amberNotice-400 text-xs font-bold uppercase">
            <HelpCircle className="h-3.5 w-3.5" /> Grace Period
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase">
            <FileText className="h-3.5 w-3.5" /> In Progress
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent border border-border text-muted-foreground text-xs font-bold uppercase">
            Draft
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-extrabold text-foreground flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" /> My Applications
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Manage and track all your active, submitted, and past scholarship applications with VeriFlow governance status.
        </p>
      </div>

      {/* Applications List Grid */}
      <div className="space-y-4">
        {applicationsList.map((app) => (
          <div
            key={app.applicationId}
            className="bg-card border border-border hover:border-primary/50 rounded-2xl p-5 shadow-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
          >
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-xs font-bold text-foreground bg-accent/60 px-2.5 py-1 rounded-lg border border-border">
                  {app.applicationId}
                </span>
                {getStatusBadge(app.status)}
              </div>

              <h2 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                {app.scholarshipTitle}
              </h2>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-muted-foreground">
                <span>Created: {app.createdAt}</span>
                {app.submittedAt && <span>Submitted: {app.submittedAt}</span>}
                <span>Updated: {app.updatedAt}</span>
              </div>
            </div>

            {/* Action Link */}
            <div className="flex items-center gap-2 pt-2 md:pt-0 shrink-0">
              <Link
                to={app.status === 'Draft' || app.status === 'In Progress' ? `/applications/${app.applicationId}` : `/applications/${app.applicationId}/details`}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold rounded-xl shadow-sm transition-colors"
              >
                <span>{app.status === 'Draft' || app.status === 'In Progress' ? 'Continue Application' : 'View Details'}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
