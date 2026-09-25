import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, History, ShieldCheck, AlertCircle, Info } from 'lucide-react';
import { fetchApplicationAuditTimeline, AuditTimelineEntry } from '../services/auditService';

interface AuditTimelineProps {
  applicationId: string;
}

export const AuditTimeline: React.FC<AuditTimelineProps> = ({ applicationId }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [entries, setEntries] = useState<AuditTimelineEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplicationAuditTimeline(applicationId).then((res) => {
      setEntries(res);
      setLoading(false);
    });
  }, [applicationId]);

  return (
    <div className="border border-border rounded-2xl bg-card overflow-hidden shadow-sm">
      {/* Collapsible Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 bg-accent/30 hover:bg-accent/50 transition-colors flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-2.5">
          <History className="h-5 w-5 text-primary" />
          <div>
            <h3 className="text-sm font-bold text-foreground">Changes during this application</h3>
            <p className="text-[11px] text-muted-foreground">
              Immutable audit timeline of VeriFlow rule updates and applicant responses
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
            {entries.length} Events
          </span>
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </button>

      {/* Collapsible Timeline Content */}
      {isOpen && (
        <div className="p-5 border-t border-border space-y-4">
          {loading ? (
            <div className="text-xs text-muted-foreground italic py-2">Loading application history...</div>
          ) : entries.length === 0 ? (
            <div className="text-xs text-muted-foreground italic py-2">No rule changes recorded during this session.</div>
          ) : (
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
              {entries.map((entry) => {
                // Color classification:
                // Normal / Accepted: blue/neutral
                // Informational: amber
                // Contested / Error: red
                let nodeColor = 'bg-primary border-primary/20 text-primary-foreground';
                let cardBorder = 'border-border';
                let badgeStyle = 'bg-primary/10 text-primary';

                if (entry.status === 'contested') {
                  nodeColor = 'bg-destructive border-destructive/20 text-destructive-foreground';
                  cardBorder = 'border-destructive/30 bg-destructive/5';
                  badgeStyle = 'bg-destructive/10 text-destructive';
                } else if (entry.classification === 'informational' || entry.status === 'grace_period') {
                  nodeColor = 'bg-amberNotice-500 border-amberNotice-500/20 text-white';
                  cardBorder = 'border-amberNotice-500/30 bg-amberNotice-500/5';
                  badgeStyle = 'bg-amberNotice-500/10 text-amberNotice-600 dark:text-amberNotice-400';
                }

                return (
                  <div key={entry.id} className="relative group">
                    {/* Timeline Vertical Node Dot */}
                    <div className={`absolute -left-[31px] top-1 h-5 w-5 rounded-full border-2 flex items-center justify-center text-[10px] shadow-sm ${nodeColor}`}>
                      {entry.status === 'contested' ? (
                        <AlertCircle className="h-3 w-3" />
                      ) : entry.classification === 'informational' ? (
                        <Info className="h-3 w-3" />
                      ) : (
                        <ShieldCheck className="h-3 w-3" />
                      )}
                    </div>

                    {/* Timeline Entry Card */}
                    <div className={`p-4 rounded-xl border ${cardBorder} bg-background space-y-2 text-xs transition-shadow hover:shadow-md`}>
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pb-2">
                        <span className="font-bold text-foreground text-xs flex items-center gap-1.5">
                          {entry.whatChanged}
                        </span>
                        <span className="text-[11px] font-mono text-muted-foreground">{entry.timestamp}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-muted-foreground pt-1">
                        <div>
                          <span className="font-semibold text-foreground">Affected Field:</span>{' '}
                          <span className="font-mono">{entry.affectedField}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-foreground">Classification:</span>{' '}
                          <span className={`px-1.5 py-0.5 rounded font-bold uppercase text-[10px] ${badgeStyle}`}>
                            {entry.classification}
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-foreground">Old Value:</span> {entry.oldValue}
                        </div>
                        <div>
                          <span className="font-semibold text-foreground">New Value:</span> {entry.newValue}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[11px]">
                        <span className="text-muted-foreground">
                          Recovery Decision:{' '}
                          <strong className="text-foreground capitalize">{entry.recoveryDecision.replace('_', ' ')}</strong>
                        </span>
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${badgeStyle}`}>
                          Status: {entry.status}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
