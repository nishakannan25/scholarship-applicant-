import React from 'react';
import { motion } from 'framer-motion';
import { Lock, AlertTriangle } from 'lucide-react';
import { useApplicationStore } from '../../applications/stores/useApplicationStore';

interface FieldLockWrapperProps {
  fieldKey: string;
  children: React.ReactNode;
}

export const FieldLockWrapper: React.FC<FieldLockWrapperProps> = ({ fieldKey, children }) => {
  const lockedFields = useApplicationStore((s) => s.lockedFields);
  const lockInfo = lockedFields[fieldKey];

  if (!lockInfo) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ scale: 0.98, opacity: 0.8 }}
      animate={{ scale: 1, opacity: 1 }}
      className="relative rounded-xl border-2 border-amberNotice-500/60 bg-amberNotice-500/5 p-3.5 space-y-2 overflow-hidden shadow-sm"
    >
      {/* Framer Motion Subtle Amber Ripple Effect */}
      <motion.div
        animate={{
          scale: [1, 1.02, 1],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute inset-0 bg-amberNotice-500/10 pointer-events-none rounded-xl"
      />

      {/* VeriFlow Locked Header Badge */}
      <div className="flex items-center justify-between text-xs font-bold text-amberNotice-600 dark:text-amberNotice-400">
        <div className="flex items-center gap-1.5">
          <Lock className="h-4 w-4 animate-pulse" />
          <span>VeriFlow Field Locked</span>
        </div>
        <span className="text-[10px] font-mono bg-amberNotice-500/20 px-2 py-0.5 rounded uppercase">
          Locked Rule
        </span>
      </div>

      {/* Dimmed & Disabled Field Container */}
      <div className="opacity-75 pointer-events-none filter grayscale-[30%]">
        {children}
      </div>

      {/* Lock Reason Explanation */}
      <div className="flex items-start gap-2 pt-1 border-t border-amberNotice-500/20 text-[11px] text-amberNotice-700 dark:text-amberNotice-300">
        <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
        <span>{lockInfo.reason}</span>
      </div>
    </motion.div>
  );
};
