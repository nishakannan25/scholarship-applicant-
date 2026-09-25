import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { SCHOLARSHIPS_DATA } from '../features/scholarships/data/scholarships';
import { ScholarshipCard } from '../features/scholarships/components/ScholarshipCard';
import { Award, Clock, Sparkles, Activity, ArrowRight } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();

  const recommended = SCHOLARSHIPS_DATA.filter(
    (sch) => sch.educationLevel === 'all' || sch.educationLevel === user?.role
  ).slice(0, 3);

  const upcomingDeadlines = [...SCHOLARSHIPS_DATA]
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-primary/15 via-accent to-primary/5 border border-primary/20 space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider">
          <Sparkles className="h-4 w-4" /> Welcome Back
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
          Hello, {user?.fullName || 'Applicant'}
        </h1>
        <p className="text-sm text-muted-foreground max-w-xl">
          Application Number: <span className="font-mono font-bold text-foreground">{user?.applicationNumber || 'SP-CS-2026-DEMO'}</span> • Account Status: <span className="text-emerald-600 dark:text-emerald-400 font-medium">Verified Active</span>
        </p>
      </div>

      {/* Grid Overview Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommended Scholarships (Left 2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" /> Recommended for You
            </h2>
            <Link to="/scholarships" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recommended.map((sch) => (
              <ScholarshipCard key={sch.id} scholarship={sch} />
            ))}
          </div>
        </div>

        {/* Sidebar Cards (Right 1 col) */}
        <div className="space-y-6">
          {/* Upcoming Deadlines Widget */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-amberNotice-500" /> Upcoming Deadlines
            </h3>
            <div className="space-y-3 divide-y divide-border">
              {upcomingDeadlines.map((sch) => (
                <div key={sch.id} className="pt-2 first:pt-0">
                  <Link to={`/scholarships/${sch.id}`} className="text-xs font-bold text-foreground hover:text-primary transition-colors line-clamp-1">
                    {sch.title}
                  </Link>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-1">
                    <span>Deadline: {sch.deadline}</span>
                    <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">₹{sch.amount.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent VeriFlow Changes Feed */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" /> Recent VeriFlow Rule Changes
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-accent/40 border border-border space-y-1">
                <span className="text-[10px] font-semibold uppercase text-primary">Fact v4.0.2 Updated</span>
                <p className="font-medium text-foreground">Updated eligibility rules for Women in AI Fellowship</p>
                <span className="text-[10px] text-muted-foreground block font-mono">2 hours ago</span>
              </div>
              <div className="p-3 rounded-xl bg-accent/40 border border-border space-y-1">
                <span className="text-[10px] font-semibold uppercase text-emerald-600">Fact v2.4.1 Verified</span>
                <p className="font-medium text-foreground">National STEM Excellence Grant deadline extended</p>
                <span className="text-[10px] text-muted-foreground block font-mono">1 day ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
