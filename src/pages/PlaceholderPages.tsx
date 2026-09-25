import React from 'react';
import { LayoutDashboard, Award, FileText, User, ShieldCheck, LogIn, UserPlus } from 'lucide-react';

interface PlaceholderProps {
  title: string;
  description: string;
  icon: React.ElementType;
}

const PagePlaceholder: React.FC<PlaceholderProps> = ({ title, description, icon: Icon }) => (
  <div className="bg-card border border-border rounded-xl p-8 shadow-sm flex flex-col items-center text-center space-y-4 my-4">
    <div className="bg-primary/10 text-primary p-4 rounded-2xl border border-primary/20">
      <Icon className="h-8 w-8" />
    </div>
    <div>
      <h2 className="text-xl font-bold tracking-tight text-foreground">{title}</h2>
      <p className="text-sm text-muted-foreground mt-1 max-w-md">{description}</p>
    </div>
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-medium">
      Phase 1 Foundation Ready — Module Implementation in Next Phase
    </div>
  </div>
);

export const DashboardPage: React.FC = () => (
  <PagePlaceholder
    title="Applicant Dashboard"
    description="Overview of active scholarship applications, eligibility status, and key notifications."
    icon={LayoutDashboard}
  />
);

export const ScholarshipsPage: React.FC = () => (
  <PagePlaceholder
    title="Scholarships Directory"
    description="Browse, filter, and discover available funding opportunities and requirements."
    icon={Award}
  />
);

export const ApplicationsPage: React.FC = () => (
  <PagePlaceholder
    title="My Applications"
    description="Track ongoing submissions, review history, draft progress, and decision outcomes."
    icon={FileText}
  />
);

export const ProfilePage: React.FC = () => (
  <PagePlaceholder
    title="Applicant Profile"
    description="Manage student demographic information, educational background, and uploaded credentials."
    icon={User}
  />
);

export const SecurityPage: React.FC = () => (
  <PagePlaceholder
    title="Security & Credentials"
    description="Manage account password, multi-factor verification settings, and active session tokens."
    icon={ShieldCheck}
  />
);

export const LoginPage: React.FC = () => (
  <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
    <div className="bg-card border border-border rounded-2xl p-8 max-w-md w-full shadow-lg text-center space-y-4">
      <div className="bg-primary/10 text-primary p-4.5 rounded-2xl w-14 h-14 mx-auto flex items-center justify-center border border-primary/20">
        <LogIn className="h-6 w-6" />
      </div>
      <h2 className="text-2xl font-bold">Applicant Login</h2>
      <p className="text-sm text-muted-foreground">Phase 1 Foundation — Login authentication will be fully enabled in Phase 2.</p>
      <a href="/dashboard" className="block w-full py-2.5 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
        Enter Demo Dashboard
      </a>
    </div>
  </div>
);

export const RegisterPage: React.FC = () => (
  <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
    <div className="bg-card border border-border rounded-2xl p-8 max-w-md w-full shadow-lg text-center space-y-4">
      <div className="bg-primary/10 text-primary p-4.5 rounded-2xl w-14 h-14 mx-auto flex items-center justify-center border border-primary/20">
        <UserPlus className="h-6 w-6" />
      </div>
      <h2 className="text-2xl font-bold">Create Account</h2>
      <p className="text-sm text-muted-foreground">Phase 1 Foundation — Student registration will be fully enabled in Phase 2.</p>
      <a href="/dashboard" className="block w-full py-2.5 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
        Enter Demo Dashboard
      </a>
    </div>
  </div>
);
