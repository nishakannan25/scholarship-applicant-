import React from 'react';
import { Link } from 'react-router-dom';
import { ScholarshipDetail } from '../data/scholarships';
import { Award, Calendar, CheckCircle2, ArrowRight, Tag } from 'lucide-react';
import { useAuthStore } from '../../../stores/useAuthStore';

interface ScholarshipCardProps {
  scholarship: ScholarshipDetail;
}

export const ScholarshipCard: React.FC<ScholarshipCardProps> = ({ scholarship }) => {
  const { user } = useAuthStore();

  // Role-influenced Backend Eligibility check
  const isEligible =
    !user?.role ||
    scholarship.educationLevel === 'all' ||
    scholarship.educationLevel === user.role;

  const daysLeft = Math.ceil(
    (new Date(scholarship.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group">
      <div className="space-y-3">
        {/* Top Header & Badges */}
        <div className="flex items-start justify-between gap-2">
          <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-md border border-primary/20">
            {scholarship.category}
          </span>

          {isEligible ? (
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> Eligible for you
            </span>
          ) : (
            <span className="text-xs font-medium text-muted-foreground bg-accent px-2 py-0.5 rounded">
              Role Mismatch
            </span>
          )}
        </div>

        {/* Title & Organization */}
        <div>
          <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {scholarship.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <Award className="h-3.5 w-3.5 text-primary" /> {scholarship.organization}
          </p>
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {scholarship.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {scholarship.tags.map((tag) => (
            <span key={tag} className="text-[11px] font-medium text-muted-foreground bg-accent/60 px-2 py-0.5 rounded flex items-center gap-1">
              <Tag className="h-3 w-3" /> {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Info & Action */}
      <div className="pt-4 border-t border-border flex items-center justify-between">
        <div>
          <div className="text-lg font-extrabold text-foreground flex items-center font-mono">
            <span className="text-emerald-500 font-bold mr-0.5">₹</span>
            {scholarship.amount.toLocaleString()}
          </div>
          <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
            <Calendar className="h-3 w-3 text-primary" />
            {daysLeft > 0 ? `${daysLeft} days remaining` : 'Deadline passed'}
          </div>
        </div>

        <Link
          to={`/scholarships/${scholarship.id}`}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-sm hover:bg-primary/90 transition-all"
        >
          View Details
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
};
