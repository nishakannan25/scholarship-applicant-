import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertOctagon, Sparkles, Check, HelpCircle, Clock, X, RefreshCw, AlertTriangle } from 'lucide-react';
import { useApplicationStore } from '../../applications/stores/useApplicationStore';
import { VeriFlowDecisionType } from '../types';

export const VeriFlowModal: React.FC = () => {
  const activeEvent = useApplicationStore((s) => s.activeVeriFlowEvent);
  const clearActiveEvent = useApplicationStore((s) => s.clearActiveVeriFlowEvent);
  const submitDecision = useApplicationStore((s) => s.submitVeriFlowDecision);

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'contest' | 'grace' | 'error'; message: string } | null>(null);
  const [simulateFail, setSimulateFail] = useState(false);

  if (!activeEvent) return null;

  const handleDecision = async (decision: VeriFlowDecisionType) => {
    setLoading(true);
    setFeedback(null);

    const res = await submitDecision(decision, simulateFail);
    setLoading(false);

    if (res.success) {
      if (decision === 'accept_new') {
        setFeedback({ type: 'success', message: 'Rule update accepted. Field unlocked and updated.' });
      } else if (decision === 'contest') {
        // Red indicator only for contested status
        setFeedback({ type: 'contest', message: 'Your concern has been flagged for review.' });
      } else {
        setFeedback({ type: 'grace', message: 'Your grace period request has been recorded.' });
      }

      setTimeout(() => {
        setFeedback(null);
        clearActiveEvent();
      }, 1600);
    } else {
      // FAILURE HANDLING: Do NOT unlock field. Keep current state. Show retry option.
      setFeedback({ type: 'error', message: res.message });
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-card border-2 border-amberNotice-500/80 rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 relative overflow-hidden"
        >
          {/* Top Amber Banner */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amberNotice-500 via-amber-500 to-amberNotice-600" />

          {/* Close Icon */}
          <button
            type="button"
            onClick={clearActiveEvent}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Modal Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amberNotice-600 dark:text-amberNotice-400 uppercase tracking-wider">
              <AlertOctagon className="h-4 w-4 animate-bounce" /> VeriFlow Rule Change Detected
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-foreground leading-tight">
              Something changed in this scholarship
            </h2>
            <p className="text-xs text-muted-foreground font-mono">
              Fact Snapshot: <span className="text-foreground font-bold">{activeEvent.factVersion}</span> • Updated: {activeEvent.timestamp}
            </p>
          </div>

          {/* AI Explanation Box */}
          <div className="bg-amberNotice-500/10 border border-amberNotice-500/30 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amberNotice-700 dark:text-amberNotice-300">
              <Sparkles className="h-4 w-4 text-amberNotice-500" />
              <span>What changed & Why this matters</span>
            </div>
            <p className="text-xs text-foreground leading-relaxed">
              {activeEvent.aiExplanation}
            </p>
          </div>

          {/* Simulated API Failure Toggle for Testing */}
          <div className="flex items-center justify-between text-[11px] text-muted-foreground bg-accent/30 p-2 rounded-lg border border-border">
            <span>Simulate API Failure (Testing):</span>
            <label className="flex items-center gap-1.5 font-semibold text-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={simulateFail}
                onChange={(e) => setSimulateFail(e.target.checked)}
                className="rounded border-border text-destructive focus:ring-destructive"
              />
              Fail Request
            </label>
          </div>

          {/* Feedback & Result Message */}
          {feedback && (
            <div
              className={`p-4 rounded-xl border text-center text-xs font-bold flex items-center justify-center gap-2 ${
                feedback.type === 'contest' || feedback.type === 'error'
                  ? 'bg-destructive/10 border-destructive/30 text-destructive'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {feedback.type === 'error' ? (
                <AlertTriangle className="h-4 w-4 shrink-0" />
              ) : (
                <Check className="h-4 w-4 shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}

          {/* Loading Indicator */}
          {loading && (
            <div className="p-4 text-center text-xs font-bold text-primary flex items-center justify-center gap-2">
              <RefreshCw className="h-4 w-4 animate-spin" /> Recording backend recovery decision & audit log...
            </div>
          )}

          {/* Three Required Options */}
          {!loading && !feedback && (
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-foreground block">
                Choose how you would like to proceed:
              </span>

              {/* Option 1: Accept the new value */}
              <button
                type="button"
                onClick={() => handleDecision('accept_new')}
                className="w-full p-3 rounded-xl border border-border hover:border-emerald-500 bg-background hover:bg-emerald-500/5 text-left transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                    <Check className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-foreground block">Accept the new value</span>
                    <span className="text-[11px] text-muted-foreground">Comply with updated rules and unlock field</span>
                  </div>
                </div>
              </button>

              {/* Option 2: Contest this / flag for review */}
              <button
                type="button"
                onClick={() => handleDecision('contest')}
                className="w-full p-3 rounded-xl border border-border hover:border-destructive bg-background hover:bg-destructive/5 text-left transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-destructive/10 text-destructive group-hover:bg-destructive group-hover:text-white transition-colors">
                    <HelpCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-destructive block">Contest this / flag for review</span>
                    <span className="text-[11px] text-muted-foreground">Flag concern for board manual review</span>
                  </div>
                </div>
              </button>

              {/* Option 3: Request a grace period */}
              <button
                type="button"
                onClick={() => handleDecision('request_grace_period')}
                className="w-full p-3 rounded-xl border border-border hover:border-primary bg-background hover:bg-primary/5 text-left transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-foreground block">Request a grace period</span>
                    <span className="text-[11px] text-muted-foreground">Request a 7-day extension for compliance</span>
                  </div>
                </div>
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
