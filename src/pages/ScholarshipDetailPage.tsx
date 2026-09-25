import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { SCHOLARSHIPS_DATA } from '../features/scholarships/data/scholarships';
import { useAuthStore } from '../stores/useAuthStore';
import { Award, Calendar, CheckCircle2, FileText, ArrowLeft, Send, Tag, ShieldCheck } from 'lucide-react';

export const ScholarshipDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const scholarship = SCHOLARSHIPS_DATA.find((s) => s.id === id);

  if (!scholarship) {
    return (
      <div className="p-12 text-center bg-card border border-border rounded-2xl space-y-4">
        <h2 className="text-xl font-bold text-foreground">Scholarship Not Found</h2>
        <p className="text-xs text-muted-foreground">The requested scholarship could not be retrieved.</p>
        <Link to="/scholarships" className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-lg">
          <ArrowLeft className="h-4 w-4" /> Return to Directory
        </Link>
      </div>
    );
  }

  const isEligible =
    !user?.role || scholarship.educationLevel === 'all' || scholarship.educationLevel === user.role;

  const handleApply = () => {
    setLoading(true);

    // Simulated Backend Application Draft creation capturing current fact versions
    setTimeout(() => {
      setLoading(false);
      const randomAppId = `app-${Math.random().toString(36).substring(2, 8)}`;
      navigate(`/applications/${randomAppId}`);
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back button */}
      <Link to="/scholarships" className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Scholarship Directory
      </Link>

      {/* Main Detail Header Card */}
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-border pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-md border border-primary/20">
                {scholarship.category}
              </span>
              <span className="text-xs font-mono text-muted-foreground bg-accent px-2 py-0.5 rounded">
                Fact {scholarship.factVersion}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground leading-tight">
              {scholarship.title}
            </h1>
            <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
              <Award className="h-4 w-4 text-primary" /> {scholarship.organization} • Region: {scholarship.region}
            </p>
          </div>

          {/* Amount & Deadline Badge */}
          <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl text-right sm:min-w-[180px]">
            <div className="text-2xl font-extrabold text-foreground font-mono flex items-center justify-end">
              <span className="text-emerald-500 font-bold mr-0.5">₹</span>
              {scholarship.amount.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground mt-1 flex items-center justify-end gap-1">
              <Calendar className="h-3.5 w-3.5 text-primary" /> Deadline: {scholarship.deadline}
            </div>
          </div>
        </div>

        {/* Backend Eligibility Status */}
        <div className={`p-4 rounded-xl border flex items-center justify-between text-xs font-medium ${
          isEligible ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400' : 'bg-accent border-border text-muted-foreground'
        }`}>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
            <span>Backend Rule Check: {isEligible ? 'You are eligible to apply for this scholarship funding opportunity.' : 'Your registered role does not match this specific category.'}</span>
          </div>
        </div>

        {/* Overview Description */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-foreground">Scholarship Overview</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {scholarship.description}
          </p>
        </div>

        {/* Eligibility Criteria */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" /> VeriFlow Eligibility Requirements
          </h3>
          <ul className="space-y-2 text-xs">
            {scholarship.eligibilityCriteria.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-accent/40 border border-border text-foreground">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Required Documents */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" /> Required Documents for Submission
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {scholarship.requiredDocuments.map((doc, i) => (
              <div key={i} className="p-3 rounded-xl bg-background border border-input text-foreground font-medium flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                {doc}
              </div>
            ))}
          </div>
        </div>

        {/* Apply Action Button */}
        <div className="pt-4 border-t border-border flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {scholarship.tags.map((t) => (
              <span key={t} className="text-[11px] font-medium text-muted-foreground bg-accent px-2 py-0.5 rounded flex items-center gap-1">
                <Tag className="h-3 w-3" /> {t}
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={handleApply}
            disabled={loading}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl shadow-md hover:bg-primary/90 disabled:opacity-50 transition-all text-sm"
          >
            {loading ? (
              <div className="h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
            ) : (
              <>
                <Send className="h-4 w-4" />
                Apply Now (Create Draft)
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
