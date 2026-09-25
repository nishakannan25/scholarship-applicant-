import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, RefreshCw, Lock, AlertTriangle } from 'lucide-react';
import { verifyAuditIntegrity, IntegrityVerificationResult } from '../services/auditService';

interface VerifyIntegrityControlProps {
  applicationId: string;
}

export const VerifyIntegrityControl: React.FC<VerifyIntegrityControlProps> = ({ applicationId }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IntegrityVerificationResult | null>(null);
  const [simulateCorrupted, setSimulateCorrupted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleVerifyIntegrity = async () => {
    setLoading(true);
    setResult(null);
    setErrorMsg(null);

    try {
      const res = await verifyAuditIntegrity(applicationId, simulateCorrupted);
      setResult(res);
    } catch (err: any) {
      // Network failure handling
      setErrorMsg(err.message || 'Network error while attempting audit verification.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-border rounded-2xl p-5 bg-card space-y-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2.5">
          <Lock className="h-5 w-5 text-primary" />
          <div>
            <h3 className="text-sm font-bold text-foreground">Cryptographic Audit Integrity</h3>
            <p className="text-[11px] text-muted-foreground">
              Verify immutable hash chain (GET /applications/{applicationId}/audit/integrity)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Simulated Hash Chain Corruption Toggle */}
          <label className="flex items-center gap-1.5 text-[11px] text-muted-foreground cursor-pointer select-none">
            <input
              type="checkbox"
              checked={simulateCorrupted}
              onChange={(e) => setSimulateCorrupted(e.target.checked)}
              className="rounded border-border text-destructive focus:ring-destructive"
            />
            Corrupt Chain (Test Failure)
          </label>

          <button
            type="button"
            disabled={loading}
            onClick={handleVerifyIntegrity}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 shadow-sm"
          >
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
            {loading ? 'Walking Hash Chain...' : 'Verify Integrity'}
          </button>
        </div>
      </div>

      {/* Verification Result Display */}
      {result && (
        <div
          className={`p-4 rounded-xl border text-xs space-y-1.5 ${
            result.valid
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
              : 'bg-destructive/10 border-destructive/30 text-destructive'
          }`}
        >
          <div className="flex items-center gap-2 font-extrabold text-sm">
            {result.valid ? (
              <>
                <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <span>✓ Application history verified</span>
              </>
            ) : (
              <>
                <ShieldAlert className="h-5 w-5 text-destructive" />
                <span>✕ Application history could not be verified</span>
              </>
            )}
          </div>

          <p className="text-xs font-medium">
            {result.valid ? 'The recorded history has not been altered.' : result.message}
          </p>

          <div className="pt-2 border-t border-border/40 font-mono text-[10px] text-muted-foreground flex flex-wrap items-center justify-between gap-2">
            <span>Blocks Checked: {result.blockCount}</span>
            <span>Latest Hash: {result.latestHash}</span>
            <span>Verified At: {result.verifiedAt}</span>
          </div>
        </div>
      )}

      {/* Network Failure State */}
      {errorMsg && (
        <div className="p-3.5 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive text-xs flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};
