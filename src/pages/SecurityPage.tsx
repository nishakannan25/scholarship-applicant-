import React, { useState } from 'react';
import { INITIAL_AUDIT_EVENTS } from '../features/security/data/auditEvents';
import { ShieldCheck, Laptop, MapPin, CheckCircle, XCircle, Clock } from 'lucide-react';

export const SecurityPage: React.FC = () => {
  const [events] = useState(INITIAL_AUDIT_EVENTS);

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider mb-1">
          <ShieldCheck className="h-4 w-4" /> Account Governance
        </div>
        <h1 className="text-2xl font-bold text-foreground">Security Audit & Activity Log</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Review recent authentication events and security activity for your account.
        </p>
      </div>

      {/* Security Status Overview Card */}
      <div className="p-4 sm:p-6 rounded-2xl bg-card border border-border shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
            Account Protected
          </span>
          <h3 className="text-lg font-bold text-foreground">Two-Factor & Session Security Active</h3>
          <p className="text-xs text-muted-foreground">
            Short-lived access tokens (15 minutes) with httpOnly refresh token rotation.
          </p>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" /> Latest 5 Login Events
          </h2>
          <span className="text-xs text-muted-foreground font-mono">Immutable Audit Trail</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-border bg-accent/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Device / Browser</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4">Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs">
              {events.slice(0, 5).map((evt) => (
                <tr key={evt.id} className="hover:bg-accent/20 transition-colors">
                  <td className="py-3.5 px-4 font-semibold">
                    {evt.status === 'SUCCESS' ? (
                      <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle className="h-3.5 w-3.5" /> Successful Login
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-destructive">
                        <XCircle className="h-3.5 w-3.5" /> Failed Attempt
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-foreground font-mono">{evt.timestamp}</td>
                  <td className="py-3.5 px-4 text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Laptop className="h-3.5 w-3.5 text-primary" /> {evt.userAgent}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-muted-foreground">{evt.ipAddress}</td>
                  <td className="py-3.5 px-4 text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" /> {evt.location}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
