import React, { useState } from 'react';
import { ShieldCheck, RefreshCw } from 'lucide-react';

interface CaptchaChallengeProps {
  onVerify: (isValid: boolean) => void;
}

export const CaptchaChallenge: React.FC<CaptchaChallengeProps> = ({ onVerify }) => {
  // Simple development/test CAPTCHA provider simulation
  const [captchaText, setCaptchaText] = useState('8K2P');
  const [userInput, setUserInput] = useState('');
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(result);
    setUserInput('');
    setVerified(false);
    setError(false);
    onVerify(false);
  };

  const handleCheck = (val: string) => {
    setUserInput(val);
    if (val.toUpperCase().trim() === captchaText) {
      setVerified(true);
      setError(false);
      onVerify(true);
    } else {
      setVerified(false);
      if (val.length >= 4) {
        setError(true);
        onVerify(false);
      }
    }
  };

  return (
    <div className="p-4 rounded-xl bg-accent/30 border border-border space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-primary" /> Security Verification Required
        </label>
        <button
          type="button"
          onClick={generateCaptcha}
          className="text-xs text-primary hover:underline flex items-center gap-1"
        >
          <RefreshCw className="h-3 w-3" /> Refresh Code
        </button>
      </div>

      <div className="flex items-center gap-3">
        {/* CAPTCHA Visual Box */}
        <div className="px-4 py-2.5 bg-muted rounded-lg font-mono text-xl font-bold tracking-widest text-primary border border-primary/20 select-none shadow-inner bg-gradient-to-r from-primary/10 via-accent to-primary/5">
          {captchaText}
        </div>

        <input
          type="text"
          value={userInput}
          maxLength={4}
          onChange={(e) => handleCheck(e.target.value)}
          placeholder="Enter code"
          className="flex-1 px-3 py-2 bg-background border border-input rounded-lg text-sm text-foreground uppercase placeholder:normal-case focus:outline-none focus:ring-2 focus:ring-primary font-mono tracking-wider"
        />
      </div>

      {verified && (
        <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
          ✓ CAPTCHA verified successfully.
        </p>
      )}

      {error && (
        <p className="text-xs font-medium text-destructive">
          Incorrect security code. Please try again.
        </p>
      )}
    </div>
  );
};
