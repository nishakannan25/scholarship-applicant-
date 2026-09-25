import React, { useState } from 'react';
import { isCommonPassword } from '../data/commonPasswords';
import { Eye, EyeOff, Check, X, ShieldAlert, Lock, CheckCircle2 } from 'lucide-react';

interface PasswordCreationProps {
  onComplete: () => void;
  applicationNumber: string;
}

export const PasswordCreation: React.FC<PasswordCreationProps> = ({ onComplete, applicationNumber }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Requirements breakdown
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const isNotCommon = password.length > 0 && !isCommonPassword(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const allValid = hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecial && isNotCommon && passwordsMatch;

  // Strength score
  const score = [hasMinLength, hasUppercase, hasLowercase, hasNumber, hasSpecial, isNotCommon].filter(Boolean).length;

  let strengthLabel = 'Weak';
  let strengthColor = 'bg-destructive';
  if (score >= 5) {
    strengthLabel = 'Strong';
    strengthColor = 'bg-emerald-500';
  } else if (score >= 3) {
    strengthLabel = 'Fair';
    strengthColor = 'bg-amberNotice-500';
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allValid) {
      if (isCommonPassword(password)) {
        setError('This password is too common. Please choose a stronger password.');
      } else if (!passwordsMatch) {
        setError('Passwords do not match');
      } else {
        setError('Please fulfill all password requirements');
      }
      return;
    }

    // Passwords are never logged or saved to persistent storage
    onComplete();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="border-b border-border pb-4 mb-4">
        <div className="flex items-center justify-between text-xs font-semibold text-primary uppercase tracking-wider mb-1">
          <span>Step 3 of 3</span>
          <span>Security & Password</span>
        </div>
        <h2 className="text-2xl font-bold text-foreground">Set Account Password</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Create a secure password to protect your ScholarPath applicant profile.
        </p>
      </div>

      {/* Display Permanent Application Number */}
      <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Permanent Login ID</span>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold font-mono text-primary">{applicationNumber}</span>
          <span className="text-xs text-muted-foreground bg-primary/10 text-primary px-2.5 py-1 rounded-md">Official</span>
        </div>
      </div>

      {/* Password Fields */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            New Password <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
              <Lock className="h-4 w-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              placeholder="Enter secure password"
              className="w-full pl-10 pr-10 py-2.5 bg-background border border-input rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Confirm Password <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
              <Lock className="h-4 w-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError(null);
              }}
              placeholder="Confirm password"
              className="w-full pl-10 pr-10 py-2.5 bg-background border border-input rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>

      {/* Strength Indicator */}
      {password.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground font-medium">Password Strength:</span>
            <span className="font-semibold text-foreground">{strengthLabel}</span>
          </div>
          <div className="h-2 w-full bg-accent rounded-full overflow-hidden flex gap-1">
            <div className={`h-full flex-1 transition-all ${score >= 1 ? strengthColor : 'bg-muted'}`} />
            <div className={`h-full flex-1 transition-all ${score >= 3 ? strengthColor : 'bg-muted'}`} />
            <div className={`h-full flex-1 transition-all ${score >= 5 ? strengthColor : 'bg-muted'}`} />
          </div>
        </div>
      )}

      {/* Live Requirements Checklist */}
      <div className="p-4 rounded-xl bg-accent/40 border border-border space-y-2 text-xs">
        <span className="font-semibold text-foreground block mb-2">Password Requirements:</span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className={`flex items-center gap-2 ${hasMinLength ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-muted-foreground'}`}>
            {hasMinLength ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
            At least 8 characters
          </div>
          <div className={`flex items-center gap-2 ${hasUppercase ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-muted-foreground'}`}>
            {hasUppercase ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
            One uppercase letter (A-Z)
          </div>
          <div className={`flex items-center gap-2 ${hasLowercase ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-muted-foreground'}`}>
            {hasLowercase ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
            One lowercase letter (a-z)
          </div>
          <div className={`flex items-center gap-2 ${hasNumber ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-muted-foreground'}`}>
            {hasNumber ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
            One number (0-9)
          </div>
          <div className={`flex items-center gap-2 ${hasSpecial ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-muted-foreground'}`}>
            {hasSpecial ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
            One special character (!@#$)
          </div>
          <div className={`flex items-center gap-2 ${isNotCommon ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-muted-foreground'}`}>
            {isNotCommon ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
            Not a common password
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-xs font-medium border border-destructive/20">
          <ShieldAlert className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Complete Button */}
      <button
        type="submit"
        disabled={!allValid}
        className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-xl shadow-md hover:bg-primary/90 disabled:opacity-50 transition-all text-sm flex items-center justify-center gap-2"
      >
        <CheckCircle2 className="h-4 w-4" />
        Complete Account Registration
      </button>
    </form>
  );
};
