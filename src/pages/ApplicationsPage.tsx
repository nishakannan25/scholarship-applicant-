import React from 'react';
import { Link } from 'react-router-dom';
import { useApplicationStore } from '../features/applications/stores/useApplicationStore';
import { FileText, Clock, ArrowRight, PlusCircle, CheckCircle2 } from 'lucide-react';

export const ApplicationsPage: React.FC = () => {
  const { currentApplication } = useApplicationStore();

  const mockApplications = [
    {
      id: 'app-demo-01',
      title: 'National STEM Excellence Leadership Grant',
      status: 'draft',
      updatedAt: 'Just now',
      progress: 80,
    },
    {
      id: 'app-demo-02',
      title: 'Equal Opportunity Opportunity Fund',
      status: 'submitted',
      updatedAt: '2 days ago',
      progress: 100,
    },
  ];

  if (currentApplication) {
    const exists = mockApplications.find((a) => a.id === currentApplication.applicationId);
    if (!exists) {
      mockApplications.unshift({
        id: currentApplication.applicationId,
        title: currentApplication.scholarshipTitle,
        status: currentApplication.status,
        updatedAt: 'Just now',
        progress: currentApplication.status === 'submitted' ? 100 : (currentApplication.currentTab + 1) * 20,
      });
    }
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider mb-1">
            <FileText className="h-4 w-4" /> Application Tracker
          </div>
          <h1 className="text-2xl font-bold text-foreground">My Submissions & Drafts</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Track draft progress, submitted applications, and review updates.
          </p>
        </div>

        <Link
          to="/scholarships"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground text-xs font-semibold rounded-xl shadow-sm hover:bg-primary/90 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="h-4 w-4" /> Start New Application
        </Link>
      </div>

      {/* Applications List Grid */}
      <div className="space-y-4">
        {mockApplications.map((app) => (
          <div
            key={app.id}
            className="bg-card border border-border rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary/40 transition-all"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {app.status === 'submitted' ? (
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Submitted
                  </span>
                ) : (
                  <span className="text-xs font-medium text-amberNotice-600 dark:text-amberNotice-400 bg-amberNotice-500/10 px-2.5 py-1 rounded-md border border-amberNotice-500/20 flex items-center gap-1">
                    <Clock className="h-3 w-3" /> In Progress (Draft)
                  </span>
                )}
                <span className="text-xs font-mono text-muted-foreground">{app.id}</span>
              </div>

              <h3 className="text-base font-bold text-foreground">{app.title}</h3>

              {/* Progress Bar */}
              <div className="flex items-center gap-3 text-xs text-muted-foreground max-w-xs">
                <div className="flex-1 h-2 bg-accent rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      app.status === 'submitted' ? 'bg-emerald-500' : 'bg-primary'
                    }`}
                    style={{ width: `${app.progress}%` }}
                  />
                </div>
                <span className="font-mono font-medium">{app.progress}%</span>
              </div>
            </div>

            <Link
              to={`/applications/${app.id}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent text-accent-foreground hover:bg-accent/80 text-xs font-semibold transition-all"
            >
              {app.status === 'submitted' ? 'View Summary' : 'Continue Application'}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
